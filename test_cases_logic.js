// test_cases_logic.js
// 纯模块单测：测试案例状态切换与数据检索
const { CASE_REGISTRY, getActiveCaseState } = require("./casesLogic");

let fails = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    fails++;
  }
}

test("CASE_REGISTRY 包含三大核心案例", () => {
  const keys = Object.keys(CASE_REGISTRY);
  if (keys.length !== 3) throw new Error(`期望 3 个案例，实际有 ${keys.length}`);
  if (!keys.includes("case-01") || !keys.includes("case-02") || !keys.includes("case-03")) {
    throw new Error("缺少必需案例编号");
  }
});

test("切换至合法案例能返回正确数据", () => {
  const res = getActiveCaseState("case-02", "case-01");
  if (!res.success) throw new Error("切换失败");
  if (res.activeId !== "case-01") throw new Error("activeId 不匹配");
  if (res.data.initialWeightKg !== 41.6) throw new Error("数据字段错误");
});

test("切换至非法案例被安全拦截", () => {
  const res = getActiveCaseState("case-02", "case-999");
  if (res.success) throw new Error("非法 ID 不应成功");
  if (res.activeId !== "case-02") throw new Error("应维持原状态");
});

test("案例数据无空缺或脱敏隐患", () => {
  for (const [id, item] of Object.entries(CASE_REGISTRY)) {
    if (!item.code || !item.client || !item.coreFocus.length) {
      throw new Error(`案例 ${id} 数据缺损`);
    }
    // 确保名字为脱敏化名（如 学员 A）
    if (!item.client.startsWith("学员")) {
      throw new Error(`案例 ${id} 未脱敏: ${item.client}`);
    }
  }
});

if (fails > 0) {
  process.exit(1);
} else {
  console.log("\n案例纯模块单测全部通过！[OK]");
}
