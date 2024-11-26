import { createSelector, ChartRootSelector } from '../../utils/selectors';
import { UseChartDimensionsSignature } from './useChartDimensions.types';

const selectorChartDimensionsState: ChartRootSelector<UseChartDimensionsSignature> = (state) =>
  state.dimensions;

/**
 * Get the id attribute of the chart.
 * @param {ChartState<[UseChartDimensionsSignature]>} state The state of the chart.
 * @returns {string} The id attribute of the chart.
 */
export const selectorChartDrawingArea = createSelector(
  selectorChartDimensionsState,
  (drawingArea) => drawingArea,
);
