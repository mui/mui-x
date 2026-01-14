import {
  type ChartsTooltipContainerProps,
  type ChartsTooltipClasses,
} from '@mui/x-charts/ChartsTooltip';

export interface SankeyTooltipClasses extends ChartsTooltipClasses {}

export interface SankeyTooltipContentClasses extends ChartsTooltipClasses {}

export interface SankeyTooltipProps extends Omit<
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
