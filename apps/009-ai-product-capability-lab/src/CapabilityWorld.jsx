import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { ArrowsClockwise, CursorClick } from "@phosphor-icons/react";

const ROOM_LAYOUT = {
  vision: { position: new THREE.Vector3(-5.1, 0, -4.3), anchorY: 3.4 },
  data: { position: new THREE.Vector3(4.6, 0, -4.9), anchorY: 3.7 },
  research: { position: new THREE.Vector3(-5.2, 0, 4.7), anchorY: 3.1 },
  agent: { position: new THREE.Vector3(5.0, 0, 4.25), anchorY: 3.35 },
};

const HOME_CAMERA = new THREE.Vector3(15.4, 14.2, 18.2);
const HOME_TARGET = new THREE.Vector3(0, 0.55, 0);

function createLabScene(scene, hitTargets, roomRecords, tracked) {
  const geometry = (value) => {
    tracked.geometries.add(value);
    return value;
  };
  const material = (value) => {
    tracked.materials.add(value);
    return value;
  };

  const white = material(new THREE.MeshStandardMaterial({ color: 0xe9edf2, roughness: 0.72, metalness: 0.04 }));
  const pale = material(new THREE.MeshStandardMaterial({ color: 0xcfd6df, roughness: 0.58, metalness: 0.11 }));
  const graphite = material(new THREE.MeshStandardMaterial({ color: 0x111821, roughness: 0.52, metalness: 0.22 }));
  const dark = material(new THREE.MeshStandardMaterial({ color: 0x070b11, roughness: 0.42, metalness: 0.34 }));
  const wood = material(new THREE.MeshStandardMaterial({ color: 0x8f6543, roughness: 0.76, metalness: 0.02 }));
  const paper = material(new THREE.MeshStandardMaterial({ color: 0xf8f2e8, roughness: 0.9 }));
  const glass = material(new THREE.MeshPhysicalMaterial({
    color: 0xcbe4ff,
    transparent: true,
    opacity: 0.22,
    roughness: 0.08,
    metalness: 0.04,
    transmission: 0.3,
    depthWrite: false,
  }));

  function box(parent, size, position, mat, radius = 0.04) {
    const mesh = new THREE.Mesh(geometry(new RoundedBoxGeometry(size[0], size[1], size[2], 3, radius)), mat);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function screen(parent, size, position, color, rotationY = 0) {
    const frame = box(parent, [size[0] + 0.14, size[1] + 0.14, 0.12], position, graphite, 0.05);
    frame.rotation.y = rotationY;
    const screenMat = material(new THREE.MeshStandardMaterial({
      color: 0x061120,
      emissive: color,
      emissiveIntensity: 0.72,
      roughness: 0.25,
      metalness: 0.16,
    }));
    const panel = box(parent, [size[0], size[1], 0.03], [position[0], position[1], position[2] + 0.078], screenMat, 0.02);
    panel.rotation.y = rotationY;
    return panel;
  }

  function createRoom(id, accent, floorColor) {
    const group = new THREE.Group();
    group.position.copy(ROOM_LAYOUT[id].position);
    scene.add(group);

    const accentColor = new THREE.Color(accent);
    const floorMaterial = material(new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: id === "data" ? 0.42 : 0.78,
      metalness: id === "data" ? 0.22 : 0.03,
      emissive: accentColor,
      emissiveIntensity: 0.025,
    }));
    const floor = box(group, [6.3, 0.34, 5.45], [0, 0.18, 0], floorMaterial, 0.14);
    floor.userData.spaceId = id;
    hitTargets.push(floor);

    const outlineMaterial = material(new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.74 }));
    const outline = new THREE.LineSegments(
      geometry(new THREE.EdgesGeometry(geometry(new RoundedBoxGeometry(6.34, 0.39, 5.49, 3, 0.14)))),
      outlineMaterial,
    );
    outline.position.y = 0.2;
    group.add(outline);

    const ringMaterial = material(new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.52 }));
    const ring = new THREE.Mesh(geometry(new THREE.TorusGeometry(0.48, 0.035, 8, 64)), ringMaterial);
    ring.position.set(0, 0.46, 0);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    roomRecords.set(id, { group, floorMaterial, outlineMaterial, ring, ringMaterial, accentColor });
    return group;
  }

  const ground = new THREE.Mesh(
    geometry(new THREE.PlaneGeometry(34, 28)),
    material(new THREE.MeshStandardMaterial({ color: 0xcbd2d9, roughness: 0.96, metalness: 0.01 })),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(32, 32, 0xa9b8c7, 0xbcc6d0);
  grid.position.y = 0.012;
  grid.material.transparent = true;
  grid.material.opacity = 0.28;
  tracked.materials.add(grid.material);
  scene.add(grid);

  const backdrop = box(scene, [31, 5.6, 0.45], [0, 2.55, -10.8], white, 0.08);
  backdrop.castShadow = false;
  box(scene, [0.45, 5.6, 24], [-14.9, 2.55, 0], white, 0.08).castShadow = false;

  const hubMaterial = material(new THREE.MeshStandardMaterial({ color: 0xeef2f6, roughness: 0.46, metalness: 0.23 }));
  const hub = new THREE.Mesh(geometry(new THREE.CylinderGeometry(2.7, 2.9, 0.32, 64)), hubMaterial);
  hub.position.y = 0.2;
  hub.receiveShadow = true;
  scene.add(hub);
  const hubRingMaterial = material(new THREE.MeshStandardMaterial({ color: 0x75879a, emissive: 0x2b7fff, emissiveIntensity: 0.18, metalness: 0.62, roughness: 0.3 }));
  const hubRing = new THREE.Mesh(geometry(new THREE.TorusGeometry(2.75, 0.13, 16, 96)), hubRingMaterial);
  hubRing.rotation.x = Math.PI / 2;
  hubRing.position.y = 0.39;
  scene.add(hubRing);
  const compass = new THREE.Group();
  compass.position.y = 0.43;
  for (let i = 0; i < 3; i += 1) {
    const loop = new THREE.Mesh(
      geometry(new THREE.TorusGeometry(0.62 + i * 0.34, 0.017, 5, 72)),
      material(new THREE.MeshBasicMaterial({ color: i === 1 ? 0x1677ff : 0x7f91a5, transparent: true, opacity: 0.55 })),
    );
    loop.rotation.x = Math.PI / 2;
    compass.add(loop);
  }
  scene.add(compass);

  const pathMaterial = material(new THREE.LineBasicMaterial({ color: 0x4a8ff0, transparent: true, opacity: 0.3 }));
  Object.values(ROOM_LAYOUT).forEach(({ position }) => {
    const points = [new THREE.Vector3(0, 0.43, 0), new THREE.Vector3(position.x * 0.48, 0.43, position.z * 0.48), new THREE.Vector3(position.x, 0.43, position.z)];
    const line = new THREE.Line(geometry(new THREE.BufferGeometry().setFromPoints(points)), pathMaterial);
    scene.add(line);
  });

  const vision = createRoom("vision", 0x58b7ff, 0xe5eef7);
  box(vision, [6.15, 2.7, 0.12], [0, 1.62, -2.58], glass, 0.02);
  box(vision, [0.12, 2.7, 5.15], [-3.08, 1.62, 0], glass, 0.02);
  box(vision, [3.0, 0.12, 1.65], [0.35, 1.1, -0.15], white, 0.04);
  box(vision, [0.16, 1.05, 0.16], [-0.8, 0.62, -0.6], pale, 0.03);
  box(vision, [0.16, 1.05, 0.16], [1.5, 0.62, -0.6], pale, 0.03);
  const visionCoreMat = material(new THREE.MeshStandardMaterial({ color: 0xcceaff, emissive: 0x258cff, emissiveIntensity: 1.8, roughness: 0.22 }));
  for (let i = 0; i < 6; i += 1) {
    const node = new THREE.Mesh(geometry(new THREE.OctahedronGeometry(0.11, 0)), visionCoreMat);
    node.position.set(-1.8 + (i % 3) * 0.7, 1.0 + Math.floor(i / 3) * 0.6, -2.42);
    vision.add(node);
  }

  const data = createRoom("data", 0x1677ff, 0x121821);
  box(data, [6.15, 3.25, 0.18], [0, 1.88, -2.59], dark, 0.02);
  box(data, [0.18, 3.25, 5.15], [3.08, 1.88, 0], graphite, 0.02);
  box(data, [4.2, 0.18, 1.05], [-0.2, 0.95, -0.7], graphite, 0.04);
  box(data, [0.16, 0.82, 0.16], [-1.6, 0.56, -0.7], graphite, 0.03);
  box(data, [0.16, 0.82, 0.16], [1.2, 0.56, -0.7], graphite, 0.03);
  screen(data, [1.55, 0.9], [-1.75, 2.28, -2.47], 0x1b72d1);
  screen(data, [1.55, 0.9], [0, 2.28, -2.47], 0x174e94);
  screen(data, [1.55, 0.9], [1.75, 2.28, -2.47], 0x1b72d1);
  screen(data, [0.68, 0.46], [-0.8, 1.45, -0.93], 0x1d7cff);
  screen(data, [0.68, 0.46], [0.05, 1.45, -0.93], 0x175bb0);

  const research = createRoom("research", 0xc28b51, 0xe4ddd2);
  box(research, [6.15, 2.85, 0.15], [0, 1.72, -2.58], paper, 0.03);
  box(research, [0.15, 2.85, 5.15], [-3.08, 1.72, 0], paper, 0.03);
  box(research, [3.8, 0.18, 1.42], [0.25, 1.05, 0.15], wood, 0.05);
  [-1.05, 0.15, 1.35].forEach((x) => box(research, [0.2, 0.92, 0.2], [x, 0.57, -0.26], wood, 0.03));
  [-1.18, -0.15, 0.88, 1.91].forEach((x, index) => {
    box(research, [0.66, 0.45, 0.6], [x, 0.5, 1.12], wood, 0.04);
    const sheet = box(research, [0.52, 0.025, 0.38], [x + 0.04, 1.16, 0.06 + (index % 2) * 0.18], paper, 0.01);
    sheet.rotation.y = (index - 1.5) * 0.06;
  });
  for (let y = 0; y < 4; y += 1) {
    box(research, [0.9, 0.1, 0.36], [-2.36, 0.58 + y * 0.48, -1.72], wood, 0.02);
  }

  const agent = createRoom("agent", 0x096fff, 0xe5eaf0);
  box(agent, [6.15, 3.1, 0.16], [0, 1.8, -2.59], white, 0.03);
  box(agent, [0.16, 3.1, 5.15], [3.08, 1.8, 0], white, 0.03);
  box(agent, [3.7, 0.16, 1.25], [0.15, 1.0, 0.45], white, 0.05);
  box(agent, [0.18, 0.86, 0.18], [-1.15, 0.55, 0.45], pale, 0.03);
  box(agent, [0.18, 0.86, 0.18], [1.45, 0.55, 0.45], pale, 0.03);
  screen(agent, [0.72, 0.48], [-0.75, 1.48, 0.02], 0x1779ff);
  screen(agent, [0.72, 0.48], [0.15, 1.48, 0.02], 0x1463c7);
  screen(agent, [0.72, 0.48], [1.05, 1.48, 0.02], 0x1779ff);
  const serverMat = material(new THREE.MeshStandardMaterial({ color: 0x071426, emissive: 0x0066ff, emissiveIntensity: 0.38, roughness: 0.32, metalness: 0.42 }));
  const server = box(agent, [1.35, 2.15, 1.15], [-1.85, 1.46, -1.55], serverMat, 0.08);
  const serverEdges = new THREE.LineSegments(geometry(new THREE.EdgesGeometry(server.geometry)), material(new THREE.LineBasicMaterial({ color: 0x2387ff, transparent: true, opacity: 0.85 })));
  server.add(serverEdges);
  for (let i = 0; i < 3; i += 1) {
    const node = new THREE.Mesh(geometry(new THREE.BoxGeometry(0.18, 0.18, 0.18)), visionCoreMat);
    node.position.set(-1.85 + (i % 2) * 0.45, 1.1 + i * 0.42, -0.92);
    agent.add(node);
  }

  const ambient = new THREE.HemisphereLight(0xf2f7ff, 0x7f8b98, 1.7);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xffffff, 3.1);
  sun.position.set(-6, 16, 11);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -17;
  sun.shadow.camera.right = 17;
  sun.shadow.camera.top = 15;
  sun.shadow.camera.bottom = -15;
  sun.shadow.bias = -0.0002;
  scene.add(sun);
  const blueFill = new THREE.PointLight(0x5db5ff, 18, 18, 2);
  blueFill.position.set(-6, 5, -3);
  scene.add(blueFill);
  const warmFill = new THREE.PointLight(0xffc47a, 13, 16, 2);
  warmFill.position.set(-6, 4.2, 5.5);
  scene.add(warmFill);

  return { compass, hubRing };
}

export function CapabilityWorld({ spaces, activeId, onSelect, resetToken, onReady, onError }) {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const labelRefs = useRef(new Map());
  const activeRef = useRef(activeId);
  const onSelectRef = useRef(onSelect);
  const apiRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => { activeRef.current = activeId; apiRef.current?.focus(activeId); }, [activeId]);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { if (resetToken > 0) apiRef.current?.reset(); }, [resetToken]);

  useEffect(() => {
    const mount = mountRef.current;
    const canvas = canvasRef.current;
    if (!mount || !canvas) return undefined;

    if (new URLSearchParams(window.location.search).has("fallback")) {
      canvas.hidden = true;
      setFailed(true);
      onError?.(new Error("测试模式：WebGL 增强层已关闭"));
      return undefined;
    }

    let renderer;
    const initStartedAt = performance.now();
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    } catch (error) {
      setFailed(true);
      onError?.(error);
      return undefined;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd9dfe5);
    scene.fog = new THREE.Fog(0xd9dfe5, 22, 43);
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 80);
    camera.position.copy(HOME_CAMERA);

    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(HOME_TARGET);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = 12;
    controls.maxDistance = 28;
    controls.minPolarAngle = 0.52;
    controls.maxPolarAngle = 1.08;
    controls.minAzimuthAngle = -0.35;
    controls.maxAzimuthAngle = 1.55;

    const hitTargets = [];
    const roomRecords = new Map();
    const tracked = { geometries: new Set(), materials: new Set() };
    const animated = createLabScene(scene, hitTargets, roomRecords, tracked);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(3, 3);
    const projected = new THREE.Vector3();
    const desiredTarget = HOME_TARGET.clone();
    const desiredPosition = HOME_CAMERA.clone();
    const timer = new THREE.Timer();
    timer.connect(document);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hovered = null;
    let focusActive = false;
    let raf = 0;
    let lastDomUpdate = 0;
    let pointerDown = null;
    let dragged = false;

    const resize = () => {
      const width = Math.max(1, mount.clientWidth);
      const height = Math.max(1, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 1200 ? 1.35 : 1.7));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const updatePointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    };

    const resolveHit = () => {
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(hitTargets, false)[0]?.object.userData.spaceId ?? null;
    };

    const onPointerMove = (event) => {
      if (pointerDown && Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y) > 6) dragged = true;
      updatePointer(event);
      const next = resolveHit();
      if (next === hovered) return;
      hovered = next;
      setHoveredId(next);
      canvas.style.cursor = next ? "pointer" : "grab";
    };

    const onClick = (event) => {
      if (dragged) {
        dragged = false;
        return;
      }
      updatePointer(event);
      const id = resolveHit();
      if (!id) return;
      onSelectRef.current?.(id);
      apiRef.current?.focus(id);
    };

    const onPointerDown = (event) => {
      pointerDown = { x: event.clientX, y: event.clientY };
      dragged = false;
    };

    const onPointerUp = () => {
      pointerDown = null;
    };

    const cancelFocus = () => { focusActive = false; };
    controls.addEventListener("start", cancelFocus);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("click", onClick);

    const focus = (id) => {
      const layout = ROOM_LAYOUT[id];
      if (!layout) return;
      desiredTarget.copy(layout.position).setY(0.7);
      const viewOffset = HOME_CAMERA.clone().normalize().multiplyScalar(15.8);
      desiredPosition.copy(desiredTarget).add(viewOffset);
      focusActive = true;
    };

    const reset = () => {
      desiredTarget.copy(HOME_TARGET);
      desiredPosition.copy(HOME_CAMERA);
      focusActive = true;
    };

    apiRef.current = { focus, reset };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const updateLabels = (now) => {
      if (now - lastDomUpdate < 32) return;
      lastDomUpdate = now;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      Object.entries(ROOM_LAYOUT).forEach(([id, layout]) => {
        const element = labelRefs.current.get(id);
        if (!element) return;
        projected.copy(layout.position).setY(layout.anchorY).project(camera);
        const projectedX = (projected.x * 0.5 + 0.5) * width;
        const projectedY = (-projected.y * 0.5 + 0.5) * height;
        const x = THREE.MathUtils.clamp(projectedX, 92, width - 330);
        const y = THREE.MathUtils.clamp(projectedY, 112, height - 48);
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.opacity = projected.z > 1 ? "0" : "1";
      });
      canvas.dataset.camera = camera.position.toArray().map((value) => value.toFixed(2)).join(",");
      canvas.dataset.target = controls.target.toArray().map((value) => value.toFixed(2)).join(",");
      canvas.dataset.activeSpace = activeRef.current;
      canvas.dataset.hoveredSpace = hovered ?? "none";
      canvas.dataset.drawCalls = String(renderer.info.render.calls);
      canvas.dataset.triangles = String(renderer.info.render.triangles);
    };

    const tick = (now) => {
      timer.update(now);
      const elapsed = timer.getElapsed();
      if (focusActive) {
        const damping = reducedMotion ? 1 : 0.065;
        controls.target.lerp(desiredTarget, damping);
        camera.position.lerp(desiredPosition, damping);
        if (camera.position.distanceTo(desiredPosition) < 0.025 && controls.target.distanceTo(desiredTarget) < 0.01) {
          focusActive = false;
        }
      }
      controls.update();
      animated.compass.rotation.y = reducedMotion ? 0 : elapsed * 0.16;
      animated.hubRing.rotation.z = reducedMotion ? 0 : Math.sin(elapsed * 0.4) * 0.035;

      roomRecords.forEach((record, id) => {
        const active = activeRef.current === id;
        const hover = hovered === id;
        const wantedScale = active ? 1.025 : hover ? 1.012 : 1;
        const nextScale = reducedMotion ? wantedScale : THREE.MathUtils.lerp(record.group.scale.x, wantedScale, 0.1);
        record.group.scale.setScalar(nextScale);
        record.floorMaterial.emissiveIntensity = THREE.MathUtils.lerp(record.floorMaterial.emissiveIntensity, active ? 0.18 : hover ? 0.1 : 0.025, 0.12);
        record.outlineMaterial.opacity = THREE.MathUtils.lerp(record.outlineMaterial.opacity, active ? 1 : hover ? 0.84 : 0.48, 0.12);
        const pulse = reducedMotion ? 1 : 1 + Math.sin(elapsed * 2.2 + id.length) * 0.06;
        record.ring.scale.setScalar(active ? 1.28 * pulse : hover ? 1.1 : 0.88);
        record.ringMaterial.opacity = active ? 0.9 : hover ? 0.7 : 0.28;
      });

      updateLabels(now);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    setReady(true);
    canvas.dataset.initMs = (performance.now() - initStartedAt).toFixed(1);
    onReady?.({ renderer: "THREE.WebGLRenderer", objects: scene.children.length, rooms: roomRecords.size });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      controls.removeEventListener("start", cancelFocus);
      controls.dispose();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("click", onClick);
      tracked.geometries.forEach((item) => item.dispose());
      tracked.materials.forEach((item) => item.dispose());
      timer.dispose();
      renderer.dispose();
      apiRef.current = null;
    };
  }, [onError, onReady]);

  return (
    <div className="world-stage" ref={mountRef}>
      <canvas ref={canvasRef} className="world-canvas" data-webgl-ready={ready ? "true" : "false"} aria-label="可旋转和缩放的 3D 能力实验室" />
      <div className="world-vignette" aria-hidden="true" />
      {!failed && spaces.map((space) => {
        const Icon = space.icon;
        const selected = activeId === space.id;
        return (
          <button
            key={space.id}
            ref={(element) => element ? labelRefs.current.set(space.id, element) : labelRefs.current.delete(space.id)}
            data-space-label={space.id}
            className={selected ? "world-label world-label--active" : hoveredId === space.id ? "world-label world-label--hover" : "world-label"}
            style={{ "--accent": space.accent }}
            onClick={() => { onSelect(space.id); apiRef.current?.focus(space.id); }}
            aria-pressed={selected}
          >
            <span><Icon weight="duotone" /></span>
            <strong>{space.name}</strong>
            <small>{space.subtitle}</small>
          </button>
        );
      })}
      {!failed && <div className="engine-badge" data-testid="webgl-status">
        <i /> WEBGL {ready ? "ACTIVE" : "STARTING"}
      </div>}
      {!failed && <div className="canvas-hint"><CursorClick weight="duotone" /> 拖动环绕 · 滚轮缩放 · 点击房间</div>}
      {!failed && <button className="camera-reset" onClick={() => apiRef.current?.reset()}>
        <ArrowsClockwise weight="bold" /> 全景
      </button>}
    </div>
  );
}
