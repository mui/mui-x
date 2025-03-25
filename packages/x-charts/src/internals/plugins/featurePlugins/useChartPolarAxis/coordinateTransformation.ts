export const generateSvg2rotation = (center: { cx: number; cy: number }) => (x: number, y: number) =>
  Math.atan2(x - center.cx, center.cy - y);

export const generateSvg2polar =
  (center: { cx: number; cy: number }) =>
  (x: number, y: number): [number, number] => {
    const angle = Math.atan2(x - center.cx, center.cy - y);
    return [Math.sqrt((x - center.cx) ** 2 + (center.cy - y) ** 2), angle];
  };

export const generatePolar2svg =
  (center: { cx: number; cy: number }) =>
  (radius: number, rotation: number): [number, number] => {
    return [center.cx + radius * Math.sin(rotation), center.cy - radius * Math.cos(rotation)];
  };
