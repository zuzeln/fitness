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

test("CASE_REGISTRY 包含五大核心案例且全量中文命名", () => {
  const keys = Object.keys(CASE_REGISTRY);
  if (keys.length !== 5) throw new Error(`期望 5 个案例，实际有 ${keys.length}`);
  const required = ["case-01", "case-02", "case-03", "case-04", "case-05"];
  required.forEach(k => {
    if (!keys.includes(k)) throw new Error(`缺少必需案例 ID: ${k}`);
  });
  if (CASE_REGISTRY["case-01"].code !== "案例一") throw new Error("案例一命名不合规");
  if (CASE_REGISTRY["case-02"].code !== "案例二") throw new Error("案例二命名不合规");
  if (CASE_REGISTRY["case-03"].code !== "案例三") throw new Error("案例三命名不合规");
  if (CASE_REGISTRY["case-04"].code !== "案例四") throw new Error("案例四命名不合规");
  if (CASE_REGISTRY["case-05"].code !== "案例五") throw new Error("案例五命名不合规");
});

test("学员 A 数据符合 2 个月力量减脂与体态重塑设定", () => {
  const c1 = CASE_REGISTRY["case-01"];
  if (c1.durationMonths !== 2) throw new Error("学员 A 周期应为 2 个月");
  if (c1.weightLossKg !== 6.5) throw new Error("减脂斤数不匹配");
  if (c1.targetWeightKg !== 72.0) throw new Error("交付体重不匹配");
});

test("学员 B 数据符合 70kg 减至 58kg 再减至 53kg 设定", () => {
  const c2 = CASE_REGISTRY["case-02"];
  if (c2.initialWeightKg !== 70.0) throw new Error("学员 B 初始体重应为 70.0kg");
  if (c2.stageWeightKg !== 58.0 || c2.targetWeightKg !== 53.0) throw new Error("减脂阶段目标不匹配");
  if (c2.durationMonths !== 7) throw new Error("周期应为 7 个月");
});

test("学员 C 数据符合大基数 82.5kg 减至 59.0kg 设定", () => {
  const c3 = CASE_REGISTRY["case-03"];
  if (c3.targetWeightKg !== 59.0) throw new Error("学员 C 目标体重必须为 59.0kg");
  if (c3.weightLossKg !== 23.5) throw new Error("净减重应为 23.5kg");
});

test("学员 D 数据符合 82.0kg 降至 68.5kg 且腰围缩减 16cm 设定", () => {
  const c4 = CASE_REGISTRY["case-04"];
  if (c4.initialWeightKg !== 82.0) throw new Error("学员 D 初始体重应为 82.0kg");
  if (c4.targetWeightKg !== 68.5) throw new Error("学员 D 目标体重应为 68.5kg");
  if (c4.weightLossKg !== 13.5) throw new Error("净减重应为 13.5kg (27斤)");
  if (c4.waistLossCm !== 16.0) throw new Error("腰围缩减应为 16.0cm");
  if (c4.durationMonths !== 4) throw new Error("周期应为 4 个月 (16周)");
});

test("健体选手 E 数据符合 86.5kg 刷至 74.2kg 且体脂 5.2% 赛级设定", () => {
  const c5 = CASE_REGISTRY["case-05"];
  if (c5.initialWeightKg !== 86.5) throw new Error("健体选手 E 备赛初始体重应为 86.5kg");
  if (c5.targetWeightKg !== 74.2) throw new Error("健体选手 E 登台体重应为 74.2kg");
  if (c5.targetBodyFatPercent !== 5.2) throw new Error("登台体脂率应为 5.2%");
  if (c5.weightLossKg !== 12.3) throw new Error("净减脂水分应为 12.3kg");
});

test("切换至合法案例能返回正确数据", () => {
  const res1 = getActiveCaseState("case-01", "case-04");
  if (!res1.success || res1.activeId !== "case-04") throw new Error("切换至案例四失败");
  const res2 = getActiveCaseState("case-04", "case-05");
  if (!res2.success || res2.activeId !== "case-05") throw new Error("切换至案例五失败");
});

if (fails > 0) {
  process.exit(1);
} else {
  console.log("\n案例纯模块单测全部通过！[OK]");
}
