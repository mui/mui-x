import type { SeriesItemIdentifier } from '../../../../../models';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';

export type IdentifierSerializer<TSeriesType extends ChartSeriesType> = (
  identifier: SeriesItemIdentifier<TSeriesType>,
) => string;
