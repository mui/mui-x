export function resolveValue(
  /**
   * The value to resolve. Either an axis value, or 'start'/'end' to stick to the edges of the drawing area.
   */
  value,
  /**
   * The axis scale to use.
   */
  scale,
  /**
   * The start coordinate of the drawing area (left for x-axis, top for y-axis).
   */
  drawingStart,
  /**
   * The end coordinate of the drawing area (right for x-axis, bottom for y-axis).
   */
  drawingEnd,
  /**
   * The position within the band to use when the scale is a band scale and the value is not 'start' or 'end'.
   */
  bandPosition = 'center',
) {
  if (value === 'start') {
    return drawingStart;
  }
  if (value === 'end') {
    return drawingEnd;
  }

  let coordinate = scale(value);

  if ('bandwidth' in scale && scale.bandwidth() > 0) {
    // For band scales, we want to position the highlight according to the specified `bandPosition`.
    const gap = (scale.step() - scale.bandwidth()) / 2;
    switch (bandPosition) {
      case 'start':
        coordinate = coordinate - gap;
        break;
      case 'end':
        coordinate = coordinate - gap + scale.step();
        break;
      case 'center':
      default:
        coordinate = coordinate + scale.bandwidth() / 2;
        break;
    }
  }

  // The value clamped between the drawing area boundaries.
  return Math.max(drawingStart, Math.min(drawingEnd, coordinate)) || 0;
}
