import { exhibits, groups } from './exhibits.js';

const commit = '4eef5ce00d0907a03b8eff42578b5a04942915e9';
const repositoryBlob = `https://github.com/larashero3-dotcom/lieflat-charts/blob/${commit}`;

const pageCopy = {
  zh: {
    documentTitle: 'Lieflat Charts · 中文能力展厅',
    documentDescription: '用中文读懂 Lieflat Charts 的能力、原理、适用场景，并直接体验固定版本的原始模板。',
    skipLink: '跳到业务场景', backToTop: '回到页面顶部', brandSubtitle: '能力展厅 · 002',
    languageAria: '选择界面语言', languageLabel: '界面语言', externalLinksAria: '外部链接', upstreamLink: '固定版本 ↗', researchLink: '研究记录 ↗',
    eyebrowLead: '从场景回看能力', eyebrowTail: '明确这个库负责什么',
    heroTitleLead: '一次业务调用背后，', heroTitleStrong: '是一整套数据表达方法。',
    heroLede: '它不是数据平台，也不是运行时 SDK，而是一套供 AI 助手使用的选图规则、模板和成品网页。',
    browseExhibits: '查看架构与能力 ↓', readRules: '阅读原始规则 ↗', statsAria: '能力统计',
    statCharts: '种图表', statChartSystems: '分为 5 个体系', statReports: '套报告', statBilingual: '都有中英双版',
    statVisuals: '种内置视觉', statThemes: '黑白灰 + 3 套彩色', statSamples: '个网页样张', statCoverage: '本展厅全部覆盖',
    capabilityIndex: '02 / 架构与能力总图', capabilityTitle: '一张图看懂：这个库怎样把数据变成可交付效果',
    capabilityIntro: '从外部输入到最终网页，AI 助手负责执行，Lieflat Charts 提供规则、模板和质量边界，浏览器负责真正绘制。',
    cap1Title: '理解问题并选图', cap1Body: '把业务问题翻译成比较、趋势、构成、分布、关系或地图。',
    cap2Title: '59 种常规图模板', cap2Body: '覆盖日常比较、时间、构成、分布与多维分析。', cap2Meta: '22 快读 + 20 细读 + 17 基础',
    cap3Title: '5 种专项大图', cap3Body: '负责空间分布、节点关系与多段流向。', cap3Meta: '2 种地图 + 3 种关系大图',
    cap4Title: '12 套整页报告', cap4Body: '编排周报、月报、调研、仪表盘、年报与分享卡。', cap4Meta: '12 套 × 中英双版',
    cap5Title: '视觉与交互规则', cap5Body: '规定配色、动画、拖拽、聚焦与动态排序何时有意义。', cap5Meta: '黑白灰 + 3 套彩色',
    cap6Title: '交付前检查', cap6Body: '检查数据诚实性、标签、外部资源与授权边界。', cap6Meta: '比例 · 单位 · 来源 · 依赖',
    archInputKicker: '外部输入 · 不属于这个库', archInputTitle: '先把业务目的和已有数据交给 AI 助手',
    archGoalTitle: '业务目的', archGoalBody: '要比较、看趋势、查关系，还是交付整页报告？',
    archDataTitle: '已有数据', archDataBody: '字段、单位、时间范围、数据来源与真实记录',
    archAgentKicker: 'AI 助手执行层 · 不是函数接口', archAgentTitle: 'AI 读规则、比较候选，再复制并修改真实模板',
    archAgentBody: '这部分是“调用”的真正含义：不是把数据传给一个 render()，而是由 AI 完成判断与代码改写。',
    archCoreKicker: 'Lieflat Charts 能力内核', archCoreTitle: '规则、目录、模板和设计约束共同组成六层能力',
    archRuntimeKicker: '浏览器渲染层 · 位于库的下方', archRuntimeTitle: '真正把结构画出来的三种技术',
    archSvgBody: '编辑图与路径', archEchartsBody: '地图、网络与复杂布局', archChartjsBody: '部分基础快读图',
    archOutputKicker: '最终交付', archOutputTitle: '可以继续编辑和发布的网页', archOutputChart: '单张 HTML 图表', archOutputReport: '完整 HTML 报告',
    archBoundaryTitle: '能力边界', archBoundaryBody: '这是 AI 辅助的图表生产工作流，不是直接传数据的运行时 API，也不负责数据查询、清洗与治理。',
    archReadingAria: '架构图阅读结论', archReadingLabel: '一句话读图', archReadingBody: 'Lieflat Charts 位于“业务数据”和“底层绘图引擎”之间：它把专家的选图方法与模板交给 AI 执行，最后由浏览器生成可交付网页。',
    useCaseIndex: '01 / 先选择实际工作', useCaseTitle: '你现在正在做哪一种业务任务？',
    useCaseIntro: '不用先选图。选一个最接近的工作场景，看它怎样调用这个库。',
    useCaseListAria: '实际业务场景', scenarioInputLabel: '你手里有什么数据', scenarioOutputLabel: '最终要交付什么',
    callTruthTitle: '这里的“调用”不是函数接口。', callTruthBody: '它指 AI 助手读取规则、选中编号模板，再替换数据生成 HTML。',
    callHeadingLabel: '业务拆解', callHeadingTitle: '同一个任务，会连续调用三项图表能力', callQuestionLabel: '要回答', callDataLabel: '输入字段', callTemplateLabel: '调用模板', callAbilityLabel: '库负责', runCall: '运行这个调用 →',
    scenarioDeliverableLabel: '最终交付模板', openScenarioReport: '打开最终产出 →',
    invocationKicker: '当前业务调用', invocationFinalKicker: '当前最终交付', invocationInput: '使用你的字段',
    invocationSampleNote: '注意：下方运行的是原作者的示例数据。这里借用的是图表结构与交互规则，真正生成时会替换为你的业务数据。', returnToScenario: '返回业务拆解 ↑',
    pipelineIndex: '03 / 它怎样工作', pipelineTitle: '底层是一条由 AI 助手执行的五步生产线',
    pipelineIntro: '文字规则负责判断，目录负责限制可选范围，网页模板负责生成最终可以运行的结果。',
    step1Label: '输入', step1Title: '目的 + 数据', step1Body: '要一张图还是整页报告？数据是什么结构？',
    step2Label: '选图', step2Title: '比较候选', step2Body: '检查表达目的、单位、标签和阅读速度',
    step3Label: '定模板', step3Title: '锁定结构', step3Body: '选定图表编号和真实网页代码骨架',
    step4Label: '填内容', step4Title: '替换与编排', step4Body: '放入数据、标题、旁注、来源和配色',
    step5Label: '交付', step5Title: '浏览器检查', step5Body: '检查比例、交互、外部资源和网页文件',
    explorerIndex: '03 / 真实效果演示', explorerTitle: '不要只看介绍，直接运行原作者的样张',
    explorerIntroLead: '所有展品都来自固定版本', explorerIntroTail: '；展厅没有改动图表代码，而且同一时间只运行一个页面。',
    toolbarAria: '展品筛选', filterAria: '按类型筛选', searchLabel: '搜索展品', searchPlaceholder: '搜索图表、场景或技术…',
    exhibitListAria: '展品清单', htmlCoverage: '覆盖 52 个原始网页样张', emptyTitle: '没有匹配项', emptyHint: '试试“网络”“年报”或“SVG”。',
    tagsAria: '展品标签', stageWhenLabel: '什么时候用', stageWhyLabel: '为什么选', stageAvoidLabel: '什么时候别用', openFull: '全页打开 ↗', openSource: '查看源码 ↗', viewportAria: '预览尺寸', viewportAuto: '自适应', refresh: '重播 / 刷新',
    loadingTitle: '正在载入原始样张', loadingBody: '部分图表还会请求 ECharts、Chart.js、字体或地图数据。',
    reloadingTitle: '正在重新运行样张', slowTitle: '样张加载时间较长', slowBody: '可能正在等待外部资源；你仍可全页打开或查看源码。',
    dependencyNote: '展厅外壳离线可读；预览窗口里的部分样张需要访问外部资源。若图表没有出现，可全页打开或查看源码确认依赖。',
    fitIndex: '04 / 适合与不适合', fitTitle: '它擅长把数据表达出来，不负责建设数据平台', fitIntro: '把边界说清楚，比把所有能力都包装成“自动化”更有价值。',
    goodFitLabel: '适合使用', goodFitTitle: '研究、年报、快报、海报、一次性专题',
    goodFit1: '读者愿意细读的数据故事，或需要几秒钟判断的业务快照', goodFit2: '规模不大、结构明确、强调真实单位的数据', goodFit3: '由 AI 助手辅助生产的网页图表和报告',
    notReplacementLabel: '不能替代', notReplacementTitle: '商业智能系统、实时平台、产品组件库、数据治理',
    notReplacement1: '没有数据库查询、数据清洗、权限控制、指标口径和查询引擎', notReplacement2: '没有软件包接口，也没有 React 或 Vue 组件', notReplacement3: '商业复用受到 PolyForm Noncommercial 许可证限制',
    footerBaseline: '研究基线', footerFetched: '获取于 2026-09-03', footerNoncommercial: '非商业研究展示', footerOwnership: '上游内容归原作者所有，适用', footerAnd: '与', thirdPartyNotices: '第三方声明',
    visibleCount: (count) => `${count} 个入口`, frameTitle: (title) => `${title}原始样张`,
  },
  en: {
    documentTitle: 'Lieflat Charts · Capability Gallery',
    documentDescription: 'Understand the capabilities, mechanics, use cases, and pinned original templates of Lieflat Charts.',
    skipLink: 'Skip to business scenarios', backToTop: 'Back to top', brandSubtitle: 'Capability gallery · 002',
    languageAria: 'Choose interface language', languageLabel: 'Language', externalLinksAria: 'External links', upstreamLink: 'Pinned source ↗', researchLink: 'Research notes ↗',
    eyebrowLead: 'Read the capability through a scenario', eyebrowTail: 'Make the library’s responsibility explicit',
    heroTitleLead: 'Behind one business invocation', heroTitleStrong: 'is a complete data-expression method.',
    heroLede: 'It is not a data platform or runtime SDK. It is a set of chart-selection rules, templates, and finished web pages for an AI agent.',
    browseExhibits: 'See architecture and capabilities ↓', readRules: 'Read the source rules ↗', statsAria: 'Capability totals',
    statCharts: 'chart types', statChartSystems: 'across 5 systems', statReports: 'report layouts', statBilingual: 'Chinese and English',
    statVisuals: 'visual systems', statThemes: 'monochrome + 3 colors', statSamples: 'HTML samples', statCoverage: 'all available here',
    capabilityIndex: '02 / Architecture and capability map', capabilityTitle: 'One map: how the library turns data into a deliverable visual',
    capabilityIntro: 'An AI agent executes the flow, Lieflat Charts supplies rules, templates, and quality boundaries, and the browser performs the actual drawing.',
    cap1Title: 'Understand and route the question', cap1Body: 'Translate a business question into comparison, time, composition, distribution, networks, or maps.',
    cap2Title: '59 general chart templates', cap2Body: 'Cover everyday comparison, time, composition, distribution, and multidimensional analysis.', cap2Meta: '22 quick + 20 close-read + 17 basics',
    cap3Title: '5 specialist large views', cap3Body: 'Handle spatial patterns, node relationships, and multi-stage flows.', cap3Meta: '2 maps + 3 relationship views',
    cap4Title: '12 complete report layouts', cap4Body: 'Compose weekly, monthly, survey, dashboard, annual, and share-card outputs.', cap4Meta: '12 layouts × Chinese and English',
    cap5Title: 'Visual and interaction rules', cap5Body: 'Define when color, motion, dragging, focus, and dynamic sorting add meaning.', cap5Meta: 'monochrome + 3 color systems',
    cap6Title: 'Delivery checks', cap6Body: 'Check data honesty, labels, external resources, and licensing boundaries.', cap6Meta: 'scale · units · source · dependencies',
    archInputKicker: 'External input · outside the library', archInputTitle: 'Give the AI agent a business goal and existing data first',
    archGoalTitle: 'Business goal', archGoalBody: 'Compare, follow a trend, inspect relationships, or deliver a full report?',
    archDataTitle: 'Existing data', archDataBody: 'Fields, units, time range, source, and real records',
    archAgentKicker: 'AI agent control plane · not a function API', archAgentTitle: 'The AI reads rules, audits candidates, then copies and edits a real template',
    archAgentBody: 'This is what “invoke” means here: data is not passed into render(); the AI performs the judgment and code changes.',
    archCoreKicker: 'Lieflat Charts capability core', archCoreTitle: 'Rules, catalogs, templates, and design constraints form six capability layers',
    archRuntimeKicker: 'Browser rendering layer · below the library', archRuntimeTitle: 'Three technologies draw the selected structure',
    archSvgBody: 'editorial charts and paths', archEchartsBody: 'maps, networks, and complex layouts', archChartjsBody: 'selected quick-read basics',
    archOutputKicker: 'Final delivery', archOutputTitle: 'A web page that can be edited and published', archOutputChart: 'single-chart HTML', archOutputReport: 'complete-report HTML',
    archBoundaryTitle: 'Capability boundary', archBoundaryBody: 'This is an AI-assisted chart-production workflow, not a runtime data API, and it does not query, clean, or govern data.',
    archReadingAria: 'Architecture map conclusion', archReadingLabel: 'Read it in one sentence', archReadingBody: 'Lieflat Charts sits between business data and low-level rendering engines: it gives expert selection rules and templates to an AI agent, then the browser produces the deliverable page.',
    useCaseIndex: '01 / Choose the real job first', useCaseTitle: 'Which business task are you working on?',
    useCaseIntro: 'Do not choose a chart yet. Pick the closest job and see how it invokes this library.',
    useCaseListAria: 'Real business scenarios', scenarioInputLabel: 'Data you already have', scenarioOutputLabel: 'What you need to deliver',
    callTruthTitle: '“Invoke” does not mean a function API here.', callTruthBody: 'It means an AI agent reads the rules, selects a numbered template, replaces its data, and generates HTML.',
    callHeadingLabel: 'Business breakdown', callHeadingTitle: 'One job invokes three chart capabilities in sequence', callQuestionLabel: 'Question', callDataLabel: 'Input fields', callTemplateLabel: 'Template invoked', callAbilityLabel: 'Library responsibility', runCall: 'Run this invocation →',
    scenarioDeliverableLabel: 'Final delivery template', openScenarioReport: 'Open the final output →',
    invocationKicker: 'Current business invocation', invocationFinalKicker: 'Current final deliverable', invocationInput: 'Use your fields',
    invocationSampleNote: 'Note: the sample below runs the author’s example data. You are borrowing its chart structure and interaction rules; a real generation replaces it with your business data.', returnToScenario: 'Back to the business breakdown ↑',
    pipelineIndex: '03 / How it works', pipelineTitle: 'A five-step production line executed by an AI agent',
    pipelineIntro: 'Written rules make decisions, catalogs constrain the options, and HTML templates produce browser-ready output.',
    step1Label: 'Input', step1Title: 'Goal + data', step1Body: 'One chart or a full report? What shape is the data?',
    step2Label: 'Route', step2Title: 'Audit candidates', step2Body: 'Check intent, units, labels, and reading speed',
    step3Label: 'Lock', step3Title: 'Choose a contract', step3Body: 'Select a chart ID and a real HTML code skeleton',
    step4Label: 'Compose', step4Title: 'Replace and arrange', step4Body: 'Insert data, title, annotations, source, and color',
    step5Label: 'Verify', step5Title: 'Browser preflight', step5Body: 'Check scale, interaction, dependencies, and the final file',
    explorerIndex: '03 / Live examples', explorerTitle: 'Run the original samples, not just the claims',
    explorerIntroLead: 'Every exhibit comes from pinned commit', explorerIntroTail: '. The chart code is untouched, and only one page runs at a time.',
    toolbarAria: 'Exhibit filters', filterAria: 'Filter by type', searchLabel: 'Search exhibits', searchPlaceholder: 'Search charts, use cases, or technology…',
    exhibitListAria: 'Exhibit list', htmlCoverage: 'Covers 52 original HTML samples', emptyTitle: 'No matches', emptyHint: 'Try “network”, “annual report”, or “SVG”.',
    tagsAria: 'Exhibit tags', stageWhenLabel: 'Use it when', stageWhyLabel: 'Why it fits', stageAvoidLabel: 'Do not use it when', openFull: 'Open full page ↗', openSource: 'View source ↗', viewportAria: 'Preview size', viewportAuto: 'Responsive', refresh: 'Replay / refresh',
    loadingTitle: 'Loading original sample', loadingBody: 'Some charts also request ECharts, Chart.js, fonts, or map data.',
    reloadingTitle: 'Restarting sample', slowTitle: 'This sample is taking longer', slowBody: 'It may be waiting for an external resource. You can still open the full page or inspect its source.',
    dependencyNote: 'The gallery shell works offline. Some embedded samples need external resources. If a chart is blank, open the full page or inspect its source to confirm the dependency.',
    fitIndex: '04 / Fit and boundaries', fitTitle: 'Strong at the presentation layer, not a data platform', fitIntro: 'Clear boundaries are more useful than labeling every capability as automation.',
    goodFitLabel: 'Good fit', goodFitTitle: 'Research, annual reports, briefs, posters, and one-off stories',
    goodFit1: 'Data stories that reward close reading or business snapshots that need a quick decision', goodFit2: 'Small or medium, well-structured datasets where honest units matter', goodFit3: 'AI-assisted HTML chart and report production',
    notReplacementLabel: 'Not a replacement', notReplacementTitle: 'BI, real-time platforms, product component libraries, or data governance',
    notReplacement1: 'No SQL, cleaning, permissions, metric definitions, or query engine', notReplacement2: 'No package API and no React or Vue components', notReplacement3: 'Commercial reuse is restricted by the PolyForm Noncommercial license',
    footerBaseline: 'Research baseline', footerFetched: 'retrieved 2026-09-03', footerNoncommercial: 'noncommercial research gallery', footerOwnership: 'Upstream content belongs to its authors under', footerAnd: 'and', thirdPartyNotices: 'third-party notices',
    visibleCount: (count) => `${count} entries`, frameTitle: (title) => `${title} original sample`,
  },
};

const scenarios = [
  {
    id: 'commerce', code: '01', reportId: 'report-12',
    copy: {
      zh: { name: '电商运营周报', hint: '销售、商品、渠道', owner: '运营负责人 · 每周一', title: '我要解释上周卖得怎么样，以及下周先做什么', summary: '先判断走势，再找贡献最大的商品和渠道，最后把结论编成一页周报。', input: '订单日期、商品品类、销售额、来源渠道', output: '趋势 + 排名 + 渠道构成的一页周报', reportTitle: 'R12 · 周报速览', reportNote: '把本周变化、排名和异常放进同一屏。' },
      en: { name: 'Ecommerce weekly report', hint: 'sales, products, channels', owner: 'Operations lead · every Monday', title: 'Explain last week’s performance and what to do next', summary: 'Establish the trend, find the strongest products and channels, then compose the findings into one weekly page.', input: 'order date, product category, revenue, acquisition channel', output: 'one page with trend, ranking, and channel mix', reportTitle: 'R12 · Weekly glance', reportNote: 'Put the week’s change, ranking, and anomalies on one screen.' },
    },
    calls: [
      { id: 'trend', template: 'F02', targetId: 'basics', focusTitle: 'Thirty days of sign-ups', copy: { zh: { question: '销售额这一周是涨是跌？', data: '日期 + 每日销售额', chart: '折线图', ability: '时间趋势表达' }, en: { question: 'Did revenue rise or fall this week?', data: 'date + daily revenue', chart: 'line chart', ability: 'time-trend expression' } } },
      { id: 'rank', template: 'F05', targetId: 'basics', focusTitle: 'Six teams, shipped and counted', copy: { zh: { question: '哪些商品贡献最大？', data: '商品品类 + 销售额', chart: '排序条形图', ability: '类别高低比较' }, en: { question: 'Which products contributed most?', data: 'product category + revenue', chart: 'sorted bar chart', ability: 'category comparison' } } },
      { id: 'mix', template: 'G04', targetId: 'glance', focusTitle: 'Where sign-ups come from', copy: { zh: { question: '订单主要来自哪些渠道？', data: '渠道 + 订单占比', chart: '百点构成图', ability: '整体构成表达' }, en: { question: 'Which channels produced the orders?', data: 'channel + order share', chart: '100-dot composition', ability: 'part-to-whole expression' } } },
    ],
  },
  {
    id: 'growth', code: '02', reportId: 'report-09',
    copy: {
      zh: { name: '产品增长复盘', hint: '注册、渠道、转化', owner: '增长团队 · 版本复盘', title: '我要知道用户从哪里来，增长为什么变快或变慢', summary: '把注册趋势、渠道构成和投入产出关系放在一起，判断增长来自哪里。', input: '日期、注册量、渠道、投放金额、转化率', output: '带关键指标和多张图的增长仪表盘', reportTitle: 'R09 · 数据总览仪表盘', reportNote: '并排放置趋势、构成、相关性和关键指标。' },
      en: { name: 'Product growth review', hint: 'sign-ups, channels, conversion', owner: 'Growth team · release review', title: 'Find where users came from and why growth changed', summary: 'Combine sign-up trend, channel mix, and spend-to-conversion relationships to explain growth.', input: 'date, sign-ups, channel, spend, conversion rate', output: 'growth dashboard with KPIs and multiple charts', reportTitle: 'R09 · Data story dashboard', reportNote: 'Place trends, composition, relationships, and KPIs side by side.' },
    },
    calls: [
      { id: 'trend', template: 'F02', targetId: 'basics', focusTitle: 'Thirty days of sign-ups', copy: { zh: { question: '注册量在哪一天开始变化？', data: '日期 + 注册量', chart: '折线图', ability: '时间趋势表达' }, en: { question: 'When did sign-ups begin to change?', data: 'date + sign-ups', chart: 'line chart', ability: 'time-trend expression' } } },
      { id: 'mix', template: 'G04', targetId: 'glance', focusTitle: 'Where sign-ups come from', copy: { zh: { question: '新用户主要来自哪里？', data: '渠道 + 注册占比', chart: '百点构成图', ability: '来源构成表达' }, en: { question: 'Where did new users come from?', data: 'channel + sign-up share', chart: '100-dot composition', ability: 'source composition' } } },
      { id: 'relation', template: 'F08', targetId: 'basics', focusTitle: 'Price against satisfaction', copy: { zh: { question: '投放越多，转化真的越高吗？', data: '渠道 + 投入 + 转化率', chart: '散点图', ability: '两个指标关系' }, en: { question: 'Does more spend actually mean more conversion?', data: 'channel + spend + conversion', chart: 'scatter plot', ability: 'relationship between measures' } } },
    ],
  },
  {
    id: 'service', code: '03', reportId: 'report-04',
    copy: {
      zh: { name: '客服质量分析', hint: '工单、响应、SLA', owner: '客服主管 · 月度质检', title: '我要找出响应慢在哪里，是普遍问题还是少数异常', summary: '先看响应时长分布，再比较团队处理量，并观察每日工单是否持续积压。', input: '工单日期、团队、套餐、响应时长、处理量', output: '趋势 + 排名 + 异常分布的月度运营报告', reportTitle: 'R04 · 月度运营报告', reportNote: '适合每日趋势、团队排名和关键服务指标。' },
      en: { name: 'Customer service quality', hint: 'tickets, response, SLA', owner: 'Service lead · monthly QA', title: 'Find where replies are slow and whether the problem is systemic', summary: 'Inspect response-time distribution, compare team throughput, and track whether the backlog persists.', input: 'ticket date, team, plan, response time, handled count', output: 'monthly operations report with trends, ranks, and outliers', reportTitle: 'R04 · Monthly operations', reportNote: 'Designed for daily trends, team rankings, and service KPIs.' },
    },
    calls: [
      { id: 'distribution', template: 'F15', targetId: 'basics', focusTitle: 'Reply times, boxed by plan', copy: { zh: { question: '哪些套餐响应慢且异常多？', data: '套餐 + 每张工单响应时长', chart: '箱线图', ability: '分布与异常值' }, en: { question: 'Which plans are slow or unusually variable?', data: 'plan + every ticket response time', chart: 'box plot', ability: 'distribution and outliers' } } },
      { id: 'rank', template: 'F05', targetId: 'basics', focusTitle: 'Six teams, shipped and counted', copy: { zh: { question: '哪个团队处理量最高？', data: '团队 + 已处理工单数', chart: '排序条形图', ability: '团队高低比较' }, en: { question: 'Which team handled the most tickets?', data: 'team + handled ticket count', chart: 'sorted bar chart', ability: 'team comparison' } } },
      { id: 'trend', template: 'F02', targetId: 'basics', focusTitle: 'Thirty days of sign-ups', copy: { zh: { question: '积压是否连续几天上升？', data: '日期 + 未结工单数', chart: '折线图', ability: '连续趋势监控' }, en: { question: 'Has the backlog risen for several days?', data: 'date + open ticket count', chart: 'line chart', ability: 'continuous trend monitoring' } } },
    ],
  },
  {
    id: 'research', code: '04', reportId: 'report-01',
    copy: {
      zh: { name: '市场调研报告', hint: '问卷、满意度、细分', owner: '研究员 · 调研结项', title: '我要把问卷结果变成可信、可以汇报的研究结论', summary: '同时呈现人群构成、评分分布和变量关系，并保留样本与方法说明。', input: '受访者、选项、评分、价格、满意度、人群标签', output: '主结论 + 样本方法侧栏的调研一页纸', reportTitle: 'R01 · 调研一页纸', reportNote: '为结论、样本、方法和图表安排清晰顺序。' },
      en: { name: 'Market research report', hint: 'survey, satisfaction, segments', owner: 'Researcher · study closeout', title: 'Turn survey responses into credible, presentable findings', summary: 'Show audience composition, score distribution, and variable relationships while preserving sample and method context.', input: 'respondent, answer, score, price, satisfaction, segment', output: 'survey one-pager with findings and methods rail', reportTitle: 'R01 · Survey one-pager', reportNote: 'Orders findings, sample, methods, and charts clearly.' },
    },
    calls: [
      { id: 'mix', template: 'G04', targetId: 'glance', focusTitle: 'Where sign-ups come from', copy: { zh: { question: '受访者由哪些人群组成？', data: '人群标签 + 样本占比', chart: '百点构成图', ability: '样本构成表达' }, en: { question: 'Who made up the respondent sample?', data: 'segment + sample share', chart: '100-dot composition', ability: 'sample composition' } } },
      { id: 'distribution', template: 'F15', targetId: 'basics', focusTitle: 'Reply times, boxed by plan', copy: { zh: { question: '不同人群评分差异大吗？', data: '人群 + 每位受访者评分', chart: '箱线图', ability: '分组分布比较' }, en: { question: 'Do score distributions differ by segment?', data: 'segment + every respondent score', chart: 'box plot', ability: 'grouped distribution comparison' } } },
      { id: 'relation', template: 'F08', targetId: 'basics', focusTitle: 'Price against satisfaction', copy: { zh: { question: '价格和满意度有关吗？', data: '产品 + 价格 + 满意度', chart: '散点图', ability: '相关关系表达' }, en: { question: 'Is price related to satisfaction?', data: 'product + price + satisfaction', chart: 'scatter plot', ability: 'relationship expression' } } },
    ],
  },
  {
    id: 'regional', code: '05', reportId: 'report-09',
    copy: {
      zh: { name: '区域经营分析', hint: '省市、门店、收入', owner: '区域经理 · 经营复盘', title: '我要知道问题发生在哪里，以及地区差异是否值得行动', summary: '先看空间聚集，再做地区排名和时间趋势，避免只凭地图面积判断。', input: '国家或州省、门店、日期、收入或用户量', output: '地图 + 地区排名 + 趋势的经营总览', reportTitle: 'R09 · 数据总览仪表盘', reportNote: '容纳地图、排名、趋势和关键指标。' },
      en: { name: 'Regional operations analysis', hint: 'regions, stores, revenue', owner: 'Regional manager · business review', title: 'Find where the problem occurs and whether regional differences matter', summary: 'Locate spatial clusters, then compare regional rank and trends without mistaking map area for value.', input: 'country or state, store, date, revenue or users', output: 'operations overview with map, ranking, and trend', reportTitle: 'R09 · Data story dashboard', reportNote: 'Accommodates a map, ranking, trend, and KPIs.' },
    },
    calls: [
      { id: 'map', template: 'M01', targetId: 'maps', focusTitle: 'Sign-ups across the states', copy: { zh: { question: '哪些地区明显偏高或偏低？', data: '州省 + 一个指标', chart: '分级着色地图', ability: '空间分布表达' }, en: { question: 'Which regions are unusually high or low?', data: 'state or province + one measure', chart: 'choropleth map', ability: 'spatial distribution' } } },
      { id: 'rank', template: 'F05', targetId: 'basics', focusTitle: 'Six teams, shipped and counted', copy: { zh: { question: '地区排名到底怎样？', data: '地区 + 收入', chart: '排序条形图', ability: '精确排名比较' }, en: { question: 'What is the exact regional ranking?', data: 'region + revenue', chart: 'sorted bar chart', ability: 'precise ranking' } } },
      { id: 'trend', template: 'F02', targetId: 'basics', focusTitle: 'Thirty days of sign-ups', copy: { zh: { question: '落后地区在改善吗？', data: '日期 + 地区指标', chart: '折线图', ability: '变化趋势表达' }, en: { question: 'Are lagging regions improving?', data: 'date + regional measure', chart: 'line chart', ability: 'change over time' } } },
    ],
  },
  {
    id: 'network', code: '06', reportId: 'big-threads',
    copy: {
      zh: { name: '系统依赖梳理', hint: '节点、依赖、流向', owner: '架构师 · 依赖审计', title: '我要看清谁依赖谁，风险会沿哪条路径传播', summary: '按网络规模和方向性选择固定环、力导向或多段流向，而不是把连接关系塞进普通表格。', input: '来源节点、目标节点、关系类型、权重或路径阶段', output: '可聚焦、拖拽或固定路径的关系交互页', reportTitle: 'B03 · 多路径流向', reportNote: '最终交付可逐条聚焦和固定的多阶段路径。' },
      en: { name: 'System dependency audit', hint: 'nodes, dependencies, flow', owner: 'Architect · dependency audit', title: 'See who depends on whom and how risk propagates', summary: 'Choose a fixed ring, force layout, or multi-stage flow according to network size and directionality.', input: 'source node, target node, relationship, weight or stage', output: 'interactive relationship page with focus, drag, or pinned paths', reportTitle: 'B03 · Multi-stage flow', reportNote: 'Deliver a view where individual paths can be focused and pinned.' },
    },
    calls: [
      { id: 'ring', template: 'B01', targetId: 'big-circular', focusTitle: null, copy: { zh: { question: '60 个以内的服务怎样互相依赖？', data: '来源 + 目标', chart: '环形关系网络', ability: '稳定邻接关系' }, en: { question: 'How do up to 60 services depend on one another?', data: 'source + target', chart: 'circular network', ability: 'stable adjacency view' } } },
      { id: 'force', template: 'B02', targetId: 'big-force', focusTitle: null, copy: { zh: { question: '大型网络里有哪些聚集群？', data: '约 180 个节点 + 连接', chart: '可拖拽力导向网络', ability: '大型关系探索' }, en: { question: 'What clusters exist in a larger network?', data: 'about 180 nodes + links', chart: 'draggable force network', ability: 'large-network exploration' } } },
      { id: 'flow', template: 'B03', targetId: 'big-threads', focusTitle: null, copy: { zh: { question: '风险会经过哪些多段路径？', data: '起点 + 中间阶段 + 终点', chart: '多路径流向图', ability: '有方向的路径追踪' }, en: { question: 'Which multi-stage paths can risk follow?', data: 'origin + intermediate stages + destination', chart: 'multi-stage flow', ability: 'directed path tracing' } } },
    ],
  },
];

const guidanceCopy = {
  zh: {
    glance: { when: '周报、监控、排行榜，以及读者需要在几秒内判断高低和异常时。', why: '大数字、粗线条与清晰排序能最快建立视觉优先级。', avoid: '需要逐条核对样本、解释方法或呈现复杂证据时。' },
    lupi: { when: '年报、调研、研究长文，以及读者愿意花约 30 秒细读时。', why: '细线、点阵和旁注尽量保留每条真实记录。', avoid: '管理层快照、远距离大屏或只允许三秒阅读时。' },
    basics: { when: '类别、趋势、构成、相关性或分布都比较简单，受众熟悉传统图表时。', why: '熟悉的图形降低学习成本，同时保留清晰单位和编辑感。', avoid: '节点关系、复杂路径或高密度多维数据需要专门表达时。' },
    maps: { when: '用户明确要看国家、州省或区域的空间分布时。', why: '区域明暗能显示空间聚集与跨地区差异。', avoid: '只是给地区排名，或地理位置与结论无关时。' },
    circular: { when: '关系网络不超过约 60 个节点，需要查看邻接关系时。', why: '固定环形布局稳定，鼠标聚焦后容易看清谁与谁相连。', avoid: '节点更多、必须拖拽探索，或需要追踪有方向的路径时。' },
    force: { when: '约 180 个节点的大网络，需要拖拽、缩放和逐节点检查时。', why: '力导向布局会按关系聚集节点，交互有助于探索局部。', avoid: '必须保持固定顺序、精确比较数值或追踪多段方向时。' },
    threads: { when: '有 100 多条多段路径，需要逐条或整束查看流向时。', why: '路径聚焦和点击固定可以从总流向进入单条记录。', avoid: '只关心聚合总量，或连接没有明确方向时。' },
    porcelain: { when: '同一指标用颜色深浅表达大小，内容需要冷静、克制的视觉时。', why: '单一蓝色色阶让数值顺序比装饰更突出。', avoid: '需要用颜色区分多个并列类别时。' },
    palm: { when: '只有少量类别，需要自然、友好的多色区分时。', why: '有限的绿色与暖色能区分类别，同时保持整体一致。', avoid: '类别很多，或只应该强调一个重点时。' },
    wire: { when: '黑白灰内容中只需要突出一个重点或异常时。', why: '单一红色信号建立非常明确的注意力顺序。', avoid: '多个类别同等重要、需要各自颜色标识时。' },
    report: { why: '现成骨架已经处理版心、阅读顺序和信息密度。', avoid: '只有一个结论、一张图就能说清，或数据不足以支撑整页时。' },
    example: { why: '完整案例展示了模板如何被真实数据、标题、旁注和来源共同改编。', avoid: '不要只替换文字就直接交付；仍需核对单位、事实、来源和授权。' },
  },
  en: {
    glance: { when: 'Weekly updates, monitoring, rankings, and any decision that must land within seconds.', why: 'Large numbers, bold marks, and obvious ordering establish priority fastest.', avoid: 'Readers need record-level inspection, methodology, or complex evidence.' },
    lupi: { when: 'Annual reports, research, and long-form stories where readers can spend about 30 seconds.', why: 'Hairlines, dots, and annotation preserve individual records.', avoid: 'Executive snapshots, distant displays, or three-second reading.' },
    basics: { when: 'Categories, trends, composition, association, or distribution are simple and the audience knows conventional charts.', why: 'Familiar forms reduce learning cost while preserving honest units and an editorial finish.', avoid: 'Networks, complex paths, or dense multidimensional data need a specialized view.' },
    maps: { when: 'The user explicitly asks for country, state, or regional spatial distribution.', why: 'Regional shading reveals spatial clusters and cross-region differences.', avoid: 'The task is only regional ranking or location does not affect the conclusion.' },
    circular: { when: 'A relationship network has roughly 60 nodes or fewer and adjacency is the focus.', why: 'A fixed ring is stable and hover focus makes neighbors easy to trace.', avoid: 'There are more nodes, drag exploration is required, or paths have direction.' },
    force: { when: 'A network has roughly 180 nodes and needs drag, zoom, and node-level inspection.', why: 'Force layout clusters related nodes while interaction reveals local structure.', avoid: 'Order must stay fixed, values need precise comparison, or routes have multiple stages.' },
    threads: { when: 'More than 100 multi-stage paths must be inspected one by one or as bundles.', why: 'Path focus and click-to-pin move from overall flow into individual records.', avoid: 'Only aggregate totals matter or the links have no direction.' },
    porcelain: { when: 'One metric uses lightness for magnitude and the subject needs a calm, restrained tone.', why: 'A single blue ramp keeps value order ahead of decoration.', avoid: 'Several peer categories need distinct color identities.' },
    palm: { when: 'A few categories need friendly, natural color separation.', why: 'A limited green and warm palette separates categories without losing cohesion.', avoid: 'There are many categories or only one point should be emphasized.' },
    wire: { when: 'One point or anomaly must stand out inside a mostly monochrome composition.', why: 'A single red signal creates an unmistakable attention order.', avoid: 'Several categories are equally important and each needs a color.' },
    report: { why: 'The layout already handles page width, reading order, and information density.', avoid: 'One conclusion or chart is enough, or the data cannot support a full page.' },
    example: { why: 'A complete case shows how data, title, annotation, and sources adapt a template together.', avoid: 'Do not swap the words and ship. Recheck units, facts, sources, and licensing.' },
  },
};

const elements = {
  useCaseList: document.querySelector('#use-case-list'),
  scenarioOwner: document.querySelector('#scenario-owner'),
  scenarioTitle: document.querySelector('#scenario-title'),
  scenarioSummary: document.querySelector('#scenario-summary'),
  scenarioInput: document.querySelector('#scenario-input'),
  scenarioOutput: document.querySelector('#scenario-output'),
  scenarioCalls: document.querySelector('#scenario-calls'),
  scenarioReportTitle: document.querySelector('#scenario-report-title'),
  scenarioReportNote: document.querySelector('#scenario-report-note'),
  openScenarioReport: document.querySelector('#open-scenario-report'),
  invocationContext: document.querySelector('#invocation-context'),
  invocationKicker: document.querySelector('#invocation-kicker'),
  invocationTitle: document.querySelector('#invocation-title'),
  invocationDetail: document.querySelector('#invocation-detail'),
  returnToScenario: document.querySelector('#return-to-scenario'),
  filters: document.querySelector('#group-filters'),
  search: document.querySelector('#exhibit-search'),
  language: document.querySelector('#language-toggle'),
  list: document.querySelector('#exhibit-list'),
  empty: document.querySelector('#empty-state'),
  count: document.querySelector('#visible-count'),
  code: document.querySelector('#stage-code'),
  group: document.querySelector('#stage-group'),
  title: document.querySelector('#stage-title'),
  description: document.querySelector('#stage-description'),
  tags: document.querySelector('#stage-tags'),
  stageWhen: document.querySelector('#stage-when'),
  stageWhy: document.querySelector('#stage-why'),
  stageAvoid: document.querySelector('#stage-avoid'),
  openExhibit: document.querySelector('#open-exhibit'),
  openSource: document.querySelector('#open-source'),
  previewCanvas: document.querySelector('#preview-canvas'),
  browserPath: document.querySelector('#browser-path'),
  frame: document.querySelector('#exhibit-frame'),
  frameStatus: document.querySelector('#frame-status'),
  refresh: document.querySelector('#refresh-frame'),
};

const initialUseCase = readInitialUseCase();
const initialInvocation = readInitialInvocation(initialUseCase);

const state = {
  useCase: initialUseCase,
  activeCall: initialInvocation.activeCall,
  activeDeliverable: initialInvocation.activeDeliverable,
  focusTitle: initialInvocation.focusTitle,
  filter: 'all',
  query: '',
  language: readInitialLanguage(),
  viewport: 'wide',
  selectedId: readInitialExhibit(),
  loadTimer: null,
};

function hashParams() {
  return new URLSearchParams(window.location.hash.slice(1));
}

function readInitialExhibit() {
  const requested = hashParams().get('show');
  return exhibits.some((item) => item.id === requested) ? requested : 'glance';
}

function readInitialLanguage() {
  return hashParams().get('lang') === 'en' ? 'en' : 'zh';
}

function readInitialUseCase() {
  const requested = hashParams().get('use');
  return scenarios.some((item) => item.id === requested) ? requested : 'commerce';
}

function readInitialInvocation(useCase) {
  const requested = hashParams().get('call');
  const selectedId = readInitialExhibit();
  const scenario = scenarios.find((item) => item.id === useCase) ?? scenarios[0];
  if (requested === 'deliverable' && scenario.reportId === selectedId) {
    return { activeCall: null, activeDeliverable: true, focusTitle: null };
  }
  const call = scenario.calls.find((item) => item.id === requested && item.targetId === selectedId);
  return call
    ? { activeCall: `${scenario.id}:${call.id}`, activeDeliverable: false, focusTitle: call.focusTitle }
    : { activeCall: null, activeDeliverable: false, focusTitle: null };
}

function textFor(key) {
  return pageCopy[state.language][key];
}

function exhibitCopy(exhibit) {
  return exhibit.copy[state.language];
}

function exhibitCode(exhibit) {
  return typeof exhibit.code === 'string' ? exhibit.code : exhibit.code[state.language];
}

function groupLabel(id) {
  return groups.find((group) => group.id === id)?.label[state.language] ?? id;
}

function exhibitPath(exhibit) {
  if (exhibit.path) return exhibit.path;
  return state.language === 'en' ? exhibit.pathEn : exhibit.pathZh;
}

function guidanceKey(exhibit) {
  const direct = {
    glance: 'glance', lupi: 'lupi', basics: 'basics', maps: 'maps',
    'big-circular': 'circular', 'big-force': 'force', 'big-threads': 'threads',
  };
  if (direct[exhibit.id]) return direct[exhibit.id];
  if (exhibit.id.startsWith('porcelain-')) return 'porcelain';
  if (exhibit.id.startsWith('palm-')) return 'palm';
  if (exhibit.id.startsWith('wire-')) return 'wire';
  if (exhibit.group === 'report') return 'report';
  return 'example';
}

function guidanceFor(exhibit) {
  const localized = exhibitCopy(exhibit);
  const key = guidanceKey(exhibit);
  const guidance = guidanceCopy[state.language][key];
  return {
    when: guidance.when ?? localized.description,
    why: guidance.why ?? localized.description,
    avoid: guidance.avoid,
  };
}

function applyPageCopy() {
  document.documentElement.lang = state.language === 'en' ? 'en' : 'zh-CN';
  document.title = textFor('documentTitle');
  document.querySelector('meta[name="description"]').content = textFor('documentDescription');
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = textFor(element.dataset.i18n);
    if (typeof value === 'string') element.textContent = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    element.placeholder = textFor(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', textFor(element.dataset.i18nAria));
  });
  elements.language.querySelectorAll('button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === state.language));
  });
}

function elementWithText(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function renderScenarioNavigation() {
  elements.useCaseList.replaceChildren();
  for (const scenario of scenarios) {
    const localized = scenario.copy[state.language];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'scenario-tab';
    button.dataset.scenario = scenario.id;
    button.setAttribute('aria-controls', 'scenario-detail');
    button.setAttribute('aria-pressed', String(scenario.id === state.useCase));
    button.append(
      elementWithText('span', 'scenario-tab-code', scenario.code),
      elementWithText('strong', '', localized.name),
      elementWithText('small', '', localized.hint),
    );
    button.addEventListener('click', () => selectScenario(scenario.id, { updateHash: true }));
    elements.useCaseList.append(button);
  }
}

function renderScenarioDetail() {
  const scenario = scenarios.find((item) => item.id === state.useCase) ?? scenarios[0];
  const localized = scenario.copy[state.language];
  elements.scenarioOwner.textContent = localized.owner;
  elements.scenarioTitle.textContent = localized.title;
  elements.scenarioSummary.textContent = localized.summary;
  elements.scenarioInput.textContent = localized.input;
  elements.scenarioOutput.textContent = localized.output;
  elements.scenarioReportTitle.textContent = localized.reportTitle;
  elements.scenarioReportNote.textContent = localized.reportNote;
  elements.openScenarioReport.setAttribute('aria-label', `${textFor('openScenarioReport')} ${localized.reportTitle}`);
  elements.scenarioCalls.replaceChildren();

  for (const [index, call] of scenario.calls.entries()) {
    const copy = call.copy[state.language];
    const card = document.createElement('article');
    card.className = 'call-card';
    card.dataset.call = `${scenario.id}:${call.id}`;
    card.dataset.selected = String(card.dataset.call === state.activeCall);

    const heading = document.createElement('header');
    heading.append(
      elementWithText('span', 'call-step', String(index + 1).padStart(2, '0')),
      elementWithText('small', '', textFor('callQuestionLabel')),
      elementWithText('h4', '', copy.question),
    );

    const details = document.createElement('dl');
    const dataRow = document.createElement('div');
    dataRow.append(elementWithText('dt', '', textFor('callDataLabel')), elementWithText('dd', '', copy.data));
    const templateRow = document.createElement('div');
    const templateValue = document.createElement('dd');
    templateValue.append(elementWithText('code', '', call.template), document.createTextNode(` · ${copy.chart}`));
    templateRow.append(elementWithText('dt', '', textFor('callTemplateLabel')), templateValue);
    const abilityRow = document.createElement('div');
    abilityRow.append(elementWithText('dt', '', textFor('callAbilityLabel')), elementWithText('dd', '', copy.ability));
    details.append(dataRow, templateRow, abilityRow);

    const open = elementWithText('button', 'run-call', textFor('runCall'));
    open.type = 'button';
    open.setAttribute('aria-label', `${textFor('runCall')} ${copy.question} · ${call.template} ${copy.chart}`);
    open.addEventListener('click', () => openScenarioCall(scenario, call));
    card.append(heading, details, open);
    elements.scenarioCalls.append(card);
  }
}

function renderInvocationContext() {
  const scenario = scenarios.find((item) => item.id === state.useCase) ?? scenarios[0];
  const scenarioCopy = scenario.copy[state.language];
  const activeCallId = state.activeCall?.split(':')[1];
  const call = scenario.calls.find((item) => item.id === activeCallId);

  if (!call && !state.activeDeliverable) {
    elements.invocationContext.hidden = true;
    return;
  }

  elements.invocationContext.hidden = false;
  if (state.activeDeliverable) {
    elements.invocationKicker.textContent = textFor('invocationFinalKicker');
    elements.invocationTitle.textContent = `${scenarioCopy.name} → ${scenarioCopy.reportTitle}`;
    elements.invocationDetail.replaceChildren(
      document.createTextNode(`${textFor('invocationInput')} · ${scenarioCopy.output}`),
    );
    return;
  }

  const callCopy = call.copy[state.language];
  const callIndex = scenario.calls.indexOf(call) + 1;
  elements.invocationKicker.textContent = `${textFor('invocationKicker')} · ${scenario.code}.${callIndex}`;
  elements.invocationTitle.textContent = `${scenarioCopy.name} → ${callCopy.question}`;
  elements.invocationDetail.replaceChildren(
    elementWithText('code', '', call.template),
    document.createTextNode(` · ${callCopy.chart} · ${textFor('invocationInput')}${state.language === 'zh' ? '：' : ': '}${callCopy.data}`),
  );
}

function clearInvocationContext() {
  state.activeCall = null;
  state.activeDeliverable = false;
  state.focusTitle = null;
  elements.scenarioCalls.querySelectorAll('.call-card').forEach((card) => {
    card.dataset.selected = 'false';
  });
  renderInvocationContext();
}

function showInvocationResult() {
  elements.invocationContext.scrollIntoView({
    behavior: 'instant',
    block: 'start',
  });
  focusFrameTarget();
  elements.invocationContext.scrollIntoView({ behavior: 'instant', block: 'start' });
  elements.invocationContext.focus({ preventScroll: true });
}

function selectScenario(id, { updateHash = false } = {}) {
  const scenario = scenarios.find((item) => item.id === id) ?? scenarios[0];
  state.useCase = scenario.id;
  state.activeCall = null;
  state.activeDeliverable = false;
  state.focusTitle = null;
  elements.useCaseList.querySelectorAll('.scenario-tab').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.scenario === scenario.id));
  });
  renderScenarioDetail();
  renderInvocationContext();
  if (updateHash) writeHash({ push: true });
}

function openScenarioCall(scenario, call) {
  state.activeCall = `${scenario.id}:${call.id}`;
  state.activeDeliverable = false;
  state.focusTitle = call.focusTitle;
  elements.scenarioCalls.querySelectorAll('.call-card').forEach((card) => {
    card.dataset.selected = String(card.dataset.call === state.activeCall);
  });
  renderInvocationContext();
  resetExhibitDiscovery();
  selectExhibit(call.targetId, { updateHash: true, pushHash: true });
  showInvocationResult();
}

function renderFilterButtons() {
  const counts = new Map(groups.map((group) => [group.id, group.id === 'all' ? exhibits.length : exhibits.filter((item) => item.group === group.id).length]));
  elements.filters.replaceChildren();
  for (const group of groups) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.group = group.id;
    button.setAttribute('aria-pressed', String(group.id === state.filter));
    const label = document.createElement('span');
    label.textContent = group.label[state.language];
    const count = document.createElement('small');
    count.textContent = String(counts.get(group.id)).padStart(2, '0');
    button.append(label, count);
    button.addEventListener('click', () => {
      state.filter = group.id;
      updateFilterButtons();
      renderList();
    });
    elements.filters.append(button);
  }
}

function updateFilterButtons() {
  elements.filters.querySelectorAll('button').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.group === state.filter));
  });
}

function resetExhibitDiscovery() {
  state.filter = 'all';
  state.query = '';
  elements.search.value = '';
  updateFilterButtons();
  renderList();
}

function normalizedHaystack(exhibit) {
  const localizedCopy = Object.values(exhibit.copy).flatMap((copy) => [copy.title, copy.subtitle, copy.description, ...copy.tags]);
  const codes = typeof exhibit.code === 'string' ? [exhibit.code] : Object.values(exhibit.code);
  return [...codes, ...localizedCopy].join(' ').toLocaleLowerCase();
}

function filteredExhibits() {
  const query = state.query.trim().toLocaleLowerCase();
  return exhibits.filter((exhibit) => {
    const inGroup = state.filter === 'all' || exhibit.group === state.filter;
    return inGroup && (!query || normalizedHaystack(exhibit).includes(query));
  });
}

function renderList() {
  const visible = filteredExhibits();
  elements.list.replaceChildren();
  elements.empty.hidden = visible.length > 0;
  elements.count.textContent = textFor('visibleCount')(visible.length);

  for (const exhibit of visible) {
    const localized = exhibitCopy(exhibit);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'exhibit-item';
    button.dataset.id = exhibit.id;
    button.setAttribute('aria-pressed', String(exhibit.id === state.selectedId));

    const code = document.createElement('span');
    code.className = 'exhibit-code';
    code.textContent = exhibitCode(exhibit);
    const copy = document.createElement('span');
    copy.className = 'exhibit-copy';
    const title = document.createElement('strong');
    title.textContent = localized.title;
    const subtitle = document.createElement('small');
    subtitle.textContent = localized.subtitle;
    copy.append(title, subtitle);
    const arrow = document.createElement('span');
    arrow.className = 'exhibit-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    button.append(code, copy, arrow);
    button.addEventListener('click', () => {
      clearInvocationContext();
      selectExhibit(exhibit.id, { updateHash: true, pushHash: true });
    });
    elements.list.append(button);
  }
}

function setLoading(message = textFor('loadingTitle')) {
  window.clearTimeout(state.loadTimer);
  elements.frameStatus.classList.remove('is-ready', 'is-slow');
  elements.frameStatus.querySelector('strong').textContent = message;
  elements.frameStatus.querySelector('small').textContent = textFor('loadingBody');
  state.loadTimer = window.setTimeout(() => {
    elements.frameStatus.classList.add('is-slow');
    elements.frameStatus.querySelector('strong').textContent = textFor('slowTitle');
    elements.frameStatus.querySelector('small').textContent = textFor('slowBody');
  }, 12000);
}

function setReady() {
  window.clearTimeout(state.loadTimer);
  elements.frameStatus.classList.remove('is-slow');
  elements.frameStatus.classList.add('is-ready');
}

function focusFrameTarget() {
  try {
    const frameDocument = elements.frame.contentDocument;
    if (!frameDocument) return;
    frameDocument.querySelector('[data-lieflat-focus]')?.removeAttribute('data-lieflat-focus');
    if (!state.focusTitle) return;

    let focusStyle = frameDocument.querySelector('#lieflat-focus-style');
    if (!focusStyle) {
      focusStyle = frameDocument.createElement('style');
      focusStyle.id = 'lieflat-focus-style';
      focusStyle.textContent = '[data-lieflat-focus]{outline:5px solid #ef4f2f!important;outline-offset:6px}';
      frameDocument.head.append(focusStyle);
    }

    const heading = [...frameDocument.querySelectorAll('h1,h2,h3')]
      .find((element) => element.textContent.includes(state.focusTitle));
    const target = heading?.closest('.card, article, section') ?? heading?.parentElement;
    if (!target) return;
    target.setAttribute('data-lieflat-focus', 'true');
    const frameWindow = frameDocument.defaultView;
    const scroller = frameDocument.scrollingElement;
    if (frameWindow && scroller) {
      const targetRect = target.getBoundingClientRect();
      const desiredTop = scroller.scrollTop + targetRect.top - Math.max(24, (frameWindow.innerHeight - targetRect.height) / 2);
      scroller.scrollTop = Math.max(0, desiredTop);
    }
  } catch {
    // The bundled examples are same-origin. Ignore access failures if a browser blocks an iframe.
  }
}

function writeHash({ push = false } = {}) {
  const params = hashParams();
  params.set('show', state.selectedId);
  params.set('lang', state.language);
  params.set('use', state.useCase);
  if (state.activeDeliverable) {
    params.set('call', 'deliverable');
  } else if (state.activeCall) {
    params.set('call', state.activeCall.split(':')[1]);
  } else {
    params.delete('call');
  }
  const nextUrl = `${window.location.pathname}${window.location.search}#${params}`;
  if (nextUrl === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;
  history[push ? 'pushState' : 'replaceState'](null, '', nextUrl);
}

function selectExhibit(id, { updateHash = false, reload = false, pushHash = false } = {}) {
  const exhibit = exhibits.find((item) => item.id === id) ?? exhibits[0];
  const localized = exhibitCopy(exhibit);
  state.selectedId = exhibit.id;
  const relativePath = exhibitPath(exhibit);
  const localUrl = `./upstream/${relativePath}`;

  elements.code.textContent = exhibitCode(exhibit);
  elements.group.textContent = groupLabel(exhibit.group);
  elements.title.textContent = localized.title;
  elements.description.textContent = localized.description;
  elements.tags.replaceChildren(...localized.tags.map((tag) => {
    const span = document.createElement('span');
    span.textContent = tag;
    return span;
  }));
  const guidance = guidanceFor(exhibit);
  elements.stageWhen.textContent = guidance.when;
  elements.stageWhy.textContent = guidance.why;
  elements.stageAvoid.textContent = guidance.avoid;
  elements.openExhibit.href = localUrl;
  elements.openSource.href = `${repositoryBlob}/${relativePath}`;
  elements.browserPath.textContent = `upstream/${relativePath}`;
  elements.frame.title = textFor('frameTitle')(localized.title);

  elements.list.querySelectorAll('.exhibit-item').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.id === exhibit.id));
  });

  const currentPath = elements.frame.dataset.path;
  if (reload || currentPath !== relativePath) {
    setLoading(reload ? textFor('reloadingTitle') : textFor('loadingTitle'));
    elements.frame.dataset.path = relativePath;
    elements.frame.src = localUrl;
  }

  if (updateHash) writeHash({ push: pushHash });
}

function setLanguage(language, { updateHash = true } = {}) {
  state.language = language === 'en' ? 'en' : 'zh';
  applyPageCopy();
  renderScenarioNavigation();
  renderScenarioDetail();
  renderInvocationContext();
  renderFilterButtons();
  renderList();
  selectExhibit(state.selectedId);
  if (updateHash) writeHash({ push: true });
}

function setViewport(viewport) {
  state.viewport = viewport;
  elements.previewCanvas.dataset.viewport = viewport;
  document.querySelectorAll('[data-viewport]').forEach((button) => {
    if (button.tagName === 'BUTTON') button.setAttribute('aria-pressed', String(button.dataset.viewport === viewport));
  });
}

applyPageCopy();
renderScenarioNavigation();
renderScenarioDetail();
renderInvocationContext();
renderFilterButtons();
renderList();
selectExhibit(state.selectedId);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.setAttribute('tabindex', '-1');
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    window.setTimeout(() => target.focus({ preventScroll: true }), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360);
  });
});

elements.search.addEventListener('input', (event) => {
  state.query = event.currentTarget.value;
  renderList();
});

elements.language.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-language]');
  if (button) setLanguage(button.dataset.language);
});

elements.openScenarioReport.addEventListener('click', () => {
  const scenario = scenarios.find((item) => item.id === state.useCase) ?? scenarios[0];
  state.activeCall = null;
  state.activeDeliverable = true;
  state.focusTitle = null;
  elements.scenarioCalls.querySelectorAll('.call-card').forEach((card) => {
    card.dataset.selected = 'false';
  });
  renderInvocationContext();
  resetExhibitDiscovery();
  selectExhibit(scenario.reportId, { updateHash: true, pushHash: true });
  showInvocationResult();
});

elements.returnToScenario.addEventListener('click', () => {
  const target = state.activeDeliverable
    ? elements.openScenarioReport
    : elements.scenarioCalls.querySelector(`.call-card[data-call="${state.activeCall}"] .run-call`);
  if (!target) return;
  target.scrollIntoView({
    behavior: 'instant',
    block: 'center',
  });
  target.focus({ preventScroll: true });
});

document.querySelector('.viewport-toggle').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-viewport]');
  if (button) setViewport(button.dataset.viewport);
});

elements.refresh.addEventListener('click', () => selectExhibit(state.selectedId, { reload: true }));
elements.frame.addEventListener('load', () => {
  setReady();
  window.setTimeout(focusFrameTarget, 160);
});

window.addEventListener('hashchange', () => {
  state.language = readInitialLanguage();
  state.useCase = readInitialUseCase();
  const invocation = readInitialInvocation(state.useCase);
  state.activeCall = invocation.activeCall;
  state.activeDeliverable = invocation.activeDeliverable;
  state.focusTitle = invocation.focusTitle;
  applyPageCopy();
  renderScenarioNavigation();
  renderScenarioDetail();
  renderInvocationContext();
  renderFilterButtons();
  renderList();
  selectExhibit(readInitialExhibit());
  window.setTimeout(focusFrameTarget, 180);
});
