import { ChartsTextStyle } from '../ChartsText';

export interface LegendItemParams {
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
