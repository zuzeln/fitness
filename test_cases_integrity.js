// test_cases_integrity.js
// 命令行自动化体检脚本：验证案例库素材完整性、DOM规范、深色去黑边与零Emoji规范

const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const htmlPath = path.join(rootDir, "index.html");
const casesDir = path.join(rootDir, "cases");

let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    failedTests++;
  }
}

console.log("=== 开始执行案例库与页面完整性体检 ===\n");

// 1. 验证 cases 目录及 8 张核心案例图片真实存在且非空
const requiredImages = [
  "case01_posture_front.jpg",
  "case01_posture_side.jpg",
  "case01_posture_back.jpg",
  "case02_posture_front.jpg",
  "case02_posture_side.jpg",
  "case02_posture_back.jpg",
  "case02_comparison.jpg",
  "case03_comparison.jpg"
];

assert(fs.existsSync(casesDir), "cases 目录必须存在");

requiredImages.forEach(imgName => {
  const imgPath = path.join(casesDir, imgName);
  const exists = fs.existsSync(imgPath);
  let sizeOk = false;
  if (exists) {
    const stats = fs.statSync(imgPath);
    sizeOk = stats.size > 10 * 1024; // 大于 10KB
  }
  assert(exists && sizeOk, `案例图片 ${imgName} 真实存在且体积正常 (>10KB)`);
});

// 2. 验证 index.html 文件与案例结构
assert(fs.existsSync(htmlPath), "index.html 必须存在");
const htmlContent = fs.readFileSync(htmlPath, "utf8");

assert(htmlContent.includes("class=\"cases-section\""), "包含 cases-section 案例主模块");
assert(htmlContent.includes("case-tab-btn"), "包含案例 Tab 切换按钮");
assert(htmlContent.includes("CASE-01") && htmlContent.includes("CASE-02") && htmlContent.includes("CASE-03"), "包含 3 大标准化案例编号");
assert(htmlContent.includes("switchCaseTab"), "包含 switchCaseTab 案例切换纯逻辑函数");

// 3. 严格规范扫描：深色模式去黑边规范（禁止 #000 / #000000 出现在容器背景）
const blackBgMatch = htmlContent.match(/background(-color)?:\s*#000(000)?/i);
assert(!blackBgMatch, "多媒体展示与容器底色严禁使用 #000 / #000000 纯黑底色");

// 4. 严格规范扫描：零 Emoji 铁律
const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
const hasEmoji = emojiRegex.test(htmlContent);
assert(!hasEmoji, "全站零 Emoji 铁律：严禁使用任何 Emoji 图标");

// 5. 严格规范扫描：严禁使用 Unicode 符号代替 SVG (如 ✕, ×, ✓ 等)
const forbiddenSymbols = ["✕", "×", "✓", "✔", "▲", "▶", "★"];
let foundForbidden = false;
for (const sym of forbiddenSymbols) {
  if (htmlContent.includes(sym)) {
    console.error(`检测到违规字符: "${sym}"，请替换为原生 Inline SVG`);
    foundForbidden = true;
    break;
  }
}
assert(!foundForbidden, "功能与交互图标一律使用原生 Inline SVG，无违规 Unicode 符号");

console.log("\n=== 体检结果汇总 ===");
if (failedTests === 0) {
  console.log("所有自动化测试项全部通过！[OK]");
  process.exit(0);
} else {
  console.error(`共有 ${failedTests} 项测试失败，请排查修正。`);
  process.exit(1);
}
