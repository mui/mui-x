import { MakeOptional } from '@mui/x-internals/types';
import {
  AxisDefaultized,
  ScaleName,
  ChartsXAxisProps,
  ChartsYAxisProps,
  AxisId,
  AxisConfig,
  UseChartSeriesSignature,
  DatasetType,
  ChartPluginSignature,
} from '@mui/x-charts/internals';

export type DefaultizedAxisConfig<AxisProps> = {
  [axisId: AxisId]: AxisDefaultized<ScaleName, any, AxisProps>;
};

export interface UseChartProCartesianAxisParameters {
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>[];
  dataset?: DatasetType;
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
}

export type UseChartProCartesianAxisDefaultizedParameters = UseChartProCartesianAxisParameters & {};

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

export type DefaultizedZoomOptions = Required<ZoomOptions> & {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
};

export interface UseChartProCartesianAxisState {
  zoom: {
    /**
     * The zoom options for each axis.
     */
    options: Record<AxisId, DefaultizedZoomOptions>;
    /**
     * Whether the user is currently interacting with the chart.
     * This is useful to prevent animations from running while the user is interacting.
     */
    isInteracting: boolean;
    /**
     * Mapping of axis id to the zoom data.
     */
    zoomMap: Map<AxisId, ZoomData>;
  };
  cartesianAxis: {
    x: DefaultizedAxisConfig<ChartsXAxisProps>;
    y: DefaultizedAxisConfig<ChartsYAxisProps>;
  };
}

export type ExtremumFilter = (
  value: { x: number | Date | string | null; y: number | Date | string | null },
  dataIndex: number,
) => boolean;

export interface UseChartProCartesianAxisInstance {}

export type UseChartProCartesianAxisSignature = ChartPluginSignature<{
  params: UseChartProCartesianAxisParameters;
  defaultizedParams: UseChartProCartesianAxisDefaultizedParameters;
  state: UseChartProCartesianAxisState;
  // instance: UseChartProCartesianAxisInstance;
  modelNames: 'zoom';
  dependencies: [UseChartSeriesSignature];
}>;

export type ZoomData = { axisId: AxisId; start: number; end: number };

export type ZoomFilterMode = 'keep' | 'discard' | 'empty';

export type ZoomAxisFilters = Record<AxisId, ExtremumFilter>;

export type GetZoomAxisFilters = (params: {
  currentAxisId: AxisId | undefined;
  seriesXAxisId?: AxisId;
  seriesYAxisId?: AxisId;
  isDefaultAxis: boolean;
}) => ExtremumFilter;
