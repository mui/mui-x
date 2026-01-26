import { type HighlightScope } from '../../internals/plugins/featurePlugins/useChartHighlight/highlightConfig.types';
import type { StackOffsetType, StackOrderType } from '../stacking';
import type { ChartsLabelMarkType } from '../../ChartsLabel/ChartsLabelMark';
import { type AxisId } from '../axis';

/**
 * The unique identifier of a series.
 */
export type SeriesId = string;

export type SeriesValueFormatterContext = {
  /**
   * The index of the value in the data array.
   */
  dataIndex: number;
};

export type SeriesValueFormatter<TValue> = (
  value: TValue,
  context: SeriesValueFormatterContext,
) => string | null;

export type ColorCallbackValue<TValue> = { value: TValue; dataIndex: number };

export interface SeriesColor<TValue> {
  /**
   * Color to use when displaying the series.
   * If `colorGetter` is provided, it will be used to get the color for each data point instead.
   * Otherwise, this color will be used for all data points in the series.
   */
  color?: string;
  /**
   * A function that returns a color based on the value and/or the data index of a point.
   * The returned color is used when displaying the specific data point, e.g., a marker in a line chart.
   * When the color of the entire series is required, e.g., in legends, the `color` property is used instead.
   * @param {ColorCallbackValue<TValue>} data  An object containing data point's `dataIndex` and `value`.
   * @returns {string} The color to use for the specific data point.
   */
  colorGetter?: (data: ColorCallbackValue<TValue>) => string;
}

export interface CommonSeriesType<TValue> extends SeriesColor<TValue> {
  /**
   * The id of this series.
   */
  id?: SeriesId;
  /**
   * Formatter used to render values in tooltip or other data display.
   * @param {TValue} value The series' value to render.
   * @param {SeriesValueFormatterContext} context The rendering context of the value.
   * @returns {string | null} The string to display or null if the value should not be shown.
   */
  valueFormatter?: SeriesValueFormatter<TValue>;
  /**
   * The scope to apply when the series is highlighted.
   */
  highlightScope?: HighlightScope;
  /**
   * Defines the mark type for the series.
   *
   * There is a default mark type for each series type.
   */
  labelMarkType?: ChartsLabelMarkType;
}

export type CommonDefaultizedProps = 'id' | 'valueFormatter' | 'data';

export type CartesianSeriesType = {
  /**
   * The id of the x-axis used to render the series.
   */
  xAxisId?: AxisId;
  /**
   * The id of the y-axis used to render the series.
   */
  yAxisId?: AxisId;
};

export type StackableSeriesType = {
  /**
   * The key that identifies the stacking group.
   * Series with the same `stack` property will be stacked together.
   */
  stack?: string;
  /**
   * Defines how stacked series handle negative values.
   */
  stackOffset?: StackOffsetType;
  /**
   * The order in which series' of the same group are stacked together.
   * @default 'none'
   */
  stackOrder?: StackOrderType;
};
