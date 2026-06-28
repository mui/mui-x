import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import type { PatchHandler } from '../types';
import { ok, invalid } from '../types';

export const groupingHandler: PatchHandler = {
  path: '/grouping',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'grouping',
  phase: 'view',
  tier: 1,
  plan: 'premium',
  validate: (op, doc, ctx) => {
    if (op.op === 'remove') {
      return ok();
    }
    const model = doc.grouping;
    if (!Array.isArray(model)) {
      return invalid('grouping model must be an array of field names');
    }
    const colsLookup = gridColumnLookupSelector(ctx.apiRef);
    for (const field of model) {
      if (typeof field !== 'string') {
        return invalid('grouping entries must be strings');
      }
      if (!colsLookup[field]) {
        return invalid(`unknown column '${field}' in grouping`);
      }
    }
    return ok();
  },
  reconcile: (doc, op, ctx) => {
    ctx.apiRef.current.setRowGroupingModel(op.op === 'remove' ? [] : (doc.grouping as string[]));
  },
};
