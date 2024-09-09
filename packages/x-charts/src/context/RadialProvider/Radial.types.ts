import { DatasetType } from '../../models/seriesType/config';
import { AxisDefaultized, ScaleName, ChartsAxisProps, AxisId, AxisConfig } from '../../models/axis';

export type RadialProviderProps = {
  /**
   * The configuration of the rotation-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  rotationAxis: AxisConfig<ScaleName, any, ChartsAxisProps>[];
  /**
   * The configuration of the radial-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  radiusAxis: AxisConfig<'linear', any, ChartsAxisProps>[];
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: DatasetType;
  children: React.ReactNode;
};

export type DefaultizedAxisConfig = {
  [axisId: AxisId]: AxisDefaultized<ScaleName, any, ChartsAxisProps>;
};

export type RadialContextState = {
  /**
   * Mapping from rotation-axis key to scaling configuration.
   */
  rotationAxis: DefaultizedAxisConfig;
  /**
   * Mapping from radial-axis key to scaling configuration.
   */
  radiusAxis: DefaultizedAxisConfig;
  /**
   * The rotation-axes IDs sorted by order they got provided.
   */
  rotationAxisIds: AxisId[];
  /**
   * The radial-axes IDs sorted by order they got provided.
   */
  radiusAxisIds: AxisId[];
};
