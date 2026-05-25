import type { PatchHandler } from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

/**
 * Handles writes to `/active/datasetId` and `/active/viewId`. Navigation only:
 * the underlying state machine is responsible for clamping the active dataset
 * when a view selection implies one.
 */
export const activeReconciler: PatchHandler<StudioHostAdapter, StudioStateDocument> = {
  path: '/active',
  allowedOps: ['replace'],
  guard: 'datasetSwitching',
  phase: 'layout',
  tier: 2,
  plan: 'community',
  reconcile: (_doc, op, ctx) => {
    const stateApi = ctx.adapter.api.stateApi;
    if (op.path === '/active/datasetId') {
      if (typeof op.value === 'string') {
        stateApi.selectDataset(op.value);
      }
      return;
    }
    if (op.path === '/active/viewId') {
      if (typeof op.value === 'string') {
        stateApi.selectView(op.value);
      }
      // null/clear isn't part of the imperative surface; ignore.
    }
  },
};
