import { SeriesItemIdentifierWithType } from '../../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';

export type IdentifierSerializer<SeriesType extends ChartSeriesType> = (
  identifier: SeriesItemIdentifierWithType<SeriesType>,
) => string;
