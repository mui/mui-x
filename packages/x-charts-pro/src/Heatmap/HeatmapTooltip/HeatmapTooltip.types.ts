import {
  type ChartsTooltipContainerProps,
  type ChartsTooltipClasses,
} from '@mui/x-charts/ChartsTooltip';

export interface HeatmapTooltipSlots {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  tooltip?: React.ElementType<HeatmapTooltipProps>;
}

export interface HeatmapTooltipSlotProps {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  tooltip?: Partial<HeatmapTooltipProps>;
}

export interface HeatmapTooltipClasses extends ChartsTooltipClasses {}

export interface HeatmapTooltipContentClasses extends ChartsTooltipClasses {}

export interface HeatmapTooltipProps extends Omit<
  ChartsTooltipContainerProps<'item' | 'none'>,
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
