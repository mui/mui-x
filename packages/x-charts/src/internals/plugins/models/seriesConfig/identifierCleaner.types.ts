import type { SeriesItemIdentifier } from '../../../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

export type IdentifierCleaner<
  T extends ChartSeriesType = ChartSeriesType,
  S extends SeriesItemIdentifier<T> = SeriesItemIdentifier<T>,
  I extends S = S,
> = (identifier: I) => S;
