import type { GridRowId, GridRowSelectionModel } from '@mui/x-data-grid-pro';
import { getVisibleRows } from '@mui/x-data-grid-pro/internals';
import type { CommandHandler } from '../types';
import { ok, invalid } from '../types';

interface SelectVisibleTopParams {
  count: number;
}

export const selectVisibleTopHandler: CommandHandler<SelectVisibleTopParams> = {
  type: 'selection.selectVisibleTop',
  namespace: 'selection',
  tier: 1,
  plan: 'community',
  guard: 'rowSelection',
  phase: 'selection',
  // Wait for any state slices that change the visible row set.
  dependsOn: () => ['/sort', '/filter', '/grouping', '/pivot'],
  validate: (params) => {
    if (
      !params ||
      typeof params.count !== 'number' ||
      !Number.isInteger(params.count) ||
      params.count < 0
    ) {
      return invalid('selectVisibleTop.count must be a non-negative integer');
    }
    return ok();
  },
  run: ({ count }, ctx) => {
    const visible = getVisibleRows(ctx.apiRef);
    const ids = new Set<GridRowId>();
    const limit = Math.min(count, visible.rows.length);
    for (let i = 0; i < limit; i += 1) {
      const row = visible.rows[i];
      const id = ctx.apiRef.current.getRowId(row);
      ids.add(id);
    }
    const model: GridRowSelectionModel = { type: 'include', ids };
    ctx.apiRef.current.setRowSelectionModel(model);
  },
};

export const selectionCommands: CommandHandler[] = [selectVisibleTopHandler];
