import type { SeriesItemIdentifierWithType } from '../../../../../models';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';

export type IdentifierSerializer<TSeriesType extends ChartSeriesType> = (
  identifier: SeriesItemIdentifierWithType<TSeriesType>,
) => string;
