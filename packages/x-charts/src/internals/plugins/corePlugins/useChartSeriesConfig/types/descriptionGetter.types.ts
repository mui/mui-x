import type { ChartSeriesType, ChartsSeriesConfig } from '../../../../../models/seriesType/config';

export type DescriptionGetter<T extends ChartSeriesType> = (
  params: ChartsSeriesConfig[T]['descriptionGetterParams'],
) => string;
