import type {
  ComputedAxis,
  ProcessedSeries,
  ChartState,
  UseChartCartesianAxisSignature,
} from '@mui/x-charts/internals';
import {
  selectorAllSeriesOfType,
  selectorChartXAxis,
  selectorChartYAxis,
  getCartesianAxisIndex,
} from '@mui/x-charts/internals';
import type {
  ChartsXAxisProps,
  ChartsYAxisProps,
  SeriesItemIdentifierWithType,
} from '@mui/x-charts/models';

export default function getItemAtPosition(
  state: ChartState<[UseChartCartesianAxisSignature]>,
  point: { x: number; y: number },
): SeriesItemIdentifierWithType<'heatmap'> | undefined {
  const { axis: xAxis, axisIds: xAxisIds } = selectorChartXAxis(state);
  const { axis: yAxis, axisIds: yAxisIds } = selectorChartYAxis(state);
  const series = selectorAllSeriesOfType(state, 'heatmap') as ProcessedSeries['heatmap'];

  const xAxisWithScale = xAxis[xAxisIds[0]] as ComputedAxis<'band', any, ChartsXAxisProps>;
  const yAxisWithScale = yAxis[yAxisIds[0]] as ComputedAxis<'band', any, ChartsYAxisProps>;

  const seriesId = series?.seriesOrder[0];

  if (seriesId === undefined) {
    return undefined;
  }

  const xIndex = getCartesianAxisIndex(xAxisWithScale, point.x);
  const yIndex = getCartesianAxisIndex(yAxisWithScale, point.y);

  if (xIndex === -1 || yIndex === -1) {
    return undefined;
  }

  const dataIndex = series
    ? series.series[series.seriesOrder[0]].data.findIndex((d) => d[0] === xIndex && d[1] === yIndex)
    : -1;

  if (dataIndex === -1) {
    return {
      type: 'heatmap',
      seriesId,
      xIndex,
      yIndex,
    };
  }

  return {
    type: 'heatmap',
    seriesId,
    dataIndex,
    xIndex,
    yIndex,
  };
}
