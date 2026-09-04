import * as THREE from "three/webgpu";
import {
  Fn,
  If,
  clamp,
  float,
  instanceIndex,
  instancedArray,
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
import { INK_MODES, InkPainter } from "./painter.js";

const BRISTLE_COUNT = 11;
const BRISTLE_SEGMENTS = 4;

function clamp01(value) { return Math.max(0, Math.min(1, value)); }

class BrushConstraintBridge {
  constructor(physics) {
    this.physics = physics;
    this.uniforms = {
      center: uniform(new THREE.Vector3(0, 0, 0)),
      direction: uniform(new THREE.Vector2(0.28, -0.96)),
      pressure: uniform(0.62),
      speed: uniform(0),
      elapsed: uniform(0),
      motionScale: uniform(1),
    };
    this.resetRequested = false;
  }

  async bake() {
    const metadata = new Float32Array(this.physics.vertexCount * 4);
    this.physics.vertices.forEach((vertex) => {
      const meta = vertex.brushMeta ?? { across: 0, segment: 0, phase: 0, brush: 0 };
      metadata.set([meta.across, meta.segment, meta.phase, meta.brush], vertex.id * 4);
    });
    this.metadata = instancedArray(metadata, "vec4");

    this.forceKernel = Fn(() => {
      const meta = this.metadata.element(instanceIndex);
      const position = this.physics.positionData.element(instanceIndex).toVar();
      const force = this.physics.forceData.element(instanceIndex).toVar();
      const direction = vec3(this.uniforms.direction.x, this.uniforms.direction.y, 0);
      const right = vec3(this.uniforms.direction.y.negate(), this.uniforms.direction.x, 0);
      const segment = meta.y;
      const pressure = this.uniforms.pressure;
      const speed = this.uniforms.speed;
      const spread = float(0.038).add(pressure.mul(0.12)).mul(meta.x).mul(float(0.7).add(segment.mul(1.5)));
      const trail = direction.mul(speed.mul(segment).mul(-0.24));
      const bristleWave = sin(this.uniforms.elapsed.mul(7.4).add(meta.z)).mul(speed).mul(segment).mul(0.022).mul(this.uniforms.motionScale);
      const target = this.uniforms.center
        .add(right.mul(spread.add(bristleWave)))
        .add(trail)
        .add(vec3(0, 0, float(0.035).add(float(0.69).mul(float(1).sub(segment))))).toVar();

      If(segment.lessThan(0.05), () => {
        position.xyz.assign(target);
        force.assign(vec3(0));
      });

      If(segment.greaterThan(0.05), () => {
        const attraction = target.sub(position.xyz).mul(float(0.0000028).add(pressure.mul(0.0000048)));
        const fiberNoise = right.mul(sin(this.uniforms.elapsed.mul(5.6).add(meta.z.mul(1.7))).mul(0.00000015).mul(speed));
        force.addAssign(attraction.add(fiberNoise).mul(this.uniforms.motionScale));
        If(position.z.lessThan(0.032), () => {
          position.z.assign(0.032);
          force.z.assign(force.z.abs().mul(0.08));
          force.xy.mulAssign(float(0.76).sub(pressure.mul(0.16)));
        });
        const offset = position.xyz.sub(target).toVar();
        const distance = offset.length().max(0.00001);
        const budget = float(0.24).add(segment.mul(0.34));
        position.xyz.assign(target.add(offset.mul(clamp(budget.div(distance), 0, 1))));
        this.physics.positionData.element(instanceIndex).xyz.assign(position.xyz);
        this.physics.forceData.element(instanceIndex).assign(force);
      });
    })().compute(this.physics.vertexCount);

    this.resetKernel = Fn(() => {
      const meta = this.metadata.element(instanceIndex);
      const direction = vec3(this.uniforms.direction.x, this.uniforms.direction.y, 0);
      const right = vec3(this.uniforms.direction.y.negate(), this.uniforms.direction.x, 0);
      const target = this.uniforms.center
        .add(right.mul(meta.x.mul(0.07)))
        .add(direction.mul(meta.y.mul(-0.05)))
        .add(vec3(0, 0, float(0.035).add(float(0.69).mul(float(1).sub(meta.y)))));
      this.physics.positionData.element(instanceIndex).xyz.assign(target);
      this.physics.forceData.element(instanceIndex).assign(vec3(0));
    })().compute(this.physics.vertexCount);
  }

  setState({ center, direction, pressure, speed, elapsed, motionScale }) {
    this.uniforms.center.value.copy(center);
    this.uniforms.direction.value.copy(direction);
    this.uniforms.pressure.value = pressure;
    this.uniforms.speed.value = speed;
    this.uniforms.elapsed.value = elapsed;
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

class DemoGesture {
  constructor(owner) {
    this.owner = owner;
    this.active = false;
    this.elapsed = 0;
    this.duration = 3.4;
    this.started = false;
  }

  start() {
    this.active = true;
    this.elapsed = 0;
    this.started = false;
  }

  stop() {
    if (this.started) this.owner.endSyntheticStroke();
    this.active = false;
    this.started = false;
  }

  pointAt(t) {
    const x = 0.13 + t * 0.73;
    const y = 0.57 + Math.sin(t * Math.PI * 1.72) * 0.19 - Math.sin(t * Math.PI * 4.8) * 0.035;
    return { x, y: clamp01(y) };
  }

  update(delta) {
    if (!this.active) return;
    this.elapsed += delta;
    const t = clamp01(this.elapsed / this.duration);
    const point = this.pointAt(t);
    const pressure = clamp01(0.42 + Math.sin(t * Math.PI) * 0.48 + Math.sin(t * Math.PI * 5) * 0.08);
    if (!this.started) {
      this.started = true;
      this.owner.beginSyntheticStroke(point, pressure);
    } else {
      this.owner.moveSyntheticStroke(point, pressure);
    }
    if (t >= 1) {
      this.owner.endSyntheticStroke();
      this.active = false;
      this.started = false;
    }
  }
}

export class LivingInkScene {
  constructor(container, { reducedMotion = false, onMetrics = () => {}, onPhase = () => {} } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.onMetrics = onMetrics;
    this.onPhase = onPhase;
    this.mobile = (container.clientWidth || innerWidth) < 700;
    this.paperSize = this.mobile ? { width: 6.15, height: 8.2 } : { width: 11.2, height: 7 };
    this.painter = new InkPainter({ width: this.mobile ? 960 : 1536, height: this.mobile ? 1280 : 960, reducedMotion });
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.ndc = new THREE.Vector2();
    this.pointerWorld = new THREE.Vector3(0, -0.4, 0);
    this.pointerDirection = new THREE.Vector2(0.28, -0.96).normalize();
    this.lastWorld = new THREE.Vector3();
    this.lastPointerTime = performance.now();
    this.pointerActive = false;
    this.pointerVisible = true;
    this.phase = "remember";
    this.phaseAge = 99;
    this.frameTimeEma = 0;
    this.lastMetricsAt = -1;
    this.structureVisible = false;
    this.disposables = [];
    this.dummy = new THREE.Object3D();
    this.demo = new DemoGesture(this);
    this.splatCursor = 0;
    this.splatStates = [];
    this.inkTextureDirty = true;
  }

  async init(onProgress = () => {}) {
    globalThis.__AURELIA_LAB_CONFIG__ = { ...(globalThis.__AURELIA_LAB_CONFIG__ ?? {}), stepsPerSecond: this.mobile ? 90 : 144 };
    const { width, height } = this.getViewportSize();
    this.renderer = new THREE.WebGPURenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.mobile ? 0.78 : 1));
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.04;
    await this.renderer.init();
    if (!this.renderer.backend?.isWebGPUBackend) throw new Error("没有可用的 WebGPU 后端");
    this.renderer.domElement.setAttribute("aria-label", "可直接书写并观察笔锋约束与墨水时间记忆的宣纸");
    this.container.prepend(this.renderer.domElement);
    onProgress(0.14, "展开明亮宣纸空间");

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd8cfbd);
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.05, 60);
    this.applyCamera();
    this.scene.add(new THREE.HemisphereLight(0xfffbef, 0x6f6252, 2.1));
    const key = new THREE.DirectionalLight(0xfff3d7, 3.4);
    key.position.set(-4, 7, 10);
    const fill = new THREE.DirectionalLight(0xc9d4cc, 1.2);
    fill.position.set(6, -3, 7);
    this.scene.add(key, fill);

    this.createPaper();
    this.pointerWorld.set(this.paperSize.width * 0.31, this.paperSize.height * 0.23, 0.02);
    onProgress(0.31, "铺设纸纤维与可沉积墨层");

    this.physics = new VerletPhysics(this.renderer);
    this.bridge = new BrushConstraintBridge(this.physics);
    this.physics.addObject(this.bridge);
    this.buildBrushTopology();
    await this.physics.bake();
    this.physics.uniforms.dampening.value = 0.88;
    this.physics.setMouseRay(new THREE.Vector3(400, 400, 400), new THREE.Vector3(1, 0, 0));
    onProgress(0.63, "编译 Aurelia 笔锋约束");

    this.createBrushVisual();
    this.createSplatPool();
    this.setupPostProcessing();
    this.setMode("dense");
    this.resize();
    this.bridge.requestReset();
    onProgress(1, "笔锋、墨层与时间记忆已连接");
  }

  createPaper() {
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(this.paperSize.width + 0.34, this.paperSize.height + 0.34),
      new THREE.MeshBasicMaterial({ color: 0x867b6d, transparent: true, opacity: 0.16 }),
    );
    shadow.position.set(0.16, -0.17, -0.09);
    this.scene.add(shadow);

    this.paper = new THREE.Mesh(
      new THREE.PlaneGeometry(this.paperSize.width, this.paperSize.height, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xf1e8d7, roughness: 0.96, metalness: 0 }),
    );
    this.paper.position.z = 0;
    this.scene.add(this.paper);

    this.inkTexture = new THREE.CanvasTexture(this.painter.canvas);
    this.inkTexture.colorSpace = THREE.SRGBColorSpace;
    this.inkTexture.minFilter = THREE.LinearFilter;
    this.inkTexture.magFilter = THREE.LinearFilter;
    this.inkLayer = new THREE.Mesh(
      new THREE.PlaneGeometry(this.paperSize.width, this.paperSize.height),
      new THREE.MeshBasicMaterial({ map: this.inkTexture, transparent: true, depthWrite: false, toneMapped: false }),
    );
    this.inkLayer.position.z = 0.018;
    this.inkLayer.visible = false;
    this.scene.add(this.inkLayer);

    this.painter.canvas.className = "ink-deposit-layer";
    this.painter.canvas.setAttribute("aria-hidden", "true");
    this.container.prepend(this.painter.canvas);

    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x9f9482, transparent: true, opacity: 0.28 });
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(this.paper.geometry), edgeMaterial);
    edges.position.z = 0.025;
    this.scene.add(edges);
    this.disposables.push(shadow.geometry, shadow.material, this.paper.geometry, this.paper.material, this.inkLayer.geometry, this.inkLayer.material, edgeMaterial, edges.geometry, this.inkTexture);
  }

  buildBrushTopology() {
    this.bristleVertices = [];
    const center = new THREE.Vector3(0, -0.4, 0);
    for (let bristle = 0; bristle < BRISTLE_COUNT; bristle += 1) {
      const across = bristle / (BRISTLE_COUNT - 1) * 2 - 1;
      const chain = [];
      for (let segmentIndex = 0; segmentIndex < BRISTLE_SEGMENTS; segmentIndex += 1) {
        const segment = segmentIndex / (BRISTLE_SEGMENTS - 1);
        const vertex = this.physics.addVertex(new THREE.Vector3(center.x + across * 0.07, center.y - segment * 0.05, 0.035 + (1 - segment) * 0.69), segmentIndex === 0);
        vertex.brushMeta = { across, segment, phase: bristle * 0.91 + segmentIndex * 0.73, brush: 1 };
        chain.push(vertex);
        this.bristleVertices.push(vertex);
        if (segmentIndex > 0) this.physics.addSpring(chain[segmentIndex - 1], vertex, 0.19, 1);
      }
      if (bristle > 0) {
        const prior = this.bristleChains[bristle - 1];
        this.physics.addSpring(prior[2], chain[2], 0.1, 1);
        this.physics.addSpring(prior[3], chain[3], 0.075, 1);
      }
      if (!this.bristleChains) this.bristleChains = [];
      this.bristleChains.push(chain);
    }
  }

  createBrushVisual() {
    this.bristles = new SpringVisualizer(this.physics);
    this.bristles.material.color.setHex(0x211a14);
    this.bristles.material.transparent = true;
    this.bristles.material.opacity = 0.72;
    this.bristles.object.renderOrder = 4;
    this.bristles.object.visible = false;
    this.scene.add(this.bristles.object);

    this.vertices = new VertexVisualizer(this.physics);
    this.vertices.material.color.setHex(0xa53d2d);
    this.vertices.material.transparent = true;
    this.vertices.material.opacity = 0.82;
    this.vertices.object.scale.setScalar(7.5);
    this.vertices.object.visible = false;
    this.vertices.object.renderOrder = 5;
    this.scene.add(this.vertices.object);

    const wood = new THREE.MeshStandardMaterial({ color: 0x5b2518, roughness: 0.48, metalness: 0.04 });
    const ferrule = new THREE.MeshStandardMaterial({ color: 0x2b241d, roughness: 0.34, metalness: 0.16 });
    const tip = new THREE.MeshStandardMaterial({ color: 0x171410, roughness: 0.88 });
    this.brushGroup = new THREE.Group();
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.135, 2.55, 18), wood);
    handle.position.y = 1.55;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 10), wood);
    cap.position.y = 2.84;
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.16, 0.36, 18), ferrule);
    collar.position.y = 0.18;
    const visibleTip = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.44, 18), tip);
    visibleTip.position.y = -0.19;
    visibleTip.rotation.z = Math.PI;
    this.brushGroup.add(handle, cap, collar, visibleTip);
    this.brushGroup.position.copy(this.pointerWorld);
    this.brushGroup.position.z = 0.48;
    this.brushGroup.rotation.z = 0.39;
    this.brushGroup.scale.setScalar(this.mobile ? 0.62 : 0.74);
    this.scene.add(this.brushGroup);
    this.disposables.push(handle.geometry, cap.geometry, collar.geometry, visibleTip.geometry, wood, ferrule, tip, this.bristles.material, this.vertices.material);
  }

  createSplatPool() {
    this.splatCount = this.mobile ? 42 : 96;
    const geometry = new THREE.CircleGeometry(0.045, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x1c1814, transparent: true, opacity: 0.52, depthWrite: false, toneMapped: false });
    this.splats = new THREE.InstancedMesh(geometry, material, this.splatCount);
    this.splats.frustumCulled = false;
    this.splats.renderOrder = 3;
    for (let index = 0; index < this.splatCount; index += 1) {
      this.splatStates.push({ active: false, age: 0, life: 1, velocity: new THREE.Vector2() });
      this.dummy.scale.setScalar(0);
      this.dummy.updateMatrix();
      this.splats.setMatrixAt(index, this.dummy.matrix);
    }
    this.scene.add(this.splats);
    this.disposables.push(geometry, material);
  }

  setupPostProcessing() {
    this.scenePass = pass(this.scene, this.camera);
    this.scenePass.setMRT(mrt({ output }));
    const colorPass = this.scenePass.getTextureNode("output");
    this.postProcessing = new THREE.PostProcessing(this.renderer);
    this.postProcessing.outputNode = Fn(() => vec4(colorPass.rgb, 1).renderOutput())();
  }

  spawnSplats(world, speed, pressure) {
    if (this.reducedMotion || speed < 0.48) return;
    const count = Math.min(7, 1 + Math.floor(speed * 5 + pressure * 2));
    const [red, green, blue] = INK_MODES[this.painter.mode].rgb;
    const color = new THREE.Color().setRGB(red / 255, green / 255, blue / 255);
    for (let item = 0; item < count; item += 1) {
      const index = this.splatCursor % this.splatCount;
      this.splatCursor += 1;
      const state = this.splatStates[index];
      const phase = (index * 2.399 + item * 1.73) % (Math.PI * 2);
      state.active = true;
      state.age = 0;
      state.life = 0.42 + (index % 7) * 0.035;
      state.position = world.clone();
      state.position.z = 0.2;
      state.velocity.set(Math.cos(phase) * (0.22 + speed * 0.28), Math.sin(phase) * (0.16 + speed * 0.24));
      state.scale = 0.38 + ((index * 17) % 9) / 13;
      this.splats.setColorAt(index, color);
    }
    if (this.splats.instanceColor) this.splats.instanceColor.needsUpdate = true;
  }

  updateSplats(delta) {
    let changed = false;
    this.splatStates.forEach((state, index) => {
      if (!state.active) return;
      state.age += delta;
      const progress = state.age / state.life;
      if (progress >= 1) {
        state.active = false;
        this.dummy.scale.setScalar(0);
      } else {
        state.position.x += state.velocity.x * delta;
        state.position.y += state.velocity.y * delta;
        state.position.z = 0.12 + Math.sin(progress * Math.PI) * 0.42;
        state.velocity.multiplyScalar(0.965);
        this.dummy.position.copy(state.position);
        this.dummy.scale.setScalar(state.scale * (1 - progress) * 0.62);
      }
      this.dummy.updateMatrix();
      this.splats.setMatrixAt(index, this.dummy.matrix);
      changed = true;
    });
    if (changed) this.splats.instanceMatrix.needsUpdate = true;
  }

  surfacePoint(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.ndc.set((clientX - rect.left) / rect.width * 2 - 1, -((clientY - rect.top) / rect.height * 2 - 1));
    this.raycaster.setFromCamera(this.ndc, this.camera);
    const hit = this.raycaster.intersectObject(this.paper, false)[0];
    if (!hit?.uv) return null;
    return {
      uv: { x: clamp01(hit.uv.x), y: clamp01(1 - hit.uv.y) },
      world: hit.point.clone(),
    };
  }

  uvToWorld(point) {
    return new THREE.Vector3((point.x - 0.5) * this.paperSize.width, (0.5 - point.y) * this.paperSize.height, 0.02);
  }

  setBrushWorld(world, pressure, speed) {
    const delta = world.clone().sub(this.pointerWorld);
    if (delta.lengthSq() > 0.00001) {
      this.pointerDirection.set(delta.x, delta.y).normalize();
      this.lastWorld.copy(this.pointerWorld);
    }
    this.pointerWorld.copy(world);
    this.currentPressure = pressure;
    this.currentSpeed = speed;
  }

  beginStroke(clientX, clientY, rawPressure, pointerType) {
    this.demo.stop();
    const point = this.surfacePoint(clientX, clientY);
    if (!point) return false;
    const metrics = this.painter.begin(point.uv, { pressure: rawPressure, pointerType });
    this.pointerActive = true;
    this.lastPointerTime = performance.now();
    this.setBrushWorld(point.world, metrics.pressure, 0);
    this.setPhase("contact");
    return true;
  }

  moveStroke(clientX, clientY, rawPressure, pointerType) {
    if (!this.pointerActive) return false;
    const point = this.surfacePoint(clientX, clientY);
    if (!point) return false;
    const metrics = this.painter.move(point.uv, { pressure: rawPressure, pointerType });
    this.setBrushWorld(point.world, metrics.pressure, metrics.speed);
    this.spawnSplats(point.world, metrics.speed, metrics.pressure);
    this.setPhase("drag");
    return true;
  }

  endStroke() {
    if (!this.pointerActive) return false;
    this.pointerActive = false;
    this.painter.end();
    this.phaseAge = 0;
    this.setPhase(this.painter.wetMarks.length ? "diffuse" : "remember");
    return true;
  }

  beginSyntheticStroke(point, pressure) {
    const world = this.uvToWorld(point);
    const metrics = this.painter.begin(point, { pressure, pointerType: "pen" });
    this.pointerActive = true;
    this.setBrushWorld(world, metrics.pressure, 0);
    this.setPhase("contact");
  }

  moveSyntheticStroke(point, pressure) {
    const world = this.uvToWorld(point);
    const metrics = this.painter.move(point, { pressure, pointerType: "pen", now: performance.now() });
    this.setBrushWorld(world, metrics.pressure, metrics.speed);
    this.spawnSplats(world, metrics.speed, metrics.pressure);
    this.setPhase("drag");
  }

  endSyntheticStroke() { this.endStroke(); }

  setPhase(phase) {
    if (this.phase === phase) return;
    this.phase = phase;
    this.phaseAge = 0;
    this.onPhase(phase);
  }

  setMode(mode) {
    this.painter.setMode(mode);
    const rgb = INK_MODES[this.painter.mode].rgb;
    this.splats?.material.color.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
  }

  setPressure(value) { this.painter.setPressure(value); }
  setWater(value) { this.painter.setWater(value); }
  setAbsorption(value) { this.painter.setAbsorption(value); }

  startDemo() {
    this.clear();
    this.demo.start();
  }

  clear() {
    this.demo.stop();
    this.painter.clear();
    this.inkTexture.needsUpdate = true;
    this.splatStates.forEach((state, index) => {
      state.active = false;
      this.dummy.scale.setScalar(0);
      this.dummy.updateMatrix();
      this.splats.setMatrixAt(index, this.dummy.matrix);
    });
    this.splats.instanceMatrix.needsUpdate = true;
    this.bridge.requestReset();
    this.setPhase("remember");
  }

  toggleStructure(force) {
    this.structureVisible = typeof force === "boolean" ? force : !this.structureVisible;
    this.vertices.object.visible = this.structureVisible;
    this.bristles.object.visible = this.structureVisible;
    this.bristles.material.opacity = this.structureVisible ? 1 : 0.72;
    this.bristles.material.color.setHex(this.structureVisible ? 0xa53d2d : 0x211a14);
    return this.structureVisible;
  }

  updateBrushVisual(delta) {
    const speed = this.currentSpeed ?? 0;
    const pressure = this.currentPressure ?? this.painter.pressureControl;
    const baseAxis = new THREE.Vector2(-0.38, 0.92);
    baseAxis.addScaledVector(this.pointerDirection, speed * 0.14).normalize();
    const angle = Math.atan2(-baseAxis.x, baseAxis.y);
    this.brushGroup.position.x = THREE.MathUtils.damp(this.brushGroup.position.x, this.pointerWorld.x, 18, delta);
    this.brushGroup.position.y = THREE.MathUtils.damp(this.brushGroup.position.y, this.pointerWorld.y, 18, delta);
    this.brushGroup.position.z = 0.44 + (1 - pressure) * 0.22;
    this.brushGroup.rotation.z = THREE.MathUtils.damp(this.brushGroup.rotation.z, angle, 12, delta);
    const scale = this.mobile ? 0.62 : 0.74;
    this.brushGroup.scale.set(scale, scale, scale * (1 - pressure * 0.16));
  }

  async update(elapsed) {
    const delta = Math.min(this.clock.getDelta(), 0.045);
    const frameMs = delta * 1000;
    this.frameTimeEma = this.frameTimeEma === 0 ? frameMs : THREE.MathUtils.lerp(this.frameTimeEma, frameMs, 0.05);
    this.phaseAge += delta;
    this.demo.update(delta);
    this.painter.step(delta);
    if (!this.pointerActive && this.painter.wetMarks.length > 0 && this.phaseAge > 0.16) this.setPhase("diffuse");
    if (!this.pointerActive && this.painter.wetMarks.length === 0 && this.phase !== "remember") this.setPhase("remember");
    if (this.painter.dirty) {
      this.inkTexture.needsUpdate = true;
      this.painter.dirty = false;
    }
    this.updateSplats(delta);
    this.updateBrushVisual(delta);
    this.bridge.setState({
      center: this.pointerWorld,
      direction: this.pointerDirection,
      pressure: this.currentPressure ?? this.painter.pressureControl,
      speed: this.currentSpeed ?? 0,
      elapsed,
      motionScale: this.reducedMotion ? 0.34 : 1,
    });
    await this.physics.update(delta, elapsed);
    await this.postProcessing.renderAsync();

    if (elapsed - this.lastMetricsAt > 0.12) {
      this.lastMetricsAt = elapsed;
      const snapshot = this.painter.snapshot();
      this.onMetrics({ ...snapshot, phase: this.phase, frameMilliseconds: this.frameTimeEma, activeSplats: this.splatStates.filter((item) => item.active).length });
    }
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    const { width, height } = this.getViewportSize();
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, width < 700 ? 0.78 : 1));
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.applyCamera();
    this.alignInkOverlay();
  }

  applyCamera() {
    const mobile = (this.container.clientWidth || innerWidth) < 700;
    this.camera.position.set(mobile ? 0.18 : 0.45, mobile ? -0.2 : -0.3, mobile ? 22.8 : 13.8);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateMatrixWorld();
  }

  alignInkOverlay() {
    if (!this.painter?.canvas || !this.camera) return;
    const viewport = this.getViewportSize();
    const halfWidth = this.paperSize.width * 0.5;
    const halfHeight = this.paperSize.height * 0.5;
    const corners = [
      new THREE.Vector3(-halfWidth, halfHeight, 0.03),
      new THREE.Vector3(halfWidth, halfHeight, 0.03),
      new THREE.Vector3(-halfWidth, -halfHeight, 0.03),
      new THREE.Vector3(halfWidth, -halfHeight, 0.03),
    ].map((point) => point.project(this.camera));
    const xs = corners.map((point) => (point.x * 0.5 + 0.5) * viewport.width);
    const ys = corners.map((point) => (-point.y * 0.5 + 0.5) * viewport.height);
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    this.painter.canvas.style.left = `${left}px`;
    this.painter.canvas.style.top = `${top}px`;
    this.painter.canvas.style.width = `${Math.max(1, Math.max(...xs) - left)}px`;
    this.painter.canvas.style.height = `${Math.max(1, Math.max(...ys) - top)}px`;
  }

  getViewportSize() {
    const rect = this.container.getBoundingClientRect();
    return { width: Math.max(1, Math.round(rect.width || innerWidth)), height: Math.max(1, Math.round(rect.height || innerHeight)) };
  }

  getStats() {
    return { vertices: this.physics.vertexCount, springs: this.physics.springCount, particles: this.splatCount };
  }

  async sampleDiagnostics() {
    const positions = new Float32Array(await this.renderer.getArrayBufferAsync(this.physics.positionData.value));
    let finite = true;
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (let index = 0; index < this.physics.vertexCount; index += 1) {
      const offset = index * 4;
      const x = positions[offset];
      const y = positions[offset + 1];
      const z = positions[offset + 2];
      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) finite = false;
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
    }
    return { finite, count: this.physics.vertexCount, minZ, maxZ, wetCount: this.painter.wetMarks.length, frameMilliseconds: this.frameTimeEma };
  }

  destroy() {
    this.demo.stop();
    this.disposables.forEach((resource) => resource.dispose?.());
    this.painter.canvas.remove();
    this.renderer?.dispose();
  }
}

export class FallbackInkScene {
  constructor(container, { reducedMotion = false, onMetrics = () => {}, onPhase = () => {} } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.onMetrics = onMetrics;
    this.onPhase = onPhase;
    this.painter = new InkPainter({ width: innerWidth < 700 ? 960 : 1536, height: innerWidth < 700 ? 1280 : 960, reducedMotion });
    this.painter.canvas.className = "fallback-ink-canvas";
    this.painter.canvas.setAttribute("aria-label", "2D 降级宣纸，可直接拖动书写");
    this.container.prepend(this.painter.canvas);
    this.demo = new DemoGesture(this);
    this.pointerActive = false;
    this.phase = "remember";
    this.clock = new THREE.Clock();
    this.lastMetricsAt = 0;
  }

  async init(onProgress = () => {}) { onProgress(1, "2D 宣纸已就绪"); }

  surfacePoint(clientX, clientY) {
    const rect = this.painter.canvas.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return null;
    return { x: clamp01((clientX - rect.left) / rect.width), y: clamp01((clientY - rect.top) / rect.height) };
  }

  beginStroke(x, y, pressure, pointerType) {
    this.demo.stop();
    const point = this.surfacePoint(x, y);
    if (!point) return false;
    this.pointerActive = true;
    this.painter.begin(point, { pressure, pointerType });
    this.setPhase("contact");
    return true;
  }

  moveStroke(x, y, pressure, pointerType) {
    if (!this.pointerActive) return false;
    const point = this.surfacePoint(x, y);
    if (!point) return false;
    this.painter.move(point, { pressure, pointerType });
    this.setPhase("drag");
    return true;
  }

  endStroke() {
    if (!this.pointerActive) return false;
    this.pointerActive = false;
    this.painter.end();
    this.setPhase(this.painter.wetMarks.length ? "diffuse" : "remember");
    return true;
  }

  beginSyntheticStroke(point, pressure) { this.pointerActive = true; this.painter.begin(point, { pressure, pointerType: "pen" }); this.setPhase("contact"); }
  moveSyntheticStroke(point, pressure) { this.painter.move(point, { pressure, pointerType: "pen" }); this.setPhase("drag"); }
  endSyntheticStroke() { this.endStroke(); }
  setPhase(phase) { if (this.phase !== phase) { this.phase = phase; this.onPhase(phase); } }
  setMode(mode) { this.painter.setMode(mode); }
  setPressure(value) { this.painter.setPressure(value); }
  setWater(value) { this.painter.setWater(value); }
  setAbsorption(value) { this.painter.setAbsorption(value); }
  startDemo() { this.clear(); this.demo.start(); }
  toggleStructure() { return false; }
  clear() { this.demo.stop(); this.painter.clear(); this.setPhase("remember"); }
  resize() {}
  getStats() { return { vertices: 0, springs: 0, particles: 0 }; }
  async sampleDiagnostics() { return { fallback: true, wetCount: this.painter.wetMarks.length }; }

  async update(elapsed) {
    const delta = Math.min(this.clock.getDelta(), 0.05);
    this.demo.update(delta);
    this.painter.step(delta);
    if (!this.pointerActive && this.painter.wetMarks.length > 0) this.setPhase("diffuse");
    if (!this.pointerActive && this.painter.wetMarks.length === 0) this.setPhase("remember");
    if (elapsed - this.lastMetricsAt > 0.12) {
      this.lastMetricsAt = elapsed;
      this.onMetrics({ ...this.painter.snapshot(), phase: this.phase, frameMilliseconds: 0, activeSplats: 0 });
    }
  }

  destroy() { this.demo.stop(); this.painter.canvas.remove(); }
}
