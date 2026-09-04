# Revision 2 — Genuine 3D capability world

## Design contract

- Entry mode: revision-led repair after browser evidence and direct user feedback.
- Request revision: replace the raster-backed imitation with an actual interactive 3D implementation related to Qiuner's architecture.
- Target user and context: a desktop visitor evaluating personal product and technical capabilities.
- Desired first impression: this is a navigable product world, not a poster.
- Visual ambition: Immersive.
- Experience architecture: Spatial Stage.
- Visual constraints: bright isometric laboratory, four distinct capability rooms, central hub, concise DOM labels, visible depth and lighting.
- Information constraints: the persistent scene owns geography and state; DOM owns readable labels, project facts, navigation, and accessibility.
- Operation constraints: mouse orbit, wheel zoom, hover feedback, room click selection, guided focus, reset camera, DOM keyboard navigation.
- State constraints: default, hovered room, selected room, focused camera, project-detail open, sample success, WebGL fallback.
- Environment constraints: desktop web only; React/Vite host; local static build; no backend.
- Primary journey: inspect the whole world → orbit or zoom → hover/click a real 3D room → camera focuses the room → open and run a project sample → return to the world.
- User-defined phase: correct the current implementation so the source repository's real 3D capability is represented.
- Required artifacts: live Three.js implementation, source mapping note, browser evidence, updated QA report, build/test result.
- Autonomy authorization: the user explicitly challenged the current implementation and asked for the source-related 3D direction; in-scope repair is authorized.
- User-decision boundary: real project URLs/models, backend persistence, deployment, and mobile are outside this repair.
- Observable completion criteria: the initial viewport contains a WebGL canvas; camera/geometry change under pointer input; raycasting selects a room; DOM detail follows the 3D selection; no raster scene image is used; fallback remains readable; console is clean; build/tests pass.

## Source evidence mapping

| Qiuner source capability | Evidence | 009 implementation target |
| --- | --- | --- |
| Shared renderer ownership | `src/runtime/renderer-host.ts` | One `WebGLRenderer` owned and disposed by `CapabilityWorld` |
| Ordered single frame loop | `src/runtime/frame-scheduler.ts` | One RAF loop updates camera, controls, room motion, then renders |
| Procedural room construction | `src/worlds/studio/scene/studio-room.ts` | Four modular rooms built from Three.js geometry/materials/lights |
| Raycast intent routing | `src/worlds/archipelago/scene/world/world-controls.ts` | Pointer NDC + `Raycaster` resolves `spaceId` and calls DOM state |
| Guided camera focus | studio `select()` / `update()` and `WorldCameraRig` | Damped target/camera movement when a room is selected |
| DOM/WebGL separation | README architecture and World overlays | Canvas carries space; React carries readable controls and details |

## Coverage manifest

| Requirement | Surface / state | Evidence needed | Stage | Status | Next action |
| --- | --- | --- | --- | --- | --- |
| Actual WebGL scene, no raster stage | Desktop default | Live canvas, renderer metrics, `qa/webgl-final-1280x720.png` | 1–2 | pass | Keep the canvas implementation as the visual source of truth |
| Orbit, zoom, reset | Canvas input | Pointer drag, wheel zoom, reset, camera-state witness | 4–5 | pass | None |
| Hover and click room selection | Four room meshes | Raycast state plus scene/DOM selection update | 5–6 | pass | None |
| Project sample journey | Detail panel/modal | Trigger, switch, run, success, Escape close | 5–6 | pass | None |
| Keyboard navigation | DOM controls | Tab focus path and visible focus treatment | 7 | pass | None |
| Reduced-motion runtime branch | Camera and ambient animation | Code witness is present; browser media emulation unavailable | 7–8 | defer | Re-test after the browser exposes `prefers-reduced-motion` emulation or the OS setting is enabled |
| WebGL fallback | `?fallback=1` fixture | Readable fallback plus working DOM selection | 8 | pass | None |
| Engineering closure | Production build | Build, package tests, clean final browser tab | 9 | pass | Track the lazy Three.js chunk as a future performance budget item |
| Updated evidence | Project docs | Final screenshots and rewritten QA report | 9 | pass | None |

## Selected pattern

- Pattern: story-driven 3D portfolio / spatial nodes + detail layers.
- Evidence branch: Qiuner shared Three.js runtime plus Studio/Archipelago world modules.
- Required inputs: existing capability/project data and selected bright laboratory art direction; both are available.
- Expected output: a desktop-only genuine 3D capability world with four proof-bearing nodes.
- Skill update: none; this task applies existing evidence rather than adding a reusable conclusion.

## Terminal audit

- The scene is rendered by one live `THREE.WebGLRenderer` and one animation loop.
- Four procedural room modules expose raycast hit surfaces and DOM-projected labels.
- Selection updates the room material, detail card, navigation state, and guided camera target.
- Renderer witness at 1280 × 720: initialization 156.9 ms, 205 draw calls, 109,516 triangles.
- The only deferred check is runtime emulation of `prefers-reduced-motion`; the code and CSS branches are implemented, but the active browser surface did not expose media emulation.

## Revision 3 — repository and public-Web handoff

- Route classification: product case + publication.
- Selected pattern: story-driven 3D portfolio with proof-bearing rooms.
- Evidence branch: pinned Qiuner architecture research plus this prototype's runtime evidence.
- Required inputs: existing research catalog, genuine Three.js implementation, production subpath, and rights boundary; all are available.
- Expected output: the 007 research page explains the source, links to this original product experiment, and deploys both through the existing GitHub Pages workflow.
- Content correction: project names and metrics now match the current repository; capability-room assignment remains explicitly labeled as a demonstration mapping.
- Production boundary: desktop WebGL is the primary experience; widths below 1100px receive a readable DOM explanation and do not initialize the 3D runtime.
- Deployment boundary: this source remains in `apps/009-ai-product-capability-lab/`, while 007's build collects its static client into `dist/product-lab/`. This avoids registering the same upstream repository twice.
- Publishing checks: relative asset URLs, canonical and social metadata, CSP, local OG cover, semantic fallback, clean browser console, root build, public URL, and GitHub Pages workflow.
- Skill update: none. The evidence is project-specific and is recorded here and in the 007 research README.
