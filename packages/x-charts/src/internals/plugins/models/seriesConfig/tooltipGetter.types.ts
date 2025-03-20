import type { ItemTooltip } from '../../../../ChartsTooltip';
import type {
  ChartItemIdentifier,
  ChartSeriesDefaultized,
  ChartSeriesType,
} from '../../../../models/seriesType/config';
import { SeriesId } from '../../../../models/seriesType/common';
import { AxisId } from '../../../../models/axis';

export type TooltipGetter<TSeriesType extends ChartSeriesType> = (params: {
  series: ChartSeriesDefaultized<TSeriesType>;
  getColor: (dataIndex: number) => string;
  identifier: ChartItemIdentifier<TSeriesType> | null;
}) => ItemTooltip<TSeriesType> | null;

export type AxisTriggeringTooltipGetter<
  TSeriesType extends ChartSeriesType,
  Directions extends 'x' | 'y' | 'rotation' | 'radius' = 'x' | 'y',
> = (
  series: Record<SeriesId, ChartSeriesDefaultized<TSeriesType>>,
) => { direction: Directions; axisId: AxisId | undefined }[];
