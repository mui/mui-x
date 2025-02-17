import { ChartRootSelector, createSelector } from '../../utils/selectors';
import type { UseChartDimensionsSignature } from './useChartDimensions.types';

export const selectorChartDimensionsState: ChartRootSelector<UseChartDimensionsSignature> = (
  state,
) => state.dimensions;

export const selectorChartDrawingArea = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => ({
    width: dimensionsState.width - dimensionsState.margin.left - dimensionsState.margin.right,
    left: dimensionsState.margin.left,
    right: dimensionsState.margin.right,
    height: dimensionsState.height - dimensionsState.margin.top - dimensionsState.margin.bottom,
    top: dimensionsState.margin.top,
    bottom: dimensionsState.margin.bottom,
  }),
);

export const selectorChartPropsSize = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => ({
    width: dimensionsState.propsWidth,
    height: dimensionsState.propsHeight,
  }),
);

export const selectorChartContainerSize = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => ({
    width: dimensionsState.width,
    height: dimensionsState.height,
  }),
);

/**
 * Get the id attribute of the chart.
 * @param {ChartState<[UseChartIdSignature]>} state The state of the chart.
 * @returns {string} The id attribute of the chart.
 */
export const selectorChartHasIntrinsicSize = createSelector(
  selectorChartContainerSize,
  (svgSize) => svgSize.width > 0 && svgSize.height > 0,
);
