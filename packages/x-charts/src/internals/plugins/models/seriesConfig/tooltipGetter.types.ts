import type { ItemTooltip } from '../../../../ChartsTooltip';
import type {
  ChartItemIdentifier,
  ChartSeriesDefaultized,
  ChartSeriesType,
} from '../../../../models/seriesType/config';
import { AxisDefaultized, PolarAxisDefaultized } from '../../../../models/axis';

export interface TooltipGetterAxesConfig {
  x?: AxisDefaultized;
  y?: AxisDefaultized;
  rotation?: PolarAxisDefaultized;
  radius?: PolarAxisDefaultized;
}
export type TooltipGetter<T extends ChartSeriesType> = (params: {
  series: ChartSeriesDefaultized<T>;
  axesConfig: TooltipGetterAxesConfig;
  getColor: (dataIndex: number) => string;
  identifier: ChartItemIdentifier<T> | null;
}) =>
  | (T extends 'radar' ? (ItemTooltip<T> & { axisFormattedValue?: string })[] : ItemTooltip<T>)
  | null;
