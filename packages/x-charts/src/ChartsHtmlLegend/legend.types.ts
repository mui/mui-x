import type { ChartsLegendProps } from './ChartsLegend';

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

export interface ChartsLegendSlots {
  /**
   * Custom rendering of the legend.
   * @default DefaultChartsLegend
   */
  legend?: React.JSXElementConstructor<ChartsLegendProps>;
}

export interface ChartsLegendSlotProps {
  legend?: Partial<ChartsLegendProps>;
}

export interface ChartsLegendSlotExtension {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsLegendSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsLegendSlotProps;
}
