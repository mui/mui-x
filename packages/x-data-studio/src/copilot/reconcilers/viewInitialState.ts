import type { PatchHandler } from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

/**
 * Handles `/views/<id>/initialState` and any sub-path under it (e.g.
 * `/views/<id>/initialState/sorting/sortModel`). After the executor applies
 * the patch, we read the resulting subtree and forward it to `updateView`.
 * The currently-mounted Grid for the active view rehydrates from
 * `initialState` on its next mount; live in-place updates are a follow-up.
 */
export const viewInitialStateReconciler: PatchHandler<StudioHostAdapter, StudioStateDocument> = {
  path: '/views/<id>/initialState',
  allowedOps: ['add', 'remove', 'replace'],
  guard: 'viewEditing',
  phase: 'view',
  tier: 3,
  plan: 'community',
  reconcile: (doc, op, ctx) => {
    const tokens = op.path.split('/');
    const viewId = tokens[2];
    if (typeof viewId !== 'string') {
      return;
    }
    const view = doc.views[viewId];
    if (!view) {
      return;
    }
    ctx.adapter.api.stateApi.updateView(viewId, { initialState: view.initialState });
  },
};
