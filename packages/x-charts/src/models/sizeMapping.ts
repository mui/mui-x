type SharedContinuousSizeConfig<Value> = {
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
};

type ContinuousSizeConfigWithNamedInterpolator<Value = number | Date> =
  SharedContinuousSizeConfig<Value> & {
    /**
     * The sizes to render. It can be an array with the extremum sizes, or an interpolation function.
     */
    size: readonly [number, number];
    /**
     * The interpolator to use when `size` is an array of two numbers. It defines how the size should interpolate between the minimum and maximum values.
     * Default is set to 'sqrt' to map values to surfaces instead of radii.
     * @default 'sqrt'
     */
    interpolator?: 'sqrt' | 'linear' | 'log';
  };

export type ContinuousSizeConfigWithFunctionInterpolator<Value = number | Date> =
  SharedContinuousSizeConfig<Value> & {
    /**
     * The sizes to render. It can be an array with the extremum sizes, or an interpolation function.
     * @param {number} t the interpolation factor. Varies from 0 to 1 when values are from min to max.
     * @returns {number} The size to render for the interpolation factor `t`.
     */
    size: (t: number) => number;
  };

export type ContinuousSizeConfig<Value = number | Date> =
  | ContinuousSizeConfigWithNamedInterpolator<Value>
  | ContinuousSizeConfigWithFunctionInterpolator<Value>;

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
