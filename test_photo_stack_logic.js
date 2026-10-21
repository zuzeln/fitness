// test_photo_stack_logic.js
// 纯模块单测：测试微信式拟物照片堆叠状态机与物理位置计算
const {
  createPhotoStack,
  getNextStackState,
  getPrevStackState,
  calculateStackLayerStyle,
  calculateDragStyle
} = require("./photoStackLogic");

let fails = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
  } catch (err) {
    console.error(`[FAIL] ${name}: ${err.message}`);
    fails++;
  }
}

const mockPhotos = [
  { id: "p0", title: "正式教练肖像", src: "avatar.png" },
  { id: "p1", title: "随照 01", src: "photos/coach_photo_01.png" },
  { id: "p2", title: "随照 02", src: "photos/coach_photo_02.png" },
  { id: "p3", title: "随照 03", src: "photos/coach_photo_03.png" },
  { id: "p4", title: "随照 04", src: "photos/coach_photo_04.png" },
  { id: "p5", title: "随照 05", src: "photos/coach_photo_05.png" }
];

test("初始化堆叠包含 6 张照片且当前索引为 0", () => {
  const stack = createPhotoStack(mockPhotos);
  if (stack.total !== 6) throw new Error(`期望 6 张照片，实际为 ${stack.total}`);
  if (stack.currentIndex !== 0) throw new Error("初始 currentIndex 应为 0");
  if (stack.items[0].id !== "p0") throw new Error("顶层照片必须为正式教练肖像");
});

test("向左滑到最后边：第一张放到最后，第二张变成第一张", () => {
  const stack0 = createPhotoStack(mockPhotos);
  const stack1 = getNextStackState(stack0);

  if (stack1.currentIndex !== 1) throw new Error("currentIndex 应自增为 1");
  if (stack1.items[0].id !== "p1") throw new Error("原来第二张应变成当前第一张");
  if (stack1.items[stack1.items.length - 1].id !== "p0") {
    throw new Error("原来第一张必须被放到数组最末尾");
  }
});

test("连续滑动 6 次后状态完整循环归位", () => {
  let stack = createPhotoStack(mockPhotos);
  for (let i = 0; i < 6; i++) {
    stack = getNextStackState(stack);
  }
  if (stack.currentIndex !== 0) throw new Error("循环 6 次后索引应重置为 0");
  if (stack.items[0].id !== "p0") throw new Error("顶层照片应回归为初始第一张");
});

test("物理层叠层级计算符合立体拟物景深规律", () => {
  const l0 = calculateStackLayerStyle(0);
  const l1 = calculateStackLayerStyle(1);
  const l2 = calculateStackLayerStyle(2);
  const l3 = calculateStackLayerStyle(3);

  if (l0.scale !== 1 || l0.opacity !== 1 || l0.zIndex !== 10) {
    throw new Error("第 0 层必须无缩放且完全不透明");
  }
  if (l1.scale >= l0.scale || l1.opacity >= l0.opacity || l1.zIndex >= l0.zIndex) {
    throw new Error("第 1 层必须尺度更小、透明度更低且层级低于顶层");
  }
  if (l2.scale >= l1.scale || l2.zIndex >= l1.zIndex) {
    throw new Error("第 2 层必须进一步缩放并下沉");
  }
  if (l3.opacity !== 0) {
    throw new Error("第 3 层及以后应完全隐匿");
  }
});

test("跟手拖拽物理倾角限制在安全物理阈值内", () => {
  const dLeft = calculateDragStyle(-100, 0);
  if (dLeft.rotateDeg >= 0) throw new Error("向左滑动必须具有负向（逆时针）拟物倾角");
  if (dLeft.rotateDeg !== -6) throw new Error(`期望倾角 -6 度，实际为 ${dLeft.rotateDeg}`);

  const dExtreme = calculateDragStyle(-1000, 0);
  if (dExtreme.rotateDeg < -15) throw new Error("极限拖拽倾角不应超出 15 度安全线");
});

if (fails > 0) {
  console.error(`\n❌ 单测失败，共有 ${fails} 项异常！`);
  process.exit(1);
} else {
  console.log("\n照片堆叠纯模块单测全部通过！[OK]");
}
