import type {
  ChartSeriesDefaultized,
  ChartSeriesType,
  ChartsSeriesConfig,
  DatasetType,
} from '../../../../../models/seriesType/config';
import type { SeriesId } from '../../../../../models/seriesType/common';
import type { StackingGroupsType } from '../../../../stacking';
import type { IsItemVisibleFunction } from '../../../featurePlugins/useChartVisibilityManager';

export type SeriesProcessorParams<SeriesType extends ChartSeriesType> = {
  series: Record<SeriesId, ChartsSeriesConfig[SeriesType]['seriesInput']>;
  seriesOrder: SeriesId[];
};

export type SeriesProcessorResult<SeriesType extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesDefaultized<SeriesType>>;
  seriesOrder: SeriesId[];
} & (ChartsSeriesConfig[SeriesType] extends {
  canBeStacked: true;
}
  ? { stackingGroups: StackingGroupsType }
  : {});

/*
 * A series processor may run synchronously (returning the result directly) or
 * asynchronously (returning a Promise). Async processors are awaited by the
 * `useChartSeries` plugin effect and their result is written back to the store
 * once settled. Selectors stay synchronous and read the last settled value.
 */
export type SeriesProcessor<SeriesType extends ChartSeriesType> = (
  params: SeriesProcessorParams<SeriesType>,
  dataset?: Readonly<DatasetType>,
  isItemVisible?: IsItemVisibleFunction,
) => SeriesProcessorResult<SeriesType> | Promise<SeriesProcessorResult<SeriesType>>;
