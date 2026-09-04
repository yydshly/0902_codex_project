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
  sin,
  uniform,
  vec3,
  vec4,
} from "three/tsl";
import { VerletPhysics } from "@aurelia-upstream/physics/verletPhysics.js";
import { SpringVisualizer } from "@aurelia-upstream/physics/springVisualizer.js";
import { VertexVisualizer } from "@aurelia-upstream/physics/vertexVisualizer.js";

const ASSET_ROOT = "./assets/clothesline";
const CURTAIN_ASSET_ROOT = "./assets/curtain";

function clamp01(value) { return Math.max(0, Math.min(1, Number(value))); }

function seeded(index) {
  const value = Math.sin(index * 91.719 + 17.13) * 43758.5453;
  return value - Math.floor(value);
}

function formatCount(value) { return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value); }

class CurtainFieldBridge {
  constructor(physics) {
    this.physics = physics;
    this.uniforms = {
      elapsed: uniform(0),
      wind: uniform(0.28),
      openness: uniform(0.48),
      motionScale: uniform(1),
      direction: uniform(new THREE.Vector3(0.28, 0.05, 0.96)),
      pointer: uniform(new THREE.Vector4(99, 99, 0, 1.1)),
      pointerDirection: uniform(new THREE.Vector3(0, 0, 1)),
    };
    this.resetRequested = false;
  }

  async bake() {
    const base = new Float32Array(this.physics.vertexCount * 4);
    const motion = new Float32Array(this.physics.vertexCount * 4);
    this.physics.vertices.forEach((vertex) => {
      const meta = vertex.curtainMeta ?? { panel: 0, u: 0, v: 0, phase: 0 };
      base.set([vertex.value.x, vertex.value.y, vertex.value.z, meta.panel], vertex.id * 4);
      motion.set([meta.u, meta.v, meta.phase, meta.mobility ?? 0], vertex.id * 4);
    });
    this.baseData = instancedArray(base, "vec4");
    this.motionData = instancedArray(motion, "vec4");

    this.forceKernel = Fn(() => {
      const basePoint = this.baseData.element(instanceIndex);
      const meta = this.motionData.element(instanceIndex);
      const position = this.physics.positionData.element(instanceIndex).toVar();
      const force = this.physics.forceData.element(instanceIndex).toVar();
      const movable = position.w;
      const u = meta.x;
      const v = meta.y;
      const panel = basePoint.w;
      const openSpan = mix(float(4.55), float(1.92), this.uniforms.openness);
      const anchorX = panel.mul(float(4.8).sub(u.mul(openSpan)));
      const anchor = vec3(anchorX, basePoint.y, basePoint.z);

      If(v.lessThan(0.02), () => {
        position.xyz.assign(anchor);
        force.assign(vec3(0));
      });

      const slowBreath = sin(this.uniforms.elapsed.mul(0.71).add(meta.z)).mul(0.5).add(0.62);
      const foldWave = sin(this.uniforms.elapsed.mul(2.13).add(u.mul(13.6)).sub(v.mul(2.4)).add(meta.z));
      const hemWave = sin(this.uniforms.elapsed.mul(3.28).sub(u.mul(7.3)).add(v.mul(5.8)).add(meta.z.mul(1.7)));
      const exposure = float(0.12).add(v.mul(0.88));
      const windPower = this.uniforms.wind.mul(exposure).mul(float(0.5).add(slowBreath.mul(0.5)));
      const broadWind = this.uniforms.direction.mul(windPower.mul(0.00000275));
      const livingFold = vec3(
        foldWave.mul(this.uniforms.wind).mul(v).mul(0.00000034),
        hemWave.mul(this.uniforms.wind).mul(v.mul(v)).mul(0.00000022),
        foldWave.add(hemWave.mul(0.34)).mul(this.uniforms.wind).mul(v).mul(0.00000245),
      );
      force.addAssign(broadWind.add(livingFold).add(vec3(0, -0.00000016, 0)).mul(movable).mul(this.uniforms.motionScale));
      const verticalTarget = anchorX.sub(position.x).mul(float(0.12).add(v.mul(0.88))).mul(0.0000032);
      force.x.addAssign(verticalTarget.mul(movable).mul(this.uniforms.motionScale));

      const pointerDistance = basePoint.xy.sub(this.uniforms.pointer.xy).length();
      const pointerFalloff = clamp(float(1).sub(pointerDistance.div(this.uniforms.pointer.w.max(0.2))), 0, 1).toVar();
      pointerFalloff.mulAssign(pointerFalloff);
      const localForce = pointerFalloff.mul(this.uniforms.pointer.z).mul(v).mul(0.0000074);
      const localRipple = vec3(foldWave.mul(0.16), hemWave.mul(0.11), foldWave.mul(0.28)).mul(localForce);
      force.addAssign(this.uniforms.pointerDirection.mul(localForce).add(localRipple).mul(movable).mul(this.uniforms.motionScale));

      const speed = force.length().max(0.0000001);
      force.mulAssign(clamp(float(0.00029).div(speed), 0, 1));

      If(position.z.lessThan(-0.18), () => {
        position.z.assign(-0.18);
        force.z.assign(force.z.abs().mul(0.12));
      });

      const rest = vec3(anchorX, basePoint.y, basePoint.z);
      const offset = position.xyz.sub(rest).toVar();
      const displacement = offset.length().max(0.00001);
      const budget = float(0.32).add(v.mul(2.2));
      position.xyz.assign(rest.add(offset.mul(clamp(budget.div(displacement), 0, 1))));
      this.physics.positionData.element(instanceIndex).xyz.assign(position.xyz);
      this.physics.forceData.element(instanceIndex).assign(force);
    })().compute(this.physics.vertexCount);

    this.resetKernel = Fn(() => {
      const basePoint = this.baseData.element(instanceIndex);
      this.physics.positionData.element(instanceIndex).xyz.assign(basePoint.xyz);
      this.physics.forceData.element(instanceIndex).assign(vec3(0));
    })().compute(this.physics.vertexCount);
  }

  setState({ elapsed, wind, openness, direction, pointer, pointerDirection, motionScale }) {
    this.uniforms.elapsed.value = elapsed;
    this.uniforms.wind.value = wind;
    this.uniforms.openness.value = openness;
    this.uniforms.direction.value.copy(direction);
    this.uniforms.pointer.value.set(pointer.x, pointer.y, pointer.strength, pointer.radius);
    this.uniforms.pointerDirection.value.copy(pointerDirection);
    this.uniforms.motionScale.value = motionScale;
  }

  async update() {
    if (this.resetRequested) {
      this.resetRequested = false;
      await this.physics.renderer.computeAsync(this.resetKernel);
    }
    await this.physics.renderer.computeAsync(this.forceKernel);
  }

  requestReset() { this.resetRequested = true; }
}

export class CurtainScene {
  constructor(container, { reducedMotion = false, onMetrics = () => {}, onPhase = () => {} } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.onMetrics = onMetrics;
    this.onPhase = onPhase;
    this.mobile = (container.clientWidth || innerWidth) < 720;
    this.quality = this.mobile ? 0.64 : 1;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointerNdc = new THREE.Vector2();
    this.hitPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.34);
    this.hitPoint = new THREE.Vector3();
    this.wind = 0.28;
    this.openness = 0.64;
    this.openActual = this.mobile ? this.openness * 0.55 : this.openness;
    this.transmission = 0.58;
    this.sun = 0.58;
    this.windAngle = 0.28;
    this.direction = new THREE.Vector3(Math.sin(this.windAngle) * 0.46, 0.035, Math.cos(this.windAngle)).normalize();
    this.visualTime = uniform(0);
    this.visualWind = uniform(this.wind);
    this.visualPointer = uniform(new THREE.Vector4(99, 99, 0, 1.1));
    this.pointer = { x: 99, y: 99, strength: 0, targetStrength: 0, radius: 1.1 };
    this.pointerDirection = new THREE.Vector3(0, 0.05, 1);
    this.pointerPan = 0;
    this.canopyImpulse = 0;
    this.canopyImpulseDirection = 0;
    this.dragging = false;
    this.structureVisible = false;
    this.lastInteraction = -99;
    this.lastMetricsAt = -1;
    this.lastShadowAt = -1;
    this.frameTimeEma = 0;
    this.disposables = [];
    this.dummy = new THREE.Object3D();
  }

  async init(onProgress = () => {}) {
    globalThis.__AURELIA_LAB_CONFIG__ = { ...(globalThis.__AURELIA_LAB_CONFIG__ ?? {}), stepsPerSecond: this.mobile ? 90 : 144 };
    const viewport = this.getViewportSize();
    this.renderer = new THREE.WebGPURenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.mobile ? 0.72 : 0.92));
    this.renderer.setSize(viewport.width, viewport.height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    await this.renderer.init();
    if (!this.renderer.backend?.isWebGPUBackend) throw new Error("没有可用的 WebGPU 后端");
    this.renderer.domElement.setAttribute("aria-label", "可用靠近和拖动影响的树影窗帘空间");
    this.container.prepend(this.renderer.domElement);
    onProgress(0.12, "让日光进入房间");

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcfc7b9);
    this.scene.fog = new THREE.FogExp2(0xcfc7b9, 0.032);
    this.camera = new THREE.PerspectiveCamera(38, viewport.width / viewport.height, 0.08, 50);
    this.cameraTarget = new THREE.Vector3(0, 0.15, 0);
    this.applyCamera();

    this.hemi = new THREE.HemisphereLight(0xfff8e7, 0x695f53, 2.4);
    this.sunLight = new THREE.DirectionalLight(0xffd69a, 4.2);
    this.sunLight.position.set(-5, 7, 8);
    this.scene.add(this.hemi, this.sunLight);

    await Promise.all([this.loadFabric(), this.loadVisualAssets()]);
    this.createShadowTexture();
    this.createEnvironment();
    onProgress(0.32, "合成摄影空间、树影与织物尺度");

    this.physics = new VerletPhysics(this.renderer);
    this.bridge = new CurtainFieldBridge(this.physics);
    this.physics.addObject(this.bridge);
    const dummy = this.physics.addVertex(new THREE.Vector3(100, 100, 100), true);
    dummy.curtainMeta = { panel: 0, u: 0, v: 0, phase: 0, mobility: 0 };
    this.buildCurtains();
    await this.physics.bake();
    this.physics.uniforms.dampening.value = 0.958;
    this.physics.setMouseRay(new THREE.Vector3(500, 500, 500), new THREE.Vector3(1, 0, 0));
    onProgress(0.66, "编译 Aurelia 双帘布约束");

    this.curtains.forEach((curtain) => this.createCurtainSurface(curtain));
    this.createRail();
    this.createCurtainHeaders();
    this.createStructureLayer();
    this.createDust();
    this.createPointerHalo();
    this.setupPostProcessing();
    this.updateLighting();
    this.resize();
    onProgress(1, "房间开始呼吸");
  }

  async loadFabric() {
    const loader = new THREE.TextureLoader();
    try {
      const [normal, roughness] = await Promise.all([
        loader.loadAsync(`${ASSET_ROOT}/terlenka_nor_gl_1k.jpg`),
        loader.loadAsync(`${ASSET_ROOT}/terlenka_rough_1k.jpg`),
      ]);
      [normal, roughness].forEach((texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4.2, 7.6);
        texture.anisotropy = 4;
        texture.needsUpdate = true;
        this.disposables.push(texture);
      });
      this.fabricNormal = normal;
      this.fabricRoughness = roughness;
    } catch (error) {
      console.warn("Curtain PBR detail unavailable", error);
    }
  }

  async loadVisualAssets() {
    const loader = new THREE.TextureLoader();
    const [room, gobo, canopyRight, sprigLeft] = await Promise.all([
      loader.loadAsync(`${CURTAIN_ASSET_ROOT}/architectural-room-v2.png`),
      loader.loadAsync(`${CURTAIN_ASSET_ROOT}/olive-shadow-gobo-v2.png`),
      loader.loadAsync(`${CURTAIN_ASSET_ROOT}/olive-canopy-right-v3.png`),
      loader.loadAsync(`${CURTAIN_ASSET_ROOT}/olive-sprig-left-v3.png`),
    ]);
    room.colorSpace = THREE.SRGBColorSpace;
    room.minFilter = THREE.LinearMipmapLinearFilter;
    room.magFilter = THREE.LinearFilter;
    room.anisotropy = this.mobile ? 2 : 6;
    room.wrapS = room.wrapT = THREE.ClampToEdgeWrapping;
    room.needsUpdate = true;
    gobo.colorSpace = THREE.SRGBColorSpace;
    gobo.minFilter = THREE.LinearMipmapLinearFilter;
    gobo.magFilter = THREE.LinearFilter;
    gobo.wrapS = gobo.wrapT = THREE.ClampToEdgeWrapping;
    gobo.needsUpdate = true;
    [canopyRight, sprigLeft].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = this.mobile ? 2 : 4;
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
    });
    this.roomTexture = room;
    this.goboTexture = gobo;
    this.canopyRightTexture = canopyRight;
    this.sprigLeftTexture = sprigLeft;
    this.shadowSource = gobo.image;
    this.disposables.push(room, gobo, canopyRight, sprigLeft);
  }

  createShadowTexture() {
    const size = this.mobile ? 512 : 768;
    this.shadowCanvas = document.createElement("canvas");
    this.shadowCanvas.width = size;
    this.shadowCanvas.height = size;
    this.shadowContext = this.shadowCanvas.getContext("2d");
    this.shadowTexture = new THREE.CanvasTexture(this.shadowCanvas);
    this.shadowTexture.colorSpace = THREE.SRGBColorSpace;
    this.shadowTexture.minFilter = THREE.LinearFilter;
    this.shadowTexture.magFilter = THREE.LinearFilter;
    this.disposables.push(this.shadowTexture);
    this.paintShadow(0);
  }

  paintShadow(elapsed) {
    const ctx = this.shadowContext;
    const { width, height } = this.shadowCanvas;
    const warm = Math.sin(this.sun * Math.PI);
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `rgb(${232 + Math.round(warm * 8)},${225 + Math.round(warm * 6)},${211 + Math.round(warm * 3)})`);
    gradient.addColorStop(1, `rgb(${207 + Math.round(warm * 12)},${203 + Math.round(warm * 8)},${190 + Math.round(warm * 2)})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (this.shadowSource) {
      const density = 0.42 + (1 - this.transmission) * 0.34;
      const travel = (this.sun - 0.5) * width * 0.1;
      const sway = this.reducedMotion ? 0 : Math.sin(elapsed * (0.18 + this.wind * 0.22)) * width * this.wind * 0.035;
      const scale = 1.16;
      const sourceSize = width * scale;
      const sourceX = (width - sourceSize) * 0.5 + travel + sway;
      const sourceY = (height - sourceSize) * 0.5 + Math.cos(elapsed * 0.13) * sway * 0.36;
      ctx.save();
      ctx.globalAlpha = density;
      ctx.filter = `saturate(0.62) contrast(${1.02 + (1 - this.transmission) * 0.16}) brightness(${0.98 + warm * 0.04})`;
      ctx.drawImage(this.shadowSource, sourceX, sourceY, sourceSize, sourceSize);
      ctx.restore();
    }
    this.shadowTexture.needsUpdate = true;
  }

  createEnvironment() {
    const geometry = new THREE.PlaneGeometry(22, 12.375);
    this.environmentMaterial = new THREE.MeshBasicMaterial({ map: this.roomTexture, color: 0xffffff, fog: false });
    this.environmentPlane = new THREE.Mesh(geometry, this.environmentMaterial);
    this.environmentPlane.position.set(0, 0.12, -1.16);
    this.environmentPlane.renderOrder = -5;
    this.scene.add(this.environmentPlane);
    this.windowView = this.environmentPlane;
    this.disposables.push(geometry, this.environmentMaterial);
    this.createFoliageLayers();
  }

  createFoliageLayers() {
    const configurations = [
      {
        texture: this.canopyRightTexture,
        width: 8.9,
        height: 5.94,
        pivot: new THREE.Vector3(4.78, 2.48, -0.94),
        offset: new THREE.Vector3(-3.85, -2.12, 0),
        baseRotation: -0.035,
        amplitude: 0.055,
        speed: 0.46,
        opacity: 0.72,
      },
      {
        texture: this.sprigLeftTexture,
        width: 5.05,
        height: 7.58,
        pivot: new THREE.Vector3(-4.62, -2.82, -0.91),
        offset: new THREE.Vector3(2.08, 3.05, 0),
        baseRotation: 0.018,
        amplitude: 0.078,
        speed: 0.61,
        opacity: 0.56,
      },
    ];
    this.foliageLayers = configurations.map((config, index) => {
      const geometry = new THREE.PlaneGeometry(config.width, config.height, 5, 5);
      const material = new THREE.MeshBasicMaterial({
        map: config.texture,
        color: index ? 0xdce1c7 : 0xf3e3bd,
        transparent: true,
        opacity: config.opacity,
        alphaTest: 0.025,
        depthWrite: false,
        side: THREE.DoubleSide,
        fog: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(config.offset);
      mesh.renderOrder = -3 + index;
      const group = new THREE.Group();
      group.position.copy(config.pivot);
      group.rotation.z = config.baseRotation;
      group.add(mesh);
      this.scene.add(group);
      this.disposables.push(geometry, material);
      return { ...config, group, mesh, basePosition: config.pivot.clone(), phase: index * 1.71 };
    });
  }

  buildCurtains() {
    const cols = this.mobile ? 16 : 24;
    const rows = this.mobile ? 22 : 28;
    const initialOpenness = this.mobile ? 0.64 * 0.55 : 0.64;
    const initialSpan = THREE.MathUtils.lerp(4.55, 1.92, initialOpenness);
    this.curtains = [-1, 1].map((panel, panelIndex) => {
      const grid = Array.from({ length: rows }, () => []);
      for (let row = 0; row < rows; row += 1) {
        const v = row / (rows - 1);
        for (let col = 0; col < cols; col += 1) {
          const u = col / (cols - 1);
          const pleat = Math.sin(u * Math.PI * 12 + panelIndex * 0.34);
          const x = panel * (4.8 - u * initialSpan);
          const hemDrop = Math.pow(v, 5) * (0.035 + (0.5 + 0.5 * Math.sin(u * Math.PI * 3 + panelIndex)) * 0.085);
          const y = 3.34 - v * 6.38 - hemDrop;
          const z = 0.2 + pleat * (0.22 + (1 - v) * 0.07) + Math.sin(v * Math.PI) * 0.035;
          const vertex = this.physics.addVertex(new THREE.Vector3(x, y, z), row === 0);
          vertex.curtainMeta = { panel, u, v, phase: panelIndex * 1.73 + u * 0.62, mobility: v };
          grid[row].push(vertex);
          if (col > 0) this.physics.addSpring(grid[row][col - 1], vertex, 0.00128);
          if (row > 0) this.physics.addSpring(grid[row - 1][col], vertex, 0.00142);
          if (row > 0 && col > 0) this.physics.addSpring(grid[row - 1][col - 1], vertex, 0.00024);
          if (row > 0 && col < cols - 1) this.physics.addSpring(grid[row - 1][col + 1], vertex, 0.00024);
          if (col > 1) this.physics.addSpring(grid[row][col - 2], vertex, 0.00011);
          if (row > 1) this.physics.addSpring(grid[row - 2][col], vertex, 0.00013);
        }
      }
      return { panel, panelIndex, rows, cols, grid };
    });
  }

  createCurtainSurface(curtain) {
    const { rows, cols, grid, panelIndex } = curtain;
    const count = rows * cols;
    const positions = new Float32Array(count * 3);
    const ids = new Uint32Array(count);
    const uvs = new Float32Array(count * 2);
    const indices = [];
    const at = (row, col) => row * cols + col;
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const index = at(row, col);
        const vertex = grid[row][col];
        positions.set([vertex.value.x, vertex.value.y, vertex.value.z], index * 3);
        ids[index] = vertex.id;
        uvs.set([col / (cols - 1), 1 - row / (rows - 1)], index * 2);
      }
    }
    for (let row = 0; row < rows - 1; row += 1) {
      for (let col = 0; col < cols - 1; col += 1) {
        const a = at(row, col), b = at(row, col + 1), c = at(row + 1, col), d = at(row + 1, col + 1);
        if ((row + col) % 2) indices.push(a, c, b, b, c, d);
        else indices.push(a, c, d, a, d, b);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("physicsId", new THREE.BufferAttribute(ids, 1));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const material = new THREE.MeshPhysicalNodeMaterial({
      side: THREE.DoubleSide,
      color: panelIndex ? 0xf0eadf : 0xe8e2d7,
      map: this.shadowTexture,
      normalMap: this.fabricNormal ?? null,
      roughnessMap: this.fabricRoughness ?? null,
      normalScale: new THREE.Vector2(0.38, 0.38),
      roughness: 0.82,
      metalness: 0,
      sheen: 0.28,
      sheenColor: new THREE.Color(0xfff4dc),
      sheenRoughness: 0.88,
      transparent: true,
      opacity: 0.93,
      depthWrite: true,
    });
    material.positionNode = Fn(() => {
      const current = this.physics.positionData.element(attribute("physicsId")).xyz;
      const uv = attribute("uv");
      const flex = float(1).sub(uv.y);
      const slow = sin(this.visualTime.mul(0.82).add(uv.x.mul(4.8)).add(float(panelIndex * 1.7)));
      const ripple = sin(this.visualTime.mul(2.75).sub(uv.x.mul(12.4)).add(uv.y.mul(3.2)));
      const distance = current.xy.sub(this.visualPointer.xy).length();
      const near = clamp(float(1).sub(distance.div(this.visualPointer.w.max(0.2))), 0, 1);
      const radialX = current.x.sub(this.visualPointer.x).div(distance.max(0.05));
      const radialY = current.y.sub(this.visualPointer.y).div(distance.max(0.05));
      const baseSway = vec3(
        slow.mul(flex).mul(this.visualWind).mul(0.2),
        ripple.mul(flex.mul(flex)).mul(this.visualWind).mul(0.085),
        slow.add(ripple.mul(0.34)).mul(flex).mul(this.visualWind).mul(0.58),
      );
      const localFold = vec3(
        radialX.mul(near).mul(this.visualPointer.z).mul(0.72).add(ripple.mul(near).mul(this.visualPointer.z).mul(0.28)),
        radialY.mul(near).mul(this.visualPointer.z).mul(0.42),
        near.mul(this.visualPointer.z).mul(1.5),
      );
      return current.add(baseSway).add(localFold);
    })();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = 6;
    this.scene.add(mesh);
    curtain.mesh = mesh;
    this.disposables.push(geometry, material);
  }

  createRail() {
    const railMaterial = new THREE.MeshStandardMaterial({ color: 0x4e4a43, roughness: 0.48, metalness: 0.35 });
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 10.4, 16), railMaterial);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, 3.52, 0.08);
    this.scene.add(rail);
    this.disposables.push(rail.geometry, railMaterial);
  }

  createCurtainHeaders() {
    const hooksPerPanel = this.mobile ? 8 : 12;
    const geometry = new THREE.TorusGeometry(0.064, 0.014, 6, 14);
    const material = new THREE.MeshStandardMaterial({ color: 0x847767, roughness: 0.38, metalness: 0.5 });
    this.headerHooks = new THREE.InstancedMesh(geometry, material, hooksPerPanel * 2);
    this.headerHooks.renderOrder = 8;
    this.headerHooks.frustumCulled = false;
    this.headerHookCount = hooksPerPanel;
    this.scene.add(this.headerHooks);
    this.disposables.push(geometry, material);
    this.updateCurtainHeaders();
  }

  updateCurtainHeaders() {
    if (!this.headerHooks) return;
    const openSpan = THREE.MathUtils.lerp(4.55, 1.92, this.openActual);
    let instance = 0;
    [-1, 1].forEach((panel, panelIndex) => {
      for (let index = 0; index < this.headerHookCount; index += 1) {
        const u = index / Math.max(1, this.headerHookCount - 1);
        this.dummy.position.set(panel * (4.8 - u * openSpan), 3.43, 0.2 + Math.sin(u * Math.PI * 12 + panelIndex * 0.34) * 0.045);
        this.dummy.rotation.set(0, 0, 0);
        this.dummy.scale.setScalar(1);
        this.dummy.updateMatrix();
        this.headerHooks.setMatrixAt(instance, this.dummy.matrix);
        instance += 1;
      }
    });
    this.headerHooks.instanceMatrix.needsUpdate = true;
  }

  createStructureLayer() {
    this.springVisualizer = new SpringVisualizer(this.physics);
    this.springVisualizer.material.color.setHex(0x69745f);
    this.springVisualizer.material.transparent = true;
    this.springVisualizer.material.opacity = 0.42;
    this.springVisualizer.object.visible = false;
    this.springVisualizer.object.renderOrder = 10;
    this.scene.add(this.springVisualizer.object);
    this.vertexVisualizer = new VertexVisualizer(this.physics);
    this.vertexVisualizer.material.color.setHex(0xa06f55);
    this.vertexVisualizer.material.transparent = true;
    this.vertexVisualizer.material.opacity = 0.68;
    this.vertexVisualizer.object.scale.setScalar(2.6);
    this.vertexVisualizer.object.visible = false;
    this.vertexVisualizer.object.renderOrder = 11;
    this.scene.add(this.vertexVisualizer.object);
    this.disposables.push(this.springVisualizer.material, this.vertexVisualizer.material);
  }

  createDust() {
    const count = this.mobile ? 42 : 90;
    const positions = new Float32Array(count * 3);
    this.dustPhase = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      positions.set([-4.2 + seeded(index * 3) * 8.4, -2.7 + seeded(index * 5) * 6.2, 0.7 + seeded(index * 7) * 4.2], index * 3);
      this.dustPhase[index] = seeded(index * 11) * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffe2aa, size: this.mobile ? 0.025 : 0.035, transparent: true, opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending });
    this.dust = new THREE.Points(geometry, material);
    this.scene.add(this.dust);
    this.disposables.push(geometry, material);
  }

  createPointerHalo() {
    const material = new THREE.MeshBasicMaterial({ color: 0x737d67, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.47, 42), material);
    halo.position.z = 0.5;
    halo.renderOrder = 12;
    this.pointerHalo = halo;
    this.scene.add(halo);
    this.disposables.push(halo.geometry, material);
  }

  setupPostProcessing() {
    this.scenePass = pass(this.scene, this.camera);
    this.scenePass.setMRT(mrt({ output }));
    const colorPass = this.scenePass.getTextureNode("output");
    this.postProcessing = new THREE.PostProcessing(this.renderer);
    this.postProcessing.outputNode = Fn(() => vec4(colorPass.rgb, 1).renderOutput())();
  }

  setWind(value) { this.wind = clamp01(value); }
  setOpen(value) { this.openness = clamp01(value); }
  setTransmission(value) {
    this.transmission = clamp01(value);
    this.curtains?.forEach(({ mesh }) => { if (mesh) mesh.material.opacity = 0.76 + (1 - this.transmission) * 0.2; });
  }
  setSun(value) { this.sun = clamp01(value); this.updateLighting(); this.paintShadow(this.clock.elapsedTime); }
  setWindAngle(value) {
    this.windAngle = Number(value);
    this.direction.set(Math.sin(this.windAngle) * 0.52, 0.04, Math.cos(this.windAngle)).normalize();
  }

  setPreset(name) {
    const preset = {
      dawn: { wind: 0.24, openness: 0.34, transmission: 0.46, sun: 0.1 },
      noon: { wind: 0.52, openness: 0.64, transmission: 0.72, sun: 0.54 },
      dusk: { wind: 0.36, openness: 0.42, transmission: 0.5, sun: 0.9 },
    }[name];
    if (!preset) return null;
    this.setWind(preset.wind);
    this.setOpen(preset.openness);
    this.setTransmission(preset.transmission);
    this.setSun(preset.sun);
    this.lastInteraction = this.clock.elapsedTime;
    return preset;
  }

  updateLighting() {
    if (!this.sunLight) return;
    const morning = new THREE.Color(0xffc78c);
    const noon = new THREE.Color(0xfff0cf);
    const dusk = new THREE.Color(0xe79a75);
    const color = this.sun < 0.55 ? morning.clone().lerp(noon, this.sun / 0.55) : noon.clone().lerp(dusk, (this.sun - 0.55) / 0.45);
    this.sunLight.color.copy(color);
    this.sunLight.intensity = 3.4 + Math.sin(this.sun * Math.PI) * 2.1;
    this.sunLight.position.set(THREE.MathUtils.lerp(-7, 7, this.sun), 5.4 + Math.sin(this.sun * Math.PI) * 4.2, 7);
    if (this.sunPool) {
      this.sunPool.rotation.z = THREE.MathUtils.lerp(-0.48, 0.38, this.sun);
      this.sunPool.material.opacity = 0.1 + Math.sin(this.sun * Math.PI) * 0.18;
    }
    if (this.environmentMaterial) {
      const dawnTint = new THREE.Color(0xffe0be);
      const noonTint = new THREE.Color(0xffffff);
      const duskTint = new THREE.Color(0xffcfbf);
      const tint = this.sun < 0.55 ? dawnTint.clone().lerp(noonTint, this.sun / 0.55) : noonTint.clone().lerp(duskTint, (this.sun - 0.55) / 0.45);
      this.environmentMaterial.color.copy(tint);
    }
  }

  pointerMove(clientX, clientY, { dragging = false, dx = 0, dy = 0 } = {}) {
    if (!this.renderer || !this.camera) return false;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointerNdc.set((clientX - rect.left) / rect.width * 2 - 1, -((clientY - rect.top) / rect.height * 2 - 1));
    this.raycaster.setFromCamera(this.pointerNdc, this.camera);
    if (!this.raycaster.ray.intersectPlane(this.hitPlane, this.hitPoint)) return false;
    const inside = Math.abs(this.hitPoint.x) <= 5.15 && this.hitPoint.y >= -3.1 && this.hitPoint.y <= 3.55;
    if (!inside) { this.pointer.targetStrength = 0; return false; }
    this.pointer.x = this.hitPoint.x;
    this.pointer.y = this.hitPoint.y;
    this.pointer.targetStrength = dragging ? Math.min(1, 0.62 + Math.hypot(dx, dy) / 38) : 0.42;
    this.pointer.radius = dragging ? 1.45 : 1.08;
    this.pointerPan = clamp01((clientX - rect.left) / rect.width) * 2 - 1;
    if (dragging) this.pointerDirection.set(dx / 36, -dy / 46, 0.72).normalize();
    else this.pointerDirection.set(this.hitPoint.x * -0.035, 0.035, 1).normalize();
    if (dragging) {
      this.canopyImpulse = Math.min(1, Math.max(this.canopyImpulse, Math.hypot(dx, dy) / 34));
      this.canopyImpulseDirection = Math.sign(dx || this.canopyImpulseDirection || 1);
    }
    this.pointerHalo.position.set(this.hitPoint.x, this.hitPoint.y, 0.52);
    this.dragging = dragging;
    this.lastInteraction = this.clock.elapsedTime;
    this.onPhase(dragging ? "wake" : "near");
    return true;
  }

  pointerLeave() { this.pointer.targetStrength = 0; this.dragging = false; }
  endDrag() { this.pointer.targetStrength = 0.08; this.dragging = false; this.onPhase("settle"); }

  toggleStructure(force) {
    this.structureVisible = typeof force === "boolean" ? force : !this.structureVisible;
    this.springVisualizer.object.visible = this.structureVisible;
    this.vertexVisualizer.object.visible = this.structureVisible;
    return this.structureVisible;
  }

  reset() {
    this.setPreset("noon");
    this.pointerLeave();
    this.openActual = this.mobile ? this.openness * 0.55 : this.openness;
    this.bridge.requestReset();
    this.onPhase("still");
  }

  updateDust(delta, elapsed) {
    if (this.reducedMotion) return;
    const positions = this.dust.geometry.attributes.position.array;
    for (let index = 0; index < this.dustPhase.length; index += 1) {
      positions[index * 3] += Math.sin(elapsed * 0.34 + this.dustPhase[index]) * delta * (0.014 + this.wind * 0.022);
      positions[index * 3 + 1] += delta * (0.006 + seeded(index) * 0.012);
      if (positions[index * 3 + 1] > 3.5) positions[index * 3 + 1] = -2.8;
    }
    this.dust.geometry.attributes.position.needsUpdate = true;
  }

  async update(elapsed) {
    const delta = Math.min(this.clock.getDelta(), 0.045);
    const frameMs = delta * 1000;
    this.frameTimeEma = this.frameTimeEma ? THREE.MathUtils.lerp(this.frameTimeEma, frameMs, 0.05) : frameMs;
    this.pointer.strength = THREE.MathUtils.damp(this.pointer.strength, this.pointer.targetStrength, this.reducedMotion ? 5 : 12, delta);
    if (!this.dragging && this.clock.elapsedTime - this.lastInteraction > 0.7) this.pointer.targetStrength = 0;
    const openTarget = this.mobile ? this.openness * 0.55 : this.openness;
    this.openActual = THREE.MathUtils.damp(this.openActual, openTarget, this.reducedMotion ? 5 : 3.4, delta);
    this.updateCurtainHeaders();
    this.physics.uniforms.dampening.value = 0.982 - this.wind * 0.026;
    this.bridge.setState({
      elapsed,
      wind: this.wind * (this.reducedMotion ? 0.32 : 1),
      openness: this.openActual,
      direction: this.direction,
      pointer: this.pointer,
      pointerDirection: this.pointerDirection,
      motionScale: this.reducedMotion ? 0.28 : 1,
    });
    this.visualTime.value = elapsed;
    this.visualWind.value = this.wind * (this.reducedMotion ? 0.18 : 1.45);
    this.visualPointer.value.set(this.pointer.x, this.pointer.y, this.pointer.strength, this.pointer.radius);
    await this.physics.update(delta, elapsed);

    if (elapsed - this.lastShadowAt > (this.reducedMotion ? 0.5 : 0.075)) {
      this.lastShadowAt = elapsed;
      this.paintShadow(elapsed);
    }
    this.updateDust(delta, elapsed);
    this.canopyImpulse = THREE.MathUtils.damp(this.canopyImpulse, 0, this.reducedMotion ? 7 : 1.7, delta);
    const canopyMotionScale = this.reducedMotion ? 0.16 : 1;
    let canopyMotion = 0;
    this.foliageLayers?.forEach((layer, index) => {
      const windSway = Math.sin(elapsed * layer.speed + layer.phase) * layer.amplitude * (0.42 + this.wind * 2.8);
      const quickSway = Math.sin(elapsed * (1.26 + index * 0.31) + layer.phase) * layer.amplitude * this.wind * 0.48;
      const impulseSway = this.canopyImpulseDirection * this.canopyImpulse * layer.amplitude * (index ? 1.35 : 0.9);
      const angle = layer.baseRotation + (windSway + quickSway + impulseSway) * canopyMotionScale;
      layer.group.rotation.z = angle;
      layer.group.position.x = layer.basePosition.x + Math.sin(elapsed * (0.32 + index * 0.09) + layer.phase) * this.wind * 0.045 * canopyMotionScale;
      layer.group.position.y = layer.basePosition.y + Math.cos(elapsed * (0.27 + index * 0.08) + layer.phase) * this.wind * 0.024 * canopyMotionScale;
      layer.mesh.scale.y = 1 + Math.sin(elapsed * (0.74 + index * 0.12) + layer.phase) * this.wind * 0.012 * canopyMotionScale;
      canopyMotion = Math.max(canopyMotion, Math.abs(angle - layer.baseRotation));
    });
    this.canopyMotion = canopyMotion;
    this.pointerHalo.material.opacity = THREE.MathUtils.damp(this.pointerHalo.material.opacity, this.pointer.strength * 0.84, 10, delta);
    this.pointerHalo.scale.setScalar(0.85 + this.pointer.strength * 0.35);
    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.pointerPan * (this.mobile ? 0.12 : 0.28), 2.2, delta);
    this.camera.lookAt(this.cameraTarget);
    await this.postProcessing.renderAsync();

    if (elapsed - this.lastMetricsAt > 0.12) {
      this.lastMetricsAt = elapsed;
      const since = this.clock.elapsedTime - this.lastInteraction;
      const phase = this.dragging ? "wake" : this.pointer.strength > 0.12 ? "near" : since < 2.4 ? "settle" : "still";
      this.onMetrics({
        phase,
        wind: this.wind,
        windKph: 2 + this.wind * 22,
        openness: this.openness,
        transmission: this.transmission,
        sun: this.sun,
        sunTime: 6.5 + this.sun * 12,
        shadowDensity: (1 - this.transmission) * 0.72 + 0.16,
        pointerStrength: this.pointer.strength,
        canopyMotion: this.canopyMotion ?? 0,
        pan: this.pointerPan,
        frameMilliseconds: this.frameTimeEma,
      });
    }
  }

  applyCamera() {
    const distance = this.mobile ? 17.4 : 13.4;
    this.camera.position.set(0, this.mobile ? 0.42 : 0.26, distance);
    this.camera.lookAt(0, this.mobile ? 0.15 : 0.08, 0);
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    const { width, height } = this.getViewportSize();
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, width < 720 ? 0.72 : 0.92));
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.applyCamera();
  }

  getViewportSize() {
    const rect = this.container.getBoundingClientRect();
    return { width: Math.max(1, Math.round(rect.width || innerWidth)), height: Math.max(1, Math.round(rect.height || innerHeight)) };
  }

  getStats() {
    return {
      vertices: this.physics.vertexCount - 1,
      springs: this.physics.springCount,
      solverRate: this.mobile ? 90 : 144,
      dust: this.mobile ? 42 : 90,
      labels: { vertices: formatCount(this.physics.vertexCount - 1), springs: formatCount(this.physics.springCount) },
    };
  }

  async sampleDiagnostics() {
    const positions = new Float32Array(await this.renderer.getArrayBufferAsync(this.physics.positionData.value));
    const base = new Float32Array(await this.renderer.getArrayBufferAsync(this.bridge.baseData.value));
    let finite = true;
    let maxDisplacement = 0;
    for (let index = 1; index < this.physics.vertexCount; index += 1) {
      const offset = index * 4;
      const x = positions[offset], y = positions[offset + 1], z = positions[offset + 2];
      if (![x, y, z].every(Number.isFinite)) finite = false;
      maxDisplacement = Math.max(maxDisplacement, Math.hypot(x - base[offset], y - base[offset + 1], z - base[offset + 2]));
    }
    return { finite, count: this.physics.vertexCount - 1, maxDisplacement, frameMilliseconds: this.frameTimeEma };
  }

  destroy() {
    this.disposables.forEach((resource) => resource.dispose?.());
    this.renderer?.dispose();
  }
}

export class FallbackCurtainScene {
  constructor(container, { reducedMotion = false, onMetrics = () => {}, onPhase = () => {} } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.onMetrics = onMetrics;
    this.onPhase = onPhase;
    this.wind = 0.28;
    this.openness = 0.48;
    this.transmission = 0.58;
    this.sun = 0.58;
    this.pointerPan = 0;
    this.phase = "still";
    this.root = document.createElement("div");
    this.root.className = "fallback-room";
    this.root.setAttribute("aria-label", "2D 树影窗帘降级场景");
    this.root.innerHTML = '<div class="fallback-window"><div class="fallback-tree"></div></div><div class="fallback-foliage fallback-foliage-right"></div><div class="fallback-foliage fallback-foliage-left"></div><div class="fallback-light"></div><div class="fallback-curtain fallback-left"></div><div class="fallback-curtain fallback-right"></div><div class="fallback-floor"></div>';
    this.root.style.setProperty("--room-plate", `url("${CURTAIN_ASSET_ROOT}/architectural-room-v2.png")`);
    this.root.style.setProperty("--shadow-gobo", `url("${CURTAIN_ASSET_ROOT}/olive-shadow-gobo-v2.png")`);
    this.root.style.setProperty("--canopy-right", `url("${CURTAIN_ASSET_ROOT}/olive-canopy-right-v3.png")`);
    this.root.style.setProperty("--sprig-left", `url("${CURTAIN_ASSET_ROOT}/olive-sprig-left-v3.png")`);
    container.prepend(this.root);
    this.apply();
  }

  async init(onProgress = () => {}) { onProgress(1, "2D 日光房已就绪"); }
  apply() {
    this.root.style.setProperty("--wind", this.reducedMotion ? "0" : this.wind.toFixed(3));
    this.root.style.setProperty("--open", this.openness.toFixed(3));
    this.root.style.setProperty("--transmission", this.transmission.toFixed(3));
    this.root.style.setProperty("--sun", this.sun.toFixed(3));
    this.root.style.setProperty("--pointer-pan", this.pointerPan.toFixed(3));
  }
  setWind(value) { this.wind = clamp01(value); this.apply(); }
  setOpen(value) { this.openness = clamp01(value); this.apply(); }
  setTransmission(value) { this.transmission = clamp01(value); this.apply(); }
  setSun(value) { this.sun = clamp01(value); this.apply(); }
  setWindAngle() {}
  setPreset(name) {
    const preset = { dawn: { wind: .24, openness: .34, transmission: .46, sun: .1 }, noon: { wind: .52, openness: .64, transmission: .72, sun: .54 }, dusk: { wind: .36, openness: .42, transmission: .5, sun: .9 } }[name];
    if (!preset) return null;
    Object.assign(this, preset); this.apply(); return preset;
  }
  pointerMove(clientX, clientY, { dragging = false } = {}) {
    const rect = this.container.getBoundingClientRect();
    this.pointerPan = clamp01((clientX - rect.left) / rect.width) * 2 - 1;
    this.root.style.setProperty("--pointer-x", `${clientX - rect.left}px`);
    this.root.style.setProperty("--pointer-y", `${clientY - rect.top}px`);
    this.root.classList.add(dragging ? "is-wake" : "is-near");
    this.phase = dragging ? "wake" : "near";
    this.onPhase(this.phase);
    this.apply();
    return true;
  }
  pointerLeave() { this.root.classList.remove("is-near", "is-wake"); this.phase = "settle"; this.onPhase("settle"); }
  endDrag() { this.pointerLeave(); }
  toggleStructure() { return false; }
  reset() { this.setPreset("noon"); this.pointerLeave(); }
  resize() {}
  getStats() { return { vertices: 0, springs: 0, solverRate: 0, dust: 0, labels: { vertices: "0", springs: "0" } }; }
  async sampleDiagnostics() { return { fallback: true, finite: true, count: 0, maxDisplacement: 0, frameMilliseconds: 0 }; }
  async update() {
    this.onMetrics({ phase: this.phase, wind: this.wind, windKph: 2 + this.wind * 22, openness: this.openness, transmission: this.transmission, sun: this.sun, sunTime: 6.5 + this.sun * 12, shadowDensity: (1 - this.transmission) * .72 + .16, pointerStrength: this.phase === "near" ? .24 : this.phase === "wake" ? .8 : 0, canopyMotion: this.reducedMotion ? 0 : this.wind * .04, pan: this.pointerPan, frameMilliseconds: 0 });
  }
  destroy() { this.root.remove(); }
}
