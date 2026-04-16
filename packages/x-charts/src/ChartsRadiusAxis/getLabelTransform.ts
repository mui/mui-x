/**
 * Return the vertical/horizontal alignment for a tick label at a given position.
 * @param px The normalized x position to the axis line (between -1 and 1).
 * @param py The normalized y position to the axis line (between -1 and 1).
 * @param center If true, the tick labels are centered on it's position.
 * @returns The vertical and horizontal alignment for the tick label.
 */
export function getLabelTransform(
  px: number,
  py: number,
  center: boolean,
): {
  verticalAlign: 'start' | 'middle' | 'end';
  horizontalAlign: 'start' | 'middle' | 'end';
} {
  if (center) {
    return { verticalAlign: 'middle', horizontalAlign: 'middle' };
  }

  let verticalAlign: 'start' | 'middle' | 'end' = 'middle';
  let horizontalAlign: 'start' | 'middle' | 'end' = 'middle';
  if (px > 0.3) {
    verticalAlign = 'start';
  } else if (px < -0.3) {
    verticalAlign = 'end';
  }

  if (py > 0.3) {
    horizontalAlign = 'end';
  } else if (py < -0.3) {
    horizontalAlign = 'start';
  }

  return { verticalAlign, horizontalAlign };
}
