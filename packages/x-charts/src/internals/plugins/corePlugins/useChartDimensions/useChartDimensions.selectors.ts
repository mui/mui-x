import { ChartRootSelector, createSelector } from '../../utils/selectors';
import type { UseChartDimensionsSignature } from './useChartDimensions.types';
import {
  selectorChartBottomAxisSize,
  selectorChartLeftAxisSize,
  selectorChartRightAxisSize,
  selectorChartTopAxisSize,
} from '../../featurePlugins/useChartCartesianAxis/useChartAxisSize.selectors';

export const selectorChartDimensionsState: ChartRootSelector<UseChartDimensionsSignature> = (
  state,
) => state.dimensions;

export const selectorChartDrawingArea = createSelector(
  selectorChartDimensionsState,
  selectorChartTopAxisSize,
  selectorChartRightAxisSize,
  selectorChartBottomAxisSize,
  selectorChartLeftAxisSize,
  (dimensionsState, axisSizeTop, axisSizeRight, axisSizeBottom, axisSizeLeft) => ({
    width:
      dimensionsState.width -
      dimensionsState.margin.left -
      dimensionsState.margin.right -
      axisSizeLeft -
      axisSizeRight,
    left: dimensionsState.margin.left + axisSizeLeft,
    right: dimensionsState.margin.right + axisSizeRight,
    height:
      dimensionsState.height -
      dimensionsState.margin.top -
      dimensionsState.margin.bottom -
      axisSizeTop -
      axisSizeBottom,
    top: dimensionsState.margin.top + axisSizeTop,
    bottom: dimensionsState.margin.bottom + axisSizeBottom,
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
