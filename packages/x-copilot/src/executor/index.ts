// Types
export type {
  BuiltInGuardKey,
  GuardKey,
  Guards,
  BuiltInPhase,
  Phase,
  BuiltInCommandNamespace,
  CommandNamespace,
  ToolName,
  SlicePath,
  JsonPatchOpKind,
  JsonPatchOp,
  ValidationResult,
  AppliedPatchEntry,
  AppliedCommandEntry,
  AppliedEntry,
  SkippedEntry,
  CopilotExecutionResult,
  CopilotEnvelope,
  ParsedLine,
} from './types';
export { ok, invalid } from './types';

// Host adapter contract
export type { HostAdapter, ToolStopContext, HostDataQueryProvider } from './hostAdapter';

// Handler types
export type {
  ExecutorContext,
  PatchHandler,
  CommandHandler,
  CommandPack,
  PatchPack,
} from './handlers';

// JSON Patch
export { applyJsonPatch, readAt, tokenize, decodePointerToken } from './jsonPatch';

// Registries
export { buildCommandRegistry, type CommandRegistry } from './commandRegistry';
export { buildPatchRegistry, type PatchRegistry } from './patchRegistry';

// Executor
export { makeExecutor, type Executor, type ExecutorOptions } from './createExecutor';
