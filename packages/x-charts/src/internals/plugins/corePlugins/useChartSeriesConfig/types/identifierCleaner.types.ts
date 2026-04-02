import type { SeriesItemIdentifierWithType } from '../../../../../models';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';

export type IdentifierCleaner<SeriesType extends ChartSeriesType = ChartSeriesType> = (
  identifier: SeriesItemIdentifierWithType<SeriesType>,
) => SeriesItemIdentifierWithType<SeriesType>;
