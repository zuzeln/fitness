// test_cases_integrity.js
// 命令行自动化体检脚本：验证案例库素材完整性、JS语法、体积优化、深色去黑边与零Emoji规范

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlPath = path.join(rootDir, 'index.html');
const casesDir = path.join(rootDir, 'cases');

let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    failedTests++;
  }
}

console.log('=== 开始执行案例库与页面完整性体检 ===\n');

// 1. 验证 cases 目录及核心案例图片真实存在且非空，且完成体积压缩（小于 1MB，大于 10KB）
const requiredImages = [
  'case01_male_front_comparison.jpg',
  'case01_male_back_comparison.jpg',
  'case02_posture_front.jpg',
  'case02_posture_side.jpg',
  'case02_posture_back.jpg',
  'case02_comparison.jpg',
  'case03_comparison.jpg',
  'case04_fatloss_before.jpg',
  'case04_fatloss_after.jpg',
  'case05_physique_prep_front.jpg',
  'case05_physique_prep_back.jpg',
  'case05_physique_stage_front.jpg',
  'case05_physique_stage_back.jpg',
  'case05_front_comparison.jpg',
  'case05_back_comparison.jpg'
];

assert(fs.existsSync(casesDir), 'cases 目录必须存在');

requiredImages.forEach(imgName => {
  const imgPath = path.join(casesDir, imgName);
  const exists = fs.existsSync(imgPath);
  let sizeOk = false;
  let compressedOk = false;
  if (exists) {
    const stats = fs.statSync(imgPath);
    sizeOk = stats.size > 10 * 1024; // 大于 10KB
    compressedOk = stats.size < 1024 * 1024; // 严格小于 1MB，保障手机极速秒开
  }
  assert(exists && sizeOk && compressedOk, `案例图片 ${imgName} 存在且已优化体积 (<1MB)`);
});

// 2. 验证证书与随照抠图优化体积
const certImages = ['IFBB_认证私教证书.jpg', 'IBFA_国际体适能教练证书.jpg', 'AHA_急救卡.png'];
certImages.forEach(imgName => {
  const imgPath = path.join(rootDir, 'certificates', imgName);
  if (fs.existsSync(imgPath)) {
    const stats = fs.statSync(imgPath);
    assert(stats.size < 500 * 1024, `证书图片 ${imgName} 经压缩后体积正常 (${(stats.size/1024).toFixed(1)}KB < 500KB)`);
  }
});

const coachPhotos = [
  'coach_photo_01.jpg',
  'coach_photo_02.jpg',
  'coach_photo_03.jpg',
  'coach_photo_04.jpg',
  'coach_photo_05.jpg'
];
const photosDir = path.join(rootDir, 'photos');
assert(fs.existsSync(photosDir), 'photos 随照目录必须存在');
coachPhotos.forEach(photoName => {
  const pPath = path.join(photosDir, photoName);
  const exists = fs.existsSync(pPath);
  let sizeOk = false;
  let compressedOk = false;
  if (exists) {
    const stats = fs.statSync(pPath);
    sizeOk = stats.size > 10 * 1024;
    compressedOk = stats.size < 1024 * 1024; // 严格小于 1MB
  }
  assert(exists && sizeOk && compressedOk, `随照原图 ${photoName} 存在且体积小于 1MB`);
});

// 3. 验证 index.html 文件与 JS 脚本语法无错误
assert(fs.existsSync(htmlPath), 'index.html 必须存在');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
assert(scriptMatch && scriptMatch[1], '包含有效的 <script> 标签');
let jsValid = false;
try {
  new Function(scriptMatch[1]);
  jsValid = true;
} catch (e) {
  console.error('JS Syntax Error in index.html:', e.message);
}
assert(jsValid, 'index.html 中的 JavaScript 语法 100% 正确无报错');

assert(htmlContent.includes('class="cases-section"'), '包含 cases-section 案例主模块');
assert(htmlContent.includes('case-tab-btn'), '包含案例 Tab 切换按钮');
assert(htmlContent.includes('案例一') && htmlContent.includes('案例二') && htmlContent.includes('案例三') && htmlContent.includes('案例四') && htmlContent.includes('案例五'), '全量中文规范：包含 5 大标准化案例名称');
assert(htmlContent.includes('panel-case-04') && htmlContent.includes('panel-case-05'), '包含案例四与案例五内容面板');
assert(htmlContent.includes('学员 D') && htmlContent.includes('健体选手 E'), '包含学员 D 与健体选手 E 执教案例');
assert(htmlContent.includes('瑞兹卡杯') && htmlContent.includes('132 号'), '案例五包含瑞兹卡杯健体赛官方执教纪实');
assert(htmlContent.includes('case05_front_comparison.jpg') && htmlContent.includes('case05_back_comparison.jpg'), '案例五包含正面与背面双视角备赛蜕变对比照');
assert(htmlContent.includes('20 周') && htmlContent.includes('5个月 (20周)'), '案例四减脂周期校准为 20周 (5个月)');
assert(htmlContent.includes('16 周') && htmlContent.includes('16周系统科学备赛'), '案例五备赛周期校准为 16周 (4个月)');
assert(!htmlContent.includes('参赛备案 132 号') && !htmlContent.includes('参赛备案'), '已按要求彻底移除 (参赛备案 132 号)');
assert(!htmlContent.includes('CASE-01') && !htmlContent.includes('CASE-02') && !htmlContent.includes('CASE-03') && !htmlContent.includes('CASE-04') && !htmlContent.includes('CASE-05'), '全量中文规范：已彻底清除 CASE 英文代号');
assert(!htmlContent.includes('居家'), '文案纯净性：已彻底清除所有“居家”字样');
assert(!htmlContent.includes('140 斤') && !htmlContent.includes('140斤'), '案例二体重规范：已彻底清除“140 斤/140斤”，统一为 70 公斤/70kg');

assert(htmlContent.includes('away_oflife'), '联系方式规范：微信号已更新为 away_oflife');
assert(htmlContent.includes('handleContactClick'), '联系方式交互：卡片点击自动复制并跳转 (handleContactClick)');
assert(!htmlContent.includes('btn-action-copy'), '联系方式交互：已彻底移除独立复制按钮 (btn-action-copy)');
assert(htmlContent.includes('contact-action-arrow'), '联系方式交互：包含右侧跳转微指示箭头');

assert(htmlContent.includes('stack-container'), '拟物照片展台：包含 stack-container 容器');
assert(htmlContent.includes('stack-deck'), '拟物照片展台：包含 stack-deck 堆叠层');
assert(htmlContent.includes('initPhotoStack'), '拟物照片展台：包含 initPhotoStack 物理拖拽与滑动逻辑');
assert(htmlContent.includes('calculateDragFrame'), '拟物照片展台：包含左右对称动态跟手计算 calculateDragFrame');
assert(htmlContent.includes('applyCardStyle'), '拟物照片展台：包含 applyCardStyle 物理渲染');
assert(htmlContent.includes('nextStackPhoto') && htmlContent.includes('prevStackPhoto'), '拟物照片展台：支持向后滑/左右翻转物理动作');
assert(htmlContent.includes('resetHorizontalScroll'), '移动端视口防护：包含 resetHorizontalScroll 防止左右漂移');

assert(!htmlContent.includes('执教随照'), '照片展台纯净性：已彻底清除“执教随照”');
assert(!htmlContent.includes('轻拖翻看物理照片堆'), '照片展台纯净性：已彻底清除“左右滑动或轻拖翻看物理照片堆”提示语');
assert(!htmlContent.includes('stack-card-tag'), '照片展台纯净性：已彻底清除卡片底部标签 (stack-card-tag)');
assert(!htmlContent.includes('stackIndicator'), '照片展台纯净性：已彻底清除 1/6 指示器');

assert(htmlContent.includes('switchCaseTab'), '包含 switchCaseTab 案例切换函数');
assert(htmlContent.includes('modalDetailBox'), '包含弹窗诊断细节 modalDetailBox 容器');
assert(htmlContent.includes('comparison-detail-banner'), '对比照下方包含明确执教诊断成效标注');

// 3.1 验证面向会员的界面纯净性：已彻底移除面向员工的四大销售数据横栏
assert(!htmlContent.includes('<section class="metrics-bar">') && !htmlContent.includes('class="metric-cell"'), '数据纯净性：已彻底移除顶部四项数据横栏 (metrics-bar)');
assert(!htmlContent.includes('门店月度销售业绩') && !htmlContent.includes('01 / HOURS'), '数据纯净性：已彻底移除面向员工KPI的顶栏指标');
assert(htmlContent.includes('阶段销售业绩超 200 万元，带教超 1700+ 课时'), '时间线 7 号铁馆：阶段销售 200 万元与 1700+ 课时');
assert(htmlContent.includes('阶段销售额超 100 万元，累计带教超 1000+ 课时'), '时间线 pop fit：阶段销售 100 万元与 1000+ 课时');
assert(htmlContent.includes('阶段销售额超 80 万元，累计带教超 800+ 课时'), '时间线星之健身：阶段销售 80 万元与 800+ 课时');

// 3.2 验证专业能力与核心优势、职业信念与自我评价模块完整性
assert(htmlContent.includes('专业能力与核心优势'), '包含【专业能力与核心优势】板块');
assert(htmlContent.includes('职业信念与自我评价'), '包含【职业信念与自我评价】板块');
assert(htmlContent.includes('坚信优秀的私教服务依靠扎实的专业交付与情绪价值立足，而非推销套路'), '包含自我评价之职业信念核心文案');
assert(htmlContent.includes('性格沉稳谦逊，懂得分寸与边界，严守客户隐私；注重陪伴与倾听，让训练过程纯粹舒适'), '包含自我评价之服务素养核心文案');
assert(htmlContent.includes('身体力行保持自律生活方式，形象健康清爽，深度契合中高端健身工作室与私人会所的专业标准'), '包含自我评价之环境契合核心文案');
assert(!htmlContent.includes('场地爱护') && !htmlContent.includes('具备守时自律与场地爱护意识'), '简历纯净性：彻底清除“场地爱护意识”臆造套话');

// 4. 严格规范扫描：深色模式去黑边规范（禁止 #000 / #000000 出现在容器背景）
const blackBgMatch = htmlContent.match(/background(-color)?:\s*#000(000)?/i);
assert(!blackBgMatch, '多媒体展示与容器底色严禁使用 #000 / #000000 纯黑底色');

// 5. 严格规范扫描：零 Emoji 铁律
const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const hasEmoji = emojiRegex.test(htmlContent);
assert(!hasEmoji, '全站零 Emoji 铁律：严禁使用任何 Emoji 图标');

// 6. 严格规范扫描：严禁使用 Unicode 符号代替 SVG (如 ✕, ×, ✓ 等)
const forbiddenSymbols = ['✕', '×', '✓', '✔', '▲', '▶', '★'];
let foundForbidden = false;
for (const sym of forbiddenSymbols) {
  if (htmlContent.includes(sym)) {
    console.error(`检测到违规字符: "${sym}"，请替换为原生 Inline SVG`);
    foundForbidden = true;
    break;
  }
}
assert(!foundForbidden, '功能与交互图标一律使用原生 Inline SVG，无违规 Unicode 符号');

console.log('\n=== 体检结果汇总 ===');
if (failedTests === 0) {
  console.log('所有自动化测试项全部通过！[OK]');
  process.exit(0);
} else {
  console.error(`共有 ${failedTests} 项测试失败，请排查修正。`);
  process.exit(1);
}
