import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../../models/dataGridPremiumProps';
import type { GridStateDocument } from './stateDocument';

export type GuardKey =
  | 'filter'
  | 'sort'
  | 'grouping'
  | 'aggregation'
  | 'pivoting'
  | 'rowSelection'
  | 'chartsIntegration'
  | 'mutations';

export type Guards = Record<GuardKey, boolean>;

export type Phase = 'view' | 'pivot' | 'chart' | 'selection' | 'layout' | 'export' | 'history';

/**
 * Canonical slice path inside the GridStateDocument.
 *
 * `<id>` placeholders are used for dynamic keys, e.g. `/charts/<id>`.
 */
export type SlicePath = string;

export type JsonPatchOpKind = 'replace' | 'add' | 'remove' | 'move' | 'copy' | 'test';

export interface JsonPatchOp {
  op: JsonPatchOpKind;
  path: string;
  value?: unknown;
  /** Required only for `move`/`copy`. Validated and rejected at dispatch. */
  from?: string;
}

export type ValidationResult = { ok: true } | { ok: false; reason: string };

export const ok = (): ValidationResult => ({ ok: true });
export const invalid = (reason: string): ValidationResult => ({ ok: false, reason });

export type CommandNamespace =
  | 'history'
  | 'state'
  | 'view'
  | 'columns'
  | 'rows'
  | 'selection'
  | 'editing'
  | 'dataSource'
  | 'export';

export interface AppliedPatchEntry {
  kind: 'patch';
  line: string;
  path: SlicePath;
  description?: string;
}

export interface AppliedCommandEntry {
  kind: 'command';
  line: string;
  type: string;
  detail?: unknown;
  description?: string;
}

export type AppliedEntry = AppliedPatchEntry | AppliedCommandEntry;

export interface SkippedEntry {
  line: string;
  reason: 'malformed' | 'unknown' | 'disabled' | 'invalid' | 'threw';
  detail?: string;
}

export interface GridCopilotExecutionResult {
  applied: AppliedEntry[];
  skipped: SkippedEntry[];
}

export interface ExecutorContext {
  apiRef: RefObject<GridPrivateApiPremium>;
  props: DataGridPremiumProcessedProps;
  guards: Guards;
  doc: GridStateDocument;
  /** Slice paths whose reconciler has run in this batch. */
  appliedSlices: Set<SlicePath>;
  results: GridCopilotExecutionResult;
}

export interface PatchHandler {
  /** Canonical path for this slice — may contain `<id>` placeholders. */
  path: SlicePath;
  allowedOps: Array<'replace' | 'add' | 'remove'>;
  guard: GuardKey | null;
  phase: Phase;
  tier: 1 | 2 | 3;
  plan: 'community' | 'pro' | 'premium';
  validate?: (op: JsonPatchOp, doc: GridStateDocument, ctx: ExecutorContext) => ValidationResult;
  reconcile: (doc: GridStateDocument, op: JsonPatchOp, ctx: ExecutorContext) => unknown;
}

export interface CommandHandler<P = any> {
  type: string;
  namespace: CommandNamespace;
  tier: 1 | 2 | 3;
  plan: 'community' | 'pro' | 'premium';
  guard: GuardKey | null;
  phase: Phase;
  // Slice paths this command needs to be applied first. Empty = run immediately.
  dependsOn?: (params: P, ctx: ExecutorContext) => SlicePath[];
  validate?: (params: P, ctx: ExecutorContext) => ValidationResult;
  run: (params: P, ctx: ExecutorContext) => unknown;
}

/** JSONL envelope used by the synchronous `applyEnvelope` entry point. */
export interface GridCopilotEnvelope {
  setGridState?: string;
  runCommands?: string;
}

/** A single line read from a tool's JSONL input. */
export interface ParsedLine<T = unknown> {
  raw: string;
  parsed: T;
}
