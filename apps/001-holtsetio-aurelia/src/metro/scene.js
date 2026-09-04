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
  varying,
  vec3,
  vec4,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { VerletPhysics } from "@aurelia-upstream/physics/verletPhysics.js";
import { SpringVisualizer } from "@aurelia-upstream/physics/springVisualizer.js";

const TAU = Math.PI * 2;

export const STATIONS = [
  { id: "harbor", code: "M01", name: "港湾", position: [-5.35, 0.04, -1.05], capacity: 92, demand: 0.48 },
  { id: "mist", code: "M02", name: "雾桥", position: [-3.82, 0.06, -0.48], capacity: 74, demand: 0.54 },
  { id: "central", code: "M03", name: "中央环", position: [-1.95, 0.12, 0.18], capacity: 120, demand: 0.66, transfer: true },
  { id: "market", code: "M04", name: "市集", position: [0.05, 0.08, 0.58], capacity: 112, demand: 0.61, transfer: true },
  { id: "east", code: "M05", name: "东塔", position: [2.3, 0.09, 1.15], capacity: 84, demand: 0.52, transfer: true },
  { id: "cloud", code: "M06", name: "云港", position: [4.78, 0.04, 1.65], capacity: 76, demand: 0.43 },
  { id: "north", code: "M07", name: "北岸", position: [-3.9, 0.04, 2.58], capacity: 68, demand: 0.4 },
  { id: "theatre", code: "M08", name: "剧场", position: [-2.78, 0.09, 1.38], capacity: 88, demand: 0.57, transfer: true },
  { id: "academy", code: "M09", name: "学院", position: [-1.24, 0.04, -1.55], capacity: 70, demand: 0.58 },
  { id: "south", code: "M10", name: "南门", position: [-0.46, 0.03, -3.02], capacity: 66, demand: 0.46 },
  { id: "west", code: "M11", name: "西站", position: [-5.02, 0.04, 1.28], capacity: 72, demand: 0.45 },
  { id: "river", code: "M12", name: "河口", position: [2.02, 0.08, -0.76], capacity: 78, demand: 0.54, transfer: true },
  { id: "airport", code: "M13", name: "机场", position: [4.42, 0.03, -2.24], capacity: 75, demand: 0.42 },
  { id: "oldtown", code: "M14", name: "旧城", position: [0.02, 0.05, 2.76], capacity: 65, demand: 0.5 },
  { id: "newbay", code: "M15", name: "新湾", position: [4.08, 0.05, 0.02], capacity: 80, demand: 0.47 },
];

export const ROUTES = [
  { id: "tide", name: "潮汐线", color: 0x63eadb, stations: ["harbor", "mist", "central", "market", "east", "cloud"] },
  { id: "northsouth", name: "南北线", color: 0x6c8dff, stations: ["north", "theatre", "central", "academy", "south"] },
  { id: "river", name: "河流线", color: 0xb27cff, stations: ["west", "theatre", "market", "river", "airport"] },
  { id: "loop", name: "内环线", color: 0xffc75f, stations: ["oldtown", "east", "newbay", "river", "market", "oldtown"] },
];

const SCENARIOS = {
  commute: { flow: 4820, focus: "central", demand: 1, recovery: 0.58, capacityScale: {}, boosts: { central: 0.12, market: 0.09, academy: 0.07 } },
  event: { flow: 6380, focus: "theatre", demand: 1.18, recovery: 0.46, capacityScale: {}, boosts: { theatre: 0.34, west: 0.12, central: 0.08 } },
  closure: { flow: 5740, focus: "central", demand: 1.08, recovery: 0.36, capacityScale: { central: 0.42 }, boosts: { central: 0.42, theatre: 0.11, market: 0.13 } },
};

const stationIndexById = new Map(STATIONS.map((station, index) => [station.id, index]));
const routeEdges = ROUTES.flatMap((route, routeIndex) => route.stations.slice(0, -1).map((from, index) => ({
  routeIndex,
  from: stationIndexById.get(from),
  to: stationIndexById.get(route.stations[index + 1]),
})));

function seeded(index) {
  const value = Math.sin(index * 91.733 + 17.17) * 43758.5453;
  return value - Math.floor(value);
}

class CrowdPressureBridge {
  constructor(physics) {
    this.physics = physics;
    this.entries = [];
    this.uniforms = { elapsed: uniform(0), motionScale: uniform(1) };
    this.resetRequested = false;
  }

  register(anchor, node, stationIndex, base) {
    this.entries.push({ anchor, node, stationIndex, base: base.clone() });
  }

  async bake() {
    const metadata = new Float32Array(this.physics.vertexCount * 4);
    this.physics.vertices.forEach((vertex) => metadata.set([vertex.value.x, vertex.value.y, vertex.value.z, 0], vertex.id * 4));
    const pressure = new Float32Array(this.physics.vertexCount);
    this.entries.forEach(({ anchor, node, stationIndex, base }) => {
      metadata.set([base.x, base.y, base.z, 1 + stationIndex * 0.013], anchor.id * 4);
      metadata.set([base.x, base.y, base.z, 2 + stationIndex * 0.013], node.id * 4);
    });
    this.metadata = instancedArray(metadata, "vec4");
    this.pressureData = instancedArray(pressure, "float");

    this.forceKernel = Fn(() => {
      const meta = this.metadata.element(instanceIndex);
      const pressureValue = this.pressureData.element(instanceIndex);
      const position = this.physics.positionData.element(instanceIndex).toVar();
      const force = this.physics.forceData.element(instanceIndex).toVar();
      const anchorWave = sin(this.uniforms.elapsed.mul(1.1).add(meta.x.mul(0.42)).sub(meta.z.mul(0.37)))
        .mul(pressureValue).mul(this.uniforms.motionScale);

      If(meta.w.lessThan(1.5), () => {
        const lift = pressureValue.mul(pressureValue).mul(1.08);
        const lateral = anchorWave.mul(0.065);
        position.xyz.assign(meta.xyz.add(vec3(lateral, lift, lateral.mul(-0.72))));
        force.assign(vec3(0));
        this.physics.positionData.element(instanceIndex).xyz.assign(position.xyz);
        this.physics.forceData.element(instanceIndex).assign(force);
      });

      If(meta.w.greaterThan(1.5), () => {
        const pulse = sin(this.uniforms.elapsed.mul(2.4).add(meta.x.mul(0.9)).add(meta.z.mul(0.7)));
        const agitation = vec3(pulse.mul(0.00000012), pressureValue.mul(0.00000018), anchorWave.mul(0.00000016))
          .mul(pressureValue).mul(this.uniforms.motionScale);
        force.addAssign(agitation.mul(position.w));
        const offset = position.xyz.sub(meta.xyz).toVar();
        const displacement = offset.length().max(0.00001);
        const budget = float(0.42).add(pressureValue.mul(1.24));
        position.xyz.assign(meta.xyz.add(offset.mul(clamp(budget.div(displacement), 0, 1))));
        this.physics.positionData.element(instanceIndex).xyz.assign(position.xyz);
        this.physics.forceData.element(instanceIndex).assign(force);
      });
    })().compute(this.physics.vertexCount);

    this.resetKernel = Fn(() => {
      const meta = this.metadata.element(instanceIndex);
      this.physics.positionData.element(instanceIndex).xyz.assign(meta.xyz);
      this.physics.forceData.element(instanceIndex).assign(vec3(0));
    })().compute(this.physics.vertexCount);
  }

  setState(elapsed, pressures, motionScale) {
    this.uniforms.elapsed.value = elapsed;
    this.uniforms.motionScale.value = motionScale;
    const buffer = this.pressureData.value.array;
    this.entries.forEach(({ anchor, node, stationIndex }) => {
      buffer[anchor.id] = pressures[stationIndex];
      buffer[node.id] = pressures[stationIndex];
    });
    this.pressureData.value.needsUpdate = true;
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

export class MetroPulseScene {
  constructor(container, { reducedMotion = false, onMetrics = () => {}, onHover = () => {}, onSelect = () => {} } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.onMetrics = onMetrics;
    this.onHover = onHover;
    this.onSelect = onSelect;
    this.quality = (container.clientWidth || innerWidth) < 768 ? 0.62 : 1;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.disposables = [];
    this.dummy = new THREE.Object3D();
    this.packetColor = new THREE.Color();
    this.hotPacketColor = new THREE.Color(0xff5c3b);
    this.routeColors = ROUTES.map((route) => new THREE.Color(route.color));
    this.tempA = new THREE.Vector3();
    this.tempB = new THREE.Vector3();
    this.screenPoint = new THREE.Vector3();
    this.pressures = STATIONS.map((station) => station.demand);
    this.targets = [...this.pressures];
    this.events = new Float32Array(STATIONS.length);
    this.scenario = "commute";
    this.demandFactor = 1;
    this.recoveryFactor = 0.58;
    this.selectedIndex = stationIndexById.get("central");
    this.hoveredIndex = -1;
    this.eventCount = 0;
    this.eventAge = Number.POSITIVE_INFINITY;
    this.propagationSchedule = [];
    this.cameraYaw = 0.22;
    this.cameraPitch = 0;
    this.cameraYawTarget = this.cameraYaw;
    this.cameraPitchTarget = 0;
    this.cameraDistance = 13.7;
    this.cameraDistanceTarget = 13.7;
    this.dragStartYaw = 0;
    this.dragStartPitch = 0;
    this.structureVisible = false;
    this.lastMetricsAt = -1;
    this.lastHoverAt = -1;
    this.frameTimeEma = 0;
    this.pulseCursor = 0;
    this.packetCount = this.quality < 1 ? 72 : 150;
  }

  async init(onProgress = () => {}) {
    globalThis.__AURELIA_LAB_CONFIG__ = { ...(globalThis.__AURELIA_LAB_CONFIG__ ?? {}), stepsPerSecond: this.quality < 1 ? 90 : 144 };
    const viewport = this.getViewportSize();
    this.renderer = new THREE.WebGPURenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.quality < 1 ? 0.72 : 0.9));
    this.renderer.setSize(viewport.width, viewport.height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.26;
    await this.renderer.init();
    if (!this.renderer.backend?.isWebGPUBackend) throw new Error("没有可用的 WebGPU 后端");
    this.renderer.domElement.setAttribute("aria-label", "可选择站点并注入客流的 Aurelia WebGPU 地铁网络");
    this.container.prepend(this.renderer.domElement);
    onProgress(0.12, "建立 WebGPU 城市空间");

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050912);
    this.scene.fog = new THREE.FogExp2(0x050912, 0.026);
    this.camera = new THREE.PerspectiveCamera(42, viewport.width / viewport.height, 0.08, 80);
    this.applyCameraPosition();
    this.scene.add(new THREE.HemisphereLight(0x96f2eb, 0x080612, 0.72));
    const cyan = new THREE.PointLight(0x67e9dc, 44, 24, 2);
    cyan.position.set(5, 5, 5);
    const violet = new THREE.PointLight(0x8b70ff, 36, 22, 2);
    violet.position.set(-5, 2, -3);
    const warm = new THREE.PointLight(0xff8a55, 42, 18, 2);
    warm.position.set(-1, 6, 2);
    this.scene.add(cyan, violet, warm);

    this.createCityBase();
    onProgress(0.24, "生成城市基座与运营网格");

    this.physics = new VerletPhysics(this.renderer);
    this.bridge = new CrowdPressureBridge(this.physics);
    this.physics.addObject(this.bridge);
    this.physics.addVertex(new THREE.Vector3(100, 100, 100), true);
    this.buildNetworkTopology();
    onProgress(0.46, "连接站点锚、换乘线与回压弹簧");
    await this.physics.bake();
    this.physics.uniforms.dampening.value = 0.955;
    this.physics.setMouseRay(new THREE.Vector3(500, 500, 500), new THREE.Vector3(1, 0, 0));
    onProgress(0.64, "编译 Aurelia GPU 求解器");

    this.createRoutes();
    this.createStations();
    this.createStationLabels();
    this.createStructureLayer();
    this.createFlowPackets();
    this.createPulsePool();
    this.createSelectionMarker();
    this.createPickers();
    onProgress(0.84, "连接容量状态、客流粒子与传播反馈");

    this.setupPostProcessing();
    this.resize();
    this.setScenario("commute", false);
    onProgress(1, "城市拥塞网络已就绪");
  }

  createCityBase() {
    const floorGeometry = new THREE.CircleGeometry(10.8, 96);
    floorGeometry.rotateX(-Math.PI / 2);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x07101b, roughness: 0.82, metalness: 0.28, transparent: true, opacity: 0.82 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.34;
    this.scene.add(floor);
    this.disposables.push(floorGeometry, floorMaterial);

    const grid = new THREE.GridHelper(19, 28, 0x25576b, 0x122638);
    grid.position.y = -0.31;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    grid.material.depthWrite = false;
    this.scene.add(grid);
    this.disposables.push(grid.geometry, grid.material);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x376b79, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false });
    [4.2, 7.1, 9.4].forEach((radius, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 4, 160), ringMaterial.clone());
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.27 + index * 0.004;
      this.scene.add(ring);
      this.disposables.push(ring.geometry, ring.material);
    });

    const buildingCount = this.quality < 1 ? 54 : 96;
    const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
    const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x0d1724, roughness: 0.68, metalness: 0.32, transparent: true, opacity: 0.72 });
    const buildings = new THREE.InstancedMesh(buildingGeometry, buildingMaterial, buildingCount);
    for (let index = 0; index < buildingCount; index += 1) {
      const angle = seeded(index + 7) * TAU;
      const radius = 6.4 + seeded(index + 27) * 4.2;
      const height = 0.25 + seeded(index + 81) * 1.15;
      this.dummy.position.set(Math.cos(angle) * radius, -0.34 + height * 0.5, Math.sin(angle) * radius);
      this.dummy.scale.set(0.18 + seeded(index + 43) * 0.45, height, 0.18 + seeded(index + 57) * 0.45);
      this.dummy.rotation.y = seeded(index + 99) * TAU;
      this.dummy.updateMatrix();
      buildings.setMatrixAt(index, this.dummy.matrix);
    }
    buildings.frustumCulled = false;
    this.scene.add(buildings);
    this.disposables.push(buildingGeometry, buildingMaterial);
  }

  buildNetworkTopology() {
    this.stationNodes = STATIONS.map((station, index) => {
      const base = new THREE.Vector3(...station.position);
      const anchor = this.physics.addVertex(base.clone(), true);
      const node = this.physics.addVertex(base.clone().add(new THREE.Vector3(0, 0.015, 0)), false);
      this.physics.addSpring(anchor, node, station.transfer ? 0.00031 : 0.00024, 0);
      this.bridge.register(anchor, node, index, base);
      return { station, anchor, node, base };
    });

    const connected = new Set();
    routeEdges.forEach(({ from, to }) => {
      const key = from < to ? `${from}:${to}` : `${to}:${from}`;
      if (connected.has(key)) return;
      connected.add(key);
      this.physics.addSpring(this.stationNodes[from].node, this.stationNodes[to].node, 0.00016, 1);
    });
  }

  createRoutes() {
    this.routeObjects = ROUTES.map((route, routeIndex) => {
      const edges = routeEdges.filter((edge) => edge.routeIndex === routeIndex);
      const edgeIds = new Uint32Array(edges.length * 2);
      edges.forEach((edge, index) => edgeIds.set([this.stationNodes[edge.from].node.id, this.stationNodes[edge.to].node.id], index * 2));
      const edgeIdData = instancedArray(edgeIds, "uvec2");
      const baseGeometry = new THREE.BufferGeometry();
      baseGeometry.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0], 3));
      baseGeometry.setAttribute("endpoint", new THREE.Float32BufferAttribute([0, 1], 1));
      const geometry = new THREE.InstancedBufferGeometry();
      geometry.copy(baseGeometry);
      geometry.instanceCount = edges.length;
      baseGeometry.dispose();
      const routePressure = varying(float(0), `routePressure${routeIndex}`);
      const routeColor = uniform(new THREE.Color(route.color));
      const material = new THREE.LineBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      material.positionNode = Fn(() => {
        const ids = edgeIdData.element(instanceIndex);
        const endpoint = attribute("endpoint");
        const start = this.physics.positionData.element(ids.x).xyz;
        const end = this.physics.positionData.element(ids.y).xyz;
        const pressure = mix(this.bridge.pressureData.element(ids.x), this.bridge.pressureData.element(ids.y), endpoint);
        routePressure.assign(pressure);
        return mix(start, end, endpoint);
      })();
      material.colorNode = mix(routeColor, vec3(1, 0.24, 0.12), clamp(routePressure.sub(0.62).mul(2.3), 0, 1));
      material.opacityNode = float(0.36).add(routePressure.mul(0.42));
      material.mrtNode = mrt({ bloomIntensity: vec4(float(0.075).add(routePressure.mul(0.24)), routePressure, 0, 1) });
      const object = new THREE.LineSegments(geometry, material);
      object.frustumCulled = false;
      object.renderOrder = 9 + routeIndex;
      this.scene.add(object);
      this.disposables.push(geometry, material, edgeIdData.value);
      return { route, edges, object };
    });
  }

  createStations() {
    const ids = new Uint32Array(this.stationNodes.length);
    const transfer = new Float32Array(this.stationNodes.length);
    this.stationNodes.forEach(({ node, station }, index) => { ids[index] = node.id; transfer[index] = station.transfer ? 1 : 0; });
    this.nodeIdData = instancedArray(ids, "uint");
    this.transferData = instancedArray(transfer, "float");

    const sourceGeometry = new THREE.IcosahedronGeometry(1, 2);
    const geometry = new THREE.InstancedBufferGeometry();
    geometry.copy(sourceGeometry);
    geometry.instanceCount = this.stationNodes.length;
    sourceGeometry.dispose();
    const stationPressure = varying(float(0), "metroStationPressure");
    const material = new THREE.MeshPhysicalNodeMaterial({ roughness: 0.2, metalness: 0.64, clearcoat: 0.78, clearcoatRoughness: 0.18 });
    material.positionNode = Fn(() => {
      const id = this.nodeIdData.element(instanceIndex);
      const pressure = this.bridge.pressureData.element(id);
      const transferNode = this.transferData.element(instanceIndex);
      stationPressure.assign(pressure);
      const size = float(0.11).add(transferNode.mul(0.055)).add(pressure.mul(0.095));
      return this.physics.positionData.element(id).xyz.add(positionLocal.mul(size));
    })();
    material.colorNode = mix(vec3(0.32, 0.95, 0.86), vec3(1, 0.22, 0.1), clamp(stationPressure.sub(0.48).mul(1.55), 0, 1));
    material.emissiveNode = mix(vec3(0.03, 0.24, 0.22), vec3(0.8, 0.07, 0.02), clamp(stationPressure.sub(0.58).mul(1.9), 0, 1));
    material.mrtNode = mrt({ bloomIntensity: vec4(float(0.12).add(stationPressure.mul(0.32)), stationPressure, 0, 1) });
    this.stationMesh = new THREE.Mesh(geometry, material);
    this.stationMesh.frustumCulled = false;
    this.stationMesh.renderOrder = 16;
    this.scene.add(this.stationMesh);
    this.disposables.push(geometry, material, this.nodeIdData.value, this.transferData.value);

    const ringSource = new THREE.TorusGeometry(1, 0.08, 5, 36);
    ringSource.rotateX(Math.PI / 2);
    const ringGeometry = new THREE.InstancedBufferGeometry();
    ringGeometry.copy(ringSource);
    ringGeometry.instanceCount = this.stationNodes.length;
    ringSource.dispose();
    const ringPressure = varying(float(0), "metroRingPressure");
    const ringMaterial = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    ringMaterial.positionNode = Fn(() => {
      const id = this.nodeIdData.element(instanceIndex);
      const pressure = this.bridge.pressureData.element(id);
      const transferNode = this.transferData.element(instanceIndex);
      ringPressure.assign(pressure);
      const scale = float(0.17).add(transferNode.mul(0.1)).add(pressure.mul(0.1));
      return this.physics.positionData.element(id).xyz.add(positionLocal.mul(scale));
    })();
    ringMaterial.colorNode = mix(vec3(0.38, 0.82, 1), vec3(1, 0.43, 0.12), clamp(ringPressure.sub(0.5).mul(1.7), 0, 1));
    ringMaterial.opacityNode = float(0.22).add(ringPressure.mul(0.4));
    ringMaterial.mrtNode = mrt({ bloomIntensity: vec4(float(0.08).add(ringPressure.mul(0.25)), ringPressure, 0, 1) });
    this.stationRings = new THREE.Mesh(ringGeometry, ringMaterial);
    this.stationRings.frustumCulled = false;
    this.stationRings.renderOrder = 17;
    this.scene.add(this.stationRings);
    this.disposables.push(ringGeometry, ringMaterial);

    const pedestalGeometry = new THREE.CylinderGeometry(1, 1.5, 1, 24, 1, true);
    const pedestalMaterial = new THREE.MeshBasicMaterial({ color: 0x244154, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide });
    this.pedestals = new THREE.InstancedMesh(pedestalGeometry, pedestalMaterial, STATIONS.length);
    this.pedestals.frustumCulled = false;
    this.scene.add(this.pedestals);
    this.disposables.push(pedestalGeometry, pedestalMaterial);
  }

  createStationLabels() {
    this.labelSprites = STATIONS.map((station) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 64;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = "600 22px 'Segoe UI', 'Microsoft YaHei', sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "rgba(232,248,246,0.94)";
      context.fillText(`${station.code}  ${station.name}`, 128, 32);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      const material = new THREE.SpriteMaterial({ map: texture, color: 0xcdeeea, transparent: true, opacity: station.transfer ? 0.62 : 0.42, depthTest: false, depthWrite: false });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(1.42, 0.355, 1);
      sprite.renderOrder = 28;
      sprite.visible = Boolean(station.transfer);
      this.scene.add(sprite);
      this.disposables.push(texture, material);
      return sprite;
    });
  }

  createStructureLayer() {
    this.springVisualizer = new SpringVisualizer(this.physics);
    const { object, material } = this.springVisualizer;
    material.color = new THREE.Color(0xe9f8f5);
    material.transparent = true;
    material.opacity = 0.17;
    material.blending = THREE.AdditiveBlending;
    material.depthWrite = false;
    material.mrtNode = mrt({ bloomIntensity: vec4(0.035, 0, 0, 1) });
    object.visible = false;
    object.renderOrder = 19;
    this.structureObject = object;
    this.scene.add(object);
    this.disposables.push(this.springVisualizer.geometry, this.springVisualizer.material);
  }

  createFlowPackets() {
    const geometry = new THREE.OctahedronGeometry(0.052, 0);
    const material = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
    this.flowPackets = new THREE.InstancedMesh(geometry, material, this.packetCount);
    this.flowPackets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.flowPackets.frustumCulled = false;
    this.flowPackets.renderOrder = 20;
    this.packetStates = Array.from({ length: this.packetCount }, (_, index) => ({
      edgeIndex: index % routeEdges.length,
      progress: seeded(index + 41),
      speed: 0.08 + seeded(index + 71) * 0.12,
      height: 0.11 + seeded(index + 111) * 0.1,
      reverse: seeded(index + 151) > 0.72,
      phase: seeded(index + 191) * TAU,
    }));
    this.scene.add(this.flowPackets);
    this.disposables.push(geometry, material);
  }

  createPulsePool() {
    this.pulses = Array.from({ length: 18 }, (_, index) => {
      const geometry = new THREE.TorusGeometry(1, 0.018, 5, 72);
      geometry.rotateX(Math.PI / 2);
      const material = new THREE.MeshBasicMaterial({ color: index % 3 === 0 ? 0xff705f : 0xffd06a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = false;
      mesh.renderOrder = 24;
      mesh.userData = { active: false, age: 0, life: 1.15, stationIndex: 0, strength: 1 };
      this.scene.add(mesh);
      this.disposables.push(geometry, material);
      return mesh;
    });
  }

  createSelectionMarker() {
    const geometry = new THREE.TorusGeometry(0.32, 0.014, 5, 80);
    geometry.rotateX(Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xffd06a, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false });
    this.selectionMarker = new THREE.Mesh(geometry, material);
    this.selectionMarker.renderOrder = 25;
    this.scene.add(this.selectionMarker);
    this.disposables.push(geometry, material);
  }

  createPickers() {
    const geometry = new THREE.SphereGeometry(0.34, 12, 8);
    const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    this.pickers = this.stationNodes.map(({ base }, index) => {
      const picker = new THREE.Mesh(geometry, material);
      picker.position.copy(base);
      picker.scale.setScalar(STATIONS[index].transfer ? 1.5 : 1.15);
      picker.userData.stationIndex = index;
      this.scene.add(picker);
      return picker;
    });
    this.disposables.push(geometry, material);
  }

  setupPostProcessing() {
    const scenePass = pass(this.scene, this.camera);
    scenePass.setMRT(mrt({ output, bloomIntensity: float(0) }));
    const colorPass = scenePass.getTextureNode();
    const bloomData = scenePass.getTextureNode("bloomIntensity");
    this.bloomPass = bloom(Fn(() => vec4(colorPass.rgb.mul(bloomData.r), 1))());
    this.bloomPass.threshold.value = 0.002;
    this.bloomPass.strength.value = this.quality < 1 ? 0.16 : 0.22;
    this.bloomPass.radius.value = 0.58;
    this.postProcessing = new THREE.PostProcessing(this.renderer);
    this.postProcessing.outputColorTransform = false;
    this.postProcessing.outputNode = Fn(() => {
      const mask = clamp(bloomData.r, 0, 1);
      return vec4(colorPass.rgb.add(this.bloomPass.rgb.mul(float(1).sub(mask).add(bloomData.g).clamp(0, 1))), 1).renderOutput();
    })();
  }

  setScenario(name, trigger = true) {
    if (!SCENARIOS[name]) return;
    this.scenario = name;
    const config = SCENARIOS[name];
    this.demandFactor = config.demand;
    this.recoveryFactor = config.recovery;
    this.selectedIndex = stationIndexById.get(config.focus);
    this.events.fill(0);
    this.pressures = STATIONS.map((station) => Math.min(1.25, station.demand * config.demand + (config.boosts[station.id] ?? 0) * 0.28));
    this.targets = [...this.pressures];
    this.eventAge = Number.POSITIVE_INFINITY;
    this.propagationSchedule = [];
    this.bridge?.requestReset();
    this.onSelect({ station: STATIONS[this.selectedIndex], index: this.selectedIndex, pressure: this.pressures[this.selectedIndex] });
    if (trigger) this.injectCrowd(this.selectedIndex, name === "closure" ? 0.96 : name === "event" ? 0.82 : 0.64, true);
  }

  setDemandFactor(value) { this.demandFactor = THREE.MathUtils.clamp(Number(value), 0.65, 1.55); }
  setRecoveryFactor(value) { this.recoveryFactor = THREE.MathUtils.clamp(Number(value), 0.25, 1); }

  injectCrowd(index = this.selectedIndex, strength = 0.78, manual = true) {
    this.selectedIndex = THREE.MathUtils.clamp(index, 0, STATIONS.length - 1);
    this.events[this.selectedIndex] = Math.min(1.35, this.events[this.selectedIndex] + strength);
    this.pressures[this.selectedIndex] = Math.min(1.62, this.pressures[this.selectedIndex] + strength * 0.32);
    this.eventAge = 0;
    if (manual) this.eventCount += 1;
    this.spawnPulse(this.selectedIndex, strength, 0xff705f);
    this.schedulePropagation(this.selectedIndex, strength);
    this.onSelect({ station: STATIONS[this.selectedIndex], index: this.selectedIndex, pressure: this.pressures[this.selectedIndex] });
    return STATIONS[this.selectedIndex];
  }

  schedulePropagation(source, strength) {
    const distances = new Array(STATIONS.length).fill(Infinity);
    distances[source] = 0;
    const queue = [source];
    while (queue.length) {
      const current = queue.shift();
      routeEdges.forEach(({ from, to }) => {
        const next = from === current ? to : to === current ? from : -1;
        if (next < 0 || distances[next] <= distances[current] + 1) return;
        distances[next] = distances[current] + 1;
        queue.push(next);
      });
    }
    distances.forEach((distance, stationIndex) => {
      if (!Number.isFinite(distance) || distance === 0 || distance > 4) return;
      this.propagationSchedule.push({ at: 0.62 + distance * 0.48, stationIndex, strength: strength * Math.pow(0.72, distance), fired: false });
    });
  }

  spawnPulse(stationIndex, strength = 1, color = 0xffd06a) {
    const pulse = this.pulses[this.pulseCursor % this.pulses.length];
    this.pulseCursor += 1;
    pulse.visible = true;
    pulse.material.color.setHex(color);
    pulse.userData.active = true;
    pulse.userData.age = 0;
    pulse.userData.stationIndex = stationIndex;
    pulse.userData.strength = strength;
    pulse.scale.setScalar(0.2);
  }

  stepSimulation(delta, elapsed) {
    const config = SCENARIOS[this.scenario];
    const previous = [...this.pressures];
    this.eventAge += delta;
    for (let index = 0; index < STATIONS.length; index += 1) {
      const station = STATIONS[index];
      const capacityScale = config.capacityScale[station.id] ?? 1;
      const dailyWave = Math.sin(elapsed * 0.17 + index * 1.37) * 0.024;
      const boost = config.boosts[station.id] ?? 0;
      const target = Math.min(1.42, ((station.demand * this.demandFactor) + boost + dailyWave + this.events[index]) / capacityScale);
      this.targets[index] = target;
      const response = target > this.pressures[index] ? 0.72 : 0.2 + this.recoveryFactor * 0.58;
      this.pressures[index] += (target - this.pressures[index]) * Math.min(1, delta * response);
      this.events[index] *= Math.exp(-delta * (0.34 + this.recoveryFactor * 0.23));
    }

    routeEdges.forEach(({ from, to }) => {
      const difference = previous[from] - previous[to];
      const overload = Math.max(previous[from], previous[to]) > 0.72 ? 1 : 0.38;
      const transfer = difference * delta * 0.092 * overload;
      this.pressures[from] -= transfer;
      this.pressures[to] += transfer;
    });
    this.pressures = this.pressures.map((value) => THREE.MathUtils.clamp(value, 0.22, 1.62));

    this.propagationSchedule.forEach((item) => {
      if (item.fired || this.eventAge < item.at) return;
      item.fired = true;
      this.events[item.stationIndex] = Math.min(1.2, this.events[item.stationIndex] + item.strength * 0.16);
      this.spawnPulse(item.stationIndex, item.strength, item.strength > 0.45 ? 0xffd06a : 0x70eadb);
    });
  }

  getPhase() {
    if (!Number.isFinite(this.eventAge) || this.eventAge > 10.5) return "ingress";
    if (this.eventAge < 0.58) return "ingress";
    if (this.eventAge < 1.55) return "pressure";
    if (this.eventAge < 4.9) return "backflow";
    return "recover";
  }

  updateFlowPackets(delta, elapsed) {
    const motionScale = this.reducedMotion ? 0.24 : 1;
    this.packetStates.forEach((packet, index) => {
      const edge = routeEdges[packet.edgeIndex];
      const startPressure = this.pressures[edge.from];
      const endPressure = this.pressures[edge.to];
      const congestion = Math.max(startPressure, endPressure);
      const throughput = THREE.MathUtils.clamp(1.22 - congestion * 0.62, 0.22, 1);
      packet.progress += packet.speed * throughput * delta * motionScale * (packet.reverse ? -1 : 1);
      if (packet.progress > 1) { packet.progress -= 1; packet.edgeIndex = (packet.edgeIndex + 1 + Math.floor(seeded(index + Math.floor(elapsed)) * 5)) % routeEdges.length; }
      if (packet.progress < 0) { packet.progress += 1; packet.edgeIndex = (packet.edgeIndex + routeEdges.length - 1) % routeEdges.length; }
      const currentEdge = routeEdges[packet.edgeIndex];
      const from = this.stationNodes[currentEdge.from].base;
      const to = this.stationNodes[currentEdge.to].base;
      const fromLift = this.pressures[currentEdge.from] ** 2 * 1.08;
      const toLift = this.pressures[currentEdge.to] ** 2 * 1.08;
      this.tempA.copy(from); this.tempA.y += fromLift + packet.height;
      this.tempB.copy(to); this.tempB.y += toLift + packet.height;
      this.dummy.position.lerpVectors(this.tempA, this.tempB, packet.progress);
      this.dummy.position.y += Math.sin(packet.progress * Math.PI) * 0.08 + Math.sin(elapsed * 2.4 + packet.phase) * 0.018;
      const scale = congestion > 0.85 ? 0.72 : 1;
      this.dummy.scale.setScalar(scale);
      this.dummy.rotation.set(elapsed * 0.4 + packet.phase, elapsed * 0.3, 0);
      this.dummy.updateMatrix();
      this.flowPackets.setMatrixAt(index, this.dummy.matrix);
      this.packetColor.copy(this.routeColors[currentEdge.routeIndex]);
      if (congestion > 0.78) this.packetColor.lerp(this.hotPacketColor, THREE.MathUtils.clamp((congestion - 0.78) * 1.6, 0, 1));
      this.flowPackets.setColorAt(index, this.packetColor);
    });
    this.flowPackets.instanceMatrix.needsUpdate = true;
    if (this.flowPackets.instanceColor) this.flowPackets.instanceColor.needsUpdate = true;
  }

  updatePulses(delta) {
    this.pulses.forEach((pulse) => {
      if (!pulse.userData.active) return;
      pulse.userData.age += delta;
      const t = pulse.userData.age / pulse.userData.life;
      if (t >= 1) { pulse.userData.active = false; pulse.visible = false; return; }
      const stationIndex = pulse.userData.stationIndex;
      const base = this.stationNodes[stationIndex].base;
      const lift = this.pressures[stationIndex] ** 2 * 1.08;
      pulse.position.set(base.x, base.y + lift + 0.01, base.z);
      const scale = 0.2 + t * (1.35 + pulse.userData.strength * 0.9);
      pulse.scale.setScalar(scale);
      pulse.material.opacity = (1 - t) * (0.36 + pulse.userData.strength * 0.46);
    });
  }

  updatePedestals(elapsed) {
    let bottleneckIndex = 0;
    let bottleneckPressure = -Infinity;
    STATIONS.forEach((station, index) => {
      const pressure = this.pressures[index];
      if (pressure > bottleneckPressure) { bottleneckPressure = pressure; bottleneckIndex = index; }
      const height = 0.08 + pressure ** 2 * 1.02;
      const base = this.stationNodes[index].base;
      this.dummy.position.set(base.x, -0.27 + height * 0.5, base.z);
      this.dummy.scale.set(0.11 + pressure * 0.055, height, 0.11 + pressure * 0.055);
      this.dummy.rotation.set(0, elapsed * 0.08 + index, 0);
      this.dummy.updateMatrix();
      this.pedestals.setMatrixAt(index, this.dummy.matrix);
      this.pickers[index].position.set(base.x, base.y + pressure ** 2 * 1.08, base.z);
      const label = this.labelSprites[index];
      label.position.set(base.x, base.y + pressure ** 2 * 1.08 + 0.42, base.z);
    });
    this.labelSprites.forEach((label, index) => {
      const important = STATIONS[index].transfer || index === this.selectedIndex || index === bottleneckIndex;
      label.visible = important;
      label.material.opacity = index === this.selectedIndex ? 0.92 : index === bottleneckIndex ? 0.78 : 0.48;
      label.material.color.setHex(index === bottleneckIndex && bottleneckPressure > 0.82 ? 0xffb06b : 0xcdeeea);
    });
    this.pedestals.instanceMatrix.needsUpdate = true;
    const selectedBase = this.stationNodes[this.selectedIndex].base;
    this.selectionMarker.position.set(selectedBase.x, selectedBase.y + this.pressures[this.selectedIndex] ** 2 * 1.08 + 0.02, selectedBase.z);
    this.selectionMarker.rotation.y = elapsed * 0.34;
    const markerScale = 1 + Math.sin(elapsed * (this.reducedMotion ? 1.2 : 2.8)) * 0.08;
    this.selectionMarker.scale.setScalar(markerScale);
  }

  setPointer(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = (clientX - rect.left) / rect.width * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height * 2 - 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
  }

  pickStation(clientX, clientY) {
    this.setPointer(clientX, clientY);
    const hit = this.raycaster.intersectObjects(this.pickers, false)[0];
    return hit ? hit.object.userData.stationIndex : -1;
  }

  hoverAt(clientX, clientY) {
    const index = this.pickStation(clientX, clientY);
    this.hoveredIndex = index;
    if (index < 0) { this.onHover(null); return null; }
    const station = STATIONS[index];
    this.onHover({ station, index, pressure: this.pressures[index], x: clientX, y: clientY });
    return station;
  }

  selectAt(clientX, clientY) {
    const index = this.pickStation(clientX, clientY);
    if (index < 0) return null;
    this.selectedIndex = index;
    this.onSelect({ station: STATIONS[index], index, pressure: this.pressures[index] });
    return this.injectCrowd(index, 0.78, true);
  }

  beginOrbit() { this.dragStartYaw = this.cameraYawTarget; this.dragStartPitch = this.cameraPitchTarget; }
  dragOrbit(startX, startY, endX, endY) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const motionScale = this.reducedMotion ? 0.38 : 1;
    this.cameraYawTarget = THREE.MathUtils.clamp(this.dragStartYaw - (endX - startX) / Math.max(1, rect.width) * 1.2 * motionScale, -0.5, 0.82);
    this.cameraPitchTarget = THREE.MathUtils.clamp(this.dragStartPitch + (endY - startY) / Math.max(1, rect.height) * 0.62 * motionScale, -0.17, 0.24);
    return { yawDegrees: THREE.MathUtils.radToDeg(this.cameraYawTarget), pitchDegrees: THREE.MathUtils.radToDeg(this.cameraPitchTarget) };
  }

  zoom(deltaY) { this.cameraDistanceTarget = THREE.MathUtils.clamp(this.cameraDistanceTarget + Math.sign(deltaY) * 0.7, this.quality < 1 ? 13.5 : 10.8, this.quality < 1 ? 18.5 : 17.2); }

  selectNext(direction) {
    this.selectedIndex = (this.selectedIndex + direction + STATIONS.length) % STATIONS.length;
    const station = STATIONS[this.selectedIndex];
    this.onSelect({ station, index: this.selectedIndex, pressure: this.pressures[this.selectedIndex] });
    return station;
  }

  toggleStructure(force) {
    this.structureVisible = typeof force === "boolean" ? force : !this.structureVisible;
    this.structureObject.visible = this.structureVisible;
    this.pedestals.material.opacity = this.structureVisible ? 0.42 : 0.18;
    return this.structureVisible;
  }

  reset() {
    this.eventCount = 0;
    this.cameraYawTarget = 0.22;
    this.cameraPitchTarget = 0;
    this.cameraDistanceTarget = this.quality < 1 ? 15.6 : 13.7;
    this.pulses.forEach((pulse) => { pulse.userData.active = false; pulse.visible = false; });
    this.setScenario("commute", false);
  }

  updateCamera(delta) {
    const alpha = 1 - Math.exp(-delta * (this.reducedMotion ? 5 : 9));
    this.cameraYaw = THREE.MathUtils.lerp(this.cameraYaw, this.cameraYawTarget, alpha);
    this.cameraPitch = THREE.MathUtils.lerp(this.cameraPitch, this.cameraPitchTarget, alpha);
    this.cameraDistance = THREE.MathUtils.lerp(this.cameraDistance, this.cameraDistanceTarget, alpha);
    this.applyCameraPosition();
  }

  applyCameraPosition() {
    const mobile = this.quality < 1;
    const distance = mobile ? Math.max(this.cameraDistance, 15.5) : this.cameraDistance;
    const baseHeight = mobile ? 7.6 : 6.7;
    this.camera.position.set(Math.sin(this.cameraYaw) * distance, baseHeight + Math.sin(this.cameraPitch) * distance, Math.cos(this.cameraYaw) * distance);
    this.camera.lookAt(0, mobile ? 0.2 : 0.35, 0);
  }

  getViewportSize() {
    const rect = this.container.getBoundingClientRect();
    return { width: Math.max(1, Math.round(rect.width || innerWidth)), height: Math.max(1, Math.round(rect.height || innerHeight)) };
  }

  async update(elapsed) {
    const delta = Math.min(this.clock.getDelta(), 0.04);
    const frameMs = delta * 1000;
    this.frameTimeEma = this.frameTimeEma === 0 ? frameMs : THREE.MathUtils.lerp(this.frameTimeEma, frameMs, 0.045);
    this.stepSimulation(delta, elapsed);
    this.updateCamera(delta);
    this.updateFlowPackets(delta, elapsed);
    this.updatePulses(delta);
    this.updatePedestals(elapsed);
    this.bridge.setState(elapsed, this.pressures, this.reducedMotion ? 0.32 : 1);
    await this.physics.update(delta, elapsed);
    await this.postProcessing.renderAsync();

    if (elapsed - this.lastMetricsAt > 0.12) {
      this.lastMetricsAt = elapsed;
      const maxPressure = Math.max(...this.pressures);
      const bottleneck = this.pressures.indexOf(maxPressure);
      const delayed = this.pressures.filter((value) => value > 0.82).length;
      const average = this.pressures.reduce((sum, value) => sum + value, 0) / this.pressures.length;
      const flow = SCENARIOS[this.scenario].flow * this.demandFactor;
      const recoverySeconds = Math.max(0, (maxPressure - 0.58) * (410 / this.recoveryFactor));
      this.onMetrics({
        phase: this.getPhase(),
        flow,
        saturation: average,
        delayed,
        recoverySeconds,
        bottleneck: STATIONS[bottleneck],
        bottleneckPressure: maxPressure,
        selectedPressure: this.pressures[this.selectedIndex],
        pressures: this.pressures,
        eventCount: this.eventCount,
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
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 0.72 : 0.9));
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.cameraDistanceTarget = mobile ? Math.max(this.cameraDistanceTarget, 15.6) : Math.min(this.cameraDistanceTarget, 17.2);
    this.applyCameraPosition();
  }

  getStats() {
    return { stations: STATIONS.length, vertices: this.physics.vertexCount, constraints: this.physics.springCount, packets: this.packetCount, solverRate: this.quality < 1 ? 90 : 144 };
  }

  async sampleDiagnostics() {
    const positions = new Float32Array(await this.renderer.getArrayBufferAsync(this.physics.positionData.value));
    const metadata = new Float32Array(await this.renderer.getArrayBufferAsync(this.bridge.metadata.value));
    let finite = true;
    let maxDisplacement = 0;
    this.stationNodes.forEach(({ node }) => {
      const offset = node.id * 4;
      const x = positions[offset]; const y = positions[offset + 1]; const z = positions[offset + 2];
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) finite = false;
      maxDisplacement = Math.max(maxDisplacement, Math.hypot(x - metadata[offset], y - metadata[offset + 1], z - metadata[offset + 2]));
    });
    return { finite, count: this.stationNodes.length, maxDisplacement, maxPressure: Math.max(...this.pressures), frameMilliseconds: this.frameTimeEma };
  }

  destroy() {
    this.disposables.forEach((resource) => resource.dispose?.());
    this.renderer?.dispose();
  }
}
