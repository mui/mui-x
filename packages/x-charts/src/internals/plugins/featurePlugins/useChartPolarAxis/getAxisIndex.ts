import { isOrdinalScale } from '../../../scaleGuards';
import { getAsNumber } from '../../../getAsNumber';
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

    const value = scale.invert(angle);
    const valueAsNumber = getAsNumber(value);
    const closestIndex = axisData.findIndex((pointValue: typeof value, index) => {
      const v = getAsNumber(pointValue);
      if (v > valueAsNumber) {
        if (
          index === 0 ||
          Math.abs(valueAsNumber - v) <= Math.abs(valueAsNumber - getAsNumber(axisData[index - 1]))
        ) {
          return true;
        }
      }
      if (v <= valueAsNumber) {
        if (
          index === axisData.length - 1 ||
          Math.abs(valueAsNumber - v) <
          Math.abs(valueAsNumber - getAsNumber(axisData[index + 1]))
        ) {
          return true;
        }
      }
      return false;
    });

    return closestIndex;
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
