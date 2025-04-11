import type { ChartPluginSignature } from '../../models';
import type { ChartSeriesType, DatasetType } from '../../../../models/seriesType/config';
import type {
  AxisDefaultized,
  ScaleName,
  ChartsXAxisProps,
  ChartsYAxisProps,
  AxisId,
  AxisConfig,
  ChartsAxisData,
  YAxis,
  XAxis,
} from '../../../../models/axis';
import type { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import type { ZoomData, ZoomOptions } from './zoom.types';
import type { UseChartInteractionSignature } from '../useChartInteraction';
import type { ChartsAxisProps } from '../../../../ChartsAxis';

export type DefaultizedAxisConfig<AxisProps extends ChartsAxisProps> = {
  [axisId: AxisId]: AxisDefaultized<ScaleName, any, AxisProps>;
};

export interface UseChartCartesianAxisParameters<S extends ScaleName = ScaleName> {
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis?: ReadonlyArray<XAxis<S>>;
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis?: ReadonlyArray<YAxis<S>>;
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: Readonly<DatasetType>;
  /**
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | AxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick?: (event: MouseEvent, data: null | ChartsAxisData) => void;
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener?: boolean;
}

export type UseChartCartesianAxisDefaultizedParameters<S extends ScaleName = ScaleName> =
  UseChartCartesianAxisParameters<S> & {
    defaultizedXAxis: AxisConfig<S, any, ChartsXAxisProps>[];
    defaultizedYAxis: AxisConfig<S, any, ChartsYAxisProps>[];
  };

export interface DefaultizedZoomOptions extends Required<ZoomOptions> {
  axisId: AxisId;
  axisDirection: 'x' | 'y';
}

export interface UseChartCartesianAxisState {
  /**
   * @ignore - state populated by the useChartProZoomPlugin
   */
  zoom?: {
    isInteracting: boolean;
    zoomData: readonly ZoomData[];
  };
  cartesianAxis: {
    x: AxisConfig<ScaleName, any, ChartsXAxisProps>[];
    y: AxisConfig<ScaleName, any, ChartsYAxisProps>[];
  };
}

export type ExtremumFilter = (
  value: { x: number | Date | string | null; y: number | Date | string | null },
  dataIndex: number,
) => boolean;

export type UseChartCartesianAxisSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartCartesianAxisParameters;
    defaultizedParams: UseChartCartesianAxisDefaultizedParameters;
    state: UseChartCartesianAxisState;
    dependencies: [UseChartSeriesSignature<SeriesType>];
    optionalDependencies: [UseChartInteractionSignature];
  }>;
