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

  const guards: Guards = buildGuards(props);
  const patchRegistry: PatchRegistry = buildPatchRegistry(guards);
  const commandRegistry: CommandRegistry = buildCommandRegistry(guards);

  let doc: GridStateDocument = snapshotState(apiRef);
  let appliedSlices = new Set<SlicePath>();
  let results: GridCopilotExecutionResult = { applied: [], skipped: [] };
  let deferredCommands: DeferredCommand[] = [];
  let setGridStateActive = false;
  const seen = new Set<string>();
  const buffers: Record<number, string> = {};

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
      autoActivatePivotIfConfigured();
      drainDeferred();
    }
  }

  function onAllToolsStop(): void {
    setGridStateActive = false;
    autoActivatePivotIfConfigured();
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
