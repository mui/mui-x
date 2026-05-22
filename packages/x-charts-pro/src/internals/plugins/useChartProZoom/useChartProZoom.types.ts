import {
  type UseChartSeriesSignature,
  type ChartPluginSignature,
  type UseChartCartesianAxisSignature,
  type UseChartCartesianAxisDefaultizedParameters,
  type ZoomData,
  type AxisId,
  type UseChartBrushSignature,
} from '@mui/x-charts/internals';
import {
  type ZoomInteractionConfig,
  type DefaultizedZoomInteractionConfig,
} from './ZoomInteractionConfig.types';
import { type RangeButtonValue } from '../../../ChartsToolbarPro/rangeButtonValueToZoom';

/**
 * Initializes the zoom of an axis with a range value instead of zoom percentages.
 */
export interface InitialZoomRange {
  /**
   * The id of the axis to apply the zoom to.
   */
  axisId: AxisId;
  /**
   * The range to zoom to. Accepts the same values as a range button:
   *
   * - `{ unit, step }` — A calendar interval from the end of the data.
   * - `[start, end]` — An absolute date range, or a range between two ordinal axis values.
   * - `(params) => { start, end }` — A function returning zoom percentages (0-100).
   * - `null` — Shows all data.
   */
  value: RangeButtonValue;
}

/**
 * An entry of the `initialZoom` prop. Either explicit zoom percentages ({@link ZoomData})
 * or a range value resolved against the axis ({@link InitialZoomRange}).
 */
export type InitialZoom = ZoomData | InitialZoomRange;

export interface UseChartProZoomParameters {
  /**
   * The list of zoom data related to each axis.
   * Used to initialize the zoom in a specific configuration without controlling it.
   *
   * Each entry is either explicit zoom percentages (`{ axisId, start, end }`) or a
   * range value (`{ axisId, value }`) resolved against the axis domain.
   */
  initialZoom?: readonly InitialZoom[];
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
  /**
   * Configuration for zoom interactions.
   */
  zoomInteractionConfig?: ZoomInteractionConfig;
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
    /**
     * Configuration for zoom interactions.
     */
    zoomInteractionConfig: DefaultizedZoomInteractionConfig;
  };
}

export interface UseChartProZoomPublicApi {
  /**
   * Set the zoom data state.
   * @param {ZoomData[] | ((prev: ZoomData[]) => ZoomData[])} value  The new value. Can either be the new zoom data, or an updater function.
   * @returns {void}
   */
  setZoomData: (value: ZoomData[] | ((prev: ZoomData[]) => ZoomData[])) => void;
  /**
   * Set the zoom data for an axis.
   * @param {AxisId} axisId The id of the axis to set the zoom data for.
   * @param {ZoomData | ((prev: ZoomData) => ZoomData)} value  The new value. Can either be the new zoom data, or an updater function.
   * @returns {void}
   */
  setAxisZoomData: (axisId: AxisId, value: ZoomData | ((prev: ZoomData) => ZoomData)) => void;
}

export interface UseChartProZoomInstance extends UseChartProZoomPublicApi {
  /**
   * Translate the zoom range (i.e., both start and end) for a specific axis.
   * @param {AxisId} axisId The id of the axis to move the zoom range for.
   * @param {number} by The amount to move the zoom range by. Ranges from 0 to 100.
   */
  moveZoomRange: (axisId: AxisId, by: number) => void;
  /**
   * Zoom in the chart.
   */
  zoomIn: () => void;
  /**
   * Zoom out the chart.
   */
  zoomOut: () => void;
}

export type UseChartProZoomSignature = ChartPluginSignature<{
  params: UseChartProZoomParameters;
  defaultizedParams: UseChartProZoomDefaultizedParameters;
  state: UseChartProZoomState;
  publicAPI: UseChartProZoomPublicApi;
  instance: UseChartProZoomInstance;
  dependencies: [UseChartSeriesSignature, UseChartCartesianAxisSignature, UseChartBrushSignature];
}>;
