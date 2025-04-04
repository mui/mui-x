import type { ItemTooltip } from '../../../../ChartsTooltip';
import type {
  ChartItemIdentifier,
  ChartSeriesDefaultized,
  ChartSeriesType,
} from '../../../../models/seriesType/config';
import { SeriesId } from '../../../../models/seriesType/common';
import {
  AxisDefaultized,
  AxisId,
  ChartsXAxisProps,
  ChartsYAxisProps,
  ChartsRotationAxisProps,
  ChartsRadiusAxisProps,
  PolarAxisDefaultized,
} from '../../../../models/axis';

export interface TooltipGetterAxesConfig {
  x?: AxisDefaultized<any, any, ChartsXAxisProps>;
  y?: AxisDefaultized<any, any, ChartsYAxisProps>;
  rotation?: PolarAxisDefaultized<any, any, ChartsRotationAxisProps>;
  radius?: PolarAxisDefaultized<any, any, ChartsRadiusAxisProps>;
}

export type TooltipGetter<TSeriesType extends ChartSeriesType> = (params: {
  series: ChartSeriesDefaultized<TSeriesType>;
  axesConfig: TooltipGetterAxesConfig;
  getColor: (dataIndex: number) => string;
  identifier: ChartItemIdentifier<TSeriesType> | null;
}) =>
  | (TSeriesType extends 'radar'
      ? (ItemTooltip<TSeriesType> & { axisFormattedValue?: string })[]
      : ItemTooltip<TSeriesType>)
  | null;

/**
 * Return an array of the axes that should trigger the tooltip.
 *
 * If `axisId` is set to undefined, the default axis will be used.
 */
export type AxisTooltipGetter<
  TSeriesType extends ChartSeriesType,
  Directions extends 'x' | 'y' | 'rotation' | 'radius' = 'x' | 'y',
> = (
  series: Record<SeriesId, ChartSeriesDefaultized<TSeriesType>>,
) => { direction: Directions; axisId: AxisId | undefined }[];
