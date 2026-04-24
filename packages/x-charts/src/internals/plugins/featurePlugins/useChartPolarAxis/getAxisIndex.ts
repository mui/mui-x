import { isOrdinalScale } from '../../../scaleGuards';
import { type PolarAxisDefaultized } from '../../../../models/axis';
import { clampAngleRad } from '../../../clampAngle';
import { EPSILON } from '../../../../utils/epsilon';

/**
 * For a pointer coordinate, this function returns the value and dataIndex associated.
 * Returns `-1` if the coordinate does not match a value.
 */
export function getAxisIndex(axisConfig: PolarAxisDefaultized, pointerValue: number): number {
  const { scale, data: axisData, reverse } = axisConfig;

  if (!isOrdinalScale(scale)) {
    throw new Error(
      'MUI X Charts: getAxisIndex is not implemented for polar continuous axes. ' +
        'This function only supports ordinal (band/point) scales.',
    );
  }

  if (!axisData) {
    return -1;
  }

  const [startAngle, endAngle] = scale.range();

  const angleGap = clampAngleRad(pointerValue - startAngle);

  const maxAngleGap = clampAngleRad(endAngle - startAngle);
  const isFullCircle =
    Math.abs(maxAngleGap + (scale.bandwidth() === 0 ? scale.step() : 0) - 2 * Math.PI) < EPSILON;

  if (!isFullCircle  || angleGap > maxAngleGap) {
    // If not a full circle we only consider pointer inside the rotation range.
    return -1;
  }
  let dataIndex: number;

  if (scale.bandwidth() === 0) {
    dataIndex = Math.floor((angleGap + scale.step() / 2) / scale.step());
    if (isFullCircle) {
      // To show dataIndex 0 when we are before the startAngle
      dataIndex = dataIndex % axisData.length;
    }
  } else {
    dataIndex = Math.floor(angleGap / scale.step());
  }

  if (dataIndex < 0 || dataIndex >= axisData.length) {
    return -1;
  }

  return reverse ? axisData.length - 1 - dataIndex : dataIndex;
}
