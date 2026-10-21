// photoStackLogic.js
// 纯逻辑模块：微信式拟物照片堆叠状态机与物理位置计算（纯数据输入输出，不碰 DOM）

function createPhotoStack(photos) {
  if (!Array.isArray(photos) || photos.length === 0) {
    throw new Error("photos 必须为非空数组");
  }
  return {
    items: photos.map((p, idx) => ({ ...p, originalIndex: idx })),
    currentIndex: 0,
    total: photos.length
  };
}

function getNextStackState(stackState) {
  if (!stackState || !stackState.items || stackState.items.length === 0) {
    return stackState;
  }
  const nextItems = [...stackState.items];
  const first = nextItems.shift();
  nextItems.push(first);
  const nextCurrentIndex = (stackState.currentIndex + 1) % stackState.total;
  return {
    ...stackState,
    items: nextItems,
    currentIndex: nextCurrentIndex
  };
}

function getPrevStackState(stackState) {
  if (!stackState || !stackState.items || stackState.items.length === 0) {
    return stackState;
  }
  const nextItems = [...stackState.items];
  const last = nextItems.pop();
  nextItems.unshift(last);
  const prevCurrentIndex = (stackState.currentIndex - 1 + stackState.total) % stackState.total;
  return {
    ...stackState,
    items: nextItems,
    currentIndex: prevCurrentIndex
  };
}

// 计算第 pos 层的静态物理空间属性 (pos = 0 为顶层, 1 为第二层, 2 为第三层...)
function calculateStackLayerStyle(pos) {
  if (pos === 0) {
    return {
      translateX: 0,
      translateY: 0,
      scale: 1,
      rotateDeg: 0,
      opacity: 1,
      zIndex: 10,
      pointerEvents: "auto"
    };
  } else if (pos === 1) {
    return {
      translateX: 0,
      translateY: 10,
      scale: 0.95,
      rotateDeg: -1.8,
      opacity: 0.9,
      zIndex: 9,
      pointerEvents: "none"
    };
  } else if (pos === 2) {
    return {
      translateX: 0,
      translateY: 20,
      scale: 0.90,
      rotateDeg: 1.5,
      opacity: 0.75,
      zIndex: 8,
      pointerEvents: "none"
    };
  } else {
    return {
      translateX: 0,
      translateY: 28,
      scale: 0.85,
      rotateDeg: 0,
      opacity: 0,
      zIndex: 1,
      pointerEvents: "none"
    };
  }
}

// 计算跟手拖拽时的物理位移与微倾斜（拟物倾角系数）
function calculateDragStyle(dx, dy) {
  // 倾角系数：向左滑动时逆时针倾斜，向右滑动时顺时针倾斜，最大限制 +/- 15 度
  const rawDeg = dx * 0.06;
  const rotateDeg = Math.max(-15, Math.min(15, rawDeg));
  return {
    translateX: dx,
    translateY: dy * 0.35,
    rotateDeg: Number(rotateDeg.toFixed(2)),
    scale: 1
  };
}

module.exports = {
  createPhotoStack,
  getNextStackState,
  getPrevStackState,
  calculateStackLayerStyle,
  calculateDragStyle
};
