export type ChartsRadialAxisHighlightRotationType = 'none' | 'line' | 'band';

export type ChartsRadialAxisHighlightRadiusType = 'none' | 'line' | 'band';

export type ChartsRadialAxisHighlightProps = {
  /**
   * The type of highlight for the rotation axis.
   */
  rotation?: ChartsRadialAxisHighlightRotationType;
  /**
   * The type of highlight for the radius axis.
   */
  radius?: ChartsRadialAxisHighlightRadiusType;
};
