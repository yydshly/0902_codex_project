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
  select,
  sin,
  transformNormalToView,
  uniform,
  uv,
  vec3,
  vec4,
  varying,
} from "three/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { VerletPhysics } from "@aurelia-upstream/physics/verletPhysics.js";
import { SpringVisualizer } from "@aurelia-upstream/physics/springVisualizer.js";

const TAU = Math.PI * 2;

function seeded(index) {
  const value = Math.sin(index * 78.233 + 41.71) * 43758.5453;
  return value - Math.floor(value);
}

function formatCount(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value);
}

class ResonantAnchorBridge {
  constructor(physics) {
    this.physics = physics;
    this.anchors = [];
    this.uniforms = {
      elapsed: uniform(0),
      low: uniform(0),
      mid: uniform(0),
      high: uniform(0),
      pulse: uniform(0),
      tension: uniform(0.68),
    };
  }

  register(vertex, basePosition, angle) {
    this.anchors.push({ vertexId: vertex.id, basePosition: basePosition.clone(), angle });
  }

  async bake() {
    const ids = new Uint32Array(this.anchors.length);
    const params = new Float32Array(this.anchors.length * 4);
    this.anchors.forEach(({ vertexId, basePosition, angle }, index) => {
      ids[index] = vertexId;
      params.set([basePosition.x, basePosition.y, basePosition.z, angle], index * 4);
    });

    this.idData = instancedArray(ids, "uint");
    this.paramData = instancedArray(params, "vec4");
    this.updateKernel = Fn(() => {
      const vertexId = this.idData.element(instanceIndex);
      const param = this.paramData.element(instanceIndex);
      const base = param.xyz;
      const angle = param.w;
      const ringSign = select(base.y.greaterThan(0), float(1), float(-1));
      const twist = this.uniforms.mid.mul(0.24).mul(ringSign)
        .add(sin(this.uniforms.elapsed.mul(0.37).add(angle.mul(2))).mul(0.025));
      const twistCos = cos(twist);
      const twistSin = sin(twist);
      const rotated = vec3(
        base.x.mul(twistCos).sub(base.z.mul(twistSin)),
        base.y,
        base.x.mul(twistSin).add(base.z.mul(twistCos)),
      ).toVar();
      const radial = vec3(rotated.x, 0, rotated.z).normalize();
      const travelling = sin(angle.mul(5).add(this.uniforms.elapsed.mul(8.4)).add(ringSign.mul(1.7)))
        .mul(this.uniforms.high).mul(0.15);
      const impact = sin(angle.mul(3).sub(this.uniforms.elapsed.mul(6.2)).add(ringSign.mul(1.25)))
        .mul(this.uniforms.pulse).mul(0.22);
      const radialScale = float(0.955)
        .add(this.uniforms.tension.mul(0.066))
        .add(this.uniforms.low.mul(0.095))
        .add(travelling.mul(0.32))
        .add(impact.mul(0.35));
      const position = vec3(
        rotated.x.mul(radialScale),
        rotated.y.mul(float(0.94).add(this.uniforms.tension.mul(0.12)).add(this.uniforms.low.mul(0.055)))
          .add(travelling).add(impact),
        rotated.z.mul(radialScale),
      ).toVar();
      position.addAssign(radial.mul(travelling.add(impact).mul(0.55)));
      this.physics.positionData.element(vertexId).xyz.assign(position);
    })().compute(this.anchors.length);

    await this.physics.renderer.computeAsync(this.updateKernel);
  }

  setState({ elapsed, low, mid, high, pulse, tension }) {
    this.uniforms.elapsed.value = elapsed;
    this.uniforms.low.value = low;
    this.uniforms.mid.value = mid;
    this.uniforms.high.value = high;
    this.uniforms.pulse.value = pulse;
    this.uniforms.tension.value = tension;
    this.needsAnchorUpdate = true;
  }

  async update() {
    if (!this.needsAnchorUpdate) return;
    this.needsAnchorUpdate = false;
    await this.physics.renderer.computeAsync(this.updateKernel);
  }
}

export class ResonantMatterScene {
  constructor(container, {
    reducedMotion = false,
    onImpactChange = () => {},
  } = {}) {
    this.container = container;
    this.reducedMotion = reducedMotion;
    this.onImpactChange = onImpactChange;
    this.quality = window.innerWidth < 768 ? 0.68 : 1;
    this.pointer = new THREE.Vector2(4, 4);
    this.raycaster = new THREE.Raycaster();
    this.clock = new THREE.Clock();
    this.tension = 0.68;
    this.pulseEnergy = 0;
    this.lastPulseAt = -10;
    this.lastHighAt = -10;
    this.previousBands = { low: 0, mid: 0, high: 0 };
    this.dummy = new THREE.Object3D();
    this.disposables = [];
  }

  async init(onProgress = () => {}) {
    globalThis.__AURELIA_LAB_CONFIG__ = {
      ...(globalThis.__AURELIA_LAB_CONFIG__ ?? {}),
      stepsPerSecond: this.quality < 1 ? 120 : 180,
    };

    this.renderer = new THREE.WebGPURenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality < 1 ? 0.82 : 0.72));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.72;
    await this.renderer.init();
    if (!this.renderer.backend?.isWebGPUBackend) throw new Error("没有可用的 WebGPU 后端");
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.container.prepend(this.renderer.domElement);
    onProgress(0.12, "建立 WebGPU 管线");

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020607);
    this.scene.fog = new THREE.FogExp2(0x020708, 0.025);
    this.camera = new THREE.PerspectiveCamera(49, window.innerWidth / window.innerHeight, 0.08, 80);
    this.camera.position.set(-1.1, 0.25, this.quality < 1 ? 17.6 : 14.2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(this.quality < 1 ? 0 : -0.8, 0, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.055;
    this.controls.enablePan = false;
    this.controls.minDistance = this.quality < 1 ? 14 : 9.5;
    this.controls.maxDistance = this.quality < 1 ? 25 : 20;
    this.controls.autoRotate = !this.reducedMotion;
    this.controls.autoRotateSpeed = 0.22;

    this.scene.add(new THREE.HemisphereLight(0x82e9f2, 0x05090d, 0.48));
    const upperLight = new THREE.PointLight(0xcaff6b, 0, 28, 2);
    upperLight.position.set(4, 6, 7);
    const lowerLight = new THREE.PointLight(0x637bff, 0, 30, 2);
    lowerLight.position.set(-5, -4, 6);
    const rimLight = new THREE.PointLight(0x53edff, 0, 26, 2);
    rimLight.position.set(5, -1, -3);
    this.scene.add(upperLight, lowerLight, rimLight);

    this.createAtmosphere();
    onProgress(0.23, "生成空间介质");

    this.physics = new VerletPhysics(this.renderer);
    this.bridge = new ResonantAnchorBridge(this.physics);
    this.physics.addObject(this.bridge);
    // Chrome/Dawn readback exposes a non-finite first storage slot in this
    // standalone topology. Keep index 0 isolated so it cannot enter constraints.
    this.physics.addVertex(new THREE.Vector3(100, 100, 100), true);
    this.buildTensileTopology();
    onProgress(0.48, "分配弹簧与位置缓冲");
    await this.physics.bake();
    this.physics.uniforms.dampening.value = 0.972;
    this.physics.setMouseRay(new THREE.Vector3(500, 500, 500), new THREE.Vector3(1, 0, 0));
    onProgress(0.68, "编译 GPU 约束求解器");

    this.createMembraneSurface();
    this.createStructuralLines();
    this.createAnchorArchitecture();
    this.createImpactVfx();
    onProgress(0.83, "连接物理表面与选择性辉光");

    this.setupPostProcessing();
    this.resize();
    onProgress(1, "声场雕塑已就绪");
  }

  buildTensileTopology() {
    const ribbonCount = this.quality < 1 ? 16 : 24;
    const rowCount = this.quality < 1 ? 20 : 26;
    const columnCount = 5;
    const grids = [];

    for (let ribbon = 0; ribbon < ribbonCount; ribbon += 1) {
      const grid = [];
      const baseAngle = ribbon / ribbonCount * TAU;
      const directionBias = ribbon % 2 === 0 ? 1 : -1;
      for (let row = 0; row < rowCount; row += 1) {
        const t = row / (rowCount - 1);
        const rowVertices = [];
        const radius = 5.05 - Math.sin(Math.PI * t) * 2.18 + Math.sin(t * Math.PI * 3) * 0.13;
        const theta = baseAngle + t * (0.92 + directionBias * 0.12);
        const y = THREE.MathUtils.lerp(2.75, -2.75, t);
        const radial = new THREE.Vector3(Math.cos(theta), 0, Math.sin(theta));
        const tangent = new THREE.Vector3(-Math.sin(theta), 0, Math.cos(theta));
        const widthScale = 0.6 + Math.sin(Math.PI * t) * 0.42;

        for (let column = 0; column < columnCount; column += 1) {
          const across = column / (columnCount - 1) - 0.5;
          const position = radial.clone().multiplyScalar(radius)
            .addScaledVector(tangent, across * 0.58 * widthScale);
          position.y = y + Math.sin(baseAngle * 3 + t * Math.PI * 2) * 0.06;
          const fixed = row === 0 || row === rowCount - 1;
          const vertex = this.physics.addVertex(position, fixed);
          if (fixed) this.bridge.register(vertex, position, baseAngle);
          rowVertices.push(vertex);

          if (row > 0) {
            this.physics.addSpring(grid[row - 1][column], vertex, 0.00082);
            if (row > 1) this.physics.addSpring(grid[row - 2][column], vertex, 0.00018);
          }
          if (column > 0) {
            this.physics.addSpring(rowVertices[column - 1], vertex, 0.00064);
            if (row > 0) {
              this.physics.addSpring(grid[row - 1][column - 1], vertex, 0.00025);
              this.physics.addSpring(grid[row - 1][column], rowVertices[column - 1], 0.00025);
            }
          }
        }
        grid.push(rowVertices);
      }
      grids.push(grid);
    }

    const weaveRows = [Math.floor(rowCount * 0.26), Math.floor(rowCount * 0.5), Math.floor(rowCount * 0.74)];
    for (let ribbon = 0; ribbon < ribbonCount; ribbon += 1) {
      const next = (ribbon + 1) % ribbonCount;
      weaveRows.forEach((row, index) => {
        const fromColumn = index % 2 === 0 ? columnCount - 1 : 0;
        const toColumn = index % 2 === 0 ? 0 : columnCount - 1;
        this.physics.addSpring(grids[ribbon][row][fromColumn], grids[next][row][toColumn], 0.00016);
      });
    }

    this.topology = { grids, ribbonCount, rowCount, columnCount };
  }

  createMembraneSurface() {
    const { grids, ribbonCount, rowCount, columnCount } = this.topology;
    const vertexTotal = ribbonCount * rowCount * columnCount;
    const positions = new Float32Array(vertexTotal * 3);
    const ids = new Uint32Array(vertexTotal);
    const neighborIds = new Uint32Array(vertexTotal * 4);
    const uvs = new Float32Array(vertexTotal * 2);
    const phases = new Float32Array(vertexTotal);
    const indices = [];

    const flatIndex = (ribbon, row, column) => (ribbon * rowCount + row) * columnCount + column;
    for (let ribbon = 0; ribbon < ribbonCount; ribbon += 1) {
      for (let row = 0; row < rowCount; row += 1) {
        for (let column = 0; column < columnCount; column += 1) {
          const index = flatIndex(ribbon, row, column);
          ids[index] = grids[ribbon][row][column].id;
          neighborIds.set([
            grids[ribbon][row][Math.max(0, column - 1)].id,
            grids[ribbon][row][Math.min(columnCount - 1, column + 1)].id,
            grids[ribbon][Math.max(0, row - 1)][column].id,
            grids[ribbon][Math.min(rowCount - 1, row + 1)][column].id,
          ], index * 4);
          uvs.set([column / (columnCount - 1), row / (rowCount - 1)], index * 2);
          phases[index] = ribbon / ribbonCount;
          if (row < rowCount - 1 && column < columnCount - 1) {
            const a = index;
            const b = flatIndex(ribbon, row, column + 1);
            const c = flatIndex(ribbon, row + 1, column);
            const d = flatIndex(ribbon, row + 1, column + 1);
            if ((ribbon + row + column) % 2 === 0) indices.push(a, c, b, b, c, d);
            else indices.push(a, c, d, a, d, b);
          }
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("physicsId", new THREE.BufferAttribute(ids, 1));
    geometry.setAttribute("neighborIds", new THREE.BufferAttribute(neighborIds, 4));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute("ribbonPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setIndex(indices);

    const material = new THREE.MeshPhysicalNodeMaterial({
      side: THREE.DoubleSide,
      transparent: false,
      depthWrite: true,
      roughness: 0.42,
      metalness: 0.46,
      transmission: 0,
      iridescence: 0.72,
      iridescenceIOR: 1.5,
      clearcoat: 0.76,
      clearcoatRoughness: 0.22,
    });
    const viewNormal = varying(vec3(0), "resonantNormal");
    material.positionNode = Fn(() => {
      const physicsId = attribute("physicsId");
      const neighbors = attribute("neighborIds");
      const current = this.physics.positionData.element(physicsId).xyz;
      const left = this.physics.positionData.element(neighbors.x).xyz;
      const right = this.physics.positionData.element(neighbors.y).xyz;
      const up = this.physics.positionData.element(neighbors.z).xyz;
      const down = this.physics.positionData.element(neighbors.w).xyz;
      const normalRaw = right.sub(left).cross(down.sub(up)).toVar();
      const normal = normalRaw.div(normalRaw.length().max(0.0001));
      viewNormal.assign(transformNormalToView(normal));
      return current;
    })();
    material.normalNode = viewNormal.normalize();
    material.colorNode = Fn(() => {
      const surfaceUv = uv();
      const phase = attribute("ribbonPhase");
      const travelling = sin(surfaceUv.y.mul(32).sub(this.bridge.uniforms.elapsed.mul(2.4)).add(phase.mul(TAU * 4)))
        .mul(0.5).add(0.5);
      const frequencyMix = clamp(this.bridge.uniforms.mid.mul(0.72).add(this.bridge.uniforms.high.mul(0.45)), 0, 1);
      const cold = mix(vec3(0.025, 0.18, 0.19), vec3(0.16, 0.42, 0.53), travelling.mul(0.5));
      const charged = mix(vec3(0.48, 0.67, 0.25), vec3(0.3, 0.12, 0.76), phase);
      return mix(cold, charged, frequencyMix.mul(0.72));
    })();
    material.opacityNode = Fn(() => {
      const edge = uv().x.sub(0.5).abs().mul(2).pow(5);
      return float(1);
    })();
    material.emissiveNode = Fn(() => {
      const edge = uv().x.sub(0.5).abs().mul(2).pow(7);
      const travelling = sin(uv().y.mul(38).sub(this.bridge.uniforms.elapsed.mul(5.2)))
        .mul(0.5).add(0.5);
      const energy = float(0.055).add(edge.mul(0.21))
        .add(travelling.mul(this.bridge.uniforms.high).mul(0.14))
        .add(this.bridge.uniforms.pulse.mul(0.1));
      return mix(vec3(0.08, 0.45, 0.54), vec3(0.55, 0.82, 0.2), travelling).mul(energy);
    })();
    material.mrtNode = mrt({
      bloomIntensity: Fn(() => {
        const edge = uv().x.sub(0.5).abs().mul(2).pow(7);
        const amount = float(0.012).add(edge.mul(0.055))
          .add(this.bridge.uniforms.high.mul(0.09))
          .add(this.bridge.uniforms.pulse.mul(0.07));
        return vec4(amount, this.bridge.uniforms.high.mul(0.24), 0, 1);
      })(),
    });

    this.membrane = new THREE.Mesh(geometry, material);
    this.membrane.frustumCulled = false;
    this.membrane.renderOrder = 10;
    this.scene.add(this.membrane);
    this.disposables.push(geometry, material);
  }

  createStructuralLines() {
    this.springVisualizer = new SpringVisualizer(this.physics);
    const { material, object } = this.springVisualizer;
    material.color = new THREE.Color(0xa8f5ee);
    material.transparent = true;
    material.opacity = this.quality < 1 ? 0.026 : 0.034;
    material.blending = THREE.NormalBlending;
    material.depthWrite = false;
    material.mrtNode = mrt({
      bloomIntensity: vec4(float(0.006).add(this.bridge.uniforms.high.mul(0.025)), 0, 0, 1),
    });
    object.renderOrder = 11;
    this.scene.add(object);
  }

  createAnchorArchitecture() {
    this.anchorRings = [];
    const anchorMaterial = new THREE.MeshBasicMaterial({
      color: 0xc7ff6a,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    [-2.75, 2.75].forEach((y, index) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(5.06, 0.026, 7, 192), anchorMaterial.clone());
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      ring.renderOrder = 13;
      this.anchorRings.push(ring);
      this.scene.add(ring);
      this.disposables.push(ring.geometry, ring.material);

      const ghost = new THREE.Mesh(new THREE.TorusGeometry(4.78, 0.012, 5, 160), anchorMaterial.clone());
      ghost.material.color.set(index === 0 ? 0x736dff : 0x6ef5ff);
      ghost.material.opacity = 0.23;
      ghost.rotation.x = Math.PI / 2;
      ghost.position.y = y * 0.965;
      this.anchorRings.push(ghost);
      this.scene.add(ghost);
      this.disposables.push(ghost.geometry, ghost.material);
    });

    this.resonator = new THREE.Group();
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0d2529,
      emissive: 0x245e62,
      emissiveIntensity: 0.7,
      roughness: 0.18,
      metalness: 0.65,
      transparent: true,
      opacity: 0.72,
      wireframe: true,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.48, 2), coreMaterial);
    this.resonator.add(core);
    this.disposables.push(core.geometry, core.material);
    this.resonatorRings = [];
    for (let index = 0; index < 4; index += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.68 + index * 0.2, 0.008 + index * 0.0015, 5, 128),
        new THREE.MeshBasicMaterial({
          color: index % 2 ? 0x8b78ff : 0x76efff,
          transparent: true,
          opacity: 0.26 - index * 0.03,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      ring.rotation.set(index * 0.43, index * 0.72, index * 0.27);
      this.resonatorRings.push(ring);
      this.resonator.add(ring);
      this.disposables.push(ring.geometry, ring.material);
    }
    this.scene.add(this.resonator);

    const nodeGeometry = new THREE.OctahedronGeometry(0.042, 0);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xd9ff9a });
    this.anchorNodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, this.topology.ribbonCount * 2);
    this.anchorNodes.frustumCulled = false;
    this.scene.add(this.anchorNodes);
    this.disposables.push(nodeGeometry, nodeMaterial);
  }

  createAtmosphere() {
    const count = Math.floor(950 * this.quality);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color(0x5cecff);
    const acid = new THREE.Color(0xc7ff4a);
    for (let index = 0; index < count; index += 1) {
      const radius = 7 + seeded(index + 11) * 25;
      const theta = seeded(index + 31) * TAU;
      const phi = Math.acos(seeded(index + 53) * 2 - 1);
      positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[index * 3 + 1] = Math.cos(phi) * radius * 0.7;
      positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius - 5;
      const color = index % 9 === 0 ? acid : cyan;
      colors.set([color.r, color.g, color.b], index * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      vertexColors: true,
      size: this.quality < 1 ? 0.035 : 0.045,
      transparent: true,
      opacity: 0.58,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.dust = new THREE.Points(geometry, material);
    this.scene.add(this.dust);
    this.disposables.push(geometry, material);
  }

  createImpactVfx() {
    this.impactPool = [];
    for (let index = 0; index < 4; index += 1) {
      const group = new THREE.Group();
      const rings = [];
      for (let ringIndex = 0; ringIndex < 3; ringIndex += 1) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(1, 0.006 + ringIndex * 0.002, 4, 120),
          new THREE.MeshBasicMaterial({
            color: ringIndex === 1 ? 0xc7ff5c : 0x68eaff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        ring.rotation.set(Math.PI / 2 + ringIndex * 0.36, ringIndex * 0.52, 0);
        rings.push(ring);
        group.add(ring);
        this.disposables.push(ring.geometry, ring.material);
      }
      group.visible = false;
      group.userData = { active: false, age: 0, strength: 0, rings };
      this.impactPool.push(group);
      this.scene.add(group);
    }
    this.impactCursor = 0;

    const sparkCount = Math.floor(72 * this.quality);
    const geometry = new THREE.TetrahedronGeometry(0.045, 0);
    const material = new THREE.MeshBasicMaterial({
      color: 0xd4ff78,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.sparkMesh = new THREE.InstancedMesh(geometry, material, sparkCount);
    this.sparkMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.sparkMesh.frustumCulled = false;
    this.sparks = Array.from({ length: sparkCount }, (_, index) => ({
      active: false,
      age: 0,
      life: 0.3,
      position: new THREE.Vector3(1000 + index, 0, 0),
      velocity: new THREE.Vector3(),
    }));
    this.sparks.forEach((spark, index) => {
      this.dummy.position.copy(spark.position);
      this.dummy.scale.setScalar(0);
      this.dummy.updateMatrix();
      this.sparkMesh.setMatrixAt(index, this.dummy.matrix);
    });
    this.sparkMesh.instanceMatrix.needsUpdate = true;
    this.scene.add(this.sparkMesh);
    this.disposables.push(geometry, material);
    this.sparkCursor = 0;
  }

  setupPostProcessing() {
    const scenePass = pass(this.scene, this.camera);
    scenePass.setMRT(mrt({ output, bloomIntensity: float(0) }));
    const colorPass = scenePass.getTextureNode();
    const bloomData = scenePass.getTextureNode("bloomIntensity");
    this.bloomPass = bloom(Fn(() => {
      const mask = bloomData.r;
      const charge = bloomData.g;
      const tint = vec3(float(1).sub(charge.mul(0.42)), float(1).sub(charge.mul(0.65)), 1);
      return vec4(colorPass.rgb.mul(mask).mul(tint), 1);
    })());
    this.bloomPass.threshold.value = 0.001;
    this.bloomPass.strength.value = this.quality < 1 ? 0.12 : 0.17;
    this.bloomPass.radius.value = 0.72;

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
    this.pointer.x = (clientX - rect.left) / rect.width * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height * 2 - 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    this.physics.setMouseRay(this.raycaster.ray.origin, this.raycaster.ray.direction);
  }

  setTension(value) {
    this.tension = Math.min(Math.max(Number(value), 0.35), 1);
    this.physics.uniforms.dampening.value = 0.955 + this.tension * 0.027;
  }

  pulse(strength = 1) {
    this.pulseEnergy = Math.max(this.pulseEnergy, this.reducedMotion ? strength * 0.38 : strength);
    this.lastPulseAt = this.clock.elapsedTime;
    const effect = this.impactPool[this.impactCursor % this.impactPool.length];
    this.impactCursor += 1;
    effect.visible = true;
    effect.userData.active = true;
    effect.userData.age = 0;
    effect.userData.strength = strength;
    this.spawnSparks(this.reducedMotion ? 4 : Math.round(14 * strength));
    this.onImpactChange(true);
  }

  spawnSparks(count) {
    for (let item = 0; item < count; item += 1) {
      const index = this.sparkCursor % this.sparks.length;
      this.sparkCursor += 1;
      const spark = this.sparks[index];
      const angle = seeded(this.sparkCursor * 3 + 2) * TAU;
      const y = (seeded(this.sparkCursor * 5 + 7) - 0.5) * 5.5;
      const radius = 2.4 + seeded(this.sparkCursor * 7 + 11) * 2.2;
      spark.active = true;
      spark.age = 0;
      spark.life = 0.24 + seeded(this.sparkCursor * 9 + 13) * 0.34;
      spark.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      spark.velocity.set(Math.cos(angle) * 1.3, (seeded(this.sparkCursor + 19) - 0.5) * 1.4, Math.sin(angle) * 1.3);
    }
  }

  updateArchitecture(elapsed, bands) {
    const ringScale = 0.985 + this.tension * 0.03 + bands.low * 0.065;
    this.anchorRings.forEach((ring, index) => {
      ring.scale.set(ringScale, ringScale, ringScale);
      ring.rotation.z = (index % 2 ? -1 : 1) * (bands.mid * 0.2 + elapsed * 0.018);
      ring.material.opacity = (index % 2 ? 0.21 : 0.42) + bands.high * 0.18;
    });
    this.resonator.rotation.y = elapsed * 0.055 + bands.mid * 0.32;
    this.resonator.rotation.x = Math.sin(elapsed * 0.27) * 0.09;
    const coreScale = 0.92 + bands.low * 0.13 + this.pulseEnergy * 0.09;
    this.resonator.scale.setScalar(coreScale);
    this.resonatorRings.forEach((ring, index) => {
      ring.rotation.z += 0.0015 * (index % 2 ? -1 : 1) * (1 + bands.mid * 4);
      ring.material.opacity = 0.16 + bands.high * 0.22 + this.pulseEnergy * 0.1;
    });

    const count = this.topology.ribbonCount;
    for (let ring = 0; ring < 2; ring += 1) {
      for (let index = 0; index < count; index += 1) {
        const angle = index / count * TAU + (ring ? bands.mid * -0.22 : bands.mid * 0.22);
        const radius = 5.05 * ringScale;
        this.dummy.position.set(Math.cos(angle) * radius, ring ? -2.75 : 2.75, Math.sin(angle) * radius);
        this.dummy.rotation.set(angle, angle, angle * 0.5);
        this.dummy.scale.setScalar(0.85 + bands.high * 0.8);
        this.dummy.updateMatrix();
        this.anchorNodes.setMatrixAt(ring * count + index, this.dummy.matrix);
      }
    }
    this.anchorNodes.instanceMatrix.needsUpdate = true;
    this.dust.rotation.y = elapsed * 0.006;
  }

  updateImpactVfx(delta) {
    let anyImpact = false;
    this.impactPool.forEach((effect) => {
      if (!effect.userData.active) return;
      anyImpact = true;
      effect.userData.age += delta;
      const progress = effect.userData.age / 1.65;
      if (progress >= 1) {
        effect.userData.active = false;
        effect.visible = false;
        return;
      }
      effect.userData.rings.forEach((ring, index) => {
        const delayed = Math.max(0, Math.min(1, progress * 1.25 - index * 0.075));
        const radius = 1.1 + delayed * (4.6 + index * 0.32);
        ring.scale.setScalar(radius);
        ring.material.opacity = Math.sin(delayed * Math.PI) * 0.17 * effect.userData.strength;
      });
    });

    this.sparks.forEach((spark, index) => {
      if (!spark.active) return;
      spark.age += delta;
      if (spark.age >= spark.life) {
        spark.active = false;
        this.dummy.position.set(1000 + index, 0, 0);
        this.dummy.scale.setScalar(0);
      } else {
        spark.position.addScaledVector(spark.velocity, delta);
        spark.velocity.multiplyScalar(0.975);
        const scale = Math.sin(spark.age / spark.life * Math.PI) * 1.4;
        this.dummy.position.copy(spark.position);
        this.dummy.rotation.set(spark.age * 4, spark.age * 7, spark.age * 3);
        this.dummy.scale.setScalar(scale);
      }
      this.dummy.updateMatrix();
      this.sparkMesh.setMatrixAt(index, this.dummy.matrix);
    });
    this.sparkMesh.instanceMatrix.needsUpdate = true;
    if (!anyImpact && this.pulseEnergy < 0.03) this.onImpactChange(false);
  }

  async update(elapsed, bands, playing) {
    const delta = Math.min(this.clock.getDelta(), 0.04);
    this.pulseEnergy *= this.reducedMotion ? 0.88 : 0.945;

    if (playing && bands.low > 0.48 && this.previousBands.low <= 0.48 && elapsed - this.lastPulseAt > 0.85) {
      this.pulse(0.66 + bands.low * 0.28);
    }
    if (playing && bands.high > 0.22 && this.previousBands.high <= 0.22 && elapsed - this.lastHighAt > 0.16) {
      this.spawnSparks(this.reducedMotion ? 3 : 8);
      this.lastHighAt = elapsed;
    }

    const autonomous = playing ? 0 : 1;
    const state = {
      elapsed,
      low: Math.min(1, bands.low + autonomous * (0.06 + Math.sin(elapsed * 0.7) * 0.025)),
      mid: Math.min(1, bands.mid + autonomous * 0.045),
      high: Math.min(1, bands.high + autonomous * 0.018),
      pulse: this.pulseEnergy,
      tension: this.tension,
    };
    this.bridge.setState(state);
    await this.physics.update(delta, elapsed);
    this.controls.update(delta);
    this.updateArchitecture(elapsed, state);
    this.updateImpactVfx(delta);
    this.previousBands = { ...bands };
    await this.postProcessing.renderAsync();
  }

  resetView() {
    this.camera.position.set(-1.1, 0.25, this.quality < 1 ? 17.6 : 14.2);
    this.controls.target.set(this.quality < 1 ? 0 : -0.8, 0, 0);
    this.controls.update();
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const nextQuality = width < 768 ? 0.68 : 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, nextQuality < 1 ? 0.82 : 0.72));
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  getStats() {
    return {
      vertices: this.physics.vertexCount,
      springs: this.physics.springCount,
      solverRate: this.quality < 1 ? 120 : 180,
      quality: this.quality,
      labels: {
        vertices: formatCount(this.physics.vertexCount),
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
