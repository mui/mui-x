import type {
  CommonSeriesType,
  CommonDefaultizedProps,
  SeriesId,
  DatasetElementType,
} from '@mui/x-charts/internals';
import type { DefaultizedProps } from '@mui/x-internals/types';

/**
 * A single entry of a `mapPoint` series.
 *
 * The point is positioned by its own `coordinates`, projected through the chart's `projection`.
 */
export interface MapPointValueType {
  /**
   * Optional identifier of the point. Used as the React key when provided.
   */
  id?: string | number;
  /**
   * Geographic position of the point as `[longitude, latitude]` in degrees.
   */
  coordinates: [number, number];
  /**
   * Numeric value associated with the point.
   * Used as the default magnitude for the size axis and summed when points are clustered.
   */
  value?: number;
  /**
   * The value used to compute the size of the marker through a size axis.
   * Falls back to `value` when no `sizeValue` is provided.
   */
  sizeValue?: any;
  /**
   * The value used to compute the color of the item through a color axis.
   * Falls back to `value` when no `colorValue` is provided.
   */
  colorValue?: any;
  /**
   * Label used in tooltips and rendered next to the marker.
   */
  label?: string;
  /**
   * Color used for the item. Fallback on the series color if not defined.
   */
  color?: string;
}

export interface MapPointSeriesType extends Omit<CommonSeriesType<'mapPoint'>, 'valueFormatter'> {
  type: 'mapPoint';
  /**
   * The data points to render. Each entry is positioned by its `coordinates`.
   */
  data?: ReadonlyArray<MapPointValueType>;
  /**
   * The label to display on the tooltip or the legend. It can be a string or a function.
   */
  label?: string | ((location: 'tooltip' | 'legend') => string);
  /**
   * The id of the color axis used to compute the color of the points.
   * It points to the id of an axis defined with the `zAxis` prop.
   */
  colorAxisId?: string;
  /**
   * The id of the size axis used to compute the size of the markers.
   * It points to the id of an axis defined with the `zAxis` prop.
   * When set, the marker area is mapped from each point's `sizeValue` (or `value`)
   * through the axis `sizeMap`, turning the series into a bubble map.
   */
  sizeAxisId?: string;
  /**
   * A function to extract and transform the value from the `dataset` item.
   * It receives the full dataset item and should return a map point value.
   * Can be used as an alternative to `datasetKeys`.
   * @param {DatasetElementType<unknown>} item The full dataset item.
   * @returns {MapPointValueType} The transformed value.
   */
  valueGetter?: (item: DatasetElementType<unknown>) => MapPointValueType;
  /**
   * The keys used to retrieve data from the dataset.
   *
   * When this prop is provided, `lon` and `lat` are required to position each point.
   * `label`, `value`, and `colorValue` are optional.
   */
  datasetKeys?: {
    /**
     * The key used to retrieve the longitude from the dataset.
     */
    lon: string;
    /**
     * The key used to retrieve the latitude from the dataset.
     */
    lat: string;
    /**
     * The key used to retrieve the item label from the dataset.
     */
    label?: string;
    /**
     * The key used to retrieve the item numeric value from the dataset.
     */
    value?: string;
    /**
     * The key used to retrieve the size value from the dataset.
     */
    sizeValue?: string;
    /**
     * The key used to retrieve the color value from the dataset.
     */
    colorValue?: string;
  };
  /**
   * Formatter used to render values in tooltips or other data displays.
   * @param {MapPointValueType} value The data entry to format.
   * @param {object} context The rendering context.
   * @param {number} context.dataIndex The index of the data point in the series.
   * @returns {string | null} The string to display, or `null` if the value should not be shown.
   */
  valueFormatter?: (value: MapPointValueType, context: { dataIndex: number }) => string | null;
}

/**
 * Identifies a single item in a `mapPoint` series.
 */
export type MapPointItemIdentifier = {
  type: 'mapPoint';
  seriesId: SeriesId;
  dataIndex: number;
};

export type DefaultizedMapPointValueType = MapPointValueType & {
  hidden: boolean;
};

export interface DefaultizedMapPointSeriesType extends Omit<
  DefaultizedProps<MapPointSeriesType, CommonDefaultizedProps | 'color'>,
  'data'
> {
  hidden: boolean;
  data: ReadonlyArray<DefaultizedMapPointValueType>;
}
