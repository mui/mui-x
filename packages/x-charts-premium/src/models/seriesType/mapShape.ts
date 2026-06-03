import {
  type CommonSeriesType,
  type CommonDefaultizedProps,
  type SeriesId,
  type DatasetElementType,
} from '@mui/x-charts/internals';
import { type DefaultizedProps } from '@mui/x-internals/types';

/**
 * A single entry of a `mapShape` series.
 *
 * The `name` is used to join the entry to a feature in the chart's `geoData`
 * (matching `feature.properties.name`).
 */
export interface MapShapeValueType {
  /**
   * Identifies the GeoJSON feature this entry maps to, via `feature.properties.name`.
   */
  name: string;
  /**
   * Numeric value associated with the feature.
   */
  value?: number;
  /**
   * The value used to compute the color of the item through a color axis.
   * Falls back to `value` when no `colorValue` is provided.
   */
  colorValue?: any;
  /**
   * Label used in legends and tooltips.
   */
  label?: string;
  /**
   * Color used for the item. Fallback on the series color if not defined.
   */
  color?: string;
}

export interface MapShapeSeriesType extends Omit<
  CommonSeriesType<MapShapeValueType, 'mapShape'>,
  'valueFormatter'
> {
  type: 'mapShape';
  /**
   * The data points to render. Each entry is joined to a feature in `geoData`
   * through its `name` property.
   */
  data?: ReadonlyArray<MapShapeValueType>;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * The id of the color axis used to compute the color of the shapes.
   * It points to the id of an axis defined with the `zAxis` prop.
   */
  colorAxisId?: string;
  /**
   * A function to extract and transform the value from the `dataset` item.
   * It receives the full dataset item and should return a map shape value.
   * Can be used as an alternative to `datasetKeys`.
   * @param {DatasetElementType<unknown>} item The full dataset item.
   * @returns {MapShapeValueType} The transformed value.
   */
  valueGetter?: (item: DatasetElementType<unknown>) => MapShapeValueType;
  /**
   * The keys used to retrieve data from the dataset.
   *
   * When this prop is provided, `name` is required to match each entry with a
   * GeoJSON feature. `label`, `value`, and `colorValue` are optional.
   */
  datasetKeys?: {
    /**
     * The key used to retrieve the feature name from the dataset.
     */
    name: string;
    /**
     * The key used to retrieve the item label from the dataset.
     */
    label?: string;
    /**
     * The key used to retrieve the item numeric value from the dataset.
     */
    value?: string;
    /**
     * The key used to retrieve the color value from the dataset.
     */
    colorValue?: string;
  };
  /**
   * Formatter used to render values in tooltips or other data displays.
   * @param {MapShapeValueType} value The data entry to format.
   * @param {object} context The rendering context.
   * @param {number} context.dataIndex The index of the data point in the series.
   * @returns {string | null} The string to display, or `null` if the value should not be shown.
   */
  valueFormatter?: (value: MapShapeValueType, context: { dataIndex: number }) => string | null;
}

/**
 * Identifies a single item in a `mapShape` series.
 */
export type MapShapeItemIdentifier = {
  type: 'mapShape';
  seriesId: SeriesId;
  dataIndex: number;
};

export type DefaultizedMapShapeValueType = MapShapeValueType & {
  hidden: boolean;
};

export interface DefaultizedMapShapeSeriesType extends Omit<
  DefaultizedProps<MapShapeSeriesType, CommonDefaultizedProps | 'color'>,
  'data'
> {
  hidden: boolean;
  data: ReadonlyArray<DefaultizedMapShapeValueType>;
}
