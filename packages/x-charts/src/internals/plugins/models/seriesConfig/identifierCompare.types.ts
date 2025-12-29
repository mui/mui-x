import type { ChartSeriesType, ChartsSeriesConfig } from '../../../../models/seriesType/config';

export type IdentifierCompare<TSeriesType extends ChartSeriesType> = (
  identifier1: ChartsSeriesConfig[TSeriesType]['itemIdentifier'],
  identifier2: ChartsSeriesConfig[TSeriesType]['itemIdentifier'],
) => boolean;
