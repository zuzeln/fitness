// casesLogic.js
// 纯逻辑模块：案例 Tab 状态机与数据查询（不碰 DOM，纯数据输入输出）

const CASE_REGISTRY = {
  "case-01": {
    code: "CASE-01",
    type: "alignment",
    client: "学员 A",
    gender: "女",
    age: 26,
    heightCm: 150,
    initialWeightKg: 41.6,
    targetWeightKg: 45.0,
    initialBmi: 18.5,
    targetBmi: 20.0,
    coreFocus: ["高低肩矫正", "翼状肩胛回正", "前锯肌特异性激活", "偏瘦增肌"]
  },
  "case-02": {
    code: "CASE-02",
    type: "sculpting",
    client: "学员 B",
    gender: "女",
    age: 32,
    heightCm: 164,
    initialWeightKg: 59.5,
    stageWeightKg: 53.0,
    weightLossKg: 6.5,
    waistLossCm: 6.5,
    bodyFatPercent: 21.0,
    coreFocus: ["假胯宽消除", "X型腿内扣回正", "臀中肌激活", "大肌群抗阻EPOC"]
  },
  "case-03": {
    code: "CASE-03",
    type: "cardio_heavy",
    client: "学员 C",
    gender: "学员",
    age: 24,
    heightCm: 170,
    initialWeightKg: 82.5,
    targetWeightKg: 60.0,
    weightLossKg: 22.5,
    initialBmi: 28.4,
    targetBmi: 20.7,
    coreFocus: ["关节零冲击", "心肺耐力优先", "低冲击有氧", "长周期无伤减重"]
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
