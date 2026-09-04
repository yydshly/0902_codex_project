# Veil of Light asset provenance

| File | Representation | Provenance | Runtime use |
| --- | --- | --- | --- |
| `architectural-room-v2.png` | Generated 2D architectural photograph | OpenAI built-in ImageGen, 2026-09-04 | Full-bleed room and exterior foliage plate behind the live WebGPU curtains |
| `olive-shadow-gobo-v2.png` | Generated 2D photographic shadow texture | OpenAI built-in ImageGen, 2026-09-04 | Slowly translated light-and-shadow source composited into the live curtain material |
| `olive-canopy-right-v3.png` | Generated transparent 2D botanical photograph | OpenAI built-in ImageGen, 2026-09-04 | Upper-canopy depth layer with its own pivot, wind frequency and pointer impulse |
| `olive-sprig-left-v3.png` | Generated transparent 2D botanical photograph | OpenAI built-in ImageGen, 2026-09-04 | Lower-left depth layer with a separate pivot, amplitude and parallax response |

The room plate was generated as a straight-on, warm lime-plaster interior with a centered floor-to-ceiling window, natural foliage, pale oak and a low stone bench. It intentionally contains no curtains, people, text, logos or UI so the WebGPU foreground remains honest and interactive.

The shadow source was generated as analogue-looking olive foliage shadows on warm linen, with irregular penumbra and no visible branches or leaves. Runtime code only crops, translates and blends this authored image; it no longer draws branch cylinders, circle leaves or furniture primitives.

The two R29 foliage files were verified as RGBA PNGs. Runtime code only moves, rotates and scales these authored cut-outs as two independent depth planes; they are not represented as a reconstructed 3D tree. This keeps the visual asset honest while making wind and pointer response legible in real time.

The curtain normal and roughness maps remain the Poly Haven CC0 Terlenka scans documented in [`../clothesline/ASSET_SOURCES.md`](../clothesline/ASSET_SOURCES.md). The visible curtain mesh itself remains an Aurelia-solved topology rather than a raster animation.
