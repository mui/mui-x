import type { PatchHandler } from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

/**
 * Handles `/sheets/<id>/dataSourceId` — re-bind a sheet to a different dataSource.
 */
export const viewMetaReconciler: PatchHandler<StudioHostAdapter, StudioStateDocument> = {
  path: '/sheets/<id>/dataSourceId',
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
    ctx.adapter.api.stateApi.updateSheet(viewId, { dataSourceId: op.value });
  },
};
