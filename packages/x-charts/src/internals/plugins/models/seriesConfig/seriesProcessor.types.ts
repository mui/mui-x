import type {
  ChartSeriesDefaultized,
  ChartSeriesType,
  ChartsSeriesConfig,
  DatasetType,
} from '../../../../models/seriesType/config';
import type { SeriesId } from '../../../../models/seriesType/common';
import { StackingGroupsType } from '../../../stackSeries';
import type { LegendItemParams } from '../../../../ChartsLegend';

export type SeriesProcessorParams<TSeriesType extends ChartSeriesType> = {
  series: Record<SeriesId, ChartsSeriesConfig[TSeriesType]['seriesInput']>;
  seriesOrder: SeriesId[];
};

export type SeriesProcessorResult<TSeriesType extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesDefaultized<TSeriesType>>;
  seriesOrder: SeriesId[];
} & (ChartsSeriesConfig[TSeriesType] extends {
  canBeStacked: true;
}
  ? { stackingGroups: StackingGroupsType }
  : {});

export type SeriesProcessor<TSeriesType extends ChartSeriesType> = (
  params: SeriesProcessorParams<TSeriesType>,
  dataset?: DatasetType,
) => SeriesProcessorResult<TSeriesType>;

export type LegendGetter<T extends ChartSeriesType> = (
  series: SeriesProcessorResult<T>,
) => LegendItemParams[];
