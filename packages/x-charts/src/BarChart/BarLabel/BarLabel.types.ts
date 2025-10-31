import { SeriesId } from '../../models/seriesType/common';
import type { BarLabelClasses } from './barLabelClasses';
import { BarValueType } from '../../models';
import { BarRangeValueType } from '../../models/seriesType/barRange';

export interface BarLabelOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  skipAnimation: boolean;
  layout: 'vertical' | 'horizontal';
  classes?: Partial<BarLabelClasses>;
}

export type BarItem<V extends BarValueType | BarRangeValueType | null = BarValueType | null> = {
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
  value: V;
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

export type BarLabelFunction<V extends BarValueType | BarRangeValueType = BarValueType> = (
  item: BarItem<V>,
  context: BarLabelContext,
) => string | null | undefined;
