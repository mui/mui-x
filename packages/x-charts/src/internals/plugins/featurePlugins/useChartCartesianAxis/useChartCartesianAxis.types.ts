import { MakeOptional } from '@mui/x-internals/types';
import { ChartPluginSignature } from '../../models';
import { ChartSeriesType, DatasetType } from '../../../../models/seriesType/config';
import {
  AxisDefaultized,
  ScaleName,
  ChartsXAxisProps,
  ChartsYAxisProps,
  AxisId,
  AxisConfig,
  ChartsAxisData,
} from '../../../../models/axis';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import { ZoomData, ZoomOptions } from './zoom.types';
import { UseChartInteractionSignature } from '../useChartInteraction';

export type DefaultizedAxisConfig<AxisProps> = {
  [axisId: AxisId]: AxisDefaultized<ScaleName, any, AxisProps>;
};

export type CartesianContextState = {
  /**
   * Mapping from x-axis key to scaling configuration.
   */
  xAxis: DefaultizedAxisConfig<ChartsXAxisProps>;
  /**
   * Mapping from y-axis key to scaling configuration.
   */
  yAxis: DefaultizedAxisConfig<ChartsYAxisProps>;
  /**
   * The x-axes IDs sorted by order they got provided.
   */
  xAxisIds: AxisId[];
  /**
   * The y-axes IDs sorted by order they got provided.
   */
  yAxisIds: AxisId[];
};

export interface UseChartCartesianAxisParameters {
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis?: readonly MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis?: readonly MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>[];
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

export type UseChartCartesianAxisDefaultizedParameters = UseChartCartesianAxisParameters & {
  defaultizedXAxis: AxisConfig<ScaleName, any, ChartsXAxisProps>[];
  defaultizedYAxis: AxisConfig<ScaleName, any, ChartsYAxisProps>[];
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

export interface UseChartCartesianAxisInstance {}

export type UseChartCartesianAxisSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartCartesianAxisParameters;
    defaultizedParams: UseChartCartesianAxisDefaultizedParameters;
    state: UseChartCartesianAxisState;
    // instance: UseChartCartesianAxisInstance;
    dependencies: [UseChartSeriesSignature<SeriesType>];
    optionalDependencies: [UseChartInteractionSignature];
  }>;
