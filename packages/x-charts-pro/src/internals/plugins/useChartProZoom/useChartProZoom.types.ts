import {
  AxisId,
  UseChartSeriesSignature,
  ChartPluginSignature,
  DefaultizedZoomOption,
  UseChartCartesianAxisSignature,
  UseChartCartesianAxisDefaultizedParameters,
  ZoomData,
} from '@mui/x-charts/internals';

export interface UseChartProZoomParameters {
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

export type UseChartProZoomDefaultizedParameters = UseChartProZoomParameters &
  UseChartCartesianAxisDefaultizedParameters & {
    /**
     * The zoom options for each axis.
     */
    options: Record<AxisId, DefaultizedZoomOption>;
  };

export interface UseChartProZoomState {
  zoom: {
    /**
     * The zoom options for each axis.
     */
    options: Record<AxisId, DefaultizedZoomOption>;
    /**
     * Whether the user is currently interacting with the chart.
     * This is useful to prevent animations from running while the user is interacting.
     */
    isInteracting: boolean;
    /**
     * Mapping of axis id to the zoom data.
     */
    zoomData: ZoomData[];
  };
}

export interface UseChartProZoomInstance {}

export type UseChartProZoomSignature = ChartPluginSignature<{
  params: UseChartProZoomParameters;
  defaultizedParams: UseChartProZoomDefaultizedParameters;
  state: UseChartProZoomState;
  instance: UseChartProZoomInstance;
  modelNames: 'zoom';
  dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature];
}>;
