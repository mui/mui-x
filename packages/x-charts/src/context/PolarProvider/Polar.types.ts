import { DatasetType } from '../../models/seriesType/config';
import {
  AxisDefaultized,
  ScaleName,
  AxisId,
  AxisConfig,
  ChartsRotationAxisProps,
  ChartsRadiusAxisProps,
} from '../../models/axis';

export type PolarProviderProps = {
  /**
   * The configuration of the rotation-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  rotationAxis: AxisConfig<ScaleName, any, ChartsRotationAxisProps>[];
  /**
   * The configuration of the radial-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  radiusAxis: AxisConfig<'linear', any, ChartsRadiusAxisProps>[];
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: DatasetType;
  children: React.ReactNode;
};

export type DefaultizedAxisConfig<Axis> = {
  [axisId: AxisId]: AxisDefaultized<ScaleName, any, Axis>;
};

export type PolarContextState = {
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
