export type PiecewiseLabelFormatterParams = {
  /**
   * The index of the entry.
   */
  index: number;
  /**
   * The length of the entries array.
   */
  length: number;
  /**
   * The min value of the piece. `null` is infinite.
   */
  min: number | Date | null;
  /**
   * The max value of the piece. `null` is infinite.
   */
  max: number | Date | null;
  /**
   * The formatted min value of the piece. `null` is infinite.
   */
  formattedMin: string | null;
  /**
   * The formatted max value of the piece. `null` is infinite.
   */
  formattedMax: string | null;
};
