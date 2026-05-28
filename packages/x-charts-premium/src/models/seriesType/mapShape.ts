import type { CommonSeriesType, CommonDefaultizedProps, SeriesId } from '@mui/x-charts/internals';
import type { DefaultizedProps } from '@mui/x-internals/types';

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
