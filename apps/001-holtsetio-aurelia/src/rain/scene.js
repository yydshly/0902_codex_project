import * as THREE from "three/webgpu";
import {
  Fn,
  attribute,
  clamp,
  cos,
  float,
  instanceIndex,
  instancedArray,
  mix,
  mrt,
  output,
  pass,
  positionLocal,
  sin,
  transformNormalToView,
  uniform,
  uv,
  vec3,
  vec4,
  varying,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { VerletPhysics } from "@aurelia-upstream/physics/verletPhysics.js";
import { SpringVisualizer } from "@aurelia-upstream/physics/springVisualizer.js";

const TAU = Math.PI * 2;
const IMPACT_SLOTS = 8;

function seeded(index) {
  const value = Math.sin(index * 91.733 + 17.71) * 43758.5453;
  return value - Math.floor(value);
}

function formatCount(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value);
}

function canopyHeight(x, z, radius = 5.15) {
  const normalized = Math.min(1, Math.hypot(x, z) / radius);
  const angle = Math.atan2(z, x);
  const panel = Math.cos(angle * 12) * 0.035 * normalized;
  return 1.22 - Math.pow(normalized, 1.58) * 1.34 + panel;
}

class RainMembraneBridge {
  constructor(physics) {
    this.physics = physics;
    this.uniforms = {
      elapsed: uniform(0),
      wetness: uniform(0.08),
      tension: uniform(0.78),
      wind: uniform(0.16),
    };
    this.impacts = Array.from({ length: IMPACT_SLOTS }, () => uniform(new THREE.Vector4(99, 99, 9, 0)));
    this.resetRequested = false;
  }

  async bake() {
    const metadata = new Float32Array(this.physics.vertexCount * 4);
    this.physics.vertices.forEach((vertex) => {
      const radius = Math.hypot(vertex.value.x, vertex.value.z);
      metadata.set([
        vertex.value.x,
        vertex.value.z,
        Math.min(1, radius / 5.15),
        vertex.value.y,
      ], vertex.id * 4);
    });
    this.metadata = instancedArray(metadata, "vec4");

    const stiffness = new Float32Array(this.physics.springCount);
    this.physics.springs.forEach((spring) => { stiffness[spring.id] = spring.stiffness; });
    this.baseStiffness = instancedArray(stiffness, "float");

    this.stiffnessKernel = Fn(() => {
      const base = this.baseStiffness.element(instanceIndex);
      const wetSoftening = float(1).sub(this.uniforms.wetness.mul(0.34));
      const tensionScale = float(0.68).add(this.uniforms.tension.mul(0.62));
      this.physics.springParamsData.element(instanceIndex).x.assign(base.mul(wetSoftening).mul(tensionScale));
    })().compute(this.physics.springCount);

    this.forceKernel = Fn(() => {
      const meta = this.metadata.element(instanceIndex);
      const position = this.physics.positionData.element(instanceIndex).toVar();
      const force = this.physics.forceData.element(instanceIndex).toVar();
      const movable = position.w;
      const ringProfile = clamp(float(1).sub(meta.z.sub(0.58).abs().div(0.46)), 0, 1);
      const panelPocket = sin(meta.x.mul(2.7).add(meta.y.mul(2.1))).mul(0.5).add(0.5);
      const wetWeight = this.uniforms.wetness.mul(ringProfile).mul(float(0.7).add(panelPocket.mul(0.3))).mul(-0.00000052);
      const windPulse = sin(this.uniforms.elapsed.mul(0.72).add(meta.x.mul(0.42))).mul(this.uniforms.wind).mul(0.00000042);
      const windCross = cos(this.uniforms.elapsed.mul(0.41).sub(meta.y.mul(0.36))).mul(this.uniforms.wind).mul(0.00000026);
      const impactForce = float(0).toVar();

      this.impacts.forEach((impactUniform) => {
        const impact = impactUniform;
        const dx = meta.x.sub(impact.x);
        const dz = meta.y.sub(impact.y);
        const distance = dx.mul(dx).add(dz.mul(dz)).sqrt();
        const age = impact.z;
        const envelope = clamp(float(1).sub(age.div(1.48)), 0, 1);
        const front = age.mul(3.9);
        const waveBand = clamp(float(1).sub(distance.sub(front).abs().div(0.62)), 0, 1);
        const localCrater = clamp(float(1).sub(distance.div(float(0.58).add(age.mul(0.72)))), 0, 1)
          .mul(clamp(float(1).sub(age.div(0.38)), 0, 1));
        const rebound = sin(age.mul(21).sub(distance.mul(3.2)));
        impactForce.addAssign(
          waveBand.mul(rebound).mul(impact.w).mul(envelope).mul(0.0000002)
            .sub(localCrater.mul(impact.w).mul(0.00000072)),
        );
      });

      force.addAssign(vec3(windPulse, wetWeight.add(impactForce), windCross).mul(movable));
      const speed = force.length().max(0.0000001);
      force.mulAssign(clamp(float(0.00014).div(speed), 0, 1));
      const base = vec3(meta.x, meta.w, meta.y);
      const offset = position.xyz.sub(base).toVar();
      const distanceFromBase = offset.length().max(0.00001);
      const displacementBudget = float(0.2).add(this.uniforms.wetness.mul(0.34));
      const positionScale = clamp(displacementBudget.div(distanceFromBase), 0, 1);
      position.xyz.assign(base.add(offset.mul(positionScale)));
      this.physics.positionData.element(instanceIndex).xyz.assign(position.xyz);
      this.physics.forceData.element(instanceIndex).assign(force);
    })().compute(this.physics.vertexCount);

    this.resetKernel = Fn(() => {
      const meta = this.metadata.element(instanceIndex);
      this.physics.positionData.element(instanceIndex).xyz.assign(vec3(meta.x, meta.w, meta.y));
      this.physics.forceData.element(instanceIndex).assign(vec3(0));
    })().compute(this.physics.vertexCount);

    await this.physics.renderer.computeAsync(this.stiffnessKernel);
  }

  setState({ elapsed, wetness, tension, wind, impacts }) {
    this.uniforms.elapsed.value = elapsed;
    this.uniforms.wetness.value = wetness;
    this.uniforms.tension.value = tension;
    this.uniforms.wind.value = wind;
    impacts.forEach((impact, index) => {
      this.impacts[index].value.set(impact.x, impact.z, impact.age, impact.strength);
    });
  }

  async update() {
    if (this.resetRequested) {
      this.resetRequested = false;
      await this.physics.renderer.computeAsync(this.resetKernel);
    }
    await this.physics.renderer.computeAsync(this.stiffnessKernel);
    await this.physics.renderer.computeAsync(this.forceKernel);
  }

  requestReset() {
    this.resetRequested = true;
  }
}

export class RainMembraneScene {
  constructor(container, {
    reducedMotion = false,
    onMetrics = () => {},
    onImpact = () => {},
  } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.onMetrics = onMetrics;
    this.onImpact = onImpact;
    this.quality = window.innerWidth < 768 ? 0.62 : 1;
    this.radius = 5.15;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pointerTarget = new THREE.Vector2();
    this.hitPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.25);
    this.hitPoint = new THREE.Vector3();
    this.cameraTarget = new THREE.Vector3(0, 0.15, 0);
    this.intensity = 0.42;
    this.wetness = 0.08;
    this.tension = 0.78;
    this.wind = 0.16;
    this.drainEnergy = 0;
    this.impactCursor = 0;
    this.impactCount = 0;
    this.lastAutoImpactAt = -10;
    this.impactSlots = Array.from({ length: IMPACT_SLOTS }, () => ({ x: 99, z: 99, age: 9, strength: 0 }));
    this.dummy = new THREE.Object3D();
    this.disposables = [];
    this.structureVisible = false;
    this.lastMetricsAt = -1;
    this.frameCount = 0;
  }

  async init(onProgress = () => {}) {
    globalThis.__AURELIA_LAB_CONFIG__ = {
      ...(globalThis.__AURELIA_LAB_CONFIG__ ?? {}),
      stepsPerSecond: this.quality < 1 ? 90 : 150,
    };

    this.renderer = new THREE.WebGPURenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality < 1 ? 0.78 : 0.9));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.82;
    await this.renderer.init();
    if (!this.renderer.backend?.isWebGPUBackend) throw new Error("没有可用的 WebGPU 后端");
    this.renderer.domElement.setAttribute("aria-label", "可交互雨落伞面 WebGPU 场景");
    this.container.prepend(this.renderer.domElement);
    onProgress(0.12, "建立 WebGPU 雨场");

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x02070b);
    this.scene.fog = new THREE.FogExp2(0x02070b, 0.034);
    this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.08, 80);
    this.camera.position.set(this.quality < 1 ? 9.2 : 8.45, this.quality < 1 ? 7.2 : 6.1, this.quality < 1 ? 13.8 : 11.9);
    this.camera.lookAt(this.cameraTarget);

    this.scene.add(new THREE.HemisphereLight(0x8eddf5, 0x05080b, 0.72));
    const moon = new THREE.DirectionalLight(0x9edfff, 3.1);
    moon.position.set(-4, 9, 6);
    const warm = new THREE.PointLight(0xffbb72, 40, 24, 2);
    warm.position.set(4.5, 2.4, 3.2);
    const acid = new THREE.PointLight(0xc8ff68, 28, 19, 2);
    acid.position.set(-4.8, -0.5, -3.2);
    this.scene.add(moon, warm, acid);

    this.createGroundAtmosphere();
    onProgress(0.23, "形成夜雨空间");

    this.physics = new VerletPhysics(this.renderer);
    this.bridge = new RainMembraneBridge(this.physics);
    this.physics.addObject(this.bridge);
    this.physics.addVertex(new THREE.Vector3(100, 100, 100), true);
    this.buildTopology();
    onProgress(0.44, "编织伞骨与膜面约束");
    await this.physics.bake();
    this.physics.uniforms.dampening.value = 0.966;
    this.physics.setMouseRay(new THREE.Vector3(500, 500, 500), new THREE.Vector3(1, 0, 0));
    onProgress(0.62, "编译 Aurelia GPU 求解器");

    this.createMembrane();
    this.createRibsAndHandle();
    this.createStructureLayer();
    this.createRainField();
    this.createImpactVfx();
    this.createWaterPockets();
    this.createReticle();
    onProgress(0.86, "连接雨滴、积水与可视反馈");

    this.setupPostProcessing();
    this.resize();
    onProgress(1, "雨落伞面已就绪");
  }

  buildTopology() {
    const spokes = this.quality < 1 ? 24 : 36;
    const rings = this.quality < 1 ? 13 : 18;
    const grid = Array.from({ length: rings + 1 }, () => []);
    const center = this.physics.addVertex(new THREE.Vector3(0, canopyHeight(0, 0, this.radius), 0), true);
    grid[0].push(center);

    for (let ring = 1; ring <= rings; ring += 1) {
      const normalized = ring / rings;
      for (let spoke = 0; spoke < spokes; spoke += 1) {
        const angle = spoke / spokes * TAU;
        const radius = this.radius * normalized;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const position = new THREE.Vector3(x, canopyHeight(x, z, this.radius), z);
        const rib = spoke % (spokes / 12) === 0;
        const fixed = ring === rings;
        const vertex = this.physics.addVertex(position, fixed);
        grid[ring].push(vertex);
        const inner = ring === 1 ? center : grid[ring - 1][spoke];
        this.physics.addSpring(inner, vertex, rib ? 0.00128 : 0.00074);
        if (rib && !fixed) {
          const ribAnchor = this.physics.addVertex(position.clone(), true);
          this.physics.addSpring(ribAnchor, vertex, 0.0034, 1);
        }
        if (ring > 2) this.physics.addSpring(grid[ring - 2][spoke], vertex, rib ? 0.00024 : 0.00013);
      }
      for (let spoke = 0; spoke < spokes; spoke += 1) {
        const next = (spoke + 1) % spokes;
        this.physics.addSpring(grid[ring][spoke], grid[ring][next], 0.00068);
        if (ring > 1) {
          this.physics.addSpring(grid[ring - 1][spoke], grid[ring][next], 0.0002);
          this.physics.addSpring(grid[ring - 1][next], grid[ring][spoke], 0.0002);
        }
      }
    }
    this.topology = { grid, center, spokes, rings };
  }

  createMembrane() {
    const { grid, center, spokes, rings } = this.topology;
    const vertices = [center];
    for (let ring = 1; ring <= rings; ring += 1) vertices.push(...grid[ring]);
    const vertexCount = vertices.length;
    const positions = new Float32Array(vertexCount * 3);
    const ids = new Uint32Array(vertexCount);
    const neighbors = new Uint32Array(vertexCount * 4);
    const radial = new Float32Array(vertexCount);
    const panelPhase = new Float32Array(vertexCount);
    const uvs = new Float32Array(vertexCount * 2);
    const indices = [];
    const flat = (ring, spoke) => ring === 0 ? 0 : 1 + (ring - 1) * spokes + (spoke + spokes) % spokes;

    vertices.forEach((vertex, index) => {
      positions[index * 3] = vertex.value.x;
      positions[index * 3 + 1] = vertex.value.y;
      positions[index * 3 + 2] = vertex.value.z;
      ids[index] = vertex.id;
      const radius = Math.hypot(vertex.value.x, vertex.value.z);
      radial[index] = radius / this.radius;
      const angle = Math.atan2(vertex.value.z, vertex.value.x);
      panelPhase[index] = ((angle / TAU) + 1) % 1;
      uvs.set([vertex.value.x / (this.radius * 2) + 0.5, vertex.value.z / (this.radius * 2) + 0.5], index * 2);
    });

    neighbors.set([grid[1][0].id, grid[1][Math.floor(spokes / 2)].id, grid[1][Math.floor(spokes / 4)].id, grid[1][Math.floor(spokes * 0.75)].id], 0);
    for (let ring = 1; ring <= rings; ring += 1) {
      for (let spoke = 0; spoke < spokes; spoke += 1) {
        const index = flat(ring, spoke);
        const inner = ring === 1 ? center : grid[ring - 1][spoke];
        const outer = ring === rings ? grid[ring][spoke] : grid[ring + 1][spoke];
        neighbors.set([
          grid[ring][(spoke - 1 + spokes) % spokes].id,
          grid[ring][(spoke + 1) % spokes].id,
          inner.id,
          outer.id,
        ], index * 4);
      }
    }

    for (let spoke = 0; spoke < spokes; spoke += 1) {
      const next = (spoke + 1) % spokes;
      indices.push(0, flat(1, spoke), flat(1, next));
    }
    for (let ring = 1; ring < rings; ring += 1) {
      for (let spoke = 0; spoke < spokes; spoke += 1) {
        const next = (spoke + 1) % spokes;
        const a = flat(ring, spoke);
        const b = flat(ring, next);
        const c = flat(ring + 1, spoke);
        const d = flat(ring + 1, next);
        if ((ring + spoke) % 2) indices.push(a, c, b, b, c, d);
        else indices.push(a, c, d, a, d, b);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("physicsId", new THREE.BufferAttribute(ids, 1));
    geometry.setAttribute("neighborIds", new THREE.BufferAttribute(neighbors, 4));
    geometry.setAttribute("radial", new THREE.BufferAttribute(radial, 1));
    geometry.setAttribute("panelPhase", new THREE.BufferAttribute(panelPhase, 1));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhysicalNodeMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
      depthWrite: true,
      roughness: 0.36,
      metalness: 0.1,
      clearcoat: 0.72,
      clearcoatRoughness: 0.2,
      iridescence: 0.3,
      iridescenceIOR: 1.38,
    });
    const viewNormal = varying(vec3(0), "rainMembraneNormal");
    const pulseGlow = () => {
      const physicsId = attribute("physicsId");
      const current = this.physics.positionData.element(physicsId).xyz;
      const glow = float(0).toVar();
      this.bridge.impacts.forEach((impactUniform) => {
        const impact = impactUniform;
        const dx = current.x.sub(impact.x);
        const dz = current.z.sub(impact.y);
        const distance = dx.mul(dx).add(dz.mul(dz)).sqrt();
        const envelope = clamp(float(1).sub(impact.z.div(1.5)), 0, 1);
        const band = clamp(float(1).sub(distance.sub(impact.z.mul(3.9)).abs().div(0.32)), 0, 1);
        glow.addAssign(band.mul(impact.w).mul(envelope));
      });
      return clamp(glow, 0, 1);
    };
    material.positionNode = Fn(() => {
      const physicsId = attribute("physicsId");
      const adjacent = attribute("neighborIds");
      const current = this.physics.positionData.element(physicsId).xyz;
      const left = this.physics.positionData.element(adjacent.x).xyz;
      const right = this.physics.positionData.element(adjacent.y).xyz;
      const inner = this.physics.positionData.element(adjacent.z).xyz;
      const outer = this.physics.positionData.element(adjacent.w).xyz;
      const normalRaw = right.sub(left).cross(outer.sub(inner)).toVar();
      const normal = normalRaw.div(normalRaw.length().max(0.0001));
      viewNormal.assign(transformNormalToView(normal));
      return current;
    })();
    material.normalNode = viewNormal.normalize();
    material.colorNode = Fn(() => {
      const radius = attribute("radial");
      const phase = attribute("panelPhase");
      const panel = sin(phase.mul(TAU * 12)).mul(0.5).add(0.5);
      const base = mix(vec3(0.028, 0.19, 0.25), vec3(0.055, 0.38, 0.46), panel.mul(0.52));
      const wet = mix(base, vec3(0.045, 0.23, 0.35), this.bridge.uniforms.wetness.mul(0.8));
      const rim = radius.pow(4).mul(0.12);
      return mix(wet, vec3(0.2, 0.42, 0.31), clamp(rim, 0, 0.12));
    })();
    material.emissiveNode = Fn(() => {
      const radius = attribute("radial");
      const pulse = pulseGlow();
      const panelLine = sin(attribute("panelPhase").mul(TAU * 12)).abs().pow(14);
      return vec3(0.12, 0.52, 0.62).mul(float(0.026).add(radius.pow(7).mul(0.08)).add(panelLine.mul(0.045)))
        .add(vec3(1, 0.34, 0.08).mul(pulse.mul(0.08)));
    })();
    material.mrtNode = mrt({
      bloomIntensity: Fn(() => {
        const pulse = pulseGlow();
        const rim = attribute("radial").pow(9).mul(0.07);
        return vec4(float(0.012).add(pulse.mul(0.16)).add(rim), pulse.mul(0.35), 0, 1);
      })(),
    });

    this.membrane = new THREE.Mesh(geometry, material);
    this.membrane.frustumCulled = false;
    this.membrane.renderOrder = 8;
    this.scene.add(this.membrane);
    this.disposables.push(geometry, material);
  }

  createRibsAndHandle() {
    this.ribGroup = new THREE.Group();
    const ribMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x26383b,
      emissive: 0x78a62e,
      emissiveIntensity: 0.34,
      metalness: 0.82,
      roughness: 0.24,
    });
    for (let rib = 0; rib < 12; rib += 1) {
      const angle = rib / 12 * TAU;
      const points = [];
      for (let step = 0; step <= 10; step += 1) {
        const radius = this.radius * step / 10;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        points.push(new THREE.Vector3(x, canopyHeight(x, z, this.radius) - 0.055, z));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const ribMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.028, 6, false), ribMaterial);
      this.ribGroup.add(ribMesh);
      this.disposables.push(ribMesh.geometry);
    }

    const rimPoints = [];
    for (let index = 0; index <= 96; index += 1) {
      const angle = index / 96 * TAU;
      const x = Math.cos(angle) * this.radius;
      const z = Math.sin(angle) * this.radius;
      rimPoints.push(new THREE.Vector3(x, canopyHeight(x, z, this.radius), z));
    }
    const rim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rimPoints, true), 128, 0.036, 6, true), ribMaterial);
    this.ribGroup.add(rim);
    this.disposables.push(rim.geometry);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.052, 4.1, 10), ribMaterial);
    shaft.position.y = -0.82;
    shaft.scale.set(1.35, 1, 1.35);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.1, 0.28, 12), ribMaterial);
    hub.position.y = 1.12;
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.055, 8, 56, Math.PI * 1.36), ribMaterial);
    hook.position.set(0.34, -2.84, 0);
    hook.rotation.z = Math.PI * 0.23;
    this.ribGroup.add(shaft, hub, hook);
    this.scene.add(this.ribGroup);
    this.disposables.push(ribMaterial, shaft.geometry, hub.geometry, hook.geometry);
  }

  createStructureLayer() {
    this.springVisualizer = new SpringVisualizer(this.physics);
    const { material, object } = this.springVisualizer;
    material.color = new THREE.Color(0xc7ff64);
    material.transparent = true;
    material.opacity = 0.17;
    material.blending = THREE.AdditiveBlending;
    material.depthWrite = false;
    material.mrtNode = mrt({ bloomIntensity: vec4(0.085, 0.08, 0, 1) });
    object.renderOrder = 12;
    object.visible = false;
    this.structureObject = object;
    this.scene.add(object);

    const sourceGeometry = new THREE.OctahedronGeometry(1, 0);
    const markerGeometry = new THREE.InstancedBufferGeometry();
    markerGeometry.copy(sourceGeometry);
    markerGeometry.instanceCount = this.physics.vertexCount;
    sourceGeometry.dispose();
    const markerIds = new Uint32Array(this.physics.vertexCount);
    markerIds.forEach((_, index) => { markerIds[index] = index; });
    const markerIdData = instancedArray(markerIds, "uint");
    const markerMaterial = new THREE.MeshBasicNodeMaterial({ transparent: true, opacity: 0.86, depthWrite: false });
    markerMaterial.positionNode = Fn(() => {
      const id = markerIdData.element(instanceIndex);
      return this.physics.positionData.element(id).xyz.add(positionLocal.mul(0.034));
    })();
    markerMaterial.color = new THREE.Color(0xd9ff86);
    markerMaterial.mrtNode = mrt({ bloomIntensity: vec4(0.12, 0, 0, 1) });
    this.nodeMarkers = new THREE.Mesh(markerGeometry, markerMaterial);
    this.nodeMarkers.frustumCulled = false;
    this.nodeMarkers.visible = false;
    this.nodeMarkers.renderOrder = 13;
    this.scene.add(this.nodeMarkers);
    this.disposables.push(markerGeometry, markerMaterial);
  }

  createGroundAtmosphere() {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(16, 96),
      new THREE.MeshPhysicalMaterial({ color: 0x02080c, roughness: 0.2, metalness: 0.42, transparent: true, opacity: 0.72 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.28;
    this.scene.add(floor);
    this.disposables.push(floor.geometry, floor.material);

    const rings = [];
    for (let index = 0; index < 7; index += 1) {
      const radius = 3.8 + index * 1.55;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius, radius + 0.012, 128),
        new THREE.MeshBasicMaterial({ color: index % 2 ? 0x2f7f93 : 0x6eb9ca, transparent: true, opacity: 0.05, side: THREE.DoubleSide }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -3.25;
      rings.push(ring);
      this.scene.add(ring);
      this.disposables.push(ring.geometry, ring.material);
    }
    this.floorRings = rings;
  }

  createRainField() {
    this.dropCount = this.quality < 1 ? 100 : 220;
    const geometry = new THREE.CylinderGeometry(0.008, 0.014, 0.34, 4, 1, true);
    const material = new THREE.MeshBasicMaterial({
      color: 0x9eeaff,
      transparent: true,
      opacity: 0.54,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.rainMesh = new THREE.InstancedMesh(geometry, material, this.dropCount);
    this.rainMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.rainMesh.frustumCulled = false;
    this.rainMesh.renderOrder = 18;
    this.drops = Array.from({ length: this.dropCount }, (_, index) => ({
      x: (seeded(index * 3) - 0.5) * 15,
      y: 1.8 + seeded(index * 5 + 1) * 9,
      z: (seeded(index * 7 + 2) - 0.5) * 14,
      speed: 5.5 + seeded(index * 11 + 4) * 8,
      stretch: 0.7 + seeded(index * 13 + 9) * 1.9,
      seed: index * 17 + 1,
    }));
    this.scene.add(this.rainMesh);
    this.disposables.push(geometry, material);
  }

  createImpactVfx() {
    this.wavePool = Array.from({ length: 16 }, (_, index) => {
      const group = new THREE.Group();
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.92, 1, 96),
        new THREE.MeshBasicMaterial({ color: index % 3 ? 0x8cecff : 0xffb161, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
      );
      ring.rotation.x = -Math.PI / 2;
      group.add(ring);
      group.visible = false;
      group.userData = { active: false, age: 0, strength: 0, ring };
      this.scene.add(group);
      this.disposables.push(ring.geometry, ring.material);
      return group;
    });
    this.waveCursor = 0;

    const splashGeometry = new THREE.TetrahedronGeometry(0.035, 0);
    const splashMaterial = new THREE.MeshBasicMaterial({ color: 0xcff7ff, transparent: true, opacity: 0.78, blending: THREE.AdditiveBlending, depthWrite: false });
    const splashCount = this.quality < 1 ? 42 : 90;
    this.splashMesh = new THREE.InstancedMesh(splashGeometry, splashMaterial, splashCount);
    this.splashMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.splashMesh.frustumCulled = false;
    this.splashMesh.renderOrder = 20;
    this.splashes = Array.from({ length: splashCount }, (_, index) => ({ active: false, age: 0, life: 0.4, position: new THREE.Vector3(999 + index, 0, 0), velocity: new THREE.Vector3() }));
    this.splashCursor = 0;
    this.scene.add(this.splashMesh);
    this.disposables.push(splashGeometry, splashMaterial);
  }

  createWaterPockets() {
    this.waterPockets = [];
    const geometry = new THREE.CircleGeometry(0.38, 40);
    for (let index = 0; index < 12; index += 1) {
      const angle = (index + 0.5) / 12 * TAU;
      const radius = this.radius * 0.58;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x6ee9ff,
        emissive: 0x164f63,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0,
        roughness: 0.05,
        metalness: 0.08,
        clearcoat: 1,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const pocket = new THREE.Mesh(geometry, material);
      pocket.position.set(x, canopyHeight(x, z, this.radius) + 0.035, z);
      pocket.rotation.x = -Math.PI / 2;
      pocket.rotation.z = -angle;
      pocket.scale.set(0.98, 0.3, 1);
      pocket.renderOrder = 14;
      this.waterPockets.push(pocket);
      this.scene.add(pocket);
      this.disposables.push(material);
    }
    this.disposables.push(geometry);
  }

  createReticle() {
    const material = new THREE.MeshBasicMaterial({ color: 0xffbd6c, transparent: true, opacity: 0.56, blending: THREE.AdditiveBlending, depthWrite: false });
    this.reticle = new THREE.Mesh(new THREE.RingGeometry(0.19, 0.22, 48), material);
    this.reticle.rotation.x = -Math.PI / 2;
    this.reticle.visible = false;
    this.reticle.renderOrder = 24;
    this.scene.add(this.reticle);
    this.disposables.push(this.reticle.geometry, material);
  }

  setupPostProcessing() {
    const scenePass = pass(this.scene, this.camera);
    scenePass.setMRT(mrt({ output, bloomIntensity: float(0) }));
    const colorPass = scenePass.getTextureNode();
    const bloomData = scenePass.getTextureNode("bloomIntensity");
    this.bloomPass = bloom(Fn(() => vec4(colorPass.rgb.mul(bloomData.r), 1))());
    this.bloomPass.threshold.value = 0.002;
    this.bloomPass.strength.value = this.quality < 1 ? 0.09 : 0.13;
    this.bloomPass.radius.value = 0.68;
    this.postProcessing = new THREE.PostProcessing(this.renderer);
    this.postProcessing.outputColorTransform = false;
    this.postProcessing.outputNode = Fn(() => {
      const mask = clamp(bloomData.r, 0, 1);
      const finalBloom = this.bloomPass.rgb.mul(float(1).sub(mask).add(bloomData.g).clamp(0, 1));
      return vec4(colorPass.rgb.add(finalBloom), 1).renderOutput();
    })();
  }

  setPointer(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointerTarget.x = (clientX - rect.left) / rect.width * 2 - 1;
    this.pointerTarget.y = -((clientY - rect.top) / rect.height * 2 - 1);
    this.raycaster.setFromCamera(this.pointerTarget, this.camera);
    this.physics.setMouseRay(this.raycaster.ray.origin, this.raycaster.ray.direction);
    if (this.raycaster.ray.intersectPlane(this.hitPlane, this.hitPoint) && Math.hypot(this.hitPoint.x, this.hitPoint.z) < this.radius * 1.02) {
      this.reticle.visible = true;
      this.reticle.position.set(this.hitPoint.x, canopyHeight(this.hitPoint.x, this.hitPoint.z, this.radius) + 0.045, this.hitPoint.z);
    } else {
      this.reticle.visible = false;
    }
  }

  clearPointer() {
    this.reticle.visible = false;
    this.pointerTarget.set(0, 0);
    this.physics.setMouseRay(new THREE.Vector3(500, 500, 500), new THREE.Vector3(1, 0, 0));
  }

  impactAtScreen(clientX, clientY, strength = 1.08) {
    this.setPointer(clientX, clientY);
    if (!this.reticle.visible) return false;
    this.addImpact(this.hitPoint.x, this.hitPoint.z, strength, true);
    return true;
  }

  addImpact(x, z, strength = 0.72, manual = false) {
    const radius = Math.hypot(x, z);
    if (radius > this.radius) return;
    const slot = this.impactSlots[this.impactCursor % IMPACT_SLOTS];
    this.impactCursor += 1;
    slot.x = x;
    slot.z = z;
    slot.age = 0;
    slot.strength = this.reducedMotion ? strength * 0.52 : strength;
    this.impactCount += 1;
    this.wetness = Math.min(1, this.wetness + (manual ? 0.012 : 0.00016) * strength);
    this.spawnWave(x, z, strength);
    this.spawnSplashes(x, z, manual ? 9 : 3, strength);
    this.onImpact({ x, z, strength, manual, count: this.impactCount });
  }

  spawnWave(x, z, strength) {
    const wave = this.wavePool[this.waveCursor % this.wavePool.length];
    this.waveCursor += 1;
    wave.position.set(x, canopyHeight(x, z, this.radius) + 0.052, z);
    wave.scale.setScalar(0.08);
    wave.visible = true;
    wave.userData.active = true;
    wave.userData.age = 0;
    wave.userData.strength = strength;
  }

  spawnSplashes(x, z, count, strength) {
    for (let item = 0; item < count; item += 1) {
      const index = this.splashCursor % this.splashes.length;
      this.splashCursor += 1;
      const splash = this.splashes[index];
      const angle = seeded(this.splashCursor * 5 + item) * TAU;
      const speed = 0.5 + seeded(this.splashCursor * 7 + item) * 1.15;
      splash.active = true;
      splash.age = 0;
      splash.life = 0.24 + seeded(this.splashCursor * 11) * 0.3;
      splash.position.set(x, canopyHeight(x, z, this.radius) + 0.06, z);
      splash.velocity.set(Math.cos(angle) * speed, (1.1 + seeded(this.splashCursor * 13) * 1.7) * strength, Math.sin(angle) * speed);
    }
  }

  setIntensity(value) {
    this.intensity = THREE.MathUtils.clamp(Number(value), 0.08, 1);
    this.wind = 0.08 + this.intensity * 0.42;
  }

  drain() {
    this.drainEnergy = 1;
  }

  setStructureVisible(visible) {
    this.structureVisible = Boolean(visible);
    this.structureObject.visible = this.structureVisible;
    this.nodeMarkers.visible = this.structureVisible;
    this.membrane.material.opacity = this.structureVisible ? 0.52 : 0.92;
    this.ribGroup.children.forEach((child) => {
      if (child.material) child.material.emissiveIntensity = this.structureVisible ? 0.72 : 0.34;
    });
  }

  reset() {
    this.intensity = 0.42;
    this.wetness = 0.08;
    this.tension = 0.78;
    this.wind = 0.16;
    this.drainEnergy = 0;
    this.impactSlots.forEach((impact) => Object.assign(impact, { x: 99, z: 99, age: 9, strength: 0 }));
    this.bridge.requestReset();
    this.camera.position.set(this.quality < 1 ? 9.2 : 8.45, this.quality < 1 ? 7.2 : 6.1, this.quality < 1 ? 13.8 : 11.9);
    this.camera.lookAt(this.cameraTarget);
    this.setStructureVisible(false);
  }

  updateRain(delta, elapsed) {
    const activeFraction = this.reducedMotion ? 0.18 + this.intensity * 0.22 : 0.16 + this.intensity * 0.74;
    const activeCount = Math.floor(this.dropCount * activeFraction);
    for (let index = 0; index < this.dropCount; index += 1) {
      const drop = this.drops[index];
      if (index >= activeCount) {
        this.dummy.position.set(100 + index, 100, 100);
        this.dummy.scale.setScalar(0);
      } else {
        drop.y -= drop.speed * delta * (0.8 + this.intensity * 0.55);
        drop.x += this.wind * delta * 0.95;
        const radius = Math.hypot(drop.x, drop.z);
        const height = canopyHeight(drop.x, drop.z, this.radius);
        if (radius < this.radius && drop.y <= height) {
          const impactInterval = THREE.MathUtils.lerp(0.42, 0.085, this.intensity);
          if (elapsed - this.lastAutoImpactAt >= impactInterval) {
            this.addImpact(drop.x, drop.z, 0.36 + seeded(drop.seed + this.impactCount) * 0.42, false);
            this.lastAutoImpactAt = elapsed;
          }
          this.respawnDrop(drop, index, true);
        } else if (drop.y < -3.2 || Math.abs(drop.x) > 8.5) {
          this.respawnDrop(drop, index, false);
        }
        this.dummy.position.set(drop.x, drop.y, drop.z);
        this.dummy.rotation.set(0, 0, -0.08 - this.wind * 0.12);
        this.dummy.scale.set(1, drop.stretch * (0.72 + this.intensity * 0.6), 1);
      }
      this.dummy.updateMatrix();
      this.rainMesh.setMatrixAt(index, this.dummy.matrix);
    }
    this.rainMesh.instanceMatrix.needsUpdate = true;
    this.rainMesh.material.opacity = 0.28 + this.intensity * 0.42;
    this.rainMesh.rotation.y = Math.sin(elapsed * 0.08) * 0.025;
  }

  respawnDrop(drop, index, overCanopy) {
    drop.x = (seeded(index * 23 + this.impactCount * 3) - 0.5) * (overCanopy ? 10.1 : 15);
    drop.z = (seeded(index * 29 + this.impactCount * 7) - 0.5) * (overCanopy ? 10.1 : 14);
    drop.y = 5.4 + seeded(index * 31 + this.impactCount * 11) * 6;
    drop.speed = 5.5 + seeded(index * 37 + this.impactCount) * 8;
  }

  updateImpacts(delta) {
    this.impactSlots.forEach((impact) => {
      if (impact.age <= 1.6) impact.age += delta;
      else impact.strength = 0;
    });
    this.wavePool.forEach((wave) => {
      if (!wave.userData.active) return;
      wave.userData.age += delta;
      const progress = wave.userData.age / 1.18;
      if (progress >= 1) {
        wave.userData.active = false;
        wave.visible = false;
        return;
      }
      const radius = 0.12 + progress * 4.2;
      wave.scale.setScalar(radius);
      wave.userData.ring.material.opacity = Math.sin(progress * Math.PI) * 0.2 * wave.userData.strength;
    });

    this.splashes.forEach((splash, index) => {
      if (!splash.active) {
        this.dummy.position.set(999 + index, 0, 0);
        this.dummy.scale.setScalar(0);
      } else {
        splash.age += delta;
        if (splash.age >= splash.life) {
          splash.active = false;
          this.dummy.position.set(999 + index, 0, 0);
          this.dummy.scale.setScalar(0);
        } else {
          splash.velocity.y -= delta * 5.2;
          splash.position.addScaledVector(splash.velocity, delta);
          const scale = Math.sin(splash.age / splash.life * Math.PI) * 1.4;
          this.dummy.position.copy(splash.position);
          this.dummy.rotation.set(splash.age * 5, splash.age * 8, splash.age * 3);
          this.dummy.scale.setScalar(scale);
        }
      }
      this.dummy.updateMatrix();
      this.splashMesh.setMatrixAt(index, this.dummy.matrix);
    });
    this.splashMesh.instanceMatrix.needsUpdate = true;
  }

  updateWater(delta, elapsed) {
    if (this.drainEnergy > 0.001) {
      this.wetness = Math.max(0.025, this.wetness - delta * (0.18 + this.drainEnergy * 0.34));
      this.drainEnergy *= Math.pow(0.32, delta);
    } else {
      this.wetness = Math.min(1, this.wetness + delta * this.intensity * this.intensity * 0.015);
    }
    this.tension = THREE.MathUtils.lerp(this.tension, 0.82 - this.wetness * 0.39, 1 - Math.pow(0.015, delta));
    this.physics.uniforms.dampening.value = 0.942 + this.tension * 0.028 - this.wetness * 0.008;
    this.waterPockets.forEach((pocket, index) => {
      const threshold = 0.08 + (index % 4) * 0.045;
      pocket.material.opacity = Math.max(0, this.wetness - threshold) * 0.24;
      const pulse = 0.92 + Math.sin(elapsed * 0.82 + index * 1.7) * 0.035;
      const spread = 0.58 + this.wetness * 0.62;
      pocket.scale.set(0.98 * spread * pulse, 0.3 * spread / pulse, 1);
      pocket.position.y = canopyHeight(pocket.position.x, pocket.position.z, this.radius) + 0.036 - this.wetness * 0.065;
    });
  }

  updateCamera(delta, elapsed) {
    this.pointer.lerp(this.pointerTarget, this.reducedMotion ? 0.018 : 0.045);
    const baseX = this.quality < 1 ? 9.2 : 8.45;
    const baseY = this.quality < 1 ? 7.2 : 6.1;
    const baseZ = this.quality < 1 ? 13.8 : 11.9;
    const drift = this.reducedMotion ? 0 : Math.sin(elapsed * 0.11) * 0.16;
    this.camera.position.x += (baseX + this.pointer.x * 0.42 + drift - this.camera.position.x) * Math.min(1, delta * 1.9);
    this.camera.position.y += (baseY + this.pointer.y * 0.24 - this.camera.position.y) * Math.min(1, delta * 1.9);
    this.camera.position.z += (baseZ - this.pointer.x * 0.22 - this.camera.position.z) * Math.min(1, delta * 1.9);
    this.camera.lookAt(this.cameraTarget);
  }

  async update(elapsed) {
    const delta = Math.min(this.clock.getDelta(), 0.04);
    this.frameCount += 1;
    this.updateRain(delta, elapsed);
    this.updateImpacts(delta);
    this.updateWater(delta, elapsed);
    this.updateCamera(delta, elapsed);
    this.bridge.setState({
      elapsed,
      wetness: this.wetness,
      tension: this.tension,
      wind: this.wind,
      impacts: this.impactSlots,
    });
    await this.physics.update(delta, elapsed);
    this.floorRings.forEach((ring, index) => {
      ring.material.opacity = 0.026 + this.intensity * 0.038 + Math.sin(elapsed * 0.45 - index * 0.8) * 0.008;
    });
    await this.postProcessing.renderAsync();

    if (elapsed - this.lastMetricsAt > 0.1) {
      this.lastMetricsAt = elapsed;
      const activeImpact = this.impactSlots.reduce((youngest, impact) => Math.min(youngest, impact.age), 9);
      const phase = this.drainEnergy > 0.03 || this.wetness > 0.55
        ? "retune"
        : this.wetness > 0.23
          ? "accumulate"
          : activeImpact < 0.16
            ? "impact"
            : activeImpact < 0.9
              ? "propagate"
              : "listen";
      this.onMetrics({
        intensity: this.intensity,
        wetness: this.wetness,
        tension: this.tension,
        frequency: 2.1 + this.tension * 4.6 - this.wetness * 0.8,
        impacts: this.impactCount,
        phase,
        draining: this.drainEnergy > 0.03,
      });
    }
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const quality = width < 768 ? 0.62 : 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality < 1 ? 0.78 : 0.9));
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  getStats() {
    return {
      vertices: this.physics.vertexCount,
      springs: this.physics.springCount,
      solverRate: this.quality < 1 ? 90 : 150,
      labels: {
        vertices: formatCount(this.physics.vertexCount),
        springs: formatCount(this.physics.springCount),
      },
    };
  }

  async sampleDiagnostics() {
    const positions = new Float32Array(await this.renderer.getArrayBufferAsync(this.physics.positionData.value));
    const metadata = new Float32Array(await this.renderer.getArrayBufferAsync(this.bridge.metadata.value));
    let finite = true;
    let maxDisplacement = 0;
    for (let index = 1; index < this.physics.vertexCount; index += 1) {
      const offset = index * 4;
      const x = positions[offset];
      const y = positions[offset + 1];
      const z = positions[offset + 2];
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) finite = false;
      const dx = x - metadata[offset];
      const dy = y - metadata[offset + 3];
      const dz = z - metadata[offset + 1];
      maxDisplacement = Math.max(maxDisplacement, Math.hypot(dx, dy, dz));
    }
    return {
      finite,
      count: this.physics.vertexCount - 1,
      maxDisplacement,
    };
  }

  destroy() {
    this.disposables.forEach((resource) => resource.dispose?.());
    this.renderer?.dispose();
  }
}
