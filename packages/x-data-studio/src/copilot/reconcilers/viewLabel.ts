import type { PatchHandler } from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

export const viewLabelReconciler: PatchHandler<StudioHostAdapter, StudioStateDocument> = {
  path: '/sheets/<id>/label',
  allowedOps: ['replace'],
  guard: 'viewCrud',
  phase: 'sheet',
  tier: 3,
  plan: 'community',
  reconcile: (_doc, op, ctx) => {
    const tokens = op.path.split('/');
    const viewId = tokens[2];
    if (typeof viewId !== 'string' || typeof op.value !== 'string') {
      return;
    }
    ctx.adapter.api.stateApi.renameSheet(viewId, op.value);
  },
};
