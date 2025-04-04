import { AxisId, ChartsAxisProps } from '../../../../models/axis';
import { createSelector } from '../../utils/selectors';
import {
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
} from '../useChartInteraction/useChartInteraction.selectors';
import { ComputeResult } from './computeAxisValue';
import { generateSvg2rotation } from './coordinateTransformation';
import { getAxisIndex } from './getAxisValue';
import { selectorChartPolarCenter, selectorChartRotationAxis } from './useChartPolarAxis.selectors';

const optionalGetAxisId = (_: unknown, id?: AxisId) => id;
const optionalGetAxisIds = (_: unknown, ids: AxisId[]) => ids;

/**
 * Get interaction indexes
 */

function indexGetter(value: number, axes: ComputeResult<ChartsAxisProps>, ids?: AxisId): number;
function indexGetter(value: number, axes: ComputeResult<ChartsAxisProps>, ids: AxisId[]): number[];
function indexGetter(
  value: number,
  axes: ComputeResult<ChartsAxisProps>,
  ids: AxisId | AxisId[] = axes.axisIds[0],
): number | number[] {
  return Array.isArray(ids)
    ? ids.map((id) => getAxisIndex(axes.axis[id], value))
    : getAxisIndex(axes.axis[ids], value);
}

/**
 * Helper to get the rotation associated to the interaction coordinate.
 */
const selectorChartsInteractionRotationAngle = createSelector(
  [selectorChartsInteractionPointerX, selectorChartsInteractionPointerY, selectorChartPolarCenter],
  (x, y, center) => {
    if (x === null || y === null) {
      return null;
    }
    return generateSvg2rotation(center)(x, y);
  },
);

export const selectorChartsInteractionRotationAxisIndex = createSelector(
  [selectorChartsInteractionRotationAngle, selectorChartRotationAxis, optionalGetAxisId],
  (rotation, rotationAxis, id) =>
    rotation === null ? null : indexGetter(rotation, rotationAxis, id),
);

export const selectorChartsInteractionRotationAxisIndexes = createSelector(
  [selectorChartsInteractionRotationAngle, selectorChartRotationAxis, optionalGetAxisIds],
  (rotation, rotationAxis, ids) =>
    rotation === null ? null : indexGetter(rotation, rotationAxis, ids ?? rotationAxis.axisIds),
);

export const selectorChartsInteractionRotationAxisValue = createSelector(
  [selectorChartRotationAxis, selectorChartsInteractionRotationAxisIndex, optionalGetAxisId],
  (rotationAxis, rotationIndex, id = rotationAxis.axisIds[0]) => {
    if (rotationIndex === null || rotationIndex === -1 || rotationAxis.axisIds.length === 0) {
      return null;
    }

    const data = rotationAxis.axis[id]?.data;
    if (!data) {
      return null;
    }
    return data[rotationIndex];
  },
);

export const selectorChartsInteractionRotationAxisValues = createSelector(
  [selectorChartRotationAxis, selectorChartsInteractionRotationAxisIndexes, optionalGetAxisIds],
  (rotationAxis, rotationIndexes, ids = rotationAxis.axisIds) => {
    if (rotationIndexes === null) {
      return null;
    }

    return ids.map((id, axisIndex) => {
      const rotationIndex = rotationIndexes[axisIndex];
      if (rotationIndex === -1) {
        return null;
      }
      return rotationAxis.axis[id].data?.[rotationIndex];
    });
  },
);

/**
 * Get rotation-axis ids and corresponding data index that should be display in the tooltip.
 */
export const selectorChartsInteractionTooltipRotationAxes = createSelector(
  [selectorChartsInteractionRotationAxisIndexes, selectorChartRotationAxis],
  (indexes, axes) => {
    if (indexes === null) {
      return [];
    }

    return axes.axisIds
      .map((axisId, axisIndex) => ({ axisId, dataIndex: indexes[axisIndex] }))
      .filter(({ axisId, dataIndex }) => axes.axis[axisId].triggerTooltip && dataIndex >= 0);
  },
);

/**
 * Get radius-axis ids and corresponding data index that should be display in the tooltip.
 */
export const selectorChartsInteractionTooltipRadiusAxes = createSelector([], () => {
  // TODO implement this selector and add it to the `selectorChartsInteractionPolarAxisTooltip`
  return [];
});

/**
 * Return `true` if the axis tooltip has something to display.
 */
export const selectorChartsInteractionPolarAxisTooltip = createSelector(
  [selectorChartsInteractionTooltipRotationAxes],
  (rotationTooltip) => rotationTooltip.length > 0,
);
