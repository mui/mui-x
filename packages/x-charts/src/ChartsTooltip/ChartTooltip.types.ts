import {
  ChartsLabelMarkSlotProps,
  ChartsLabelMarkSlots,
} from '../ChartsLabel/chartsLabelMark.types';
import { ChartsTooltipProps } from './ChartsTooltip';

export interface ChartsTooltipSlots extends ChartsLabelMarkSlots {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  tooltip?: React.ElementType<ChartsTooltipProps>;
}

export interface ChartsTooltipSlotProps extends ChartsLabelMarkSlotProps {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  tooltip?: Partial<ChartsTooltipProps>;
}
