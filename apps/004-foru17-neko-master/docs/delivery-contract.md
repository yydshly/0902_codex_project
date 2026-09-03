# Neko Master Capability Lab — Delivery Contract

## Design contract

```text
Entry mode: Brief-led greenfield implementation inside the existing research portal
Request revision: 2 — expand the core-principle demo into a full product-capability showcase
Target user and context: Chinese-speaking readers evaluating an unfamiliar GitHub project from the 0902 research portal
Desired first impression: A complete network-observability product tour whose navigation exposes every shipped upstream analysis surface, while retaining the live correctness demo
Visual ambition: Functional with editorial hierarchy
Experience architecture: Editorial Flow
Visual constraints: Original implementation; dense but readable operations UI; cyan/green traffic semantics; no upstream screenshots or brand assets
Information constraints: Clearly separate verified upstream behavior, synthetic demo data, inferred value, and unsupported product claims
Operation constraints: Pure static site; no real gateway, backend, credentials, or network capture; keyboard-operable global controls, capability tabs, detail selectors and settings simulation
State constraints: Live/paused collection, healthy/offline backend, counter-reset recovery, selected capability view, selected domain/IP/device/proxy detail, time range, light/dark theme
Environment constraints: Must build through the repository's npm/static-dist contract and work under /0902_codex_project/demos/004-foru17-neko-master/
Primary journey: Select a gateway/time range → observe live traffic → traverse Overview, Domains/IPs, Countries, Proxies, Devices, Rules, Health and Pipeline → inspect full settings/deployment coverage → trigger reset/offline recovery
User-defined phases: Confirm whether the running local proxy is technically observable; expand the demonstration to full upstream capability coverage
Required artifacts: Updated runnable demo, upstream-to-demo capability matrix, local-proxy compatibility finding, pinned upstream evidence fetch, revised browser-validation record
Autonomy authorization: The user explicitly requested creation and implementation; reversible in-scope design and validation decisions are authorized
User-decision boundary: Real gateway integration, deployment credentials, backend services, or redistribution of the full upstream source require new scope
Observable completion criteria: Every shipped upstream navigation surface plus settings/deployment capabilities has an inspectable synthetic view; build/check pass; the expanded journey works in a real browser; desktop/tablet/mobile layouts remain usable; theme, keyboard, reduced-motion, offline and reset states are evidenced
Coverage record: Full manifest below
```

## Design direction

| Decision | Chosen direction | Observable constraint | Acceptance criterion |
| --- | --- | --- | --- |
| Composition | Compact command bar, metric overview, main analytic canvas, explanatory pipeline | Primary status and live/pause control remain visible without scrolling on desktop | A first scan identifies gateway health, traffic totals and the live control |
| Hierarchy | Live traffic is primary; dimensions and implementation explanation are secondary | No decorative element competes with current traffic state | The live chart and status are the strongest first-view elements |
| Typography | System sans for interface; tabular monospace for counters and event rows | Numeric columns do not jitter as values update | Live counters remain aligned and readable |
| Palette | Semantic cyan download, violet upload, green healthy, amber recovery, red offline | State is never communicated by color alone | Every state includes text/icon or structural cues |
| Material | Fine borders, low-contrast grid, restrained shadows | Dense panels remain visually separable in both themes | Cards and controls retain readable boundaries |
| Motion | Short metric/chart transitions; optional live pulses | `prefers-reduced-motion` disables nonessential animation while preserving current values | All information remains available with motion disabled |
| Responsive | Desktop two-column analytics; tablet stacked; mobile compact cards and horizontal nav | No horizontal page overflow at 390px | Primary journey remains reachable at 1440, 768 and 390px |

## Coverage manifest

| User phase | Requirement or artifact | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Create | Research and app structure | Filesystem | Required files and catalog entry | 0/9 | pass | App, research notes and catalog entry 004 exist |
| Obtain | Pinned upstream evidence | Build | Commit verified and curated files fetched | 1/9 | pass | v1.4.0 / `6f72cfd0`; 12 evidence files built from local clone |
| Demonstrate | Runnable capability console | Desktop, live, dark | Browser screenshot and interaction | 1-6 | pass | Canonical route returned a complete document with the live console |
| Demonstrate | Capability views | Overview, devices, rules, pipeline | Browser interaction observations | 4-6 | pass | All four tabs and device drill-down exercised |
| Demonstrate | Recovery states | Paused, reset, offline/recovered | Browser state transitions | 6 | pass | Pause stability, reset recovery and offline/reconnect states observed |
| Demonstrate | Theme coverage | Light and dark | Browser screenshots | 7 | pass | Both theme renderings inspected |
| Demonstrate | Responsive coverage | 1440px, 768px, 390px | Browser screenshots/DOM overflow check | 7 | pass | No document-level horizontal overflow at tested widths |
| Demonstrate | Keyboard/accessibility | Tabs and command controls | Reproduced focus journey and semantic inspection | 7 | pass | ArrowLeft moved Pipeline → Rules; roles/names present in accessibility snapshot |
| Demonstrate | Reduced motion | OS/browser preference | Browser or computed-style evidence | 8 | pass | Emulated preference matched; panel duration reduced to `1e-05s` |
| Deliver | Engineering checks | App and root repository | App check/build and root check/build output | 9 | defer | App check/build and root check pass; root aggregate rebuild is deferred because active unrelated 001/002 processes lock their existing artifacts |
| Deliver | Handoff record | Documentation | Browser-validation document with no unresolved continue rows | 9 | pass | `browser-validation.md` records route, states and evidence |

## Revision 2 coverage — full capability showcase

| User phase | Requirement or artifact | Surface / state | Evidence needed | Owning stage | Status | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| Confirm local observability | Inspect the running proxy without changing it | Windows host / Clash Verge Rev | Process, listener and non-secret configuration observations | 0 | pass | Mihomo + TUN confirmed; external controller disabled and 9097 unavailable |
| Full showcase | Make the complete product surface discoverable | Desktop navigation | Accessibility snapshot and full-view count | 3-4 | pass | Nine named views and five global query controls observed |
| Full showcase | Demonstrate domains and destination IP analytics | Domains / populated / filtered | Browser drill-down and filter result | 5-6 | pass | Six rows → one filtered result; IP/domain relation preserved |
| Full showcase | Demonstrate country and region analytics | Countries / populated | Browser sort/state observation | 5-6 | pass | Region list and traffic/connection sort exercised |
| Full showcase | Demonstrate proxy-chain analytics | Proxies / selected chain | Browser drill-down observation | 5-6 | pass | Four paths rendered; JP Stream drill-down exposed its node and domain |
| Full showcase | Preserve device and rule analytics | Devices and rules | Browser drill-down observations | 5-6 | pass | Existing device and rule interactions remained functional |
| Full showcase | Demonstrate backend health history | Health / healthy and degraded | Browser state observation | 5-6 | pass | Healthy and simulated-offline uptime, node count and gap states observed |
| Full showcase | Expose settings and deployment capabilities | Settings / Direct / Agent / storage / security | Browser settings interactions | 5-6 | pass | Three backends and five settings categories exercised without writes |
| Full showcase | Preserve correctness explanation | Pipeline / reset / offline | Browser state transitions | 6 | pass | Reset detection and offline/history/recovery behavior rechecked |
| Full showcase | Preserve theme and responsive coverage | Representative light/dark across 1440, 768 and 390px | Screenshots and DOM overflow checks | 7 | pass | Expanded domains/settings/country surfaces inspected; no document overflow |
| Full showcase | Preserve keyboard and reduced-motion support | Capability tabs and global controls | Keyboard path and computed-style evidence | 7-8 | pass | Both tab systems move focus; reduced animation duration is `1e-05s` |
| Deliver revision 2 | Update documentation and capability matrix | Research/app docs | Required files and accurate boundary statements | 9 | pass | Capability matrix, local compatibility and revised browser record exist |
| Deliver revision 2 | Engineering checks | App and portal | App check/build; root check; production-copy hash | 9 | pass | 9/6/22 app check, root catalog check and four production hashes passed |

## Revision 2 refinement ledger

```text
Current stage: 3 — information and layout calibration
User phase: Full showcase
Coverage item: Make the complete product surface discoverable
User goal: The demonstration should present the full product rather than only four selected concepts
Browser environment: Chromium, http://127.0.0.1:4176/, 1440×1000, dark theme, 2026-09-03 +08:00
Observed evidence: The existing rail exposes only Overview, Devices, Rules and Pipeline; upstream exposes Overview, Rules, Domains, Countries, Proxies, Devices and Health plus settings
Problem category: Information coverage and navigation
Root cause: Revision 1 optimized for the data-correctness story rather than complete product discovery
Minimal intervention: Expand the existing rail/workspace into eight analysis views plus a settings surface; retain the current visual system and deterministic simulation
Adjacent regression surfaces: Initial hierarchy, live controls, mobile horizontal nav, tab keyboard behavior, light/dark themes, reset/offline states
Observed result: Nine-view navigation, full settings surface and auto-scroll below sticky bars passed at 1440, 768 and 390px
Decision: pass
Next executable action: None; revision 2 scoped delivery is closed
New authority required: None for synthetic read-only demonstration; real gateway credentials/configuration remain outside this revision
```
