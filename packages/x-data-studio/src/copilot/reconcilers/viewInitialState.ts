import type { PatchHandler } from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

/**
 * Handles `/sheets/<id>/initialState` and any sub-path under it (e.g.
 * `/sheets/<id>/initialState/sorting/sortModel`). After the executor applies
 * the patch, we read the resulting subtree and forward it to `updateSheet`.
 * The currently-mounted Grid for the active sheet rehydrates from
 * `initialState` on its next mount; live in-place updates are a follow-up.
 */
export const viewInitialStateReconciler: PatchHandler<StudioHostAdapter, StudioStateDocument> = {
  path: '/sheets/<id>/initialState',
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
    ctx.adapter.api.stateApi.updateSheet(sheetId, { initialState: sheet.initialState });
  },
};
