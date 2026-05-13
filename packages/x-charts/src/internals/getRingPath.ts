/**
 * Get the SVG path to display a ring (a donut shape) defined by an outer radius and an inner radius.
 *
 * @param center - The center of the ring.
 * @param outerRadius - The outer radius of the ring.
 * @param innerRadius - The inner radius of the ring.
 * @param angles - The start and end angles of the ring in radians. If not provided, it defaults to a full circle.
 * @returns The SVG path string to display the ring.
 */
export function getRingPath(
  center: { x: number; y: number },
  outerRadius: number,
  innerRadius: number,
  angles?: { start: number; end: number } | undefined,
): string {
  if (!angles) {
    return [
      `M ${center.x - outerRadius} ${center.y}`,
      `A ${outerRadius} ${outerRadius} 0 1 0 ${center.x + outerRadius} ${center.y}`,
      `A ${outerRadius} ${outerRadius} 0 1 0 ${center.x - outerRadius} ${center.y} Z`,
      `M ${center.x - innerRadius} ${center.y}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${center.x + innerRadius} ${center.y}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${center.x - innerRadius} ${center.y} Z`,
    ].join('');
  }

  const isLargeArc = Math.abs(angles.end - angles.start) > Math.PI;
  const isDirectArc = angles.end > angles.start;

  const startOuterPoint = {
    x: center.x + outerRadius * Math.sin(angles.start),
    y: center.y - outerRadius * Math.cos(angles.start),
  };
  const endOuterPoint = {
    x: center.x + outerRadius * Math.sin(angles.end),
    y: center.y - outerRadius * Math.cos(angles.end),
  };
  const startInnerPoint = {
    x: center.x + innerRadius * Math.sin(angles.start),
    y: center.y - innerRadius * Math.cos(angles.start),
  };
  const endInnerPoint = {
    x: center.x + innerRadius * Math.sin(angles.end),
    y: center.y - innerRadius * Math.cos(angles.end),
  };

  return [
    `M ${startOuterPoint.x} ${startOuterPoint.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${isLargeArc ? 1 : 0} ${isDirectArc ? 1 : 0} ${endOuterPoint.x} ${endOuterPoint.y}`,
    `L ${endInnerPoint.x} ${endInnerPoint.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${isLargeArc ? 1 : 0} ${!isDirectArc ? 1 : 0} ${startInnerPoint.x} ${startInnerPoint.y} Z`,
  ].join('');
}
