# Lumen Cuttlefish asset provenance

## Runtime assets

| Asset | Source | Runtime role | License / boundary |
| --- | --- | --- | --- |
| `cuttlefish-skin-v1.png` | Generated for this project with OpenAI ImageGen on 2026-09-04 | Color-detail layer for the mantle/head node material | Project-generated visual asset; no third-party logo, animal silhouette, text or watermark was requested |
| Mantle, head, eyes, fins, siphon, arm crown | Original procedural Three.js geometry in this project | Deformable hero silhouette and anatomy | Project code; see repository license |
| Arms and tentacular clubs | Original GPU-buffer-driven geometry in `src/cuttlefish/tentacles.js` | Reads Aurelia-derived Verlet position storage | Project integration code; upstream Aurelia attribution remains in the main README |
| Paired sucker rows | Original merged procedural geometry in `src/cuttlefish/tentacles.js` | Reads the same GPU physics endpoints as each arm segment | Project integration code; not an imported scientific scan |

## Replaceable boundary

The generated texture is optional: the node material retains a procedural color fallback. No external cuttlefish GLB, anatomy scan or unverified marketplace model is shipped in R37. A future close-up asset may replace the mantle/head base topology only after license, UV, normals, deformation topology and browser budget have been verified; the current behavior state, GPU tentacle physics and interaction layer are designed to remain reusable.
