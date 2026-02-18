import { type ChartDrawingArea, useXAxes, useYAxes } from '@mui/x-charts/hooks';
import {
  checkBarChartScaleErrors,
  type ComputedAxis,
  type ComputedAxisConfig,
  useStore,
} from '@mui/x-charts/internals';
import { type ChartsXAxisProps, type ChartsYAxisProps } from '@mui/x-charts/models';
import { type ProcessedRangeBarData, type ProcessedRangeBarSeriesData } from './types';
import { useRangeBarSeriesContext } from '../../hooks/useRangeBarSeries';
import { createGetRangeBarDimensions } from './createGetRangeBarDimensions';

export function useRangeBarPlotData(
  drawingArea: ChartDrawingArea,
  xAxes: ComputedAxisConfig<ChartsXAxisProps>,
  yAxes: ComputedAxisConfig<ChartsYAxisProps>,
): ProcessedRangeBarSeriesData[] {
  const store = useStore();
  const seriesData = useRangeBarSeriesContext() ?? { series: {}, seriesOrder: [] };
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];
  const getColor = store.state.seriesConfig.config.rangeBar.colorProcessor;

  const { series, seriesOrder } = seriesData;

  const xMin = drawingArea.left;
  const xMax = drawingArea.left + drawingArea.width;

  const yMin = drawingArea.top;
  const yMax = drawingArea.top + drawingArea.height;

  const data = seriesOrder.map((seriesId, seriesIndex) => {
    const verticalLayout = series[seriesId].layout === 'vertical';
    const getRangeBarDimensions = createGetRangeBarDimensions({
      verticalLayout,
      xAxisConfig: xAxes[series[seriesId].xAxisId ?? defaultXAxisId],
      yAxisConfig: yAxes[series[seriesId].yAxisId ?? defaultYAxisId],
      series: series[seriesId],
      numberOfGroups: seriesOrder.length,
    });

    const xAxisId = series[seriesId].xAxisId ?? defaultXAxisId;
    const yAxisId = series[seriesId].yAxisId ?? defaultYAxisId;

    const xAxisConfig = xAxes[xAxisId];
    const yAxisConfig = yAxes[yAxisId];

    checkBarChartScaleErrors(
      verticalLayout,
      seriesId,
      series[seriesId].data.length,
      xAxisId,
      xAxes,
      yAxisId,
      yAxes,
    );

    const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;

    const xScale = xAxisConfig.scale;
    const yScale = yAxisConfig.scale;
    const xOrigin = Math.round(xScale(0) ?? 0);
    const yOrigin = Math.round(yScale(0) ?? 0);

    const colorGetter = getColor(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);

    const { data: currentSeriesData, layout } = series[seriesId];

    const seriesDataPoints: ProcessedRangeBarData[] = [];

    for (let dataIndex = 0; dataIndex < baseScaleConfig.data!.length; dataIndex += 1) {
      const dimensions = getRangeBarDimensions(dataIndex, seriesIndex);

      if (
        dimensions === null ||
        dimensions.x > xMax ||
        dimensions.x + dimensions.width < xMin ||
        dimensions.y > yMax ||
        dimensions.y + dimensions.height < yMin
      ) {
        continue;
      }

      const result = {
        seriesId,
        dataIndex,
        color: colorGetter(dataIndex),
        value: currentSeriesData[dataIndex],
        hidden: series[seriesId].hidden,
        ...dimensions,
      };

      seriesDataPoints.push(result);
    }

    return {
      seriesId,
      data: seriesDataPoints,
      layout,
      xOrigin,
      yOrigin,
    };
  });

  return data;
}
