import type { LegendItemParams } from '../../../../ChartsLegend';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { SeriesProcessorResult } from './seriesProcessor.types';

export type LegendGetter<T extends ChartSeriesType> = (
  series: SeriesProcessorResult<T>,
) => LegendItemParams[];
