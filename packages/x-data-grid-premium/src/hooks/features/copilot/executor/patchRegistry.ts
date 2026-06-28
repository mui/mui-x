import type { Guards, PatchHandler, SlicePath } from './types';
import { filterHandler } from './reconcilers/filter';
import { sortHandler } from './reconcilers/sort';
import { groupingHandler } from './reconcilers/grouping';
import { aggregationHandler } from './reconcilers/aggregation';
import { pivotHandler, pivotActiveHandler, pivotModelHandler } from './reconcilers/pivot';
import {
  columnVisibilityModelHandler,
  columnVisibilityFieldHandler,
  columnPinnedHandler,
  columnPinnedSideHandler,
  columnOrderHandler,
  columnWidthHandler,
} from './reconcilers/columns';
import {
  chartHandler,
  chartTypeHandler,
  chartDimensionsHandler,
  chartValuesHandler,
  chartSyncedHandler,
} from './reconcilers/charts';
import { selectionRowsHandler, selectionCellsHandler } from './reconcilers/selection';
import {
  viewDensityHandler,
  viewPaginationHandler,
  viewPaginationPageHandler,
  viewPaginationPageSizeHandler,
  viewSidebarHandler,
  viewChartsPanelOpenHandler,
  viewPreferencesHandler,
  viewActiveChartIdHandler,
} from './reconcilers/view';

const ALL_PATCH_HANDLERS: PatchHandler[] = [
  filterHandler,
  sortHandler,
  groupingHandler,
  aggregationHandler,
  pivotHandler,
  pivotActiveHandler,
  pivotModelHandler,
  columnVisibilityModelHandler,
  columnVisibilityFieldHandler,
  columnPinnedHandler,
  columnPinnedSideHandler,
  columnOrderHandler,
  columnWidthHandler,
  chartHandler,
  chartTypeHandler,
  chartDimensionsHandler,
  chartValuesHandler,
  chartSyncedHandler,
  selectionRowsHandler,
  selectionCellsHandler,
  viewDensityHandler,
  viewPaginationHandler,
  viewPaginationPageHandler,
  viewPaginationPageSizeHandler,
  viewSidebarHandler,
  viewChartsPanelOpenHandler,
  viewPreferencesHandler,
  viewActiveChartIdHandler,
];

export interface PatchRegistry {
  /** Find the handler that owns reconciliation for a given (RFC 6901) path. */
  resolve(path: string): PatchHandler | undefined;
  /** All handlers visible under the current guard set. */
  all(): PatchHandler[];
}

function pathMatches(handlerPath: SlicePath, opPath: string): boolean {
  // Tokenize both, treating `<id>` placeholders as wildcards.
  const handlerTokens = handlerPath.split('/').slice(1);
  const opTokens = opPath.split('/').slice(1);
  if (handlerTokens.length > opTokens.length) {
    return false;
  }
  for (let i = 0; i < handlerTokens.length; i += 1) {
    const ht = handlerTokens[i];
    const ot = opTokens[i];
    if (ht.startsWith('<') && ht.endsWith('>')) {
      if (!ot) {
        return false;
      }
      continue;
    }
    if (ht !== ot) {
      return false;
    }
  }
  return true;
}

/**
 * Build a registry filtered by the current guards (tier-3 entries hidden unless
 * `guards.mutations === true`).
 */
export function buildPatchRegistry(guards: Guards): PatchRegistry {
  const visible = ALL_PATCH_HANDLERS.filter((h) => h.tier !== 3 || guards.mutations);

  // Order by descending path specificity so `/pivot/active` wins over `/pivot`
  // when both could match. We rely on segment count.
  const ordered = visible
    .slice()
    .sort((a, b) => b.path.split('/').length - a.path.split('/').length);

  return {
    resolve(path: string) {
      for (const handler of ordered) {
        if (pathMatches(handler.path, path)) {
          return handler;
        }
      }
      return undefined;
    },
    all() {
      return visible;
    },
  };
}

export { ALL_PATCH_HANDLERS };
