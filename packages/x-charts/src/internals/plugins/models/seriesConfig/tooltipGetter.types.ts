import type {
  ChartItemIdentifier,
  ChartSeriesDefaultized,
  ChartSeriesType,
  ChartsSeriesConfig,
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
import { ChartsLabelMarkProps } from '../../../../ChartsLabel/ChartsLabelMark';
import { ColorGetter } from './colorProcessor.types';

export interface ItemTooltip<T extends ChartSeriesType> {
  /**
   * An object that identifies the item to display.
   */
  identifier: ChartItemIdentifier<T>;
  /**
   * The color associated to the item.
   */
  color: string;
  /**
   * The item label.
   */
  label: string | undefined;
  /**
   * The item value.
   */
  value: ChartsSeriesConfig[T]['valueType'];
  /**
   * The value formatted with context set to "tooltip".
   */
  formattedValue: string | null;
  /**
   * The series mark type.
   */
  markType: ChartsLabelMarkProps['type'];
}

export type ItemTooltipWithMultipleValues<T extends 'radar' = 'radar'> = Pick<
  ItemTooltip<T>,
  'identifier' | 'color' | 'label' | 'markType'
> & {
  values: {
    /**
     * The metric label.
     */
    label: string | undefined;
    /**
     * The value.
     */
    value: ChartsSeriesConfig[T]['valueType'];
    /**
     * The value formatted with context set to "tooltip".
     */
    formattedValue: string | null;
    /**
     * The series mark type.
     */
    markType: ChartsLabelMarkProps['type'];
  }[];
};

export interface TooltipGetterAxesConfig {
  x?: AxisDefaultized<any, any, ChartsXAxisProps>;
  y?: AxisDefaultized<any, any, ChartsYAxisProps>;
  rotation?: PolarAxisDefaultized<any, any, ChartsRotationAxisProps>;
  radius?: PolarAxisDefaultized<any, any, ChartsRadiusAxisProps>;
}

export type TooltipGetter<TSeriesType extends ChartSeriesType> = (params: {
  series: ChartSeriesDefaultized<TSeriesType>;
  axesConfig: TooltipGetterAxesConfig;
  getColor: ColorGetter<TSeriesType>;
  identifier: ChartItemIdentifier<TSeriesType> | null;
}) =>
  | (TSeriesType extends 'radar'
      ? ItemTooltipWithMultipleValues<TSeriesType>
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
