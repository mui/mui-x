import type { ChartSeriesType, ChartsSeriesConfig } from '../../../../models/seriesType/config';

export type IdentifierCleaner<TSeriesType extends ChartSeriesType> = (
  identifier: Partial<ChartsSeriesConfig[TSeriesType]['itemIdentifier']> & { type: TSeriesType },
) => ChartsSeriesConfig[TSeriesType]['itemIdentifier'];
