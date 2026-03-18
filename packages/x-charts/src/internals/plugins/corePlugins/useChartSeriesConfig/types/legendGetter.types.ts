import type { SeriesLegendItemParams } from '../../../../../ChartsLegend';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { SeriesProcessorResult } from './seriesProcessor.types';

export type LegendGetter<SeriesType extends ChartSeriesType> = (
  series: SeriesProcessorResult<SeriesType>,
) => SeriesLegendItemParams[];
