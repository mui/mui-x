import { AxisId } from '@mui/x-charts/internals';

export type ZoomOptions = {
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
};

export type ZoomData = {
  /**
   * The starting percentage of the zoom range. In the range of 0 to 100.
   *
   * @default 0
   */
  start: number;
  /**
   * The ending percentage of the zoom range. In the range of 0 to 100.
   *
   * @default 100
   */
  end: number;
  /**
   * The axis id that the zoom data belongs to.
   */
  axisId: AxisId;
};

export type ZoomProps = {
  zoom?: ZoomData[];
  onZoomChange?: (zoom: ZoomData[]) => void;
};

export type DefaultizedZoomOptions = Required<ZoomOptions> & {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
};

export type AxisConfigForZoom = {
  id: AxisId;
  zoom?: ZoomOptions | boolean;
};
