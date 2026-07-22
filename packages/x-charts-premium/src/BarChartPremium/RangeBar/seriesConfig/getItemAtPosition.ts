import {
  selectorAllSeriesOfType,
  selectorChartXAxis,
  selectorChartYAxis,
} from '@mui/x-charts/internals';
import type {
  ChartState,
  ProcessedSeries,
  UseChartCartesianAxisSignature,
} from '@mui/x-charts/internals';
import type { FocusedItemIdentifier } from '@mui/x-charts/models';
import { createGetRangeBarDimensions } from '../createGetRangeBarDimensions';

export default function getItemAtPosition(
  state: ChartState<[UseChartCartesianAxisSignature]>,
  point: { x: number; y: number },
): FocusedItemIdentifier<'rangeBar'> | undefined {
  const { axis: xAxes, axisIds: xAxisIds } = selectorChartXAxis(state);
  const { axis: yAxes, axisIds: yAxisIds } = selectorChartYAxis(state);
  const seriesState = selectorAllSeriesOfType(state, 'rangeBar') as ProcessedSeries['rangeBar'];

  if (!seriesState || seriesState.seriesOrder.length === 0) {
    return undefined;
  }

  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  for (let seriesIndex = 0; seriesIndex < seriesState.seriesOrder.length; seriesIndex += 1) {
    const seriesId = seriesState.seriesOrder[seriesIndex];
    const series = seriesState.series[seriesId];

    if (series.hidden) {
      continue;
    }

    const getRangeBarDimensions = createGetRangeBarDimensions({
      verticalLayout: series.layout === 'vertical',
      xAxisConfig: xAxes[series.xAxisId ?? defaultXAxisId],
      yAxisConfig: yAxes[series.yAxisId ?? defaultYAxisId],
      series,
      numberOfGroups: seriesState.seriesOrder.length,
    });

    for (let dataIndex = 0; dataIndex < series.data.length; dataIndex += 1) {
      const dimensions = getRangeBarDimensions(dataIndex, seriesIndex);

      if (
        dimensions &&
        point.x >= dimensions.x &&
        point.x <= dimensions.x + dimensions.width &&
        point.y >= dimensions.y &&
        point.y <= dimensions.y + dimensions.height
      ) {
        return { type: 'rangeBar', seriesId, dataIndex };
      }
    }
  }

  return undefined;
}
