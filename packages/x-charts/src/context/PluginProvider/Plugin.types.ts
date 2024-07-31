import type {
  CartesianChartSeriesType,
  ChartSeriesType,
  ExtremumGetter,
  Formatter,
} from '../../models/seriesType/config';
import type { AxisDefaultized } from '../../models/axis';
import type { DefaultizedSeriesType } from '../../models/seriesType';
import type { ZAxisDefaultized } from '../../models/z-axis';

export type PluginProviderProps = {
  children: React.ReactNode;
};

export type PluginContextState = {};

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
