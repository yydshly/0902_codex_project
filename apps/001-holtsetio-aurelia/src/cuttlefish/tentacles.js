import * as THREE from "three/webgpu";
import {
  Fn,
  If,
  attribute,
  cos,
  float,
  instanceIndex,
  instancedArray,
  mix,
  mrt,
  sin,
  uniform,
  vec3,
  vec4,
} from "three/tsl";

class TentacleDriver {
  constructor(physics, baseArray, phaseArray, roleArray, vertexCount) {
    this.physics = physics;
    this.vertexCount = vertexCount;
    this.baseArray = baseArray;
    this.phaseArray = phaseArray;
    this.roleArray = roleArray;
    this.uniforms = {
      time: uniform(0),
      signal: uniform(0),
      ink: uniform(0),
      poke: uniform(0),
      audio: uniform(0),
      motion: uniform(1),
      thrust: uniform(0),
      turn: uniform(0),
      structure: uniform(0),
      deploy: uniform(0),
    };
  }

  async bake() {
    this.baseData = instancedArray(this.baseArray, "vec4");
    this.phaseData = instancedArray(this.phaseArray, "float");
    this.roleData = instancedArray(this.roleArray, "float");
    const physics = this.physics;
    const uniforms = this.uniforms;

    this.forceKernel = Fn(() => {
      const id = instanceIndex;
      const position = physics.positionData.element(id).toVar();
      const phase = this.phaseData.element(id);
      const role = this.roleData.element(id);
      const force = physics.forceData.element(id).toVar();
      const wave = sin(uniforms.time.mul(2.15).add(phase).add(position.y.mul(2.8)));
      const crossWave = cos(uniforms.time.mul(1.63).add(phase.mul(1.7)).sub(position.y.mul(2.1)));
      const amplitude = float(0.0000032)
        .add(uniforms.signal.mul(0.000006))
        .add(uniforms.ink.mul(0.000014))
        .add(uniforms.poke.mul(0.000019))
        .add(uniforms.audio.mul(0.000004))
        .add(uniforms.thrust.mul(0.000004))
        .mul(uniforms.motion);

      If(position.w.greaterThan(0.5), () => {
        const outward = sin(phase.mul(2.7)).mul(uniforms.ink.add(uniforms.poke.mul(1.4))).mul(0.000014);
        const turnDrag = sin(phase.mul(1.8)).mul(uniforms.turn).mul(0.000006);
        const strikeExtension = role.mul(uniforms.deploy).mul(0.00011);
        force.addAssign(vec3(
          wave.mul(amplitude).add(outward).add(turnDrag)
            .add(sin(phase.mul(1.2)).mul(strikeExtension).mul(0.35)),
          uniforms.ink.mul(-0.000012)
            .sub(uniforms.signal.mul(0.000002))
            .sub(uniforms.poke.mul(0.000018))
            .sub(uniforms.thrust.mul(0.000016))
            .sub(strikeExtension),
          crossWave.mul(amplitude).add(cos(phase).mul(strikeExtension).mul(0.18)),
        ));
        physics.forceData.element(id).assign(force);
      }).Else(() => {
        const base = this.baseData.element(id);
        const anchorPulse = sin(uniforms.time.mul(1.6).add(phase)).mul(0.055).mul(uniforms.motion);
        position.xyz.assign(base.xyz.add(vec3(
          sin(uniforms.time.mul(0.92).add(phase)).mul(0.038).mul(uniforms.motion),
          anchorPulse,
          cos(uniforms.time.mul(1.08).add(phase)).mul(0.032).mul(uniforms.motion),
        )));
        physics.positionData.element(id).assign(position);
      });
    })().compute(this.vertexCount);
  }

  setState({ signal = 0, ink = 0, poke = 0, audio = 0, motion = 1, thrust = 0, turn = 0, deploy = 0 } = {}) {
    this.uniforms.signal.value = signal;
    this.uniforms.ink.value = ink;
    this.uniforms.poke.value = poke;
    this.uniforms.audio.value = audio;
    this.uniforms.motion.value = motion;
    this.uniforms.thrust.value = thrust;
    this.uniforms.turn.value = turn;
    this.uniforms.deploy.value = deploy;
  }

  async update(_delta, elapsed) {
    this.uniforms.time.value = elapsed;
    await this.physics.renderer.computeAsync(this.forceKernel);
  }
}

function buildTentacleMaterial(physics, uniforms, variant = "arm") {
  const material = new THREE.MeshBasicNodeMaterial({
    transparent: true,
    opacity: variant === "sucker" ? 0.22 : 0.84,
    depthWrite: variant !== "sucker",
    side: THREE.DoubleSide,
  });
  const strandT = attribute("strandT");
  const strandPhase = attribute("strandPhase");

  material.positionNode = Fn(() => {
    const vertexIds = attribute("vertexIds");
    const angle = attribute("tubeAngle");
    const width = attribute("tubeWidth");
    const p0 = physics.positionData.element(vertexIds.x).xyz.toVar();
    const p1 = physics.positionData.element(vertexIds.y).xyz.toVar();
    const tangent = p1.sub(p0);
    const reference = vec3(1, 0, 0);
    const bitangent = tangent.cross(reference).normalize();
    const bitangent2 = tangent.cross(bitangent).normalize();
    const normal = sin(angle).mul(bitangent).add(cos(angle).mul(bitangent2)).normalize().toVar();
    const center = variant === "sucker"
      ? mix(p0, p1, attribute("segmentBlend"))
      : p0.add(p1).mul(0.5);
    return center.add(normal.mul(width));
  })();

  const glow = Fn(() => {
    return sin(uniforms.time.mul(2.6).sub(strandT.mul(18)).add(strandPhase))
      .mul(0.5)
      .add(0.5)
      .pow(8)
      .mul(uniforms.signal.mul(1.25).add(uniforms.audio.mul(0.55)).add(0.015));
  });
  material.colorNode = Fn(() => {
    const base = variant === "sucker"
      ? mix(vec3(0.58, 0.46, 0.39), vec3(0.25, 0.16, 0.17), strandT)
      : mix(vec3(0.075, 0.13, 0.115), vec3(0.018, 0.05, 0.06), strandT);
    return mix(base, vec3(0.94, 0.22, 0.11), glow().clamp(0, 1));
  })();
  material.opacityNode = Fn(() => {
    const baseOpacity = variant === "sucker" ? float(0.025) : float(0.74);
    return baseOpacity
      .add(strandT.oneMinus().mul(variant === "sucker" ? 0.01 : 0.1))
      .add(glow().mul(variant === "sucker" ? 0.035 : 0.14))
      .add(variant === "sucker" ? uniforms.structure.mul(0.46) : float(0));
  })();
  material.mrtNode = mrt({
    bloomIntensity: Fn(() => vec4(glow().mul(0.52).add(0.002), uniforms.signal, 0, 1))(),
  });
  return material;
}

export class CuttlefishTentacles {
  constructor(physics, { quality = 1, reducedMotion = false } = {}) {
    this.physics = physics;
    this.quality = quality;
    this.reducedMotion = reducedMotion;
    this.chains = [];
    this.base = [];
    this.phases = [];
    this.roles = [];
    this.createPhysics();
    this.driver = new TentacleDriver(
      physics,
      new Float32Array(this.base),
      new Float32Array(this.phases),
      new Float32Array(this.roles),
      physics.vertices.length,
    );
    physics.addObject(this.driver);
  }

  registerMeta(vertex, position, phase, fixed, role = 0) {
    this.base[vertex.id * 4] = position.x;
    this.base[vertex.id * 4 + 1] = position.y;
    this.base[vertex.id * 4 + 2] = position.z;
    this.base[vertex.id * 4 + 3] = fixed ? 1 : 0;
    this.phases[vertex.id] = phase;
    this.roles[vertex.id] = role;
  }

  createPhysics() {
    const armCount = 10;
    for (let arm = 0; arm < armCount; arm += 1) {
      const isFeeder = arm === 2 || arm === armCount - 3;
      const segmentCount = isFeeder ? (this.quality < 1 ? 24 : 28) : (this.quality < 1 ? 15 : 18);
      const segmentLength = isFeeder ? 0.105 : 0.058;
      const angle = arm / armCount * Math.PI * 2 + 0.18;
      const root = new THREE.Vector3(Math.cos(angle) * 0.28, -1.86, Math.sin(angle) * 0.14 + 0.18);
      const chain = [];
      for (let index = 0; index < segmentCount; index += 1) {
        const t = index / Math.max(segmentCount - 1, 1);
        const position = root.clone();
        const feederSide = arm === 2 ? 1 : -1;
        if (isFeeder) {
          const foldedWave = Math.sin(t * Math.PI * 2.2);
          position.x += feederSide * (0.035 + foldedWave * 0.055 * (1 - t * 0.45));
          position.y -= t * 0.5;
          position.z += -0.1 + Math.cos(t * Math.PI * 2) * 0.035 + feederSide * 0.018;
        } else {
          position.x += Math.cos(angle) * t * 0.46 + Math.sin(index * 0.46 + arm) * t * 0.052;
          position.y -= index * segmentLength;
          position.y += Math.sin(t * Math.PI) * (0.09 + (arm % 3) * 0.018);
          position.z += Math.sin(angle) * t * 0.24 + Math.cos(index * 0.38 + arm) * t * 0.04;
        }
        const fixed = index === 0;
        const vertex = this.physics.addVertex(position, fixed);
        this.registerMeta(vertex, position, arm * 0.79 + t * 2.4, fixed, isFeeder ? 1 : 0);
        chain.push(vertex);
        if (index > 0) this.physics.addSpring(chain[index - 1], vertex, isFeeder ? 0.0024 : 0.007, 1);
        if (index > 1) this.physics.addSpring(chain[index - 2], vertex, 0.0026, 1);
        if (index > 3 && index % 3 === 0) this.physics.addSpring(chain[index - 3], vertex, 0.0012, 0.98);
      }
      this.chains.push({ vertices: chain, arm, isFeeder, phase: arm * 0.79 });
    }
  }

  createMesh() {
    const positions = [];
    const vertexIds = [];
    const angles = [];
    const widths = [];
    const strandTs = [];
    const strandPhases = [];
    const uvs = [];
    const indices = [];
    let cursor = 0;
    const radialSegments = this.quality < 1 ? 5 : 7;

    const addVertex = (v0, v1, angle, width, t, phase, u) => {
      positions.push(0, 0, 0);
      vertexIds.push(v0.id, v1.id);
      angles.push(angle);
      widths.push(width);
      strandTs.push(t);
      strandPhases.push(phase);
      uvs.push(u, t);
      return cursor++;
    };

    this.chains.forEach(({ vertices, isFeeder, phase }) => {
      const rows = [];
      for (let segment = 1; segment < vertices.length; segment += 1) {
        const t = segment / (vertices.length - 1);
        const clubEnvelope = isFeeder ? Math.exp(-(((t - 0.79) / 0.145) ** 2)) : 0;
        const width = (isFeeder ? 0.052 : 0.072) * Math.sqrt(Math.max(0.012, 1 - t))
          + clubEnvelope * 0.075;
        const row = [];
        for (let radial = 0; radial <= radialSegments; radial += 1) {
          const wrapped = radial % radialSegments;
          row.push(addVertex(
            vertices[segment - 1],
            vertices[segment],
            wrapped / radialSegments * Math.PI * 2,
            width,
            t,
            phase,
            wrapped / radialSegments,
          ));
        }
        rows.push(row);
      }
      for (let row = 1; row < rows.length; row += 1) {
        for (let radial = 0; radial < radialSegments; radial += 1) {
          const a = rows[row - 1][radial];
          const b = rows[row - 1][radial + 1];
          const c = rows[row][radial];
          const d = rows[row][radial + 1];
          indices.push(c, b, a, b, c, d);
        }
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    // The normal is replaced by the TSL material, but WebGPU still validates that
    // a normal attribute exists before the custom normalNode runs.
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(new Float32Array(positions.length), 3));
    geometry.setAttribute("vertexIds", new THREE.Uint32BufferAttribute(vertexIds, 2));
    geometry.setAttribute("tubeAngle", new THREE.Float32BufferAttribute(angles, 1));
    geometry.setAttribute("tubeWidth", new THREE.Float32BufferAttribute(widths, 1));
    geometry.setAttribute("strandT", new THREE.Float32BufferAttribute(strandTs, 1));
    geometry.setAttribute("strandPhase", new THREE.Float32BufferAttribute(strandPhases, 1));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    this.material = buildTentacleMaterial(this.physics, this.driver.uniforms);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 12;
    this.suckerMesh = this.createSuckerMesh();
    this.group = new THREE.Group();
    this.group.name = "gpu-tentacles-and-suckers";
    this.group.add(this.mesh, this.suckerMesh);
    return this.group;
  }

  createSuckerMesh() {
    const positions = [];
    const vertexIds = [];
    const mountAngles = [];
    const ringAngles = [];
    const ringRadii = [];
    const tubeWidths = [];
    const suckerTs = [];
    const suckerPhases = [];
    const segmentBlends = [];
    const indices = [];
    const radialSegments = this.quality < 1 ? 6 : 8;
    let cursor = 0;
    let suckerCount = 0;

    const addSucker = (v0, v1, t, phase, mountAngle, size, width) => {
      const rings = [
        { radius: size * 0.4, depth: size * 0.05 },
        { radius: size, depth: size * 0.72 },
        { radius: size * 0.43, depth: size * 0.43 },
      ];
      const ringRows = [];
      rings.forEach((ring) => {
        const row = [];
        for (let radial = 0; radial < radialSegments; radial += 1) {
          const ringAngle = radial / radialSegments * Math.PI * 2;
          positions.push(0, 0, 0);
          vertexIds.push(v0.id, v1.id);
          mountAngles.push(mountAngle);
          ringAngles.push(ringAngle);
          ringRadii.push(ring.radius);
          tubeWidths.push(width * 0.86 + ring.depth);
          suckerTs.push(t);
          suckerPhases.push(phase);
          segmentBlends.push(THREE.MathUtils.clamp(0.5 + Math.cos(ringAngle) * ring.radius / 0.12, 0.14, 0.86));
          row.push(cursor++);
        }
        ringRows.push(row);
      });
      for (let ring = 1; ring < ringRows.length; ring += 1) {
        for (let radial = 0; radial < radialSegments; radial += 1) {
          const next = (radial + 1) % radialSegments;
          const a = ringRows[ring - 1][radial];
          const b = ringRows[ring - 1][next];
          const c = ringRows[ring][radial];
          const d = ringRows[ring][next];
          indices.push(a, b, c, b, d, c);
        }
      }
      suckerCount += 1;
    };

    this.chains.forEach(({ vertices, isFeeder, phase }) => {
      for (let segment = 2; segment < vertices.length - 1; segment += 1) {
        const t = segment / (vertices.length - 1);
        const clubEnvelope = isFeeder ? Math.exp(-(((t - 0.79) / 0.145) ** 2)) : 0;
        const onClub = isFeeder && t > 0.54 && t < 0.96;
        const onArm = !isFeeder && t > 0.14 && t < 0.9 && segment % 2 === 1;
        const densityStep = this.quality < 1 ? 2 : 1;
        if ((!onClub || segment % densityStep !== 0) && !onArm) continue;
        const width = (isFeeder ? 0.052 : 0.072) * Math.sqrt(Math.max(0.012, 1 - t))
          + clubEnvelope * 0.075;
        const size = isFeeder
          ? 0.014 + clubEnvelope * (this.quality < 1 ? 0.01 : 0.013)
          : 0.009 + (1 - t) * 0.002;
        [-0.48, 0.48].forEach((rowAngle) => {
          addSucker(
            vertices[segment - 1],
            vertices[segment],
            t,
            phase + rowAngle * 0.32,
            rowAngle,
            size,
            width,
          );
        });
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(new Float32Array(positions.length), 3));
    geometry.setAttribute("vertexIds", new THREE.Uint32BufferAttribute(vertexIds, 2));
    geometry.setAttribute("tubeWidth", new THREE.Float32BufferAttribute(tubeWidths, 1));
    geometry.setAttribute("segmentBlend", new THREE.Float32BufferAttribute(segmentBlends, 1));
    geometry.setAttribute("tubeAngle", new THREE.Float32BufferAttribute(
      mountAngles.map((angle, index) => angle + Math.sin(ringAngles[index]) * ringRadii[index] * 12),
      1,
    ));
    geometry.setAttribute("strandT", new THREE.Float32BufferAttribute(suckerTs, 1));
    geometry.setAttribute("strandPhase", new THREE.Float32BufferAttribute(suckerPhases, 1));
    geometry.setIndex(indices);

    this.suckerCount = suckerCount;
    this.suckerMaterial = buildTentacleMaterial(this.physics, this.driver.uniforms, "sucker");
    const mesh = new THREE.Mesh(geometry, this.suckerMaterial);
    mesh.name = "gpu-sucker-rows";
    mesh.frustumCulled = false;
    mesh.renderOrder = 14;
    return mesh;
  }

  setState(state) {
    this.driver.setState(state);
  }

  setStructure(visible) {
    this.driver.uniforms.structure.value = visible ? 1 : 0;
  }

  getMetrics() {
    const armTriangles = this.mesh?.geometry?.index?.count ? this.mesh.geometry.index.count / 3 : 0;
    const suckerTriangles = this.suckerMesh?.geometry?.index?.count ? this.suckerMesh.geometry.index.count / 3 : 0;
    return {
      vertices: this.physics.vertexCount ?? this.physics.vertices.length,
      springs: this.physics.springCount ?? this.physics.springs.length,
      triangles: armTriangles + suckerTriangles,
      suckers: this.suckerCount ?? 0,
      appendages: this.chains.length,
    };
  }
}
