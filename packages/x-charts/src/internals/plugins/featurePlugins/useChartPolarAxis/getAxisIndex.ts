import { isOrdinalScale } from '../../../scaleGuards';
import { getAsNumber } from '../../../getAsNumber';
import { findClosestIndex } from '../../../findClosestIndex';
import { type PolarAxisDefaultized } from '../../../../models/axis';
import { clampAngleRad } from '../../../clampAngle';

/**
 * For a pointer coordinate, this function returns the value and dataIndex associated.
 * Returns `-1` if the coordinate does not match a value.
 */
export function getAxisIndex(axisConfig: PolarAxisDefaultized, pointerValue: number): number {
  const { scale, data: axisData, reverse } = axisConfig;

  if (!isOrdinalScale(scale)) {
    if (axisData === undefined) {
      return -1;
    }

    const angle = scale.range()[0] + clampAngleRad(pointerValue - scale.range()[0]);
    const valueAsNumber = getAsNumber(scale.invert(angle));

    return findClosestIndex(axisData, valueAsNumber);
  }

  if (!axisData) {
    return -1;
  }

  const angleGap = clampAngleRad(pointerValue - scale.range()[0]);
  const dataIndex =
    scale.bandwidth() === 0
      ? Math.floor((angleGap + scale.step() / 2) / scale.step()) % axisData.length
      : Math.floor(angleGap / scale.step());

  if (dataIndex < 0 || dataIndex >= axisData.length) {
    return -1;
  }

  return reverse ? axisData!.length - 1 - dataIndex : dataIndex;
}
