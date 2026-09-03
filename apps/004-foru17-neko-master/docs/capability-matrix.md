# Upstream-to-demo capability matrix

Baseline: `foru17/neko-master` v1.4.0 at `6f72cfd0db69e2952713f24a648812407fef1e78`.

The demo is a deterministic, synthetic product tour. “Covered” means the upstream capability has an inspectable explanation or interaction; it does not mean the real collector/database was executed.

| Upstream surface | Verified upstream basis | Demo surface | Coverage boundary |
| --- | --- | --- | --- |
| Overview | Summary cards, traffic trends, top domains/proxies/countries | Overview plus persistent live chart and delta feed | Synthetic totals and samples |
| Global query controls | Backend selector, time range, auto refresh, manual refresh | Gateway selector, five time ranges, live/pause, manual snapshot | No API requests |
| Domains | Domain chart/list and domain → proxy/IP details | Searchable domain table and selected target route | Synthetic destinations |
| Destination IPs | IP list and IP → proxy/domain details | Domain/IP dataset switch and selected target facts | Documentation ranges used for anomaly samples |
| Countries | World map, list, traffic/connection sorting | Region stage and sortable country ranking | Region and ASN values are illustrative |
| Proxies | Proxy totals, chain badges, associated domains/IPs | Selectable proxy paths, health/latency and domain ranking | Does not probe real nodes |
| Devices | Source-IP totals and associated domains/IPs | Device list and per-device domain drill-down | Four synthetic LAN clients |
| Rules | Rule totals and rule/domain/IP/proxy-chain details | Rule distribution and rule → policy → egress flow | Synthetic rule names |
| Backend health | Availability, latency, gaps and time buckets | Uptime cells, latency sparkline and backend state list | Health checks are simulated |
| Multi-backend | Direct Clash/Mihomo, Direct Surge and remote Agent | Three switchable gateway modes and backend cards | No credentials or network connection |
| Settings: backends | Add/edit/test, active display, listening state | Read-only backend management walkthrough | Writes intentionally disabled |
| Settings: database | DB size, retention and log cleanup | Storage breakdown, retention presets, ClickHouse migration path | No SQLite/ClickHouse process |
| Settings: preferences | Favicon provider and online/local GeoIP | Inspectable radio controls | Values remain browser-local |
| Settings: security | Shared-token access control and emergency recovery | Security boundary and token-rotation simulation | No secret is generated or stored |
| Agent deployment | Backend ID/token, install/add/run commands, heartbeat | Three-step flow and redacted command preview | Does not install or start Agent |
| Realtime correctness | Per-connection delta, `BatchBuffer`, `RealtimeStore`, WS | Pipeline view, reset recovery, batch and merge state | Semantics reproduced in browser memory |
| ClickHouse scaling | Optional dual write, compare, read routing and fallback | Database settings migration sequence | Architecture explanation only |
| PWA / i18n / update UX | Install prompt, zh/en messages, version check | Listed as product utilities in documentation | Not reimplemented in this static research tour |
| Network | Upstream navigation type exists but content says “coming soon” | Not presented as a shipped analytic capability | Deliberately excluded to avoid a false claim |

## Coverage result

- Nine top-level demo views cover the seven shipped upstream analysis surfaces, the data-correctness research surface, and the full settings/deployment surface.
- The build retains 22 pinned upstream evidence files spanning collector, Agent, web navigation, analysis components and settings.
- All displayed operational data remains visibly labeled as synthetic.
