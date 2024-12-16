import type { ChartsLegendProps } from './ChartsLegend';
import { ContinuousColorLegendProps } from './ContinuousColorLegend';
import { PiecewiseColorLegendProps } from './PiecewiseColorLegend';

export interface ChartsLegendSlots {
  /**
   * Custom rendering of the legend.
   * @default DefaultChartsLegend
   */
  legend?:
    | React.JSXElementConstructor<ChartsLegendProps>
    | React.JSXElementConstructor<ContinuousColorLegendProps>
    | React.JSXElementConstructor<PiecewiseColorLegendProps>;
}

export interface ChartsLegendSlotProps {
  legend?: Partial<ChartsLegendProps | ContinuousColorLegendProps | PiecewiseColorLegendProps>;
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
