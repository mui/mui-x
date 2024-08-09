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

/**
 * Represents the state of the ZoomProvider.
 */
export type ZoomState = {
  /**
   * Whether zooming is enabled.
   */
  isZoomEnabled: boolean;
  /**
   * Whether panning is enabled.
   */
  isPanEnabled: boolean;
  /**
   * The zoom options for each axis.
   */
  options: Record<AxisId, DefaultizedZoomOptions>;
  /**
   * The zoom data for each axis
   * @default []
   */
  zoomData: ZoomData[];
  /**
   * Set the zoom data for each axis.
   * @param {ZoomData[]} zoomData The new zoom data.
   */
  setZoomData: (zoomData: ZoomData[] | ((zoomData: ZoomData[]) => ZoomData[])) => void;
  /**
   * Whether the user is currently interacting with the chart.
   * This is useful to prevent animations from running while the user is interacting.
   */
  isInteracting: boolean;
  /**
   * Set the interaction state of the chart.
   * @param {boolean} isInteracting The new interaction state.
   */
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
  /**
   * Defines how to filter the axis data when it is outside of the zoomed range of this axis.
   *
   * - `keep`: The data outside the zoomed range is kept. And the other axes will stay the same.
   * - `discard`: The data outside the zoomed range is discarded for the other axes.
   *    The other axes will be adjusted to fit the zoomed range.
   *
   * @default 'keep'
   */
  filterMode?: 'discard' | 'keep';
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
   * The list of zoom data related to each axis.
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
