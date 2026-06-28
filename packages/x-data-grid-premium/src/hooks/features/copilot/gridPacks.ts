import type {
  CommandPack,
  PatchPack,
  ExecutorContext as XCopilotExecutorContext,
} from '@mui/x-copilot';
import type {
  CommandHandler,
  ExecutorContext,
  Guards as GridGuards,
  PatchHandler,
} from './executor/types';
import { ALL_COMMAND_HANDLERS } from './executor/commandRegistry';
import { ALL_PATCH_HANDLERS } from './executor/patchRegistry';
import type { GridHostAdapter } from './gridHostAdapter';
import type { GridStateDocument } from './executor/stateDocument';

type XCtx = XCopilotExecutorContext<GridHostAdapter, GridStateDocument>;

/**
 * Bridge x-copilot's generic ExecutorContext (which carries `adapter.api`) to
 * Grid's executor context shape (which carries `apiRef` and `props` directly).
 * Lets the existing handler bodies live unchanged.
 */
function toGridCtx(xCtx: XCtx): ExecutorContext {
  return {
    apiRef: xCtx.adapter.api.apiRef,
    props: xCtx.adapter.api.props,
    // Grid's `Guards` is fully required; x-copilot's is `Partial<Record<...>>`.
    // The Grid host adapter always passes a fully-populated map produced by
    // `buildGuards`, so this widening is safe in practice.
    guards: xCtx.guards as GridGuards,
    doc: xCtx.doc,
    appliedSlices: xCtx.appliedSlices,
    results: xCtx.results,
  };
}

function wrapPatchHandler(h: PatchHandler) {
  return {
    path: h.path,
    allowedOps: h.allowedOps,
    guard: h.guard,
    phase: h.phase,
    tier: h.tier,
    plan: h.plan,
    validate: h.validate
      ? (op: any, doc: GridStateDocument, xCtx: XCtx) => h.validate!(op, doc, toGridCtx(xCtx))
      : undefined,
    reconcile: (doc: GridStateDocument, op: any, xCtx: XCtx) =>
      h.reconcile(doc, op, toGridCtx(xCtx)),
  };
}

function wrapCommandHandler(h: CommandHandler) {
  return {
    type: h.type,
    namespace: h.namespace,
    tier: h.tier,
    plan: h.plan,
    guard: h.guard,
    phase: h.phase,
    dependsOn: h.dependsOn
      ? (params: any, xCtx: XCtx) => h.dependsOn!(params, toGridCtx(xCtx))
      : undefined,
    validate: h.validate
      ? (params: any, xCtx: XCtx) => h.validate!(params, toGridCtx(xCtx))
      : undefined,
    run: (params: any, xCtx: XCtx) => h.run(params, toGridCtx(xCtx)),
  };
}

/**
 * The Grid's command pack. Wraps every command file in `executor/commands/`
 * into the x-copilot pack shape without changing handler bodies.
 */
export const gridCommandPack: CommandPack<GridHostAdapter, GridStateDocument> = {
  id: 'data-grid-premium',
  handlers: ALL_COMMAND_HANDLERS.map(wrapCommandHandler),
};

/**
 * The Grid's reconciler pack. Wraps every reconciler in `executor/reconcilers/`.
 */
export const gridReconcilerPack: PatchPack<GridHostAdapter, GridStateDocument> = {
  id: 'data-grid-premium',
  handlers: ALL_PATCH_HANDLERS.map(wrapPatchHandler),
};
