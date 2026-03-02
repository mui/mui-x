import type { SeriesItemIdentifierWithType } from '../../../../../models';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';

export type IdentifierCleaner<T extends ChartSeriesType = ChartSeriesType> = (
  identifier: SeriesItemIdentifierWithType<T>,
) => SeriesItemIdentifierWithType<T>;
