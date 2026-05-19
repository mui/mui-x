export type {
  GuardKey,
  Guards,
  Phase,
  SlicePath,
  JsonPatchOp,
  ValidationResult,
  CommandNamespace,
  AppliedEntry,
  AppliedPatchEntry,
  AppliedCommandEntry,
  SkippedEntry,
  GridCopilotExecutionResult,
  ExecutorContext,
  PatchHandler,
  CommandHandler,
  GridCopilotEnvelope,
  ParsedLine,
} from './types';
export { ok, invalid } from './types';

export type { GridStateDocument, ChartSlice } from './stateDocument';
export { snapshotState } from './stateDocument';

export { buildGuards } from './guards';
export { applyJsonPatch, readAt, tokenize, decodePointerToken } from './jsonPatch';

export { buildPatchRegistry, ALL_PATCH_HANDLERS, type PatchRegistry } from './patchRegistry';
export {
  buildCommandRegistry,
  ALL_COMMAND_HANDLERS,
  type CommandRegistry,
} from './commandRegistry';

export { makeExecutor, type Executor, type ExecutorOptions, type ToolName } from './createExecutor';
export { promptResponseToPatches } from './promptResponseToPatches';
