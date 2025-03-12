import { isBandScale } from '../../../isBandScale';
import { PolarAxisDefaultized } from '../../../../models/axis';
import { clampAngleRad } from '../../../clampAngle';

/**
 * For a pointer coordinate, this function returns the value and dataIndex associated.
 * Returns `null` if the coordinate is outside of values.
 */
export function getAxisValue(axisConfig: PolarAxisDefaultized, pointerValue: number) {
  const { scale, data: axisData, reverse } = axisConfig;

  if (!isBandScale(scale)) {
    throw new Error('MUI X: getAxisValue is not implemented for polare continuous axes.');
  }

  const angleGap = clampAngleRad(pointerValue - Math.min(...scale.range()));
  const dataIndex =
    scale.bandwidth() === 0
      ? Math.floor((angleGap + scale.step() / 2) / scale.step()) % axisData!.length
      : Math.floor(angleGap / scale.step());

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
