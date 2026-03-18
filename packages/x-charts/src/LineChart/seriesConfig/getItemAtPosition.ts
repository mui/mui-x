import type { UseChartCartesianAxisSignature } from '../../internals/plugins/featurePlugins/useChartCartesianAxis';
import type { ChartState } from '../../internals/plugins/models/chart';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import { selectorAllSeriesOfType } from '../../internals/seriesSelectorOfType';
import type { ProcessedSeries } from '../../internals/plugins/corePlugins/useChartSeries';
import { getAxisIndex } from '../../internals/plugins/featurePlugins/useChartCartesianAxis/getAxisValue';
import type { SeriesItemIdentifierWithType } from '../../models/seriesType';

export default function getItemAtPosition(
  state: ChartState<[UseChartCartesianAxisSignature]>,
  point: { x: number; y: number },
): SeriesItemIdentifierWithType<'line'> | undefined {
  const { axis: xAxes, axisIds: xAxisIds } = selectorChartXAxis(state);
  const { axis: yAxes, axisIds: yAxisIds } = selectorChartYAxis(state);
  const series = selectorAllSeriesOfType(state, 'line') as ProcessedSeries['line'];

  if (!series || series.seriesOrder.length === 0) {
    return undefined;
  }

  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  let closestDistance = Infinity;
  let closestItem: SeriesItemIdentifierWithType<'line'> | undefined;

  for (const seriesId of series.seriesOrder) {
    const seriesItem = series.series[seriesId];

    if (seriesItem.hidden) {
      continue;
    }

    const xAxisId = seriesItem.xAxisId ?? defaultXAxisId;
    const yAxisId = seriesItem.yAxisId ?? defaultYAxisId;

    const xAxis = xAxes[xAxisId];
    const yAxis = yAxes[yAxisId];

    const dataIndex = getAxisIndex(xAxis, point.x);

    if (dataIndex === -1) {
      continue;
    }

    const yValue = seriesItem.visibleStackedData[dataIndex]?.[1];

    if (yValue == null) {
      continue;
    }

    const yPosition = yAxis.scale(yValue);

    if (yPosition == null) {
      continue;
    }

    const distance = Math.abs(point.y - yPosition);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = {
        type: 'line',
        seriesId,
        dataIndex,
      };
    }
  }

  return closestItem;
}
