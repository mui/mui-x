import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import type { PatchHandler } from '../types';
import { ok, invalid } from '../types';

export const aggregationHandler: PatchHandler = {
  path: '/aggregation',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'aggregation',
  phase: 'view',
  tier: 1,
  plan: 'premium',
  validate: (op, doc, ctx) => {
    if (op.op === 'remove') {
      return ok();
    }
    const model = doc.aggregation;
    if (!model || typeof model !== 'object') {
      return invalid('aggregation model must be an object');
    }
    const colsLookup = gridColumnLookupSelector(ctx.apiRef);
    const aggFns = Object.keys(ctx.props.aggregationFunctions ?? {});
    for (const [field, aggFunc] of Object.entries(model)) {
      if (!colsLookup[field]) {
        return invalid(`unknown column '${field}' in aggregation`);
      }
      if (typeof aggFunc !== 'string') {
        return invalid(`aggregation value for '${field}' must be a string`);
      }
      if (aggFns.length > 0 && !aggFns.includes(aggFunc)) {
        return invalid(`aggregation function '${aggFunc}' is not registered for this grid`);
      }
    }
    return ok();
  },
  reconcile: (doc, op, ctx) => {
    ctx.apiRef.current.setAggregationModel(op.op === 'remove' ? {} : doc.aggregation);
  },
};
