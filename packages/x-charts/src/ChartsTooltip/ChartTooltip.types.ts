import { ChartsTooltipProps } from './ChartsTooltip';

export interface ChartsTooltipSlots {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  tooltip?: React.ElementType<ChartsTooltipProps>;
}

export interface ChartsTooltipSlotProps {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  tooltip?: Partial<ChartsTooltipProps>;
}
