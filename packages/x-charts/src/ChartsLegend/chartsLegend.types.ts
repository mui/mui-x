import type { ChartsLegendProps } from './ChartsLegend';
import { ContinuousColorLegendProps } from './ContinuousColorLegend';
import { ChartsLegendPosition } from './legend.types';
import { PiecewiseColorLegendProps } from './PiecewiseColorLegend';
import {
  ChartsLabelMarkSlotProps,
  ChartsLabelMarkSlots,
} from '../ChartsLabel/chartsLabelMark.types';

export interface ChartsLegendSlots extends ChartsLabelMarkSlots {
  /**
   * Custom rendering of the legend.
   * @default ChartsLegend
   */
  legend?:
    | React.JSXElementConstructor<ChartsLegendProps>
    | React.JSXElementConstructor<ContinuousColorLegendProps>
    | React.JSXElementConstructor<PiecewiseColorLegendProps>;
}

export interface ChartsLegendSlotProps extends ChartsLabelMarkSlotProps {
  legend?: Partial<ChartsLegendProps | ContinuousColorLegendProps | PiecewiseColorLegendProps> &
    // We allow position only on slots.
    ChartsLegendPosition;
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
