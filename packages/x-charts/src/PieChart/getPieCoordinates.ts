import { DrawingArea } from '../context/DrawingProvider';
import { getPercentageValue } from '../internals/getPercentageValue';
import { DefaultizedPieSeriesType } from '../models/seriesType/pie';

export function getPieCoordinates(
  series: Pick<DefaultizedPieSeriesType, 'cx' | 'cy'>,
  drawing: Pick<DrawingArea, 'width' | 'height'>,
): { cx: number; cy: number; availableRadius: number } {
  const { height, width } = drawing;
  const { cx: cxParam, cy: cyParam } = series;

  const availableRadius = Math.min(width, height) / 2;
  const cx = getPercentageValue(cxParam ?? '50%', width);
  const cy = getPercentageValue(cyParam ?? '50%', height);

  return { cx, cy, availableRadius };
}
