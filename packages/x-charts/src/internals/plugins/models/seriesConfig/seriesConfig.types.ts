import type { SeriesProcessor } from './seriesProcessor.types';
import type {
  CartesianChartSeriesType,
  ChartSeriesType,
  PolarChartSeriesType,
} from '../../../../models/seriesType/config';
import type { ColorProcessor } from './colorProcessor.types';
import type { CartesianExtremumGetter } from './cartesianExtremumGetter.types';
import type { LegendGetter } from './legendGetter.types';
import type { AxisTooltipGetter, TooltipGetter } from './tooltipGetter.types';
import { type PolarExtremumGetter } from './polarExtremumGetter.types';
import { type GetSeriesWithDefaultValues } from './getSeriesWithDefaultValues.types';
import { type TooltipItemPositionGetter } from './tooltipItemPositionGetter.types';
import { type SeriesLayoutGetter } from './seriesLayout.types';
import { type KeyboardFocusHandler } from '../../featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import { type IdentifierSerializer } from './identifierSerializer.types';

export type ChartSeriesTypeConfig<TSeriesType extends ChartSeriesType> = {
  seriesProcessor: SeriesProcessor<TSeriesType>;
  /**
   * A processor to add series layout when the layout does not depend from other series.
   */
  seriesLayout?: SeriesLayoutGetter<TSeriesType>;
  colorProcessor: ColorProcessor<TSeriesType>;
  legendGetter: LegendGetter<TSeriesType>;
  tooltipGetter: TooltipGetter<TSeriesType>;
  tooltipItemPositionGetter?: TooltipItemPositionGetter<TSeriesType>;
  getSeriesWithDefaultValues: GetSeriesWithDefaultValues<TSeriesType>;
  keyboardFocusHandler?: KeyboardFocusHandler<TSeriesType>;
  /**
   * A function to serialize the series item identifier into a unique string.
   * @param {ChartsSeriesConfig[TSeriesType]['itemIdentifier']} identifier The series item identifier.
   * @returns {string} A unique string representation of the identifier.
   */
  identifierSerializer: IdentifierSerializer<TSeriesType>;
} & (TSeriesType extends CartesianChartSeriesType
  ? {
      xExtremumGetter: CartesianExtremumGetter<TSeriesType>;
      yExtremumGetter: CartesianExtremumGetter<TSeriesType>;
      axisTooltipGetter?: AxisTooltipGetter<TSeriesType, 'x' | 'y'>;
    }
  : {}) &
  (TSeriesType extends PolarChartSeriesType
    ? {
        rotationExtremumGetter: PolarExtremumGetter<TSeriesType>;
        radiusExtremumGetter: PolarExtremumGetter<TSeriesType>;
        axisTooltipGetter?: AxisTooltipGetter<TSeriesType, 'rotation' | 'radius'>;
      }
    : {});

export type ChartSeriesConfig<TSeriesType extends ChartSeriesType> = {
  [Key in TSeriesType]: ChartSeriesTypeConfig<Key>;
};
