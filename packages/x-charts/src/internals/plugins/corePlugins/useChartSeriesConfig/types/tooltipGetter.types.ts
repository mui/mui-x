import type { SeriesItemIdentifierWithType } from '../../../../../models/seriesType';
import type {
  ChartSeriesDefaultized,
  ChartSeriesType,
  ChartsSeriesConfig,
} from '../../../../../models/seriesType/config';
import { type SeriesId } from '../../../../../models/seriesType/common';
import {
  type AxisId,
  type ChartsRotationAxisProps,
  type ChartsRadiusAxisProps,
  type PolarAxisDefaultized,
  type ComputedXAxis,
  type ComputedYAxis,
} from '../../../../../models/axis';
import { type ChartsLabelMarkProps } from '../../../../../ChartsLabel/ChartsLabelMark';
import { type ColorGetter } from './colorProcessor.types';

export interface ItemTooltipValue<SeriesType extends ChartSeriesType> {
  /**
   * The metric label.
   */
  label: string | undefined;
  /**
   * The value.
   */
  value: SeriesType extends 'heatmap'
    ? number | null
    : SeriesType extends 'ohlc'
      ? { open: number; high: number; low: number; close: number } | null
      : ChartsSeriesConfig[SeriesType]['valueType'];
  /**
   * The value formatted with context set to "tooltip".
   */
  formattedValue: SeriesType extends 'ohlc'
    ? { open: string | null; high: string | null; low: string | null; close: string | null }
    : string | null;
  /**
   * The series mark type.
   */
  markType: ChartsLabelMarkProps['type'];
  /**
   * The series mark shape.
   */
  markShape?: ChartsLabelMarkProps['markShape'];
}

export interface ItemTooltip<
  SeriesType extends ChartSeriesType,
> extends ItemTooltipValue<SeriesType> {
  /**
   * An object that identifies the item to display.
   */
  identifier: SeriesItemIdentifierWithType<SeriesType>;
  /**
   * The color associated with the item.
   */
  color: string;
}

export type ItemTooltipWithMultipleValues<T extends 'radar' = 'radar'> = Pick<
  ItemTooltip<T>,
  'identifier' | 'color' | 'label' | 'markType' | 'markShape'
> & {
  values: ItemTooltipValue<T>[];
};

export interface TooltipGetterAxesConfig {
  x?: ComputedXAxis;
  y?: ComputedYAxis;
  rotation?: PolarAxisDefaultized<any, any, ChartsRotationAxisProps>;
  radius?: PolarAxisDefaultized<any, any, ChartsRadiusAxisProps>;
}

export type TooltipGetter<SeriesType extends ChartSeriesType, AxisType extends 'cartesian' | 'polar' = any> = (params: {
  series: ChartSeriesDefaultized<SeriesType, AxisType>;
  axesConfig: TooltipGetterAxesConfig;
  getColor: ColorGetter<SeriesType>;
  identifier: SeriesItemIdentifierWithType<SeriesType> | null;
}) =>
  | (SeriesType extends 'radar'
      ? ItemTooltipWithMultipleValues<SeriesType>
      : ItemTooltip<SeriesType>)
  | null;

/**
 * If `axisId` is set to undefined, the default axis will be used.
 *
 * @param {Record<SeriesId, ChartSeriesDefaultized<SeriesType>>} series A map of series ID to their series configuration.
 * @returns {{ direction: Directions; axisId: AxisId | undefined }[]} an array of the axes that should trigger the tooltip.
 */
export type AxisTooltipGetter<
  SeriesType extends ChartSeriesType,
  Directions extends 'x' | 'y' | 'rotation' | 'radius' = 'x' | 'y',
> = (
  series: Record<SeriesId, ChartSeriesDefaultized<SeriesType, Directions extends 'x' | 'y' ? 'cartesian' : 'polar'>>,
) => { direction: Directions; axisId: AxisId | undefined }[];
