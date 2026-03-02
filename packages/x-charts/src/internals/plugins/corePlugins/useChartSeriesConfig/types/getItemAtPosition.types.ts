import type { SeriesItemIdentifierWithType } from '../../../../../models/seriesType';
import type { ChartState } from '../../../models/chart';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { ChartSeriesTypeRequiredPlugins } from './seriesConfig.types';

export type GetItemAtPosition<TSeriesType extends ChartSeriesType> = (
  state: ChartState<ChartSeriesTypeRequiredPlugins<TSeriesType>>,
  point: { x: number; y: number },
) => SeriesItemIdentifierWithType<TSeriesType> | undefined;
