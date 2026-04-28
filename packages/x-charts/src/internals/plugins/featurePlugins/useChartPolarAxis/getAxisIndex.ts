import { isOrdinalScale } from '../../../scaleGuards';
import { getAsNumber } from '../../../getAsNumber';
import { findClosestIndex } from '../../../findClosestIndex';
import { type PolarAxisDefaultized } from '../../../../models/axis';
import { clampAngleRad } from '../../../clampAngle';
import { EPSILON } from '../../../../utils/epsilon';

/**
 * For a pointer coordinate, this function returns the value and dataIndex associated.
 * Returns `-1` if the coordinate does not match a value.
 */
export function getAxisIndex(axisConfig: PolarAxisDefaultized, pointerValue: number): number {
  const { scale, data: axisData, reverse, isFullCircle } = axisConfig;

  const [startAngle, endAngle] = scale.range();

  const angleGap = clampAngleRad(pointerValue - startAngle);
  const maxAngleGap = clampAngleRad(endAngle - startAngle);

  if (!isFullCircle && angleGap > maxAngleGap) {
    // If not a full circle we only consider pointer inside the rotation range.
    return -1;
  }

  if (!isOrdinalScale(scale)) {
    if (axisData === undefined) {
      return -1;
    }

    const angle = startAngle + clampAngleRad(pointerValue - startAngle);
    const valueAsNumber = getAsNumber(scale.invert(angle));

    return findClosestIndex(axisData, valueAsNumber);
  }

  if (!axisData) {
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
