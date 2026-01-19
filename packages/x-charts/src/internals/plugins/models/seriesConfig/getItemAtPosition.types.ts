import type { SeriesItemIdentifier } from '../../../../models/seriesType';
import type { ChartState } from '../chart';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { ChartSeriesTypeRequiredPlugins } from './seriesConfig.types';

export type GetItemAtPosition<TSeriesType extends ChartSeriesType> = (
  state: ChartState<ChartSeriesTypeRequiredPlugins<TSeriesType>>,
  point: { x: number; y: number },
) => SeriesItemIdentifier<TSeriesType> | undefined;
