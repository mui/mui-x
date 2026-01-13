import { type DefaultizedProps } from '@mui/x-internals/types';
import type { StackOffsetType } from '../stacking';
import {
  type CartesianSeriesType,
  type CommonSeriesType,
  type CommonDefaultizedProps,
  type StackableSeriesType,
  type SeriesId,
} from './common';
import { type BarItem, type BarLabelContext } from '../../BarChart';

export type BarValueType = number;

export interface BarSeriesType
  extends CommonSeriesType<BarValueType | null>, CartesianSeriesType, StackableSeriesType {
  type: 'bar';
  /**
   * Data associated to each bar.
   */
  data?: ReadonlyArray<BarValueType | null>;
  /**
   * The key used to retrieve data from the dataset.
   */
  dataKey?: string;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * Layout of the bars. All bar should have the same layout.
   * @default 'vertical'
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * Defines how stacked series handle negative values.
   * @default 'diverging'
   */
  stackOffset?: StackOffsetType;
  /**
   * If provided, the value will be used as the minimum size of the bar in pixels.
   * This is useful to avoid bars with a size of 0.
   *
   * The property is ignored if the series value is `null` or `0`.
   * It also doesn't work with stacked series.
   *
   * @default 0px
   */
  minBarSize?: number;
  /**
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the current value.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel?: 'value' | ((item: BarItem, context: BarLabelContext) => string | null | undefined);
  /**
   * The placement of the bar label. It accepts the following values:
   * - 'center': the label is centered on the bar
   * - 'outside': the label is placed after the end of the bar, from the point of the view of the origin. For a vertical positive bar, the label is above its top edge; for a horizontal negative bar, the label is placed to the left of its leftmost limit.
   * @default 'center'
   */
  barLabelPlacement?: 'center' | 'outside';
}

/**
 * An object that allows to identify a single bar.
 * Used for item interaction
 */
export type BarItemIdentifier = {
  type: 'bar';
  seriesId: SeriesId;
  dataIndex: number;
};

export interface DefaultizedBarSeriesType extends DefaultizedProps<
  BarSeriesType,
  CommonDefaultizedProps | 'color' | 'layout' | 'minBarSize'
> {
  hidden: boolean;
}
