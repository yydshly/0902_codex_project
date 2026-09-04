import * as THREE from "three/webgpu";
import {
  Fn,
  clamp,
  float,
  mix,
  mrt,
  normalLocal,
  output,
  pass,
  positionLocal,
  sin,
  smoothstep,
  texture,
  triNoise3D,
  uniform,
  uv,
  vec3,
  vec4,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { Background } from "@aurelia-upstream/background.js";
import { Lights } from "@aurelia-upstream/lights.js";
import { Plankton } from "@aurelia-upstream/plankton.js";
import { SpringVisualizer } from "@aurelia-upstream/physics/springVisualizer.js";
import { VerletPhysics } from "@aurelia-upstream/physics/verletPhysics.js";
import { CuttlefishTentacles } from "./tentacles.js";

const TAU = Math.PI * 2;

function seeded(index) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

function pulseWindow(value, start, peak, end) {
  if (value <= start || value >= end) return 0;
  const progress = value < peak
    ? (value - start) / Math.max(0.0001, peak - start)
    : 1 - (value - peak) / Math.max(0.0001, end - peak);
  const clamped = THREE.MathUtils.clamp(progress, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(199,226,255,.72)");
  gradient.addColorStop(0.62, "rgba(92,91,190,.22)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createImpactTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const gradient = context.createRadialGradient(128, 128, 32, 128, 128, 126);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.35, "rgba(255,255,255,.08)");
  gradient.addColorStop(0.49, "rgba(255,255,255,1)");
  gradient.addColorStop(0.56, "rgba(104,225,255,.42)");
  gradient.addColorStop(0.78, "rgba(104,225,255,.06)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const MANTLE_PROFILE = [
  [0.03, 3.22],
  [0.38, 3.12],
  [0.84, 2.82],
  [1.12, 2.34],
  [1.29, 1.72],
  [1.33, 1.08],
  [1.29, 0.48],
  [1.16, 0.02],
  [1.01, -0.34],
  [0.88, -0.6],
  [0.79, -0.82],
  [0.68, -1.02],
  [0.74, -1.2],
  [0.73, -1.39],
  [0.62, -1.58],
  [0.46, -1.71],
  [0.34, -1.79],
  [0.17, -1.85],
  [0.035, -1.88],
].map(([radius, y]) => new THREE.Vector2(radius, y));

function mantleRadiusAt(y) {
  for (let index = 1; index < MANTLE_PROFILE.length; index += 1) {
    const upper = MANTLE_PROFILE[index - 1];
    const lower = MANTLE_PROFILE[index];
    if (y <= upper.y && y >= lower.y) {
      const mixValue = (upper.y - y) / Math.max(0.0001, upper.y - lower.y);
      return THREE.MathUtils.lerp(upper.x, lower.x, mixValue) * 0.92;
    }
  }
  return y > MANTLE_PROFILE[0].y ? MANTLE_PROFILE[0].x * 0.92 : MANTLE_PROFILE.at(-1).x * 0.92;
}

function createMantleGeometry(segments = 64) {
  const geometry = new THREE.LatheGeometry(MANTLE_PROFILE, segments);
  const positions = geometry.getAttribute("position");
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index) * 0.92;
    const z = positions.getZ(index);
    positions.setXYZ(index, x, positions.getY(index), z * (z >= 0 ? 0.7 : 0.5));
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function createFinGeometry(side, rows = 36, columns = 6) {
  const positions = new Float32Array((rows + 1) * (columns + 1) * 3);
  const uvs = new Float32Array((rows + 1) * (columns + 1) * 2);
  const indices = [];
  let positionCursor = 0;
  let uvCursor = 0;
  for (let row = 0; row <= rows; row += 1) {
    const t = row / rows;
    for (let column = 0; column <= columns; column += 1) {
      const across = column / columns;
      positions[positionCursor++] = side;
      positions[positionCursor++] = t;
      positions[positionCursor++] = across;
      uvs[uvCursor++] = across;
      uvs[uvCursor++] = t;
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
  geometry.userData = { side, rows, columns };
  return geometry;
}

function createSkinMaterial(uniforms, skinTexture = null) {
  const material = new THREE.MeshPhysicalNodeMaterial({
    color: 0x516e70,
    map: skinTexture,
    roughness: 0.39,
    metalness: 0,
    transmission: 0.08,
    thickness: 0.48,
    iridescence: 0.46,
    iridescenceIOR: 1.38,
    iridescenceThicknessRange: [180, 510],
    clearcoat: 0.38,
    clearcoatRoughness: 0.32,
    transparent: false,
    opacity: 1,
  });

  material.positionNode = Fn(() => {
    const local = positionLocal.toVar();
    const coordinate = uv();
    const breath = sin(uniforms.time.mul(1.25).add(local.y.mul(1.42)))
      .mul(0.013)
      .add(uniforms.signal.mul(0.017))
      .mul(uniforms.motion);
    const microRelief = sin(coordinate.x.mul(73).add(coordinate.y.mul(11)))
      .mul(sin(coordinate.y.mul(89).sub(coordinate.x.mul(7))))
      .abs()
      .pow(7)
      .mul(0.007);
    local.addAssign(normalLocal.mul(breath.add(microRelief)));
    return local;
  })();

  const skinSignal = Fn(() => {
    const coordinate = uv();
    const noise = triNoise3D(vec3(coordinate.mul(2.8), uniforms.time.mul(0.08)), 0.3, uniforms.time.mul(0.12));
    const cells = sin(coordinate.x.mul(114).add(noise.mul(7)))
      .mul(sin(coordinate.y.mul(92).sub(noise.mul(5))))
      .abs();
    const chromatophores = smoothstep(0.72, 0.97, cells.add(noise.mul(0.13)));
    const traveling = sin(coordinate.y.mul(22).sub(uniforms.time.mul(5.2)).add(coordinate.x.mul(8)))
      .mul(0.5)
      .add(0.5)
      .pow(12)
      .mul(uniforms.signal.mul(1.4).add(uniforms.pointer.mul(0.75)).add(uniforms.audio.mul(0.55)));
    return chromatophores.mul(0.1).add(traveling).add(uniforms.ink.mul(0.11)).clamp(0, 1);
  });

  material.colorNode = Fn(() => {
    const coordinate = uv();
    const base = mix(vec3(0.055, 0.18, 0.19), vec3(0.29, 0.37, 0.34), coordinate.y.mul(0.56).add(0.12));
    const detailed = skinTexture ? mix(base, texture(skinTexture).rgb, float(0.22)) : base;
    const macroNoise = triNoise3D(
      vec3(coordinate.mul(3.2), uniforms.time.mul(0.018)),
      0.42,
      uniforms.time.mul(0.024),
    ).mul(0.5).add(0.5).clamp(0, 1);
    const mottle = smoothstep(0.36, 0.72, macroNoise).mul(0.2);
    const natural = mix(detailed, mix(vec3(0.025, 0.075, 0.085), vec3(0.32, 0.3, 0.24), coordinate.y), mottle);
    const caustic = sin(positionLocal.y.mul(4.1).add(uniforms.time.mul(0.22)))
      .add(sin(positionLocal.x.mul(5.7).sub(uniforms.time.mul(0.17))))
      .mul(0.5)
      .abs()
      .pow(9)
      .mul(0.07);
    const warm = mix(vec3(0.86, 0.12, 0.045), vec3(0.94, 0.5, 0.12), coordinate.x);
    return mix(natural, warm, skinSignal()).add(vec3(0.18, 0.32, 0.3).mul(caustic));
  })();
  material.emissiveNode = Fn(() => {
    return mix(vec3(0.004, 0.025, 0.035), vec3(0.9, 0.08, 0.02), skinSignal())
      .mul(skinSignal().mul(0.9).add(0.025));
  })();
  material.mrtNode = mrt({
    bloomIntensity: Fn(() => vec4(skinSignal().mul(0.72).add(0.04), uniforms.signal, 0, 1))(),
  });
  return material;
}

function createFollowerMaterial(index) {
  return new THREE.MeshPhysicalMaterial({
    color: index % 2 ? 0x476b79 : 0x76525d,
    emissive: index % 2 ? 0x082d3f : 0x3d101c,
    emissiveIntensity: 1.05,
    roughness: 0.25,
    metalness: 0.03,
    transmission: 0.28,
    iridescence: 0.7,
    transparent: true,
    opacity: 0.21,
    depthWrite: false,
  });
}

export class CuttlefishScene {
  constructor(container, { reducedMotion = false } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.quality = innerWidth < 760 ? 0.58 : innerWidth < 1100 ? 0.78 : 1;
    this.pointer = new THREE.Vector3();
    this.pointerTarget = new THREE.Vector3();
    this.signalEnergy = 0;
    this.deployEnergy = 0;
    this.inkEnergy = 0;
    this.pokeEnergy = 0;
    this.recoil = new THREE.Vector3();
    this.swimOffset = new THREE.Vector3();
    this.swimVelocity = new THREE.Vector3();
    this.courseRotation = 0;
    this.escapeAge = Number.POSITIVE_INFINITY;
    this.escapeIntensity = 0;
    this.inspectTarget = 0;
    this.inspectMix = 0;
    this.viewName = "hero";
    this.finPhase = 0;
    this.lastTime = 0;
    this.structureVisible = false;
    this.behavior = "glide";
    this.finFrame = 0;
    this.motionSample = {
      x: 0,
      y: 0,
      rotation: 0,
      squeeze: 0,
      thrust: 0,
      fin: 0,
      speed: 0,
      alignment: 1,
      radialScale: 1,
      axialScale: 1,
      wake: 0,
      escapePhase: 1,
      deploy: 0,
      yaw: 0,
      pitch: 0,
    };
    this.glowTexture = createGlowTexture();
    this.impactTexture = createImpactTexture();
    this.inverseHero = new THREE.Matrix4();
    this.localRayOrigin = new THREE.Vector3();
    this.localRayDirection = new THREE.Vector3();
    this.rayNdc = new THREE.Vector2();
    this.hitPoint = new THREE.Vector3();
  }

  async init() {
    this.renderer = new THREE.WebGPURenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, this.quality < 1 ? 1 : 1.3));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.98;
    await this.renderer.init();
    if (!this.renderer.backend?.isWebGPUBackend) throw new Error("没有可用的 WebGPU 后端");
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.container.prepend(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(47, innerWidth / innerHeight, 0.05, 52);
    this.camera.position.set(0, 0.4, this.quality < 1 ? 19.2 : 14.1);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.055;
    this.controls.enableRotate = true;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = -0.32;
    this.controls.minPolarAngle = Math.PI * 0.3;
    this.controls.maxPolarAngle = Math.PI * 0.7;
    this.controls.minAzimuthAngle = -1.34;
    this.controls.maxAzimuthAngle = 1.34;
    this.controls.minDistance = this.quality < 1 ? 11.6 : 8.2;
    this.controls.maxDistance = this.quality < 1 ? 22 : 18.5;

    Background.fogNear = 8;
    Background.fogFar = 38;
    this.scene.backgroundNode = Background.fogFunction;
    this.scene.environmentNode = Background.envFunction;
    this.scene.environmentIntensity = 0.46;
    this.lights = new Lights();
    this.scene.add(this.lights.object);
    const amber = new THREE.PointLight(0xff7652, 27, 24, 2);
    amber.position.set(3.8, 1.2, 4.8);
    this.scene.add(amber);
    const cyan = new THREE.PointLight(0x56d5ff, 54, 28, 2);
    cyan.position.set(-5.5, 5.2, 3.5);
    this.scene.add(cyan);
    this.inkLight = new THREE.PointLight(0x754aff, 0, 18, 2);
    this.inkLight.position.set(0, -1.6, 2.2);
    this.scene.add(this.inkLight);

    globalThis.__AURELIA_LAB_CONFIG__ = {
      ...(globalThis.__AURELIA_LAB_CONFIG__ ?? {}),
      stepsPerSecond: this.quality < 1 ? 150 : 240,
      planktonDensity: this.quality < 1 ? 0.006 : 0.011,
    };
    this.skinTexture = await new THREE.TextureLoader()
      .loadAsync("/assets/cuttlefish-skin-v1.png")
      .catch(() => null);
    if (this.skinTexture) {
      this.skinTexture.colorSpace = THREE.SRGBColorSpace;
      this.skinTexture.wrapS = THREE.RepeatWrapping;
      this.skinTexture.wrapT = THREE.RepeatWrapping;
      this.skinTexture.repeat.set(1.35, 1.7);
      this.skinTexture.rotation = -0.08;
      this.skinTexture.center.set(0.5, 0.5);
    }
    this.physics = new VerletPhysics(this.renderer);
    this.createHero();
    await this.physics.bake();
    this.springVisualizer = new SpringVisualizer(this.physics);
    this.springVisualizer.object.visible = false;
    this.springVisualizer.object.renderOrder = 30;
    this.hero.add(this.springVisualizer.object);

    this.createEnvironment();
    this.createFollowers();
    this.createInkCloud();
    this.createPostProcessing();
    this.raycaster = new THREE.Raycaster();
    this.resize();
  }

  createHero() {
    this.hero = new THREE.Group();
    this.baseHeroPosition = new THREE.Vector3(this.quality < 1 ? 0 : 1.05, this.quality < 1 ? 0.65 : 0.15, 0);
    this.baseHeroRotation = this.quality < 1 ? 1.48 : 1.52;
    this.courseRotation = this.baseHeroRotation;
    this.hero.position.copy(this.baseHeroPosition);
    this.hero.rotation.set(0.12, 0.3, this.baseHeroRotation);
    this.scene.add(this.hero);

    this.skinUniforms = {
      time: uniform(0),
      signal: uniform(0),
      ink: uniform(0),
      pointer: uniform(0),
      audio: uniform(0),
      motion: uniform(this.reducedMotion ? 0.18 : 1),
    };
    this.skinMaterial = createSkinMaterial(this.skinUniforms, this.skinTexture);

    const mantleGeometry = createMantleGeometry(this.quality < 1 ? 42 : 68);
    this.mantle = new THREE.Mesh(mantleGeometry, this.skinMaterial);
    this.mantle.renderOrder = 11;
    this.hero.add(this.mantle);

    this.innerOrgan = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 32, 24),
      new THREE.MeshPhysicalMaterial({
        color: 0x4d2528,
        emissive: 0x4a1016,
        emissiveIntensity: 0.24,
        roughness: 0.52,
        transmission: 0.08,
        transparent: true,
        opacity: 0.02,
        depthWrite: false,
      }),
    );
    this.innerOrgan.scale.set(0.5, 1.18, 0.36);
    this.innerOrgan.position.set(0, 0.68, -0.16);
    this.innerOrgan.renderOrder = 10;
    this.hero.add(this.innerOrgan);

    this.createEyes();
    this.createFins();

    this.buccalRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.075, 0.012, 10, 36),
      new THREE.MeshPhysicalMaterial({
        color: 0x15191a,
        emissive: 0x020303,
        emissiveIntensity: 0.06,
        roughness: 0.56,
        clearcoat: 0.2,
        transparent: true,
        opacity: 0.58,
      }),
    );
    this.buccalRim.scale.set(1, 0.72, 1);
    this.buccalRim.position.set(0, -1.94, -0.12);
    this.buccalRim.renderOrder = 15;
    this.hero.add(this.buccalRim);

    this.beak = new THREE.Mesh(
      new THREE.SphereGeometry(0.065, 20, 14),
      new THREE.MeshPhysicalMaterial({ color: 0x090c0c, roughness: 0.62, clearcoat: 0.22 }),
    );
    this.beak.scale.set(0.82, 0.5, 0.34);
    this.beak.position.set(0, -1.94, -0.115);
    this.beak.renderOrder = 16;
    this.hero.add(this.beak);

    const siphonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.34, -1.3, 0.12),
      new THREE.Vector3(-0.48, -1.52, 0.19),
      new THREE.Vector3(-0.42, -1.8, 0.24),
    ]);
    this.siphon = new THREE.Mesh(
      new THREE.TubeGeometry(siphonCurve, 20, 0.045, 10, false),
      new THREE.MeshPhysicalMaterial({
        color: 0x426f72,
        emissive: 0x061d22,
        emissiveIntensity: 0.22,
        roughness: 0.4,
        transmission: 0.08,
        clearcoat: 0.42,
      }),
    );
    this.siphon.renderOrder = 16;
    this.hero.add(this.siphon);

    this.jetPlume = new THREE.Mesh(
      new THREE.ConeGeometry(0.17, 1.25, 18, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x8beaff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    this.jetPlume.position.set(-0.42, -2.02, 0.25);
    this.jetPlume.scale.set(0.65, 0.22, 0.65);
    this.jetPlume.renderOrder = 15;
    this.hero.add(this.jetPlume);

    this.jetCore = new THREE.Mesh(
      new THREE.ConeGeometry(0.055, 0.92, 14, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xd8fbff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    this.jetCore.position.set(-0.42, -1.94, 0.25);
    this.jetCore.scale.set(0.52, 0.18, 0.52);
    this.jetCore.renderOrder = 16;
    this.hero.add(this.jetCore);

    this.jetRings = Array.from({ length: 4 }, (_, index) => {
      const ring = new THREE.Sprite(new THREE.SpriteMaterial({
        map: this.impactTexture,
        color: 0x79dfff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }));
      ring.position.set(-0.42, -1.78 - index * 0.32, 0.28);
      ring.scale.setScalar(0.12);
      ring.renderOrder = 17;
      this.hero.add(ring);
      return ring;
    });
    this.jetBubbles = Array.from({ length: this.quality < 1 ? 10 : 18 }, (_, index) => {
      const bubble = new THREE.Sprite(new THREE.SpriteMaterial({
        map: this.glowTexture,
        color: index % 3 === 0 ? 0xd7fbff : 0x75d9ef,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }));
      bubble.renderOrder = 18;
      this.hero.add(bubble);
      return bubble;
    });

    this.tentacles = new CuttlefishTentacles(this.physics, {
      quality: this.quality,
      reducedMotion: this.reducedMotion,
    });
    this.hero.add(this.tentacles.createMesh());

    this.impactRing = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.impactTexture,
      color: 0x9bedff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    this.impactRing.scale.setScalar(0.1);
    this.impactRing.renderOrder = 40;
    this.scene.add(this.impactRing);
  }

  createEyes() {
    this.eyes = [];
    [-1, 1].forEach((side) => {
      const eye = new THREE.Group();
      eye.position.set(side * 0.58, -1.35, side > 0 ? 0.245 : -0.5);
      eye.rotation.y = side * 0.48;
      const hood = new THREE.Mesh(
        new THREE.SphereGeometry(0.175, 28, 18),
        this.skinMaterial,
      );
      hood.scale.set(1.1, 0.9, 0.27);
      hood.position.z = -0.1;
      eye.add(hood);
      const iris = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 36, 24),
        new THREE.MeshPhysicalMaterial({
          color: 0x54432a,
          emissive: 0x080603,
          emissiveIntensity: 0.05,
          roughness: 0.32,
          clearcoat: 0.62,
          iridescence: 0.26,
        }),
      );
      iris.scale.set(1, 0.72, 0.12);
      iris.position.z = 0.026;
      eye.add(iris);
      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(0.087, 0.006, 10, 56),
        new THREE.MeshBasicMaterial({ color: 0x273d3d, transparent: true, opacity: 0.38 }),
      );
      rim.scale.set(1, 0.76, 1);
      rim.position.z = 0.045;
      eye.add(rim);
      const pupil = new THREE.Group();
      const pupilCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.068, 0.014, 0),
        new THREE.Vector3(-0.034, -0.017, 0),
        new THREE.Vector3(0, 0.016, 0),
        new THREE.Vector3(0.034, -0.017, 0),
        new THREE.Vector3(0.068, 0.014, 0),
      ]);
      const pupilStroke = new THREE.Mesh(
        new THREE.TubeGeometry(pupilCurve, 28, 0.009, 8, false),
        new THREE.MeshBasicMaterial({ color: 0x010205 }),
      );
      pupil.add(pupilStroke);
      pupil.scale.setScalar(0.84);
      pupil.rotation.z = Math.PI * 0.5;
      pupil.position.z = 0.062;
      eye.add(pupil);
      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.006, 12, 8), new THREE.MeshBasicMaterial({ color: 0xd9f0e9 }));
      glint.position.set(-0.032, 0.019, 0.07);
      eye.add(glint);
      this.hero.add(eye);
      this.eyes.push({ group: eye, pupil, iris, hood, side });
    });
  }

  createFins() {
    this.fins = [];
    [-1, 1].forEach((side) => {
      const geometry = createFinGeometry(side, this.quality < 1 ? 24 : 40, this.quality < 1 ? 4 : 7);
      const material = new THREE.MeshPhysicalMaterial({
        color: side < 0 ? 0x58b8c6 : 0x87698e,
        emissive: side < 0 ? 0x0b5067 : 0x42152f,
        emissiveIntensity: 1.1,
        roughness: 0.2,
        metalness: 0.02,
        transmission: 0.5,
        iridescence: 1,
        clearcoat: 0.78,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = 9;
      this.hero.add(mesh);

      const edgeGeometry = new THREE.BufferGeometry();
      edgeGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(geometry.userData.rows * 2 * 3), 3));
      const edge = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({
        color: 0x91e9ff,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }));
      this.hero.add(edge);

      const rootGeometry = new THREE.BufferGeometry();
      rootGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(geometry.userData.rows * 2 * 3), 3));
      const root = new THREE.LineSegments(rootGeometry, new THREE.LineBasicMaterial({
        color: side < 0 ? 0x6dc1ca : 0xc286a1,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }));
      root.renderOrder = 10;
      this.hero.add(root);

      const ribsGeometry = new THREE.BufferGeometry();
      ribsGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(10 * 2 * 3), 3));
      const ribs = new THREE.LineSegments(ribsGeometry, new THREE.LineBasicMaterial({ color: 0x66e2ff, transparent: true, opacity: 0.55, depthWrite: false }));
      ribs.visible = false;
      this.hero.add(ribs);
      this.fins.push({ side, geometry, mesh, edge, root, ribs });
    });
    this.updateFins(0, 0.25, 0.3);
  }

  updateFins(phase, energy, audio, thrust = 0, speed = 0) {
    const refreshNormals = (this.finFrame = (this.finFrame + 1) % 2) === 0;
    const streamline = 1 - Math.min(0.46, thrust * 0.42);
    const speedLift = Math.min(0.07, speed * 0.08);
    this.fins.forEach((fin) => {
      const { side, rows, columns } = fin.geometry.userData;
      const positions = fin.geometry.getAttribute("position");
      for (let row = 0; row <= rows; row += 1) {
        const t = row / rows;
        const envelope = Math.sin(Math.PI * t) ** 0.58;
        const y = -0.42 + t * 3.25;
        const inner = mantleRadiusAt(y) + 0.018;
        for (let column = 0; column <= columns; column += 1) {
          const across = column / columns;
          const wave = Math.sin(phase - t * 10.4 + side * 0.9) * across * envelope * (0.16 + energy * 0.14) * streamline;
          const ripple = Math.sin(phase * 1.62 + t * 16 - across * 4) * across * envelope * (0.024 + 0.06 * energy) * streamline;
          const outlineWave = Math.sin(phase * 1.1 - t * 10.4 + side * 1.3)
            * across * envelope * (0.06 + energy * 0.08) * streamline;
          positions.setXYZ(
            row * (columns + 1) + column,
            side * (inner + envelope * across * (0.38 + energy * 0.07 - thrust * 0.07) + outlineWave),
            y + Math.sin(phase * 0.82 - t * 7.8 + side) * across * envelope * (0.052 + energy * 0.018 + speedLift) * streamline,
            0.01 + Math.sin(Math.PI * across) * 0.09 + wave + ripple,
          );
        }
      }
      positions.needsUpdate = true;
      if (refreshNormals) fin.geometry.computeVertexNormals();
      fin.mesh.material.emissiveIntensity = 0.38 + energy * 0.72 + audio * 0.38;
      fin.mesh.material.opacity = 0.42 + energy * 0.12 + thrust * 0.025;

      const edge = fin.edge.geometry.getAttribute("position");
      let edgeCursor = 0;
      for (let row = 0; row < rows; row += 1) {
        const a = row * (columns + 1) + columns;
        const b = (row + 1) * (columns + 1) + columns;
        edge.setXYZ(edgeCursor++, positions.getX(a), positions.getY(a), positions.getZ(a) + 0.015);
        edge.setXYZ(edgeCursor++, positions.getX(b), positions.getY(b), positions.getZ(b) + 0.015);
      }
      edge.needsUpdate = true;
      fin.edge.material.opacity = 0.18 + energy * 0.28;

      const root = fin.root.geometry.getAttribute("position");
      let rootCursor = 0;
      for (let row = 0; row < rows; row += 1) {
        const a = row * (columns + 1);
        const b = (row + 1) * (columns + 1);
        root.setXYZ(rootCursor++, positions.getX(a), positions.getY(a), positions.getZ(a) + 0.012);
        root.setXYZ(rootCursor++, positions.getX(b), positions.getY(b), positions.getZ(b) + 0.012);
      }
      root.needsUpdate = true;
      fin.root.material.opacity = (this.structureVisible ? 0.46 : 0.15) + energy * 0.08;

      const ribs = fin.ribs.geometry.getAttribute("position");
      let ribCursor = 0;
      for (let index = 0; index < 10; index += 1) {
        const row = Math.round(index / 9 * rows);
        const innerIndex = row * (columns + 1);
        const outerIndex = innerIndex + columns;
        ribs.setXYZ(ribCursor++, positions.getX(innerIndex), positions.getY(innerIndex), positions.getZ(innerIndex) + 0.02);
        ribs.setXYZ(ribCursor++, positions.getX(outerIndex), positions.getY(outerIndex), positions.getZ(outerIndex) + 0.02);
      }
      ribs.needsUpdate = true;
    });
  }

  createEnvironment() {
    this.plankton = new Plankton();
    this.scene.add(this.plankton.object);
    this.lightShafts = [];
    for (let index = 0; index < 3; index += 1) {
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35 + index * 0.22, 2.8 + index * 0.7, 24, 32, 1, true),
        new THREE.MeshBasicMaterial({
          color: index === 1 ? 0x2358a1 : 0x1676a5,
          transparent: true,
          opacity: 0.022 + index * 0.006,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      shaft.position.set(-6 + index * 5.4, 8, -7 - index * 2);
      shaft.rotation.z = 0.12 - index * 0.08;
      this.scene.add(shaft);
      this.lightShafts.push(shaft);
    }
  }

  createFollowers() {
    const count = this.quality < 1 ? 2 : 4;
    this.followers = [];
    for (let index = 0; index < count; index += 1) {
      const group = new THREE.Group();
      const material = createFollowerMaterial(index);
      const body = new THREE.Mesh(createMantleGeometry(28), material);
      const bodyScale = 0.48 + seeded(index + 12) * 0.28;
      body.scale.setScalar(bodyScale);
      group.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.72, 22, 14), material);
      head.scale.set(1, 0.66, 0.78);
      head.position.y = -0.72;
      group.add(head);
      const finMaterial = new THREE.MeshBasicMaterial({ color: 0x6ac6d8, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false });
      [-1, 1].forEach((side) => {
        const fin = new THREE.Mesh(new THREE.CircleGeometry(0.9, 24, 0, Math.PI), finMaterial);
        fin.scale.set(0.55, 1.25, 1);
        fin.position.set(side * 0.92, 1.0, 0);
        fin.rotation.z = side * -0.42;
        group.add(fin);
      });
      const armPositions = new Float32Array(7 * 9 * 2 * 3);
      const arms = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x73d7e4, transparent: true, opacity: 0.1, depthWrite: false }));
      arms.geometry.setAttribute("position", new THREE.BufferAttribute(armPositions, 3));
      group.add(arms);
      const angle = index / count * TAU + seeded(index + 30);
      const radius = 5.8 + seeded(index + 40) * 4.5;
      group.position.set(Math.cos(angle) * radius, (seeded(index + 50) * 2 - 1) * 4.8, -8 - seeded(index + 60) * 12);
      group.rotation.z = 1.08 + (seeded(index + 70) - 0.5) * 0.55;
      const scale = 0.42 + seeded(index + 80) * 0.5;
      group.scale.setScalar(scale);
      this.scene.add(group);
      this.followers.push({ group, body, head, arms, phase: seeded(index + 90) * TAU, base: group.position.clone(), scale, bodyScale });
    }
  }

  updateFollowers(time, audio) {
    const scatter = this.inkEnergy * 2.8;
    this.followers.forEach((follower, index) => {
      follower.group.position.x = follower.base.x + Math.sin(time * 0.18 + follower.phase) * 1.3 + Math.sign(follower.base.x || 1) * scatter;
      follower.group.position.y = follower.base.y + Math.sin(time * 0.31 + follower.phase * 1.7) * 0.85 + this.inkEnergy * (index % 2 ? -1.2 : 1.1);
      follower.group.rotation.y = Math.sin(time * 0.22 + follower.phase) * 0.32;
      follower.group.rotation.z += Math.sin(time * 0.35 + follower.phase) * 0.0008 * (this.reducedMotion ? 0.15 : 1);
      follower.body.scale.y = follower.bodyScale * (1 + Math.sin(time * 1.15 + follower.phase) * 0.035 + audio * 0.045);
      const positions = follower.arms.geometry.getAttribute("position");
      let cursor = 0;
      for (let arm = 0; arm < 7; arm += 1) {
        const rootX = (arm / 6 - 0.5) * 0.95;
        for (let segment = 0; segment < 9; segment += 1) {
          for (let endpoint = 0; endpoint < 2; endpoint += 1) {
            const t = (segment + endpoint) / 9;
            positions.setXYZ(
              cursor++,
              rootX + Math.sin(time * 1.25 + arm + t * 5) * t * 0.16,
              -1.1 - t * (1.8 + (arm % 3) * 0.18),
              Math.cos(time * 0.8 + arm + t * 4) * t * 0.14,
            );
          }
        }
      }
      positions.needsUpdate = true;
    });
  }

  createInkCloud() {
    this.inkCount = Math.floor((this.quality < 1 ? 520 : 1200));
    const positions = new Float32Array(this.inkCount * 3);
    const colors = new Float32Array(this.inkCount * 3);
    const uvs = new Float32Array(this.inkCount * 2);
    this.inkVelocities = [];
    for (let index = 0; index < this.inkCount; index += 1) {
      colors[index * 3] = 0.25 + seeded(index + 100) * 0.24;
      colors[index * 3 + 1] = 0.08 + seeded(index + 200) * 0.12;
      colors[index * 3 + 2] = 0.52 + seeded(index + 300) * 0.44;
      uvs[index * 2] = seeded(index + 400);
      uvs[index * 2 + 1] = seeded(index + 500);
      this.inkVelocities.push(new THREE.Vector3());
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    const material = new THREE.PointsMaterial({
      map: this.glowTexture,
      vertexColors: true,
      size: this.quality < 1 ? 0.34 : 0.44,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.NormalBlending,
      alphaTest: 0.015,
    });
    this.inkCloud = new THREE.Points(geometry, material);
    this.inkCloud.renderOrder = 18;
    this.hero.add(this.inkCloud);

    this.inkAura = new THREE.Points(geometry, new THREE.PointsMaterial({
      map: this.glowTexture,
      color: 0x8058ff,
      size: this.quality < 1 ? 0.48 : 0.68,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.02,
    }));
    this.inkAura.renderOrder = 19;
    this.hero.add(this.inkAura);

    this.inkSprites = Array.from({ length: this.quality < 1 ? 4 : 7 }, (_, index) => {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTexture, color: index % 2 ? 0x1c073f : 0x050c22, transparent: true, opacity: 0, depthWrite: false }));
      sprite.position.set((seeded(index + 800) - 0.5) * 1.2, -1.28, 0.72 + seeded(index + 900) * 0.42);
      sprite.scale.setScalar(0.1);
      sprite.renderOrder = 17;
      this.hero.add(sprite);
      return sprite;
    });
  }

  resetInkParticles() {
    const positions = this.inkCloud.geometry.getAttribute("position");
    for (let index = 0; index < this.inkCount; index += 1) {
      const angle = seeded(index + 1100) * TAU;
      const radius = seeded(index + 1200) ** 0.45 * 0.52;
      positions.setXYZ(index, Math.cos(angle) * radius, -1.45 + (seeded(index + 1300) - 0.5) * 0.35, 0.4 + Math.sin(angle) * radius * 0.45);
      const speed = 0.52 + seeded(index + 1400) * 1.85;
      this.inkVelocities[index].set(
        Math.cos(angle) * speed + (seeded(index + 1500) - 0.5) * 0.35,
        -0.42 - seeded(index + 1600) * 1.15,
        (seeded(index + 1700) - 0.5) * 1.1,
      );
    }
    positions.needsUpdate = true;
  }

  updateInk(delta) {
    const positions = this.inkCloud.geometry.getAttribute("position");
    if (this.inkEnergy > 0.006) {
      for (let index = 0; index < this.inkCount; index += 1) {
        const velocity = this.inkVelocities[index];
        const swirl = Math.sin(index * 0.17 + this.lastTime * 1.8) * 0.08;
        velocity.x += swirl * delta;
        velocity.y += 0.08 * delta;
        velocity.multiplyScalar(Math.pow(0.975, delta * 60));
        positions.setXYZ(index, positions.getX(index) + velocity.x * delta, positions.getY(index) + velocity.y * delta, positions.getZ(index) + velocity.z * delta);
      }
      positions.needsUpdate = true;
    }
    this.inkCloud.material.opacity = Math.min(0.82, this.inkEnergy * 0.94);
    this.inkAura.material.opacity = Math.min(0.34, this.inkEnergy * 0.4);
    this.inkSprites.forEach((sprite, index) => {
      const progress = 1 - this.inkEnergy;
      sprite.material.opacity = this.inkEnergy * (0.46 + index * 0.018);
      sprite.scale.setScalar(0.65 + progress * (3.7 + index * 0.36));
      sprite.position.x += Math.sin(index * 2.1) * delta * 0.22;
      sprite.position.y -= delta * (0.16 + index * 0.025);
    });
    this.inkLight.intensity = this.inkEnergy * 31;
  }

  createPostProcessing() {
    const scenePass = pass(this.scene, this.camera);
    scenePass.setMRT(mrt({ output, bloomIntensity: float(0) }));
    const outputPass = scenePass.getTextureNode();
    const bloomIntensityPass = scenePass.getTextureNode("bloomIntensity");
    const bloomPass = bloom(Fn(() => {
      const intensity = bloomIntensityPass.r;
      const signal = bloomIntensityPass.g;
      const colorMask = vec3(float(1).sub(signal.mul(0.35)), float(1).sub(signal.mul(0.62)), 1);
      return vec4(outputPass.rgb.mul(intensity).mul(colorMask), 1);
    })());
    this.postProcessing = new THREE.PostProcessing(this.renderer);
    this.postProcessing.outputColorTransform = false;
    this.postProcessing.outputNode = Fn(() => {
      const intensity = bloomIntensityPass.r;
      const signal = bloomIntensityPass.g;
      const mask = float(1).sub(clamp(intensity, 0, 1)).add(signal);
      const finalBloom = bloomPass.rgb.mul(clamp(mask, 0, 1));
      return vec4(outputPass.rgb.add(finalBloom), 1).renderOutput();
    })();
    bloomPass.threshold.value = 0.001;
    bloomPass.strength.value = this.quality < 1 ? 0.34 : 0.47;
    bloomPass.radius.value = 0.76;
    this.bloomPass = bloomPass;
  }

  setPointer(x, y, strength = 0.2) {
    this.pointerTarget.set(x, y, strength);
    if (!this.raycaster || !this.physics || !this.camera) return;
    this.rayNdc.set(x, y);
    this.raycaster.setFromCamera(this.rayNdc, this.camera);
    this.hero.updateMatrixWorld(true);
    this.inverseHero.copy(this.hero.matrixWorld).invert();
    this.localRayOrigin.copy(this.raycaster.ray.origin).applyMatrix4(this.inverseHero);
    this.localRayDirection.copy(this.raycaster.ray.direction).transformDirection(this.inverseHero);
    this.physics.setMouseRay(this.localRayOrigin, this.localRayDirection);
  }

  poke(x, y) {
    if (!this.raycaster || !this.camera) return { hit: false };
    this.setPointer(x, y, 1.25);
    this.rayNdc.set(x, y);
    this.raycaster.setFromCamera(this.rayNdc, this.camera);
    const targets = [this.mantle, ...this.fins.map((fin) => fin.mesh)];
    const intersection = this.raycaster.intersectObjects(targets, false)[0];
    const point = this.hitPoint;
    if (intersection) {
      point.copy(intersection.point);
    } else {
      const distance = Math.abs(this.raycaster.ray.direction.z) > 0.0001
        ? (this.hero.position.z - this.raycaster.ray.origin.z) / this.raycaster.ray.direction.z
        : 10;
      this.raycaster.ray.at(Math.max(0, distance), point);
    }
    point.z += 0.5;
    this.impactRing.position.copy(point);
    this.impactRing.scale.setScalar(0.12);
    this.impactRing.material.opacity = 1;
    this.pokeEnergy = 1;
    this.escapeAge = 0;
    this.escapeIntensity = intersection ? 1 : 0.78;
    this.signalEnergy = Math.max(this.signalEnergy, intersection ? 1.35 : 0.92);
    this.recoil.set(-x * 0.18, -y * 0.12, 0);
    return { hit: Boolean(intersection), point: point.clone() };
  }

  triggerSignal(intensity = 1) {
    this.signalEnergy = Math.max(this.signalEnergy, intensity);
    this.deployEnergy = Math.max(this.deployEnergy, Math.min(1, intensity));
  }

  triggerInk() {
    this.inkEnergy = 1;
    this.escapeAge = 0;
    this.escapeIntensity = 0.86;
    this.signalEnergy = Math.max(this.signalEnergy, 0.82);
    this.resetInkParticles();
    this.inkSprites.forEach((sprite, index) => {
      sprite.position.set((seeded(index + 800) - 0.5) * 1.2, -1.28, 0.72 + seeded(index + 900) * 0.42);
      sprite.scale.setScalar(0.1);
    });
  }

  setStructure(visible) {
    this.structureVisible = visible;
    if (this.springVisualizer) this.springVisualizer.object.visible = visible;
    this.fins?.forEach((fin) => { fin.ribs.visible = visible; });
    this.tentacles?.setStructure(visible);
  }

  setInspecting(active) {
    this.inspectTarget = active ? 1 : 0;
  }

  setView(name = "hero") {
    if (!this.camera || !this.controls) return;
    const mobile = innerWidth < 760;
    const views = mobile
      ? {
          hero: new THREE.Vector3(0, 0.4, 19.2),
          profile: new THREE.Vector3(7.4, 2.15, 14.8),
          close: new THREE.Vector3(2.1, 0.7, 11.8),
        }
      : {
          hero: new THREE.Vector3(0, 0.4, 12),
          profile: new THREE.Vector3(4.6, 1.65, 10.1),
          close: new THREE.Vector3(1.8, 0.62, 7.8),
        };
    this.viewName = views[name] ? name : "hero";
    this.camera.position.copy(views[this.viewName]);
    this.controls.target.set(this.baseHeroPosition.x * 0.45, this.baseHeroPosition.y + 0.12, 0);
    this.controls.update();
  }

  reset() {
    this.pointer.set(0, 0, 0);
    this.pointerTarget.set(0, 0, 0);
    this.signalEnergy = 0;
    this.deployEnergy = 0;
    this.inkEnergy = 0;
    this.pokeEnergy = 0;
    this.recoil.set(0, 0, 0);
    this.swimOffset.set(0, 0, 0);
    this.swimVelocity.set(0, 0, 0);
    this.escapeAge = Number.POSITIVE_INFINITY;
    this.escapeIntensity = 0;
    this.inspectTarget = 0;
    this.inspectMix = 0;
    this.behavior = "glide";
    this.impactRing.material.opacity = 0;
    this.setStructure(false);
    this.setView("hero");
  }

  async update(time, bands = { low: 0, mid: 0, high: 0 }, audioPlaying = false) {
    const delta = Math.min(Math.max(time - this.lastTime, 1 / 240), 1 / 30);
    this.lastTime = time;
    const motion = this.reducedMotion ? 0.16 : 1;
    this.pointer.lerp(this.pointerTarget, this.reducedMotion ? 0.035 : 0.085);
    this.pointerTarget.z *= Math.pow(0.91, delta * 60);
    this.signalEnergy *= Math.pow(this.reducedMotion ? 0.985 : 0.968, delta * 60);
    this.deployEnergy *= Math.pow(this.reducedMotion ? 0.996 : 0.992, delta * 60);
    this.inkEnergy *= Math.pow(this.reducedMotion ? 0.985 : 0.986, delta * 60);
    this.pokeEnergy *= Math.pow(this.reducedMotion ? 0.94 : 0.965, delta * 60);
    this.recoil.multiplyScalar(Math.pow(0.968, delta * 60));
    const audio = audioPlaying ? Math.min(1, bands.low * 0.65 + bands.mid * 0.72 + bands.high * 0.45) : 0;
    const activeEnergy = Math.min(1.35, 0.34 + this.pointer.z * 0.55 + this.signalEnergy * 0.72 + this.pokeEnergy * 0.75 + audio * 0.45);
    const escapeActive = Number.isFinite(this.escapeAge);
    if (escapeActive) this.escapeAge += delta * (this.reducedMotion ? 0.72 : 1);
    const escapeAge = escapeActive ? this.escapeAge : 2;
    const compressionPulse = pulseWindow(escapeAge, 0.03, 0.26, 0.72) * this.escapeIntensity * motion;
    const jetPulse = pulseWindow(escapeAge, 0.28, 0.54, 0.96) * this.escapeIntensity * motion;
    const wakePulse = pulseWindow(escapeAge, 0.34, 0.64, 1.18) * this.escapeIntensity * motion;
    if (this.escapeAge > 1.22) {
      this.escapeAge = Number.POSITIVE_INFINITY;
      this.escapeIntensity = 0;
    }
    const squeeze = compressionPulse * 0.18;
    const thrust = Math.min(1.2, jetPulse * 1.08);
    const tentacleDeploy = THREE.MathUtils.clamp(this.deployEnergy - this.inkEnergy * 0.5, 0, 1);
    this.inspectMix += (this.inspectTarget - this.inspectMix) * (1 - Math.exp(-delta * 8));
    this.behavior = this.inspectMix > 0.42
      ? "inspect"
      : this.inkEnergy > 0.12
      ? "defense"
      : this.pokeEnergy > 0.08
        ? "startle"
        : this.pointer.z > 0.19
          ? "observe"
          : "glide";

    this.skinUniforms.time.value = time;
    this.skinUniforms.signal.value = this.signalEnergy;
    this.skinUniforms.ink.value = this.inkEnergy;
    this.skinUniforms.pointer.value = this.pointer.z;
    this.skinUniforms.audio.value = audio;
    this.skinUniforms.motion.value = motion;

    const glideScale = motion * (1 - this.inspectMix * 0.86);
    const cruiseX = (Math.sin(time * 0.18 + 0.4) * 0.46 + Math.sin(time * 0.07) * 0.08) * glideScale;
    const cruiseY = (Math.sin(time * 0.23 + 1.1) * 0.16 + Math.cos(time * 0.11) * 0.045) * glideScale;
    const cruiseVelocityX = (Math.cos(time * 0.18 + 0.4) * 0.46 * 0.18 + Math.cos(time * 0.07) * 0.08 * 0.07) * glideScale;
    const cruiseVelocityY = (Math.cos(time * 0.23 + 1.1) * 0.16 * 0.23 - Math.sin(time * 0.11) * 0.045 * 0.11) * glideScale;
    const saccadeIndex = Math.floor((time + 0.8) / 6.4);
    const saccadeOffset = (seeded(saccadeIndex + 610) - 0.5) * 0.32;
    const targetCourse = this.baseHeroRotation + saccadeOffset * motion + this.pointer.x * 0.055;
    const courseError = Math.atan2(
      Math.sin(targetCourse - this.courseRotation),
      Math.cos(targetCourse - this.courseRotation),
    );
    this.courseRotation += courseError * (1 - Math.exp(-delta * (this.reducedMotion ? 0.5 : 2.15)));
    this.courseRotation = Math.atan2(Math.sin(this.courseRotation), Math.cos(this.courseRotation));
    this.hero.rotation.y = 0.3 + Math.sin(time * 0.42) * 0.07 * glideScale + this.pointer.x * 0.16;
    this.hero.rotation.x = 0.11 + Math.sin(time * 0.35 + 1.4) * 0.04 * glideScale - this.pointer.y * 0.11;
    this.hero.rotation.z = this.courseRotation + Math.sin(time * 0.63) * 0.018 * glideScale - this.pokeEnergy * 0.035;
    const headingX = -Math.sin(this.hero.rotation.z);
    const headingY = Math.cos(this.hero.rotation.z);
    this.swimVelocity.x += headingX * thrust * delta * 2.8 - this.swimOffset.x * delta * 0.92;
    this.swimVelocity.y += headingY * thrust * delta * 2.8 - this.swimOffset.y * delta * 0.92;
    this.swimVelocity.multiplyScalar(Math.pow(0.91, delta * 60));
    this.swimOffset.addScaledVector(this.swimVelocity, delta * motion);
    this.swimOffset.clampLength(0, this.reducedMotion ? 0.1 : 0.42);
    this.hero.position.x = this.baseHeroPosition.x + cruiseX + this.pointer.x * 0.08 + this.recoil.x + this.swimOffset.x;
    this.hero.position.y = this.baseHeroPosition.y + cruiseY + this.pointer.y * 0.05 + this.recoil.y + this.inkEnergy * 0.22 + this.swimOffset.y;
    const effectiveVelocityX = cruiseVelocityX + this.swimVelocity.x;
    const effectiveVelocityY = cruiseVelocityY + this.swimVelocity.y;
    const speed = Math.hypot(effectiveVelocityX, effectiveVelocityY);
    const alignment = thrust > 0.25 && speed > 0.0001
      ? (effectiveVelocityX * headingX + effectiveVelocityY * headingY) / speed
      : 0;
    this.tentacles.setState({
      signal: this.signalEnergy,
      ink: this.inkEnergy,
      poke: this.pokeEnergy,
      audio,
      motion,
      thrust,
      turn: courseError,
      deploy: tentacleDeploy,
    });
    const mantleBreath = Math.sin(time * 1.42) * 0.026 * motion;
    this.mantle.scale.set(
      1 - squeeze * 0.42 + mantleBreath,
      1 + squeeze * 0.1 + mantleBreath * 0.38,
      1 - squeeze * 0.54 + mantleBreath * 0.82,
    );
    this.siphon.material.emissiveIntensity = 0.16 + thrust * 1.35;
    this.siphon.scale.y = 1 + thrust * 0.16;
    this.jetPlume.material.opacity = Math.min(0.095, wakePulse * 0.072 + this.pokeEnergy * 0.025);
    this.jetPlume.scale.set(0.62 + wakePulse * 0.3, 0.12 + wakePulse * 0.86, 0.62 + wakePulse * 0.3);
    this.jetPlume.position.y = -1.82 - this.jetPlume.scale.y * 0.48;
    this.jetCore.material.opacity = Math.min(0.11, thrust * 0.085);
    this.jetCore.scale.set(0.48 + thrust * 0.12, 0.14 + thrust * 0.62, 0.48 + thrust * 0.12);
    this.jetCore.position.y = -1.78 - this.jetCore.scale.y * 0.46;
    this.jetRings.forEach((ring, index) => {
      const progress = (time * (1.55 + thrust * 0.7) + index / this.jetRings.length) % 1;
      ring.position.y = -1.74 - progress * (1.42 + wakePulse * 0.32);
      ring.position.x = -0.42 + Math.sin(progress * Math.PI) * 0.045;
      ring.position.z = 0.25 + Math.cos(progress * Math.PI) * 0.035;
      ring.scale.setScalar(0.1 + progress * 0.39);
      ring.material.opacity = wakePulse * (1 - progress) ** 1.8 * 0.42;
    });
    this.jetBubbles.forEach((bubble, index) => {
      const seedA = seeded(index + 2100) - 0.5;
      const seedB = seeded(index + 2200) - 0.5;
      const progress = (time * (0.72 + seeded(index + 2300) * 0.24) + index / this.jetBubbles.length) % 1;
      bubble.position.set(
        -0.42 + seedA * (0.08 + progress * 0.34),
        -1.76 - progress * (1.55 + wakePulse * 0.45),
        0.25 + seedB * (0.08 + progress * 0.28),
      );
      const bubbleScale = 0.04 + seeded(index + 2400) * 0.06 + progress * 0.04;
      bubble.scale.setScalar(bubbleScale);
      bubble.material.opacity = wakePulse * Math.sin(progress * Math.PI) * (0.32 + seeded(index + 2500) * 0.35);
    });
    this.innerOrgan.scale.y = 1.18 + Math.sin(time * 1.22) * 0.06 * motion + bands.low * 0.13;
    this.innerOrgan.material.emissiveIntensity = 0.18 + this.signalEnergy * 0.58 + audio * 0.3;
    this.innerOrgan.material.opacity = this.signalEnergy * 0.022 + audio * 0.009;
    const gazeStep = Math.floor((time + 0.35) / 2.6);
    this.eyes.forEach(({ pupil, iris, side }) => {
      const idleGazeX = (seeded(gazeStep + 2600 + side * 3) - 0.5) * 0.034 * motion;
      const idleGazeY = (seeded(gazeStep + 2700 - side * 5) - 0.5) * 0.024 * motion;
      pupil.position.x = this.pointer.x * 0.044 + idleGazeX;
      pupil.position.y = this.pointer.y * 0.03 + idleGazeY;
      iris.material.color.setHSL(0.09 + this.signalEnergy * 0.018, 0.38 + this.signalEnergy * 0.18, 0.24 + this.signalEnergy * 0.07);
      pupil.scale.x = 1 + Math.sin(time * 0.46 + side) * 0.018;
    });

    this.finPhase += delta * (3.05 + Math.min(1.4, speed) * 1.9 + audio * 1.8);
    this.updateFins(this.finPhase, activeEnergy, audio, thrust, speed);
    this.updateFollowers(time, audio);
    this.updateInk(delta);
    this.lightShafts.forEach((shaft, index) => {
      shaft.rotation.z += Math.sin(time * 0.12 + index * 1.7) * 0.00005 * motion;
      shaft.material.opacity = 0.018 + index * 0.005 + Math.sin(time * 0.2 + index) * 0.004 * motion;
    });
    const impactProgress = 1 - this.pokeEnergy;
    this.impactRing.material.opacity = Math.pow(this.pokeEnergy, 1.35) * 0.92;
    this.impactRing.scale.setScalar(0.18 + impactProgress * 3.8);
    this.impactRing.material.rotation = time * 0.35;
    this.motionSample.x = this.hero.position.x;
    this.motionSample.y = this.hero.position.y;
    this.motionSample.rotation = this.hero.rotation.z;
    this.motionSample.squeeze = squeeze;
    this.motionSample.thrust = thrust;
    this.motionSample.fin = Math.sin(this.finPhase);
    this.motionSample.speed = speed;
    this.motionSample.alignment = alignment;
    this.motionSample.radialScale = this.mantle.scale.x;
    this.motionSample.axialScale = this.mantle.scale.y;
    this.motionSample.wake = wakePulse;
    this.motionSample.escapePhase = Math.min(1, escapeAge / 1.22);
    this.motionSample.deploy = tentacleDeploy;
    this.motionSample.yaw = this.hero.rotation.y;
    this.motionSample.pitch = this.hero.rotation.x;
    await this.physics.update(delta, time);
    this.controls.update(delta);
    await this.postProcessing.renderAsync();
  }

  resize() {
    if (!this.renderer || !this.camera) return;
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    const mobile = innerWidth < 760;
    this.baseHeroPosition.set(mobile ? 0 : 1.05, mobile ? 0.65 : 0.15, 0);
    this.baseHeroRotation = mobile ? 1.48 : 1.52;
    if (this.lastTime === 0) this.courseRotation = this.baseHeroRotation;
    this.hero.position.copy(this.baseHeroPosition);
    this.setView(this.viewName);
  }

  getMetrics() {
    const tentacle = this.tentacles.getMetrics();
    const escapeStage = !Number.isFinite(this.escapeAge)
      ? "idle"
      : this.escapeAge < 0.28
        ? "compress"
        : this.escapeAge < 0.94
          ? "jet"
          : "recover";
    return {
      vertices: tentacle.vertices,
      springs: tentacle.springs,
      triangles: tentacle.triangles + (this.mantle.geometry.index?.count ?? 0) / 3,
      suckers: tentacle.suckers,
      appendages: tentacle.appendages,
      signal: this.signalEnergy,
      ink: this.inkEnergy,
      poke: this.pokeEnergy,
      behavior: this.behavior,
      locomotion: Number.isFinite(this.escapeAge) ? "jet-escape" : "fin-cruise",
      escapeStage,
      view: this.viewName,
      camera: this.camera ? { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z } : null,
      motion: this.motionSample ?? null,
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
    this.impactTexture?.dispose();
    this.skinTexture?.dispose();
    this.postProcessing?.dispose?.();
    this.renderer?.dispose();
  }
}
