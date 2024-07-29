import { SeriesId } from '../../models/seriesType/common';
import type { BarLabelClasses } from './barLabelClasses';

export interface BarLabelOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<BarLabelClasses>;
}

export type BarItem = {
  /**
   * The series id of the bar.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
  /**
   * The value of the data point.
   */
  value: number | null;
};

export type BarLabelContext = {
  bar: {
    /**
     * The height of the bar.
     * It could be used to control the label based on the bar size.
     */
    height: number;
    /**
     * The width of the bar.
     * It could be used to control the label based on the bar size.
     */
    width: number;
  };
};

export type BarLabelFunction = (
  item: BarItem,
  context: BarLabelContext,
) => string | null | undefined;
