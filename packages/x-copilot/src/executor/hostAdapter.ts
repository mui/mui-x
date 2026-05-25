import type {
  AppliedEntry,
  CopilotExecutionResult,
  JsonPatchOp,
  SlicePath,
  ToolName,
} from './types';

/**
 * The single seam between `@mui/x-copilot` and a host (Grid, Studio, ...).
 *
 * `TState` is whatever shape the host's state document takes; `TApi` is the
 * host's imperative API ref / object. `x-copilot` never introspects either —
 * it only routes them back into handler `ctx` and lifecycle hooks.
 */
export interface HostAdapter<TState = unknown, TApi = unknown> {
  /** Stable identifier (e.g. 'data-grid-premium', 'data-studio'). */
  readonly id: string;

  /** Imperative API the host exposes for commands and reconcilers to call. */
  readonly api: TApi;

  /** Capture a snapshot of the host's state as a plain document. */
  snapshotState(): TState;

  /** Optional data-query provider for `queryGridData`-style approval flows. */
  dataQuery?: HostDataQueryProvider;

  // ──────────────────────────────────────────────────────────────────────
  // Lifecycle hooks. All optional; called only if defined.
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Fired at `onToolStop(_, 'setGridState')`. Run the host's bulk
   * reconcile work here (e.g., auto-pivot activation, pinned-column
   * reorder, aggregation displacement restore).
   */
  onPatchToolStop?(ctx: ToolStopContext<TState, TApi>): void;

  /**
   * Fired at `onToolStop(_, 'runCommands')`. Lets the host run any
   * post-command reconciliation specific to its state model.
   */
  onCommandToolStop?(ctx: ToolStopContext<TState, TApi>): void;

  /**
   * Fired at end-of-turn `onAllToolsStop`. Final reconcile pass.
   */
  onAllToolsStop?(ctx: ToolStopContext<TState, TApi>): void;

  // ──────────────────────────────────────────────────────────────────────
  // Per-host carry state. Opaque to `x-copilot`; persisted across executor
  // instances by `useCopilot`. Used by the Grid for `displacedAggregationOrigins`.
  // ──────────────────────────────────────────────────────────────────────

  getCarryState?(): unknown;
  setCarryState?(state: unknown): void;
}

/** Context passed to the host's lifecycle hooks at tool-stop / all-tools-stop. */
export interface ToolStopContext<TState = unknown, TApi = unknown> {
  api: TApi;
  /**
   * Working doc at hook fire time. Read-only here — to mutate, call
   * `applyPatch` (immutable JSON Patch update) which both updates `doc` and
   * appends an entry into `results.applied`.
   */
  doc: TState;
  /** Snapshot at envelope start. */
  envelopeStartDoc: TState;
  /** Set of JSON Pointer paths applied this envelope. Hosts may add to it. */
  appliedSlices: Set<SlicePath>;
  /** Which tool just stopped. */
  toolName: ToolName;
  /** Current carry-state value. Mutate via setCarryState. */
  carryState: unknown;
  /** Update carry state for later in this turn or future turns. */
  setCarryState(next: unknown): void;
  /**
   * Append a synthetic applied entry (e.g. from a host-driven auto-X step
   * that already mutated the host's API without going through a patch).
   * Does NOT update `doc`; use `applyPatch` if subsequent auto-X steps must
   * see the new state.
   */
  appendApplied(entry: AppliedEntry): void;
  /**
   * Apply a synthetic patch to the executor's working `doc` AND append an
   * applied entry. Use this when a later auto-X step in the same hook needs
   * to read the post-mutation state via `ctx.doc`.
   */
  applyPatch(op: JsonPatchOp, description?: string): void;
  /** Read-only view of the running execution result. */
  readonly results: Readonly<CopilotExecutionResult>;
}

/**
 * Host data-query provider — the contract behind `queryGridData`-style flows.
 * Six responsibilities:
 *   1. Declare which tool name(s) trigger auto-execute.
 *   2. Validate the model's input shape.
 *   3. Preview the result without execution (for the approval card).
 *   4. Execute and produce the full client-side result.
 *   5. Redact the result down to what the backend should see.
 *   6. Hydrate cached results from persisted message parts on conversation reload.
 */
export interface HostDataQueryProvider<TInput = unknown, TResult = unknown> {
  /** Tool name(s) the approval-aware stream should auto-execute. */
  readonly toolNames: readonly string[];

  validateInput(raw: unknown): { ok: true; input: TInput } | { ok: false; reason: string };

  /** Sync today — matches `previewGridDataQuery`'s signature. */
  preview(input: TInput): unknown;

  /** Sync today — matches `executeGridDataQuery`'s signature. */
  execute(input: TInput): TResult;

  /**
   * Reduce a full result to what the backend sees. Defaults to pass-through.
   * The Grid uses this to strip rows down to `{meta, stateBinding}`.
   */
  redactForBackend?(result: TResult, toolCallId: string): unknown;

  /**
   * Replay results from persisted assistant-message tool parts.
   * Returns a map keyed by toolCallId.
   */
  hydrateFromMessage(parts: readonly unknown[]): ReadonlyMap<string, TResult>;
}
