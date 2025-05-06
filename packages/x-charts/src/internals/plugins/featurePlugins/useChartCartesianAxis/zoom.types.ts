// This file is here only to fix typing. The full typing of zoom states is defined in the pro library.
import { AxisId } from '../../../../models/axis';
import type { ExtremumFilter } from './useChartCartesianAxis.types';

export type ZoomData = {
  /**
   * The id of the zoomed axis.
   */
  axisId: AxisId;
  /**
   * The starting percentage of the zoom range. In the range of 0 to 100.
   */
  start: number;
  /**
   * The ending percentage of the zoom range. In the range of 0 to 100.
   */
  end: number;
};

export type ZoomFilterMode = 'keep' | 'discard';

export interface ZoomOptions {
  /**
   * The starting percentage of the zoom range. In the range of 0 to 100.
   *
   * @default 0
   */
  minStart?: number;
  /**
   * The ending percentage of the zoom range. In the range of 0 to 100.
   *
   * @default 100
   */
  maxEnd?: number;
  /**
   * The step size of the zooming function. Defines the granularity of the zoom.
   *
   * @default 5
   */
  step?: number;
  /**
   * Restricts the minimum span size in the range of 0 to 100.
   *
   * If the span size is smaller than the minSpan, the span will be resized to the minSpan.
   *
   * @default 10
   */
  minSpan?: number;
  /**
   * Restricts the maximum span size in the range of 0 to 100.
   *
   * If the span size is larger than the maxSpan, the span will be resized to the maxSpan.
   *
   * @default 100
   */
  maxSpan?: number;
  /**
   * Set to `false` to disable panning. Useful when you want to pan programmatically,
   * or to show only a specific section of the chart.
   *
   * @default true
   */
  panning?: boolean;
  /**
   * Defines how to filter the axis data when it is outside of the zoomed range of this axis.
   *
   * - `keep`: The data outside the zoomed range is kept. And the other axes will stay the same.
   * - `discard`: The data outside the zoomed range is discarded for the other axes.
   *    The other axes will be adjusted to fit the zoomed range.
   *
   * @default 'keep'
   */
  filterMode?: ZoomFilterMode;
  /**
   * Configures the zoom slider. The slider is an element that shows the zoomed range and allows its manipulation.
   */
  slider?: ZoomSliderOptions;
}

export interface ZoomSliderOptions {
  /**
   * If `true`, the slider will be shown.
   */
  enabled?: boolean;
  /**
   * The size of the slider.
   * This is the height of the slider for the x-axis and the width of the slider for the y-axis.
   *
   * @default 30
   */
  size?: number;
}

export type ZoomAxisFilters = Record<AxisId, ExtremumFilter>;

export type GetZoomAxisFilters = (params: {
  currentAxisId: AxisId | undefined;
  seriesXAxisId?: AxisId;
  seriesYAxisId?: AxisId;
  isDefaultAxis: boolean;
}) => ExtremumFilter;
