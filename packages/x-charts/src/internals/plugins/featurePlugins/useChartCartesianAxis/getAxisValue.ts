import { isOrdinalScale } from '../../../scaleGuards';
import { type ComputedAxis, type D3Scale } from '../../../../models/axis';

function getAsANumber(value: number | Date) {
  return value instanceof Date ? value.getTime() : value;
}

/**
 * For a pointer coordinate, this function returns the dataIndex associated.
 * Returns `-1` if no dataIndex matches.
 */
export function getAxisIndex(axisConfig: ComputedAxis, pointerValue: number): number {
  const { scale, data: axisData, reverse } = axisConfig;

  if (!isOrdinalScale(scale)) {
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
export function getAxisValue<
  Domain extends { toString(): string } = { toString(): string },
  Range = number,
  Output = number,
>(
  scale: D3Scale<Domain, Range, Output>,
  axisData: readonly any[] | undefined,
  pointerValue: number,
  dataIndex: number | null,
): number | Date | null {
  if (!isOrdinalScale(scale)) {
    if (dataIndex === null) {
      const invertedValue = scale.invert(pointerValue);

      return Number.isNaN(invertedValue) ? null : invertedValue;
    }
    return axisData![dataIndex];
  }

  if (dataIndex === null || dataIndex < 0 || dataIndex >= axisData!.length) {
    return null;
  }

  return axisData![dataIndex];
}
