import type {
  ChartsTooltipContainerProps,
  ChartsTooltipClasses,
  ChartsTooltipSlots,
  ChartsTooltipSlotProps,
} from '@mui/x-charts/ChartsTooltip';

export interface TreemapTooltipSlots extends ChartsTooltipSlots {}

export interface TreemapTooltipSlotProps extends ChartsTooltipSlotProps {}

export interface TreemapTooltipClasses extends ChartsTooltipClasses {}

export interface TreemapTooltipContentClasses extends ChartsTooltipClasses {}

export interface TreemapTooltipProps extends Omit<
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
