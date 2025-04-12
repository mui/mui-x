import { createSelector } from '../../utils/selectors';
import {
  selectorChartsInteractionPointerX,
  selectorChartsInteractionPointerY,
} from '../useChartInteraction/useChartInteraction.selectors';
import { generateSvg2rotation } from './coordinateTransformation';
import { getAxisIndex } from './getAxisIndex';
import { selectorChartPolarCenter, selectorChartRotationAxis } from './useChartPolarAxis.selectors';

export const selectorChartsInteractionRotationAxisIndex = createSelector(
  [
    selectorChartsInteractionPointerX,
    selectorChartsInteractionPointerY,
    selectorChartPolarCenter,
    selectorChartRotationAxis,
  ],
  (x, y, center, rotationAxis) => {
    if (x === null || y === null || !rotationAxis.axis[rotationAxis.axisIds[0]]) {
      return null;
    }

    const rotation = generateSvg2rotation(center)(x, y);
    return getAxisIndex(rotationAxis.axis[rotationAxis.axisIds[0]], rotation);
  },
);

export const selectorChartsInteractionRotationAxisValue = createSelector(
  [
    selectorChartsInteractionPointerX,
    selectorChartsInteractionPointerY,
    selectorChartRotationAxis,
    selectorChartsInteractionRotationAxisIndex,
  ],
  (x, y, rotationAxis, rotationIndex) => {
    if (x === null || y === null || rotationIndex === null || rotationIndex === -1) {
      return null;
    }

    const data = rotationAxis.axis[rotationAxis.axisIds[0]]?.data;
    if (!data) {
      return null;
    }
    return data[rotationIndex];
  },
);
