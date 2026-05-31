import type { HostAdapter, ToolStopContext } from './hostAdapter';
import type { CommandHandler, ExecutorContext } from './handlers';
import type {
  CopilotEnvelope,
  CopilotExecutionResult,
  Guards,
  JsonPatchOp,
  SkippedEntry,
  SlicePath,
  ToolName,
} from './types';
import { applyJsonPatch } from './jsonPatch';
import type { CommandRegistry } from './commandRegistry';
import type { PatchRegistry } from './patchRegistry';

export interface ExecutorOptions<TAdapter extends HostAdapter, TState = unknown> {
  adapter: TAdapter;
  guards: Guards;
  commandRegistry: CommandRegistry<TAdapter, TState>;
  patchRegistry: PatchRegistry<TAdapter, TState>;
  /**
   * Optional progress callback invoked after every dispatched line.
   * @param result
   */
  onProgress?: (result: CopilotExecutionResult) => void;
}

export interface Executor {
  readonly results: CopilotExecutionResult;
  pushChunk(toolIndex: number, toolName: ToolName, chunk: string): void;
  onToolStop(toolIndex: number, toolName: ToolName): void;
  onAllToolsStop(): void;
  /** Synchronous entry point for tests and programmatic use. */
  applyEnvelope(envelope: CopilotEnvelope): CopilotExecutionResult;
  /** Reset all per-batch state. Carry state persists via the adapter. */
  reset(): void;
}

interface DeferredCommand<TAdapter extends HostAdapter, TState> {
  line: string;
  cmd: { type: string; params?: any };
  handler: CommandHandler<TAdapter, TState>;
  needs: SlicePath[];
}

/**
 * Generic streaming executor. Dispatches JSON Patch ops and commands against
 * a host-supplied state document via reconciler/command packs. Three
 * lifecycle hooks on the HostAdapter let the host run domain-specific
 * post-reconcile work without touching the dispatch loop.
 */
export function makeExecutor<TAdapter extends HostAdapter, TState = unknown>(
  options: ExecutorOptions<TAdapter, TState>,
): Executor {
  const { adapter, guards, commandRegistry, patchRegistry, onProgress } = options;

  let doc: TState = adapter.snapshotState() as TState;
  let appliedSlices = new Set<SlicePath>();
  let results: CopilotExecutionResult = { applied: [], skipped: [] };
  let deferredCommands: DeferredCommand<TAdapter, TState>[] = [];
  let setGridStateActive = false;
  let envelopeStartDoc: TState | null = null;
  const seen = new Set<string>();
  const buffers: Record<number, string> = {};

  function getCarry(): unknown {
    return adapter.getCarryState ? adapter.getCarryState() : undefined;
  }

  function setCarry(next: unknown): void {
    adapter.setCarryState?.(next);
  }

  function getCtx(): ExecutorContext<TAdapter, TState> {
    return {
      adapter,
      guards,
      doc,
      envelopeStartDoc: (envelopeStartDoc ?? doc) as TState,
      appliedSlices,
      results,
      carryState: getCarry(),
    };
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

    let nextDoc: TState;
    try {
      nextDoc = applyJsonPatch(doc, parsed);
    } catch (err) {
      skip(line, { reason: 'invalid', detail: String((err as Error).message ?? err) });
      return;
    }

    if (handler.validate) {
      const ctx: ExecutorContext<TAdapter, TState> = { ...getCtx(), doc: nextDoc };
      const result = handler.validate(parsed, nextDoc, ctx);
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

  function tryRunCommand(deferred: DeferredCommand<TAdapter, TState>): void {
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
    // Defer only while the setGridState tool is still streaming.
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

  function drainDeferred(): void {
    if (deferredCommands.length === 0) {
      return;
    }
    const remaining: DeferredCommand<TAdapter, TState>[] = [];
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

  function buildToolStopCtx(toolName: ToolName): ToolStopContext<TState, unknown> {
    return {
      api: adapter.api,
      // `doc` is a getter so the host always reads the executor's current
      // working doc even after applyPatch mutates it mid-hook.
      get doc() {
        return doc;
      },
      envelopeStartDoc: (envelopeStartDoc ?? doc) as TState,
      appliedSlices,
      toolName,
      carryState: getCarry(),
      setCarryState: setCarry,
      appendApplied(entry) {
        results.applied.push(entry);
        if (entry.kind === 'patch') {
          appliedSlices.add(entry.path);
        }
        onProgress?.(results);
      },
      applyPatch(op, description) {
        try {
          doc = applyJsonPatch(doc, op);
        } catch {
          // ignore — host can still log via appendApplied
        }
        appliedSlices.add(op.path);
        results.applied.push({
          kind: 'patch',
          line: '<auto>',
          path: op.path,
          description,
        });
        onProgress?.(results);
      },
      results,
    };
  }

  function onToolStop(toolIndex: number, toolName: ToolName): void {
    const tail = (buffers[toolIndex] ?? '').trim();
    buffers[toolIndex] = '';
    if (tail) {
      pushLine(toolName, tail);
    }
    if (toolName === 'setGridState') {
      setGridStateActive = false;
      adapter.onPatchToolStop?.(buildToolStopCtx(toolName));
      drainDeferred();
    } else if (toolName === 'runCommands') {
      adapter.onCommandToolStop?.(buildToolStopCtx(toolName));
    }
  }

  function onAllToolsStop(): void {
    setGridStateActive = false;
    adapter.onAllToolsStop?.(buildToolStopCtx('setGridState'));
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

  function applyEnvelope(envelope: CopilotEnvelope): CopilotExecutionResult {
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
    doc = adapter.snapshotState() as TState;
    appliedSlices = new Set();
    results = { applied: [], skipped: [] };
    deferredCommands = [];
    seen.clear();
    Object.keys(buffers).forEach((key) => {
      delete buffers[Number(key)];
    });
    setGridStateActive = false;
    envelopeStartDoc = null;
    // Carry state intentionally NOT cleared — persists across instances via the adapter.
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
