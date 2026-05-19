import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import type { PatchHandler } from '../types';
import { ok, invalid } from '../types';
import type { GridPivotModel } from '../../../pivoting/gridPivotingInterfaces';

function validateModel(model: GridPivotModel, ctx: { apiRef: any; props: any }) {
  const colsLookup = gridColumnLookupSelector(ctx.apiRef);
  const aggFns = Object.keys(ctx.props.aggregationFunctions ?? {});

  for (const collection of [model.columns, model.rows, model.values] as const) {
    if (!Array.isArray(collection)) {
      return invalid('pivot model expects rows, columns and values to be arrays');
    }
  }

  for (const entry of model.rows) {
    if (!colsLookup[entry.field]) {
      return invalid(`unknown column '${entry.field}' in pivot rows`);
    }
  }
  for (const entry of model.columns) {
    if (!colsLookup[entry.field]) {
      return invalid(`unknown column '${entry.field}' in pivot columns`);
    }
  }
  for (const entry of model.values) {
    if (!colsLookup[entry.field]) {
      return invalid(`unknown column '${entry.field}' in pivot values`);
    }
    if (aggFns.length > 0 && entry.aggFunc && !aggFns.includes(entry.aggFunc)) {
      return invalid(`aggregation function '${entry.aggFunc}' is not registered`);
    }
  }
  return ok();
}

export const pivotHandler: PatchHandler = {
  path: '/pivot',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'pivoting',
  phase: 'pivot',
  tier: 1,
  plan: 'premium',
  validate: (op, doc, ctx) => {
    if (op.op === 'remove') {
      return ok();
    }
    const slice = doc.pivot;
    if (!slice || typeof slice.active !== 'boolean' || !slice.model) {
      return invalid('pivot slice must have `active` and `model`');
    }
    return validateModel(slice.model, ctx);
  },
  reconcile: (doc, op, ctx) => {
    if (op.op === 'remove') {
      ctx.apiRef.current.setPivotActive(false);
      return;
    }
    ctx.apiRef.current.setPivotActive(doc.pivot.active);
    ctx.apiRef.current.setPivotModel(doc.pivot.model);
  },
};

export const pivotActiveHandler: PatchHandler = {
  path: '/pivot/active',
  allowedOps: ['replace'],
  guard: 'pivoting',
  phase: 'pivot',
  tier: 1,
  plan: 'premium',
  validate: (op, doc) => {
    if (typeof doc.pivot.active !== 'boolean') {
      return invalid('/pivot/active must be a boolean');
    }
    return ok();
  },
  reconcile: (doc, _op, ctx) => {
    ctx.apiRef.current.setPivotActive(doc.pivot.active);
  },
};

export const pivotModelHandler: PatchHandler = {
  path: '/pivot/model',
  allowedOps: ['replace'],
  guard: 'pivoting',
  phase: 'pivot',
  tier: 1,
  plan: 'premium',
  validate: (op, doc, ctx) => validateModel(doc.pivot.model, ctx),
  reconcile: (doc, _op, ctx) => {
    ctx.apiRef.current.setPivotModel(doc.pivot.model);
  },
};
