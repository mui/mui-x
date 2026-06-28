/**
 * Built-in guard keys recognized by the registries. Hosts may add more keys to
 * the `Guards` map; only handlers that declare a guard listed here are
 * filtered out when the flag is false.
 */
export type BuiltInGuardKey =
  | 'filter'
  | 'sort'
  | 'grouping'
  | 'aggregation'
  | 'pivoting'
  | 'rowSelection'
  | 'chartsIntegration'
  | 'mutations';

/** Open-ended guard key — hosts can extend the union by augmenting this type. */
export type GuardKey = BuiltInGuardKey | (string & {});

/** Flag map evaluated against each handler's `guard` field. */
export type Guards = Partial<Record<GuardKey, boolean>>;

/** Built-in domain phases. Hosts may extend by augmenting this type. */
export type BuiltInPhase = 'view' | 'pivot' | 'chart' | 'selection' | 'layout' | 'export' | 'history';
export type Phase = BuiltInPhase | (string & {});

/** Built-in command namespaces. Hosts may extend by augmenting this type. */
export type BuiltInCommandNamespace =
  | 'history'
  | 'state'
  | 'view'
  | 'columns'
  | 'rows'
  | 'selection'
  | 'editing'
  | 'dataSource'
  | 'export';
export type CommandNamespace = BuiltInCommandNamespace | (string & {});

/** Tool names the executor recognizes on the wire. */
export type ToolName = 'setGridState' | 'runCommands';

/** Canonical slice path inside the host state document. JSON Pointer string. */
export type SlicePath = string;

export type JsonPatchOpKind = 'replace' | 'add' | 'remove' | 'move' | 'copy' | 'test';

export interface JsonPatchOp {
  op: JsonPatchOpKind;
  path: string;
  value?: unknown;
  /** Required only for `move`/`copy`. */
  from?: string;
}

export type ValidationResult = { ok: true } | { ok: false; reason: string };

export const ok = (): ValidationResult => ({ ok: true });
export const invalid = (reason: string): ValidationResult => ({ ok: false, reason });

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

/** Result of executing a single envelope (or a streamed turn). */
export interface CopilotExecutionResult {
  applied: AppliedEntry[];
  skipped: SkippedEntry[];
}

/** Envelope shape parsed from the model's tool inputs. */
export interface CopilotEnvelope {
  setGridState?: string;
  runCommands?: string;
}

/** A single line read from a tool's JSONL input. */
export interface ParsedLine<T = unknown> {
  raw: string;
  parsed: T;
}
