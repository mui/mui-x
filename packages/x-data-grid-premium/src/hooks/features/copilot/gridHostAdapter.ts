import type { RefObject } from '@mui/x-internals/types';
import type { HostAdapter, ToolStopContext } from '@mui/x-copilot';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridStateDocument } from './executor/stateDocument';
import { snapshotState } from './executor/stateDocument';

/**
 * Bundle of host-side state the Grid command/reconciler handlers need at
 * runtime. Lives behind `HostAdapter.api` so x-copilot core never touches
 * Grid types.
 */
export interface GridCopilotApi {
  readonly apiRef: RefObject<GridPrivateApiPremium>;
  readonly props: DataGridPremiumProcessedProps;
}

export interface GridCopilotCarryState {
  /**
   * Map of fields displaced into the aggregation slot → their original
   * column index. Survives across executor instances so an unaggregate
   * restores the original ordering even after the model emits a fresh turn.
   */
  displacedAggregationOrigins: Map<string, number>;
}

export type GridHostAdapter = HostAdapter<GridStateDocument, GridCopilotApi>;

const GROUPING_FIELD_PREFIX = '__row_group_by_columns_group';

function autoActivatePivotIfConfigured(
  ctx: ToolStopContext<GridStateDocument, GridCopilotApi>,
  userAppliedSlices: ReadonlySet<string>,
  guards: { pivoting?: boolean },
): void {
  if (!guards.pivoting) {
    return;
  }
  if (userAppliedSlices.has('/pivot') || userAppliedSlices.has('/pivot/active')) {
    return;
  }
  if (!userAppliedSlices.has('/pivot/model')) {
    return;
  }
  if (ctx.doc.pivot.active) {
    return;
  }
  const model = ctx.doc.pivot.model;
  const hasEntries = model.rows.length > 0 || model.columns.length > 0 || model.values.length > 0;
  if (!hasEntries) {
    return;
  }
  ctx.api.apiRef.current.setPivotActive(true);
  ctx.appendApplied({
    kind: 'patch',
    line: '<auto>',
    path: '/pivot/active',
    description: 'auto-activated because /pivot/model was configured',
  });
}

function autoPinGroupingColumns(
  ctx: ToolStopContext<GridStateDocument, GridCopilotApi>,
  userAppliedSlices: ReadonlySet<string>,
): void {
  if (!userAppliedSlices.has('/grouping')) {
    return;
  }
  if (
    userAppliedSlices.has('/columns/pinned') ||
    userAppliedSlices.has('/columns/pinned/<side>')
  ) {
    return;
  }

  const liveOrder = ctx.api.apiRef.current.state.columns?.orderedFields ?? [];
  const currentPinnedLeft = ctx.doc.columns.pinned.left ?? [];
  const right = ctx.doc.columns.pinned.right ?? [];

  let desired: string[];
  let description: string;
  if (ctx.doc.grouping.length > 0) {
    const groupingFields = liveOrder.filter((f) => f.startsWith(GROUPING_FIELD_PREFIX));
    const missing = groupingFields.filter((f) => !currentPinnedLeft.includes(f));
    if (missing.length === 0) {
      return;
    }
    desired = [...currentPinnedLeft, ...missing];
    description = 'auto-pinned grouping columns to the left';
  } else {
    desired = currentPinnedLeft.filter((f) => !f.startsWith(GROUPING_FIELD_PREFIX));
    if (desired.length === currentPinnedLeft.length) {
      return;
    }
    description = 'auto-unpinned grouping columns';
  }

  ctx.api.apiRef.current.setPinnedColumns({ left: desired, right });
  // applyPatch also updates the executor's working `doc` so the next auto-X
  // step (autoReorderAggregationColumns) sees the new pinned-left length.
  ctx.applyPatch(
    { op: 'replace', path: '/columns/pinned', value: { left: desired, right } },
    description,
  );
}

function autoReorderAggregationColumns(
  ctx: ToolStopContext<GridStateDocument, GridCopilotApi>,
  userAppliedSlices: ReadonlySet<string>,
  carry: GridCopilotCarryState,
): void {
  if (!userAppliedSlices.has('/aggregation')) {
    return;
  }
  if (userAppliedSlices.has('/columns/order')) {
    return;
  }

  const prevAgg = ctx.envelopeStartDoc.aggregation ?? {};
  const nextAgg = ctx.doc.aggregation ?? {};
  const added: string[] = [];
  const removed: string[] = [];
  Object.keys(nextAgg).forEach((f) => {
    if (!(f in prevAgg)) {
      added.push(f);
    }
  });
  Object.keys(prevAgg).forEach((f) => {
    if (!(f in nextAgg)) {
      removed.push(f);
    }
  });
  if (added.length === 0 && removed.length === 0) {
    return;
  }

  const apiRef = ctx.api.apiRef;
  const liveOrderBefore = apiRef.current.state.columns?.orderedFields ?? [];
  const pinnedLeftCount = (ctx.doc.columns.pinned.left ?? []).length;

  const headSlice = liveOrderBefore.slice(pinnedLeftCount, pinnedLeftCount + added.length);
  const addedAlreadyCorrect = added.length > 0 && added.every((f, i) => headSlice[i] === f);

  const movedFields: string[] = [];
  if (!addedAlreadyCorrect) {
    added.forEach((field) => {
      if (!carry.displacedAggregationOrigins.has(field)) {
        const idx = liveOrderBefore.indexOf(field);
        if (idx >= 0) {
          carry.displacedAggregationOrigins.set(field, idx);
        }
      }
    });
    for (let i = added.length - 1; i >= 0; i -= 1) {
      const field = added[i];
      try {
        apiRef.current.setColumnIndex(field, pinnedLeftCount);
        movedFields.unshift(field);
      } catch {
        // ignore — column may have been removed from the grid
      }
    }
  }

  const restoredFields: string[] = [];
  removed.forEach((field) => {
    const origIdx = carry.displacedAggregationOrigins.get(field);
    if (origIdx === undefined) {
      return;
    }
    const currentIdx = apiRef.current.state.columns?.orderedFields?.indexOf(field) ?? -1;
    if (currentIdx === origIdx) {
      carry.displacedAggregationOrigins.delete(field);
      return;
    }
    try {
      apiRef.current.setColumnIndex(field, origIdx);
      restoredFields.push(field);
      carry.displacedAggregationOrigins.delete(field);
    } catch {
      // ignore
    }
  });

  if (movedFields.length === 0 && restoredFields.length === 0) {
    return;
  }

  ctx.appliedSlices.add('/columns/order');
  if (movedFields.length > 0) {
    ctx.appendApplied({
      kind: 'patch',
      line: '<auto>',
      path: '/columns/order',
      description: `auto-moved aggregated columns to start: ${movedFields.join(', ')}`,
    });
  }
  if (restoredFields.length > 0) {
    ctx.appendApplied({
      kind: 'patch',
      line: '<auto>',
      path: '/columns/order',
      description: `auto-restored columns to original position: ${restoredFields.join(', ')}`,
    });
  }
}

interface CreateGridHostAdapterOptions {
  apiRef: RefObject<GridPrivateApiPremium>;
  props: DataGridPremiumProcessedProps;
  guards: { pivoting?: boolean; mutations?: boolean };
  /**
   * Shared carry-state Map kept alive across executor instances. Pass a
   * stable instance from the parent hook so aggregation restore survives a
   * later turn.
   */
  displacedAggregationOrigins?: Map<string, number>;
}

export function createGridHostAdapter(options: CreateGridHostAdapterOptions): GridHostAdapter {
  const { apiRef, props, guards } = options;
  let carry: GridCopilotCarryState = {
    displacedAggregationOrigins:
      options.displacedAggregationOrigins ?? new Map<string, number>(),
  };
  const api: GridCopilotApi = { apiRef, props };

  function runPatchToolReconcile(ctx: ToolStopContext<GridStateDocument, GridCopilotApi>): void {
    // Snapshot the set the user (= dispatch loop) explicitly applied BEFORE
    // any auto-X step runs. The auto-* functions need to gate on the user's
    // input set, not on the set they themselves grow.
    const userAppliedSlices = new Set(ctx.appliedSlices);
    autoActivatePivotIfConfigured(ctx, userAppliedSlices, guards);
    autoPinGroupingColumns(ctx, userAppliedSlices);
    autoReorderAggregationColumns(ctx, userAppliedSlices, carry);
    ctx.setCarryState(carry);
  }

  return {
    id: 'data-grid-premium',
    api,
    snapshotState: () => snapshotState(apiRef),
    onPatchToolStop(ctx) {
      runPatchToolReconcile(ctx);
    },
    onCommandToolStop() {
      // No host-specific reconcile needed at runCommands tool stop today.
    },
    onAllToolsStop(ctx) {
      // End-of-turn second pass for envelopes that mixed setGridState + runCommands.
      runPatchToolReconcile(ctx);
    },
    getCarryState: () => carry,
    setCarryState: (next) => {
      carry = next as GridCopilotCarryState;
    },
  };
}
