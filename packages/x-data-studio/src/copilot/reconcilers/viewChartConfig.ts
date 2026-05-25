import type { PatchHandler } from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';

/**
 * Handles `/views/<id>/chartConfig` and any sub-path under it. After the
 * executor applies the patch to `doc`, we read the resulting subtree and
 * forward it to `updateView`. Studio drops chartConfig changes for non-chart
 * views silently, which matches the agent's expectation that only chart views
 * carry one.
 */
export const viewChartConfigReconciler: PatchHandler<StudioHostAdapter, StudioStateDocument> = {
  path: '/views/<id>/chartConfig',
  allowedOps: ['add', 'remove', 'replace'],
  guard: 'chartEditing',
  phase: 'chart',
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
    ctx.adapter.api.stateApi.updateView(viewId, { chartConfig: view.chartConfig });
  },
};
