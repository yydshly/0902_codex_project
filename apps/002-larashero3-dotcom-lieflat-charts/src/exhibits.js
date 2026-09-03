const localized = (zhTitle, zhSubtitle, zhDescription, enTitle, enSubtitle, enDescription, zhTags, enTags) => ({
  zh: { title: zhTitle, subtitle: zhSubtitle, description: zhDescription, tags: zhTags },
  en: { title: enTitle, subtitle: enSubtitle, description: enDescription, tags: enTags },
});

export const groups = [
  { id: 'all', label: { zh: '全部', en: 'All' } },
  { id: 'chart', label: { zh: '图表类型', en: 'Chart families' } },
  { id: 'report', label: { zh: '报告模板', en: 'Reports' } },
  { id: 'theme', label: { zh: '配色方案', en: 'Color themes' } },
  { id: 'example', label: { zh: '完整案例', en: 'Case studies' } },
];

export const exhibits = [
  {
    id: 'glance', group: 'chart', code: 'G01–G22',
    copy: localized(
      '快速读懂系列', '22 张图 · 适合周报、监控和汇报', '用粗柱、大数字和清晰排序，让读者在几秒内看懂高低、变化和异常。',
      'Glance charts', '22 charts · built for quick decisions', 'Bold bars, large numbers, and clear ranking help readers spot highs, changes, and anomalies in seconds.',
      ['快速判断', '排名', '监控', '动态图'], ['quick scan', 'ranking', 'monitoring', 'motion'],
    ),
    path: 'templates/glance-gallery.html',
  },
  {
    id: 'lupi', group: 'chart', code: 'L01–L20',
    copy: localized(
      '逐条细读系列', '20 张图 · 适合年报、研究和长文', '用细线、点阵、旁注和留白展开数据，尽量让每个点或每根线对应一条真实记录。',
      'Lupi editorial charts', '20 charts · for reports and long-form stories', 'Hairlines, dots, annotations, and whitespace preserve individual records for slower, closer reading.',
      ['逐条记录', '年报', '研究', 'SVG'], ['individual records', 'annual reports', 'research', 'SVG'],
    ),
    path: 'templates/lupi-gallery.html',
  },
  {
    id: 'basics', group: 'chart', code: 'F01–F17',
    copy: localized(
      '常用基础图表', '17 张图 · 熟悉的形状，更有编辑感', '保留柱状图、折线图、环形图、散点图、箱线图和 K 线等常见形式，适合数据不多的内容。',
      'Editorial basics', '17 charts · familiar forms, editorial finish', 'Familiar bars, lines, donuts, scatters, box plots, and candlesticks redesigned for small, focused datasets.',
      ['基础图表', '少量数据', 'SVG', 'ECharts'], ['basic charts', 'small data', 'SVG', 'ECharts'],
    ),
    path: 'templates/basics-gallery.html',
  },
  {
    id: 'maps', group: 'chart', code: 'M01–M02',
    copy: localized(
      '区域数据地图', '2 张图 · 美国州级和世界国家级', '按颜色深浅显示各地区数值；只有用户明确要求地图时才使用，需要联网加载地图数据。',
      'Regional data maps', '2 maps · US states and world countries', 'Shaded regional values, recalled only when a map is explicitly requested; online map data is required.',
      ['地图', '区域数值', '需要联网', 'ECharts'], ['maps', 'regional values', 'online data', 'ECharts'],
    ),
    path: 'templates/maps-gallery.html',
  },
  {
    id: 'big-circular', group: 'chart', code: 'B01',
    copy: localized(
      '环形关系网络', '60 个节点 · 查看谁和谁有关联', '把节点排在圆环上；鼠标移入一个节点时，只突出显示与它有关联的连接。',
      'Circular network', '60 nodes · inspect relationships', 'Nodes sit on a ring; hovering one node isolates its connected neighbors.',
      ['关系网络', '鼠标聚焦', 'ECharts'], ['network', 'hover focus', 'ECharts'],
    ),
    path: 'templates/big-circular.html',
  },
  {
    id: 'big-force', group: 'chart', code: 'B02',
    copy: localized(
      '可拖拽关系网络', '180 个节点 · 适合较大的网络', '节点会根据关系自动聚成网络，可以拖拽、缩放，并通过鼠标聚焦查看局部关系。',
      'Force-directed network', '180 nodes · for larger networks', 'Nodes cluster from their relationships and support drag, zoom, and focused inspection.',
      ['关系网络', '拖拽', '缩放', 'ECharts'], ['network', 'drag', 'zoom', 'ECharts'],
    ),
    path: 'templates/big-force.html',
  },
  {
    id: 'big-threads', group: 'chart', code: 'B03',
    copy: localized(
      '多段路径流向', '100 多条路径 · 逐条查看流向', '鼠标移入可以看一条路径或一组路径，点击后固定选择，并在状态栏读取具体数值。',
      'Thread paths', '100+ paths · inspect individual flows', 'Hover one path or a bundle, pin it with a click, and read its values in the status line.',
      ['路径', '流向', '固定选择', 'SVG'], ['paths', 'flows', 'pin selection', 'SVG'],
    ),
    path: 'templates/big-threads.html',
  },

  {
    id: 'porcelain-basics', group: 'theme', code: { zh: '青瓷蓝', en: 'Porcelain' },
    copy: localized(
      '青瓷蓝 · 基础图表', '蓝色深浅表示数值大小', '用同一组蓝色的深浅变化表达有顺序的数据，图表形状仍保持简单熟悉。',
      'Porcelain · Basics', 'Blue lightness encodes ordered values', 'A single blue hue varies in lightness for ordered data while familiar chart structures stay intact.',
      ['青瓷蓝', '基础图表', '有序数据'], ['porcelain', 'basics', 'ordered data'],
    ),
    path: 'templates/color/basics-porcelain.html',
  },
  {
    id: 'porcelain-glance', group: 'theme', code: { zh: '青瓷蓝', en: 'Porcelain' },
    copy: localized(
      '青瓷蓝 · 快读图表', '适合单一指标、排名和时间变化', '把青瓷蓝的深浅层次应用到快速判断图表中。',
      'Porcelain · Glance', 'For single metrics, ranking, and time', 'Porcelain lightness steps applied to charts designed for quick decisions.',
      ['青瓷蓝', '快速判断', '有序数据'], ['porcelain', 'quick scan', 'ordered data'],
    ),
    path: 'templates/color/glance-porcelain.html',
  },
  {
    id: 'porcelain-lupi', group: 'theme', code: { zh: '青瓷蓝', en: 'Porcelain' },
    copy: localized(
      '青瓷蓝 · 细读图表', '蓝色细线与点阵', '为逐条细读图表换上青瓷蓝，同时保留原来的数据结构和细节。',
      'Porcelain · Lupi', 'Blue hairlines and dots', 'Porcelain colors applied to detailed editorial charts without changing their structure.',
      ['青瓷蓝', '细读', '编辑图表'], ['porcelain', 'detail', 'editorial'],
    ),
    path: 'templates/color/lupi-porcelain.html',
  },
  {
    id: 'porcelain-maps', group: 'theme', code: { zh: '青瓷蓝', en: 'Porcelain' },
    copy: localized(
      '青瓷蓝 · 区域地图', '颜色越深，数值越大', '用蓝色深浅表达各地区数值，地图轮廓需要联网加载。',
      'Porcelain · Maps', 'Darker blue means a larger value', 'Blue lightness encodes regional values; map outlines load online.',
      ['青瓷蓝', '地图', '需要联网'], ['porcelain', 'maps', 'online data'],
    ),
    path: 'templates/color/maps-porcelain.html',
  },
  {
    id: 'porcelain-circular', group: 'theme', code: { zh: '青瓷蓝', en: 'Porcelain' },
    copy: localized(
      '青瓷蓝 · 环形网络', '深色背景上的蓝色关系图', '青瓷蓝版本的环形关系网络，通过亮度区分节点与连线层级。',
      'Porcelain · Circular network', 'Blue relationships on a dark field', 'A blue circular network that uses brightness to separate nodes and links.',
      ['青瓷蓝', '关系网络', '深色背景'], ['porcelain', 'network', 'dark field'],
    ),
    path: 'templates/color/big-circular-porcelain.html',
  },
  {
    id: 'porcelain-force', group: 'theme', code: { zh: '青瓷蓝', en: 'Porcelain' },
    copy: localized(
      '青瓷蓝 · 可拖拽网络', '180 个节点 · 支持拖拽和缩放', '青瓷蓝版本的大型关系网络，保留所有查看和操作能力。',
      'Porcelain · Force network', '180 nodes · drag and zoom', 'The large interactive network in the Porcelain color system.',
      ['青瓷蓝', '可拖拽网络', '交互'], ['porcelain', 'force network', 'interactive'],
    ),
    path: 'templates/color/big-force-porcelain.html',
  },
  {
    id: 'porcelain-threads', group: 'theme', code: { zh: '青瓷蓝', en: 'Porcelain' },
    copy: localized(
      '青瓷蓝 · 路径流向', '蓝色多段路径', '青瓷蓝版本的多段流向图，仍可逐条查看和固定选择。',
      'Porcelain · Thread paths', 'Blue multi-stage paths', 'Multi-stage flows in Porcelain, with inspection and pinning preserved.',
      ['青瓷蓝', '路径流向', '交互'], ['porcelain', 'paths', 'interactive'],
    ),
    path: 'templates/color/big-threads-porcelain.html',
  },

  {
    id: 'palm-basics', group: 'theme', code: { zh: '椰林绿', en: 'Palm' },
    copy: localized(
      '椰林绿 · 基础图表', '用不同颜色区分少量类别', '低饱和的绿色和黄色适合区分四到六个以内、没有先后顺序的类别。',
      'Palm · Basics', 'Color separates a few categories', 'Muted greens and yellows distinguish up to four to six unordered categories.',
      ['椰林绿', '基础图表', '分类'], ['palm', 'basics', 'categories'],
    ),
    path: 'templates/color/basics-palm.html',
  },
  {
    id: 'palm-glance', group: 'theme', code: { zh: '椰林绿', en: 'Palm' },
    copy: localized(
      '椰林绿 · 快读图表', '快速区分少量类别', '在快速判断图表中，用绿色和黄色帮助读者区分少量类别。',
      'Palm · Glance', 'Quickly separate a few categories', 'Muted greens and yellows distinguish small category sets in quick-scan charts.',
      ['椰林绿', '快速判断', '分类'], ['palm', 'quick scan', 'categories'],
    ),
    path: 'templates/color/glance-palm.html',
  },
  {
    id: 'palm-lupi', group: 'theme', code: { zh: '椰林绿', en: 'Palm' },
    copy: localized(
      '椰林绿 · 细读图表', '绿色细线与逐条记录', '为逐条细读图表换上低饱和绿黄色，同时保留原有细节。',
      'Palm · Lupi', 'Green hairlines and individual records', 'Muted green and yellow applied to detailed editorial charts.',
      ['椰林绿', '细读', '编辑图表'], ['palm', 'detail', 'editorial'],
    ),
    path: 'templates/color/lupi-palm.html',
  },
  {
    id: 'palm-maps', group: 'theme', code: { zh: '椰林绿', en: 'Palm' },
    copy: localized(
      '椰林绿 · 区域地图', '自然色调的地域分布', '用椰林绿色系显示美国州级和世界国家级数据。',
      'Palm · Maps', 'Regional data in natural colors', 'US state and world country data in the Palm color system.',
      ['椰林绿', '地图', '需要联网'], ['palm', 'maps', 'online data'],
    ),
    path: 'templates/color/maps-palm.html',
  },
  {
    id: 'palm-circular', group: 'theme', code: { zh: '椰林绿', en: 'Palm' },
    copy: localized(
      '椰林绿 · 环形网络', '深色背景上的绿色关系图', '椰林绿版本的环形关系网络，可以通过鼠标聚焦关联节点。',
      'Palm · Circular network', 'Green relationships on a dark field', 'A Palm-colored circular network with hover-based relationship focus.',
      ['椰林绿', '关系网络', '深色背景'], ['palm', 'network', 'dark field'],
    ),
    path: 'templates/color/big-circular-palm.html',
  },
  {
    id: 'palm-force', group: 'theme', code: { zh: '椰林绿', en: 'Palm' },
    copy: localized(
      '椰林绿 · 可拖拽网络', '180 个节点 · 支持拖拽和缩放', '椰林绿版本的大型关系网络，保留所有交互能力。',
      'Palm · Force network', '180 nodes · drag and zoom', 'The large interactive network in the Palm color system.',
      ['椰林绿', '可拖拽网络', '交互'], ['palm', 'force network', 'interactive'],
    ),
    path: 'templates/color/big-force-palm.html',
  },
  {
    id: 'palm-threads', group: 'theme', code: { zh: '椰林绿', en: 'Palm' },
    copy: localized(
      '椰林绿 · 路径流向', '绿色多段路径', '椰林绿版本的多段流向图，可以逐条查看和固定选择。',
      'Palm · Thread paths', 'Green multi-stage paths', 'Multi-stage flows in Palm, with inspection and pinning preserved.',
      ['椰林绿', '路径流向', '交互'], ['palm', 'paths', 'interactive'],
    ),
    path: 'templates/color/big-threads-palm.html',
  },

  {
    id: 'wire-basics', group: 'theme', code: { zh: '编辑部红', en: 'Wire' },
    copy: localized(
      '编辑部红 · 基础图表', '黑白灰中只突出一个重点', '大部分数据保持灰色，只用一个橙红色标出最需要关注的内容。',
      'Wire · Basics', 'One focal point in grayscale', 'Most data stays gray while one orange-red accent marks the focal point.',
      ['编辑部红', '基础图表', '单一重点'], ['wire', 'basics', 'single focus'],
    ),
    path: 'templates/color/basics-wire.html',
  },
  {
    id: 'wire-glance', group: 'theme', code: { zh: '编辑部红', en: 'Wire' },
    copy: localized(
      '编辑部红 · 快读图表', '第一眼只看到一个重点', '在快速判断图表中，用单一橙红色控制读者的第一落点。',
      'Wire · Glance', 'One immediate focal point', 'A single orange-red accent controls the first point of attention in quick-scan charts.',
      ['编辑部红', '快速判断', '单一重点'], ['wire', 'quick scan', 'single focus'],
    ),
    path: 'templates/color/glance-wire.html',
  },
  {
    id: 'wire-lupi', group: 'theme', code: { zh: '编辑部红', en: 'Wire' },
    copy: localized(
      '编辑部红 · 细读图表', '逐条记录中只强调一个主角', '所有记录仍可细读，但只有一个明确主角使用橙红色。',
      'Wire · Lupi', 'One hero among detailed records', 'All records remain readable while a single hero receives the orange-red accent.',
      ['编辑部红', '细读', '单一重点'], ['wire', 'detail', 'single focus'],
    ),
    path: 'templates/color/lupi-wire.html',
  },
  {
    id: 'wire-maps', group: 'theme', code: { zh: '编辑部红', en: 'Wire' },
    copy: localized(
      '编辑部红 · 区域地图', '灰色地图中突出一个地区', '地图整体保持灰色，只用橙红色强调一个明确区域。',
      'Wire · Maps', 'One region highlighted in grayscale', 'The map stays grayscale while one region receives the orange-red accent.',
      ['编辑部红', '地图', '单一重点'], ['wire', 'maps', 'single focus'],
    ),
    path: 'templates/color/maps-wire.html',
  },

  {
    id: 'report-index', group: 'report', code: 'R00',
    copy: localized(
      '12 套报告总览', '先看缩略图，再选择完整报告', '集中查看全部报告模板，并进入对应的中文或英文版本。',
      'All 12 report templates', 'Compare previews before opening a report', 'Browse every report template and open its Chinese or English version.',
      ['报告', '缩略图', '总览'], ['reports', 'previews', 'overview'],
    ),
    path: 'templates/reports/index.html',
  },
  {
    id: 'report-01', group: 'report', code: 'R01',
    copy: localized(
      '调研一页纸', '主结论 + 方法与样本侧栏', '适合调研、研究简报、市场洞察和白皮书开篇。',
      'Survey one-pager', 'Main findings with a methods rail', 'For surveys, research briefs, market insight, and white-paper openings.',
      ['调研', '研究简报', '白皮书'], ['survey', 'research brief', 'white paper'],
    ),
    pathZh: 'templates/reports/report-01.zh.html', pathEn: 'templates/reports/report-01.en.html',
  },
  {
    id: 'report-02', group: 'report', code: 'R02',
    copy: localized(
      '年度里程碑', '里程碑 + 趋势 + 年度大数', '适合年度复盘、业绩回顾、投资人更新和项目里程碑。',
      'Annual milestones', 'Milestones, trends, and headline metrics', 'For annual reviews, performance recaps, investor updates, and project milestones.',
      ['年度复盘', '业绩', '里程碑'], ['annual review', 'performance', 'milestones'],
    ),
    pathZh: 'templates/reports/report-02.zh.html', pathEn: 'templates/reports/report-02.en.html',
  },
  {
    id: 'report-03', group: 'report', code: 'R03',
    copy: localized(
      '年度数据海报', '大标题 + 多张小图 + 时间分布', '适合年度数据报告、经营回顾、个人年记和对外海报。',
      'Year in data poster', 'Large title, small multiples, and time', 'For annual data reports, business recaps, personal records, and public posters.',
      ['年报', '数据海报', '对外传播'], ['annual report', 'data poster', 'publishing'],
    ),
    pathZh: 'templates/reports/report-03.zh.html', pathEn: 'templates/reports/report-03.en.html',
  },
  {
    id: 'report-04', group: 'report', code: 'R04',
    copy: localized(
      '月度运营报告', '每日趋势 + 排名 + 关键数字', '适合业务月报、财务经营复盘和周期性监控。',
      'Monthly operations', 'Daily trends, rankings, and key numbers', 'For monthly business reports, financial reviews, and recurring monitoring.',
      ['月报', '运营', '财务'], ['monthly report', 'operations', 'finance'],
    ),
    pathZh: 'templates/reports/report-04.zh.html', pathEn: 'templates/reports/report-04.en.html',
  },
  {
    id: 'report-05', group: 'report', code: 'R05',
    copy: localized(
      '影响力故事', '窄栏叙事 + 重点数字', '适合项目复盘、公益案例、产品记录和个人成长故事。',
      'Impact story', 'Narrow narrative with highlighted numbers', 'For project retrospectives, nonprofit cases, product records, and personal growth stories.',
      ['项目复盘', '故事', '影响力'], ['retrospective', 'story', 'impact'],
    ),
    pathZh: 'templates/reports/report-05.zh.html', pathEn: 'templates/reports/report-05.en.html',
  },
  {
    id: 'report-06', group: 'report', code: 'R06',
    copy: localized(
      '长期发展年鉴', '多年趋势 + 复杂证据', '适合产品或公司历史、多年经营趋势和长期个人记录。',
      'Long-term almanac', 'Multi-year trends and dense evidence', 'For product or company histories, long-running business trends, and personal records.',
      ['年鉴', '长期趋势', '复杂报告'], ['almanac', 'long-term trends', 'dense report'],
    ),
    pathZh: 'templates/reports/report-06.zh.html', pathEn: 'templates/reports/report-06.en.html',
  },
  {
    id: 'report-07', group: 'report', code: 'R07',
    copy: localized(
      '调研拼贴海报', '大数字 + 多图杂志拼贴', '适合用户研究、市场调研、活动数据和社交媒体传播。',
      'Survey collage poster', 'Large numbers in a magazine collage', 'For user research, market studies, event data, and social publishing.',
      ['调研', '拼贴', '海报'], ['survey', 'collage', 'poster'],
    ),
    pathZh: 'templates/reports/report-07.zh.html', pathEn: 'templates/reports/report-07.en.html',
  },
  {
    id: 'report-08', group: 'report', code: 'R08',
    copy: localized(
      '人群画像一页纸', '一句结论 + 可数人群点阵', '适合用户画像、政策简报、市场细分和社会经济数据。',
      'Population one-pager', 'One statement with countable people', 'For audience profiles, policy briefs, market segments, and socioeconomic data.',
      ['人群画像', '市场细分', '政策'], ['population', 'segmentation', 'policy'],
    ),
    pathZh: 'templates/reports/report-08.zh.html', pathEn: 'templates/reports/report-08.en.html',
  },
  {
    id: 'report-09', group: 'report', code: 'R09',
    copy: localized(
      '数据总览仪表盘', '多块图表 + 关键指标', '适合业务总览、经营驾驶舱、市场对比和关键指标快照。',
      'Data story dashboard', 'Multiple charts with key metrics', 'For business overviews, operating dashboards, market comparisons, and KPI snapshots.',
      ['业务总览', '关键指标', '仪表盘'], ['business overview', 'KPI', 'dashboard'],
    ),
    pathZh: 'templates/reports/report-09.zh.html', pathEn: 'templates/reports/report-09.en.html',
  },
  {
    id: 'report-10', group: 'report', code: 'R10',
    copy: localized(
      '旅行与生活手记', '故事段落 + 小图 + 行程表', '不仅适合旅行，也能记录运动、个人年度数据和轻量项目日志。',
      'Travel and life notebook', 'Narrative, small charts, and itinerary', 'For travel, sport, personal yearly data, and lightweight project journals.',
      ['旅行', '运动', '个人记录'], ['travel', 'sport', 'personal record'],
    ),
    pathZh: 'templates/reports/report-10.zh.html', pathEn: 'templates/reports/report-10.en.html',
  },
  {
    id: 'report-11', group: 'report', code: 'R11',
    copy: localized(
      '研究简报卡片', '固定尺寸 · 适合单张分享', '适合金融经济快报、研究结论、社交媒体卡片和汇报插页。',
      'Research brief card', 'Fixed frame · designed for sharing', 'For financial updates, research findings, social cards, and presentation inserts.',
      ['研究简报', '金融', '分享卡片'], ['research brief', 'finance', 'share card'],
    ),
    pathZh: 'templates/reports/report-11.zh.html', pathEn: 'templates/reports/report-11.en.html',
  },
  {
    id: 'report-12', group: 'report', code: 'R12',
    copy: localized(
      '周报速览', '区间 + 排名 + 关键指标', '把一周最重要的变化、排名和异常放在一屏内快速阅读。',
      'Weekly glance', 'Ranges, rankings, and key metrics', 'The week’s most important changes, rankings, and anomalies on one quick-scanning page.',
      ['周报', '监控', '业务快报'], ['weekly report', 'monitoring', 'business update'],
    ),
    pathZh: 'templates/reports/report-12.zh.html', pathEn: 'templates/reports/report-12.en.html',
  },

  {
    id: 'example-lenny', group: 'example', code: { zh: '案例 01', en: 'Case 01' },
    copy: localized(
      '公开调研完整案例', '一份调研如何变成多图故事页', '使用公开调研数据，展示从多个结论到一组编辑式图表的最终效果。',
      'Public survey case study', 'From one survey to a multi-chart story', 'Public survey data shaped into a complete editorial data story.',
      ['公开数据', '调研', '多图故事'], ['public data', 'survey', 'data story'],
    ),
    path: 'examples/lenny-2026-survey.html',
  },
  {
    id: 'example-finance', group: 'example', code: { zh: '案例 02', en: 'Case 02' },
    copy: localized(
      '财务报告改编案例', '演示如何把月报模板改成财务报告', '使用虚构数据，重点展示同一套报告版式如何迁移到不同业务内容。',
      'Financial report adaptation', 'Turning an operations report into finance', 'Fictional data demonstrates how one report structure can move across business contexts.',
      ['财务报告', '模板改编', '虚构数据'], ['financial report', 'template adaptation', 'fictional data'],
    ),
    path: 'examples/reports/r04-financial-report.zh.html',
  },
];
