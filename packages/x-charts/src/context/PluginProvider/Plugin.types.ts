import type {
  CartesianChartSeriesType,
  ChartSeries,
  ChartSeriesDefaultized,
  ChartSeriesType,
  ChartsSeriesConfig,
  DatasetType,
} from '../../models/seriesType/config';
import type { AxisConfig, AxisDefaultized } from '../../models/axis';
import type { DefaultizedSeriesType } from '../../models/seriesType';
import type { ZAxisDefaultized } from '../../models/z-axis';
import { SeriesId } from '../../models/seriesType/common';
import { StackingGroupsType } from '../../internals/stackSeries';
import { LegendItemParams } from '../../ChartsLegend/chartsLegend.types';

export type PluginProviderProps = {
  plugins?: ChartsPluginType<ChartSeriesType>[];
  children: React.ReactNode;
};

// TODO: wrong
export type PluginContextState = ChartsPluginType<ChartSeriesType>;

type ColorProcessor<T extends ChartSeriesType> = (
  series: DefaultizedSeriesType<T>,
  xAxis?: AxisDefaultized,
  yAxis?: AxisDefaultized,
  zAxis?: ZAxisDefaultized,
) => (dataIndex: number) => string;

export type ColorProcessorsConfig<T extends ChartSeriesType> = {
  [Key in T]?: ColorProcessor<Key>;
};

export type ChartsPluginType<T> = T extends ChartSeriesType
  ? {
      seriesType: T;
      seriesFormatter: Formatter<T>;
      colorProcessor: ColorProcessor<T>;
      xExtremumGetter?: ExtremumGetter<T>;
      yExtremumGetter?: ExtremumGetter<T>;
    }
  : never;

export type ExtremumGettersConfig<T extends ChartSeriesType = CartesianChartSeriesType> = {
  [K in T]?: ExtremumGetter<K>;
};

type ExtremumGetterParams<T extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeries<T>>;
  axis: AxisConfig;
  isDefaultAxis: boolean;
};

export type ExtremumGetterResult = [number, number] | [null, null];

export type ExtremumGetter<T extends ChartSeriesType> = (
  params: ExtremumGetterParams<T>,
) => ExtremumGetterResult;

export type FormatterParams<T extends ChartSeriesType> = {
  series: Record<SeriesId, ChartsSeriesConfig[T]['seriesInput']>;
  seriesOrder: SeriesId[];
};

export type FormatterResult<T extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesDefaultized<T>>;
  seriesOrder: SeriesId[];
} & (ChartsSeriesConfig[T] extends {
  canBeStacked: true;
}
  ? { stackingGroups: StackingGroupsType }
  : {});

export type Formatter<T extends ChartSeriesType> = (
  params: FormatterParams<T>,
  dataset?: DatasetType,
) => FormatterResult<T>;

export type LegendGetter<T extends ChartSeriesType> = (
  series: FormatterResult<T>,
) => LegendItemParams[];
