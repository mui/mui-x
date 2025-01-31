import { isBandScale } from '../../../isBandScale';
import { AxisDefaultized } from '../../../../models/axis';

function getAsANumber(value: number | Date) {
  return value instanceof Date ? value.getTime() : value;
}

/**
 * For a pointer coordinate, this function returns the value and dataIndex associated.
 * Returns `null` if the coordinate is outside of values.
 */
export function getAxisValue(axisConfig: AxisDefaultized, pointerValue: number) {
  const { scale, data: axisData, reverse } = axisConfig;

  if (!isBandScale(scale)) {
    const value = scale.invert(pointerValue);

    if (axisData === undefined) {
      return { value, index: -1 };
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

    return {
      value: closestIndex !== undefined && closestIndex >= 0 ? axisData![closestIndex] : value,
      index: closestIndex,
    };
  }

  const dataIndex =
    scale.bandwidth() === 0
      ? Math.floor((pointerValue - Math.min(...scale.range()) + scale.step() / 2) / scale.step())
      : Math.floor((pointerValue - Math.min(...scale.range())) / scale.step());

  if (dataIndex < 0 || dataIndex >= axisData!.length) {
    return null;
  }
  if (reverse) {
    const reverseIndex = axisData!.length - 1 - dataIndex;
    return {
      index: reverseIndex,
      value: axisData![reverseIndex],
    };
  }
  return {
    index: dataIndex,
    value: axisData![dataIndex],
  };
}
