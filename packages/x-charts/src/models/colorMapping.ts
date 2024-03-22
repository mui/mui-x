type ColorSliceType<V> = {
  /**
   * This slice contains values larger that this value.
   */
  lg?: V;
  /**
   * This slice contains values smaller that this value.
   */
  sm?: V;
  /**
   * This slice contains values larger or equal than this value.
   */
  lge?: V;
  /**
   * This slice contains values smaller or equal than this value.
   */
  sme?: V;
  /**
   * The color of the slice.
   */
  color: string;
};

export interface ContinuouseColorConfig<V = number | Date> {
  type: 'continuous';
  /**
   * The minimal value of the color scale.
   * @default 0
   */
  min?: V;
  /**
   * The maximal value of the color scale.
   * @default 100
   */
  max?: V;
  /**
   * The colors to render. Can either be and array with the extrem colors, or an interpolation function.
   */
  color: [string, string] | ((t: number) => string);
  /**
   * The color to use for values outside of the range.
   * Can be a single color, or an array of two colors to distinguish values bellow  min from values above max.
   */
  overflowColor?: string | [string, string];
}

export interface PiecewiseColorConfig<V = number | Date> {
  type: 'piecewise';
  /**
   * The color slices, defining slice range and color.
   */
  slices: ColorSliceType<V>[];
  /**
   * The color to use for values that does not belong to any slice.
   */
  unknownColor?: string;
}

export interface OrdinalColorConfig<V = number | Date | string> {
  type: 'ordinal';
  /**
   * The value to map.
   * If undefined, it will be integers from 0 to the number of colors.
   */
  values?: V[];
  /**
   * The color palette.
   */
  colors: string[];
  /**
   * The color to use when an element is not part of the values.
   */
  unknownColor?: string;
}
