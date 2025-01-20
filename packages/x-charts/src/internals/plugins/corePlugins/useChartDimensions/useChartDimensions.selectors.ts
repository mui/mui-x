import { ChartRootSelector, createSelector } from '../../utils/selectors';
import { UseChartDimensionsSignature } from './useChartDimensions.types';

export const selectorChartDimensionsState: ChartRootSelector<UseChartDimensionsSignature> = (
  state,
) => state.dimensions;

export const selectorChartDrawingArea = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => ({
    width: dimensionsState.width,
    left: dimensionsState.left,
    right: dimensionsState.right,
    height: dimensionsState.height,
    top: dimensionsState.top,
    bottom: dimensionsState.bottom,
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
    width: dimensionsState.width + dimensionsState.left + dimensionsState.right,
    height: dimensionsState.height + dimensionsState.top + dimensionsState.bottom,
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
