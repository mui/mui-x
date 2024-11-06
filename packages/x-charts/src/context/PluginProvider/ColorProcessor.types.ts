import type { AxisDefaultized } from '../../models/axis';
import type { DefaultizedSeriesType } from '../../models/seriesType';
import type { ZAxisDefaultized } from '../../models/z-axis';
import type { ChartSeriesType } from '../../models/seriesType/config';

export type ColorProcessor<T extends ChartSeriesType> = (
  series: DefaultizedSeriesType<T>,
  xAxis?: AxisDefaultized,
  yAxis?: AxisDefaultized,
  zAxis?: ZAxisDefaultized,
) => (dataIndex: number) => string;

export type ColorProcessorsConfig<T extends ChartSeriesType> = {
  [Key in T]?: ColorProcessor<Key>;
};
