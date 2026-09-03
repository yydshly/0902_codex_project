import * as THREE from "three/webgpu";
import { pass } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

const FORM_COPY = Object.freeze({
  flower: {
    title: "星云花",
    caption: "低频唤醒晶核与花冠，中频掀动多层膜翼，高频释放星尘冲击波。",
    mapping: "BASS → 晶核呼吸 · MID → 膜翼潮汐 · HIGH → 星尘爆发",
  },
  ribbon: {
    title: "时空织体",
    caption: "十四条能量膜围绕奇点编织，节奏改变带宽、相位和传播方向。",
    mapping: "BASS → 场域宽度 · MID → 时空扭结 · HIGH → 电弧闪络",
  },
  organism: {
    title: "量子生命体",
    caption: "晶体核心、神经网络与七重轨道共同组成会听见声音的数据生命。",
    mapping: "BASS → 等离子核心 · MID → 神经传播 · HIGH → 突触放电",
  },
});

const TAU = Math.PI * 2;

function seeded(index) {
  const value = Math.sin(index * 91.733 + 17.17) * 43758.5453;
  return value - Math.floor(value);
}

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

function smoothstep(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function createPetalGeometry(length = 3.65, width = 1.05, rows = 28, columns = 5) {
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let row = 0; row <= rows; row += 1) {
    const t = row / rows;
    const breadth = Math.sin(Math.PI * t) ** 0.68 * width;
    for (let column = 0; column <= columns; column += 1) {
      const across = column / columns * 2 - 1;
      const x = across * breadth;
      const y = t * length;
      const arch = Math.sin(Math.PI * t) * (0.68 - Math.abs(across) * 0.18);
      const cup = -(Math.abs(across) ** 1.7) * 0.18;
      positions.push(x, y, arch + cup - t * 0.32);
      uvs.push(column / columns, t);
    }
  }
  const stride = columns + 1;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const cursor = row * stride + column;
      indices.push(cursor, cursor + 1, cursor + stride, cursor + 1, cursor + stride + 1, cursor + stride);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createRibbonGeometry(segments = 92) {
  const positions = new Float32Array((segments + 1) * 2 * 3);
  const uvs = new Float32Array((segments + 1) * 2 * 2);
  const indices = [];
  for (let segment = 0; segment <= segments; segment += 1) {
    const t = segment / segments;
    uvs.set([0, t, 1, t], segment * 4);
    if (segment < segments) {
      const cursor = segment * 2;
      indices.push(cursor, cursor + 1, cursor + 2, cursor + 1, cursor + 3, cursor + 2);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  return geometry;
}

function fibonacciDirections(count) {
  const directions = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenAngle * index;
    directions.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius));
  }
  return directions;
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.08, "rgba(176,244,255,.92)");
  gradient.addColorStop(0.28, "rgba(102,138,255,.38)");
  gradient.addColorStop(0.62, "rgba(126,45,255,.11)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function rememberOpacity(group) {
  group.traverse((object) => {
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.filter(Boolean).forEach((material) => {
      if (material.userData.baseOpacity === undefined) material.userData.baseOpacity = material.opacity ?? 1;
    });
  });
}

export class MorphScene {
  constructor(container, { reducedMotion = false, onFormChange = () => {}, onTransitionChange = () => {} } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.onFormChange = onFormChange;
    this.onTransitionChange = onTransitionChange;
    this.quality = window.innerWidth < 768 ? 0.58 : 1;
    this.forms = {};
    this.activeForm = "flower";
    this.transition = null;
    this.pointer = new THREE.Vector2();
    this.targetPointer = new THREE.Vector2();
    this.dummy = new THREE.Object3D();
    this.previousBands = { low: 0, mid: 0, high: 0 };
    this.lastHighOnset = -10;
    this.lastLowOnset = -10;
    this.lastFrameTime = 0;
    this.pulseCursor = 0;
    this.sparkCursor = 0;
  }

  async init() {
    this.renderer = new THREE.WebGPURenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality < 1 ? 1 : 0.65));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.78;
    await this.renderer.init();
    if (!this.renderer.backend?.isWebGPUBackend) throw new Error("没有可用的 WebGPU 后端");
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.container.prepend(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x01070d);
    this.scene.fog = new THREE.FogExp2(0x020a12, 0.026);
    this.camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.1, 80);
    this.camera.position.set(0, 0.2, 11.8);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.055;
    this.controls.enablePan = false;
    this.controls.minDistance = this.quality < 1 ? 14 : 7.5;
    this.controls.maxDistance = this.quality < 1 ? 30 : 18;

    this.scene.add(new THREE.HemisphereLight(0x92eaff, 0x190723, 2.45));
    const warm = new THREE.PointLight(0xff744d, 46, 30, 2);
    warm.position.set(5, 5, 7);
    this.scene.add(warm);
    const violet = new THREE.PointLight(0x6f4dff, 52, 28, 2);
    violet.position.set(-5, -2.5, 5);
    this.scene.add(violet);
    const cyan = new THREE.PointLight(0x42eaff, 32, 26, 2);
    cyan.position.set(0, -5, 5);
    this.scene.add(cyan);

    this.glowTexture = createGlowTexture();
    this.createAtmosphere();
    this.createEventVfx();
    this.forms.flower = this.createFlower();
    this.forms.ribbon = this.createRibbons();
    this.forms.organism = this.createOrganism();
    Object.values(this.forms).forEach(({ group }) => {
      rememberOpacity(group);
      group.visible = false;
      this.scene.add(group);
    });
    this.setForm("flower", false);

    const scenePass = pass(this.scene, this.camera);
    const sceneColor = scenePass.getTextureNode();
    this.bloomPass = bloom(sceneColor, this.quality < 1 ? 0.3 : 0.42, 0.52, 0.5);
    this.postProcessing = new THREE.PostProcessing(this.renderer);
    this.postProcessing.outputNode = sceneColor.add(this.bloomPass);
  }

  createAtmosphere() {
    const count = Math.floor(1180 * this.quality);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color(0x5beaff);
    const violet = new THREE.Color(0x8f63ff);
    for (let index = 0; index < count; index += 1) {
      const radius = 8 + seeded(index + 7) * 25;
      const theta = seeded(index + 31) * TAU;
      const phi = Math.acos(seeded(index + 61) * 2 - 1);
      const cursor = index * 3;
      positions[cursor] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[cursor + 1] = Math.cos(phi) * radius * 0.68;
      positions[cursor + 2] = Math.sin(phi) * Math.sin(theta) * radius - 5;
      const color = index % 4 === 0 ? violet : cyan;
      colors.set([color.r, color.g, color.b], cursor);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.stars = new THREE.Points(geometry, new THREE.PointsMaterial({
      vertexColors: true,
      size: this.quality < 1 ? 0.035 : 0.048,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }));
    this.scene.add(this.stars);

    this.nebulae = [];
    [[-5.5, 2.2, -5, 0x325cff, 10], [5.5, -1.8, -7, 0x7c2dff, 12], [0, 4.8, -10, 0x16b9de, 14]].forEach(([x, y, z, color, size], index) => {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: this.glowTexture,
        color,
        transparent: true,
        opacity: 0.055 + index * 0.015,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }));
      sprite.position.set(x, y, z);
      sprite.scale.setScalar(size);
      this.nebulae.push(sprite);
      this.scene.add(sprite);
    });
  }

  createEventVfx() {
    this.fxGroup = new THREE.Group();
    this.scene.add(this.fxGroup);
    this.pulses = Array.from({ length: 7 }, (_, index) => {
      const pulse = new THREE.Mesh(
        new THREE.RingGeometry(0.95, 1, 128),
        new THREE.MeshBasicMaterial({ color: index % 2 ? 0xff7bc8 : 0x65efff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
      );
      pulse.visible = false;
      pulse.userData = { age: 1, duration: 1, strength: 1 };
      this.fxGroup.add(pulse);
      return pulse;
    });

    const sparkCount = Math.floor(96 * this.quality);
    this.sparkData = Array.from({ length: sparkCount }, () => ({
      age: 2,
      duration: 1,
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      spin: new THREE.Vector3(),
      scale: 0,
    }));
    this.sparks = new THREE.InstancedMesh(
      new THREE.TetrahedronGeometry(0.085, 0),
      new THREE.MeshBasicMaterial({ color: 0x9cf7ff, transparent: true, opacity: 0.62, blending: THREE.AdditiveBlending, depthWrite: false }),
      sparkCount,
    );
    this.sparks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.sparks.frustumCulled = false;
    this.fxGroup.add(this.sparks);
  }

  createGlow(color, size, opacity = 0.75) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTexture, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
    sprite.scale.setScalar(size);
    return sprite;
  }

  createFlower() {
    const group = new THREE.Group();
    const aura = this.createGlow(0x6555ff, 7.8, 0.2);
    aura.position.z = -1.15;
    group.add(aura);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff9a66,
      emissive: 0xff3b1f,
      emissiveIntensity: 1.8,
      roughness: 0.12,
      metalness: 0.28,
      transmission: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity: 0.96,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.69, 5), coreMaterial);
    group.add(core);
    const coreShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.93, 2),
      new THREE.MeshBasicMaterial({ color: 0xffb18d, wireframe: true, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    group.add(coreShell);
    const coreKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.58, 0.018, 180, 7, 3, 5),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.82, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    group.add(coreKnot);

    const palette = [
      { color: 0x4bdff7, emissive: 0x126bff, opacity: 0.43 },
      { color: 0x9378ff, emissive: 0x5a22ff, opacity: 0.5 },
      { color: 0xff87c8, emissive: 0xff247d, opacity: 0.42 },
    ];
    const petalMaterials = palette.map((entry) => new THREE.MeshPhysicalMaterial({
      color: entry.color,
      emissive: entry.emissive,
      emissiveIntensity: 0.82,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: entry.opacity,
      roughness: 0.18,
      metalness: 0.12,
      transmission: 0.3,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      iridescence: 0.85,
      depthWrite: false,
    }));
    const petalGeometry = createPetalGeometry();
    const petals = [];
    for (let layer = 0; layer < 3; layer += 1) {
      const mesh = new THREE.InstancedMesh(petalGeometry, petalMaterials[layer], 10);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      const instances = [];
      for (let slot = 0; slot < 10; slot += 1) {
        const angle = slot / 10 * TAU + layer * 0.19;
        const layerScale = 1 - layer * 0.2;
        instances.push({ angle, layer, layerScale, widthScale: layerScale * (0.92 + seeded(slot + layer * 19) * 0.12), phase: seeded(slot + layer * 33) * TAU });
      }
      petals.push({ mesh, instances, layer });
      group.add(mesh);
    }

    const filamentMaterial = new THREE.MeshBasicMaterial({ color: 0x9ffaff, transparent: true, opacity: 0.66, blending: THREE.AdditiveBlending, depthWrite: false });
    const filamentGeometries = [];
    for (let index = 0; index < 18; index += 1) {
      const angle = index / 18 * TAU;
      const radius = 1.9 + seeded(index + 92) * 1.35;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(angle) * 0.65, Math.sin(angle) * 0.65, 0.2),
        new THREE.Vector3(Math.cos(angle + 0.22) * radius * 0.62, Math.sin(angle + 0.22) * radius * 0.62, 0.75),
        new THREE.Vector3(Math.cos(angle - 0.14) * radius, Math.sin(angle - 0.14) * radius, -0.12),
      ]);
      filamentGeometries.push(new THREE.TubeGeometry(curve, 32, 0.012, 5, false));
    }
    const filaments = new THREE.Mesh(mergeGeometries(filamentGeometries), filamentMaterial);
    filamentGeometries.forEach((geometry) => geometry.dispose());
    group.add(filaments);

    const halos = [1.25, 2.45, 3.55].map((radius, index) => {
      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.014 + index * 0.006, 7, 160),
        new THREE.MeshBasicMaterial({ color: index === 1 ? 0xff72c7 : 0x72edff, transparent: true, opacity: 0.36, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      halo.rotation.set(Math.PI * 0.5 + index * 0.36, index * 0.62, index * 0.23);
      group.add(halo);
      return halo;
    });

    const pollenCount = Math.floor(190 * this.quality);
    const pollen = new THREE.InstancedMesh(
      new THREE.OctahedronGeometry(0.034, 0),
      new THREE.MeshBasicMaterial({ color: 0xffddaf, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false }),
      pollenCount,
    );
    pollen.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const pollenData = Array.from({ length: pollenCount }, (_, index) => ({
      angle: seeded(index + 23) * TAU,
      radius: 1.05 + seeded(index + 81) * 4.2,
      speed: 0.12 + seeded(index + 121) * 0.7,
      z: (seeded(index + 201) - 0.5) * 3.2,
      phase: seeded(index + 301) * TAU,
    }));
    group.add(pollen);

    const shardCount = Math.floor(62 * this.quality);
    const shards = new THREE.InstancedMesh(
      new THREE.OctahedronGeometry(0.075, 0),
      new THREE.MeshBasicMaterial({ color: 0x95eaff, transparent: true, opacity: 0.58, blending: THREE.AdditiveBlending, depthWrite: false }),
      shardCount,
    );
    shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const shardData = Array.from({ length: shardCount }, (_, index) => ({
      angle: seeded(index + 411) * TAU,
      radius: 2.6 + seeded(index + 441) * 2.1,
      z: (seeded(index + 461) - 0.5) * 3.5,
      speed: 0.08 + seeded(index + 491) * 0.35,
    }));
    group.add(shards);
    return { group, aura, core, coreMaterial, coreShell, coreKnot, petals, petalMaterials, filaments, filamentMaterial, halos, pollen, pollenData, shards, shardData };
  }

  createRibbons() {
    const group = new THREE.Group();
    const aura = this.createGlow(0x354dff, 8.5, 0.17);
    aura.position.z = -1.3;
    group.add(aura);
    const ribbons = [];
    for (let index = 0; index < 14; index += 1) {
      const color = new THREE.Color().setHSL(0.49 + index * 0.024, 0.92, 0.62);
      const material = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.17 + (index % 4) * 0.035,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(createRibbonGeometry(), material);
      mesh.userData = { index, material, segments: 92, phase: index / 14 * TAU };
      ribbons.push(mesh);
      group.add(mesh);
    }
    const spineMaterial = new THREE.MeshPhysicalMaterial({ color: 0xff65b7, emissive: 0xff176f, emissiveIntensity: 2, roughness: 0.18, metalness: 0.5, clearcoat: 1, transparent: true, opacity: 0.86 });
    const spine = new THREE.Mesh(new THREE.TorusKnotGeometry(1.18, 0.105, 260, 12, 3, 7), spineMaterial);
    spine.rotation.x = Math.PI * 0.5;
    group.add(spine);
    const spineWire = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.52, 0.018, 320, 6, 5, 8),
      new THREE.MeshBasicMaterial({ color: 0xbffbff, transparent: true, opacity: 0.72, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    group.add(spineWire);

    const nodeCount = Math.floor(140 * this.quality);
    const nodes = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.045, 7, 5),
      new THREE.MeshBasicMaterial({ color: 0xc3fbff, transparent: true, opacity: 0.92, blending: THREE.AdditiveBlending, depthWrite: false }),
      nodeCount,
    );
    nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const nodeData = Array.from({ length: nodeCount }, (_, index) => ({ progress: index / nodeCount, lane: index % 7, phase: seeded(index + 700) * TAU }));
    group.add(nodes);

    const portals = [1.9, 2.55, 3.2].map((radius, index) => {
      const portal = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.022, 7, 180),
        new THREE.MeshBasicMaterial({ color: index === 1 ? 0xff67c0 : 0x54e8ff, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      portal.rotation.set(index * 0.55, index * 0.4, index * 0.67);
      group.add(portal);
      return portal;
    });
    return { group, aura, ribbons, spine, spineMaterial, spineWire, nodes, nodeData, portals };
  }

  createOrganism() {
    const group = new THREE.Group();
    const aura = this.createGlow(0x6b28ff, 8.1, 0.2);
    aura.position.z = -1.2;
    group.add(aura);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x824cff,
      emissive: 0x3513ff,
      emissiveIntensity: 2.1,
      roughness: 0.11,
      metalness: 0.42,
      transmission: 0.17,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      iridescence: 1,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.12, 5), coreMaterial);
    group.add(core);
    const inner = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.72, 0.095, 220, 10, 4, 7),
      new THREE.MeshBasicMaterial({ color: 0xff87dc, transparent: true, opacity: 0.88, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    group.add(inner);
    const shell = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.62, 1),
      new THREE.MeshBasicMaterial({ color: 0x8feeff, wireframe: true, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    group.add(shell);
    const cage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3.5, 3),
      new THREE.MeshBasicMaterial({ color: 0x29dff6, wireframe: true, transparent: true, opacity: 0.11, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    group.add(cage);

    const nodeCount = Math.floor(210 * this.quality);
    const directions = fibonacciDirections(nodeCount);
    const nodePositions = directions.map(() => new THREE.Vector3());
    const nodes = new THREE.InstancedMesh(
      new THREE.OctahedronGeometry(0.065, 0),
      new THREE.MeshBasicMaterial({ color: 0xb7f9ff, transparent: true, opacity: 0.94, blending: THREE.AdditiveBlending, depthWrite: false }),
      directions.length,
    );
    nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(nodes);
    const edgePositions = new Float32Array(directions.length * 2 * 3);
    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    const edges = new THREE.LineSegments(
      edgeGeometry,
      new THREE.LineBasicMaterial({ color: 0x647dff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    group.add(edges);

    const rings = Array.from({ length: 7 }, (_, index) => {
      const radius = 1.85 + index * 0.31;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.012 + (index % 3) * 0.006, 6, 180),
        new THREE.MeshBasicMaterial({ color: index % 2 ? 0xff66c9 : 0x62ecff, transparent: true, opacity: 0.25 + (index % 3) * 0.07, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      ring.rotation.set(index * 0.71, index * 0.93, index * 0.47);
      group.add(ring);
      return ring;
    });

    const satelliteCount = Math.floor(54 * this.quality);
    const satellites = new THREE.InstancedMesh(
      new THREE.TetrahedronGeometry(0.12, 0),
      new THREE.MeshBasicMaterial({ color: 0xff9adc, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }),
      satelliteCount,
    );
    satellites.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const satelliteData = Array.from({ length: satelliteCount }, (_, index) => ({
      angle: seeded(index + 901) * TAU,
      radius: 3.6 + seeded(index + 921) * 1.1,
      tilt: (seeded(index + 941) - 0.5) * 1.5,
      speed: 0.08 + seeded(index + 961) * 0.28,
    }));
    group.add(satellites);
    return { group, aura, core, coreMaterial, inner, shell, cage, directions, nodePositions, nodes, edges, rings, satellites, satelliteData };
  }

  setGroupOpacity(group, factor) {
    group.traverse((object) => {
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.filter(Boolean).forEach((material) => {
        const base = material.userData.baseOpacity;
        if (base !== undefined) material.opacity = base * factor;
      });
    });
  }

  setForm(form, animate = true) {
    if (!FORM_COPY[form] || !this.forms[form]) return;
    if (form === this.activeForm && this.forms[form].group.visible) return;
    if (this.transition) {
      Object.entries(this.forms).forEach(([key, value]) => {
        value.group.visible = key === this.activeForm;
        value.group.scale.setScalar(1);
        this.setGroupOpacity(value.group, 1);
      });
      this.transition = null;
      this.onTransitionChange(false);
    }
    const from = this.activeForm;
    const target = this.forms[form].group;
    target.visible = true;
    target.scale.setScalar(animate && !this.reducedMotion ? 0.28 : 1);
    this.setGroupOpacity(target, animate && !this.reducedMotion ? 0 : 1);
    this.activeForm = form;
    if (animate && !this.reducedMotion && this.forms[from]?.group.visible) {
      this.transition = { from, to: form, elapsed: 0, duration: 0.82 };
      this.onTransitionChange(true);
      this.spawnShockwave(0x79efff, 0.8);
    } else {
      Object.entries(this.forms).forEach(([key, value]) => {
        value.group.visible = key === form;
        value.group.scale.setScalar(1);
        this.setGroupOpacity(value.group, 1);
      });
      this.transition = null;
      this.onTransitionChange(false);
    }
    this.resetView();
    this.onFormChange({ form, ...FORM_COPY[form] });
  }

  setPointer(clientX, clientY) {
    this.targetPointer.set(clientX / innerWidth * 2 - 1, -(clientY / innerHeight * 2 - 1));
  }

  resetView() {
    if (!this.camera || !this.controls) return;
    const mobile = innerWidth < 768;
    this.controls.minDistance = mobile ? 14 : 7.5;
    this.controls.maxDistance = mobile ? 30 : 18;
    const distance = mobile ? (this.activeForm === "ribbon" ? 17.5 : 22.5) : this.activeForm === "ribbon" ? 12.9 : 11.8;
    this.camera.position.set(0, 0.2, distance);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  spawnShockwave(color = 0x72edff, strength = 1) {
    const pulse = this.pulses[this.pulseCursor % this.pulses.length];
    this.pulseCursor += 1;
    pulse.visible = true;
    pulse.scale.setScalar(0.32);
    pulse.material.color.setHex(color);
    pulse.material.opacity = 0.26 * strength;
    pulse.userData.age = 0;
    pulse.userData.duration = 0.72 + strength * 0.4;
    pulse.userData.strength = strength;
  }

  burstSparks(strength = 1) {
    const amount = Math.floor((10 + strength * 22) * this.quality);
    for (let item = 0; item < amount; item += 1) {
      const index = this.sparkCursor % this.sparkData.length;
      this.sparkCursor += 1;
      const data = this.sparkData[index];
      const angle = seeded(this.sparkCursor * 7) * TAU;
      const elevation = (seeded(this.sparkCursor * 11) - 0.5) * 1.2;
      const speed = 2.2 + seeded(this.sparkCursor * 13) * 4.2 * strength;
      data.age = 0;
      data.duration = 0.65 + seeded(this.sparkCursor * 17) * 0.65;
      data.position.set(0, 0, 0.4);
      data.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed, elevation * speed);
      data.spin.set(seeded(index + 11) * 5, seeded(index + 29) * 5, seeded(index + 51) * 5);
      data.scale = 0.5 + strength * 1.1;
    }
  }

  updateTransition(delta) {
    if (!this.transition) return;
    this.transition.elapsed += delta;
    const progress = clamp01(this.transition.elapsed / this.transition.duration);
    const out = 1 - smoothstep(progress / 0.68);
    const into = smoothstep((progress - 0.18) / 0.82);
    const fromGroup = this.forms[this.transition.from].group;
    const toGroup = this.forms[this.transition.to].group;
    fromGroup.scale.setScalar(1 + progress * 0.45);
    fromGroup.rotation.z += delta * 0.38;
    this.setGroupOpacity(fromGroup, out);
    toGroup.scale.setScalar(0.28 + into * 0.72);
    toGroup.rotation.z -= delta * (1 - into) * 0.7;
    this.setGroupOpacity(toGroup, into);
    if (progress >= 1) {
      fromGroup.visible = false;
      fromGroup.scale.setScalar(1);
      this.setGroupOpacity(fromGroup, 1);
      toGroup.scale.setScalar(1);
      this.setGroupOpacity(toGroup, 1);
      this.transition = null;
      this.onTransitionChange(false);
    }
  }

  updateEventVfx(delta, time, low, high) {
    const highRise = high - this.previousBands.high;
    const lowRise = low - this.previousBands.low;
    if (!this.reducedMotion && high > 0.065 && highRise > 0.012 && time - this.lastHighOnset > 0.16) {
      this.lastHighOnset = time;
      this.spawnShockwave(high > 0.18 ? 0xff79cc : 0x72efff, 0.55 + high * 1.9);
      this.burstSparks(0.55 + high * 2.2);
    }
    if (!this.reducedMotion && low > 0.5 && lowRise > 0.03 && time - this.lastLowOnset > 0.48) {
      this.lastLowOnset = time;
      this.spawnShockwave(0xff8a68, 1.15 + low * 0.65);
    }

    this.pulses.forEach((pulse, index) => {
      if (!pulse.visible) return;
      pulse.userData.age += delta;
      const progress = pulse.userData.age / pulse.userData.duration;
      if (progress >= 1) {
        pulse.visible = false;
        pulse.material.opacity = 0;
        return;
      }
      const eased = 1 - (1 - progress) ** 3;
      pulse.scale.setScalar(0.32 + eased * (4.2 + pulse.userData.strength * 1.25));
      pulse.material.opacity = (1 - progress) ** 2 * 0.24 * pulse.userData.strength;
      pulse.rotation.z += delta * (index % 2 ? 0.32 : -0.24);
    });

    this.sparkData.forEach((data, index) => {
      data.age += delta;
      if (data.age < data.duration) {
        const progress = data.age / data.duration;
        data.position.addScaledVector(data.velocity, delta);
        data.velocity.multiplyScalar(0.97);
        data.velocity.y -= delta * 0.42;
        this.dummy.position.copy(data.position);
        this.dummy.rotation.set(data.spin.x * data.age, data.spin.y * data.age, data.spin.z * data.age);
        this.dummy.scale.setScalar(data.scale * (1 - progress) * (0.65 + high * 1.8));
      } else {
        this.dummy.position.set(0, 0, -20);
        this.dummy.scale.setScalar(0);
      }
      this.dummy.updateMatrix();
      this.sparks.setMatrixAt(index, this.dummy.matrix);
    });
    this.sparks.instanceMatrix.needsUpdate = true;
  }

  updateFlower(time, low, mid, high) {
    const form = this.forms.flower;
    const motion = this.reducedMotion ? 0.16 : 1;
    const breath = 1 + low * 0.5 + Math.sin(time * 1.15) * 0.045 * motion;
    form.core.scale.setScalar(breath);
    form.coreMaterial.emissiveIntensity = 1.55 + low * 2.7 + high * 1.2;
    form.coreShell.scale.setScalar(1 + low * 0.34);
    form.coreShell.rotation.y = time * 0.34 * motion;
    form.coreShell.rotation.x = -time * 0.21 * motion;
    form.coreKnot.rotation.x = time * (0.2 + mid * 0.8) * motion;
    form.coreKnot.rotation.y = -time * (0.32 + mid) * motion;
    form.aura.scale.setScalar(7.2 + low * 3 + high * 1.8);
    form.aura.material.opacity = 0.12 + low * 0.08 + high * 0.11;

    form.petals.forEach(({ mesh, instances, layer }) => {
      instances.forEach(({ layerScale, widthScale, phase, angle }, index) => {
        const wave = Math.sin(time * (0.52 + mid * 1.65) + phase + index * 0.19);
        const layerMotion = 1 - layer * 0.17;
        this.dummy.position.set(0, 0, -layer * 0.12);
        this.dummy.rotation.set(
          0.12 + layer * 0.26 + wave * (0.055 + mid * 0.12) * motion,
          Math.cos(time * 0.45 + phase) * 0.06 * motion,
          angle + wave * (0.025 + mid * 0.14) * motion * layerMotion,
        );
        this.dummy.scale.set(widthScale, layerScale * (1 + low * (0.32 - layer * 0.05)), 1);
        this.dummy.updateMatrix();
        mesh.setMatrixAt(index, this.dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    });
    form.petalMaterials.forEach((material, index) => {
      material.emissiveIntensity = 0.42 + mid * 0.7 + high * (0.85 + index * 0.16);
      material.opacity = material.userData.baseOpacity * (0.84 + high * 0.3);
    });
    form.filaments.rotation.z = Math.sin(time * 0.23) * 0.08 * motion;
    form.filaments.scale.setScalar(1 + low * 0.16 + Math.sin(time) * 0.012 * motion);
    form.filamentMaterial.opacity = 0.42 + high * 0.5;
    form.halos.forEach((halo, index) => {
      halo.rotation.z += (0.0012 + mid * 0.006) * (index + 1) * motion;
      halo.scale.setScalar(1 + low * (0.1 + index * 0.025));
      halo.material.opacity = halo.material.userData.baseOpacity * (0.72 + high * 0.8);
    });
    form.pollenData.forEach((data, index) => {
      const angle = data.angle + time * data.speed * motion;
      const radius = data.radius * (1 + low * 0.1);
      const size = 0.45 + high * 2.8 + Math.sin(time * 3 + data.phase) * 0.16;
      this.dummy.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, data.z + Math.sin(time + index) * 0.28);
      this.dummy.rotation.set(angle, angle * 0.5, time + data.phase);
      this.dummy.scale.setScalar(Math.max(0.2, size));
      this.dummy.updateMatrix();
      form.pollen.setMatrixAt(index, this.dummy.matrix);
    });
    form.pollen.instanceMatrix.needsUpdate = true;
    form.shardData.forEach((data, index) => {
      const angle = data.angle - time * data.speed * motion;
      this.dummy.position.set(Math.cos(angle) * data.radius, Math.sin(angle) * data.radius, data.z + Math.sin(angle * 2) * 0.45);
      this.dummy.rotation.set(angle, time * 0.4 + index, angle * 1.7);
      this.dummy.scale.setScalar(0.45 + mid * 0.8 + high * 1.4);
      this.dummy.updateMatrix();
      form.shards.setMatrixAt(index, this.dummy.matrix);
    });
    form.shards.instanceMatrix.needsUpdate = true;
  }

  updateRibbons(time, low, mid, high) {
    const form = this.forms.ribbon;
    const motion = this.reducedMotion ? 0.15 : 1;
    form.ribbons.forEach((ribbon, ribbonIndex) => {
      const { segments, material, phase } = ribbon.userData;
      const positions = ribbon.geometry.attributes.position.array;
      for (let segment = 0; segment <= segments; segment += 1) {
        const progress = segment / segments;
        const y = (progress - 0.5) * 10.2;
        const taper = Math.sin(Math.PI * progress) ** 0.24;
        const travel = time * (0.28 + mid * 1.6) * motion;
        const angle = y * (0.49 + mid * 0.32) + travel + phase;
        const pulse = Math.sin(y * 1.35 - travel * 2.2 + ribbonIndex) * (0.18 + mid * 0.28) * motion;
        const radius = 1.2 + ribbonIndex * 0.075 + pulse + low * 0.28;
        const centerX = Math.sin(angle) * radius + Math.sin(y * 0.42 + phase) * 0.35;
        const centerZ = Math.cos(angle) * radius * 0.84 + Math.cos(y * 0.7 - phase) * 0.28;
        const width = (0.075 + (ribbonIndex % 5) * 0.018) * (1 + low * 1.9) * taper;
        const sideX = Math.cos(angle) * width;
        const sideZ = -Math.sin(angle) * width;
        const cursor = segment * 6;
        positions[cursor] = centerX - sideX;
        positions[cursor + 1] = y;
        positions[cursor + 2] = centerZ - sideZ;
        positions[cursor + 3] = centerX + sideX;
        positions[cursor + 4] = y;
        positions[cursor + 5] = centerZ + sideZ;
      }
      ribbon.geometry.attributes.position.needsUpdate = true;
      material.opacity = material.userData.baseOpacity * (0.72 + mid * 1.4 + high * 0.8);
    });
    form.group.rotation.y += (0.001 + mid * 0.004) * motion;
    form.spine.rotation.z = time * (0.12 + mid * 0.65) * motion;
    form.spine.rotation.y = -time * 0.17 * motion;
    form.spine.scale.setScalar(0.82 + low * 0.68);
    form.spineMaterial.emissiveIntensity = 1.4 + low * 1.8 + high * 1.6;
    form.spineWire.rotation.x = time * 0.14 * motion;
    form.spineWire.rotation.y = -time * (0.19 + mid * 0.5) * motion;
    form.spineWire.material.opacity = 0.42 + high * 0.55;
    form.aura.scale.setScalar(7.2 + low * 2.6 + mid * 1.4);
    form.aura.material.opacity = 0.1 + mid * 0.09 + high * 0.11;
    form.nodeData.forEach((data, index) => {
      const y = (data.progress - 0.5) * 9.4;
      const angle = y * 0.52 + time * (0.38 + mid * 1.4) * motion + data.lane / 7 * TAU;
      const radius = 1.6 + data.lane * 0.12 + Math.sin(time + data.phase) * 0.18;
      this.dummy.position.set(Math.sin(angle) * radius, y, Math.cos(angle) * radius * 0.8);
      this.dummy.rotation.set(angle, time + data.phase, angle * 0.6);
      this.dummy.scale.setScalar(0.45 + high * 2.5 + (index % 13 === 0 ? low * 1.5 : 0));
      this.dummy.updateMatrix();
      form.nodes.setMatrixAt(index, this.dummy.matrix);
    });
    form.nodes.instanceMatrix.needsUpdate = true;
    form.portals.forEach((portal, index) => {
      portal.rotation.x += (0.001 + mid * 0.004) * (index + 1) * motion;
      portal.rotation.y -= (0.0012 + mid * 0.003) * (index + 1) * motion;
      portal.scale.setScalar(1 + low * (0.1 + index * 0.05));
      portal.material.opacity = portal.material.userData.baseOpacity * (0.7 + high * 0.9);
    });
  }

  updateOrganism(time, low, mid, high) {
    const form = this.forms.organism;
    const motion = this.reducedMotion ? 0.14 : 1;
    form.core.scale.setScalar(1 + low * 0.58);
    form.core.rotation.y = time * 0.19 * motion;
    form.core.rotation.x = time * 0.12 * motion;
    form.coreMaterial.emissiveIntensity = 1.6 + low * 2.5 + high * 1.1;
    form.inner.rotation.x = -time * (0.35 + mid * 0.8) * motion;
    form.inner.rotation.y = time * (0.24 + mid) * motion;
    form.inner.scale.setScalar(0.88 + low * 0.32);
    form.shell.rotation.y = -time * 0.16 * motion;
    form.shell.rotation.z = time * 0.11 * motion;
    form.shell.material.opacity = 0.22 + high * 0.42;
    form.cage.rotation.y = -time * (0.045 + mid * 0.25) * motion;
    form.cage.rotation.z = time * 0.034 * motion;
    form.aura.scale.setScalar(7 + low * 2.5 + high * 2.2);
    form.aura.material.opacity = 0.13 + low * 0.08 + high * 0.12;

    form.directions.forEach((direction, index) => {
      const wave = Math.sin(time * (0.74 + mid * 2.1) * motion + index * 0.37);
      const radius = 2.35 + wave * (0.18 + mid * 0.5) + low * 0.38;
      const point = form.nodePositions[index].copy(direction).multiplyScalar(radius);
      const size = 0.48 + high * 3 + (index % 11 === 0 ? low * 1.7 : 0);
      this.dummy.position.copy(point);
      this.dummy.rotation.set(index, time + index, wave);
      this.dummy.scale.setScalar(size);
      this.dummy.updateMatrix();
      form.nodes.setMatrixAt(index, this.dummy.matrix);
    });
    form.nodes.instanceMatrix.needsUpdate = true;

    const edgeArray = form.edges.geometry.attributes.position.array;
    form.nodePositions.forEach((point, index) => {
      const peer = form.nodePositions[(index + 21 + (index % 3) * 13) % form.nodePositions.length];
      edgeArray.set([point.x, point.y, point.z, peer.x, peer.y, peer.z], index * 6);
    });
    form.edges.geometry.attributes.position.needsUpdate = true;
    form.edges.material.opacity = 0.16 + mid * 0.55 + high * 0.18;
    form.rings.forEach((ring, index) => {
      ring.rotation.y += (0.0014 + mid * 0.008) * (index + 1) * motion;
      ring.rotation.x -= (0.0007 + mid * 0.003) * (index % 3 + 1) * motion;
      ring.scale.setScalar(1 + low * (0.05 + index * 0.012));
      ring.material.opacity = ring.material.userData.baseOpacity * (0.72 + high * 1.15);
    });
    form.satelliteData.forEach((data, index) => {
      const angle = data.angle + time * data.speed * motion;
      this.dummy.position.set(
        Math.cos(angle) * data.radius,
        Math.sin(angle) * data.radius * Math.cos(data.tilt),
        Math.sin(angle) * data.radius * Math.sin(data.tilt),
      );
      this.dummy.rotation.set(angle, time * data.speed * 4, data.tilt);
      this.dummy.scale.setScalar(0.45 + mid * 0.9 + high * 1.8);
      this.dummy.updateMatrix();
      form.satellites.setMatrixAt(index, this.dummy.matrix);
    });
    form.satellites.instanceMatrix.needsUpdate = true;
  }

  updateForm(form, time, low, mid, high) {
    if (form === "flower") this.updateFlower(time, low, mid, high);
    if (form === "ribbon") this.updateRibbons(time, low, mid, high);
    if (form === "organism") this.updateOrganism(time, low, mid, high);
  }

  async update(time, bands, audioActive) {
    const rawDelta = this.lastFrameTime ? time - this.lastFrameTime : 1 / 60;
    const delta = Math.min(rawDelta, 0.05);
    this.lastFrameTime = time;
    const idle = this.reducedMotion ? 0.025 : 0.11;
    const low = audioActive ? bands.low : idle + Math.sin(time * 1.25) * idle * 0.24;
    const mid = audioActive ? bands.mid : idle * 0.66 + Math.sin(time * 0.47) * idle * 0.14;
    const high = audioActive ? bands.high : idle * 0.34;

    this.pointer.lerp(this.targetPointer, this.reducedMotion ? 0.025 : 0.055);
    const active = this.forms[this.activeForm];
    active.group.rotation.y += (this.pointer.x * 0.15 - active.group.rotation.y) * 0.018;
    active.group.rotation.x += (-this.pointer.y * 0.11 - active.group.rotation.x) * 0.016;
    this.updateForm(this.activeForm, time, low, mid, high);
    if (this.transition) this.updateForm(this.transition.from, time, low, mid, high);
    this.updateTransition(Math.min(rawDelta, 0.2));
    this.updateEventVfx(delta, time, low, high);

    this.stars.rotation.y = time * 0.004 * (this.reducedMotion ? 0 : 1);
    this.stars.rotation.z = time * 0.0015 * (this.reducedMotion ? 0 : 1);
    this.nebulae.forEach((nebula, index) => {
      nebula.material.opacity = 0.04 + low * 0.035 + Math.sin(time * 0.18 + index) * 0.01;
    });
    this.bloomPass.strength.value = (this.quality < 1 ? 0.26 : 0.38) + high * 0.82 + low * 0.08;
    this.bloomPass.radius.value = 0.48 + mid * 0.12;
    this.controls.update();
    await this.postProcessing.renderAsync();
    this.previousBands.low = low;
    this.previousBands.mid = mid;
    this.previousBands.high = high;
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.resetView();
  }

  getStats() {
    return {
      calls: this.renderer?.info.render.calls ?? 0,
      triangles: this.renderer?.info.render.triangles ?? 0,
      quality: this.quality,
    };
  }

  dispose() {
    this.controls?.dispose();
    this.scene?.traverse((object) => {
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
      else object.material?.dispose?.();
    });
    this.glowTexture?.dispose();
    this.postProcessing?.dispose?.();
    this.renderer?.dispose();
  }
}

export { FORM_COPY };
