import { ChartsXAxisProps, ChartsYAxisProps, ComputedAxis } from '../models/axis';
import getColor from './seriesConfig/barRange/getColor';
import { ChartDrawingArea, useXAxes, useYAxes } from '../hooks';
import { ProcessedBarRangeData, ProcessedBarRangeSeriesData } from './types';
import { checkScaleErrors } from './checkScaleErrors';
import { SeriesProcessorResult } from '../internals/plugins/models/seriesConfig/seriesProcessor.types';
import { ComputedAxisConfig } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.types';
import { useBarRangeSeriesContext } from '../hooks/useBarRangeSeries';

export function useBarRangePlotData(
  drawingArea: ChartDrawingArea,
  xAxes: ComputedAxisConfig<ChartsXAxisProps>,
  yAxes: ComputedAxisConfig<ChartsYAxisProps>,
): ProcessedBarRangeSeriesData[] {
  const seriesData =
    useBarRangeSeriesContext() ??
    ({ series: {}, seriesOrder: [] } satisfies SeriesProcessorResult<'barRange'>);
  const defaultXAxisId = useXAxes().xAxisIds[0];
  const defaultYAxisId = useYAxes().yAxisIds[0];

  const { series, seriesOrder } = seriesData;

  const xMin = drawingArea.left;
  const xMax = drawingArea.left + drawingArea.width;

  const yMin = drawingArea.top;
  const yMax = drawingArea.top + drawingArea.height;

  const data = seriesOrder.map((seriesId, seriesIndex) => {
    const xAxisId = series[seriesId].xAxisId ?? defaultXAxisId;
    const yAxisId = series[seriesId].yAxisId ?? defaultYAxisId;

    const xAxisConfig = xAxes[xAxisId];
    const yAxisConfig = yAxes[yAxisId];

    const verticalLayout = series[seriesId].layout === 'vertical';

    checkScaleErrors(
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

    const colorGetter = getColor(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);
    const bandWidth = baseScaleConfig.scale.bandwidth();

    const { barWidth, offset } = getBandSize({
      bandWidth,
      numberOfGroups: seriesOrder.length,
      gapRatio: baseScaleConfig.barGapRatio,
    });
    const barOffset = seriesIndex * (barWidth + offset);

    const { data: currentSeriesData, layout } = series[seriesId];

    const seriesDataPoints: ProcessedBarRangeData[] = [];

    for (let dataIndex = 0; dataIndex < baseScaleConfig.data!.length; dataIndex += 1) {
      const baseValue = baseScaleConfig.data![dataIndex];
      const seriesValue = currentSeriesData[dataIndex];

      if (seriesValue == null) {
        continue;
      }

      const valueCoordinates = [seriesValue.start, seriesValue.end].map((v) =>
        verticalLayout ? yScale(v)! : xScale(v)!,
      );

      const minValueCoord = Math.round(Math.min(...valueCoordinates));
      const maxValueCoord = Math.round(Math.max(...valueCoordinates));

      const barSize = maxValueCoord - minValueCoord;

      const result = {
        seriesId,
        dataIndex,
        layout,
        x: verticalLayout ? xScale(baseValue)! + barOffset : minValueCoord,
        y: verticalLayout ? minValueCoord : yScale(baseValue)! + barOffset,
        xOrigin: xScale(0) ?? 0,
        yOrigin: yScale(0) ?? 0,
        height: verticalLayout ? barSize : barWidth,
        width: verticalLayout ? barWidth : barSize,
        color: colorGetter(dataIndex),
        value: currentSeriesData[dataIndex],
      };

      if (
        result.x > xMax ||
        result.x + result.width < xMin ||
        result.y > yMax ||
        result.y + result.height < yMin
      ) {
        continue;
      }

      seriesDataPoints.push(result);
    }

    return {
      seriesId,
      data: seriesDataPoints,
    };
  });

  return data;
}

/**
 * Solution of the equations
 * W = barWidth * N + offset * (N-1)
 * offset / (offset + barWidth) = r
 * @param bandWidth The width available to place bars.
 * @param numberOfGroups The number of bars to place in that space.
 * @param gapRatio The ratio of the gap between bars over the bar width.
 * @returns The bar width and the offset between bars.
 */
function getBandSize({
  bandWidth: W,
  numberOfGroups: N,
  gapRatio: r,
}: {
  bandWidth: number;
  numberOfGroups: number;
  gapRatio: number;
}) {
  if (r === 0) {
    return {
      barWidth: W / N,
      offset: 0,
    };
  }
  const barWidth = W / (N + (N - 1) * r);
  const offset = r * barWidth;
  return {
    barWidth,
    offset,
  };
}
