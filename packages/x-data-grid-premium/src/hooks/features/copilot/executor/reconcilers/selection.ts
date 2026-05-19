import type { GridRowSelectionModel } from '@mui/x-data-grid-pro';
import type { PatchHandler } from '../types';
import { ok, invalid } from '../types';

export const selectionRowsHandler: PatchHandler = {
  path: '/selection/rows',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'rowSelection',
  phase: 'selection',
  tier: 2,
  plan: 'community',
  validate: (op, doc) => {
    if (op.op === 'remove') {
      return ok();
    }
    const slice = doc.selection?.rows;
    if (!slice || (slice.type !== 'include' && slice.type !== 'exclude')) {
      return invalid(`/selection/rows must have type 'include' | 'exclude'`);
    }
    if (!Array.isArray(slice.ids)) {
      return invalid('/selection/rows.ids must be an array');
    }
    return ok();
  },
  reconcile: (doc, op, ctx) => {
    if (op.op === 'remove') {
      const empty: GridRowSelectionModel = { type: 'include', ids: new Set() };
      ctx.apiRef.current.setRowSelectionModel(empty);
      return;
    }
    const slice = doc.selection.rows;
    const model: GridRowSelectionModel = {
      type: slice.type,
      ids: new Set(slice.ids),
    };
    ctx.apiRef.current.setRowSelectionModel(model);
  },
};

export const selectionCellsHandler: PatchHandler = {
  path: '/selection/cells',
  allowedOps: ['replace', 'add', 'remove'],
  guard: null,
  phase: 'selection',
  tier: 2,
  plan: 'premium',
  reconcile: (doc, op, ctx) => {
    ctx.apiRef.current.setCellSelectionModel(op.op === 'remove' ? {} : (doc.selection.cells ?? {}));
  },
};
