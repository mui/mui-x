import { HighlightScope } from '../../internals/plugins/featurePlugins/useChartHighlight/highlightConfig.types';
import type { StackOffsetType, StackOrderType } from '../stacking';
import type { ChartsLabelMarkType } from '../../ChartsLabel/ChartsLabelMark';
import { AxisId } from '../axis';
import type { ChartsEnabledFeature } from '../../typeAugmentation';

export type SeriesId = number | string;

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

// /**
//  * Color to use when displaying the series.
//  * It can be a string representing a color or a function that returns a color based on the data index.
//  * The data index can be undefined when the color is needed for the entire series (e.g., in legends, lines, areas).
//  */
export type SeriesColorPropValue<TValue> = { value: TValue; dataIndex: number };
export type SeriesColorProp<TValue> =
  | string
  | ((data: SeriesColorPropValue<TValue> | null) => string);


export interface SeriesColor<TValue> {
  /**
   * Color to use when displaying the series.
   */
  color?: (ChartsEnabledFeature extends { colorCallback: true } ? string | SeriesColorProp<TValue> : string);
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
