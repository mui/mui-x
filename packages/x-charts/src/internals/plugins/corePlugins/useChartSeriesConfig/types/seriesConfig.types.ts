import type * as React from 'react';
import type { SeriesProcessor } from './seriesProcessor.types';
import type {
  CartesianChartSeriesType,
  ChartSeriesType,
  ChartsSeriesConfig,
  PolarChartSeriesType,
} from '../../../../../models/seriesType/config';
import type { ColorProcessor } from './colorProcessor.types';
import type { CartesianExtremumGetter } from './cartesianExtremumGetter.types';
import type { LegendGetter } from './legendGetter.types';
import type { AxisTooltipGetter, TooltipGetter } from './tooltipGetter.types';
import { type PolarExtremumGetter } from './polarExtremumGetter.types';
import { type GetSeriesWithDefaultValues } from './getSeriesWithDefaultValues.types';
import { type TooltipItemPositionGetter } from './tooltipItemPositionGetter.types';
import { type SeriesLayoutGetter } from './seriesLayout.types';
import { type KeyboardFocusHandler } from '../../../featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import { type IdentifierSerializer } from './identifierSerializer.types';
import { type IdentifierCleaner } from './identifierCleaner.types';
import { type GetItemAtPosition } from './getItemAtPosition.types';
import { type DescriptionGetter } from './descriptionGetter.types';
import { type UseChartCartesianAxisSignature } from '../../../featurePlugins/useChartCartesianAxis';
import { type UseChartPolarAxisSignature } from '../../../featurePlugins/useChartPolarAxis';
import { type HighlightCreator } from '../../../featurePlugins/useChartHighlight/highlightCreator.types';
import { type AxisTooltipContentProps, type ItemTooltipContentProps } from './TooltipContent.types';

export type ChartSeriesTypeRequiredPlugins<
  SeriesType extends ChartSeriesType,
  AxisType extends 'cartesian' | 'polar' = any,
> =
  Extract<ChartsSeriesConfig[SeriesType], { axisType: AxisType }> extends { axisType: infer A }
    ? 'cartesian' extends A
      ? 'polar' extends A
        ? [] // Dual-mode series (both cartesian and polar): should be [polar] | [cartesian], but this look too complex to maintain compared to its benefits.
        : [UseChartCartesianAxisSignature]
      : 'polar' extends A
        ? [UseChartPolarAxisSignature]
        : []
    : [];

/**
 * Helper type to compute the axis directions available for a given series type.
 * Dual-mode series (both cartesian and polar) get all four directions.
 */
type ChartSeriesTypeAxisDirections<
  SeriesType extends ChartSeriesType,
  AxisType extends 'cartesian' | 'polar' = any,
> =
  | (SeriesType extends CartesianChartSeriesType
      ? AxisType extends 'cartesian'
        ? 'x' | 'y'
        : never
      : never)
  | (SeriesType extends PolarChartSeriesType
      ? AxisType extends 'polar'
        ? 'rotation' | 'radius'
        : never
      : never);

export type ChartSeriesTypeConfig<
  SeriesType extends ChartSeriesType,
  AxisType extends 'cartesian' | 'polar' = any,
> = {
  seriesProcessor: SeriesProcessor<SeriesType>;
  /**
   * A processor to add series layout when the layout does not depend from other series.
   */
  seriesLayout?: SeriesLayoutGetter<SeriesType>;
  colorProcessor: ColorProcessor<SeriesType>;
  legendGetter: LegendGetter<SeriesType>;
  tooltipGetter: TooltipGetter<SeriesType>;
  ItemTooltipContent?: React.ComponentType<ItemTooltipContentProps<SeriesType>>;
  tooltipItemPositionGetter?: TooltipItemPositionGetter<SeriesType>;
  getSeriesWithDefaultValues: GetSeriesWithDefaultValues<SeriesType>;
  keyboardFocusHandler?: KeyboardFocusHandler<SeriesType>;
  /**
   * A function to serialize the series item identifier into a unique string.
   * @param {SeriesItemIdentifierWithType<SeriesType>} identifier The series item identifier.
   * @returns {string} A unique string representation of the identifier.
   */
  identifierSerializer: IdentifierSerializer<SeriesType>;
  /**
   * A function to clean a series item identifier, returning only the properties
   * relevant to the series type.
   * @param {Partial<SeriesItemIdentifierWithType<SeriesType>> & { type: SeriesType }} identifier The partial identifier to clean.
   * @returns {SeriesItemIdentifierWithType<SeriesType>} A cleaned identifier with only the relevant properties.
   */
  identifierCleaner: IdentifierCleaner<SeriesType>;
  getItemAtPosition?: GetItemAtPosition<SeriesType, AxisType>;
  descriptionGetter: DescriptionGetter<SeriesType>;
  isHighlightedCreator: HighlightCreator<SeriesType>;
  isFadedCreator: HighlightCreator<SeriesType>;
} & (SeriesType extends CartesianChartSeriesType
  ? AxisType extends 'cartesian'
    ? {
        xExtremumGetter: CartesianExtremumGetter<SeriesType>;
        yExtremumGetter: CartesianExtremumGetter<SeriesType>;
      }
    : {}
  : {}) &
  (SeriesType extends PolarChartSeriesType
    ? AxisType extends 'polar'
      ? {
          rotationExtremumGetter: PolarExtremumGetter<SeriesType>;
          radiusExtremumGetter: PolarExtremumGetter<SeriesType>;
        }
      : {}
    : {}) &
  (SeriesType extends CartesianChartSeriesType | PolarChartSeriesType
    ? {
        AxisTooltipContent?: React.ComponentType<AxisTooltipContentProps<SeriesType>>;
        axisTooltipGetter?: AxisTooltipGetter<
          SeriesType,
          ChartSeriesTypeAxisDirections<SeriesType, AxisType>
        >;
      }
    : {});

export type ChartSeriesConfig<
  SeriesType extends ChartSeriesType,
  AxisType extends 'cartesian' | 'polar' = any,
> = {
  [Key in SeriesType]: ChartSeriesTypeConfig<Key, AxisType>;
};
