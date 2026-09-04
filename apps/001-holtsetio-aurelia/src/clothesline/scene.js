import * as THREE from "three/webgpu";
import {
  Fn,
  If,
  attribute,
  clamp,
  float,
  instanceIndex,
  instancedArray,
  mix,
  mrt,
  output,
  pass,
  positionLocal,
  sin,
  uniform,
  vec3,
  vec4,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { VerletPhysics } from "@aurelia-upstream/physics/verletPhysics.js";
import { SpringVisualizer } from "@aurelia-upstream/physics/springVisualizer.js";

const TAU = Math.PI * 2;
const GUST_SLOTS = 6;
const ASSET_ROOT = "/assets/clothesline";

function seeded(index) {
  const value = Math.sin(index * 83.17 + 29.41) * 43758.5453;
  return value - Math.floor(value);
}

function formatCount(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value);
}

class WindLoadBridge {
  constructor(physics) {
    this.physics = physics;
    this.uniforms = {
      elapsed: uniform(0),
      windStrength: uniform(0.34),
      load: uniform(1),
      windDirection: uniform(new THREE.Vector3(0.92, 0.05, 0.38)),
      pointerWave: uniform(new THREE.Vector4(99, 99, 0, 1.8)),
      pointerDirection: uniform(new THREE.Vector3(1, 0, 0)),
    };
    this.gusts = Array.from({ length: GUST_SLOTS }, () => ({
      wave: uniform(new THREE.Vector4(99, 9, 0, 0)),
      direction: uniform(new THREE.Vector3(1, 0.12, 0)),
    }));
    this.resetRequested = false;
  }

  async bake() {
    const metadata = new Float32Array(this.physics.vertexCount * 4);
    const mass = new Float32Array(this.physics.vertexCount);
    const motion = new Float32Array(this.physics.vertexCount * 2);
    this.physics.vertices.forEach((vertex) => {
      const meta = vertex.windMeta ?? { kind: 0, mass: 0 };
      metadata.set([vertex.value.x, vertex.value.y, vertex.value.z, meta.kind], vertex.id * 4);
      mass[vertex.id] = meta.mass;
      motion.set([meta.flex ?? 0, meta.phase ?? 0], vertex.id * 2);
    });
    this.metadata = instancedArray(metadata, "vec4");
    this.massData = instancedArray(mass, "float");
    this.motionData = instancedArray(motion, "vec2");

    this.forceKernel = Fn(() => {
      const meta = this.metadata.element(instanceIndex);
      const massFactor = this.massData.element(instanceIndex);
      const motionFactor = this.motionData.element(instanceIndex);
      const position = this.physics.positionData.element(instanceIndex).toVar();
      const force = this.physics.forceData.element(instanceIndex).toVar();
      const movable = position.w;
      const clothness = clamp(meta.w.sub(1), 0, 1);
      const ropeGravity = float(-0.00000004).mul(this.uniforms.load);
      const clothGravity = float(-0.00000029).mul(massFactor).mul(this.uniforms.load);
      const gravity = mix(ropeGravity, clothGravity, clothness);
      const flutter = sin(this.uniforms.elapsed.mul(1.74).add(meta.x.mul(0.91)).add(meta.y.mul(1.13)))
        .mul(0.5).add(0.88);
      const crossFlutter = sin(this.uniforms.elapsed.mul(2.37).sub(meta.y.mul(1.82)).add(meta.x.mul(0.41)));
      const broadSway = sin(this.uniforms.elapsed.mul(0.86).add(meta.y.mul(0.36)).sub(meta.x.mul(0.19)));
      const exposure = float(0.16).add(clothness.mul(0.84));
      const mobility = clamp(float(1.58).sub(massFactor.mul(0.34)), 0.72, 1.38);
      const baseWind = this.uniforms.windDirection
        .mul(this.uniforms.windStrength)
        .mul(exposure)
        .mul(flutter)
        .mul(mix(float(1), mobility, clothness))
        .mul(0.00000078);
      const visibleFlutter = vec3(
        crossFlutter.add(broadSway.mul(0.68)).mul(clothness).mul(this.uniforms.windStrength).mul(0.00000028),
        crossFlutter.mul(0.72).add(broadSway).mul(clothness).mul(this.uniforms.windStrength).mul(0.00000024),
        crossFlutter.sub(broadSway.mul(0.42)).mul(clothness).mul(this.uniforms.windStrength).mul(0.00000072),
      );
      const edgeSway = sin(this.uniforms.elapsed.mul(1.58).add(motionFactor.y).add(meta.y.mul(0.14)));
      const hemRipple = sin(this.uniforms.elapsed.mul(3.76).add(motionFactor.y.mul(1.63)).add(meta.x.mul(0.72)));
      const freeEdge = motionFactor.x.mul(motionFactor.x).mul(clothness);
      const pressurePulse = edgeSway.mul(0.32).add(0.68).add(hemRipple.mul(0.08));
      const directionalSway = this.uniforms.windDirection
        .mul(pressurePulse).mul(freeEdge).mul(this.uniforms.windStrength).mul(0.0000054);
      const silhouetteRipple = vec3(
        hemRipple.mul(freeEdge).mul(this.uniforms.windStrength).mul(0.00000072),
        hemRipple.mul(freeEdge).mul(this.uniforms.windStrength).mul(0.00000125),
        hemRipple.mul(freeEdge).mul(this.uniforms.windStrength).mul(0.0000011),
      );
      force.addAssign(baseWind.add(visibleFlutter).add(directionalSway).add(silhouetteRipple).add(vec3(0, gravity, 0)).mul(movable));

      const pointerDistance = meta.xy.sub(this.uniforms.pointerWave.xy).length();
      const pointerReach = this.uniforms.pointerWave.w.max(0.2);
      const pointerFalloff = clamp(float(1).sub(pointerDistance.div(pointerReach)), 0, 1).toVar();
      pointerFalloff.mulAssign(pointerFalloff);
      const pointerPower = pointerFalloff.mul(this.uniforms.pointerWave.z)
        .mul(float(0.18).add(clothness.mul(0.82))).mul(0.00000172);
      const pointerFlutter = vec3(
        broadSway.mul(pointerPower).mul(0.22),
        crossFlutter.mul(pointerPower).mul(0.18),
        crossFlutter.mul(pointerPower).mul(0.34),
      );
      force.addAssign(this.uniforms.pointerDirection.mul(pointerPower).add(pointerFlutter).mul(movable));

      this.gusts.forEach(({ wave, direction }) => {
        const distance = meta.x.sub(wave.x).abs();
        const age = wave.y;
        const envelope = clamp(float(1).sub(age.div(1.75)), 0, 1);
        const front = age.mul(4.25);
        const waveBand = clamp(float(1).sub(distance.sub(front).abs().div(0.72)), 0, 1);
        const localPush = clamp(float(1).sub(distance.div(float(1.2).add(age.mul(1.25)))), 0, 1)
          .mul(clamp(float(1).sub(age.div(0.55)), 0, 1));
        const gustPower = waveBand.mul(0.82).add(localPush).mul(wave.z).mul(envelope)
          .mul(float(0.22).add(clothness.mul(0.78))).mul(0.00000115);
        force.addAssign(direction.mul(gustPower).add(vec3(0, wave.w.mul(gustPower).mul(0.42), 0)).mul(movable));
      });

      const speed = force.length().max(0.0000001);
      force.mulAssign(clamp(float(0.00022).div(speed), 0, 1));

      If(position.y.lessThan(-2.18), () => {
        position.y.assign(-2.18);
        force.y.assign(force.y.abs().mul(0.12));
        force.x.mulAssign(0.82);
        force.z.mulAssign(0.82);
      });

      const base = meta.xyz;
      const offset = position.xyz.sub(base).toVar();
      const displacement = offset.length().max(0.00001);
      const budget = float(0.92).add(clothness.mul(2.45));
      position.xyz.assign(base.add(offset.mul(clamp(budget.div(displacement), 0, 1))));
      this.physics.positionData.element(instanceIndex).xyz.assign(position.xyz);
      this.physics.forceData.element(instanceIndex).assign(force);
    })().compute(this.physics.vertexCount);

    this.resetKernel = Fn(() => {
      const meta = this.metadata.element(instanceIndex);
      this.physics.positionData.element(instanceIndex).xyz.assign(meta.xyz);
      this.physics.forceData.element(instanceIndex).assign(vec3(0));
    })().compute(this.physics.vertexCount);
  }

  setState({ elapsed, windStrength, load, windDirection, gusts, pointerForce }) {
    this.uniforms.elapsed.value = elapsed;
    this.uniforms.windStrength.value = windStrength;
    this.uniforms.load.value = load;
    this.uniforms.windDirection.value.copy(windDirection);
    this.uniforms.pointerWave.value.set(pointerForce.x, pointerForce.y, pointerForce.strength, pointerForce.radius);
    this.uniforms.pointerDirection.value.copy(pointerForce.direction);
    gusts.forEach((gust, index) => {
      this.gusts[index].wave.value.set(gust.x, gust.age, gust.strength, gust.lift);
      this.gusts[index].direction.value.copy(gust.direction);
    });
  }

  async update() {
    if (this.resetRequested) {
      this.resetRequested = false;
      await this.physics.renderer.computeAsync(this.resetKernel);
    }
    await this.physics.renderer.computeAsync(this.forceKernel);
  }

  requestReset() {
    this.resetRequested = true;
  }
}

export class WindlineScene {
  constructor(container, {
    reducedMotion = false,
    onMetrics = () => {},
    onGust = () => {},
  } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.onMetrics = onMetrics;
    this.onGust = onGust;
    this.quality = (container.clientWidth || window.innerWidth) < 768 ? 0.62 : 1;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.hitPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.16);
    this.hitPoint = new THREE.Vector3();
    this.windStrength = 0.34;
    this.loadFactor = 1;
    this.dampingFactor = 0.64;
    this.windAngle = 0.39;
    this.windDirection = new THREE.Vector3(Math.cos(this.windAngle), 0.05, Math.sin(this.windAngle));
    this.visualWindTime = uniform(0);
    this.visualWindStrength = uniform(this.windStrength);
    this.visualWindDirection = uniform(this.windDirection.clone());
    this.gustSlots = Array.from({ length: GUST_SLOTS }, () => ({
      x: 99,
      y: 0,
      age: 9,
      strength: 0,
      lift: 0,
      direction: new THREE.Vector3(1, 0.1, 0),
    }));
    this.gustCursor = 0;
    this.gustCount = 0;
    this.causalAge = Number.POSITIVE_INFINITY;
    this.lastAutoGustAt = -10;
    this.lastMetricsAt = -1;
    this.frameTimeEma = 0;
    this.frameCount = 0;
    this.structureVisible = false;
    this.disposables = [];
    this.dummy = new THREE.Object3D();
    this.axisY = new THREE.Vector3(0, 1, 0);
    this.tempDirection = new THREE.Vector3();
    this.tempRight = new THREE.Vector3();
    this.tempUp = new THREE.Vector3();
    this.pointerAnchor = new THREE.Vector3();
    this.pointerLastPoint = new THREE.Vector3();
    this.pointerForce = {
      x: 99,
      y: 99,
      strength: 0,
      radius: 1.8,
      direction: new THREE.Vector3(1, 0, 0),
    };
    this.pointerPressed = false;
    this.pointerDragging = false;
    this.cameraYaw = 0;
    this.cameraPitch = 0;
    this.cameraYawTarget = 0;
    this.cameraPitchTarget = 0;
    this.cameraDragStartYaw = 0;
    this.cameraDragStartPitch = 0;
    this.authoredAssetReady = false;
  }

  async init(onProgress = () => {}) {
    globalThis.__AURELIA_LAB_CONFIG__ = {
      ...(globalThis.__AURELIA_LAB_CONFIG__ ?? {}),
      stepsPerSecond: this.quality < 1 ? 90 : 144,
    };

    const viewport = this.getViewportSize();
    this.renderer = new THREE.WebGPURenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality < 1 ? 0.72 : 0.88));
    this.renderer.setSize(viewport.width, viewport.height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.16;
    await this.renderer.init();
    if (!this.renderer.backend?.isWebGPUBackend) throw new Error("没有可用的 WebGPU 后端");
    this.renderer.domElement.setAttribute("aria-label", "可拖动施加阵风的 Aurelia WebGPU 晾衣绳场景");
    this.container.prepend(this.renderer.domElement);
    onProgress(0.12, "建立 WebGPU 黄昏风场");

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x091321);
    this.scene.fog = new THREE.FogExp2(0x091321, 0.021);
    this.camera = new THREE.PerspectiveCamera(43, viewport.width / viewport.height, 0.08, 90);
    this.applyCameraPosition();

    this.scene.add(new THREE.HemisphereLight(0xccefff, 0x160d20, 1.65));
    const dusk = new THREE.DirectionalLight(0xffc27b, 4.6);
    dusk.position.set(-7, 8, 7);
    const cyan = new THREE.PointLight(0x63f4ea, 68, 28, 2);
    cyan.position.set(6, 1.5, 5);
    const red = new THREE.PointLight(0xff5f73, 42, 20, 2);
    red.position.set(-3.5, -0.5, 3);
    const violet = new THREE.PointLight(0x826dff, 34, 22, 2);
    violet.position.set(1, 4, -2);
    this.scene.add(dusk, cyan, red, violet);

    this.createEnvironment();
    onProgress(0.2, "加载 CC0 服装模型与实拍织物 PBR");
    await this.loadAuthoredAssets();
    onProgress(0.3, "搭建城市屋顶与固定端");

    this.physics = new VerletPhysics(this.renderer);
    this.bridge = new WindLoadBridge(this.physics);
    this.physics.addObject(this.bridge);
    const dummyVertex = this.physics.addVertex(new THREE.Vector3(100, 100, 100), true);
    dummyVertex.windMeta = { kind: 0, mass: 0 };
    this.buildTopology();
    onProgress(0.52, "把真实服装资产绑定到负重拓扑");
    await this.physics.bake();
    this.physics.uniforms.dampening.value = 0.965;
    this.physics.setMouseRay(new THREE.Vector3(500, 500, 500), new THREE.Vector3(1, 0, 0));
    onProgress(0.66, "编译 Aurelia GPU 求解器");

    this.createRope();
    this.garments.forEach((garment) => {
      if (garment.id !== "coat" || !this.authoredAssetReady) this.createGarmentSurface(garment);
    });
    if (this.authoredAssetReady) this.placeAuthoredGarment();
    this.createClothespins();
    this.createStructureLayer();
    this.createWindField();
    this.createAirflowRibbons();
    this.createGustVfx();
    this.createReticle();
    this.setupPostProcessing();
    this.resize();
    onProgress(1, "风中的晾衣绳已就绪");
  }

  async loadAuthoredAssets() {
    const textureLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();
    try {
      const [
        denimColor,
        denimNormal,
        denimRoughness,
        terlenkaColor,
        terlenkaNormal,
        terlenkaRoughness,
        authoredShirt,
      ] = await Promise.all([
        textureLoader.loadAsync(`${ASSET_ROOT}/denim_diff_1k.jpg`),
        textureLoader.loadAsync(`${ASSET_ROOT}/denim_nor_gl_1k.jpg`),
        textureLoader.loadAsync(`${ASSET_ROOT}/denim_rough_1k.jpg`),
        textureLoader.loadAsync(`${ASSET_ROOT}/terlenka_diff_1k.jpg`),
        textureLoader.loadAsync(`${ASSET_ROOT}/terlenka_nor_gl_1k.jpg`),
        textureLoader.loadAsync(`${ASSET_ROOT}/terlenka_rough_1k.jpg`),
        gltfLoader.loadAsync(`${ASSET_ROOT}/smithsonian-feedsack-dress.glb`),
      ]);

      const configureTexture = (texture, { color = false, repeat = [4, 6] } = {}) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(...repeat);
        texture.anisotropy = Math.min(8, this.renderer.capabilities?.getMaxAnisotropy?.() ?? 4);
        if (color) texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        this.disposables.push(texture);
        return texture;
      };

      this.fabricAssets = {
        denim: {
          map: configureTexture(denimColor, { color: true, repeat: [3.2, 5.2] }),
          normalMap: configureTexture(denimNormal, { repeat: [3.2, 5.2] }),
          roughnessMap: configureTexture(denimRoughness, { repeat: [3.2, 5.2] }),
        },
        terlenka: {
          map: configureTexture(terlenkaColor, { color: true, repeat: [4.5, 7] }),
          normalMap: configureTexture(terlenkaNormal, { repeat: [4.5, 7] }),
          roughnessMap: configureTexture(terlenkaRoughness, { repeat: [4.5, 7] }),
        },
      };
      this.authoredGarment = authoredShirt.scene;
      this.authoredGarment.traverse((object) => {
        if (!object.isMesh) return;
        object.frustumCulled = false;
        object.material = object.material.clone();
        object.material.side = THREE.DoubleSide;
        object.material.roughness = Math.min(object.material.roughness ?? 0.72, 0.68);
        object.material.metalness = object.material.metalness ?? 0.08;
        object.material.envMapIntensity = 1.3;
        this.disposables.push(object.material);
      });
      this.authoredAssetReady = true;
    } catch (error) {
      console.warn("CC0 authored garment assets failed to load; using the physics proxy.", error);
      this.fabricAssets = null;
      this.authoredGarment = null;
      this.authoredAssetReady = false;
    }
  }

  placeAuthoredGarment() {
    this.authoredGarment.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(this.authoredGarment);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const targetHeight = this.quality < 1 ? 3.2 : 3.72;
    const scale = targetHeight / Math.max(size.y, 0.0001);
    const anchor = this.lineBaseAt(0.52);
    const garment = this.garments.find(({ id }) => id === "coat");
    const { rows, cols, grid } = garment;
    const sourcePosition = new THREE.Vector3();
    const desiredPosition = new THREE.Vector3();
    const basePosition = new THREE.Vector3();
    this.authoredRoot = new THREE.Group();
    this.authoredMeshes = [];

    this.authoredGarment.traverse((sourceMesh) => {
      if (!sourceMesh.isMesh) return;
      const geometry = sourceMesh.geometry.clone();
      geometry.applyMatrix4(sourceMesh.matrixWorld);
      const sourcePositions = geometry.getAttribute("position");
      const physicsIds = new Uint32Array(sourcePositions.count * 4);
      const physicsWeights = new Float32Array(sourcePositions.count * 4);
      const authoredOffsets = new Float32Array(sourcePositions.count * 3);
      const worldPositions = new Float32Array(sourcePositions.count * 3);
      const windUv = new Float32Array(sourcePositions.count * 2);

      for (let index = 0; index < sourcePositions.count; index += 1) {
        sourcePosition.fromBufferAttribute(sourcePositions, index);
        const u = THREE.MathUtils.clamp((sourcePosition.x - bounds.min.x) / Math.max(size.x, 0.0001), 0, 1);
        const v = THREE.MathUtils.clamp((bounds.max.y - sourcePosition.y) / Math.max(size.y, 0.0001), 0, 1);
        windUv.set([u, v], index * 2);
        const column = u * (cols - 1);
        const row = v * (rows - 1);
        const c0 = Math.floor(column);
        const c1 = Math.min(cols - 1, c0 + 1);
        const r0 = Math.floor(row);
        const r1 = Math.min(rows - 1, r0 + 1);
        const tx = column - c0;
        const ty = row - r0;
        const weights = [
          (1 - tx) * (1 - ty),
          tx * (1 - ty),
          (1 - tx) * ty,
          tx * ty,
        ];
        const nodes = [grid[r0][c0], grid[r0][c1], grid[r1][c0], grid[r1][c1]];
        physicsIds.set(nodes.map((node) => node.id), index * 4);
        physicsWeights.set(weights, index * 4);

        desiredPosition.set(
          anchor.x + (sourcePosition.x - center.x) * scale,
          anchor.y - 0.06 - (bounds.max.y - sourcePosition.y) * scale,
          anchor.z + 0.22 + (sourcePosition.z - center.z) * scale,
        );
        basePosition.set(0, 0, 0);
        nodes.forEach((node, nodeIndex) => basePosition.addScaledVector(node.value, weights[nodeIndex]));
        authoredOffsets.set([
          desiredPosition.x - basePosition.x,
          desiredPosition.y - basePosition.y,
          desiredPosition.z - basePosition.z,
        ], index * 3);
        worldPositions.set(desiredPosition.toArray(), index * 3);
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(worldPositions, 3));
      geometry.setAttribute("physicsIds", new THREE.BufferAttribute(physicsIds, 4));
      geometry.setAttribute("physicsWeights", new THREE.BufferAttribute(physicsWeights, 4));
      geometry.setAttribute("authoredOffset", new THREE.BufferAttribute(authoredOffsets, 3));
      geometry.setAttribute("windUv", new THREE.BufferAttribute(windUv, 2));
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      const sourceMaterial = sourceMesh.material;
      const material = new THREE.MeshPhysicalNodeMaterial({
        color: sourceMaterial.color?.clone() ?? new THREE.Color(0xffffff),
        map: sourceMaterial.map ?? null,
        normalMap: sourceMaterial.normalMap ?? null,
        roughnessMap: sourceMaterial.roughnessMap ?? null,
        metalnessMap: sourceMaterial.metalnessMap ?? null,
        aoMap: sourceMaterial.aoMap ?? null,
        emissiveMap: sourceMaterial.emissiveMap ?? null,
        emissive: sourceMaterial.emissive?.clone() ?? new THREE.Color(0x000000),
        roughness: sourceMaterial.roughness ?? 0.72,
        metalness: sourceMaterial.metalness ?? 0,
        side: THREE.DoubleSide,
      });
      material.positionNode = Fn(() => {
        const ids = attribute("physicsIds");
        const weights = attribute("physicsWeights");
        const p0 = this.physics.positionData.element(ids.x).xyz.mul(weights.x);
        const p1 = this.physics.positionData.element(ids.y).xyz.mul(weights.y);
        const p2 = this.physics.positionData.element(ids.z).xyz.mul(weights.z);
        const p3 = this.physics.positionData.element(ids.w).xyz.mul(weights.w);
        const windOffset = this.visualClothOffset(attribute("windUv"), 2.18);
        return p0.add(p1).add(p2).add(p3).add(attribute("authoredOffset")).add(windOffset);
      })();
      material.mrtNode = mrt({ bloomIntensity: vec4(0.006, 0, 0, 1) });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      mesh.renderOrder = 12;
      this.authoredRoot.add(mesh);
      this.authoredMeshes.push(mesh);
      this.disposables.push(geometry, material);
    });
    this.scene.add(this.authoredRoot);
  }

  lineBaseAt(t) {
    return new THREE.Vector3(
      -6.65 + t * 13.3,
      2.9 - t * 0.58 - Math.sin(t * Math.PI) * 0.24,
      -1.18 + t * 2.36 + Math.sin(t * Math.PI) * 0.16,
    );
  }

  buildTopology() {
    const segments = this.quality < 1 ? 32 : 44;
    this.ropeNodes = [];
    for (let index = 0; index <= segments; index += 1) {
      const t = index / segments;
      const vertex = this.physics.addVertex(this.lineBaseAt(t), index === 0 || index === segments);
      vertex.windMeta = { kind: 1, mass: 0.34 };
      this.ropeNodes.push(vertex);
      if (index > 0) this.physics.addSpring(this.ropeNodes[index - 1], vertex, 0.00128);
      if (index > 1) this.physics.addSpring(this.ropeNodes[index - 2], vertex, 0.00018);
    }

    const configs = this.quality < 1 ? [
      { id: "scarf", start: 0.14, end: 0.34, cols: 8, rows: 9, width: 2.75, height: 1.85, mass: 0.62, fold: 0.42, colors: [0x4fe2d7, 0x133a61], seam: 0xe9fff9 },
      { id: "coat", start: 0.44, end: 0.60, cols: 9, rows: 14, width: 1.75, height: 3.2, mass: 1.42, fold: 0.22, colors: [0xff765f, 0x71275a], seam: 0xffd993 },
      { id: "panel", start: 0.74, end: 0.86, cols: 7, rows: 12, width: 1.75, height: 3.35, mass: 0.9, fold: 0.5, colors: [0xd7ef72, 0x235b62], seam: 0xf4ffb0 },
    ] : [
      { id: "scarf", start: 0.13, end: 0.34, cols: 11, rows: 12, width: 3.0, height: 2.05, mass: 0.62, fold: 0.46, colors: [0x4fe2d7, 0x133a61], seam: 0xe9fff9 },
      { id: "coat", start: 0.44, end: 0.60, cols: 13, rows: 20, width: 1.85, height: 3.72, mass: 1.42, fold: 0.24, colors: [0xff765f, 0x71275a], seam: 0xffd993 },
      { id: "panel", start: 0.74, end: 0.87, cols: 9, rows: 17, width: 1.85, height: 3.6, mass: 0.9, fold: 0.54, colors: [0xd7ef72, 0x235b62], seam: 0xf4ffb0 },
    ];
    this.garments = configs.map((config) => this.buildGarment(config));
  }

  buildGarment(config) {
    const grid = Array.from({ length: config.rows }, () => []);
    const attachments = [];
    const garmentPhase = config.id === "coat" ? 2.18 : config.id === "panel" ? 4.32 : 0.34;
    for (let row = 0; row < config.rows; row += 1) {
      const v = row / (config.rows - 1);
      const widthProfile = config.id === "coat"
        ? 0.72 + v * 0.16 + Math.sin(v * Math.PI) * 0.07
        : config.id === "panel"
          ? 0.72 + (1 - v) * 0.2
          : 1 - v * 0.22;
      for (let col = 0; col < config.cols; col += 1) {
        const u = col / (config.cols - 1);
        const lineT = THREE.MathUtils.lerp(config.start, config.end, u);
        const top = this.lineBaseAt(lineT);
        const centerX = this.lineBaseAt((config.start + config.end) * 0.5).x;
        const x = centerX + (u - 0.5) * config.width * widthProfile;
        const hem = row === config.rows - 1
          ? Math.sin(u * Math.PI * (config.id === "panel" ? 2 : 3)) * (config.id === "panel" ? 0.22 : 0.13)
          : 0;
        const foldPhase = config.id === "coat" ? 0.7 : config.id === "panel" ? 1.8 : 0;
        const z = top.z
          + Math.sin(u * Math.PI * (config.id === "panel" ? 3 : 4) + foldPhase) * config.fold * (0.18 + v * 0.82)
          + Math.sin(v * Math.PI * 1.35 + foldPhase) * config.fold * 0.22;
        const vertex = this.physics.addVertex(new THREE.Vector3(x, top.y - v * config.height + hem, z));
        vertex.windMeta = {
          kind: 2,
          mass: config.mass * (0.74 + v * 0.48),
          flex: 0.12 + v * 0.88,
          phase: garmentPhase + u * 0.72,
        };
        grid[row].push(vertex);

        if (col > 0) this.physics.addSpring(grid[row][col - 1], vertex, 0.00092);
        if (row > 0) this.physics.addSpring(grid[row - 1][col], vertex, 0.00108);
        if (row > 0 && col > 0) this.physics.addSpring(grid[row - 1][col - 1], vertex, 0.00022);
        if (row > 0 && col < config.cols - 1) this.physics.addSpring(grid[row - 1][col + 1], vertex, 0.00022);
        if (col > 1) this.physics.addSpring(grid[row][col - 2], vertex, 0.0001);
        if (row > 1) this.physics.addSpring(grid[row - 2][col], vertex, 0.00012);

        if (row === 0) {
          const ropeIndex = Math.round(lineT * (this.ropeNodes.length - 1));
          const ropeVertex = this.ropeNodes[ropeIndex];
          this.physics.addSpring(ropeVertex, vertex, 0.0032, 0.08);
          attachments.push(ropeVertex);
        }
      }
    }
    return { ...config, grid, attachments };
  }

  createRope() {
    const positions = new Float32Array(this.ropeNodes.length * 3);
    const ids = new Uint32Array(this.ropeNodes.length);
    this.ropeNodes.forEach((node, index) => { ids[index] = node.id; });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("physicsId", new THREE.BufferAttribute(ids, 1));
    const material = new THREE.LineBasicNodeMaterial({ color: 0xffd49a, transparent: true, opacity: 0.95 });
    material.positionNode = Fn(() => this.physics.positionData.element(attribute("physicsId")).xyz)();
    material.mrtNode = mrt({ bloomIntensity: vec4(0.16, 0, 0, 1) });
    this.rope = new THREE.Line(geometry, material);
    this.rope.frustumCulled = false;
    this.rope.renderOrder = 16;
    this.scene.add(this.rope);
    this.disposables.push(geometry, material);
  }

  createGarmentSurface(garment) {
    const { rows, cols, grid } = garment;
    const count = rows * cols;
    const positions = new Float32Array(count * 3);
    const ids = new Uint32Array(count);
    const neighbors = new Uint32Array(count * 4);
    const uvs = new Float32Array(count * 2);
    const indices = [];
    const at = (row, col) => row * cols + col;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const index = at(row, col);
        const vertex = grid[row][col];
        positions.set([vertex.value.x, vertex.value.y, vertex.value.z], index * 3);
        ids[index] = vertex.id;
        neighbors.set([
          grid[row][Math.max(0, col - 1)].id,
          grid[row][Math.min(cols - 1, col + 1)].id,
          grid[Math.max(0, row - 1)][col].id,
          grid[Math.min(rows - 1, row + 1)][col].id,
        ], index * 4);
        uvs.set([col / (cols - 1), 1 - row / (rows - 1)], index * 2);
      }
    }
    for (let row = 0; row < rows - 1; row += 1) {
      for (let col = 0; col < cols - 1; col += 1) {
        const a = at(row, col);
        const b = at(row, col + 1);
        const c = at(row + 1, col);
        const d = at(row + 1, col + 1);
        if ((row + col) % 2) indices.push(a, c, b, b, c, d);
        else indices.push(a, c, d, a, d, b);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("physicsId", new THREE.BufferAttribute(ids, 1));
    geometry.setAttribute("neighborIds", new THREE.BufferAttribute(neighbors, 4));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const pbr = garment.id === "panel" ? this.fabricAssets?.denim : this.fabricAssets?.terlenka;
    const material = new THREE.MeshPhysicalNodeMaterial({
      side: THREE.DoubleSide,
      color: garment.id === "panel" ? 0xb3cad0 : garment.id === "coat" ? 0x9d3e48 : 0x8fd3c7,
      map: pbr?.map ?? null,
      normalMap: pbr?.normalMap ?? null,
      roughnessMap: pbr?.roughnessMap ?? null,
      normalScale: new THREE.Vector2(garment.id === "panel" ? 0.72 : 0.48),
      roughness: garment.id === "panel" ? 0.78 : 0.62,
      metalness: 0,
      sheen: garment.id === "panel" ? 0.18 : 0.42,
      sheenColor: new THREE.Color(garment.id === "panel" ? 0x527480 : 0x9ee8db),
      sheenRoughness: 0.82,
      depthWrite: true,
    });
    material.positionNode = Fn(() => {
      const current = this.physics.positionData.element(attribute("physicsId")).xyz;
      const uv = attribute("uv");
      const windUv = vec3(uv.x, float(1).sub(uv.y), 0).xy;
      const phase = garment.id === "panel" ? 4.32 : garment.id === "coat" ? 2.18 : 0.34;
      return current.add(this.visualClothOffset(windUv, phase));
    })();
    material.mrtNode = mrt({ bloomIntensity: vec4(0.016, 0, 0, 1) });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = 9;
    this.scene.add(mesh);
    garment.mesh = mesh;
    this.disposables.push(geometry, material);
  }

  visualClothOffset(windUv, phase) {
    const flex = windUv.y.mul(float(0.28).add(windUv.y.mul(0.72)));
    const primarySway = sin(this.visualWindTime.mul(1.84).add(float(phase)).add(windUv.x.mul(0.74)));
    const secondarySway = sin(this.visualWindTime.mul(0.73).add(float(phase * 1.37)).sub(windUv.x.mul(0.42)));
    const sway = primarySway.mul(0.76).add(secondarySway.mul(0.24));
    const ripple = sin(this.visualWindTime.mul(4.15).add(float(phase * 1.71)).add(windUv.x.mul(5.8)));
    const strength = this.visualWindStrength;
    const pressure = sway.mul(0.32).add(0.68);
    const alongWind = this.visualWindDirection.mul(pressure.mul(flex).mul(strength).mul(0.98));
    const edgeFlutter = vec3(
      ripple.mul(flex).mul(strength).mul(0.2),
      ripple.mul(flex).mul(strength).mul(0.09),
      ripple.sub(sway.mul(0.35)).mul(flex).mul(strength).mul(0.38),
    );
    return alongWind.add(edgeFlutter);
  }

  createClothespins() {
    const attachmentNodes = this.garments.flatMap((garment) => [
      garment.attachments[0],
      garment.attachments[garment.attachments.length - 1],
    ]);
    const source = new THREE.BoxGeometry(0.11, 0.3, 0.13);
    const geometry = new THREE.InstancedBufferGeometry().copy(source);
    source.dispose();
    geometry.instanceCount = attachmentNodes.length;
    const ids = new Uint32Array(attachmentNodes.map((node) => node.id));
    geometry.setAttribute("pinPhysicsId", new THREE.InstancedBufferAttribute(ids, 1));
    const material = new THREE.MeshStandardNodeMaterial({ color: 0xffd87c, roughness: 0.4, metalness: 0.16 });
    material.positionNode = Fn(() => this.physics.positionData.element(attribute("pinPhysicsId")).xyz.add(positionLocal))();
    material.mrtNode = mrt({ bloomIntensity: vec4(0.07, 0, 0, 1) });
    this.pins = new THREE.Mesh(geometry, material);
    this.pins.frustumCulled = false;
    this.pins.renderOrder = 18;
    this.scene.add(this.pins);
    this.disposables.push(geometry, material);
  }

  createStructureLayer() {
    this.springVisualizer = new SpringVisualizer(this.physics);
    const { material, object } = this.springVisualizer;
    material.color = new THREE.Color(0xbffdf1);
    material.transparent = true;
    material.opacity = 0.18;
    material.blending = THREE.AdditiveBlending;
    material.depthWrite = false;
    material.mrtNode = mrt({ bloomIntensity: vec4(0.11, 0, 0, 1) });
    object.renderOrder = 20;
    object.visible = false;
    this.structureObject = object;
    this.scene.add(object);

    const source = new THREE.OctahedronGeometry(1, 0);
    const geometry = new THREE.InstancedBufferGeometry().copy(source);
    source.dispose();
    geometry.instanceCount = this.physics.vertexCount;
    const ids = new Uint32Array(this.physics.vertexCount);
    ids.forEach((_, index) => { ids[index] = index; });
    const idData = instancedArray(ids, "uint");
    const markerMaterial = new THREE.MeshBasicNodeMaterial({ transparent: true, opacity: 0.82, depthWrite: false });
    markerMaterial.positionNode = Fn(() => this.physics.positionData.element(idData.element(instanceIndex)).xyz.add(positionLocal.mul(0.026)))();
    markerMaterial.color = new THREE.Color(0xdbfff6);
    markerMaterial.mrtNode = mrt({ bloomIntensity: vec4(0.13, 0, 0, 1) });
    this.nodeMarkers = new THREE.Mesh(geometry, markerMaterial);
    this.nodeMarkers.frustumCulled = false;
    this.nodeMarkers.visible = false;
    this.nodeMarkers.renderOrder = 21;
    this.scene.add(this.nodeMarkers);
    this.disposables.push(geometry, markerMaterial);
  }

  createEnvironment() {
    const floorMaterial = new THREE.MeshPhysicalMaterial({ color: 0x08131a, roughness: 0.26, metalness: 0.42, clearcoat: 0.22 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(32, 24), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.24, -2.5);
    this.scene.add(floor);
    this.disposables.push(floor.geometry, floorMaterial);

    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x526870, metalness: 0.72, roughness: 0.28 });
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffb257, transparent: true, opacity: 0.7 });
    [[-6.55, 2.72], [6.55, 2.26]].forEach(([x, topY], index) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.09, 6.2, 10), poleMaterial);
      pole.position.set(x, 0.35, 0);
      pole.rotation.z = index ? -0.026 : 0.026;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.022, 7, 28), ringMaterial);
      ring.position.set(x, topY, 0);
      this.scene.add(pole, ring);
      this.disposables.push(pole.geometry, ring.geometry);
    });
    this.disposables.push(poleMaterial, ringMaterial);

    const skylineMaterial = new THREE.MeshStandardMaterial({ color: 0x0b1821, roughness: 0.82, metalness: 0.08 });
    const windowMaterial = new THREE.MeshBasicMaterial({ color: 0xffa550, transparent: true, opacity: 0.36, blending: THREE.AdditiveBlending });
    for (let index = 0; index < 22; index += 1) {
      const width = 0.7 + seeded(index * 5) * 1.4;
      const height = 1.1 + seeded(index * 7 + 2) * 5;
      const building = new THREE.Mesh(new THREE.BoxGeometry(width, height, 1.2 + seeded(index * 3) * 1.5), skylineMaterial);
      building.position.set(-13 + index * 1.25, -2.2 + height / 2, -9 - seeded(index * 11) * 5);
      const window = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.5, 0.025), windowMaterial);
      window.position.set(building.position.x, building.position.y + height * 0.18, building.position.z + 0.68);
      this.scene.add(building, window);
      this.disposables.push(building.geometry, window.geometry);
    }
    this.disposables.push(skylineMaterial, windowMaterial);

    const horizon = new THREE.Mesh(
      new THREE.RingGeometry(10, 10.025, 128, 1, 0.08, Math.PI - 0.16),
      new THREE.MeshBasicMaterial({ color: 0xff8a55, transparent: true, opacity: 0.14, side: THREE.DoubleSide }),
    );
    horizon.position.set(0, -1.7, -7.2);
    this.scene.add(horizon);
    this.disposables.push(horizon.geometry, horizon.material);
  }

  createWindField() {
    this.streakCount = this.quality < 1 ? 52 : 110;
    const geometry = new THREE.CylinderGeometry(0.008, 0.014, 1, 4, 1, true);
    const material = new THREE.MeshBasicMaterial({ color: 0x8eece4, transparent: true, opacity: 0.21, blending: THREE.AdditiveBlending, depthWrite: false });
    this.windStreaks = new THREE.InstancedMesh(geometry, material, this.streakCount);
    this.windStreaks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.windStreaks.frustumCulled = false;
    this.windStreaks.renderOrder = 17;
    this.streaks = Array.from({ length: this.streakCount }, (_, index) => ({
      x: -9 + seeded(index * 3) * 18,
      y: -2 + seeded(index * 5 + 1) * 8,
      z: -5 + seeded(index * 7 + 2) * 10,
      speed: 0.6 + seeded(index * 11 + 3) * 1.5,
      length: 0.22 + seeded(index * 13 + 4) * 0.75,
      phase: seeded(index * 17 + 5) * TAU,
    }));
    this.scene.add(this.windStreaks);
    this.disposables.push(geometry, material);
  }

  createAirflowRibbons() {
    this.airflowRibbonGroup = new THREE.Group();
    this.airflowRibbons = Array.from({ length: this.quality < 1 ? 3 : 5 }, (_, ribbonIndex) => {
      const count = this.quality < 1 ? 42 : 68;
      const positions = new Float32Array(count * 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.LineBasicMaterial({
        color: ribbonIndex % 2 ? 0xf0bd75 : 0x8de9e2,
        transparent: true,
        opacity: 0.055 + ribbonIndex * 0.012,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geometry, material);
      line.userData = { count, offset: ribbonIndex * 1.47, ribbonIndex };
      line.renderOrder = 8;
      this.airflowRibbonGroup.add(line);
      this.disposables.push(geometry, material);
      return line;
    });
    this.airflowRibbonGroup.rotation.y = -this.windAngle;
    this.scene.add(this.airflowRibbonGroup);
  }

  updateAirflowRibbons(elapsed) {
    if (!this.airflowRibbons) return;
    this.airflowRibbonGroup.rotation.y = -this.windAngle;
    this.airflowRibbons.forEach((line) => {
      const { count, offset, ribbonIndex } = line.userData;
      const positions = line.geometry.attributes.position.array;
      for (let index = 0; index < count; index += 1) {
        const t = index / (count - 1);
        const x = -8.5 + t * 17;
        const wave = elapsed * (0.5 + this.windStrength * 0.9) + t * 7.4 + offset;
        positions[index * 3] = x;
        positions[index * 3 + 1] = -1.55 + ribbonIndex * 0.86 + Math.sin(wave) * (0.13 + this.windStrength * 0.19);
        positions[index * 3 + 2] = -2.4 + ribbonIndex * 0.72 + Math.cos(wave * 0.73) * 0.24;
      }
      line.geometry.attributes.position.needsUpdate = true;
      line.material.opacity = 0.025 + this.windStrength * (0.06 + ribbonIndex * 0.008);
    });
  }

  createGustVfx() {
    const ringGeometry = new THREE.TorusGeometry(1, 0.015, 6, 72);
    this.gustVfx = Array.from({ length: 10 }, (_, index) => {
      const material = new THREE.MeshBasicMaterial({ color: index % 3 ? 0xffb257 : 0x8eece4, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const ring = new THREE.Mesh(ringGeometry, material);
      ring.visible = false;
      ring.renderOrder = 24;
      ring.userData = { active: false, age: 0, strength: 0 };
      this.scene.add(ring);
      this.disposables.push(material);
      return ring;
    });
    this.gustVfxCursor = 0;
    this.disposables.push(ringGeometry);
  }

  createReticle() {
    this.reticle = new THREE.Group();
    const arcMaterial = new THREE.MeshBasicMaterial({ color: 0xffc071, transparent: true, opacity: 0.62, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.012, 5, 44, Math.PI * 1.48), arcMaterial);
    arc.rotation.z = -Math.PI * 0.72;
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xd8ffff, transparent: true, opacity: 0.82, blending: THREE.AdditiveBlending, depthWrite: false });
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.025, 18), dotMaterial);
    this.reticle.add(arc, dot);
    this.reticle.userData = { arc, dot, visualScale: 1, phase: 0 };
    this.reticle.position.z = 0.23;
    this.reticle.visible = false;
    this.reticle.renderOrder = 28;
    this.scene.add(this.reticle);

    this.pointerWake = new THREE.Group();
    this.pointerWake.visible = false;
    this.pointerWakeLines = Array.from({ length: 3 }, (_, index) => {
      const positions = new Float32Array(24 * 3);
      const normals = new Float32Array(24 * 3);
      for (let normalIndex = 0; normalIndex < 24; normalIndex += 1) normals[normalIndex * 3 + 2] = 1;
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
      const material = new THREE.LineBasicMaterial({
        color: index === 1 ? 0xffbe70 : 0x8ef2e8,
        transparent: true,
        opacity: 0.34 - index * 0.055,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(geometry, material);
      line.renderOrder = 27;
      line.userData = { index };
      this.pointerWake.add(line);
      this.disposables.push(geometry, material);
      return line;
    });
    const arrowGeometry = new THREE.BufferGeometry();
    arrowGeometry.setAttribute("position", new THREE.Float32BufferAttribute([
      0.28, 0, 0,
      -0.18, 0.14, 0,
      -0.08, 0, 0,
      -0.18, -0.14, 0,
    ], 3));
    arrowGeometry.setIndex([0, 1, 2, 0, 2, 3]);
    arrowGeometry.computeVertexNormals();
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffc071, transparent: true, opacity: 0.82, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    this.pointerArrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
    this.pointerArrow.renderOrder = 29;
    this.pointerWake.add(this.pointerArrow);
    this.scene.add(this.pointerWake);
    this.disposables.push(arc.geometry, arcMaterial, dot.geometry, dotMaterial, arrowGeometry, arrowMaterial);
  }

  setupPostProcessing() {
    const scenePass = pass(this.scene, this.camera);
    scenePass.setMRT(mrt({ output, bloomIntensity: float(0) }));
    const colorPass = scenePass.getTextureNode();
    const bloomData = scenePass.getTextureNode("bloomIntensity");
    this.bloomPass = bloom(Fn(() => vec4(colorPass.rgb.mul(bloomData.r), 1))());
    this.bloomPass.threshold.value = 0.002;
    this.bloomPass.strength.value = this.quality < 1 ? 0.08 : 0.12;
    this.bloomPass.radius.value = 0.62;
    this.postProcessing = new THREE.PostProcessing(this.renderer);
    this.postProcessing.outputColorTransform = false;
    this.postProcessing.outputNode = Fn(() => {
      const mask = clamp(bloomData.r, 0, 1);
      return vec4(colorPass.rgb.add(this.bloomPass.rgb.mul(float(1).sub(mask).add(bloomData.g).clamp(0, 1))), 1).renderOutput();
    })();
  }

  projectScreenPoint(clientX, clientY, target) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = (clientX - rect.left) / rect.width * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height * 2 - 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    if (this.raycaster.ray.intersectPlane(this.hitPlane, target)) {
      target.x = THREE.MathUtils.clamp(target.x, -6.25, 6.25);
      target.y = THREE.MathUtils.clamp(target.y, -1.9, 2.8);
      return true;
    }
    return false;
  }

  setPointer(clientX, clientY) {
    if (this.projectScreenPoint(clientX, clientY, this.hitPoint)) {
      this.reticle.position.set(this.hitPoint.x, this.hitPoint.y, 0.18);
      this.reticle.visible = true;
      return true;
    }
    this.reticle.visible = false;
    return false;
  }

  beginPointer(clientX, clientY) {
    if (!this.setPointer(clientX, clientY)) return false;
    this.pointerPressed = true;
    this.pointerDragging = false;
    this.pointerAnchor.copy(this.hitPoint);
    this.pointerLastPoint.copy(this.hitPoint);
    this.cameraDragStartYaw = this.cameraYawTarget;
    this.cameraDragStartPitch = this.cameraPitchTarget;
    this.pointerForce.strength = 0;
    this.pointerWake.visible = true;
    this.updatePointerWake(this.pointerAnchor, this.pointerAnchor, 0);
    return true;
  }

  dragPointer(startX, startY, endX, endY) {
    if (!this.setPointer(endX, endY)) return false;
    const dx = endX - startX;
    const dy = endY - startY;
    const screenDistance = Math.hypot(dx, dy);
    this.tempRight.setFromMatrixColumn(this.camera.matrixWorld, 0);
    this.tempUp.setFromMatrixColumn(this.camera.matrixWorld, 1);
    this.tempDirection.copy(this.tempRight).multiplyScalar(dx)
      .addScaledVector(this.tempUp, -dy);
    if (this.tempDirection.lengthSq() < 1) this.tempDirection.copy(this.windDirection);
    this.tempDirection.normalize();
    this.pointerDragging = screenDistance >= 7;
    this.pointerForce.x = this.hitPoint.x;
    this.pointerForce.y = this.hitPoint.y;
    this.pointerForce.strength = this.pointerDragging
      ? THREE.MathUtils.clamp(screenDistance / 170, 0.22, 0.96) * (this.reducedMotion ? 0.58 : 1)
      : 0;
    this.pointerForce.radius = 1.45 + this.pointerForce.strength * 1.1;
    this.pointerForce.direction.copy(this.tempDirection);
    const rect = this.renderer.domElement.getBoundingClientRect();
    const orbitScale = this.reducedMotion ? 0.34 : 1;
    this.cameraYawTarget = THREE.MathUtils.clamp(
      this.cameraDragStartYaw - (dx / Math.max(rect.width, 1)) * 0.82 * orbitScale,
      -0.42 * orbitScale,
      0.42 * orbitScale,
    );
    this.cameraPitchTarget = THREE.MathUtils.clamp(
      this.cameraDragStartPitch - (dy / Math.max(rect.height, 1)) * 0.34 * orbitScale,
      -0.13 * orbitScale,
      0.14 * orbitScale,
    );
    this.pointerLastPoint.copy(this.hitPoint);
    this.updatePointerWake(this.pointerAnchor, this.hitPoint, this.pointerForce.strength);
    return {
      direction: this.tempDirection.clone(),
      strength: this.pointerForce.strength,
      cameraYawDegrees: THREE.MathUtils.radToDeg(this.cameraYawTarget),
      cameraPitchDegrees: THREE.MathUtils.radToDeg(this.cameraPitchTarget),
    };
  }

  updatePointerWake(start, end, strength) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.max(0.001, Math.hypot(dx, dy));
    const nx = -dy / length;
    const ny = dx / length;
    this.pointerWakeLines.forEach((line, lineIndex) => {
      const positions = line.geometry.attributes.position.array;
      for (let index = 0; index < 24; index += 1) {
        const t = index / 23;
        const envelope = Math.sin(t * Math.PI);
        const wave = Math.sin(t * TAU * 1.65 + lineIndex * 1.9) * envelope * (0.025 + strength * 0.095);
        const offset = (lineIndex - 1) * (0.035 + strength * 0.045);
        positions[index * 3] = THREE.MathUtils.lerp(start.x, end.x, t) + nx * (wave + offset);
        positions[index * 3 + 1] = THREE.MathUtils.lerp(start.y, end.y, t) + ny * (wave + offset);
        positions[index * 3 + 2] = 0.205 + lineIndex * 0.004;
      }
      line.geometry.attributes.position.needsUpdate = true;
      line.material.opacity = strength > 0 ? 0.18 + strength * (0.32 - lineIndex * 0.045) : 0.08;
    });
    this.pointerArrow.position.set(end.x, end.y, 0.22);
    this.pointerArrow.rotation.z = Math.atan2(dy, dx);
    this.pointerArrow.scale.setScalar(0.62 + strength * 0.72);
    this.pointerArrow.material.opacity = 0.34 + strength * 0.58;
  }

  clearPointer() {
    if (this.reticle) this.reticle.visible = false;
    if (this.pointerWake) this.pointerWake.visible = false;
    this.pointerPressed = false;
    this.pointerDragging = false;
    this.pointerForce.strength = 0;
    this.pointerForce.x = 99;
    this.pointerForce.y = 99;
  }

  gustFromScreen(startX, startY, endX, endY, strength = 1) {
    if (!this.setPointer(endX, endY)) return false;
    const dx = endX - startX;
    const dy = endY - startY;
    this.tempRight.setFromMatrixColumn(this.camera.matrixWorld, 0);
    this.tempUp.setFromMatrixColumn(this.camera.matrixWorld, 1);
    this.tempDirection.copy(this.tempRight).multiplyScalar(dx)
      .addScaledVector(this.tempUp, -dy);
    if (this.tempDirection.lengthSq() < 49) this.tempDirection.copy(this.windDirection);
    this.tempDirection.normalize();
    const lift = THREE.MathUtils.clamp(this.tempDirection.y, -0.75, 0.85);
    this.addGust(this.hitPoint.x, this.hitPoint.y, this.tempDirection, strength, lift, true);
    return { direction: this.tempDirection.clone(), x: this.hitPoint.x, y: this.hitPoint.y };
  }

  addGust(x = 0, y = 0.2, direction = this.windDirection, strength = 0.82, lift = 0.08, manual = false) {
    const slot = this.gustSlots[this.gustCursor % GUST_SLOTS];
    this.gustCursor += 1;
    slot.x = THREE.MathUtils.clamp(x, -6.25, 6.25);
    slot.y = THREE.MathUtils.clamp(y, -1.9, 2.8);
    slot.age = 0;
    slot.strength = (this.reducedMotion ? 0.62 : 1) * strength;
    slot.lift = lift;
    slot.direction.copy(direction).normalize();
    this.gustCount += 1;
    if (manual) this.causalAge = 0;
    this.spawnGustVfx(slot);
    this.onGust({ x: slot.x, y: slot.y, strength: slot.strength, direction: slot.direction.clone(), manual });
  }

  spawnGustVfx(gust) {
    const ring = this.gustVfx[this.gustVfxCursor % this.gustVfx.length];
    this.gustVfxCursor += 1;
    ring.visible = true;
    ring.position.set(gust.x, gust.y, 0.22);
    ring.scale.setScalar(0.2);
    ring.userData.active = true;
    ring.userData.age = 0;
    ring.userData.strength = gust.strength;
  }

  setWindStrength(value) { this.windStrength = THREE.MathUtils.clamp(Number(value), 0.08, 1); }
  setLoadFactor(value) { this.loadFactor = THREE.MathUtils.clamp(Number(value), 0.55, 1.6); }
  setDampingFactor(value) { this.dampingFactor = THREE.MathUtils.clamp(Number(value), 0.35, 0.92); }

  setWindAngle(angle) {
    this.windAngle = angle;
    this.windDirection.set(Math.cos(angle), 0.05, Math.sin(angle)).normalize();
  }

  nudgeWind(angleDelta) {
    this.setWindAngle(this.windAngle + angleDelta);
    return this.windAngle;
  }

  toggleStructure(force) {
    this.structureVisible = typeof force === "boolean" ? force : !this.structureVisible;
    this.structureObject.visible = this.structureVisible;
    this.nodeMarkers.visible = this.structureVisible;
    this.garments.forEach((garment) => {
      if (!garment.mesh) return;
      garment.mesh.material.transparent = this.structureVisible;
      garment.mesh.material.opacity = this.structureVisible ? 0.34 : 1;
    });
    this.authoredMeshes?.forEach((mesh) => {
      mesh.material.transparent = this.structureVisible;
      mesh.material.opacity = this.structureVisible ? 0.42 : 1;
    });
    return this.structureVisible;
  }

  reset() {
    this.gustSlots.forEach((gust) => { gust.age = 9; gust.strength = 0; gust.x = 99; });
    this.gustCount = 0;
    this.causalAge = Number.POSITIVE_INFINITY;
    this.bridge.requestReset();
    this.gustVfx.forEach((ring) => { ring.visible = false; ring.userData.active = false; });
    this.clearPointer();
    this.cameraYaw = 0;
    this.cameraPitch = 0;
    this.cameraYawTarget = 0;
    this.cameraPitchTarget = 0;
    this.setWindAngle(0.39);
  }

  updateWindField(delta, elapsed) {
    const motionScale = this.reducedMotion ? 0.24 : 1;
    const direction = this.tempDirection.copy(this.windDirection).normalize();
    const drift = (0.7 + this.windStrength * 2.7) * delta * motionScale;
    this.windStreaks.material.opacity = 0.08 + this.windStrength * 0.25;
    this.streaks.forEach((streak, index) => {
      streak.x += direction.x * streak.speed * drift;
      streak.y += (direction.y + Math.sin(elapsed * 0.5 + streak.phase) * 0.015) * streak.speed * drift;
      streak.z += direction.z * streak.speed * drift;
      if (Math.abs(streak.x) > 9.5 || streak.y > 6.4 || streak.y < -2.2 || Math.abs(streak.z) > 5.8) {
        streak.x = direction.x > 0 ? -9.2 : 9.2;
        streak.y = -1.8 + seeded(index * 23 + Math.floor(elapsed)) * 7.8;
        streak.z = -5 + seeded(index * 29 + 3) * 10;
      }
      this.dummy.position.set(streak.x, streak.y, streak.z);
      this.dummy.quaternion.setFromUnitVectors(this.axisY, direction);
      this.dummy.scale.set(1, streak.length * (0.55 + this.windStrength), 1);
      this.dummy.updateMatrix();
      this.windStreaks.setMatrixAt(index, this.dummy.matrix);
    });
    this.windStreaks.instanceMatrix.needsUpdate = true;
    this.updateAirflowRibbons(elapsed);
  }

  updateGusts(delta) {
    this.causalAge += delta;
    this.gustSlots.forEach((gust) => { gust.age += delta; });
    this.gustVfx.forEach((ring) => {
      if (!ring.userData.active) return;
      ring.userData.age += delta;
      const t = ring.userData.age / 1.25;
      if (t >= 1) {
        ring.userData.active = false;
        ring.visible = false;
        return;
      }
      const scale = 0.2 + t * 2.8;
      ring.scale.set(scale * 1.45, scale, scale);
      ring.material.opacity = (1 - t) * 0.58 * ring.userData.strength;
    });
  }

  updatePointerVfx(delta, elapsed) {
    if (!this.reticle?.visible) return;
    const { arc, dot } = this.reticle.userData;
    this.reticle.userData.phase += delta;
    const pulse = Math.sin(elapsed * (this.pointerDragging ? 8.4 : 3.6)) * 0.045;
    const targetScale = this.pointerDragging ? 0.76 : this.pointerPressed ? 0.86 : 1;
    this.reticle.userData.visualScale = THREE.MathUtils.lerp(this.reticle.userData.visualScale, targetScale + pulse, 0.18);
    this.reticle.scale.setScalar(this.reticle.userData.visualScale);
    this.reticle.rotation.z += delta * (this.pointerDragging ? 2.1 : 0.56);
    arc.material.opacity = this.pointerDragging ? 0.9 : this.pointerPressed ? 0.76 : 0.5 + pulse;
    dot.material.opacity = this.pointerDragging ? 1 : 0.76;
    dot.scale.setScalar(this.pointerDragging ? 1.45 : this.pointerPressed ? 1.18 : 1);
    if (this.pointerWake?.visible) {
      this.pointerWakeLines.forEach((line, index) => {
        const base = this.pointerDragging ? 0.24 + this.pointerForce.strength * (0.32 - index * 0.04) : 0.08;
        line.material.opacity = base * (0.9 + Math.sin(elapsed * 7.2 + index * 1.7) * 0.1);
      });
    }
  }

  updateCamera(delta) {
    const response = this.reducedMotion ? 5.5 : 9.5;
    const alpha = 1 - Math.exp(-delta * response);
    this.cameraYaw = THREE.MathUtils.lerp(this.cameraYaw, this.cameraYawTarget, alpha);
    this.cameraPitch = THREE.MathUtils.lerp(this.cameraPitch, this.cameraPitchTarget, alpha);
    this.applyCameraPosition();
  }

  applyCameraPosition() {
    const mobile = this.quality < 1;
    const distance = mobile ? 21.2 : 15.8;
    const baseX = mobile ? 0.4 : 1.25;
    const baseY = mobile ? 1.45 : 1.0;
    const focusY = mobile ? 0.18 : 0.05;
    this.camera.position.set(
      baseX + Math.sin(this.cameraYaw) * distance,
      baseY + Math.sin(this.cameraPitch) * distance,
      Math.cos(this.cameraYaw) * distance,
    );
    this.camera.lookAt(0, focusY, 0);
  }

  getViewportSize() {
    const rect = this.container.getBoundingClientRect();
    return { width: Math.max(1, Math.round(rect.width || window.innerWidth)), height: Math.max(1, Math.round(rect.height || window.innerHeight)) };
  }

  async update(elapsed) {
    const delta = Math.min(this.clock.getDelta(), 0.04);
    const frameMs = delta * 1000;
    this.frameTimeEma = this.frameTimeEma === 0 ? frameMs : THREE.MathUtils.lerp(this.frameTimeEma, frameMs, 0.045);
    this.frameCount += 1;

    if (!this.reducedMotion && elapsed > 1.4 && elapsed - this.lastAutoGustAt > 5.8 - this.windStrength * 1.8) {
      this.lastAutoGustAt = elapsed;
      const x = -4.8 + seeded(Math.floor(elapsed * 3.1)) * 9.6;
      this.addGust(x, 0.15, this.windDirection, 0.34 + this.windStrength * 0.28, 0.05, false);
    }

    this.updateGusts(delta);
    this.updateWindField(delta, elapsed);
    this.updatePointerVfx(delta, elapsed);
    this.updateCamera(delta);
    this.visualWindTime.value = elapsed;
    this.visualWindStrength.value = this.windStrength * (this.reducedMotion ? 0.2 : 1);
    this.visualWindDirection.value.copy(this.windDirection);
    this.physics.uniforms.dampening.value = 0.989 - this.dampingFactor * 0.051;
    this.bridge.setState({
      elapsed,
      windStrength: this.windStrength * (this.reducedMotion ? 0.46 : 1),
      load: this.loadFactor,
      windDirection: this.windDirection,
      gusts: this.gustSlots,
      pointerForce: this.pointerForce,
    });
    await this.physics.update(delta, elapsed);
    await this.postProcessing.renderAsync();

    if (elapsed - this.lastMetricsAt > 0.1) {
      this.lastMetricsAt = elapsed;
      const phase = elapsed < 1.05 ? "anchor" : this.causalAge < 0.42 ? "advect" : this.causalAge < 1.78 ? "settle" : "load";
      const angleDegrees = (THREE.MathUtils.radToDeg(this.windAngle) + 360) % 360;
      this.onMetrics({
        phase,
        windStrength: this.windStrength,
        windKph: 7 + this.windStrength * 48,
        angleDegrees,
        loadKg: 3.08 * this.loadFactor,
        delayMs: 148 + this.loadFactor * 82 + (1 - this.dampingFactor) * 54,
        gusts: this.gustCount,
        frameMilliseconds: this.frameTimeEma,
        cameraYawDegrees: THREE.MathUtils.radToDeg(this.cameraYaw),
        cameraPitchDegrees: THREE.MathUtils.radToDeg(this.cameraPitch),
      });
    }
  }

  resize() {
    const { width, height } = this.getViewportSize();
    const mobile = width < 768;
    this.quality = mobile ? 0.62 : 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 0.72 : 0.88));
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.applyCameraPosition();
  }

  getStats() {
    return {
      vertices: this.physics.vertexCount,
      springs: this.physics.springCount,
      solverRate: this.quality < 1 ? 90 : 144,
      garments: this.garments.map(({ id, mass, rows, cols }) => ({ id, mass, nodes: rows * cols })),
      collisionPlane: -2.18,
      labels: { vertices: formatCount(this.physics.vertexCount), springs: formatCount(this.physics.springCount) },
    };
  }

  async sampleDiagnostics() {
    const positions = new Float32Array(await this.renderer.getArrayBufferAsync(this.physics.positionData.value));
    const metadata = new Float32Array(await this.renderer.getArrayBufferAsync(this.bridge.metadata.value));
    let finite = true;
    let maxDisplacement = 0;
    let floorContacts = 0;
    for (let index = 1; index < this.physics.vertexCount; index += 1) {
      const offset = index * 4;
      const x = positions[offset];
      const y = positions[offset + 1];
      const z = positions[offset + 2];
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) finite = false;
      maxDisplacement = Math.max(maxDisplacement, Math.hypot(x - metadata[offset], y - metadata[offset + 1], z - metadata[offset + 2]));
      if (y <= -2.175) floorContacts += 1;
    }
    return { finite, count: this.physics.vertexCount - 1, maxDisplacement, floorContacts, frameMilliseconds: this.frameTimeEma };
  }

  destroy() {
    this.disposables.forEach((resource) => resource.dispose?.());
    this.renderer?.dispose();
  }
}
