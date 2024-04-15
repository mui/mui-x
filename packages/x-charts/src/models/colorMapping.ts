export interface ContinuousColorConfig<Value = number | Date> {
  type: 'continuous';
  /**
   * The minimal value of the color scale.
   * @default 0
   */
  min?: Value;
  /**
   * The maximal value of the color scale.
   * @default 100
   */
  max?: Value;
  /**
   * The colors to render. Can either be and array with the extrem colors, or an interpolation function.
   */
  color: [string, string] | ((t: number) => string);
}

export interface PiecewiseColorConfig<Value = number | Date> {
  type: 'piecewise';
  /**
   * The thresholds where color should change from one category to another.
   */
  thresholds: Value[];
  /**
   * The colors used for each band defined by `thresholds`.
   * Should contain N+1 colors with N the number of thresholds.
   */
  colors: string[];
}

export interface OrdinalColorConfig<Value = number | Date | string> {
  type: 'ordinal';
  /**
   * The value to map.
   * If undefined, it will be integers from 0 to the number of colors.
   */
  values?: Value[];
  /**
   * The color palette.
   */
  colors: string[];
  /**
   * The color to use when an element is not part of the values.
   */
  unknownColor?: string;
}
