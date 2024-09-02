import type {
  ChartSeriesDefaultized,
  ChartSeriesType,
  ChartsSeriesConfig,
  DatasetType,
} from '../../models/seriesType/config';
import type { SeriesId } from '../../models/seriesType/common';
import type { StackingGroupsType } from '../../internals/stackSeries';
import type { LegendItemParams } from '../../ChartsLegend/chartsLegend.types';

export type SeriesFormatterParams<T extends ChartSeriesType> = {
  series: Record<SeriesId, ChartsSeriesConfig[T]['seriesInput']>;
  seriesOrder: SeriesId[];
};

export type SeriesFormatterResult<T extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesDefaultized<T>>;
  seriesOrder: SeriesId[];
} & (ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? { stackingGroups: StackingGroupsType }
  : {});

export type SeriesFormatter<T extends ChartSeriesType> = (
  params: SeriesFormatterParams<T>,
  dataset?: DatasetType,
) => SeriesFormatterResult<T>;

export type LegendGetter<T extends ChartSeriesType> = (
  series: SeriesFormatterResult<T>,
) => LegendItemParams[];

export type SeriesFormatterConfig<T extends ChartSeriesType = ChartSeriesType> = {
  // TODO replace the function type by Formatter<K>
  [K in T]?: (series: SeriesFormatterParams<K>, dataset?: DatasetType) => any;
};
