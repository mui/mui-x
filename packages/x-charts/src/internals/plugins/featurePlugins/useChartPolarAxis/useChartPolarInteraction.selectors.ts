import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { createSelector, createSelectorMemoizedWithOptions } from '@mui/x-internals/store';
import type {
  AxisId,
  AxisItemIdentifier,
  ChartsRotationAxisProps,
  ChartsRadiusAxisProps,
} from '../../../../models/axis';
import {
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
} from '../useChartInteraction/useChartInteraction.selectors';
import type { ComputeResult } from './computeAxisValue';
import { generateSvg2rotation } from './coordinateTransformation';
import { getRotationAxisIndex, getRadiusAxisIndex } from './getAxisIndex';
import {
  selectorChartPolarCenter,
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
} from './useChartPolarAxis.selectors';

const optionalGetAxisId = (_: unknown, id?: AxisId) => id;
const optionalGetAxisIds = (_: unknown, ids: AxisId[]) => ids;

/**
 * Get interaction indexes
 */

function indexGetter(
  value: number,
  axes: ComputeResult<ChartsRotationAxisProps>,
  ids: AxisId,
  type: 'rotation',
): number;
function indexGetter(
  value: number,
  axes: ComputeResult<ChartsRotationAxisProps>,
  ids: AxisId[],
  type: 'rotation',
): number[];
function indexGetter(
  value: number,
  axes: ComputeResult<ChartsRadiusAxisProps>,
  ids: AxisId,
  type: 'radius',
): number;
function indexGetter(
  value: number,
  axes: ComputeResult<ChartsRadiusAxisProps>,
  ids: AxisId[],
  type: 'radius',
): number[];
function indexGetter(
  value: number,
  axes: ComputeResult<ChartsRotationAxisProps> | ComputeResult<ChartsRadiusAxisProps>,
  ids: AxisId | AxisId[],
  type: 'rotation' | 'radius',
): number | number[] {
  if (type === 'rotation') {
    const rotationAxes = axes as ComputeResult<ChartsRotationAxisProps>;
    return Array.isArray(ids)
      ? ids.map((id) => getRotationAxisIndex(rotationAxes.axis[id], value))
      : getRotationAxisIndex(rotationAxes.axis[ids], value);
  }
  const radiusAxes = axes as ComputeResult<ChartsRadiusAxisProps>;
  return Array.isArray(ids)
    ? ids.map((id) => getRadiusAxisIndex(radiusAxes.axis[id], value))
    : getRadiusAxisIndex(radiusAxes.axis[ids], value);
}

// ============================= Rotation axis =============================

/**
 * Helper to get the rotation associated to the interaction coordinate.
 */
const selectorChartsInteractionRotationAngle = createSelector(
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
  selectorChartPolarCenter,
  (x, y, center) => {
    if (x === null || y === null) {
      return null;
    }
    return generateSvg2rotation(center)(x, y);
  },
);

export const selectorChartsInteractionRotationAxisIndex = createSelector(
  selectorChartsInteractionRotationAngle,
  selectorChartRotationAxis,
  optionalGetAxisId,
  (rotation, rotationAxis, id) =>
    rotation === null
      ? null
      : indexGetter(rotation, rotationAxis, id ?? rotationAxis.axisIds[0], 'rotation'),
);

export const selectorChartsInteractionRotationAxisIndexes = createSelector(
  selectorChartsInteractionRotationAngle,
  selectorChartRotationAxis,
  optionalGetAxisIds,
  (rotation, rotationAxis, ids) =>
    rotation === null
      ? null
      : indexGetter(rotation, rotationAxis, ids ?? rotationAxis.axisIds, 'rotation'),
);

export const selectorChartsInteractionRotationAxisValue = createSelector(
  selectorChartRotationAxis,
  selectorChartsInteractionRotationAxisIndex,
  optionalGetAxisId,
  (rotationAxis, rotationIndex, id) => {
    id = id ?? rotationAxis.axisIds[0];
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
  selectorChartRotationAxis,
  selectorChartsInteractionRotationAxisIndexes,
  optionalGetAxisIds,
  (rotationAxis, rotationIndexes, ids) => {
    ids = ids ?? rotationAxis.axisIds;
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
export const selectorChartsInteractionTooltipRotationAxes = createSelectorMemoizedWithOptions({
  memoizeOptions: {
    // Keep the same reference if array content is the same.
    // If possible, avoid this pattern by creating selectors that
    // uses string/number as arguments.
    resultEqualityCheck: isDeepEqual,
  },
})(selectorChartsInteractionRotationAxisIndexes, selectorChartRotationAxis, (indexes, axes) => {
  if (indexes === null) {
    return [];
  }

  return axes.axisIds
    .map(
      (axisId, axisIndex): AxisItemIdentifier => ({
        axisId,
        dataIndex: indexes[axisIndex],
      }),
    )
    .filter(({ axisId, dataIndex }) => axes.axis[axisId].triggerTooltip && dataIndex >= 0);
});

// ============================= Radius axis =============================

/**
 * Helper to get the radius associated to the interaction coordinate.
 */
export const selectorChartsInteractionRadius = createSelector(
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
  selectorChartPolarCenter,
  (x, y, center) => {
    if (x === null || y === null) {
      return null;
    }
    return Math.sqrt((x - center.cx) ** 2 + (y - center.cy) ** 2);
  },
);
export const selectorChartsInteractionRadiusAxisIndex = createSelector(
  selectorChartsInteractionRadius,
  selectorChartRadiusAxis,
  optionalGetAxisId,
  (radius, radiusAxis, id) =>
    radius === null ? null : indexGetter(radius, radiusAxis, id ?? radiusAxis.axisIds[0], 'radius'),
);

export const selectorChartsInteractionRadiusAxisIndexes = createSelector(
  selectorChartsInteractionRadius,
  selectorChartRadiusAxis,
  optionalGetAxisIds,
  (radius, radiusAxis, ids) =>
    radius === null ? null : indexGetter(radius, radiusAxis, ids ?? radiusAxis.axisIds, 'radius'),
);

export const selectorChartsInteractionRadiusAxisValue = createSelector(
  selectorChartRadiusAxis,
  selectorChartsInteractionRadiusAxisIndex,
  optionalGetAxisId,
  (radiusAxis, radiusIndex, id) => {
    id = id ?? radiusAxis.axisIds[0];
    if (radiusIndex === null || radiusIndex === -1 || radiusAxis.axisIds.length === 0) {
      return null;
    }

    const data = radiusAxis.axis[id]?.data;
    if (!data) {
      return null;
    }
    return data[radiusIndex];
  },
);

export const selectorChartsInteractionRadiusAxisValues = createSelector(
  selectorChartRadiusAxis,
  selectorChartsInteractionRadiusAxisIndexes,
  optionalGetAxisIds,
  (radiusAxis, radiusIndexes, ids) => {
    ids = ids ?? radiusAxis.axisIds;
    if (radiusIndexes === null) {
      return null;
    }

    return ids.map((id, axisIndex) => {
      const radiusIndex = radiusIndexes[axisIndex];
      if (radiusIndex === -1) {
        return null;
      }
      return radiusAxis.axis[id].data?.[radiusIndex];
    });
  },
);

/**
 * Get radius-axis ids and corresponding data index that should be display in the tooltip.
 */
export const selectorChartsInteractionTooltipRadiusAxes = createSelectorMemoizedWithOptions({
  memoizeOptions: {
    // Keep the same reference if array content is the same.
    // If possible, avoid this pattern by creating selectors that
    // uses string/number as arguments.
    resultEqualityCheck: isDeepEqual,
  },
})(selectorChartsInteractionRadiusAxisIndexes, selectorChartRadiusAxis, (indexes, axes) => {
  if (indexes === null) {
    return [];
  }

  return axes.axisIds
    .map(
      (axisId, axisIndex): AxisItemIdentifier => ({
        axisId,
        dataIndex: indexes[axisIndex],
      }),
    )
    .filter(({ axisId, dataIndex }) => axes.axis[axisId].triggerTooltip && dataIndex >= 0);
});

// ============================= Cross axes selectors =============================

/**
 * Return `true` if the axis tooltip has something to display.
 */
export const selectorChartsInteractionPolarAxisTooltip = createSelector(
  selectorChartsInteractionTooltipRotationAxes,
  selectorChartsInteractionTooltipRadiusAxes,
  (rotationTooltip, radiusTooltip) => rotationTooltip.length > 0 || radiusTooltip.length > 0,
);
