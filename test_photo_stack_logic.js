// test_photo_stack_logic.js
// 纯模块单测：测试微信式拟物照片堆叠状态机与物理位置计算
const {
  createPhotoStack,
  getNextStackState,
  getPrevStackState,
  calculateStackLayerStyle,
  calculateDragStyle,
  determineSwipeAction,
  calculateDragFrame
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
  { id: "p1", title: "随照 01", src: "photos/coach_photo_01.jpg" },
  { id: "p2", title: "随照 02", src: "photos/coach_photo_02.jpg" },
  { id: "p3", title: "随照 03", src: "photos/coach_photo_03.jpg" },
  { id: "p4", title: "随照 04", src: "photos/coach_photo_04.jpg" },
  { id: "p5", title: "随照 05", src: "photos/coach_photo_05.jpg" }
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

test("向右滑往前翻：最后一张拿回到顶层，原来第一张顺延为第二张", () => {
  const stack0 = createPhotoStack(mockPhotos);
  const stackPrev = getPrevStackState(stack0);

  if (stackPrev.currentIndex !== 5) throw new Error("currentIndex 应回退为 5");
  if (stackPrev.items[0].id !== "p5") throw new Error("上一张（原末尾 p5）必须被放到当前第一张");
  if (stackPrev.items[1].id !== "p0") throw new Error("原来的第一张 p0 顺延为第二张");
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

  const dRight = calculateDragStyle(100, 0);
  if (dRight.rotateDeg <= 0) throw new Error("向右滑动必须具有正向（顺时针）拟物倾角");
  if (dRight.rotateDeg !== 6) throw new Error(`期望倾角 +6 度，实际为 ${dRight.rotateDeg}`);

  const dExtreme = calculateDragStyle(-1000, 0);
  if (dExtreme.rotateDeg < -15) throw new Error("极限拖拽倾角不应超出 15 度安全线");
});

test("滑动动作判定准确映射 NEXT、PREV 与 RESET", () => {
  if (determineSwipeAction(-80) !== "NEXT") throw new Error("向左拖拽超过阈值应判定为 NEXT");
  if (determineSwipeAction(80) !== "PREV") throw new Error("向右拖拽超过阈值应判定为 PREV");
  if (determineSwipeAction(-20) !== "RESET") throw new Error("微幅向左应判定为 RESET");
  if (determineSwipeAction(20) !== "RESET") throw new Error("微幅向右应判定为 RESET");
});

test("向左滑时预览底层必为下一张（index 1）", () => {
  const frames = calculateDragFrame(6, -80, 0);
  if (frames[0].zIndex !== 10) throw new Error("顶层照片层级必须为 10");
  if (frames[1].zIndex !== 9) throw new Error("向左滑时下一张（index 1）必须为露出的第二层（zIndex 9）");
  if (frames[1].opacity <= 0.8) throw new Error("下一张应随拖拽进度提升透明度");
});

test("向右滑时预览底层必为上一张（index 5）而绝非下一张", () => {
  const frames = calculateDragFrame(6, 80, 0);
  if (frames[0].zIndex !== 10) throw new Error("顶层照片层级必须为 10");
  if (frames[5].zIndex !== 9) throw new Error("向右滑时上一张（index 5）必须提升为露出的第二层（zIndex 9）");
  if (frames[1].zIndex >= 9) throw new Error("向右滑时下一张（index 1）严禁抢占露出层（zIndex 必须低于 9）");
  if (frames[5].opacity < 0.9) throw new Error("上一张应随向右拖拽呈现清晰预览");
});

if (fails > 0) {
  console.error(`\n❌ 单测失败，共有 ${fails} 项异常！`);
  process.exit(1);
} else {
  console.log("\n照片堆叠纯模块单测全部通过！[OK]");
}
