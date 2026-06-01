import type { PatchHandler } from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

/**
 * Handles `/sheets/<id>/params` and any sub-path under it (e.g.
 * `/sheets/<id>/params/chartSummary/groupBy`). After the executor applies the
 * patch to the document, we read the resulting `params` subtree and forward it
 * to `updateSheet` so the view renderer (pivot/chart/dashboard) reconfigures.
 * Mirrors the `initialState` reconciler.
 */
export const sheetParamsReconciler: PatchHandler<StudioHostAdapter, StudioStateDocument> = {
  path: '/sheets/<id>/params',
  allowedOps: ['add', 'remove', 'replace'],
  guard: 'viewEditing',
  phase: 'sheet',
  tier: 3,
  plan: 'community',
  reconcile: (doc, op, ctx) => {
    const tokens = op.path.split('/');
    const sheetId = tokens[2];
    if (typeof sheetId !== 'string') {
      return;
    }
    const sheet = doc.sheets[sheetId];
    if (!sheet) {
      return;
    }
    ctx.adapter.api.stateApi.updateSheet(sheetId, { params: sheet.params });
  },
};
