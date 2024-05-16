import type { HighlightScope } from '../context';
import type { BarSeriesType } from '../models';
import type { SeriesId } from '../models/seriesType/common';

export type AnimationData = {
  x: number;
  y: number;
  width: number;
  height: number;
  yOrigin: number;
  xOrigin: number;
  layout: BarSeriesType['layout'];
};

export interface CompletedBarData extends AnimationData {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  value: number | null;
  highlightScope?: Partial<HighlightScope>;
  maskId: string;
}

export interface MaskData extends AnimationData {
  id: string;
  hasNegative: boolean;
  hasPositive: boolean;
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
     * The height of the bar. Useful if you want to show the label only when the bar is big enough.
     */
    height: number;
    /**
     * The width of the bar. Useful if you want to show the label only when the bar is big enough.
     */
    width: number;
  };
};
