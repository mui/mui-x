import type { AxisConfig } from '../../../../models';
import type { CartesianChartSeriesType } from '../../../../models/seriesType/config';
import type { ChartSeriesConfig } from '../../models/seriesConfig';
import type { ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import type {
  CartesianRangeGetter,
  CartesianRangeGetterResult,
} from '../../models/seriesConfig/cartesianRangeGetter.types';
import type { ChartDrawingArea } from '../../../../hooks/useDrawingArea';

const defaultGetRangeX: CartesianRangeGetter<any> = ({ drawingArea, axis }) => {
  const range: [number, number] = [drawingArea.left, drawingArea.left + drawingArea.width];
  return axis.reverse ? [range[1], range[0]] : range;
};

const defaultGetRangeY: CartesianRangeGetter<any> = ({ drawingArea, axis }) => {
  const range: [number, number] = [drawingArea.top + drawingArea.height, drawingArea.top];
  return axis.reverse ? [range[1], range[0]] : range;
};

const axisRangeCallback = <TSeriesType extends CartesianChartSeriesType>(
  acc: CartesianRangeGetterResult,
  chartType: TSeriesType,
  axis: AxisConfig,
  axisDirection: 'x' | 'y',
  seriesConfig: ChartSeriesConfig<TSeriesType>,
  formattedSeries: ProcessedSeries<TSeriesType>,
  drawingArea: ChartDrawingArea,
): CartesianRangeGetterResult => {
  const getter =
    axisDirection === 'x'
      ? (seriesConfig[chartType].xRangeGetter ?? defaultGetRangeX)
      : (seriesConfig[chartType].yRangeGetter ?? defaultGetRangeY);
  const series = formattedSeries[chartType]?.series ?? {};

  const [minChartTypeData, maxChartTypeData] = (getter as CartesianRangeGetter<TSeriesType>)?.({
    axis,
    drawingArea,
    series,
  }) ?? [Infinity, -Infinity];

  const [minData, maxData] = acc;

  return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
};

export const getAxisRange = <T extends CartesianChartSeriesType>(
  drawingArea: ChartDrawingArea,
  axisDirection: 'x' | 'y',
  axis: AxisConfig,
  seriesConfig: ChartSeriesConfig<T>,
  formattedSeries: ProcessedSeries<T>,
) => {
  const charTypes = Object.keys(seriesConfig);

  const ranges = charTypes.reduce<CartesianRangeGetterResult>(
    (acc, charType) =>
      axisRangeCallback(
        acc,
        charType as T,
        axis,
        axisDirection,
        seriesConfig,
        formattedSeries,
        drawingArea,
      ),
    [Infinity, -Infinity],
  );

  if (Number.isNaN(ranges[0]) || Number.isNaN(ranges[1])) {
    return [Infinity, -Infinity];
  }

  return ranges;
};
