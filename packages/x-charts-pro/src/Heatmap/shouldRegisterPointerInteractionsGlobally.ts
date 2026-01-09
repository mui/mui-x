import { type HeatmapPlotProps } from './HeatmapPlot';
import { HeatmapCell } from './internals/HeatmapCell';

/* Global pointer interactions should be registered when we're using the default HeatmapCell.
 * We only want to return false when a custom slot is being used to avoid breaking changes.
 *
 * This can be removed in v9. */
export function shouldRegisterPointerInteractionsGlobally(
  slots: HeatmapPlotProps['slots'],
  slotProps: HeatmapPlotProps['slotProps'],
): boolean {
  // If 'onPointerEnter' is defined in the slotProps, we don't want to register globally.
  if ('onPointerEnter' in (slotProps?.cell ?? {})) {
    return false;
  }

  return slots === undefined || slots.cell === HeatmapCell;
}
