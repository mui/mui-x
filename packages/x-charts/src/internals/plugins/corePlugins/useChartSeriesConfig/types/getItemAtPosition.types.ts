import type { SeriesItemIdentifierWithType } from '../../../../../models/seriesType';
import type { ChartState } from '../../../models/chart';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { ChartSeriesTypeRequiredPlugins } from './seriesConfig.types';

export type GetItemAtPosition<SeriesType extends ChartSeriesType, AxisType extends 'cartesian' | 'polar'> = (
  state: ChartState<ChartSeriesTypeRequiredPlugins<SeriesType, AxisType>>,
  point: { x: number; y: number },
) => SeriesItemIdentifierWithType<SeriesType> | undefined;
