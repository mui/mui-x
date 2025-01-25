import type { ItemTooltip } from '../../../../ChartsTooltip';
import type {
  ChartItemIdentifier,
  ChartSeriesDefaultized,
  ChartSeriesType,
} from '../../../../models/seriesType/config';

export type TooltipGetter<T extends ChartSeriesType> = (params: {
  series: ChartSeriesDefaultized<T>;
  getColor: (dataIndex: number) => string;
  item: ChartItemIdentifier<T> | null;
}) => ItemTooltip<T> | null;
