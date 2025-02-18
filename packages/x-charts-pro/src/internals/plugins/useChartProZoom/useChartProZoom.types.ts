import {
  UseChartSeriesSignature,
  ChartPluginSignature,
  UseChartCartesianAxisSignature,
  UseChartCartesianAxisDefaultizedParameters,
  ZoomData,
} from '@mui/x-charts/internals';

export interface UseChartProZoomParameters {
  /**
   * The list of zoom data related to each axis.
   * Used to initialize the zoom in a specific configuration without controlling it.
   */
  initialZoom?: readonly ZoomData[];
  /**
   * Callback fired when the zoom has changed.
   *
   * @param {ZoomData[]} zoomData Updated zoom data.
   */
  onZoomChange?: (zoomData: ZoomData[]) => void;
  /**
   * The list of zoom data related to each axis.
   */
  zoomData?: readonly ZoomData[];
}

export type UseChartProZoomDefaultizedParameters = UseChartProZoomParameters &
  UseChartCartesianAxisDefaultizedParameters;

export interface UseChartProZoomState {
  zoom: {
    /**
     * Whether the user is currently interacting with the chart.
     * This is useful to disable animations while the user is interacting.
     */
    isInteracting: boolean;
    /**
     * Mapping of axis id to the zoom data.
     */
    zoomData: readonly ZoomData[];
    /**
     * Internal information to know if the user control the state or not.
     */
    isControlled: boolean;
  };
}

export interface UseChartProZoomPublicApi {
  /**
   * Set the zoom data state.
   * @param {ZoomData[] | ((prev: ZoomData[]) => ZoomData[])} value  The new value. Can either be the new zoom data, or an updater function.
   * @returns {void}
   */
  setZoomData: (value: ZoomData[] | ((prev: ZoomData[]) => ZoomData[])) => void;
}

export interface UseChartProZoomInstance extends UseChartProZoomPublicApi {}

export type UseChartProZoomSignature = ChartPluginSignature<{
  params: UseChartProZoomParameters;
  defaultizedParams: UseChartProZoomDefaultizedParameters;
  state: UseChartProZoomState;
  publicAPI: UseChartProZoomPublicApi;
  instance: UseChartProZoomInstance;
  dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature];
}>;
