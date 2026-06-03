import { type ChartsLocaleText } from '../../../../../locales/utils/chartsLocaleTextApi';
import {
  type ChartSeriesType,
  type ChartsSeriesConfig,
} from '../../../../../models/seriesType/config';

export type DescriptionGetter<T extends ChartSeriesType> = (
  params: ChartsSeriesConfig[T]['descriptionGetterParams'] & { localeText: ChartsLocaleText },
) => string;
