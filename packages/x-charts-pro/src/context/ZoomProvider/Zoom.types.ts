import { AxisId } from '@mui/x-charts/internals';

export type ZoomProviderProps = {
  children: React.ReactNode;
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis?: AxisConfigForZoom[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis?: AxisConfigForZoom[];
} & ZoomProps;

export type ZoomState = {
  isZoomEnabled: boolean;
  isPanEnabled: boolean;
  options: Record<AxisId, DefaultizedZoomOptions>;
  zoomData: ZoomData[];
  setZoomData: (zoomData: ZoomData[] | ((zoomData: ZoomData[]) => ZoomData[])) => void;
  isInteracting: boolean;
  setIsInteracting: (isInteracting: boolean) => void;
};

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
  /**
   * The zoom data of type [[ZoomData]] which lists the zoom data related to each axis.
   */
  zoom?: ZoomData[];
  /**
   * Callback fired when the zoom has changed.
   *
   * @param {ZoomData[]} zoomData Updated zoom data.
   */
  onZoomChange?: (zoomData: ZoomData[] | ((zoomData: ZoomData[]) => ZoomData[])) => void;
};

export type DefaultizedZoomOptions = Required<ZoomOptions> & {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
};

export type AxisConfigForZoom = {
  id: AxisId;
  zoom?: ZoomOptions | boolean;
};
