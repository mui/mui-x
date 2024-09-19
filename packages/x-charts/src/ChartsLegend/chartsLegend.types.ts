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

export interface LegendItemParams
  extends Partial<Omit<SeriesLegendItemContext, 'type' | keyof LegendItemContextBase>>,
    Partial<Omit<PiecewiseColorLegendItemContext, 'type' | keyof LegendItemContextBase>>,
    LegendItemContextBase {
  /**
   * The identifier of the legend element.
   * Used for internal purpose such as `key` props
   */
  id: number | string;
}

export interface SeriesLegendItemContext extends LegendItemContextBase {
  /**
   * The type of the legend item
   * - `series` is used for series legend item
   * - `piecewiseColor` is used for piecewise color legend item
   */
  type: 'series';
  /**
   * The identifier of the series
   */
  seriesId: SeriesId;
  /**
   * The identifier of the pie item
   */
  itemId?: PieItemId;
}

export interface PiecewiseColorLegendItemContext extends LegendItemContextBase {
  /**
   * The type of the legend item
   * - `series` is used for series legend item
   * - `piecewiseColor` is used for piecewise color legend item
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

export type LegendItemContext = SeriesLegendItemContext | PiecewiseColorLegendItemContext;

export interface LegendItemWithPosition extends LegendItemParams {
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
