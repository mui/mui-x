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
    verticalAlign = tickLabelPosition === 'after' ? 'start' : 'end';
  } else if (px < -0.3) {
    verticalAlign = tickLabelPosition === 'after' ? 'end' : 'start';
  }

  if (py > 0.3) {
    horizontalAlign = tickLabelPosition === 'after' ? 'end' : 'start';
  } else if (py < -0.3) {
    horizontalAlign = tickLabelPosition === 'after' ? 'start' : 'end';
  }

  return { verticalAlign, horizontalAlign };
}

/**
 * Wrapper on top of `getLabelTransform` to simplify <text /> anchor props.
 */
export function getLabelTextAnchors(
  px: number,
  py: number,
  tickLabelPosition: 'center' | 'after' | 'before',
): {
  textAnchor: 'start' | 'middle' | 'end';
  dominantBaseline: 'hanging' | 'middle' | 'auto';
} {
  const { verticalAlign, horizontalAlign } = getLabelTransform(px, py, tickLabelPosition);


  let textAnchor: 'start' | 'middle' | 'end';
  let dominantBaseline: 'hanging' | 'middle' | 'auto';

  switch (verticalAlign) {
    case 'start':
      dominantBaseline = 'hanging';
      break;
    case 'middle':
      dominantBaseline = 'middle';
      break;
    case 'end':
    default:
      dominantBaseline = 'auto';
      break;
  }

  switch (horizontalAlign) {
    case 'start':
      textAnchor = 'start';
      break;
    case 'middle':
      textAnchor = 'middle';
      break;
    case 'end':
    default:
      textAnchor = 'end';
      break;
  }

  return { textAnchor, dominantBaseline };
}