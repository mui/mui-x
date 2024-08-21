import { ChartsTextStyle } from '../ChartsText';
import { SeriesId } from '../models/seriesType/common';

export interface LegendItem {
  /**
   * The color used in the legend
   */
  color: string;
  /**
   * The label displayed in the legend
   */
  label: string;
  /**
   * The identifier of the legend element.
   * Used for internal purpose such as `key` props
   */
  id: number | string;
}

interface SeriesLegendItem extends Omit<LegendItem, 'id'> {
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
}
interface PiecewiseColorLegendItem extends Omit<LegendItem, 'id'> {
  /**
   * The type of the legend item
   * - `series` is used for series legend item
   * - `piecewiseColor` is used for piecewise color legend item
   */
  type: 'piecewiseColor';
  /**
   * The identifier of the color map
   */
  colorMapId: string;
  /**
   * The index of the category
   */
  categoryIndex: number;
  /**
   * The minimum value of the category
   */
  minValue: number;
  /**
   * The maximum value of the category
   */
  maxValue: number;
}

export type LegendItemContext = SeriesLegendItem | PiecewiseColorLegendItem;

// export type LegendItemParams = LegendItem

export interface LegendItemWithPosition extends LegendItem {
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
