import {
  CartesianChartSeriesType,
  ChartSeriesType,
  ExtremumGetter,
  Formatter,
} from './seriesType/config';
import { AxisDefaultized } from './axis';
import { DefaultizedSeriesType } from './seriesType';
import { ZAxisDefaultized } from './z-axis';

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
