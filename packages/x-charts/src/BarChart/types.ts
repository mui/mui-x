import type { BarSeriesType } from '../models';
import type { SeriesId } from '../models/seriesType/common';

export type AnimationData = {
  /**
   * The position of the element in the x-axis.
   */
  x: number;
  /**
   * The position of the element in the y-axis.
   */
  y: number;
  /**
   * The width of the element.
   */
  width: number;
  /**
   * The height of the element.
   */
  height: number;
};

export interface ProcessedBarSeriesData {
  /**
   * The id of the series the element belongs to.
   */
  seriesId: SeriesId;
  data: ProcessedBarData[];
  barLabel?: BarSeriesType['barLabel'];
  barLabelPlacement?: BarSeriesType['barLabelPlacement'];
  /**
   * The orientation of the bar.
   */
  layout: 'vertical' | 'horizontal';
  /**
   * The position in the x-axis of the stack this bar belongs to.
   */
  xOrigin: number;
  /**
   * The position in the y-axis of the stack this bar belongs to.
   */
  yOrigin: number;
}

export type BorderRadiusSide = 'top' | 'bottom' | 'left' | 'right';

export interface ProcessedBarData extends AnimationData {
  /**
   * The id of the series the element belongs to.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
  color: string;
  value: number | null;
  maskId: string;
  /**
   * If `true`, the element is hidden.
   */
  hidden: boolean;
  borderRadiusSide?: BorderRadiusSide;
}

export interface MaskData extends AnimationData {
  id: string;
  hasNegative: boolean;
  hasPositive: boolean;
  /**
   * The position in the x-axis of the stack this bar belongs to.
   */
  xOrigin: number;
  /**
   * The position in the y-axis of the stack this bar belongs to.
   */
  yOrigin: number;
  /**
   * The orientation of the bar.
   */
  layout: 'horizontal' | 'vertical';
}
