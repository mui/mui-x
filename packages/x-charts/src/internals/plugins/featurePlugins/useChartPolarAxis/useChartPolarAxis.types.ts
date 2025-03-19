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
import { UseChartInteractionSignature } from '../useChartInteraction';

export interface UseChartPolarAxisInstance {
  /**
   * Transform (rotation, radius) to the SVG (x, y).
   * @param {number} radius The radius.
   * @param {number} rotation The rotation angle in radian.
   * @returns {[number, number]} [x, y] the SVG coordinate.
   */
  polar2svg: (radius: number, rotation: number) => [number, number];
  /**
   * Transform the SVG (x, y) to the (rotation, radius) coordinates.
   * @param {number} x The SVG x coordinate.
   * @param {number} y The SVG y coordinate.
   * @returns {[number, number]} [radius, rotation] the polar coordinate. Warning, the radius is a the power 2
   */
  svg2polar: (x: number, y: number) => [number, number];
  /**
   * Only compute the rotation from SVG coordinates.
   * @param {number} x The SVG x coordinate.
   * @param {number} y The SVG y coordinate.
   * @returns {number} rotation The rotation angle in radian.
   */
  svg2rotation: (x: number, y: number) => number;
}

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
   * The rotation-axes IDs sorted by order they were provided.
   */
  rotationAxisIds: AxisId[];
  /**
   * The radius-axes IDs sorted by order they were provided.
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
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener?: boolean;
}

export type UseChartPolarAxisDefaultizedParameters = UseChartPolarAxisParameters & {};

export interface UseChartPolarAxisState {
  polarAxis: {
    rotation: AxisConfig<ScaleName, any, ChartsRotationAxisProps>[];
    radius: AxisConfig<'linear', any, ChartsRadiusAxisProps>[];
  };
}

export type UseChartPolarAxisSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartPolarAxisParameters;
    defaultizedParams: UseChartPolarAxisDefaultizedParameters;
    state: UseChartPolarAxisState;
    instance: UseChartPolarAxisInstance;
    dependencies: [UseChartInteractionSignature, UseChartSeriesSignature<SeriesType>];
  }>;
