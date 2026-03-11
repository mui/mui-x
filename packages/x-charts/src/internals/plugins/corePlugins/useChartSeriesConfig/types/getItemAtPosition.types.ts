import type { SeriesItemIdentifierWithType } from '../../../../../models/seriesType';
import type { ChartState } from '../../../models/chart';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { ChartSeriesTypeRequiredPlugins } from './seriesConfig.types';

export type GetItemAtPosition<SeriesType extends ChartSeriesType> = (
  state: ChartState<ChartSeriesTypeRequiredPlugins<SeriesType>>,
  point: { x: number; y: number },
) => SeriesItemIdentifierWithType<SeriesType> | undefined;
