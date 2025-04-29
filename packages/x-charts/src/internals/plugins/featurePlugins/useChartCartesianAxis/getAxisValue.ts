import { isBandScale } from '../../../isBandScale';
import { AxisDefaultized } from '../../../../models/axis';

function getAsANumber(value: number | Date) {
  return value instanceof Date ? value.getTime() : value;
}

/**
 * For a pointer coordinate, this function returns the dataIndex associated.
 * Returns `-1` if no dataIndex matches.
 */
export function getAxisIndex(axisConfig: AxisDefaultized, pointerValue: number): number {
  const { scale, data: axisData, reverse } = axisConfig;

  if (!isBandScale(scale)) {
    const value = scale.invert(pointerValue);

    if (axisData === undefined) {
      return -1;
    }

    const valueAsNumber = getAsANumber(value);
    const closestIndex = axisData?.findIndex((pointValue: typeof value, index) => {
      const v = getAsANumber(pointValue);
      if (v > valueAsNumber) {
        if (
          index === 0 ||
          Math.abs(valueAsNumber - v) <= Math.abs(valueAsNumber - getAsANumber(axisData[index - 1]))
        ) {
          return true;
        }
      }
      if (v <= valueAsNumber) {
        if (
          index === axisData.length - 1 ||
          Math.abs(getAsANumber(value) - v) <
            Math.abs(getAsANumber(value) - getAsANumber(axisData[index + 1]))
        ) {
          return true;
        }
      }
      return false;
    });

    return closestIndex;
  }

  const dataIndex =
    scale.bandwidth() === 0
      ? Math.floor((pointerValue - Math.min(...scale.range()) + scale.step() / 2) / scale.step())
      : Math.floor((pointerValue - Math.min(...scale.range())) / scale.step());

  if (dataIndex < 0 || dataIndex >= axisData!.length) {
    return -1;
  }
  return reverse ? axisData!.length - 1 - dataIndex : dataIndex;
}

/**
 * For a pointer coordinate, this function returns the value associated.
 * Returns `null` if the coordinate has no value associated.
 */
export function getAxisValue(
  axisConfig: AxisDefaultized,
  pointerValue: number,
  dataIndex: number,
): number | Date | null {
  const { scale, data: axisData } = axisConfig;

  if (!isBandScale(scale)) {
    const value = scale.invert(pointerValue);

    if (dataIndex < 0) {
      return value;
    }
    return axisData![dataIndex];
  }

  if (dataIndex < 0 || dataIndex >= axisData!.length) {
    return null;
  }

  return axisData![dataIndex];
}
