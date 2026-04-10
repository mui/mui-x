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

export type SeriesProcessorResult<
  SeriesType extends ChartSeriesType,
  AxisType extends 'cartesian' | 'radial' = any,
> = {
  series: Record<SeriesId, ChartSeriesDefaultized<SeriesType, AxisType>>;
  seriesOrder: SeriesId[];
} & (ChartsSeriesConfig[SeriesType] extends {
  canBeStacked: true;
}
  ? { stackingGroups: StackingGroupsType }
  : {});

export type SeriesProcessor<
  SeriesType extends ChartSeriesType,
  AxisType extends 'cartesian' | 'radial' = any,
> = (
  params: SeriesProcessorParams<SeriesType>,
  dataset?: Readonly<DatasetType>,
  isItemVisible?: IsItemVisibleFunction,
) => SeriesProcessorResult<SeriesType, AxisType>;
