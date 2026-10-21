// test_cases_logic.js
// 纯模块单测：测试案例状态切换与全量中文规范
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

test("CASE_REGISTRY 包含三大核心案例且全量中文命名", () => {
  const keys = Object.keys(CASE_REGISTRY);
  if (keys.length !== 3) throw new Error(`期望 3 个案例，实际有 ${keys.length}`);
  if (!keys.includes("case-01") || !keys.includes("case-02") || !keys.includes("case-03")) {
    throw new Error("缺少必需案例 ID");
  }
  if (CASE_REGISTRY["case-01"].code !== "案例一") throw new Error("案例一命名不合规");
  if (CASE_REGISTRY["case-02"].code !== "案例二") throw new Error("案例二命名不合规");
  if (CASE_REGISTRY["case-03"].code !== "案例三") throw new Error("案例三命名不合规");
});

test("学员 A 数据符合 2 个月力量减脂与体态重塑设定", () => {
  const c1 = CASE_REGISTRY["case-01"];
  if (c1.durationMonths !== 2) throw new Error("学员 A 周期应为 2 个月");
  if (c1.weightLossKg !== 6.5) throw new Error("减脂斤数不匹配");
  if (c1.targetWeightKg !== 72.0) throw new Error("交付体重不匹配");
});

test("学员 B 数据符合 140 斤减至 58kg 再减至 53kg 设定", () => {
  const c2 = CASE_REGISTRY["case-02"];
  if (c2.initialWeightJin !== 140) throw new Error("学员 B 初始体重应为 140 斤");
  if (c2.stageWeightKg !== 58.0 || c2.targetWeightKg !== 53.0) throw new Error("减脂阶段目标不匹配");
  if (c2.durationMonths !== 7) throw new Error("周期应为 7 个月");
});

test("学员 C 数据已修正至 59.0kg", () => {
  const c3 = CASE_REGISTRY["case-03"];
  if (c3.targetWeightKg !== 59.0) throw new Error("学员 C 目标体重必须为 59.0kg");
  if (c3.weightLossKg !== 23.5) throw new Error("净减重应为 23.5kg");
});

test("切换至合法案例能返回正确数据", () => {
  const res = getActiveCaseState("case-02", "case-01");
  if (!res.success) throw new Error("切换失败");
  if (res.activeId !== "case-01") throw new Error("activeId 不匹配");
});

if (fails > 0) {
  process.exit(1);
} else {
  console.log("\n案例纯模块单测全部通过！[OK]");
}
