// casesLogic.js
// 纯逻辑模块：案例 Tab 状态机与数据查询（纯数据输入输出，全量中文规范）

const CASE_REGISTRY = {
  "case-01": {
    code: "案例一",
    type: "male_sculpting",
    client: "学员 A",
    gender: "男",
    age: 38,
    heightCm: 176,
    initialWeightKg: 78.5,
    targetWeightKg: 72.0,
    weightLossKg: 6.5,
    bodyFatPercent: 14.8,
    durationMonths: 2,
    coreFocus: ["胸肌铠甲重塑", "后腰脂肪折叠抹平", "圆肩肱骨内旋回正", "8周高效率复合抗阻"]
  },
  "case-02": {
    code: "案例二",
    type: "female_alignment_sculpting",
    client: "学员 B",
    gender: "女",
    age: 32,
    heightCm: 164,
    initialWeightKg: 70.0,
    stageWeightKg: 58.0,
    targetWeightKg: 53.0,
    weightLossKg: 17.0,
    waistLossCm: 9.5,
    bodyFatPercent: 21.0,
    durationMonths: 7,
    coreFocus: ["70kg减至58kg再至53kg", "假胯宽消除", "X型腿力线回正", "臀中肌激活"]
  },
  "case-03": {
    code: "案例三",
    type: "cardio_heavy_risk_free",
    client: "学员 C",
    gender: "学员",
    age: 24,
    heightCm: 170,
    initialWeightKg: 82.5,
    targetWeightKg: 59.0,
    weightLossKg: 23.5,
    initialBmi: 28.4,
    targetBmi: 20.4,
    durationMonths: 12,
    coreFocus: ["82.5kg减至59kg", "净减47斤", "关节零冲击", "长周期无伤重塑"]
  },
  "case-04": {
    code: "案例四",
    type: "male_fatloss_waist",
    client: "学员 D",
    gender: "男",
    age: 32,
    heightCm: 176,
    initialWeightKg: 82.0,
    targetWeightKg: 68.5,
    weightLossKg: 13.5,
    initialBodyFatPercent: 26.5,
    targetBodyFatPercent: 14.5,
    waistLossCm: 16.0,
    durationMonths: 5,
    durationWeeks: 20,
    coreFocus: ["82kg减至68.5kg", "净减27斤", "20周系统减脂", "腰腹顽固脂肪剥离", "马甲线人鱼线重塑"]
  },
  "case-05": {
    code: "案例五",
    type: "physique_contest_prep",
    client: "健体选手 E",
    gender: "男",
    age: 25,
    heightCm: 178,
    initialWeightKg: 86.5,
    targetWeightKg: 74.2,
    weightLossKg: 12.3,
    initialBodyFatPercent: 11.5,
    targetBodyFatPercent: 5.2,
    durationMonths: 6,
    durationWeeks: 24,
    coreFocus: ["瑞兹卡杯健体公开赛132号", "86.5kg刷至74.2kg", "24周科学备赛", "体脂率降至5.2%", "圣诞树竖脊肌与极限干度", "峰值周充碳脱水控钠"]
  }
};

function getActiveCaseState(currentCaseId, targetCaseId) {
  if (!CASE_REGISTRY[targetCaseId]) {
    return {
      success: false,
      activeId: currentCaseId,
      error: `Unknown case id: ${targetCaseId}`
    };
  }
  return {
    success: true,
    previousId: currentCaseId,
    activeId: targetCaseId,
    data: CASE_REGISTRY[targetCaseId]
  };
}

module.exports = {
  CASE_REGISTRY,
  getActiveCaseState
};
