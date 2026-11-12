export type ChartsAxisHighlightType = 'none' | 'line' | 'band';

export type ChartsAxisHighlightProps = {
  /**
   * The type of highlight for the x-axis.
   */
  x?: ChartsAxisHighlightType;
  /**
   * The type of highlight for the y-axis.
   */
  y?: ChartsAxisHighlightType;
};
