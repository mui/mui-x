import { ChartsTextStyle } from '../ChartsText';
import { PieItemId } from '../models';
import { SeriesId } from '../models/seriesType/common';

interface LegendItemContextBase {
  /**
   * The color used in the legend
   */
  color: string;
  /**
   * The label displayed in the legend
   */
  label: string;
}

export interface LegendItemConfig
  extends Partial<Omit<SeriesLegendItemContext, 'type' | 'label' | 'color'>>,
    Partial<Omit<PieLegendItemContext, 'type' | 'label' | 'color' | 'itemId'>>,
    Partial<Omit<PiecewiseColorLegendItemContext, 'type' | 'label' | 'color'>>,
    LegendItemContextBase {
  /**
   * The identifier of the legend element.
   * Used for internal purpose such as `key` props
   */
  id: number | string;
  type: 'series' | 'piecewiseColor' | 'pie';
}

interface SeriesLegendItemContext extends LegendItemContextBase {
  /**
   * The type of the legend item
   * - `series` is used for series legend item
   * - `piecewiseColor` is used for piecewise color legend item
   * - `pie` is used for pie legend item
   */
  type: 'series';
  /**
   * The identifier of the series
   */
  seriesId: SeriesId;
}

interface PieLegendItemContext extends LegendItemContextBase {
  /**
   * The type of the legend item
   * - `series` is used for series legend item
   * - `piecewiseColor` is used for piecewise color legend item
   * - `pie` is used for pie legend item
   */
  type: 'pie';
  /**
   * The identifier of the series
   */
  seriesId: SeriesId;
  /**
   * The identifier of the pie item
   */
  itemId: PieItemId;
}

interface PiecewiseColorLegendItemContext extends LegendItemContextBase {
  /**
   * The type of the legend item
   * - `series` is used for series legend item
   * - `piecewiseColor` is used for piecewise color legend item
   * - `pie` is used for pie legend item
   */
  type: 'piecewiseColor';
  /**
   * The minimum value of the category
   */
  minValue: number | Date | null;
  /**
   * The maximum value of the category
   */
  maxValue: number | Date | null;
}

export type LegendItemContext =
  | SeriesLegendItemContext
  | PiecewiseColorLegendItemContext
  | PieLegendItemContext;

export interface LegendItemWithPosition extends LegendItemConfig {
  positionX: number;
  positionY: number;
  innerHeight: number;
  innerWidth: number;
  outerHeight: number;
  outerWidth: number;
  rowIndex: number;
}

export type GetItemSpaceType = (
  label: string,
  inStyle?: ChartsTextStyle,
) => {
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
};
