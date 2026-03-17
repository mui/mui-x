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

export type ChartSeriesTypeRequiredPlugins<SeriesType extends ChartSeriesType> =
  ChartsSeriesConfig[SeriesType] extends { axisType: 'cartesian' }
    ? [UseChartCartesianAxisSignature]
    : ChartsSeriesConfig[SeriesType] extends { axisType: 'polar' }
      ? [UseChartPolarAxisSignature]
      : [];

export type ChartSeriesTypeConfig<SeriesType extends ChartSeriesType> = {
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
  getItemAtPosition?: GetItemAtPosition<SeriesType>;
  descriptionGetter?: DescriptionGetter<SeriesType>;
  isHighlightedCreator: HighlightCreator<SeriesType>;
  isFadedCreator: HighlightCreator<SeriesType>;
} & (SeriesType extends CartesianChartSeriesType
  ? {
      xExtremumGetter: CartesianExtremumGetter<SeriesType>;
      yExtremumGetter: CartesianExtremumGetter<SeriesType>;
      axisTooltipGetter?: AxisTooltipGetter<SeriesType, 'x' | 'y'>;
      AxisTooltipContent?: React.ComponentType<AxisTooltipContentProps<SeriesType>>;
    }
  : {}) &
  (SeriesType extends PolarChartSeriesType
    ? {
        rotationExtremumGetter: PolarExtremumGetter<SeriesType>;
        radiusExtremumGetter: PolarExtremumGetter<SeriesType>;
        axisTooltipGetter?: AxisTooltipGetter<SeriesType, 'rotation' | 'radius'>;
        AxisTooltipContent?: React.ComponentType<AxisTooltipContentProps<SeriesType>>;
      }
    : {});

export type ChartSeriesConfig<SeriesType extends ChartSeriesType> = {
  [Key in SeriesType]: ChartSeriesTypeConfig<Key>;
};
