import type { ChartSeriesType, ChartsSeriesConfig } from '../../../../models/seriesType/config';

export type IdentifierSerializer<TSeriesType extends ChartSeriesType> = (
  identifier: ChartsSeriesConfig[TSeriesType]['itemIdentifier'],
) => string;
