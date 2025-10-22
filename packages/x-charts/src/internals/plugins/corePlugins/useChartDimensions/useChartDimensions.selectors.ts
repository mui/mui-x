import { createSelectorMemoized } from '@mui/x-internals/store';
import { ChartRootSelector, createSelector } from '../../utils/selectors';
import type { UseChartDimensionsSignature } from './useChartDimensions.types';
import { selectorChartAxisSizes } from '../../featurePlugins/useChartCartesianAxis/useChartAxisSize.selectors';
import { ChartState } from '../../models/chart';

export const selectorChartDimensionsState: ChartRootSelector<UseChartDimensionsSignature> = (
  state,
) => state.dimensions;

export const selectorChartMargin = (state: ChartState<[UseChartDimensionsSignature]>) =>
  state.dimensions.margin;

const selectorChartWidth = (state: ChartState<[UseChartDimensionsSignature]>) =>
  state.dimensions.width;
const selectorChartHeight = (state: ChartState<[UseChartDimensionsSignature]>) =>
  state.dimensions.height;

export const selectorChartDrawingArea = createSelectorMemoized(
  selectorChartDimensionsState,
  selectorChartMargin,
  selectorChartAxisSizes,
  (
    { width, height },
    { top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft },
    { left: axisSizeLeft, right: axisSizeRight, top: axisSizeTop, bottom: axisSizeBottom },
  ) => ({
    width: width - marginLeft - marginRight - axisSizeLeft - axisSizeRight,
    left: marginLeft + axisSizeLeft,
    right: marginRight + axisSizeRight,
    height: height - marginTop - marginBottom - axisSizeTop - axisSizeBottom,
    top: marginTop + axisSizeTop,
    bottom: marginBottom + axisSizeBottom,
  }),
);

export const selectorChartPropsSize = createSelector(
  [selectorChartDimensionsState],
  (dimensionsState) => ({
    width: dimensionsState.propsWidth,
    height: dimensionsState.propsHeight,
  }),
);

export const selectorChartContainerSize = createSelector(
  [selectorChartWidth, selectorChartHeight],
  (width, height) => ({
    width,
    height,
  }),
);
