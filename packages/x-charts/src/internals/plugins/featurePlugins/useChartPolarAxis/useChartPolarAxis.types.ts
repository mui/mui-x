import { ChartPluginSignature } from '../../models';
import { ChartSeriesType, DatasetType } from '../../../../models/seriesType/config';
import {
  ScaleName,
  AxisId,
  AxisConfig,
  ChartsRotationAxisProps,
  ChartsRadiusAxisProps,
} from '../../../../models/axis';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import { DefaultizedAxisConfig } from '../useChartCartesianAxis';

export type PolarAxisState = {
  /**
   * Mapping from rotation-axis key to scaling configuration.
   */
  rotationAxis: DefaultizedAxisConfig<ChartsRotationAxisProps>;
  /**
   * Mapping from radius-axis key to scaling configuration.
   */
  radiusAxis: DefaultizedAxisConfig<ChartsRadiusAxisProps>;
  /**
   * The rotation-axes IDs sorted by order they got provided.
   */
  rotationAxisIds: AxisId[];
  /**
   * The radius-axes IDs sorted by order they got provided.
   */
  radiusAxisIds: AxisId[];
};

export interface UseChartPolarAxisParameters {
  /**
   * The configuration of the rotation-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  rotationAxis?: AxisConfig<ScaleName, any, ChartsRotationAxisProps>[];
  /**
   * The configuration of the radial-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  radiusAxis?: AxisConfig<'linear', any, ChartsRadiusAxisProps>[];
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: Readonly<DatasetType>;
}

export type UseChartPolarAxisDefaultizedParameters = UseChartPolarAxisParameters & {};

export interface UseChartPolarAxisState {
  polarAxis: {
    rotation: AxisConfig<ScaleName, any, ChartsRotationAxisProps>[];
    radius: AxisConfig<'linear', any, ChartsRadiusAxisProps>[];
  };
}

export interface UseChartPolarAxisInstance {}

export type UseChartPolarAxisSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartPolarAxisParameters;
    defaultizedParams: UseChartPolarAxisDefaultizedParameters;
    state: UseChartPolarAxisState;
    // instance: UseChartPolarAxisInstance;
    dependencies: [UseChartSeriesSignature<SeriesType>];
  }>;
