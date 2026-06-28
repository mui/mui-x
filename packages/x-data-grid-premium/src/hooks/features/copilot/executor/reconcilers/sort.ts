import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import type { PatchHandler } from '../types';
import { ok, invalid } from '../types';

export const sortHandler: PatchHandler = {
  path: '/sort',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'sort',
  phase: 'view',
  tier: 1,
  plan: 'community',
  validate: (op, doc, ctx) => {
    if (op.op === 'remove') {
      return ok();
    }
    const model = doc.sort;
    if (!Array.isArray(model)) {
      return invalid('sort model must be an array');
    }
    const colsLookup = gridColumnLookupSelector(ctx.apiRef);
    for (const item of model) {
      if (!item || typeof item.field !== 'string') {
        return invalid('sort item must have a string field');
      }
      if (!colsLookup[item.field]) {
        return invalid(`unknown column '${item.field}' in sort item`);
      }
      if (item.sort != null && item.sort !== 'asc' && item.sort !== 'desc') {
        return invalid(`invalid sort direction '${String(item.sort)}'`);
      }
    }
    return ok();
  },
  reconcile: (doc, op, ctx) => {
    if (op.op === 'remove') {
      ctx.apiRef.current.setSortModel([]);
      return;
    }
    ctx.apiRef.current.setSortModel(doc.sort);
  },
};
