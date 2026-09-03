import * as THREE from "three/webgpu";
import {
  Fn,
  clamp,
  cos,
  dot,
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
  varying,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VerletPhysics } from "@aurelia-upstream/physics/verletPhysics.js";
import { SpringVisualizer } from "@aurelia-upstream/physics/springVisualizer.js";

const TAU = Math.PI * 2;
const WORD = "AURELIA";

function seeded(index) {
  const value = Math.sin(index * 127.13 + 17.71) * 43758.5453;
  return value - Math.floor(value);
}

function formatCount(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value);
}

function createGlyphBlueprint(quality) {
  const canvas = document.createElement("canvas");
  canvas.width = 1500;
  canvas.height = 400;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#ffffff";
  context.textBaseline = "alphabetic";
  context.font = '900 292px "Arial Black", Arial, sans-serif';

  const gap = 13;
  const widths = [...WORD].map((letter) => context.measureText(letter).width);
  const totalWidth = widths.reduce((sum, width) => sum + width, 0) + gap * (WORD.length - 1);
  const scale = Math.min(1, 1370 / totalWidth);
  context.save();
  context.translate((canvas.width - totalWidth * scale) / 2, 0);
  context.scale(scale, 1);
  const boxes = [];
  let cursor = 0;
  [...WORD].forEach((letter, index) => {
    context.fillText(letter, cursor, 315);
    boxes.push({ index, start: cursor * scale + (canvas.width - totalWidth * scale) / 2, end: (cursor + widths[index]) * scale + (canvas.width - totalWidth * scale) / 2 });
    cursor += widths[index] + gap;
  });
  context.restore();

  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const step = quality < 1 ? 15 : 11;
  const worldScaleX = quality < 1 ? 0.0051 : 0.00825;
  const worldScaleY = 0.00825;
  const samples = [];

  for (let y = step; y < canvas.height - step; y += step) {
    for (let x = step; x < canvas.width - step; x += step) {
      if (image.data[(y * canvas.width + x) * 4 + 3] < 120) continue;
      const letter = boxes.find((box) => x >= box.start && x <= box.end);
      if (!letter) continue;
      const base = new THREE.Vector3(
        (x - canvas.width * 0.5) * worldScaleX,
        (canvas.height * 0.52 - y) * worldScaleY,
        (seeded(samples.length + 4) - 0.5) * 0.026,
      );
      const letterCenterX = ((letter.start + letter.end) * 0.5 - canvas.width * 0.5) * worldScaleX;
      const localX = base.x - letterCenterX;
      const angle = letter.index / WORD.length * TAU - Math.PI * 0.55;
      const radial = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
      const tangent = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
      const center = radial.clone().multiplyScalar(3.85);
      center.y = (letter.index - (WORD.length - 1) * 0.5) * 0.16;
      const target = center
        .addScaledVector(tangent, localX * 0.78)
        .add(new THREE.Vector3(0, base.y * 0.88, 0))
        .addScaledVector(radial, base.y * 0.12);
      samples.push({
        x,
        y,
        letter: letter.index,
        base,
        target,
        phase: (x / canvas.width + y / canvas.height * 0.31 + letter.index * 0.17) % 1,
      });
    }
  }

  return { canvas, samples, step, width: canvas.width * worldScaleX, height: canvas.height * worldScaleY };
}

class IdentityAnchorBridge {
  constructor(physics) {
    this.physics = physics;
    this.anchors = [];
    this.uniforms = {
      elapsed: uniform(0),
      morph: uniform(0),
      low: uniform(0),
      mid: uniform(0),
      high: uniform(0),
      recall: uniform(0),
      cohesion: uniform(0.76),
    };
  }

  register(vertex, tetherId, base, target, phase) {
    this.anchors.push({ vertexId: vertex.id, tetherId, base: base.clone(), target: target.clone(), phase });
  }

  async bake() {
    const ids = new Uint32Array(this.anchors.length);
    const tetherIds = new Uint32Array(this.anchors.length);
    const bases = new Float32Array(this.anchors.length * 4);
    const targets = new Float32Array(this.anchors.length * 4);
    this.anchors.forEach(({ vertexId, tetherId, base, target, phase }, index) => {
      ids[index] = vertexId;
      tetherIds[index] = tetherId;
      bases.set([base.x, base.y, base.z, phase], index * 4);
      targets.set([target.x, target.y, target.z, phase], index * 4);
    });

    this.idData = instancedArray(ids, "uint");
    this.tetherData = instancedArray(tetherIds, "uint");
    this.baseData = instancedArray(bases, "vec4");
    this.targetData = instancedArray(targets, "vec4");

    this.updateKernel = Fn(() => {
      const vertexId = this.idData.element(instanceIndex);
      const tetherId = this.tetherData.element(instanceIndex);
      const baseParam = this.baseData.element(instanceIndex);
      const targetParam = this.targetData.element(instanceIndex);
      const phase = baseParam.w;
      const morphEase = this.uniforms.morph.mul(this.uniforms.morph)
        .mul(float(3).sub(this.uniforms.morph.mul(2)));

      const identityPosition = baseParam.xyz.toVar();
      identityPosition.y.addAssign(sin(this.uniforms.elapsed.mul(0.62).add(phase.mul(TAU))).mul(0.016));
      identityPosition.z.addAssign(
        sin(this.uniforms.elapsed.mul(0.48).add(phase.mul(TAU * 2))).mul(0.018)
          .add(this.uniforms.low.mul(sin(phase.mul(TAU * 3)).mul(0.11))),
      );

      const orbitScale = float(1.19).sub(this.uniforms.cohesion.mul(0.2)).add(this.uniforms.low.mul(0.08));
      const orbit = targetParam.xyz.mul(orbitScale).toVar();
      const turn = this.uniforms.elapsed.mul(0.055)
        .add(this.uniforms.mid.mul(0.48))
        .add(sin(this.uniforms.elapsed.mul(0.19)).mul(0.035));
      const turnCos = cos(turn);
      const turnSin = sin(turn);
      const orbitX = orbit.x.mul(turnCos).sub(orbit.z.mul(turnSin));
      const orbitZ = orbit.x.mul(turnSin).add(orbit.z.mul(turnCos));
      orbit.x.assign(orbitX);
      orbit.z.assign(orbitZ);
      const highWave = sin(phase.mul(TAU * 9).sub(this.uniforms.elapsed.mul(8.5)))
        .mul(this.uniforms.high).mul(0.22);
      orbit.y.addAssign(highWave);
      orbit.z.addAssign(sin(phase.mul(TAU * 5).add(this.uniforms.elapsed.mul(2.1))).mul(this.uniforms.low).mul(0.28));

      const result = mix(identityPosition, orbit, morphEase).toVar();
      const recallWave = sin(phase.mul(TAU * 4).sub(this.uniforms.elapsed.mul(11)))
        .mul(this.uniforms.recall).mul(0.16).mul(float(1).sub(morphEase));
      result.y.addAssign(recallWave);
      this.physics.positionData.element(vertexId).xyz.assign(result);

      const tetherStrength = float(0.00042).add(this.uniforms.cohesion.mul(0.00118));
      this.physics.springParamsData.element(tetherId).x.assign(tetherStrength);
    })().compute(this.anchors.length);

    await this.physics.renderer.computeAsync(this.updateKernel);
  }

  setState(state) {
    Object.entries(state).forEach(([name, value]) => {
      if (this.uniforms[name]) this.uniforms[name].value = value;
    });
    this.needsUpdate = true;
  }

  async update() {
    if (!this.needsUpdate) return;
    this.needsUpdate = false;
    await this.physics.renderer.computeAsync(this.updateKernel);
  }
}

class IdentityPointerField {
  constructor(physics, { reducedMotion = false } = {}) {
    this.physics = physics;
    this.vertices = [];
    this.uniforms = {
      active: uniform(0),
      elapsed: uniform(0),
      origin: uniform(new THREE.Vector3(500, 500, 500)),
      direction: uniform(new THREE.Vector3(1, 0, 0)),
      radius: uniform(reducedMotion ? 1.02 : 1.28),
      strength: uniform(reducedMotion ? 0.00028 : 0.00062),
    };
  }

  register(vertex) {
    this.vertices.push(vertex.id);
  }

  async bake() {
    this.idData = instancedArray(new Uint32Array(this.vertices), "uint");
    this.updateKernel = Fn(() => {
      const vertexId = this.idData.element(instanceIndex);
      const position = this.physics.positionData.element(vertexId).xyz;
      const fromOrigin = position.sub(this.uniforms.origin).toVar();
      const rayDistance = dot(fromOrigin, this.uniforms.direction).max(0);
      const closestPoint = this.uniforms.origin.add(this.uniforms.direction.mul(rayDistance));
      const delta = position.sub(closestPoint).toVar();
      const distanceToRay = delta.length().max(0.0001);
      const falloff = clamp(float(1).sub(distanceToRay.div(this.uniforms.radius)), 0, 1).toVar();
      const pulse = float(0.9).add(sin(this.uniforms.elapsed.mul(3.8).sub(distanceToRay.mul(5.2))).mul(0.1));
      const force = delta.div(distanceToRay)
        .mul(falloff.mul(falloff))
        .mul(this.uniforms.strength)
        .mul(this.uniforms.active)
        .mul(pulse);
      this.physics.forceData.element(vertexId).addAssign(force);
    })().compute(this.vertices.length);
  }

  setRay(origin, direction) {
    this.uniforms.origin.value.copy(origin);
    this.uniforms.direction.value.copy(direction);
    this.uniforms.active.value = 1;
  }

  clear() {
    this.uniforms.active.value = 0;
  }

  async update(_delta, elapsed) {
    this.uniforms.elapsed.value = elapsed;
    if (this.uniforms.active.value < 0.5) return;
    await this.physics.renderer.computeAsync(this.updateKernel);
  }
}

export class LivingIdentityScene {
  constructor(container, { reducedMotion = false, onStructureChange = () => {} } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.onStructureChange = onStructureChange;
    this.quality = window.innerWidth < 768 ? 0.68 : 1;
    this.pointer = new THREE.Vector2(4, 4);
    this.raycaster = new THREE.Raycaster();
    this.pointerPlane = new THREE.Plane();
    this.pointerPlaneNormal = new THREE.Vector3();
    this.pointerWorld = new THREE.Vector3();
    this.pointerActive = false;
    this.clock = new THREE.Clock();
    this.cohesion = 0.76;
    this.morph = 0;
    this.morphTarget = 0;
    this.recallEnergy = 0;
    this.lastHighAt = -10;
    this.previousHigh = 0;
    this.structureMode = "coherent";
    this.disposables = [];
  }

  async init(onProgress = () => {}) {
    globalThis.__AURELIA_LAB_CONFIG__ = {
      ...(globalThis.__AURELIA_LAB_CONFIG__ ?? {}),
      stepsPerSecond: this.quality < 1 ? 110 : 160,
    };

    this.renderer = new THREE.WebGPURenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality < 1 ? 0.84 : 0.74));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.9;
    await this.renderer.init();
    if (!this.renderer.backend?.isWebGPUBackend) throw new Error("没有可用的 WebGPU 后端");
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.container.prepend(this.renderer.domElement);
    onProgress(0.12, "建立 WebGPU 管线");

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080707);
    this.scene.fog = new THREE.FogExp2(0x080707, 0.02);
    this.camera = new THREE.PerspectiveCamera(43, window.innerWidth / window.innerHeight, 0.08, 90);
    this.camera.position.set(0.4, 0.18, this.quality < 1 ? 21.5 : 15.3);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0.06, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.065;
    this.controls.enablePan = false;
    this.controls.minDistance = this.quality < 1 ? 15 : 10;
    this.controls.maxDistance = this.quality < 1 ? 25 : 21;
    this.controls.minPolarAngle = Math.PI * 0.32;
    this.controls.maxPolarAngle = Math.PI * 0.68;
    this.controls.autoRotate = !this.reducedMotion;
    this.controls.autoRotateSpeed = 0.12;

    this.blueprint = createGlyphBlueprint(this.quality);
    onProgress(0.28, `采样 ${this.blueprint.samples.length} 个字形节点`);

    this.physics = new VerletPhysics(this.renderer);
    this.bridge = new IdentityAnchorBridge(this.physics);
    this.pointerField = new IdentityPointerField(this.physics, { reducedMotion: this.reducedMotion });
    this.physics.addObject(this.bridge);
    this.physics.addObject(this.pointerField);
    // Keep index 0 isolated: current Chrome/Dawn exposes an invalid first slot
    // for this standalone topology during GPU readback.
    this.physics.addVertex(new THREE.Vector3(100, 100, 100), true);
    this.buildGlyphTopology();
    onProgress(0.48, "连接形状记忆与邻接弹簧");
    await this.physics.bake();
    this.physics.uniforms.dampening.value = 0.976;
    this.physics.setMouseRay(new THREE.Vector3(500, 500, 500), new THREE.Vector3(1, 0, 0));
    onProgress(0.66, "编译 GPU 约束求解器");

    this.createGlyphNodes();
    this.createStructuralLines();
    this.createGhostMark();
    this.createOrbitGuides();
    this.createAtmosphere();
    this.createVfxPools();
    this.createPointerIndicator();
    onProgress(0.84, "连接拓扑、轨道与选择性辉光");

    this.setupPostProcessing();
    this.resize();
    onProgress(1, "活体字标已就绪");
  }

  buildGlyphTopology() {
    const { samples, step } = this.blueprint;
    const sampleMap = new Map();
    const nodes = [];

    samples.forEach((sample, index) => {
      const anchor = this.physics.addVertex(sample.base, true);
      const freeStart = sample.base.clone();
      freeStart.z += (seeded(index + 91) - 0.5) * 0.045;
      const node = this.physics.addVertex(freeStart, false);
      const tetherId = this.physics.addSpring(anchor, node, 0.00125, 0);
      this.bridge.register(anchor, tetherId, sample.base, sample.target, sample.phase);
      this.pointerField.register(node);
      const entry = { ...sample, anchor, node };
      nodes.push(entry);
      sampleMap.set(`${sample.x}:${sample.y}`, entry);
    });

    const offsets = [[step, 0], [0, step], [step, step], [-step, step], [step * 2, 0]];
    nodes.forEach((entry) => {
      offsets.forEach(([dx, dy], offsetIndex) => {
        const neighbor = sampleMap.get(`${entry.x + dx}:${entry.y + dy}`);
        if (!neighbor || neighbor.letter !== entry.letter) return;
        const stiffness = offsetIndex < 2 ? 0.00038 : offsetIndex < 4 ? 0.00021 : 0.00012;
        this.physics.addSpring(entry.node, neighbor.node, stiffness, 1);
      });
    });

    this.glyphNodes = nodes;
  }

  createGlyphNodes() {
    const ids = new Uint32Array(this.glyphNodes.length);
    const phases = new Float32Array(this.glyphNodes.length);
    this.glyphNodes.forEach(({ node, phase }, index) => {
      ids[index] = node.id;
      phases[index] = phase;
    });
    this.nodeIdData = instancedArray(ids, "uint");
    this.nodePhaseData = instancedArray(phases, "float");

    const sourceGeometry = new THREE.OctahedronGeometry(1, 0);
    const geometry = new THREE.InstancedBufferGeometry();
    geometry.copy(sourceGeometry);
    geometry.instanceCount = this.glyphNodes.length;
    sourceGeometry.dispose();

    const material = new THREE.MeshBasicNodeMaterial({ depthWrite: true });
    const phaseVarying = varying(float(0), "identityNodePhase");
    material.positionNode = Fn(() => {
      const id = this.nodeIdData.element(instanceIndex);
      const phase = this.nodePhaseData.element(instanceIndex);
      phaseVarying.assign(phase);
      const nodeSize = float(this.quality < 1 ? 0.038 : 0.043)
        .add(this.bridge.uniforms.high.mul(0.024))
        .add(this.bridge.uniforms.recall.mul(0.012));
      return this.physics.positionData.element(id).xyz.add(positionLocal.mul(nodeSize));
    })();
    material.colorNode = Fn(() => {
      const charge = sin(phaseVarying.mul(TAU * 8).sub(this.bridge.uniforms.elapsed.mul(8.5)))
        .mul(0.5).add(0.5).mul(this.bridge.uniforms.high);
      const orbitalColor = mix(vec3(0.98, 0.27, 0.18), vec3(0.13, 0.52, 1), phaseVarying);
      const stateColor = mix(vec3(0.93, 0.87, 0.74), orbitalColor, this.bridge.uniforms.morph.mul(0.72));
      return mix(stateColor, vec3(0.54, 0.82, 1), charge.mul(0.9));
    })();
    material.mrtNode = mrt({
      bloomIntensity: Fn(() => {
        const charge = sin(phaseVarying.mul(TAU * 8).sub(this.bridge.uniforms.elapsed.mul(8.5)))
          .mul(0.5).add(0.5).mul(this.bridge.uniforms.high);
        const amount = float(0.035).add(charge.mul(0.28)).add(this.bridge.uniforms.recall.mul(0.12));
        return vec4(amount, this.bridge.uniforms.morph.mul(0.2), 0, 1);
      })(),
    });

    this.nodeMesh = new THREE.Mesh(geometry, material);
    this.nodeMesh.frustumCulled = false;
    this.nodeMesh.renderOrder = 10;
    this.scene.add(this.nodeMesh);
    this.disposables.push(geometry, material);
  }

  createStructuralLines() {
    this.springVisualizer = new SpringVisualizer(this.physics);
    const { object, material } = this.springVisualizer;
    material.color = new THREE.Color(0xd9d2c4);
    material.transparent = true;
    material.opacity = this.quality < 1 ? 0.045 : 0.065;
    material.opacityNode = float(this.quality < 1 ? 0.045 : 0.055)
      .add(this.bridge.uniforms.morph.mul(this.quality < 1 ? 0.02 : 0.05));
    material.blending = THREE.NormalBlending;
    material.depthWrite = false;
    material.mrtNode = mrt({
      bloomIntensity: vec4(float(0.004).add(this.bridge.uniforms.high.mul(0.02)), 0, 0, 1),
    });
    object.renderOrder = 8;
    this.scene.add(object);
  }

  createGhostMark() {
    const texture = new THREE.CanvasTexture(this.blueprint.canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const geometry = new THREE.PlaneGeometry(this.blueprint.width, this.blueprint.height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xf3ead8,
      transparent: true,
      opacity: 0.045,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.ghostMark = new THREE.Mesh(geometry, material);
    this.ghostMark.position.set(0, 0, -0.22);
    this.ghostMark.renderOrder = 1;
    this.scene.add(this.ghostMark);
    this.disposables.push(texture, geometry, material);
  }

  createOrbitGuides() {
    this.orbitGuides = [];
    for (let index = 0; index < WORD.length; index += 1) {
      const points = [];
      for (let segment = 0; segment < 80; segment += 1) {
        const angle = segment / 80 * TAU;
        points.push(new THREE.Vector3(Math.cos(angle) * 0.9, Math.sin(angle) * 1.42, 0));
      }
      points.push(points[0].clone());
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: index % 2 ? 0x2c82ff : 0xff543d,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const guide = new THREE.Line(geometry, material);
      const orbitAngle = index / WORD.length * TAU - Math.PI * 0.55;
      guide.position.set(Math.cos(orbitAngle) * 3.85, (index - 3) * 0.16, Math.sin(orbitAngle) * 3.85);
      guide.rotation.y = -orbitAngle + Math.PI * 0.5;
      guide.renderOrder = 2;
      this.orbitGuides.push(guide);
      this.scene.add(guide);
      this.disposables.push(geometry, material);
    }
  }

  createAtmosphere() {
    const count = Math.floor(520 * this.quality);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const ivory = new THREE.Color(0xd7cebb);
    const blue = new THREE.Color(0x2d7dff);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (seeded(index + 8) - 0.5) * 35;
      positions[index * 3 + 1] = (seeded(index + 21) - 0.5) * 17;
      positions[index * 3 + 2] = (seeded(index + 39) - 0.5) * 23 - 4;
      const color = index % 13 === 0 ? blue : ivory;
      colors.set([color.r, color.g, color.b], index * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.026,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.dust = new THREE.Points(geometry, material);
    this.scene.add(this.dust);
    this.disposables.push(geometry, material);
  }

  createVfxPools() {
    this.signalCuts = [];
    for (let index = 0; index < 10; index += 1) {
      const geometry = new THREE.PlaneGeometry(8.8, 0.018);
      const material = new THREE.MeshBasicMaterial({
        color: index % 2 ? 0x2e80ff : 0xff533d,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const cut = new THREE.Mesh(geometry, material);
      cut.visible = false;
      cut.renderOrder = 18;
      cut.userData = { active: false, age: 0, life: 0.3, direction: 1 };
      this.signalCuts.push(cut);
      this.scene.add(cut);
      this.disposables.push(geometry, material);
    }
    this.cutCursor = 0;

    this.recallRings = [];
    for (let index = 0; index < 4; index += 1) {
      const geometry = new THREE.TorusGeometry(1, 0.009 + index * 0.002, 4, 150);
      const material = new THREE.MeshBasicMaterial({
        color: index % 2 ? 0x2e80ff : 0xf1e8d8,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.visible = false;
      ring.renderOrder = 17;
      ring.userData = { active: false, age: 0, life: 0.9 };
      this.recallRings.push(ring);
      this.scene.add(ring);
      this.disposables.push(geometry, material);
    }
    this.ringCursor = 0;
  }

  createPointerIndicator() {
    const geometry = new THREE.TorusGeometry(0.78, 0.012, 4, 96);
    const material = new THREE.MeshBasicMaterial({
      color: 0x9fc9ff,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.pointerIndicator = new THREE.Mesh(geometry, material);
    this.pointerIndicator.visible = false;
    this.pointerIndicator.renderOrder = 24;
    this.scene.add(this.pointerIndicator);
    this.disposables.push(geometry, material);
  }

  setupPostProcessing() {
    const scenePass = pass(this.scene, this.camera);
    scenePass.setMRT(mrt({ output, bloomIntensity: float(0) }));
    const colorPass = scenePass.getTextureNode();
    const bloomData = scenePass.getTextureNode("bloomIntensity");
    this.bloomPass = bloom(Fn(() => {
      const tint = mix(vec3(1, 0.68, 0.58), vec3(0.42, 0.7, 1), bloomData.g);
      return vec4(colorPass.rgb.mul(bloomData.r).mul(tint), 1);
    })());
    this.bloomPass.threshold.value = 0.001;
    this.bloomPass.strength.value = this.quality < 1 ? 0.16 : 0.22;
    this.bloomPass.radius.value = 0.5;

    this.postProcessing = new THREE.PostProcessing(this.renderer);
    this.postProcessing.outputColorTransform = false;
    this.postProcessing.outputNode = Fn(() => {
      const mask = clamp(bloomData.r, 0, 1);
      const finalBloom = this.bloomPass.rgb.mul(float(1).sub(mask).add(bloomData.g).clamp(0, 1));
      return vec4(colorPass.rgb.add(finalBloom), 1).renderOutput();
    })();
  }

  setPointer(clientX, clientY) {
    if (!this.renderer) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = (clientX - rect.left) / rect.width * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height * 2 - 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.pointerField.setRay(this.raycaster.ray.origin, this.raycaster.ray.direction);
    this.camera.getWorldDirection(this.pointerPlaneNormal);
    this.pointerPlane.setFromNormalAndCoplanarPoint(this.pointerPlaneNormal, this.controls.target);
    if (this.raycaster.ray.intersectPlane(this.pointerPlane, this.pointerWorld)) {
      this.pointerActive = true;
      this.pointerIndicator.visible = true;
      this.pointerIndicator.position.copy(this.pointerWorld);
      this.pointerIndicator.quaternion.copy(this.camera.quaternion);
    }
  }

  clearPointer() {
    this.pointerActive = false;
    this.pointerField?.clear();
    if (this.pointerIndicator) this.pointerIndicator.visible = false;
  }

  setCohesion(value) {
    this.cohesion = Math.min(Math.max(Number(value), 0.35), 1);
    this.physics.uniforms.dampening.value = 0.958 + this.cohesion * 0.027;
  }

  signal(kind = "frequency") {
    const amount = this.reducedMotion ? 1 : kind === "transition" ? 4 : 2;
    for (let item = 0; item < amount; item += 1) {
      const cut = this.signalCuts[this.cutCursor % this.signalCuts.length];
      this.cutCursor += 1;
      cut.visible = true;
      cut.userData.active = true;
      cut.userData.age = 0;
      cut.userData.life = this.reducedMotion ? 0.18 : 0.22 + seeded(this.cutCursor + 2) * 0.2;
      cut.userData.direction = seeded(this.cutCursor + 9) > 0.5 ? 1 : -1;
      cut.position.set((seeded(this.cutCursor + 11) - 0.5) * 2, (seeded(this.cutCursor + 17) - 0.5) * 3, 1.2 + item * 0.03);
      cut.rotation.z = (seeded(this.cutCursor + 25) - 0.5) * 0.48;
      cut.scale.set(0.12, 1, 1);
    }
  }

  spawnRecallRing() {
    const amount = this.reducedMotion ? 1 : 3;
    for (let index = 0; index < amount; index += 1) {
      const ring = this.recallRings[this.ringCursor % this.recallRings.length];
      this.ringCursor += 1;
      ring.visible = true;
      ring.userData.active = true;
      ring.userData.age = -index * 0.11;
      ring.scale.set(6.4, 1.65, 1);
      ring.position.set(0, 0, 0.75 + index * 0.03);
    }
  }

  deconstruct() {
    this.morphTarget = 1;
    this.signal("transition");
    this.setStructureMode("deconstructing");
  }

  recall(resetView = false) {
    this.morphTarget = 0;
    this.recallEnergy = 1;
    this.signal("transition");
    this.spawnRecallRing();
    this.setStructureMode("recalling");
    if (resetView) this.resetView();
  }

  toggleStructure() {
    if (this.morphTarget > 0.5) this.recall();
    else this.deconstruct();
  }

  setStructureMode(mode) {
    if (this.structureMode === mode) return;
    this.structureMode = mode;
    this.onStructureChange({ mode, progress: this.morph });
  }

  updateVfx(delta) {
    this.signalCuts.forEach((cut) => {
      if (!cut.userData.active) return;
      cut.userData.age += delta;
      const progress = cut.userData.age / cut.userData.life;
      if (progress >= 1) {
        cut.userData.active = false;
        cut.visible = false;
        return;
      }
      cut.position.x += cut.userData.direction * delta * 5.2;
      cut.scale.x = 0.18 + Math.sin(progress * Math.PI) * 1.05;
      cut.material.opacity = Math.sin(progress * Math.PI) * (this.reducedMotion ? 0.14 : 0.34);
    });

    this.recallRings.forEach((ring) => {
      if (!ring.userData.active) return;
      ring.userData.age += delta;
      if (ring.userData.age < 0) return;
      const progress = ring.userData.age / ring.userData.life;
      if (progress >= 1) {
        ring.userData.active = false;
        ring.visible = false;
        return;
      }
      const scale = 1.22 - progress * 0.36;
      ring.scale.set(6.4 * scale, 1.65 * scale, 1);
      ring.material.opacity = Math.sin(progress * Math.PI) * (this.reducedMotion ? 0.08 : 0.2);
    });
  }

  updateDecorations(elapsed, state) {
    this.ghostMark.material.opacity = 0.014 + (1 - this.morph) * 0.038;
    this.orbitGuides.forEach((guide, index) => {
      guide.material.opacity = this.morph * (0.045 + state.mid * 0.08);
      guide.rotation.z = Math.sin(elapsed * 0.25 + index) * 0.08 * this.morph;
    });
    this.dust.rotation.y = elapsed * 0.004;
    if (this.pointerActive) {
      const pulse = 1 + Math.sin(elapsed * 4.2) * (this.reducedMotion ? 0.015 : 0.045);
      this.pointerIndicator.scale.setScalar(pulse);
      this.pointerIndicator.material.opacity = this.reducedMotion ? 0.16 : 0.24 + Math.sin(elapsed * 4.2) * 0.035;
      this.pointerIndicator.quaternion.copy(this.camera.quaternion);
    }
  }

  async update(elapsed, bands, playing) {
    const delta = Math.min(this.clock.getDelta(), 0.04);
    const transitionSpeed = this.reducedMotion ? 2.4 : this.morphTarget > this.morph ? 0.92 : 1.38;
    this.morph += (this.morphTarget - this.morph) * (1 - Math.exp(-delta * transitionSpeed));
    this.recallEnergy *= this.reducedMotion ? 0.84 : 0.947;

    if (playing && bands.high > 0.2 && this.previousHigh <= 0.2 && elapsed - this.lastHighAt > 0.14) {
      this.signal("frequency");
      this.lastHighAt = elapsed;
    }

    if (this.morphTarget > 0.5) {
      if (this.morph > 0.985) this.setStructureMode("deconstructed");
      else this.setStructureMode("deconstructing");
    } else if (this.morph < 0.018) this.setStructureMode("coherent");
    else this.setStructureMode("recalling");
    this.onStructureChange({ mode: this.structureMode, progress: this.morph });

    const autonomous = playing ? 0 : 1;
    const state = {
      elapsed,
      morph: this.morph,
      low: Math.min(1, bands.low + autonomous * 0.035),
      mid: Math.min(1, bands.mid + autonomous * 0.02),
      high: Math.min(1, bands.high + autonomous * 0.012),
      recall: this.recallEnergy,
      cohesion: this.cohesion,
    };
    this.bridge.setState(state);
    await this.physics.update(delta, elapsed);
    this.controls.update(delta);
    this.updateDecorations(elapsed, state);
    this.updateVfx(delta);
    this.previousHigh = bands.high;
    await this.postProcessing.renderAsync();
  }

  resetView() {
    this.camera.position.set(0.4, 0.18, this.quality < 1 ? 21.5 : 15.3);
    this.controls.target.set(0, 0.06, 0);
    this.controls.update();
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const mobile = width < 768;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 0.84 : 0.74));
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  getStats() {
    return {
      nodes: this.glyphNodes.length,
      vertices: this.physics.vertexCount,
      springs: this.physics.springCount,
      solverRate: this.quality < 1 ? 110 : 160,
      quality: this.quality,
      labels: {
        nodes: formatCount(this.glyphNodes.length),
        springs: formatCount(this.physics.springCount),
      },
    };
  }

  async destroy() {
    this.controls?.dispose();
    this.disposables.forEach((resource) => resource.dispose?.());
    this.renderer?.dispose();
  }
}
