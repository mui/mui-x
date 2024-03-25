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
}

export interface PiecewiseColorConfig<V = number | Date> {
  type: 'piecewise';
  /**
   * The thresholds where color should change from one category to another.
   */
  thresholds: V[];
  /**
   * The colors used for each band defined by `thresholds`.
   * Should contain N+1 colors with N the number of thresholds.
   */
  colors: string[];
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
