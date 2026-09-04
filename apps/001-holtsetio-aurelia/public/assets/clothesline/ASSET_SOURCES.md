# Windline authored asset ledger

This scene uses authored and photographed assets for visible product quality. Procedural geometry is limited to physics proxies, infrastructure, and wind visualization.

## Authored garment

- Runtime file: `smithsonian-feedsack-dress.glb`
- Object: `Feedsack Dress`, National Museum of American History
- Official viewer: https://3d-api.si.edu/voyager/3d_package:cce6919a-24ef-4849-9575-8aec57264fac
- Official runtime file: https://3d-api.si.edu/content/document/3d_package:cce6919a-24ef-4849-9575-8aec57264fac/resources/1992_0102_04-100k-2048_std.glb
- Official file API: https://3d-api.si.edu/api-docs/
- License: CC0 / public domain under the Smithsonian Open Access program
- Format: self-contained glTF Binary with a 100K mesh and 2K texture set
- Runtime size: 4,702,560 bytes
- Scene role: visible hero garment; 56K+ authored vertices are bilinearly bound to the Aurelia spring surface so wind deforms the scan without discarding its folds and texture

## Scanned textile surfaces

### Denim Fabric 02

- Runtime files: `denim_diff_1k.jpg`, `denim_nor_gl_1k.jpg`, `denim_rough_1k.jpg`
- Source: https://polyhaven.com/a/denmin_fabric_02
- Author: Rob Tuytel / Poly Haven
- License: CC0 1.0
- Scene role: visible heavy textile swatch with color, OpenGL normal, and roughness maps

### Terlenka

- Runtime files: `terlenka_diff_1k.jpg`, `terlenka_nor_gl_1k.jpg`, `terlenka_rough_1k.jpg`
- Source: https://polyhaven.com/a/terlenka
- Authors: Rico Cilliers and Poly Haven processing contributors
- License: CC0 1.0
- Scene role: visible lightweight textile swatch with color, OpenGL normal, and roughness maps

## Quality gate

- No generated bitmap is used for the garment or fabric surface.
- All visible asset files are local and work offline after installation.
- Source and license are recorded before integration.
- 1K PBR maps are used in the live page to keep mobile GPU memory and transfer size bounded; higher-resolution masters remain available from Poly Haven.
