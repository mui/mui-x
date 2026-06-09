import { fastArrayCompare } from '@mui/x-internals/fastArrayCompare';
import type {
  GridMultiSelectInternalCache,
  GridMultiSelectOverflowMetrics,
} from './gridMultiSelectInterfaces';

/**
 * Holds the grid-level `+N` overflow chip metrics. Written by the single `GridMultiSelectMeasurer`
 * and read by every multiSelect chip cell via `useSyncExternalStore`.
 */
export class GridMultiSelectCache implements GridMultiSelectInternalCache {
  private overflowMetrics: GridMultiSelectOverflowMetrics | null = null;

  private metricsSubscribers = new Set<(metrics: GridMultiSelectOverflowMetrics | null) => void>();

  private notifyMetrics = (metrics: GridMultiSelectOverflowMetrics | null) => {
    this.metricsSubscribers.forEach((cb) => cb(metrics));
  };

  public getOverflowMetrics = () => {
    return this.overflowMetrics;
  };

  public setOverflowMetrics = (next: GridMultiSelectOverflowMetrics) => {
    // Skip no-op updates so subscribed cells don't re-render on every measurer ResizeObserver tick.
    const prev = this.overflowMetrics;
    if (
      prev &&
      prev.gap === next.gap &&
      fastArrayCompare(prev.overflowChipWidths, next.overflowChipWidths)
    ) {
      return;
    }
    this.overflowMetrics = next;
    this.notifyMetrics(next);
  };

  public subscribeOverflowMetrics = (
    callback: (metrics: GridMultiSelectOverflowMetrics | null) => void,
  ) => {
    this.metricsSubscribers.add(callback);
    return () => {
      this.metricsSubscribers.delete(callback);
    };
  };

  public teardown = () => {
    this.metricsSubscribers.clear();
    this.overflowMetrics = null;
  };
}
