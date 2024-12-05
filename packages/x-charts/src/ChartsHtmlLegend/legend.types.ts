export type Direction = 'row' | 'column';

export interface ChartsLegendPlacement {
  // TODO: Possibly not relevant anymore. We can still mimic it though, but we need to handle it in the `BarChart/LineChart/etc` components.
  // /**
  //  * The position of the legend.
  //  */
  // position?: AnchorPosition;
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction?: Direction;
}
