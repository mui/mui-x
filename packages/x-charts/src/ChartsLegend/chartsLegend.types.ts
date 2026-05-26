import type { ChartsLegendProps } from './ChartsLegend';
import { type ContinuousColorLegendProps } from './ContinuousColorLegend';
import { type ChartsLegendPosition } from './legend.types';
import { type PiecewiseColorLegendProps } from './PiecewiseColorLegend';
import type { LegendPropsOverrides } from '../models/chartsSlotsComponentsProps';

export interface ChartsLegendSlots {
  /**
   * Custom rendering of the legend.
   * @default ChartsLegend
   */
  legend?:
    | React.JSXElementConstructor<ChartsLegendProps & LegendPropsOverrides>
    | React.JSXElementConstructor<ContinuousColorLegendProps & LegendPropsOverrides>
    | React.JSXElementConstructor<PiecewiseColorLegendProps & LegendPropsOverrides>;
}

export interface ChartsLegendSlotProps {
  legend?: Partial<ChartsLegendProps | ContinuousColorLegendProps | PiecewiseColorLegendProps> &
    // We allow position only on slots.
    ChartsLegendPosition &
    LegendPropsOverrides;
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
