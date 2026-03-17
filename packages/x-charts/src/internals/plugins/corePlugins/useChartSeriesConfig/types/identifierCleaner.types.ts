import type { SeriesItemIdentifier } from '../../../../../models';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';

export type IdentifierCleaner<T extends ChartSeriesType = ChartSeriesType> = (
  identifier: SeriesItemIdentifier<T>,
) => SeriesItemIdentifier<T>;
