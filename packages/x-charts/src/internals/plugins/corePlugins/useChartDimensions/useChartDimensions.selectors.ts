import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type ChartRootSelector } from '../../utils/selectors';
import type { UseChartDimensionsSignature } from './useChartDimensions.types';
import { selectorChartAxisSizes } from '../../featurePlugins/useChartCartesianAxis/useChartAxisSize.selectors';
import { type ChartState } from '../../models/chart';

export const selectorChartDimensionsState: ChartRootSelector<UseChartDimensionsSignature> = (
  state,
) => state.dimensions;

export const selectorChartMargin = (state: ChartState<[UseChartDimensionsSignature]>) =>
  state.dimensions.margin;

export const selectorChartDrawingArea = createSelectorMemoized(
  selectorChartDimensionsState,
  selectorChartMargin,
  selectorChartAxisSizes,
  function selectorChartDrawingArea(
    { width, height },
    { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft },
    { left: axisSizeLeft, right: axisSizeRight, top: axisSizeTop, bottom: axisSizeBottom },
  ) {
    return {
      width: width - marginLeft - marginRight - axisSizeLeft - axisSizeRight,
      left: marginLeft + axisSizeLeft,
      right: marginRight + axisSizeRight,
      height: height - marginTop - marginBottom - axisSizeTop - axisSizeBottom,
      top: marginTop + axisSizeTop,
      bottom: marginBottom + axisSizeBottom,
    };
  },
);

export const selectorChartSvgWidth = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => dimensionsState.width,
);

export const selectorChartSvgHeight = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => dimensionsState.height,
);

export const selectorChartPropsWidth = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => dimensionsState.propsWidth,
);

export const selectorChartPropsHeight = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => dimensionsState.propsHeight,
);
