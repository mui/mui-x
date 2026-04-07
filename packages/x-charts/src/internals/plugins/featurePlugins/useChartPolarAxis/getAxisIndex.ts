import { isOrdinalScale } from '../../../scaleGuards';
import { type PolarAxisDefaultized } from '../../../../models/axis';
import { clampAngleRad } from '../../../clampAngle';
import { getAngleDistance } from './getAngleDistance';

/**
 * For a pointer coordinate, this function returns the value and dataIndex associated.
 * Returns `-1` if the coordinate does not match a value.
 */
export function getAxisIndex(axisConfig: PolarAxisDefaultized, pointerValue: number): number {
  const { scale, data: axisData, reverse } = axisConfig;

  if (axisData === undefined) {
    return -1;
  }

  if (!isOrdinalScale(scale)) {
    let closestIndex = -1;
    let closestDistance = Infinity;

    for (let i = 0; i < axisData.length; i += 1) {
      const distance = getAngleDistance(pointerValue, scale(axisData[i])!);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      } else {
        break;
      }
    }

    let closestRevertDistance = Infinity;
    for (let i = 1; i < axisData.length; i += 1) {
      const distance = getAngleDistance(pointerValue, scale(axisData[axisData.length - i])!);
      if (distance < closestRevertDistance) {
        closestRevertDistance = distance;
        if (distance < closestDistance) {
          closestIndex = axisData.length - i;
        }
      } else {
        break;
      }
    }

    if (
      (closestIndex === 0 || closestIndex === axisData.length - 1) &&
      getAngleDistance(scale(axisData[0])!, scale(axisData[axisData.length - 1])!) < 0.01
    ) {
      const forwardPoint = scale(axisData[0])! + 0.1;
      const backwardPoint = forwardPoint - 0.2;
      const forwardDistance = getAngleDistance(pointerValue, forwardPoint);
      const backwardDistance = getAngleDistance(pointerValue, backwardPoint);
      if (forwardDistance < backwardDistance) {
        closestIndex = 0;
      } else {
        closestIndex = axisData.length - 1;
      }
    }

    return closestIndex;
  }

  const angleGap = clampAngleRad(pointerValue - Math.min(...scale.range()));
  const dataIndex =
    scale.bandwidth() === 0
      ? Math.floor((angleGap + scale.step() / 2) / scale.step()) % axisData.length
      : Math.floor(angleGap / scale.step());

  if (dataIndex < 0 || dataIndex >= axisData.length) {
    return -1;
  }

  return reverse ? axisData!.length - 1 - dataIndex : dataIndex;
}
