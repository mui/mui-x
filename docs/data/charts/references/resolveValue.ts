import type { ScaleLinear, ScalePoint } from '@mui/x-charts-vendor/d3-scale';

export function resolveValue(
  /**
   * The value to resolve. Either an axis value, or 'start'/'end' to stick to the edges of the drawing area.
   */
  value: string | number | 'start' | 'end',
  /**
   * The axis scale to use.
   */
  scale: ScaleLinear<any, any> | ScalePoint<any>,
  /**
   * The start coordinate of the drawing area (left for x-axis, top for y-axis).
   */
  drawingStart: number,
  /**
   * The end coordinate of the drawing area (right for x-axis, bottom for y-axis).
   */
  drawingEnd: number,
  /**
   * The position within the band to use when the scale is a band scale and the value is not 'start' or 'end'.
   */
  bandPosition: 'start' | 'center' | 'end' = 'center',
): number {
  if (value === 'start') {
    return drawingStart;
  }
  if (value === 'end') {
    return drawingEnd;
  }

  let coordinate = scale(value as any)! as number;

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
