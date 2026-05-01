import { type ChartsTooltipProps } from './ChartsTooltip';
import { type TriggerOptions } from './utils';

export interface ChartsTooltipSlots<T extends TriggerOptions = TriggerOptions> {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  tooltip?: React.ElementType<ChartsTooltipProps<T>>;
}

export interface ChartsTooltipSlotProps<T extends TriggerOptions = TriggerOptions> {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  tooltip?: Partial<ChartsTooltipProps<T>>;
}
