import { DatasetType } from '../../models/seriesType/config';
import {
  AxisDefaultized,
  ScaleName,
  ChartsXAxisProps,
  ChartsYAxisProps,
  AxisId,
  AxisConfig,
} from '../../models/axis';
import { ExtremumFilter } from '../PluginProvider';

export type CartesianProviderProps = {
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: AxisConfig<ScaleName, any, ChartsXAxisProps>[];
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: AxisConfig<ScaleName, any, ChartsYAxisProps>[];
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: DatasetType;
  children: React.ReactNode;
};

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

export type ZoomData = { axisId: AxisId; start: number; end: number };

export type ZoomFilterMode = 'keep' | 'discard' | 'empty';
export type ZoomOptions = Record<AxisId, { filterMode: ZoomFilterMode }>;

export type ZoomAxisFilters = Record<AxisId, ExtremumFilter>;

export type GetZoomAxisFilters = (params: {
  currentAxisId: AxisId | undefined;
  seriesXAxisId?: AxisId;
  seriesYAxisId?: AxisId;
  isDefaultAxis: boolean;
}) => ExtremumFilter;
