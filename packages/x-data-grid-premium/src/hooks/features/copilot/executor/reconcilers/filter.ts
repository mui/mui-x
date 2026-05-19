import {
  type GridFilterModel,
  type GridSingleSelectColDef,
  GridLogicOperator,
  gridColumnLookupSelector,
} from '@mui/x-data-grid-pro';
import { getValueOptions } from '@mui/x-data-grid-pro/internals';
import type { PatchHandler } from '../types';
import { ok, invalid } from '../types';

/**
 * Pre-process filter items so that values referring to a `singleSelect` column's
 * `label` are translated to the underlying `value` before reaching `apiRef`.
 *
 * Ports the inline behaviour from `useGridAiAssistant.tsx:242–249`.
 */
function applySingleSelectLabelToValue(
  model: GridFilterModel,
  ctx: { apiRef: any },
): GridFilterModel {
  const colsLookup = gridColumnLookupSelector(ctx.apiRef);
  return {
    ...model,
    items: model.items.map((item) => {
      const column = colsLookup[item.field];
      if (!column || column.type !== 'singleSelect') {
        return item;
      }
      const options = getValueOptions(column as GridSingleSelectColDef) ?? [];
      const matchValue = (candidate: unknown) => {
        const match = options.find(
          (option) =>
            typeof option === 'object' && option !== null && (option as any).label === candidate,
        );
        return match ? (match as any).value : candidate;
      };
      if (Array.isArray(item.value)) {
        return { ...item, value: item.value.map(matchValue) };
      }
      return { ...item, value: matchValue(item.value) };
    }),
  };
}

export const filterHandler: PatchHandler = {
  path: '/filter',
  allowedOps: ['replace', 'add', 'remove'],
  guard: 'filter',
  phase: 'view',
  tier: 1,
  plan: 'community',
  validate: (op, doc, ctx) => {
    if (op.op === 'remove') {
      return ok();
    }
    const model = doc.filter;
    if (!model || !Array.isArray(model.items)) {
      return invalid('filter model has no items array');
    }
    const colsLookup = gridColumnLookupSelector(ctx.apiRef);
    for (const item of model.items) {
      if (!colsLookup[item.field]) {
        return invalid(`unknown column '${item.field}' in filter item`);
      }
      const column = colsLookup[item.field];
      const allowedOps = (column.filterOperators ?? []).map((o) => o.value);
      if (item.operator && allowedOps.length > 0 && !allowedOps.includes(item.operator)) {
        return invalid(`operator '${item.operator}' is not allowed for column '${item.field}'`);
      }
    }
    return ok();
  },
  reconcile: (doc, op, ctx) => {
    if (op.op === 'remove') {
      ctx.apiRef.current.setFilterModel({
        items: [],
        logicOperator: GridLogicOperator.And,
        quickFilterValues: [],
      });
      return;
    }
    const normalized = applySingleSelectLabelToValue(doc.filter, ctx);
    ctx.apiRef.current.setFilterModel(normalized);
  },
};
