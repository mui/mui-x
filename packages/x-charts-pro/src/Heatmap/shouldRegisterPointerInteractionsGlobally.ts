import { type HeatmapPlotProps } from './HeatmapPlot';
import { HeatmapCell } from './HeatmapCell';

export function shouldRegisterPointerInteractionsGlobally(
  slots: HeatmapPlotProps['slots'],
): boolean {
  if (!slots || !slots.cell) {
    return true;
  }

  return slots.cell === HeatmapCell;
}
