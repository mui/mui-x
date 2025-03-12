export function getAreaPath(points: { x: number; y: number }[]) {
  return `M ${points.map((p) => `${p.x} ${p.y}`).join('L')} Z`;
}
