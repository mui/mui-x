import { gridColumnLookupSelector } from '@mui/x-data-grid-pro';
import type { PatchHandler } from '../types';
import { ok, invalid } from '../types';

const validateField = (field: string, ctx: { apiRef: any }, context: string) => {
  const lookup = gridColumnLookupSelector(ctx.apiRef);
  if (!lookup[field]) {
    return invalid(`unknown column '${field}' in ${context}`);
  }
  return ok();
};

export const columnVisibilityModelHandler: PatchHandler = {
  path: '/columns/visibility',
  allowedOps: ['replace', 'add', 'remove'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'community',
  reconcile: (doc, op, ctx) => {
    ctx.apiRef.current.setColumnVisibilityModel(
      op.op === 'remove' ? {} : (doc.columns.visibility ?? {}),
    );
  },
};

export const columnVisibilityFieldHandler: PatchHandler = {
  path: '/columns/visibility/<field>',
  allowedOps: ['replace', 'add', 'remove'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'community',
  validate: (op, _doc, ctx) => {
    const field = op.path.split('/').pop();
    if (!field) {
      return invalid('missing field name in /columns/visibility/<field>');
    }
    return validateField(field, ctx, 'columns.visibility');
  },
  reconcile: (doc, op, ctx) => {
    const field = op.path.split('/').pop()!;
    const value = doc.columns.visibility?.[field];
    ctx.apiRef.current.setColumnVisibility(field, op.op === 'remove' ? true : !!value);
  },
};

export const columnPinnedHandler: PatchHandler = {
  path: '/columns/pinned',
  allowedOps: ['replace', 'add', 'remove'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'pro',
  reconcile: (doc, op, ctx) => {
    ctx.apiRef.current.setPinnedColumns(
      op.op === 'remove'
        ? { left: [], right: [] }
        : (doc.columns.pinned ?? { left: [], right: [] }),
    );
  },
};

export const columnPinnedSideHandler: PatchHandler = {
  path: '/columns/pinned/<side>',
  allowedOps: ['replace', 'add', 'remove'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'pro',
  reconcile: (doc, _op, ctx) => {
    ctx.apiRef.current.setPinnedColumns(doc.columns.pinned ?? { left: [], right: [] });
  },
};

export const columnOrderHandler: PatchHandler = {
  path: '/columns/order',
  allowedOps: ['replace', 'add', 'remove'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'pro',
  reconcile: (doc, op, ctx) => {
    if (op.op === 'remove') {
      return;
    }
    const target = doc.columns.order ?? [];
    // Reverse so each setColumnIndex pushes earlier fields back into place.
    for (let i = target.length - 1; i >= 0; i -= 1) {
      const field = target[i];
      if (typeof field === 'string') {
        ctx.apiRef.current.setColumnIndex(field, i);
      }
    }
  },
};

export const columnWidthHandler: PatchHandler = {
  path: '/columns/widths/<field>',
  allowedOps: ['replace', 'add', 'remove'],
  guard: null,
  phase: 'layout',
  tier: 2,
  plan: 'community',
  validate: (op, _doc, ctx) => {
    const field = op.path.split('/').pop();
    if (!field) {
      return invalid('missing field name in /columns/widths/<field>');
    }
    return validateField(field, ctx, 'columns.widths');
  },
  reconcile: (doc, op, ctx) => {
    const field = op.path.split('/').pop()!;
    const width = doc.columns.widths?.[field];
    if (op.op === 'remove' || width == null) {
      return;
    }
    if (typeof width !== 'number' || !Number.isFinite(width) || width <= 0) {
      return;
    }
    ctx.apiRef.current.setColumnWidth(field, width);
  },
};
