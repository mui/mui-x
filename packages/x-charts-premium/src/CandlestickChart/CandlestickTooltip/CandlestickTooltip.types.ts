import type {
  ChartsTooltipClasses,
  ChartsTooltipContainerProps,
  ChartsTooltipSlotProps,
  ChartsTooltipSlots,
} from '@mui/x-charts/ChartsTooltip';

export interface CandlestickTooltipSlots extends ChartsTooltipSlots {}

export interface CandlestickTooltipSlotProps extends ChartsTooltipSlotProps {}

export interface CandlestickTooltipClasses extends ChartsTooltipClasses {}

export interface CandlestickTooltipContentClasses extends ChartsTooltipClasses {}

export interface CandlestickTooltipProps extends Omit<
  ChartsTooltipContainerProps,
  'trigger' | 'children'
> {
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger?: 'item' | 'none';
}
