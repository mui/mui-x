import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../../models/dataGridPremiumProps';
import type {
  CommandHandler,
  ExecutorContext,
  GridCopilotEnvelope,
  GridCopilotExecutionResult,
  Guards,
  JsonPatchOp,
  SkippedEntry,
  SlicePath,
} from './types';
import { buildGuards } from './guards';
import { snapshotState, type GridStateDocument } from './stateDocument';
import { applyJsonPatch } from './jsonPatch';
import { buildPatchRegistry, type PatchRegistry } from './patchRegistry';
import { buildCommandRegistry, type CommandRegistry } from './commandRegistry';

export type ToolName = 'setGridState' | 'runCommands';

export interface ExecutorOptions {
  apiRef: RefObject<GridPrivateApiPremium>;
  props: DataGridPremiumProcessedProps;
  // Optional progress callback invoked after every dispatched line.
  onProgress?: (result: GridCopilotExecutionResult) => void;
  // Optional shared map for tracking the original column index of fields
  // displaced into the aggregation slot. Pass a stable instance across
  // executor lifetimes (e.g. from a parent hook) so restore-on-unaggregate
  // works across turns; defaults to a fresh map if omitted.
  displacedAggregationOrigins?: Map<string, number>;
}

export interface Executor {
  readonly results: GridCopilotExecutionResult;
  pushChunk(toolIndex: number, toolName: ToolName, chunk: string): void;
  onToolStop(toolIndex: number, toolName: ToolName): void;
  onAllToolsStop(): void;
  /** Synchronous entry point for the legacy adapter and tests. */
  applyEnvelope(envelope: GridCopilotEnvelope): GridCopilotExecutionResult;
  /** Reset all per-batch state. */
  reset(): void;
}

interface DeferredCommand {
  line: string;
  cmd: { type: string; params?: any };
  handler: CommandHandler;
  needs: SlicePath[];
}

export function makeExecutor(options: ExecutorOptions): Executor {
  const { apiRef, props, onProgress } = options;
  const displacedAggregationOrigins =
    options.displacedAggregationOrigins ?? new Map<string, number>();

  const guards: Guards = buildGuards(props);
  const patchRegistry: PatchRegistry = buildPatchRegistry(guards);
  const commandRegistry: CommandRegistry = buildCommandRegistry(guards);

  let doc: GridStateDocument = snapshotState(apiRef);
  let appliedSlices = new Set<SlicePath>();
  let results: GridCopilotExecutionResult = { applied: [], skipped: [] };
  let deferredCommands: DeferredCommand[] = [];
  let setGridStateActive = false;
  let envelopeStartDoc: GridStateDocument | null = null;
  // `displacedAggregationOrigins` records the original column index of every
  // field we displaced into the leading "aggregation" slot, so we can restore
  // it once the field exits the aggregation model. Shared across executor
  // instances via `options.displacedAggregationOrigins` so the restore still
  // works after a fresh executor is constructed on a later turn.
  const seen = new Set<string>();
  const buffers: Record<number, string> = {};

  const GROUPING_FIELD_PREFIX = '__row_group_by_columns_group';

  function getCtx(): ExecutorContext {
    return { apiRef, props, guards, doc, appliedSlices, results };
  }

  function skip(line: string, entry: Omit<SkippedEntry, 'line'>): void {
    results.skipped.push({ line, ...entry });
    onProgress?.(results);
  }

  function isJsonPatchOp(candidate: unknown): candidate is JsonPatchOp {
    if (typeof candidate !== 'object' || candidate === null) {
      return false;
    }
    const c = candidate as { op?: unknown; path?: unknown };
    return typeof c.op === 'string' && typeof c.path === 'string';
  }

  function dispatchPatch(parsed: unknown, line: string): void {
    if (!isJsonPatchOp(parsed)) {
      skip(line, { reason: 'invalid', detail: 'not a JSON Patch op' });
      return;
    }
    if (parsed.op === 'move' || parsed.op === 'copy' || parsed.op === 'test') {
      skip(line, { reason: 'invalid', detail: `op '${parsed.op}' is not allowed` });
      return;
    }
    if (parsed.op !== 'replace' && parsed.op !== 'add' && parsed.op !== 'remove') {
      skip(line, { reason: 'invalid', detail: `unknown op '${parsed.op}'` });
      return;
    }

    const handler = patchRegistry.resolve(parsed.path);
    if (!handler) {
      skip(line, { reason: 'unknown', detail: `no handler for '${parsed.path}'` });
      return;
    }
    if (!handler.allowedOps.includes(parsed.op)) {
      skip(line, {
        reason: 'invalid',
        detail: `op '${parsed.op}' is not allowed at '${handler.path}'`,
      });
      return;
    }
    if (handler.guard && !guards[handler.guard]) {
      skip(line, { reason: 'disabled', detail: `${handler.guard} is disabled` });
      return;
    }

    let nextDoc: GridStateDocument;
    try {
      nextDoc = applyJsonPatch(doc, parsed);
    } catch (err) {
      skip(line, { reason: 'invalid', detail: String((err as Error).message ?? err) });
      return;
    }

    if (handler.validate) {
      const ctx = { ...getCtx(), doc: nextDoc };
      const result = handler.validate(parsed, nextDoc, ctx as ExecutorContext);
      if (!result.ok) {
        skip(line, { reason: 'invalid', detail: result.reason });
        return;
      }
    }

    doc = nextDoc;
    const ctx = getCtx();
    try {
      handler.reconcile(doc, parsed, ctx);
      appliedSlices.add(handler.path);
      results.applied.push({ kind: 'patch', line, path: handler.path });
      onProgress?.(results);
    } catch (err) {
      skip(line, { reason: 'threw', detail: String((err as Error).message ?? err) });
    }
  }

  function isCommand(candidate: unknown): candidate is { type: string; params?: any } {
    if (typeof candidate !== 'object' || candidate === null) {
      return false;
    }
    return typeof (candidate as { type?: unknown }).type === 'string';
  }

  function tryRunCommand(deferred: DeferredCommand): void {
    const ctx = getCtx();
    if (deferred.handler.validate) {
      const v = deferred.handler.validate(deferred.cmd.params, ctx);
      if (!v.ok) {
        skip(deferred.line, { reason: 'invalid', detail: v.reason });
        return;
      }
    }
    try {
      const detail = deferred.handler.run(deferred.cmd.params, ctx);
      results.applied.push({
        kind: 'command',
        line: deferred.line,
        type: deferred.cmd.type,
        detail,
      });
      onProgress?.(results);
    } catch (err) {
      skip(deferred.line, { reason: 'threw', detail: String((err as Error).message ?? err) });
    }
  }

  function hasPendingPatchesFor(_paths: SlicePath[]): boolean {
    // Defer only while the setGridState tool is still streaming. A more
    // precise impl could inspect buffered lines for matching paths.
    return setGridStateActive;
  }

  function dispatchCommand(parsed: unknown, line: string): void {
    if (!isCommand(parsed)) {
      skip(line, { reason: 'invalid', detail: 'not a command' });
      return;
    }
    const handler = commandRegistry.resolve(parsed.type);
    if (!handler) {
      skip(line, { reason: 'unknown', detail: `unknown command '${parsed.type}'` });
      return;
    }
    if (handler.guard && !guards[handler.guard]) {
      skip(line, { reason: 'disabled', detail: `${handler.guard} is disabled` });
      return;
    }

    const ctx = getCtx();
    const needs = handler.dependsOn ? handler.dependsOn(parsed.params, ctx) : [];
    const unmet = needs.filter((p) => p && !appliedSlices.has(p));
    if (unmet.length > 0 && hasPendingPatchesFor(unmet)) {
      deferredCommands.push({ line, cmd: parsed, handler, needs: unmet });
      return;
    }
    tryRunCommand({ line, cmd: parsed, handler, needs: unmet });
  }

  function autoActivatePivotIfConfigured(): void {
    if (!guards.pivoting) {
      return;
    }
    if (appliedSlices.has('/pivot') || appliedSlices.has('/pivot/active')) {
      return;
    }
    if (!appliedSlices.has('/pivot/model')) {
      return;
    }
    if (doc.pivot.active) {
      return;
    }
    const model = doc.pivot.model;
    const hasEntries = model.rows.length > 0 || model.columns.length > 0 || model.values.length > 0;
    if (!hasEntries) {
      return;
    }
    apiRef.current.setPivotActive(true);
    doc = { ...doc, pivot: { ...doc.pivot, active: true } };
    appliedSlices.add('/pivot/active');
    results.applied.push({
      kind: 'patch',
      line: '<auto>',
      path: '/pivot/active',
      description: 'auto-activated because /pivot/model was configured',
    });
    onProgress?.(results);
  }

  // Pin every grouping column to the left whenever /grouping changes. Unpins
  // them when grouping clears. Skipped if the LLM explicitly set
  // /columns/pinned in the same envelope.
  function autoPinGroupingColumns(userAppliedSlices: Set<SlicePath>): void {
    if (!userAppliedSlices.has('/grouping')) {
      return;
    }
    if (
      userAppliedSlices.has('/columns/pinned') ||
      userAppliedSlices.has('/columns/pinned/<side>')
    ) {
      return;
    }

    const liveOrder = apiRef.current.state.columns?.orderedFields ?? [];
    const currentPinnedLeft = doc.columns.pinned.left ?? [];
    const right = doc.columns.pinned.right ?? [];

    let desired: string[];
    let description: string;
    if (doc.grouping.length > 0) {
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

    apiRef.current.setPinnedColumns({ left: desired, right });
    doc = {
      ...doc,
      columns: { ...doc.columns, pinned: { left: desired, right } },
    };
    appliedSlices.add('/columns/pinned');
    results.applied.push({
      kind: 'patch',
      line: '<auto>',
      path: '/columns/pinned',
      description,
    });
    onProgress?.(results);
  }

  // Move freshly-aggregated columns to the start of the unpinned region, and
  // restore previously-displaced columns when they exit the aggregation model.
  // Skipped if the LLM explicitly set /columns/order in the same envelope.
  function autoReorderAggregationColumns(userAppliedSlices: Set<SlicePath>): void {
    if (!userAppliedSlices.has('/aggregation')) {
      return;
    }
    if (userAppliedSlices.has('/columns/order')) {
      return;
    }
    if (!envelopeStartDoc) {
      return;
    }

    const prevAgg = envelopeStartDoc.aggregation ?? {};
    const nextAgg = doc.aggregation ?? {};
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

    const liveOrderBefore = apiRef.current.state.columns?.orderedFields ?? [];
    const pinnedLeftCount = (doc.columns.pinned.left ?? []).length;

    // Idempotency for additions: if `added` is already sitting at the head of
    // the unpinned region in the right order, skip the moves.
    const headSlice = liveOrderBefore.slice(pinnedLeftCount, pinnedLeftCount + added.length);
    const addedAlreadyCorrect = added.length > 0 && added.every((f, i) => headSlice[i] === f);

    // Record origins for each added field BEFORE moving anything, so the
    // recorded indices reflect the pre-auto-move state.
    if (!addedAlreadyCorrect) {
      added.forEach((field) => {
        if (!displacedAggregationOrigins.has(field)) {
          const idx = liveOrderBefore.indexOf(field);
          if (idx >= 0) {
            displacedAggregationOrigins.set(field, idx);
          }
        }
      });
    }

    const movedFields: string[] = [];
    if (!addedAlreadyCorrect) {
      // Iterate in reverse so added[0] ends up at pinnedLeftCount, added[1] at
      // pinnedLeftCount+1, etc.
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
      const origIdx = displacedAggregationOrigins.get(field);
      if (origIdx === undefined) {
        return;
      }
      const currentIdx = apiRef.current.state.columns?.orderedFields?.indexOf(field) ?? -1;
      if (currentIdx === origIdx) {
        displacedAggregationOrigins.delete(field);
        return;
      }
      try {
        apiRef.current.setColumnIndex(field, origIdx);
        restoredFields.push(field);
        displacedAggregationOrigins.delete(field);
      } catch {
        // ignore
      }
    });

    if (movedFields.length === 0 && restoredFields.length === 0) {
      return;
    }

    const newOrder = apiRef.current.state.columns?.orderedFields ?? doc.columns.order;
    doc = { ...doc, columns: { ...doc.columns, order: newOrder } };
    appliedSlices.add('/columns/order');

    if (movedFields.length > 0) {
      results.applied.push({
        kind: 'patch',
        line: '<auto>',
        path: '/columns/order',
        description: `auto-moved aggregated columns to start: ${movedFields.join(', ')}`,
      });
    }
    if (restoredFields.length > 0) {
      results.applied.push({
        kind: 'patch',
        line: '<auto>',
        path: '/columns/order',
        description: `auto-restored columns to original position: ${restoredFields.join(', ')}`,
      });
    }
    onProgress?.(results);
  }

  function drainDeferred(): void {
    if (deferredCommands.length === 0) {
      return;
    }
    const remaining: DeferredCommand[] = [];
    const stillStreaming = setGridStateActive;
    deferredCommands.forEach((d) => {
      const unmet = d.needs.filter((p) => !appliedSlices.has(p));
      if (unmet.length === 0 || !stillStreaming) {
        tryRunCommand(d);
      } else {
        remaining.push(d);
      }
    });
    deferredCommands = remaining;
  }

  function pushLine(toolName: ToolName, line: string): void {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }
    if (seen.has(trimmed)) {
      return;
    }
    seen.add(trimmed);

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      skip(trimmed, { reason: 'malformed' });
      return;
    }

    if (toolName === 'setGridState') {
      dispatchPatch(parsed, trimmed);
      drainDeferred();
    } else {
      dispatchCommand(parsed, trimmed);
    }
  }

  function pushChunk(toolIndex: number, toolName: ToolName, chunk: string): void {
    if (toolName === 'setGridState') {
      if (envelopeStartDoc === null) {
        envelopeStartDoc = doc;
      }
      setGridStateActive = true;
    }
    const previous = buffers[toolIndex] ?? '';
    const buffer = previous + chunk;
    buffers[toolIndex] = buffer;
    const lines = buffer.split('\n');
    buffers[toolIndex] = lines.pop() ?? '';
    lines.forEach((raw) => pushLine(toolName, raw));
  }

  function onToolStop(toolIndex: number, toolName: ToolName): void {
    const tail = (buffers[toolIndex] ?? '').trim();
    buffers[toolIndex] = '';
    if (tail) {
      pushLine(toolName, tail);
    }
    if (toolName === 'setGridState') {
      setGridStateActive = false;
      const userAppliedSlices = new Set(appliedSlices);
      autoActivatePivotIfConfigured();
      autoPinGroupingColumns(userAppliedSlices);
      autoReorderAggregationColumns(userAppliedSlices);
      drainDeferred();
    }
  }

  function onAllToolsStop(): void {
    setGridStateActive = false;
    const userAppliedSlices = new Set(appliedSlices);
    autoActivatePivotIfConfigured();
    autoPinGroupingColumns(userAppliedSlices);
    autoReorderAggregationColumns(userAppliedSlices);
    drainDeferred();
    const finalized = deferredCommands;
    deferredCommands = [];
    finalized.forEach((d) => {
      const unmet = d.needs.filter((p) => !appliedSlices.has(p));
      if (unmet.length > 0) {
        skip(d.line, {
          reason: 'invalid',
          detail: `waiting on slices that never landed: ${unmet.join(', ')}`,
        });
      } else {
        tryRunCommand(d);
      }
    });
    envelopeStartDoc = null;
  }

  function applyEnvelope(envelope: GridCopilotEnvelope): GridCopilotExecutionResult {
    if (typeof envelope.setGridState === 'string' && envelope.setGridState) {
      pushChunk(0, 'setGridState', envelope.setGridState);
      onToolStop(0, 'setGridState');
    }
    if (typeof envelope.runCommands === 'string' && envelope.runCommands) {
      pushChunk(1, 'runCommands', envelope.runCommands);
      onToolStop(1, 'runCommands');
    }
    onAllToolsStop();
    return results;
  }

  function reset(): void {
    doc = snapshotState(apiRef);
    appliedSlices = new Set();
    results = { applied: [], skipped: [] };
    deferredCommands = [];
    seen.clear();
    Object.keys(buffers).forEach((key) => {
      delete buffers[Number(key)];
    });
    setGridStateActive = false;
    envelopeStartDoc = null;
    // `displacedAggregationOrigins` is intentionally not cleared — it may be
    // shared with other executor instances via `options.displacedAggregationOrigins`.
  }

  return {
    get results() {
      return results;
    },
    pushChunk,
    onToolStop,
    onAllToolsStop,
    applyEnvelope,
    reset,
  };
}
