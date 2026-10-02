import type {
  ChartState,
  UseChartCartesianAxisSignature,
  ProcessedSeries,
} from '@mui/x-charts/internals';
import { selectorAllSeriesOfType } from '@mui/x-charts/internals';
import type { SeriesItemIdentifierWithData } from '@mui/x-charts/models';
import type { HeatmapItemIdentifier } from '../../models/seriesType/heatmap';

export default function getItemWithData(
  state: ChartState<[UseChartCartesianAxisSignature]>,
  identifier: HeatmapItemIdentifier,
): SeriesItemIdentifierWithData<'heatmap'> {
  const series = selectorAllSeriesOfType(state, 'heatmap') as ProcessedSeries['heatmap'];
  const { xIndex, yIndex } = identifier;

  return {
    ...identifier,
    value: series?.series[identifier.seriesId]?.heatmapData.getValue(xIndex, yIndex) ?? null,
  };
}
