import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import {
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import { ChartSeriesType } from '../../../../models/seriesType/config';
import { ChartRootSelector, createSelector } from '../../utils/selectors';
import { computeAxisValue } from './computeAxisValue';
import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';

export const selectorChartCartesianAxisState: ChartRootSelector<
  UseChartCartesianAxisSignature<ChartSeriesType>
> = (state) => state.cartesianAxis;

export const selectorChartRawXAxis = createSelector(
  selectorChartCartesianAxisState,
  (axis) => axis.x,
);

export const selectorChartXAxis = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
  ],
  (axis, drawingArea, formattedSeries, seriesConfig) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'x',
    }),
);

export const selectorChartRawYAxis = createSelector(
  selectorChartCartesianAxisState,
  (axis) => axis.y,
);

export const selectorChartYAxis = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
  ],
  (axis, drawingArea, formattedSeries, seriesConfig) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'y',
    }),
);
