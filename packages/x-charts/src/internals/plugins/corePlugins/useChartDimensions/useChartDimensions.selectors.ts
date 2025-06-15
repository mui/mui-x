import { ChartRootSelector, createSelector } from '../../utils/selectors';
import type { UseChartDimensionsSignature } from './useChartDimensions.types';
import {
  selectorChartBottomAxisSize,
  selectorChartLeftAxisSize,
  selectorChartRightAxisSize,
  selectorChartTopAxisSize,
} from '../../featurePlugins/useChartCartesianAxis/useChartAxisSize.selectors';
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

const selectorChartTopMargin = (state: ChartState<[UseChartDimensionsSignature]>) =>
  state.dimensions.margin.top;
const selectorChartRightMargin = (state: ChartState<[UseChartDimensionsSignature]>) =>
  state.dimensions.margin.right;
const selectorChartBottomMargin = (state: ChartState<[UseChartDimensionsSignature]>) =>
  state.dimensions.margin.bottom;
const selectorChartLeftMargin = (state: ChartState<[UseChartDimensionsSignature]>) =>
  state.dimensions.margin.left;

export const selectorChartDrawingArea = createSelector(
  selectorChartWidth,
  selectorChartHeight,
  selectorChartTopMargin,
  selectorChartRightMargin,
  selectorChartBottomMargin,
  selectorChartLeftMargin,
  selectorChartTopAxisSize,
  selectorChartRightAxisSize,
  selectorChartBottomAxisSize,
  selectorChartLeftAxisSize,
  (
    width,
    height,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    axisSizeTop,
    axisSizeRight,
    axisSizeBottom,
    axisSizeLeft,
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
  selectorChartDimensionsState,
  (dimensionsState) => ({
    width: dimensionsState.propsWidth,
    height: dimensionsState.propsHeight,
  }),
);

export const selectorChartContainerSize = createSelector(
  selectorChartWidth,
  selectorChartHeight,
  (width, height) => ({
    width,
    height,
  }),
);
