import type {
  CartesianChartSeriesType,
  ChartSeriesDefaultized,
} from '../../../../models/seriesType/config';
import type { AxisConfig } from '../../../../models/axis';
import type { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import type { SeriesId } from '../../../../models/seriesType/common';

export type CartesianRangeGetterParams<TSeriesType extends CartesianChartSeriesType> = {
  axis: AxisConfig;
  drawingArea: ChartDrawingArea;
  series: Record<SeriesId, ChartSeriesDefaultized<TSeriesType>>;
};

export type CartesianRangeGetterResult = [number, number];

export type CartesianRangeGetter<TSeriesType extends CartesianChartSeriesType> = (
  params: CartesianRangeGetterParams<TSeriesType>,
) => CartesianRangeGetterResult;
