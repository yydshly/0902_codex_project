import * as THREE from "three/webgpu";
import { pass } from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);

export const CANDIDATE_COPY = Object.freeze({
  manta: {
    rank: "01",
    total: 8.6,
    caption: "翼膜、骨架、尾丝与内部能量共同构成可转向的空中生命。",
    mapping: "LOW 翼膜呼吸 · MID 骨架行波 · HIGH 尾丝放电",
    instruction: "移动指针改变光翼朝向；按住扫过，为翼膜注入一阵同向能量。",
    pulse: "能量从胸腔穿过骨架，再沿翼缘和尾丝向外释放。",
    maturity: "LIVE PROTOTYPE · 最接近第二旗舰",
    scores: { silhouette: 9.2, space: 8.8, motion: 8.7, material: 8.2, structure: 9.0, interaction: 8.4 },
  },
  seed: {
    rank: "02",
    total: 8.3,
    caption: "一枚星种在收束、绽放与播散之间循环，运动本身构成叙事。",
    mapping: "LOW 核心蓄能 · MID 花瓣展开 · HIGH 星屑播散",
    instruction: "移动指针改变花冠倾角；触发脉冲，观察闭合结构如何释放种群。",
    pulse: "星种完成一次绽放，携带记忆的光屑从花冠向空间播散。",
    maturity: "LIVE PROTOTYPE · 叙事潜力最高",
    scores: { silhouette: 8.8, space: 8.1, motion: 8.5, material: 8.4, structure: 8.5, interaction: 7.6 },
  },
  ferro: {
    rank: "03",
    total: 8.1,
    caption: "不可见的双极场通过液面和数百枚磁刺显形，指针就是第二磁极。",
    mapping: "LOW 液核压力 · MID 场线偏转 · HIGH 磁刺闪变",
    instruction: "移动指针拖曳场极；按住扫过，观察磁刺如何集体改向。",
    pulse: "双极场短暂反转，磁刺从压缩态跃迁到高能尖峰。",
    maturity: "LIVE PROTOTYPE · 交互潜力最高",
    scores: { silhouette: 8.1, space: 8.6, motion: 8.0, material: 8.8, structure: 7.9, interaction: 9.0 },
  },
});

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

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(.08, "rgba(171,244,255,.95)");
  gradient.addColorStop(.24, "rgba(90,207,255,.42)");
  gradient.addColorStop(.58, "rgba(99,65,235,.12)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createMantaGeometry(columns, rows) {
  const positions = new Float32Array((columns + 1) * (rows + 1) * 3);
  const uvs = new Float32Array((columns + 1) * (rows + 1) * 2);
  const params = new Float32Array((columns + 1) * (rows + 1) * 2);
  const indices = [];
  let cursor = 0;
  let uvCursor = 0;
  for (let row = 0; row <= rows; row += 1) {
    const v = row / rows * 2 - 1;
    for (let column = 0; column <= columns; column += 1) {
      const u = column / columns * 2 - 1;
      params[cursor / 3 * 2] = u;
      params[cursor / 3 * 2 + 1] = v;
      positions[cursor++] = 0;
      positions[cursor++] = 0;
      positions[cursor++] = 0;
      uvs[uvCursor++] = column / columns;
      uvs[uvCursor++] = row / rows;
    }
  }
  const stride = columns + 1;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * stride + column;
      indices.push(index, index + 1, index + stride, index + 1, index + stride + 1, index + stride);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.userData.params = params;
  geometry.userData.columns = columns;
  geometry.userData.rows = rows;
  return geometry;
}

function mantaPoint(u, v, time, energy, pointer, pulse, target) {
  const longitudinal = (v + 1) * .5;
  let width;
  if (longitudinal < .16) {
    width = .025 + longitudinal / .16 * 1.78;
  } else if (longitudinal < .55) {
    width = 1.805 + (longitudinal - .16) / .39 * 3.66;
  } else {
    width = 5.465 * (1 - (longitudinal - .55) / .45) ** .62 + .025;
  }
  width *= .94 + Math.sin(longitudinal * Math.PI) * .06;
  const edge = Math.abs(u) ** 1.55;
  const slowWing = Math.sin(time * 1.15 + edge * 3.7 + v * 1.2) * edge * (.34 + energy * .38);
  const fastEdge = Math.sin(time * 2.55 - v * 2.4 + u * 4.1) * edge * (.05 + energy * .12);
  const pointerDistance = (u - pointer.x * .7) ** 2 + (v - pointer.y * .62) ** 2;
  const pointerWake = Math.exp(-pointerDistance * 5.2) * Math.sin(time * 4.2 + u * 4) * pointer.z * .52;
  const pulseWave = Math.sin((Math.abs(u) + longitudinal) * 9.5 - time * 5.5) * pulse * Math.exp(-Math.abs(u) * .6) * .28;
  target.set(
    u * width,
    v * 3.18 + (1 - edge) * Math.sin(longitudinal * Math.PI) * .31,
    .16 + (1 - u * u) * .36 + slowWing + fastEdge + pointerWake + pulseWave,
  );
  return target;
}

function createPetalGeometry(length = 3.45, width = 1.08, rows = 26, columns = 6) {
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let row = 0; row <= rows; row += 1) {
    const t = row / rows;
    const breadth = Math.sin(Math.PI * t) ** .72 * width;
    for (let column = 0; column <= columns; column += 1) {
      const across = column / columns * 2 - 1;
      positions.push(across * breadth, t * length, Math.sin(Math.PI * t) * (.58 - Math.abs(across) * .19) - t * t * .28);
      uvs.push(column / columns, t);
    }
  }
  const stride = columns + 1;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * stride + column;
      indices.push(index, index + 1, index + stride, index + 1, index + stride + 1, index + stride);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function fibonacciDirections(count) {
  const result = [];
  const angle = Math.PI * (3 - Math.sqrt(5));
  for (let index = 0; index < count; index += 1) {
    const y = 1 - index / Math.max(count - 1, 1) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = angle * index;
    result.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius));
  }
  return result;
}

function collectMaterials(group) {
  const materials = [];
  const seen = new Set();
  group.traverse((object) => {
    const list = Array.isArray(object.material) ? object.material : [object.material];
    list.filter(Boolean).forEach((material) => {
      if (seen.has(material)) return;
      seen.add(material);
      material.userData.arenaOpacity = material.opacity ?? 1;
      materials.push(material);
    });
  });
  return materials;
}

export class ArenaScene {
  constructor(container, { reducedMotion = false } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.quality = innerWidth < 760 ? .58 : innerWidth < 1100 ? .78 : 1;
    this.pointer = new THREE.Vector3();
    this.pointerTarget = new THREE.Vector3();
    this.activeCandidate = "manta";
    this.subjects = {};
    this.transition = null;
    this.pulseEnergy = 0;
    this.energy = .18;
    this.lastTime = 0;
    this.dummy = new THREE.Object3D();
    this.temp = new THREE.Vector3();
    this.tempB = new THREE.Vector3();
    this.tempColor = new THREE.Color();
    this.structureVisible = false;
  }

  async init() {
    this.renderer = new THREE.WebGPURenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.quality < 1 ? 1 : 1.25));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = .82;
    await this.renderer.init();
    if (!this.renderer.backend?.isWebGPUBackend) throw new Error("没有可用的 WebGPU 后端");
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.container.prepend(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x01050a);
    this.scene.fog = new THREE.FogExp2(0x02070d, .023);
    this.camera = new THREE.PerspectiveCamera(43, innerWidth / innerHeight, .1, 80);
    this.camera.position.set(0, .15, this.quality < 1 ? 15.7 : 12.4);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = .055;
    this.controls.enableRotate = false;
    this.controls.enablePan = false;
    this.controls.minDistance = this.quality < 1 ? 13.5 : 8.8;
    this.controls.maxDistance = this.quality < 1 ? 20 : 17;

    this.scene.add(new THREE.HemisphereLight(0x9eeeff, 0x130b22, 2.2));
    const cyan = new THREE.PointLight(0x53dcff, 58, 31, 2);
    cyan.position.set(-5.2, 4.5, 6.5);
    this.scene.add(cyan);
    const violet = new THREE.PointLight(0x7f5dff, 56, 30, 2);
    violet.position.set(5.3, -2.8, 5.2);
    this.scene.add(violet);
    const warm = new THREE.PointLight(0xff9b72, 34, 25, 2);
    warm.position.set(1.5, 5.6, 2.4);
    this.scene.add(warm);

    this.glowTexture = createGlowTexture();
    this.createAtmosphere();
    this.createPulsePool();
    this.subjects.manta = this.createManta();
    this.subjects.seed = this.createSeed();
    this.subjects.ferro = this.createFerro();
    Object.entries(this.subjects).forEach(([name, subject]) => {
      subject.materials = collectMaterials(subject.group);
      subject.group.visible = name === "manta";
      this.scene.add(subject.group);
    });
    this.setStructure(false);

    const scenePass = pass(this.scene, this.camera);
    const sceneColor = scenePass.getTextureNode();
    this.bloomPass = bloom(sceneColor, this.quality < 1 ? .28 : .43, .48, .58);
    this.postProcessing = new THREE.PostProcessing(this.renderer);
    this.postProcessing.outputNode = sceneColor.add(this.bloomPass);
  }

  createAtmosphere() {
    const count = Math.floor(980 * this.quality);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color(0x69dfff);
    const violet = new THREE.Color(0x8d6fff);
    for (let index = 0; index < count; index += 1) {
      const radius = 10 + seeded(index) * 23;
      const theta = seeded(index + 1200) * TAU;
      const phi = Math.acos(seeded(index + 2400) * 2 - 1);
      positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[index * 3 + 1] = Math.cos(phi) * radius * .55;
      positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius - 6;
      const color = cyan.clone().lerp(violet, seeded(index + 3600));
      colors.set([color.r, color.g, color.b], index * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.stars = new THREE.Points(geometry, new THREE.PointsMaterial({ size: .035, vertexColors: true, transparent: true, opacity: .68, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.scene.add(this.stars);

    this.halos = [];
    [
      [-5.5, 2.8, -5, 5.5, 0x4dc7ff],
      [5.7, -2.2, -7, 6.8, 0x7355ff],
      [.2, .4, -9, 9.5, 0x163f58],
    ].forEach(([x, y, z, scale, color]) => {
      const material = new THREE.SpriteMaterial({ map: this.glowTexture, color, transparent: true, opacity: .14, depthWrite: false, blending: THREE.AdditiveBlending });
      const sprite = new THREE.Sprite(material);
      sprite.position.set(x, y, z);
      sprite.scale.setScalar(scale);
      this.scene.add(sprite);
      this.halos.push(sprite);
    });
  }

  createPulsePool() {
    this.pulses = Array.from({ length: 6 }, (_, index) => {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(1, .012, 8, 96),
        new THREE.MeshBasicMaterial({ color: index % 2 ? 0x9a76ff : 0x79edff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
      );
      mesh.visible = false;
      mesh.userData.age = 10;
      this.scene.add(mesh);
      return mesh;
    });
    this.pulseCursor = 0;
  }

  createManta() {
    const group = new THREE.Group();
    group.rotation.x = -.03;
    const geometry = createMantaGeometry(this.quality < 1 ? 42 : 64, this.quality < 1 ? 24 : 36);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x5aaac0,
      emissive: 0x0a3149,
      emissiveIntensity: 1.5,
      roughness: .22,
      metalness: .02,
      transmission: .34,
      thickness: .55,
      transparent: true,
      opacity: .55,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const surface = new THREE.Mesh(geometry, material);
    group.add(surface);

    const underMaterial = new THREE.MeshBasicMaterial({ color: 0x63dfff, transparent: true, opacity: .025, wireframe: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const underlay = new THREE.Mesh(geometry, underMaterial);
    underlay.scale.set(.996, .996, .996);
    group.add(underlay);

    const topology = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xc6f8ff, size: .028, transparent: true, opacity: .58, depthWrite: false, blending: THREE.AdditiveBlending }));
    topology.visible = false;
    group.add(topology);

    const ribCount = this.quality < 1 ? 11 : 16;
    const ribSteps = 8;
    const ribPositions = new Float32Array(ribCount * 2 * ribSteps * 2 * 3);
    const ribGeometry = new THREE.BufferGeometry();
    ribGeometry.setAttribute("position", new THREE.BufferAttribute(ribPositions, 3));
    const ribs = new THREE.LineSegments(ribGeometry, new THREE.LineBasicMaterial({ color: 0xb8f5ff, transparent: true, opacity: .48, blending: THREE.AdditiveBlending, depthWrite: false }));
    group.add(ribs);

    const outlinePositions = new Float32Array((geometry.userData.rows * 2 + geometry.userData.columns * 2) * 2 * 3);
    const outlineGeometry = new THREE.BufferGeometry();
    outlineGeometry.setAttribute("position", new THREE.BufferAttribute(outlinePositions, 3));
    const outline = new THREE.LineSegments(outlineGeometry, new THREE.LineBasicMaterial({ color: 0xa9f5ff, transparent: true, opacity: .58, blending: THREE.AdditiveBlending, depthWrite: false }));
    group.add(outline);

    const tailCount = this.quality < 1 ? 11 : 18;
    const tailSteps = 13;
    const tailPositions = new Float32Array(tailCount * tailSteps * 2 * 3);
    const tailGeometry = new THREE.BufferGeometry();
    tailGeometry.setAttribute("position", new THREE.BufferAttribute(tailPositions, 3));
    const tails = new THREE.LineSegments(tailGeometry, new THREE.LineBasicMaterial({ color: 0x7de7ff, transparent: true, opacity: .43, blending: THREE.AdditiveBlending, depthWrite: false }));
    group.add(tails);

    const coreGroup = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.56, 3), new THREE.MeshPhysicalMaterial({ color: 0x76d9e9, emissive: 0x176d91, emissiveIntensity: 1.25, roughness: .18, metalness: .12, transparent: true, opacity: .84 }));
    core.scale.set(.58, 1.48, .44);
    coreGroup.add(core);
    for (let index = 0; index < 3; index += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.62 + index * .18, .014, 8, 72), new THREE.MeshBasicMaterial({ color: index === 1 ? 0xb08aff : 0x7eeaff, transparent: true, opacity: .38 - index * .055, blending: THREE.AdditiveBlending, depthWrite: false }));
      ring.rotation.set(index * .8, index * .65, index * .48);
      coreGroup.add(ring);
    }
    coreGroup.position.set(0, .25, .54);
    group.add(coreGroup);

    const followers = [];
    const followerMaterial = material.clone();
    followerMaterial.opacity = .11;
    followerMaterial.emissiveIntensity = 1.1;
    for (let index = 0; index < (this.quality < 1 ? 2 : 4); index += 1) {
      const follower = new THREE.Mesh(geometry, followerMaterial.clone());
      const scale = .14 + seeded(index + 800) * .11;
      follower.scale.setScalar(scale);
      follower.position.set((seeded(index + 900) * 2 - 1) * 8, (seeded(index + 1000) * 2 - 1) * 4.2, -4 - seeded(index + 1100) * 8);
      group.add(follower);
      followers.push(follower);
    }

    const hero = { group, geometry, surface, underlay, topology, ribs, ribCount, ribSteps, outline, tails, tailCount, tailSteps, coreGroup, core, followers };
    this.updateMantaGeometry(hero, 0, .25);
    return { group, hero, structure: [topology] };
  }

  updateMantaGeometry(manta, time, energy) {
    const position = manta.geometry.getAttribute("position");
    const params = manta.geometry.userData.params;
    const target = this.temp;
    for (let index = 0; index < position.count; index += 1) {
      mantaPoint(params[index * 2], params[index * 2 + 1], time, energy, this.pointer, this.pulseEnergy, target);
      position.setXYZ(index, target.x, target.y, target.z);
    }
    position.needsUpdate = true;
    manta.geometry.computeVertexNormals();

    const ribs = manta.ribs.geometry.getAttribute("position");
    let cursor = 0;
    for (let side = -1; side <= 1; side += 2) {
      for (let rib = 0; rib < manta.ribCount; rib += 1) {
        const v = -.73 + rib / Math.max(manta.ribCount - 1, 1) * 1.48;
        for (let step = 0; step < manta.ribSteps; step += 1) {
          const a = step / manta.ribSteps;
          const b = (step + 1) / manta.ribSteps;
          mantaPoint(side * a * .97, .06 + (v - .06) * a, time, energy, this.pointer, this.pulseEnergy, target);
          ribs.setXYZ(cursor++, target.x, target.y, target.z + .025);
          mantaPoint(side * b * .97, .06 + (v - .06) * b, time, energy, this.pointer, this.pulseEnergy, target);
          ribs.setXYZ(cursor++, target.x, target.y, target.z + .025);
        }
      }
    }
    ribs.needsUpdate = true;

    const outline = manta.outline.geometry.getAttribute("position");
    cursor = 0;
    const rows = manta.geometry.userData.rows;
    const columns = manta.geometry.userData.columns;
    for (let side = -1; side <= 1; side += 2) {
      for (let row = 0; row < rows; row += 1) {
        const v0 = row / rows * 2 - 1;
        const v1 = (row + 1) / rows * 2 - 1;
        mantaPoint(side, v0, time, energy, this.pointer, this.pulseEnergy, target);
        outline.setXYZ(cursor++, target.x, target.y, target.z + .035);
        mantaPoint(side, v1, time, energy, this.pointer, this.pulseEnergy, target);
        outline.setXYZ(cursor++, target.x, target.y, target.z + .035);
      }
    }
    for (let edgeRow = -1; edgeRow <= 1; edgeRow += 2) {
      for (let column = 0; column < columns; column += 1) {
        const u0 = column / columns * 2 - 1;
        const u1 = (column + 1) / columns * 2 - 1;
        mantaPoint(u0, edgeRow, time, energy, this.pointer, this.pulseEnergy, target);
        outline.setXYZ(cursor++, target.x, target.y, target.z + .035);
        mantaPoint(u1, edgeRow, time, energy, this.pointer, this.pulseEnergy, target);
        outline.setXYZ(cursor++, target.x, target.y, target.z + .035);
      }
    }
    outline.needsUpdate = true;

    const tails = manta.tails.geometry.getAttribute("position");
    cursor = 0;
    for (let tail = 0; tail < manta.tailCount; tail += 1) {
      const u = -.86 + tail / Math.max(manta.tailCount - 1, 1) * 1.72;
      mantaPoint(u, -.91, time, energy, this.pointer, this.pulseEnergy, target);
      const originX = target.x;
      const originY = target.y;
      const originZ = target.z;
      for (let step = 0; step < manta.tailSteps; step += 1) {
        for (let endpoint = 0; endpoint < 2; endpoint += 1) {
          const t = (step + endpoint) / manta.tailSteps;
          tails.setXYZ(
            cursor++,
            originX + Math.sin(time * 1.45 + tail * .71 + t * 6) * t * (.12 + energy * .32),
            originY - t * (2.1 + seeded(tail + 70) * 1.7),
            originZ + Math.cos(time * 1.2 + tail * .44 + t * 5.5) * t * .36,
          );
        }
      }
    }
    tails.needsUpdate = true;
  }

  createSeed() {
    const group = new THREE.Group();
    group.visible = false;
    group.rotation.x = -.28;
    const petals = [];
    const structures = [];
    for (let ring = 0; ring < 3; ring += 1) {
      const count = 8 + ring * 3;
      const geometry = createPetalGeometry(2.55 + ring * .52, .72 + ring * .16, this.quality < 1 ? 18 : 27, 6);
      for (let index = 0; index < count; index += 1) {
        const hueColor = ring === 0 ? 0xffc69e : ring === 1 ? 0xbf8cff : 0x69ddff;
        const material = new THREE.MeshPhysicalMaterial({ color: hueColor, emissive: hueColor, emissiveIntensity: .32 + ring * .18, roughness: .28, metalness: .03, transmission: .18, thickness: .34, transparent: true, opacity: .2 - ring * .018, side: THREE.DoubleSide, depthWrite: false });
        const pivot = new THREE.Group();
        const petal = new THREE.Mesh(geometry, material);
        const angle = index / count * TAU + ring * .13;
        pivot.rotation.z = angle;
        pivot.rotation.y = Math.sin(angle * 2 + ring) * .08;
        pivot.position.z = -.12 * ring;
        petal.rotation.x = -1.02 + ring * .1;
        petal.scale.setScalar(.85 + ring * .12);
        pivot.add(petal);
        group.add(pivot);
        petals.push({ pivot, mesh: petal, angle, ring, index, count, baseScale: .85 + ring * .12 });
      }
      const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: ring === 0 ? 0xffcfac : 0x8deaff, wireframe: true, transparent: true, opacity: .13, depthWrite: false, blending: THREE.AdditiveBlending }));
      wire.visible = false;
      wire.userData.ring = ring;
      structures.push(wire);
      group.add(wire);
    }

    const coreGroup = new THREE.Group();
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.72, 4), new THREE.MeshPhysicalMaterial({ color: 0xffc696, emissive: 0xb83d31, emissiveIntensity: 1.05, roughness: .21, metalness: .14, transparent: true, opacity: .88 }));
    coreGroup.add(core);
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.08, 2), new THREE.MeshBasicMaterial({ color: 0x8eeaff, wireframe: true, transparent: true, opacity: .14, blending: THREE.AdditiveBlending, depthWrite: false }));
    coreGroup.add(shell);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTexture, color: 0xff9c75, transparent: true, opacity: .56, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.scale.setScalar(3.1);
    glow.material.opacity = .3;
    coreGroup.add(glow);
    group.add(coreGroup);

    const pollenCount = Math.floor(720 * this.quality);
    const pollenPositions = new Float32Array(pollenCount * 3);
    const pollenUvs = new Float32Array(pollenCount * 2);
    const pollenDirections = fibonacciDirections(pollenCount);
    const pollenSeeds = new Float32Array(pollenCount);
    for (let index = 0; index < pollenCount; index += 1) {
      pollenSeeds[index] = seeded(index + 5000);
      pollenUvs[index * 2] = seeded(index + 6000);
      pollenUvs[index * 2 + 1] = seeded(index + 7000);
    }
    const pollenGeometry = new THREE.BufferGeometry();
    pollenGeometry.setAttribute("position", new THREE.BufferAttribute(pollenPositions, 3));
    pollenGeometry.setAttribute("uv", new THREE.BufferAttribute(pollenUvs, 2));
    const pollen = new THREE.Points(pollenGeometry, new THREE.PointsMaterial({ map: this.glowTexture, color: 0xbfefff, size: .12, transparent: true, opacity: .66, blending: THREE.AdditiveBlending, depthWrite: false, alphaTest: .02 }));
    group.add(pollen);
    return { group, hero: { petals, structures, coreGroup, core, shell, pollen, pollenDirections, pollenSeeds }, structure: structures };
  }

  createFerro() {
    const group = new THREE.Group();
    group.visible = false;
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(2.28, 6), new THREE.MeshPhysicalMaterial({ color: 0x061017, emissive: 0x041b28, emissiveIntensity: .72, roughness: .12, metalness: .88, clearcoat: 1, clearcoatRoughness: .08 }));
    group.add(core);
    const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 3), new THREE.MeshPhysicalMaterial({ color: 0x355d6a, emissive: 0x36b9de, emissiveIntensity: 1.4, roughness: .18, metalness: .65, transparent: true, opacity: .58 }));
    group.add(inner);

    const spikeCount = Math.floor(920 * this.quality);
    const directions = fibonacciDirections(spikeCount);
    const cone = new THREE.ConeGeometry(.045, .82, 5, 1, true);
    cone.translate(0, .41, 0);
    const spikeMaterial = new THREE.MeshPhysicalMaterial({ color: 0x5fb9ca, emissive: 0x0b5471, emissiveIntensity: .85, roughness: .2, metalness: .82, clearcoat: .7, clearcoatRoughness: .12 });
    const spikes = new THREE.InstancedMesh(cone, spikeMaterial, spikeCount);
    spikes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(spikes);

    const fieldLineCount = this.quality < 1 ? 48 : 84;
    const fieldPositions = new Float32Array(fieldLineCount * 2 * 3);
    const fieldGeometry = new THREE.BufferGeometry();
    fieldGeometry.setAttribute("position", new THREE.BufferAttribute(fieldPositions, 3));
    const fieldLines = new THREE.LineSegments(fieldGeometry, new THREE.LineBasicMaterial({ color: 0x8deaff, transparent: true, opacity: .28, blending: THREE.AdditiveBlending, depthWrite: false }));
    fieldLines.visible = false;
    group.add(fieldLines);

    const rings = [];
    for (let index = 0; index < 4; index += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.05 + index * .44, .012, 6, 120), new THREE.MeshBasicMaterial({ color: index % 2 ? 0xa078ff : 0x67e5ff, transparent: true, opacity: .12, blending: THREE.AdditiveBlending, depthWrite: false }));
      ring.rotation.set(index * .42, index * .66, index * .23);
      group.add(ring);
      rings.push(ring);
    }
    const altar = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.15, .38, 96, 1, true), new THREE.MeshPhysicalMaterial({ color: 0x071018, emissive: 0x06131c, emissiveIntensity: .4, metalness: .9, roughness: .18, transparent: true, opacity: .88, side: THREE.DoubleSide }));
    altar.rotation.x = Math.PI / 2;
    altar.position.z = -1.5;
    group.add(altar);
    return { group, hero: { core, inner, spikes, spikeCount, directions, fieldLines, fieldLineCount, rings, altar }, structure: [fieldLines] };
  }

  setSubjectOpacity(subject, factor) {
    subject.materials.forEach((material) => {
      material.opacity = material.userData.arenaOpacity * factor;
    });
  }

  setCandidate(candidate) {
    if (!this.subjects[candidate] || candidate === this.activeCandidate) return;
    const from = this.activeCandidate;
    const to = candidate;
    this.subjects[to].group.visible = true;
    this.setSubjectOpacity(this.subjects[to], 0);
    this.subjects[to].group.scale.setScalar(.78);
    this.transition = { from, to, start: this.lastTime, duration: this.reducedMotion ? .08 : .72 };
    this.activeCandidate = candidate;
    this.setStructure(this.structureVisible);
    this.triggerPulse(.62);
  }

  setStructure(visible) {
    this.structureVisible = visible;
    Object.entries(this.subjects).forEach(([name, subject]) => {
      subject.structure.forEach((object) => { object.visible = visible && name === this.activeCandidate; });
    });
    const manta = this.subjects.manta?.hero;
    if (manta) {
      manta.underlay.material.opacity = visible && this.activeCandidate === "manta" ? .19 : .025;
      manta.ribs.material.opacity = visible && this.activeCandidate === "manta" ? .72 : .27;
    }
  }

  setPointer(x, y, strength = .2) {
    this.pointerTarget.set(clamp01((x + 1) * .5) * 2 - 1, clamp01((y + 1) * .5) * 2 - 1, Math.min(Math.max(strength, 0), 1));
  }

  triggerPulse(intensity = 1) {
    this.pulseEnergy = Math.max(this.pulseEnergy, intensity);
    const ring = this.pulses[this.pulseCursor++ % this.pulses.length];
    const colors = { manta: 0x74eaff, seed: 0xffa477, ferro: 0xa17aff };
    ring.material.color.setHex(colors[this.activeCandidate]);
    ring.material.opacity = .65;
    ring.scale.setScalar(.45);
    ring.position.set(0, 0, 1.2);
    ring.visible = true;
    ring.userData.age = 0;
  }

  updateTransition(time) {
    if (!this.transition) return;
    const progress = clamp01((time - this.transition.start) / this.transition.duration);
    const eased = smoothstep(progress);
    const from = this.subjects[this.transition.from];
    const to = this.subjects[this.transition.to];
    this.setSubjectOpacity(from, 1 - eased);
    this.setSubjectOpacity(to, eased);
    from.group.scale.setScalar(1 + eased * .2);
    to.group.scale.setScalar(.78 + eased * .22);
    if (progress >= 1) {
      from.group.visible = false;
      from.group.scale.setScalar(1);
      this.setSubjectOpacity(from, 1);
      to.group.scale.setScalar(1);
      this.setSubjectOpacity(to, 1);
      this.transition = null;
    }
  }

  updateManta(time, low, mid, high) {
    const manta = this.subjects.manta.hero;
    this.updateMantaGeometry(manta, time, .3 + low * .75 + mid * .3);
    manta.group.rotation.y += (this.pointer.x * .17 - manta.group.rotation.y) * .055;
    manta.group.rotation.x += (-this.pointer.y * .08 - .03 - manta.group.rotation.x) * .055;
    manta.group.position.y = Math.sin(time * .48) * .18;
    manta.surface.material.emissiveIntensity = 1.3 + low * 1.6 + this.pulseEnergy * 1.2;
    manta.core.material.emissiveIntensity = 1.05 + low * 1.45 + high * .62;
    manta.core.scale.set(.58, 1.48, .44).multiplyScalar(.86 + low * .18 + this.pulseEnergy * .12);
    manta.coreGroup.rotation.y = time * (.22 + mid * .52);
    manta.coreGroup.rotation.z = Math.sin(time * .7) * .18;
    manta.tails.material.opacity = .36 + high * .52 + this.pulseEnergy * .2;
    manta.followers.forEach((follower, index) => {
      follower.position.x += Math.sin(time * .2 + index) * .0018;
      follower.position.y += Math.cos(time * .18 + index * 1.7) * .0013;
      follower.rotation.z = Math.sin(time * .42 + index) * .15;
    });
  }

  updateSeed(time, low, mid, high) {
    const seed = this.subjects.seed.hero;
    const bloomValue = .48 + Math.sin(time * .62) * .13 + mid * .34 + this.pulseEnergy * .26;
    seed.petals.forEach(({ pivot, mesh, angle, ring, index, baseScale }) => {
      const phase = time * (.35 + ring * .08) + index * .23;
      pivot.rotation.z = angle + time * (.035 + ring * .018) * (ring % 2 ? -1 : 1);
      pivot.rotation.y = Math.sin(phase * .62) * (.08 + ring * .025);
      pivot.position.z = -.18 * ring + Math.sin(phase) * .06;
      mesh.rotation.x = -1.32 + bloomValue * (.94 + ring * .12) + Math.sin(phase) * .065;
      const scale = baseScale * (1 + low * .1 + Math.sin(phase * .7) * .018);
      mesh.scale.setScalar(scale);
      mesh.material.emissiveIntensity = .24 + high * .72 + this.pulseEnergy * .42 + ring * .13;
    });
    seed.structures.forEach((wire, index) => {
      wire.rotation.z = time * (.035 + index * .02) * (index % 2 ? -1 : 1);
      wire.rotation.x = -.45 + bloomValue * .55;
    });
    seed.coreGroup.rotation.y = time * (.22 + mid * .4);
    seed.coreGroup.rotation.x = time * .11;
    seed.core.scale.setScalar(.82 + low * .34 + this.pulseEnergy * .22);
    seed.core.material.emissiveIntensity = .9 + low * 1.8 + high * .55;
    const positions = seed.pollen.geometry.getAttribute("position");
    for (let index = 0; index < positions.count; index += 1) {
      const direction = seed.pollenDirections[index];
      const local = seed.pollenSeeds[index];
      const cycle = (time * (.045 + high * .07) + local + this.pulseEnergy * .13) % 1;
      const radius = .9 + cycle * (3.2 + local * 4.8);
      const spiral = time * .24 + local * TAU + cycle * 4.5;
      positions.setXYZ(
        index,
        direction.x * radius + Math.cos(spiral) * cycle * .42,
        direction.y * radius + Math.sin(spiral * .8) * cycle * .35,
        direction.z * radius * .62 + Math.sin(spiral) * cycle * .5,
      );
    }
    positions.needsUpdate = true;
    seed.pollen.material.opacity = .4 + high * .42 + this.pulseEnergy * .2;
    const group = this.subjects.seed.group;
    group.rotation.y = Math.sin(time * .22) * .2 + this.pointer.x * .16;
    group.rotation.x += (-.28 - this.pointer.y * .1 - group.rotation.x) * .045;
  }

  updateFerro(time, low, mid, high) {
    const ferro = this.subjects.ferro.hero;
    const field = this.temp.set(this.pointer.x * .85, this.pointer.y * .85, .62).normalize();
    for (let index = 0; index < ferro.spikeCount; index += 1) {
      const direction = ferro.directions[index];
      const alignment = Math.abs(direction.dot(field));
      const travelling = Math.sin(time * 2.2 + index * .071) * .5 + .5;
      const length = .28 + alignment ** 5 * (1.35 + low * 1.1) + travelling * high * .42 + this.pulseEnergy * (.32 + alignment * .65);
      this.dummy.position.copy(direction).multiplyScalar(2.12 + length * .34);
      this.dummy.quaternion.setFromUnitVectors(UP, direction);
      this.dummy.scale.set(.62 + high * .2, length, .62 + high * .2);
      this.dummy.updateMatrix();
      ferro.spikes.setMatrixAt(index, this.dummy.matrix);
      this.tempColor.setHex(alignment > .72 ? 0x9af4ff : alignment > .38 ? 0x5a96ba : 0x7256a8).multiplyScalar(.72 + travelling * .34);
      ferro.spikes.setColorAt(index, this.tempColor);
    }
    ferro.spikes.instanceMatrix.needsUpdate = true;
    if (ferro.spikes.instanceColor) ferro.spikes.instanceColor.needsUpdate = true;
    ferro.spikes.material.emissiveIntensity = .62 + high * 1.2 + this.pulseEnergy * .7;
    ferro.core.rotation.y = time * .08;
    ferro.core.rotation.x = Math.sin(time * .31) * .05;
    ferro.inner.scale.setScalar(.82 + low * .28 + this.pulseEnergy * .14);
    ferro.inner.material.emissiveIntensity = 1 + low * 2.6 + high;
    ferro.rings.forEach((ring, index) => {
      ring.rotation.x += .0015 * (index + 1);
      ring.rotation.y -= .001 * (index + 1);
      ring.material.opacity = .07 + mid * .16 + this.pulseEnergy * .12;
    });
    const linePosition = ferro.fieldLines.geometry.getAttribute("position");
    for (let index = 0; index < ferro.fieldLineCount; index += 1) {
      const direction = ferro.directions[Math.floor(index / ferro.fieldLineCount * ferro.directions.length)];
      const alignment = Math.abs(direction.dot(field));
      linePosition.setXYZ(index * 2, direction.x * 2.1, direction.y * 2.1, direction.z * 2.1);
      linePosition.setXYZ(index * 2 + 1, direction.x * (3.4 + alignment * 1.4), direction.y * (3.4 + alignment * 1.4), direction.z * (3.4 + alignment * 1.4));
    }
    linePosition.needsUpdate = true;
    const group = this.subjects.ferro.group;
    group.rotation.y += (this.pointer.x * .28 - group.rotation.y) * .05;
    group.rotation.x += (-this.pointer.y * .18 - group.rotation.x) * .05;
  }

  updatePulses(delta) {
    this.pulses.forEach((ring) => {
      if (!ring.visible) return;
      ring.userData.age += delta;
      const age = ring.userData.age;
      ring.scale.setScalar(.45 + age * 4.8);
      ring.material.opacity = Math.max(0, .62 * (1 - age / 1.25));
      ring.rotation.z += delta * .4;
      if (age > 1.25) ring.visible = false;
    });
  }

  async update(time, bands, audioActive) {
    const delta = Math.min(this.lastTime ? time - this.lastTime : 1 / 60, .05);
    this.lastTime = time;
    this.pointer.lerp(this.pointerTarget, this.reducedMotion ? .18 : .075);
    this.pointerTarget.z *= this.reducedMotion ? .84 : .94;
    this.pulseEnergy *= this.reducedMotion ? .82 : .965;
    const idle = this.reducedMotion ? .04 : .17;
    const low = audioActive ? bands.low : idle + Math.sin(time * 1.18) * idle * .24;
    const mid = audioActive ? bands.mid : idle * .82 + Math.sin(time * .73 + 1.5) * idle * .19;
    const high = audioActive ? bands.high : idle * .46 + Math.max(0, Math.sin(time * 1.92)) * idle * .18;
    this.energy = low + mid * .55 + high * .3 + this.pointer.z * .5 + this.pulseEnergy * .45;

    const updating = new Set([this.activeCandidate]);
    if (this.transition?.from) updating.add(this.transition.from);
    if (updating.has("manta")) this.updateManta(time, low, mid, high);
    if (updating.has("seed")) this.updateSeed(time, low, mid, high);
    if (updating.has("ferro")) this.updateFerro(time, low, mid, high);
    this.updateTransition(time);
    this.updatePulses(delta);
    this.stars.rotation.y = time * (this.reducedMotion ? .0008 : .004);
    this.stars.rotation.z = time * (this.reducedMotion ? .0003 : .0015);
    this.halos.forEach((halo, index) => {
      halo.material.opacity = .08 + low * .08 + Math.sin(time * .2 + index) * .015;
    });
    this.bloomPass.strength.value = (this.quality < 1 ? .27 : .4) + high * .62 + this.pulseEnergy * .32;
    this.bloomPass.radius.value = .44 + mid * .12;
    this.controls.update();
    await this.postProcessing.renderAsync();
  }

  reset() {
    this.pointer.set(0, 0, 0);
    this.pointerTarget.set(0, 0, 0);
    this.pulseEnergy = 0;
    this.camera.position.set(0, .15, this.quality < 1 ? 15.7 : 12.4);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  getMetrics() {
    const subject = this.subjects[this.activeCandidate]?.hero;
    let objects = 0;
    let triangles = 0;
    if (this.activeCandidate === "manta" && subject) {
      objects = subject.geometry.getAttribute("position").count + subject.tailCount * subject.tailSteps;
      triangles = subject.geometry.index.count / 3;
    } else if (this.activeCandidate === "seed" && subject) {
      objects = subject.petals.length + subject.pollen.geometry.getAttribute("position").count;
      triangles = subject.petals.reduce((total, { mesh }) => total + mesh.geometry.index.count / 3, 0);
    } else if (this.activeCandidate === "ferro" && subject) {
      objects = subject.spikeCount;
      triangles = subject.spikeCount * subject.spikes.geometry.index.count / 3;
    }
    return {
      objects,
      triangles,
      energy: this.energy,
    };
  }

  dispose() {
    this.controls?.dispose();
    this.scene?.traverse((object) => {
      object.geometry?.dispose?.();
      if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
      else object.material?.dispose?.();
    });
    this.glowTexture?.dispose();
    this.postProcessing?.dispose?.();
    this.renderer?.dispose();
  }
}
