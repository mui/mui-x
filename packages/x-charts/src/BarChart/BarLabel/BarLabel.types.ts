import type { SeriesId } from '../../models/seriesType/common';
import type { BarClasses } from '../barClasses';
import type { BarValueType } from '../../models';

export interface BarLabelOwnerState {
  /**
   * The id of the series the element belongs to.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
  /**
   * The color of the element.
   */
  color: string;
  /**
   * If `true`, the element is faded.
   */
  isFaded: boolean;
  /**
   * If `true`, the element is highlighted.
   */
  isHighlighted: boolean;
  /**
   * If `true`, animations are skipped.
   */
  skipAnimation: boolean;
  /**
   * The orientation of the bar.
   */
  layout: 'vertical' | 'horizontal';
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<BarClasses>;
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
  value: BarValueType | null;
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
