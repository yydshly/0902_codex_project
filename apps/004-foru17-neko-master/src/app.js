const UPSTREAM_COMMIT = "6f72cfd0db69e2952713f24a648812407fef1e78";

const gateways = {
  home: {
    label: "家庭 · OpenClash",
    kind: "Clash WebSocket",
    latency: 9,
    baseDownload: 8.42 * 1024 ** 3,
    baseUpload: 1.16 * 1024 ** 3,
    baseConnections: 18_204,
  },
  studio: {
    label: "工作室 · Surge",
    kind: "Surge · 2s polling",
    latency: 26,
    baseDownload: 3.78 * 1024 ** 3,
    baseUpload: 840 * 1024 ** 2,
    baseConnections: 9_406,
  },
  remote: {
    label: "异地 · Neko Agent",
    kind: "Agent · HTTP report",
    latency: 67,
    baseDownload: 21.34 * 1024 ** 3,
    baseUpload: 4.62 * 1024 ** 3,
    baseConnections: 41_772,
  },
};

const devices = [
  { id: "macbook", name: "MacBook Pro", ip: "192.168.50.12", icon: "MB", weight: 5 },
  { id: "phone", name: "Living Room Phone", ip: "192.168.50.28", icon: "PH", weight: 3 },
  { id: "tv", name: "Studio TV", ip: "192.168.50.43", icon: "TV", weight: 2 },
  { id: "nas", name: "Home NAS", ip: "192.168.50.8", icon: "NS", weight: 2 },
];

const scenarios = {
  work: {
    title: "工作日协作",
    regionShare: "62%",
    speed: 1,
    domains: [
      { name: "api.openai.com", rule: "AI", proxy: "SG Edge", region: "SG", down: 1.2, up: 0.75, base: 820 },
      { name: "github.com", rule: "Work", proxy: "SG Edge", region: "US", down: 1.8, up: 0.42, base: 690 },
      { name: "objects.githubusercontent.com", rule: "Work", proxy: "SG Edge", region: "US", down: 2.4, up: 0.16, base: 470 },
      { name: "figma.com", rule: "Work", proxy: "SG Edge", region: "US", down: 1.4, up: 0.55, base: 420 },
      { name: "notion.so", rule: "Work", proxy: "SG Edge", region: "US", down: 0.8, up: 0.28, base: 260 },
      { name: "updates.cdn-apple.com", rule: "Apple", proxy: "DIRECT", region: "CN", down: 2.9, up: 0.08, base: 210 },
    ],
  },
  media: {
    title: "影音夜间",
    regionShare: "78%",
    speed: 2.5,
    domains: [
      { name: "rr2---sn.googlevideo.com", rule: "YouTube", proxy: "JP Stream", region: "JP", down: 6.4, up: 0.05, base: 1640 },
      { name: "audio-4-fa.scdn.co", rule: "Spotify", proxy: "SG Edge", region: "SG", down: 3.6, up: 0.04, base: 880 },
      { name: "video-edge-3.icloud-content.com", rule: "Apple", proxy: "DIRECT", region: "CN", down: 4.8, up: 0.08, base: 760 },
      { name: "static.cloudflareinsights.com", rule: "Work", proxy: "SG Edge", region: "US", down: 0.7, up: 0.15, base: 210 },
      { name: "images.unsplash.com", rule: "Media", proxy: "US Transit", region: "US", down: 2.2, up: 0.03, base: 460 },
    ],
  },
  anomaly: {
    title: "异常流量突增",
    regionShare: "39%",
    speed: 5.2,
    domains: [
      { name: "telemetry-unknown.example", rule: "Match", proxy: "US Transit", region: "US", down: 7.6, up: 5.4, base: 2440 },
      { name: "pool.compute.example", rule: "Match", proxy: "SG Edge", region: "SG", down: 1.3, up: 6.8, base: 1720 },
      { name: "api.openai.com", rule: "AI", proxy: "SG Edge", region: "SG", down: 1.1, up: 0.62, base: 510 },
      { name: "github.com", rule: "Work", proxy: "SG Edge", region: "US", down: 1.5, up: 0.37, base: 430 },
      { name: "dns.google", rule: "DIRECT", proxy: "DIRECT", region: "US", down: 0.25, up: 0.2, base: 150 },
    ],
  },
};

const destinationMetadata = {
  "api.openai.com": { ip: "104.18.33.45", asn: "Cloudflare", city: "Singapore" },
  "github.com": { ip: "140.82.114.4", asn: "GitHub", city: "San Francisco" },
  "objects.githubusercontent.com": { ip: "185.199.109.133", asn: "Fastly", city: "San Francisco" },
  "figma.com": { ip: "18.239.36.42", asn: "Amazon", city: "Seattle" },
  "notion.so": { ip: "104.18.22.110", asn: "Cloudflare", city: "San Francisco" },
  "updates.cdn-apple.com": { ip: "17.253.85.201", asn: "Apple", city: "Shanghai" },
  "rr2---sn.googlevideo.com": { ip: "142.250.199.78", asn: "Google", city: "Tokyo" },
  "audio-4-fa.scdn.co": { ip: "35.186.224.24", asn: "Google Cloud", city: "Singapore" },
  "video-edge-3.icloud-content.com": { ip: "17.248.188.12", asn: "Apple", city: "Shanghai" },
  "static.cloudflareinsights.com": { ip: "104.16.124.96", asn: "Cloudflare", city: "San Francisco" },
  "images.unsplash.com": { ip: "151.101.1.181", asn: "Fastly", city: "San Francisco" },
  "telemetry-unknown.example": { ip: "198.51.100.47", asn: "Documentation ASN", city: "Unknown" },
  "pool.compute.example": { ip: "203.0.113.82", asn: "Documentation ASN", city: "Singapore" },
  "dns.google": { ip: "8.8.8.8", asn: "Google", city: "Mountain View" },
};

const countryMetadata = {
  SG: { name: "新加坡", flag: "SG", asn: "Cloudflare / Google", proxy: "SG Edge" },
  US: { name: "美国", flag: "US", asn: "Fastly / GitHub", proxy: "US Transit" },
  JP: { name: "日本", flag: "JP", asn: "Google Video", proxy: "JP Stream" },
  CN: { name: "中国", flag: "CN", asn: "Apple / Local", proxy: "DIRECT" },
};

const proxyDefinitions = [
  { name: "SG Edge", policy: "🚀 节点选择", node: "SG Edge 01", latency: 18, status: "healthy" },
  { name: "JP Stream", policy: "🎬 流媒体", node: "Tokyo Stream 02", latency: 42, status: "healthy" },
  { name: "US Transit", policy: "🌐 国际出口", node: "Los Angeles 03", latency: 138, status: "degraded" },
  { name: "DIRECT", policy: "🏠 本地直连", node: "Local Gateway", latency: 2, status: "healthy" },
];

const timeRangeFactors = { "30m": 1, "1h": 1.7, today: 5.8, "7d": 26, "30d": 94 };

const state = {
  gateway: "home",
  scenario: "work",
  live: true,
  offline: false,
  selectedView: "overview",
  selectedDevice: "macbook",
  selectedDomain: "api.openai.com",
  selectedProxy: "SG Edge",
  destinationDataset: "domains",
  destinationFilter: "",
  countrySort: "traffic",
  timeRange: "30m",
  settingsSection: "backends",
  totals: { download: 0, upload: 0, connections: 0 },
  currentDelta: { download: 0, upload: 0 },
  series: [],
  flows: new Map(),
  pendingKeys: new Set(),
  domains: new Map(),
  deviceTotals: new Map(),
  deviceDomains: new Map(),
  rules: new Map(),
  events: [],
  eventCount: 0,
  pipeline: { previous: 0, current: 0, delta: 0, reset: false },
  pipelinePhase: 0,
  lastFlush: Date.now(),
  lastUpdated: null,
  seed: 90417,
};

const elements = {
  gatewaySelect: document.querySelector("#gateway-select"),
  gatewayHealth: document.querySelector("#gateway-health"),
  toggleLive: document.querySelector("#toggle-live"),
  toggleTheme: document.querySelector("#toggle-theme"),
  toggleOffline: document.querySelector("#toggle-offline"),
  simulateReset: document.querySelector("#simulate-reset"),
  manualRefresh: document.querySelector("#manual-refresh"),
  timeRange: document.querySelector("#time-range"),
  scenarioTitle: document.querySelector("#scenario-title"),
  liveState: document.querySelector("#live-state"),
  metricDownload: document.querySelector("#metric-download"),
  metricUpload: document.querySelector("#metric-upload"),
  metricConnections: document.querySelector("#metric-connections"),
  metricActive: document.querySelector("#metric-active"),
  metricBuffer: document.querySelector("#metric-buffer"),
  deltaDownload: document.querySelector("#delta-download"),
  deltaUpload: document.querySelector("#delta-upload"),
  lastUpdated: document.querySelector("#last-updated"),
  downloadLine: document.querySelector("#download-line"),
  uploadLine: document.querySelector("#upload-line"),
  downloadArea: document.querySelector("#download-area"),
  uploadArea: document.querySelector("#upload-area"),
  eventList: document.querySelector("#event-list"),
  eventCount: document.querySelector("#event-count"),
  domainRanking: document.querySelector("#domain-ranking"),
  deviceRanking: document.querySelector("#device-ranking"),
  domainCount: document.querySelector("#domain-count"),
  deviceCount: document.querySelector("#device-count"),
  regionShare: document.querySelector("#region-share"),
  trafficFilter: document.querySelector("#traffic-filter"),
  trafficTable: document.querySelector("#traffic-table"),
  trafficTableLabel: document.querySelector("#traffic-table-label"),
  trafficResultCount: document.querySelector("#traffic-result-count"),
  targetName: document.querySelector("#target-name"),
  targetTotal: document.querySelector("#target-total"),
  targetAddress: document.querySelector("#target-address"),
  targetRegion: document.querySelector("#target-region"),
  targetDevice: document.querySelector("#target-device"),
  targetRule: document.querySelector("#target-rule"),
  targetProxy: document.querySelector("#target-proxy"),
  targetDown: document.querySelector("#target-down"),
  targetUp: document.querySelector("#target-up"),
  targetConnections: document.querySelector("#target-connections"),
  mapShare: document.querySelector("#map-share"),
  countryRanking: document.querySelector("#country-ranking"),
  proxySelector: document.querySelector("#proxy-selector"),
  selectedProxyName: document.querySelector("#selected-proxy-name"),
  selectedProxyStatus: document.querySelector("#selected-proxy-status"),
  proxyPolicy: document.querySelector("#proxy-policy"),
  proxyNode: document.querySelector("#proxy-node"),
  proxyDomainRanking: document.querySelector("#proxy-domain-ranking"),
  proxyTotal: document.querySelector("#proxy-total"),
  deviceSelector: document.querySelector("#device-selector"),
  selectedDeviceName: document.querySelector("#selected-device-name"),
  selectedDeviceIP: document.querySelector("#selected-device-ip"),
  selectedDeviceRule: document.querySelector("#selected-device-rule"),
  selectedDeviceShare: document.querySelector("#selected-device-share"),
  selectedDeviceTotal: document.querySelector("#selected-device-total"),
  deviceDomainRows: document.querySelector("#device-domain-rows"),
  ruleRanking: document.querySelector("#rule-ranking"),
  flowRuleTitle: document.querySelector("#flow-rule-title"),
  flowRuleNode: document.querySelector("#flow-rule-node"),
  flowRuleValue: document.querySelector("#flow-rule-value"),
  healthOverall: document.querySelector("#health-overall"),
  healthyCount: document.querySelector("#healthy-count"),
  healthLatency: document.querySelector("#health-latency"),
  healthGaps: document.querySelector("#health-gaps"),
  healthTimeline: document.querySelector("#health-timeline"),
  healthArea: document.querySelector("#health-area"),
  healthLine: document.querySelector("#health-line"),
  backendHealthList: document.querySelector("#backend-health-list"),
  pipeSnapshot: document.querySelector("#pipe-snapshot"),
  pipeDelta: document.querySelector("#pipe-delta"),
  pipeBuffer: document.querySelector("#pipe-buffer"),
  pipeStore: document.querySelector("#pipe-store"),
  pipeMerge: document.querySelector("#pipe-merge"),
  toast: document.querySelector("#toast"),
};

function random() {
  state.seed = (state.seed * 1_664_525 + 1_013_904_223) >>> 0;
  return state.seed / 4_294_967_296;
}

function formatBytes(value, compact = false) {
  const bytes = Math.max(0, value);
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(compact ? 1 : 2)} GB`;
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(compact ? 0 : 1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${Math.round(bytes)} B`;
}

function addToMap(map, key, value) {
  map.set(key, (map.get(key) || 0) + value);
}

function ensureDeviceDomainMap(deviceId) {
  if (!state.deviceDomains.has(deviceId)) state.deviceDomains.set(deviceId, new Map());
  return state.deviceDomains.get(deviceId);
}

function resetSimulation() {
  const gateway = gateways[state.gateway];
  const scenario = scenarios[state.scenario];
  const rangeFactor = timeRangeFactors[state.timeRange] || 1;
  state.totals = {
    download: gateway.baseDownload * rangeFactor,
    upload: gateway.baseUpload * rangeFactor,
    connections: Math.round(gateway.baseConnections * Math.sqrt(rangeFactor)),
  };
  state.currentDelta = { download: 0, upload: 0 };
  state.flows = new Map();
  state.pendingKeys = new Set();
  state.domains = new Map();
  state.deviceTotals = new Map();
  state.deviceDomains = new Map();
  state.rules = new Map();
  state.events = [];
  state.eventCount = 0;
  state.pipeline = { previous: 0, current: 0, delta: 0, reset: false };
  state.pipelinePhase = 0;
  state.lastFlush = Date.now();
  state.lastUpdated = null;
  state.seed = 90417 + Object.keys(gateways).indexOf(state.gateway) * 301 + Object.keys(scenarios).indexOf(state.scenario) * 701;
  if (!scenario.domains.some((domain) => domain.name === state.selectedDomain)) {
    state.selectedDomain = scenario.domains[0].name;
  }
  if (!scenario.domains.some((domain) => domain.proxy === state.selectedProxy)) {
    state.selectedProxy = scenario.domains[0].proxy;
  }

  const deviceBases = [0.46, 0.27, 0.18, 0.09];
  const domainTotalBase = scenario.domains.reduce((sum, item) => sum + item.base, 0) * 1024 ** 2 * rangeFactor;
  scenario.domains.forEach((item) => {
    const bytes = item.base * 1024 ** 2 * rangeFactor;
    state.domains.set(item.name, bytes);
    addToMap(state.rules, item.rule, bytes);
  });
  devices.forEach((device, index) => {
    const bytes = domainTotalBase * deviceBases[index];
    state.deviceTotals.set(device.id, bytes);
    const detail = ensureDeviceDomainMap(device.id);
    scenario.domains.slice(index % 2, index % 2 + 4).forEach((domain, domainIndex) => {
      detail.set(domain.name, bytes * [0.42, 0.28, 0.19, 0.11][domainIndex]);
    });
  });

  const shape = state.scenario === "media"
    ? [28, 31, 29, 34, 36, 42, 55, 64, 60, 72, 80, 76, 69, 84, 91, 83, 88, 96, 86, 75, 62, 58, 49, 44]
    : state.scenario === "anomaly"
      ? [17, 20, 16, 24, 19, 21, 23, 22, 28, 31, 29, 38, 34, 42, 36, 48, 93, 99, 82, 67, 54, 44, 37, 31]
      : [22, 28, 24, 32, 30, 36, 42, 39, 48, 45, 52, 58, 54, 63, 59, 66, 72, 69, 78, 73, 68, 61, 57, 64];
  state.series = shape.map((value, index) => ({
    download: value * scenario.speed * (0.9 + ((index * 13) % 9) / 50),
    upload: value * 0.2 * (0.7 + ((index * 7) % 8) / 20),
  }));

  for (let index = 0; index < 6; index += 1) generateTrafficUpdate();
  render();
}

function pickWeighted(items, weightKey = "weight") {
  const total = items.reduce((sum, item) => sum + (item[weightKey] || item.base || 1), 0);
  let cursor = random() * total;
  for (const item of items) {
    cursor -= item[weightKey] || item.base || 1;
    if (cursor <= 0) return item;
  }
  return items[items.length - 1];
}

function generateTrafficUpdate() {
  const scenario = scenarios[state.scenario];
  const domain = pickWeighted(scenario.domains, "base");
  const device = pickWeighted(devices);
  const flowKey = `${device.id}:${domain.name}`;
  const previousFlow = state.flows.get(flowKey) || {
    down: Math.floor((35 + random() * 420) * 1024),
    up: Math.floor((8 + random() * 70) * 1024),
    counted: false,
  };
  const downDelta = Math.floor((120 + random() * 740) * 1024 * domain.down * scenario.speed);
  const upDelta = Math.floor((34 + random() * 210) * 1024 * domain.up * Math.max(1, scenario.speed * 0.72));
  const currentFlow = {
    down: previousFlow.down + downDelta,
    up: previousFlow.up + upDelta,
    counted: true,
    domain,
    device,
  };
  state.flows.set(flowKey, currentFlow);

  state.totals.download += downDelta;
  state.totals.upload += upDelta;
  if (!previousFlow.counted) state.totals.connections += 1;
  state.currentDelta = { download: downDelta, upload: upDelta };
  state.pendingKeys.add(`${domain.name}:${device.ip}:${domain.rule}:${domain.proxy}`);
  addToMap(state.domains, domain.name, downDelta + upDelta);
  addToMap(state.deviceTotals, device.id, downDelta + upDelta);
  addToMap(state.rules, domain.rule, downDelta + upDelta);
  addToMap(ensureDeviceDomainMap(device.id), domain.name, downDelta + upDelta);

  state.pipeline = {
    previous: previousFlow.down,
    current: currentFlow.down,
    delta: downDelta,
    reset: false,
  };
  state.pipelinePhase = (state.pipelinePhase + 1) % 5;
  state.lastUpdated = new Date();
  state.eventCount += 1;
  state.events.unshift({
    kind: "traffic",
    device: device.name,
    ip: device.ip,
    domain: domain.name,
    rule: domain.rule,
    proxy: domain.proxy,
    download: downDelta,
    upload: upDelta,
  });
  state.events = state.events.slice(0, 6);

  state.series.push({
    download: downDelta / 1024 ** 2,
    upload: upDelta / 1024 ** 2,
  });
  state.series = state.series.slice(-24);

  if (Date.now() - state.lastFlush >= 30_000) {
    state.pendingKeys.clear();
    state.lastFlush = Date.now();
    state.events.unshift({ kind: "system", message: "BatchBuffer 已原子写入数据库", detail: "实时热增量已清理" });
    state.events = state.events.slice(0, 6);
  }
}

function simulateCounterReset() {
  if (state.offline) {
    showToast("网关处于离线状态；恢复后才能接收新的计数器快照。");
    return;
  }
  if (state.flows.size === 0) generateTrafficUpdate();
  const [flowKey, flow] = state.flows.entries().next().value;
  const resetCurrent = Math.floor((80 + random() * 140) * 1024);
  const resetUpload = Math.floor((12 + random() * 30) * 1024);
  const downDelta = resetCurrent;
  const upDelta = resetUpload;
  state.flows.set(flowKey, { ...flow, down: resetCurrent, up: resetUpload, counted: true });
  state.totals.download += downDelta;
  state.totals.upload += upDelta;
  state.totals.connections += 1;
  state.currentDelta = { download: downDelta, upload: upDelta };
  state.pendingKeys.add(`${flow.domain.name}:${flow.device.ip}:${flow.domain.rule}:${flow.domain.proxy}`);
  addToMap(state.domains, flow.domain.name, downDelta + upDelta);
  addToMap(state.deviceTotals, flow.device.id, downDelta + upDelta);
  addToMap(state.rules, flow.domain.rule, downDelta + upDelta);
  addToMap(ensureDeviceDomainMap(flow.device.id), flow.domain.name, downDelta + upDelta);
  state.pipeline = { previous: flow.down, current: resetCurrent, delta: resetCurrent, reset: true };
  state.pipelinePhase = 1;
  state.lastUpdated = new Date();
  state.eventCount += 1;
  state.events.unshift({
    kind: "system",
    message: "检测到连接计数器回退",
    detail: `${formatBytes(flow.down)} → ${formatBytes(resetCurrent)}，按新流量计入`,
  });
  state.events = state.events.slice(0, 6);
  state.series.push({ download: downDelta / 1024 ** 2, upload: upDelta / 1024 ** 2 });
  state.series = state.series.slice(-24);
  render();
  showToast("已模拟网关重启：算法将回退后的当前计数作为新流量，避免持续漏计。");
}

function setOffline(nextOffline) {
  state.offline = nextOffline;
  if (nextOffline) {
    state.currentDelta = { download: 0, upload: 0 };
    state.eventCount += 1;
    state.events.unshift({ kind: "error", message: "网关连接中断", detail: "界面保留历史基线，等待指数退避重连" });
    state.events = state.events.slice(0, 6);
    showToast("网关已断联：采集暂停，但历史数据仍然可查询。");
  } else {
    state.events.unshift({ kind: "system", message: "网关连接已恢复", detail: "重新建立水位并继续计算增量" });
    state.events = state.events.slice(0, 6);
    showToast("网关已恢复，实时采集继续。");
  }
  render();
}

function renderChart() {
  const values = state.series;
  const max = Math.max(1, ...values.flatMap((point) => [point.download, point.upload]));
  const left = 50;
  const right = 875;
  const top = 32;
  const bottom = 232;
  const width = right - left;
  const height = bottom - top;
  const toPath = (key) => values.map((point, index) => {
    const x = left + (index / Math.max(1, values.length - 1)) * width;
    const y = bottom - (point[key] / max) * height;
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const downloadPath = toPath("download");
  const uploadPath = toPath("upload");
  elements.downloadLine.setAttribute("d", downloadPath);
  elements.uploadLine.setAttribute("d", uploadPath);
  elements.downloadArea.setAttribute("d", `${downloadPath} L${right} ${bottom} L${left} ${bottom} Z`);
  elements.uploadArea.setAttribute("d", `${uploadPath} L${right} ${bottom} L${left} ${bottom} Z`);
}

function sortedEntries(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function renderRanking(container, entries, labels) {
  const top = entries.slice(0, 5);
  const max = top[0]?.[1] || 1;
  container.innerHTML = top.map(([key, value], index) => `
    <div class="ranking-row">
      <b>${String(index + 1).padStart(2, "0")}</b>
      <div class="ranking-copy"><strong>${labels?.[key] || key}</strong><i style="--rank-width:${Math.max(5, (value / max) * 100).toFixed(1)}%"></i></div>
      <div class="ranking-value"><strong>${formatBytes(value, true)}</strong><small>${((value / Math.max(1, entries.reduce((sum, item) => sum + item[1], 0))) * 100).toFixed(1)}%</small></div>
    </div>
  `).join("");
}

function renderEvents() {
  elements.eventList.innerHTML = state.events.map((event) => {
    if (event.kind === "system" || event.kind === "error") {
      return `<div class="event-row is-${event.kind}"><div class="event-target"><strong>${event.message}</strong><small>${event.detail}</small></div><div class="event-route"><strong>系统事件</strong><small>collector state</small></div><div class="event-delta"><strong>${event.kind === "error" ? "OFFLINE" : "RECOVER"}</strong><small>${event.kind === "error" ? "等待重连" : "已保护"}</small></div></div>`;
    }
    return `<div class="event-row"><div class="event-target"><strong>${event.domain}</strong><small>${event.device} · ${event.ip}</small></div><div class="event-route"><strong>${event.rule}</strong><small>→ ${event.proxy}</small></div><div class="event-delta"><strong>↓ ${formatBytes(event.download, true)}</strong><small>↑ ${formatBytes(event.upload, true)}</small></div></div>`;
  }).join("");
}

function getDestinationRows() {
  const scenario = scenarios[state.scenario];
  const rangeFactor = timeRangeFactors[state.timeRange] || 1;
  return sortedEntries(state.domains).map(([domainName, total]) => {
    const domain = scenario.domains.find((item) => item.name === domainName);
    const meta = destinationMetadata[domainName] || { ip: "203.0.113.1", asn: "Unknown ASN", city: "Unknown" };
    const ratio = domain.down / Math.max(0.01, domain.down + domain.up);
    return {
      domain,
      meta,
      key: state.destinationDataset === "domains" ? domainName : meta.ip,
      total,
      download: total * ratio,
      upload: total * (1 - ratio),
      connections: Math.max(1, Math.round((domain.base * rangeFactor) / 6 + state.eventCount / Math.max(1, scenario.domains.length))),
    };
  });
}

function renderDestinations() {
  const query = state.destinationFilter.trim().toLowerCase();
  const allRows = getDestinationRows();
  const rows = allRows.filter(({ domain, meta, key }) => [key, domain.name, meta.ip, meta.asn, domain.rule, domain.proxy, domain.region].some((value) => value.toLowerCase().includes(query)));
  if (!allRows.some((row) => row.domain.name === state.selectedDomain)) state.selectedDomain = allRows[0]?.domain.name;
  const selected = allRows.find((row) => row.domain.name === state.selectedDomain) || allRows[0];

  elements.trafficTableLabel.textContent = state.destinationDataset === "domains" ? "DOMAIN LIST" : "DESTINATION IP LIST";
  elements.trafficResultCount.textContent = `${rows.length} 项`;
  elements.trafficTable.innerHTML = rows.length > 0 ? rows.map((row) => `
    <button class="traffic-row${row.domain.name === state.selectedDomain ? " is-selected" : ""}" type="button" role="option" aria-selected="${row.domain.name === state.selectedDomain}" data-domain="${row.domain.name}">
      <span><strong>${row.key}</strong><small>${state.destinationDataset === "domains" ? `${row.meta.ip} · ${row.meta.asn}` : `${row.domain.name} · ${row.meta.asn}`}</small></span>
      <span><strong>${row.domain.rule}</strong><small>→ ${row.domain.proxy}</small></span>
      <span><strong>${row.connections.toLocaleString("zh-CN")}</strong><small>${row.domain.region}</small></span>
      <span><strong>${formatBytes(row.total, true)}</strong><small>↓ ${formatBytes(row.download, true)} · ↑ ${formatBytes(row.upload, true)}</small></span>
    </button>
  `).join("") : `<div class="empty-result"><strong>没有匹配的目的地</strong><small>尝试域名、IP、规则或代理名称。</small></div>`;

  if (!selected) return;
  const topDevice = devices.map((device) => ({ device, value: ensureDeviceDomainMap(device.id).get(selected.domain.name) || 0 })).sort((a, b) => b.value - a.value)[0]?.device || devices[0];
  elements.targetName.textContent = state.destinationDataset === "domains" ? selected.domain.name : selected.meta.ip;
  elements.targetTotal.textContent = formatBytes(selected.total, true);
  elements.targetAddress.textContent = state.destinationDataset === "domains" ? selected.meta.ip : selected.domain.name;
  elements.targetRegion.textContent = `${selected.domain.region} · ${selected.meta.city} · ${selected.meta.asn}`;
  elements.targetDevice.textContent = topDevice.name;
  elements.targetRule.textContent = selected.domain.rule;
  elements.targetProxy.textContent = selected.domain.proxy;
  elements.targetDown.textContent = formatBytes(selected.download, true);
  elements.targetUp.textContent = formatBytes(selected.upload, true);
  elements.targetConnections.textContent = selected.connections.toLocaleString("zh-CN");
}

function getCountryRows() {
  const aggregates = new Map();
  for (const [domainName, total] of state.domains.entries()) {
    const domain = scenarios[state.scenario].domains.find((item) => item.name === domainName);
    if (!domain) continue;
    const current = aggregates.get(domain.region) || { traffic: 0, connections: 0 };
    current.traffic += total;
    current.connections += Math.max(1, Math.round(domain.base / 4 + state.eventCount / 8));
    aggregates.set(domain.region, current);
  }
  return [...aggregates.entries()].map(([code, values]) => ({ code, ...values, ...countryMetadata[code] })).sort((a, b) => b[state.countrySort] - a[state.countrySort]);
}

function renderCountries() {
  const rows = getCountryRows();
  const max = rows[0]?.[state.countrySort] || 1;
  const total = rows.reduce((sum, row) => sum + row.traffic, 0);
  elements.mapShare.textContent = scenarios[state.scenario].regionShare;
  elements.countryRanking.innerHTML = rows.map((row, index) => `
    <div class="country-row"><b>${String(index + 1).padStart(2, "0")}</b><span class="country-code">${row.flag}</span><div><strong>${row.name}</strong><small>${row.asn} · ${row.proxy}</small><i style="--country-width:${Math.max(6, (row[state.countrySort] / max) * 100).toFixed(1)}%"></i></div><span><strong>${state.countrySort === "traffic" ? formatBytes(row.traffic, true) : row.connections.toLocaleString("zh-CN")}</strong><small>${((row.traffic / Math.max(1, total)) * 100).toFixed(1)}%</small></span></div>
  `).join("");
}

function getProxyRows() {
  return proxyDefinitions.map((proxy) => {
    const domains = getDestinationRows().filter((row) => row.domain.proxy === proxy.name);
    return { ...proxy, domains, total: domains.reduce((sum, row) => sum + row.total, 0) };
  }).sort((a, b) => b.total - a.total);
}

function renderProxies() {
  const rows = getProxyRows();
  if (!rows.some((proxy) => proxy.name === state.selectedProxy)) state.selectedProxy = rows[0]?.name;
  const selected = rows.find((proxy) => proxy.name === state.selectedProxy) || rows[0];
  const max = rows[0]?.total || 1;
  elements.proxySelector.innerHTML = rows.map((proxy) => `
    <button class="proxy-option${proxy.name === state.selectedProxy ? " is-selected" : ""}" type="button" role="option" aria-selected="${proxy.name === state.selectedProxy}" data-proxy="${proxy.name}"><span><i class="${proxy.status === "healthy" ? "healthy-dot" : "warn-dot"}"></i><strong>${proxy.name}</strong><small>${proxy.policy}</small></span><span><b>${formatBytes(proxy.total, true)}</b><small>${proxy.latency} ms</small></span><em style="--proxy-width:${Math.max(4, (proxy.total / max) * 100).toFixed(1)}%"></em></button>
  `).join("");
  if (!selected) return;
  elements.selectedProxyName.textContent = selected.name;
  elements.selectedProxyStatus.className = `status-badge ${selected.status === "healthy" ? "healthy" : "degraded"}`;
  elements.selectedProxyStatus.textContent = `${selected.status === "healthy" ? "健康" : "退化"} · ${selected.latency} ms`;
  elements.proxyPolicy.textContent = selected.policy;
  elements.proxyNode.textContent = selected.node;
  elements.proxyTotal.textContent = formatBytes(selected.total, true);
  const maxDomain = selected.domains[0]?.total || 1;
  elements.proxyDomainRanking.innerHTML = selected.domains.length ? selected.domains.slice(0, 5).map((row, index) => `<div><b>${String(index + 1).padStart(2, "0")}</b><span><strong>${row.domain.name}</strong><small>${row.meta.ip} · ${row.domain.rule}</small><i style="--proxy-domain-width:${Math.max(5, (row.total / maxDomain) * 100).toFixed(1)}%"></i></span><strong>${formatBytes(row.total, true)}</strong></div>`).join("") : `<div class="empty-result"><strong>当前样本没有经过该出口</strong><small>切换流量场景可观察其他路径。</small></div>`;
}

function renderHealth() {
  const gateway = gateways[state.gateway];
  const gapCount = state.offline ? 5 : 1;
  const uptime = state.offline ? "96.67%" : "99.94%";
  elements.healthOverall.className = `status-badge ${state.offline ? "degraded" : "healthy"}`;
  elements.healthOverall.textContent = `整体可用率 ${uptime}`;
  elements.healthyCount.textContent = state.offline ? "2 / 3" : "3 / 3";
  elements.healthLatency.textContent = `${gateway.latency + 25} ms`;
  elements.healthGaps.textContent = String(gapCount);
  elements.healthTimeline.innerHTML = Array.from({ length: 30 }, (_, index) => `<i class="${state.offline && index > 24 ? "is-down" : index === 17 ? "is-gap" : "is-up"}" title="${state.offline && index > 24 ? "离线" : index === 17 ? "无数据" : "在线"}"></i>`).join("");

  const latency = [18, 22, 25, 21, 28, 34, 29, 31, 44, 39, 32, 27, 30, 46, 37, 34, 28, 26, 31, 35, 29, 41, 38, 33, 27, 30, 36, 32, 29, gateway.latency + 25];
  const left = 10;
  const right = 890;
  const bottom = 165;
  const max = Math.max(...latency, 80);
  const path = latency.map((value, index) => `${index === 0 ? "M" : "L"}${(left + (index / (latency.length - 1)) * (right - left)).toFixed(1)} ${(bottom - (value / max) * 135).toFixed(1)}`).join(" ");
  elements.healthLine.setAttribute("d", path);
  elements.healthArea.setAttribute("d", `${path} L${right} ${bottom} L${left} ${bottom} Z`);
  elements.backendHealthList.innerHTML = Object.entries(gateways).map(([id, item]) => {
    const currentDown = state.offline && id === state.gateway;
    return `<div class="backend-health-row"><span><i class="${currentDown ? "warn-dot" : "healthy-dot"}"></i><strong>${item.label}</strong><small>${item.kind}</small></span><span><strong>${currentDown ? "离线" : "在线"}</strong><small>${currentDown ? "等待退避重连" : `${item.latency} ms · 100%`}</small></span></div>`;
  }).join("");
}

function renderDevices() {
  const labelMap = Object.fromEntries(devices.map((device) => [device.id, device.name]));
  const entries = sortedEntries(state.deviceTotals);
  renderRanking(elements.deviceRanking, entries, labelMap);
  elements.deviceCount.textContent = String(entries.length).padStart(2, "0");

  elements.deviceSelector.innerHTML = entries.map(([id, value]) => {
    const device = devices.find((item) => item.id === id);
    return `<button class="device-option${id === state.selectedDevice ? " is-selected" : ""}" type="button" role="option" aria-selected="${id === state.selectedDevice}" data-device="${id}"><span class="device-icon">${device.icon}</span><span><strong>${device.name}</strong><small>${device.ip}</small></span><b>${formatBytes(value, true)}</b></button>`;
  }).join("");

  const selected = devices.find((item) => item.id === state.selectedDevice) || devices[0];
  const selectedTotal = state.deviceTotals.get(selected.id) || 0;
  const allDeviceTraffic = entries.reduce((sum, item) => sum + item[1], 0);
  const detail = sortedEntries(ensureDeviceDomainMap(selected.id));
  const topRule = detail.length > 0
    ? scenarios[state.scenario].domains.find((domain) => domain.name === detail[0][0])?.rule || "Match"
    : "—";
  elements.selectedDeviceName.textContent = selected.name;
  elements.selectedDeviceIP.textContent = selected.ip;
  elements.selectedDeviceRule.textContent = `主要命中 ${topRule}`;
  elements.selectedDeviceShare.textContent = `占网关 ${((selectedTotal / Math.max(1, allDeviceTraffic)) * 100).toFixed(1)}%`;
  elements.selectedDeviceTotal.textContent = formatBytes(selectedTotal, true);
  elements.deviceDomainRows.innerHTML = detail.slice(0, 6).map(([domainName, value]) => {
    const domain = scenarios[state.scenario].domains.find((item) => item.name === domainName);
    return `<div class="detail-row" role="row"><span role="cell">${domainName}</span><span role="cell">${domain?.rule || "Match"}</span><span role="cell">${formatBytes(value, true)}</span></div>`;
  }).join("");
}

function renderRules() {
  const entries = sortedEntries(state.rules);
  const max = entries[0]?.[1] || 1;
  const total = entries.reduce((sum, item) => sum + item[1], 0);
  elements.ruleRanking.innerHTML = entries.slice(0, 6).map(([name, value]) => `
    <article class="rule-item"><header><strong>${name}</strong><b>${formatBytes(value, true)}</b></header><i style="--rule-width:${Math.max(5, (value / max) * 100).toFixed(1)}%"></i><small>${((value / Math.max(1, total)) * 100).toFixed(1)}% · ${name === "DIRECT" ? "本地出口" : "策略链"}</small></article>
  `).join("");
  const [topRule, topValue] = entries[0] || ["Work", 0];
  elements.flowRuleTitle.textContent = `${topRule} · 当前路径`;
  elements.flowRuleNode.textContent = topRule;
  elements.flowRuleValue.textContent = formatBytes(topValue, true);
}

function renderPipeline() {
  const { previous, current, delta, reset } = state.pipeline;
  elements.pipeSnapshot.textContent = `down ${formatBytes(previous, true)} → ${formatBytes(current, true)}`;
  elements.pipeDelta.textContent = `${reset ? "reset detected · " : ""}delta +${formatBytes(delta, true)}`;
  elements.pipeBuffer.textContent = `${state.pendingKeys.size} dimension rows pending`;
  elements.pipeStore.textContent = `last flush ${Math.floor((Date.now() - state.lastFlush) / 1000)}s ago`;
  elements.pipeMerge.textContent = `${formatBytes(state.totals.download - state.currentDelta.download, true)} + ${formatBytes(state.currentDelta.download, true)}`;
  document.querySelectorAll(".pipeline-step").forEach((step, index) => {
    step.classList.toggle("is-current", index === state.pipelinePhase);
  });
}

function renderStatus() {
  const gateway = gateways[state.gateway];
  elements.gatewayHealth.classList.toggle("is-offline", state.offline);
  elements.gatewayHealth.innerHTML = `<i></i>${state.offline ? "离线 · 正在重连" : `健康 · ${gateway.latency} ms`}`;
  elements.toggleOffline.textContent = state.offline ? "恢复网关连接" : "模拟网关断联";
  elements.toggleOffline.classList.toggle("danger", !state.offline);
  elements.toggleLive.classList.toggle("is-active", state.live && !state.offline);
  elements.toggleLive.setAttribute("aria-pressed", String(state.live));
  elements.toggleLive.querySelector("span").textContent = state.live ? "实时采集中" : "采集已暂停";
  elements.liveState.classList.toggle("is-offline", state.offline);
  elements.liveState.querySelector("span").textContent = state.offline
    ? "连接中断 · 退避重连"
    : state.live
      ? `${gateway.kind} · 实时`
      : "已暂停 · 保留当前快照";
}

function render() {
  const scenario = scenarios[state.scenario];
  elements.scenarioTitle.textContent = scenario.title;
  elements.metricDownload.textContent = formatBytes(state.totals.download);
  elements.metricUpload.textContent = formatBytes(state.totals.upload);
  elements.metricConnections.textContent = state.totals.connections.toLocaleString("zh-CN");
  elements.metricActive.textContent = `${state.flows.size} 条活跃`;
  elements.metricBuffer.textContent = String(state.pendingKeys.size).padStart(2, "0");
  elements.deltaDownload.textContent = `+ ${formatBytes(state.currentDelta.download, true)}/s`;
  elements.deltaUpload.textContent = `+ ${formatBytes(state.currentDelta.upload, true)}/s`;
  elements.lastUpdated.textContent = state.lastUpdated
    ? `最后快照 ${state.lastUpdated.toLocaleTimeString("zh-CN", { hour12: false })}`
    : "等待下一份网关快照";
  elements.eventCount.textContent = String(state.eventCount);
  elements.regionShare.textContent = scenario.regionShare;
  const domainEntries = sortedEntries(state.domains);
  elements.domainCount.textContent = String(domainEntries.length).padStart(2, "0");
  renderStatus();
  renderChart();
  renderEvents();
  renderRanking(elements.domainRanking, domainEntries);
  renderDestinations();
  renderCountries();
  renderProxies();
  renderDevices();
  renderRules();
  renderHealth();
  renderPipeline();
}

function activateView(view, focus = false) {
  state.selectedView = view;
  document.querySelectorAll(".view-tab").forEach((tab) => {
    const active = tab.dataset.view === view;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  document.querySelectorAll(".view-panel").forEach((panel) => {
    const active = panel.id === `panel-${view}`;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
}

let toastTimer;
function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 4200);
}

document.querySelectorAll(".view-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    activateView(tab.dataset.view);
    document.querySelector(".capability-workspace").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  });
  tab.addEventListener("keydown", (event) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll(".view-tab")];
    const offset = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (tabs.indexOf(tab) + offset + tabs.length) % tabs.length;
    activateView(tabs[nextIndex].dataset.view, true);
    document.querySelector(".capability-workspace").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-open-view]").forEach((button) => {
  button.addEventListener("click", () => {
    activateView(button.dataset.openView);
    document.querySelector(".capability-workspace").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".scenario").forEach((button) => {
  button.addEventListener("click", () => {
    state.scenario = button.dataset.scenario;
    document.querySelectorAll(".scenario").forEach((item) => item.classList.toggle("is-active", item === button));
    resetSimulation();
    showToast(`已切换为“${scenarios[state.scenario].title}”合成流量样本。`);
  });
});

elements.timeRange.addEventListener("change", () => {
  state.timeRange = elements.timeRange.value;
  resetSimulation();
  showToast(`统计范围已切换为“${elements.timeRange.selectedOptions[0].textContent}”。`);
});

elements.manualRefresh.addEventListener("click", () => {
  if (state.offline) {
    showToast("网关离线：历史查询仍可用，但无法刷新当前快照。");
    return;
  }
  generateTrafficUpdate();
  render();
  showToast("已手动拉取一份新的网关连接快照。");
});

document.querySelectorAll("[data-dataset]").forEach((button) => {
  button.addEventListener("click", () => {
    state.destinationDataset = button.dataset.dataset;
    document.querySelectorAll("[data-dataset]").forEach((item) => item.classList.toggle("is-active", item === button));
    renderDestinations();
  });
});

elements.trafficFilter.addEventListener("input", () => {
  state.destinationFilter = elements.trafficFilter.value;
  renderDestinations();
});

elements.trafficTable.addEventListener("click", (event) => {
  const row = event.target.closest("[data-domain]");
  if (!row) return;
  state.selectedDomain = row.dataset.domain;
  renderDestinations();
});

document.querySelectorAll("[data-country-sort]").forEach((button) => {
  button.addEventListener("click", () => {
    state.countrySort = button.dataset.countrySort;
    document.querySelectorAll("[data-country-sort]").forEach((item) => item.classList.toggle("is-active", item === button));
    renderCountries();
  });
});

elements.proxySelector.addEventListener("click", (event) => {
  const option = event.target.closest("[data-proxy]");
  if (!option) return;
  state.selectedProxy = option.dataset.proxy;
  renderProxies();
});

function activateSettings(section, focus = false) {
  state.settingsSection = section;
  document.querySelectorAll("[data-settings-section]").forEach((tab) => {
    const active = tab.dataset.settingsSection === section;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  document.querySelectorAll(".settings-panel").forEach((panel) => {
    const active = panel.id === `settings-${section}`;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
}

document.querySelectorAll("[data-settings-section]").forEach((tab) => {
  tab.addEventListener("click", () => activateSettings(tab.dataset.settingsSection));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll("[data-settings-section]")];
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const next = tabs[(tabs.indexOf(tab) + offset + tabs.length) % tabs.length];
    activateSettings(next.dataset.settingsSection, true);
  });
});

document.querySelectorAll("[data-settings-jump]").forEach((button) => {
  button.addEventListener("click", () => activateSettings(button.dataset.settingsJump));
});

document.querySelectorAll("[data-retention]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-retention]").forEach((item) => item.classList.toggle("is-active", item === button));
    showToast(`演示保留策略已设为 ${button.dataset.retention} 天；未写入任何配置。`);
  });
});

document.querySelectorAll("[data-demo-action]").forEach((button) => {
  button.addEventListener("click", async () => {
    const action = button.dataset.demoAction;
    if (action === "set-display") {
      state.gateway = "studio";
      elements.gatewaySelect.value = "studio";
      state.offline = false;
      resetSimulation();
      showToast("已将“工作室 · Surge”设为模拟展示后端。");
      return;
    }
    if (action === "copy-agent") {
      const command = "nekoagent add --server https://neko.example --backend-id 3 --backend-token <redacted> --gateway http://127.0.0.1:9090";
      try { await navigator.clipboard.writeText(command); } catch { /* Clipboard is optional in the static demo. */ }
      showToast("已复制脱敏 Agent 命令；真实令牌不会进入 Demo。");
      return;
    }
    const messages = {
      "test-backend": "模拟连接成功：WebSocket 握手、认证与版本探测均通过。",
      "add-backend": "配置流程包含 Direct / Agent、Clash / Surge、地址、端口与令牌验证。",
      "rotate-token": "已模拟生成新令牌；旧 Agent 将失效，真实写操作在展示模式下禁用。",
    };
    showToast(messages[action] || "这是只读能力展示，不会写入真实配置。");
  });
});

elements.gatewaySelect.addEventListener("change", () => {
  state.gateway = elements.gatewaySelect.value;
  state.offline = false;
  resetSimulation();
  showToast(`正在观察：${gateways[state.gateway].label}`);
});

elements.toggleLive.addEventListener("click", () => {
  state.live = !state.live;
  renderStatus();
  showToast(state.live ? "实时采集已继续。" : "实时采集已暂停，当前统计保持不变。仍可切换视图。" );
});

elements.toggleOffline.addEventListener("click", () => setOffline(!state.offline));
elements.simulateReset.addEventListener("click", simulateCounterReset);

elements.toggleTheme.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("neko-capability-theme", next);
  showToast(next === "dark" ? "已切换为深色主题。" : "已切换为浅色主题。" );
});

elements.deviceSelector.addEventListener("click", (event) => {
  const option = event.target.closest("[data-device]");
  if (!option) return;
  state.selectedDevice = option.dataset.device;
  renderDevices();
});

const savedTheme = localStorage.getItem("neko-capability-theme");
if (savedTheme === "light" || savedTheme === "dark") {
  document.documentElement.dataset.theme = savedTheme;
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  document.documentElement.dataset.theme = "light";
}

resetSimulation();
window.setInterval(() => {
  if (!state.live || state.offline || document.hidden) return;
  generateTrafficUpdate();
  render();
}, 1_150);

console.info(`Neko Master Capability Lab · upstream ${UPSTREAM_COMMIT.slice(0, 8)} · synthetic traffic only`);
