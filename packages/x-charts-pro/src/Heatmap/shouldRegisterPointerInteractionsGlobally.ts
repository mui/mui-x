import { type HeatmapPlotProps } from './HeatmapPlot';
import { HeatmapCell } from './internals/HeatmapCell';

/* Global pointer interactions should be registered when we're using the default HeatmapCell.
 * We only want to return false when a custom slot is being used to avoid breaking changes. */
export function shouldRegisterPointerInteractionsGlobally(
  slots: HeatmapPlotProps['slots'],
): boolean {
  if (!slots || !slots.cell) {
    return true;
  }

  return slots.cell === HeatmapCell;
}
