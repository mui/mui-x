export interface ContinuousSizeConfig<Value = number | Date> {
  type: 'continuous';
  /**
   * The minimal value of the size scale.
   * @default 0
   */
  min?: Value;
  /**
   * The maximal value of the size scale.
   * @default 100
   */
  max?: Value;
  /**
   * The sizes to render. It can be an array with the extremum sizes, or an interpolation function.
   */
  size: readonly [number, number] | ((t: number) => number);
}

export interface PiecewiseSizeConfig<Value = number | Date> {
  type: 'piecewise';
  /**
   * The thresholds where size should change from one category to another.
   */
  thresholds: Value[];
  /**
   * The sizes used for each band defined by `thresholds`.
   * Should contain N+1 sizes, where N is the number of thresholds.
   */
  sizes: number[];
}

export interface OrdinalSizeConfig<Value = number | Date | string> {
  type: 'ordinal';
  /**
   * The value to map.
   * If undefined, it will be integers from 0 to the number of sizes.
   */
  values?: readonly Value[];
  /**
   * The size palette.
   * Items equal to `values[k]` will get the size of `sizes[k]`.
   */
  sizes: number[];
  /**
   * The size to use when an element is not part of the values.
   */
  unknownSize?: number;
}
