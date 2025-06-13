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

export const selectorChartMargin = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => dimensionsState.margin,
);
const selectorChartWidth = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => dimensionsState.width,
);
const selectorChartHeight = createSelector(
  selectorChartDimensionsState,
  (dimensionsState) => dimensionsState.height,
);

const selectorChartTopMargin = createSelector(selectorChartMargin, (margin) => margin.top);
const selectorChartRightMargin = createSelector(selectorChartMargin, (margin) => margin.right);
const selectorChartBottomMargin = createSelector(selectorChartMargin, (margin) => margin.bottom);
const selectorChartLeftMargin = createSelector(selectorChartMargin, (margin) => margin.left);

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
