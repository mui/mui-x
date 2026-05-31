import type { HostAdapter } from './hostAdapter';
import type {
  CommandNamespace,
  CopilotExecutionResult,
  GuardKey,
  Guards,
  JsonPatchOp,
  Phase,
  SlicePath,
  ValidationResult,
} from './types';

/**
 * Context passed to every patch reconciler and command runner. Mirrors the
 * shape today's Grid `ExecutorContext` exposes, with `adapter` replacing the
 * concrete `apiRef`+`props` pair.
 */
export interface ExecutorContext<TAdapter extends HostAdapter = HostAdapter, TState = unknown> {
  adapter: TAdapter;
  guards: Guards;
  /** Live working document mutated by patches in this envelope. */
  doc: TState;
  /** Snapshot at envelope start. */
  envelopeStartDoc: TState;
  /** Slice paths whose reconciler has run in this envelope. */
  appliedSlices: Set<SlicePath>;
  /** Mutated as entries are produced; exposed via `executor.results`. */
  results: CopilotExecutionResult;
  /** Host carry state (read-only view; mutate via adapter.setCarryState). */
  carryState: unknown;
}

export interface PatchHandler<TAdapter extends HostAdapter = HostAdapter, TState = unknown> {
  /** JSON Pointer or wildcard pattern (`<id>` placeholders allowed). */
  path: SlicePath;
  allowedOps: Array<'replace' | 'add' | 'remove'>;
  guard: GuardKey | null;
  phase: Phase;
  tier: 1 | 2 | 3;
  plan: 'community' | 'pro' | 'premium';
  validate?: (
    op: JsonPatchOp,
    doc: TState,
    ctx: ExecutorContext<TAdapter, TState>,
  ) => ValidationResult;
  /**
   * Apply the patch to the host's API. Matches today's `reconcile` field.
   * @param doc
   * @param op
   * @param ctx
   */
  reconcile: (doc: TState, op: JsonPatchOp, ctx: ExecutorContext<TAdapter, TState>) => unknown;
}

export interface CommandHandler<
  TAdapter extends HostAdapter = HostAdapter,
  TState = unknown,
  P = any,
> {
  type: string;
  namespace: CommandNamespace;
  tier: 1 | 2 | 3;
  plan: 'community' | 'pro' | 'premium';
  guard: GuardKey | null;
  phase: Phase;
  /**
   * Slice paths this command must observe before running.
   * Consulted at dispatch (during streaming) and at deferred-drain.
   * @param params
   * @param ctx
   */
  dependsOn?: (params: P, ctx: ExecutorContext<TAdapter, TState>) => SlicePath[];
  validate?: (params: P, ctx: ExecutorContext<TAdapter, TState>) => ValidationResult;
  /**
   * Run the command. Matches today's `run` field.
   * @param params
   * @param ctx
   */
  run: (params: P, ctx: ExecutorContext<TAdapter, TState>) => unknown;
}

export interface CommandPack<TAdapter extends HostAdapter = HostAdapter, TState = unknown> {
  readonly id: string;
  readonly handlers: ReadonlyArray<CommandHandler<TAdapter, TState>>;
  /** Pack IDs whose handlers may be replaced without a dev warning. */
  readonly overrides?: readonly string[];
}

export interface PatchPack<TAdapter extends HostAdapter = HostAdapter, TState = unknown> {
  readonly id: string;
  readonly handlers: ReadonlyArray<PatchHandler<TAdapter, TState>>;
  readonly overrides?: readonly string[];
  /**
   * Optional JSON Pointer prefix applied to every handler's `path` at build time.
   * Required when composing this pack into a host with a sub-tree state shape.
   */
  readonly pathPrefix?: SlicePath;
}
