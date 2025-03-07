import type { AxisDefaultized } from '../../../../models/axis';
import type { DefaultizedSeriesType } from '../../../../models/seriesType';
import type { ZAxisDefaultized } from '../../../../models/z-axis';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

export type ColorProcessor<TSeriesType extends ChartSeriesType> = (
  series: DefaultizedSeriesType<TSeriesType>,
  xAxis?: AxisDefaultized,
  yAxis?: AxisDefaultized,
  zAxis?: ZAxisDefaultized,
) => (dataIndex: number) => string;
