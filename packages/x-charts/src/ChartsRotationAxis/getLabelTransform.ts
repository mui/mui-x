/**
 * Return the vertical/horizontal alignment for a tick label at a given position.
 * @param px The normalized x position to the axis line (between -1 and 1).
 * @param py The normalized y position to the axis line (between -1 and 1).
 * @param tickLabelPosition The position of the tick label relative to the axis line.
 * @returns The vertical and horizontal alignment for the tick label.
 */
export function getLabelTransform(
  px: number,
  py: number,
  tickLabelPosition: 'center' | 'after' | 'before',
): {
  verticalAlign: 'start' | 'middle' | 'end';
  horizontalAlign: 'start' | 'middle' | 'end';
} {
  if (tickLabelPosition === 'center') {
    return { verticalAlign: 'middle', horizontalAlign: 'middle' };
  }

  let verticalAlign: 'start' | 'middle' | 'end' = 'middle';
  let horizontalAlign: 'start' | 'middle' | 'end' = 'middle';
  if (px > 0.3) {
    horizontalAlign = tickLabelPosition === 'after' ? 'start' : 'end';
  } else if (px < -0.3) {
    horizontalAlign = tickLabelPosition === 'after' ? 'end' : 'start';
  }

  if (py > 0.3) {
    verticalAlign = tickLabelPosition === 'after' ? 'start' : 'end';
  } else if (py < -0.3) {
    verticalAlign = tickLabelPosition === 'after' ? 'end' : 'start';
  }

  return { verticalAlign, horizontalAlign };
}
