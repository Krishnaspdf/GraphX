export interface ViewState {
  xMin: number; xMax: number; yMin: number; yMax: number;
  width: number; height: number;
}

export function worldToScreen(x: number, y: number, v: ViewState) {
  return {
    x: (x - v.xMin) / (v.xMax - v.xMin) * v.width,
    y: v.height - (y - v.yMin) / (v.yMax - v.yMin) * v.height,
  };
}

export function screenToWorld(sx: number, sy: number, v: ViewState) {
  return {
    x: v.xMin + sx / v.width * (v.xMax - v.xMin),
    y: v.yMin + (v.height - sy) / v.height * (v.yMax - v.yMin),
  };
}
