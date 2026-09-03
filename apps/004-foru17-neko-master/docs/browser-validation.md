# Browser validation — Neko Master Capability Lab

Revision 2 validated on 2026-09-03 14:04 +08:00 against the production-style static build.

## Canonical run

```powershell
cd E:\0902_codex_project\apps\004-foru17-neko-master
npm run build
npm run dev
```

- Route: `http://127.0.0.1:4176/`
- Title: `Neko Master · Capability Lab`
- Browser: Chromium driven through `agent-browser`, session `neko004`
- Upstream pin: `foru17/neko-master` v1.4.0, commit `6f72cfd0db69e2952713f24a648812407fef1e78`
- Build provenance: local fixed clone, 22 curated collector, Agent, web-analysis and settings evidence files

## Functional evidence

| Journey | Observation | Result |
| --- | --- | --- |
| Live / pause | While paused for 1.8 seconds, download total and event count remained stable; after resume, the download total advanced | pass |
| Full view discovery | Accessibility snapshot exposed nine named top-level tabs: Overview, Domains/IPs, Countries, Proxies, Devices, Rules, Health, Pipeline and Settings | pass |
| Global query | Switching the range to 7 days changed the synthetic download total to `218.93 GB`; manual refresh and five ranges remained available | pass |
| Domains / IPs | Six populated domain rows rendered; filtering `openai` reduced the result to one; switching to IP selected `104.18.33.45` while preserving the domain relation | pass |
| Countries | Three scenario regions rendered; traffic/connection sort changed active mode and the first connection count was observable | pass |
| Proxies | Four proxy paths rendered; selecting `JP Stream` exposed `Tokyo Stream 02` and its associated domain | pass |
| Devices / rules | Existing device drill-down and rule → policy → egress views remained available after navigation expansion | pass |
| Health | Healthy state showed 30 buckets and no down cells; simulated disconnect changed availability to `96.67%`, `2 / 3` healthy and five down cells | pass |
| Settings | Three backend cards plus storage retention, preferences, security and Agent panels opened; retention changed to 30 days and Agent command stayed redacted | pass |
| Counter reset | Paused reset produced `reset detected · delta +133 KB` and a `检测到连接计数器回退` event | pass |
| Offline / recovery | Health changed to `离线 · 正在重连`, preserved the history, exposed `恢复网关连接`, and returned to healthy | pass |
| Gateway source | Remote Neko Agent selection reported `健康 · 67 ms`; source variants are rendered from the selected gateway model | pass |
| Scenarios | Workday, media and anomaly samples switch titles, dimensions, regions and available proxy paths | pass |
| Keyboard tabs | `ArrowRight` moved Overview → Domains and focus followed; inside Settings it moved Backends → Storage | pass |
| Evidence artifact | `/upstream/UPSTREAM_VERSION.json` returned the exact pin and `fileCount: 22` | pass |

## Cross-surface evidence

| Surface | Evidence | Result |
| --- | --- | --- |
| Desktop | 1440×1000, expanded overview and Agent settings in dark; Domains/IP in both light and dark | pass |
| Tablet | 768×1024 country view; `scrollWidth === clientWidth`; analytic columns stacked | pass |
| Mobile | 390×844 settings/security in both themes; no document overflow; nine-view rail remained horizontally scrollable | pass |
| Sticky navigation | View activation scrolled the workspace to 92px on desktop and 126px on tablet/mobile, below the applicable sticky bars | pass |
| Reduced motion | `matchMedia('(prefers-reduced-motion: reduce)').matches === true`; active panel duration `1e-05s` | pass |
| Console | One intentional informational provenance line; no warnings or errors | pass |
| Page errors | Browser error log empty | pass |

Screenshots were captured under the ignored local directory `validation-artifacts/004-neko-master/` so generated QA evidence does not become product source.

## Engineering checks

```text
app npm run check  — pass: 9 views, 6 core controls, 22 upstream evidence files
app npm run build  — pass: production static dist created from the pinned local clone
root npm run check — pass: 6 catalog entries, strictly increasing IDs, README index synchronized
```

The root aggregate rebuild was also attempted. It could not reinstall/build unrelated project 001 or replace project 002's already-served output because active Windows processes held their Rollup binary/output directory open (`EPERM` / `EBUSY`). Those processes were deliberately left untouched. The already-assembled portal copy of demo 004 contains the same pinned `UPSTREAM_VERSION.json`; this deferral does not affect the app-level build or browser evidence above.
