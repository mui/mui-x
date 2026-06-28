'use client';
import type { RefObject } from '@mui/x-internals/types';
import type { ToolPartSlots } from '@mui/x-chat-headless';
import type { GridApiPremium } from '../../../../models/gridApiPremium';
import type { GridDataQueryResult } from '../executor/queryGridData';

/**
 * Runtime context handed to a Copilot plugin's `handleToolCall`.
 *
 * Plugins read the model-emitted `input`, optionally consult earlier
 * `queryResults`, then call `emitResult(output)` (or `emitError(text)`) to
 * transition the tool invocation to its terminal state in the chat stream.
 */
export interface CopilotPluginContext {
  /** Tool-call id from the streamed `tool-input-available` chunk. */
  toolCallId: string;
  /** The model-emitted tool name (matches one of `plugin.toolNames`). */
  toolName: string;
  /** Raw tool input emitted by the model. The plugin parses / validates it. */
  input: unknown;
  /**
   * Approved `queryGridData` results for this conversation, keyed by the
   * original tool-call id. Live reference — plugins should snapshot what
   * they need.
   */
  queryResults: ReadonlyMap<string, GridDataQueryResult>;
  /** Host grid `apiRef`. */
  apiRef: RefObject<GridApiPremium>;
  /** Active conversation id, if any. */
  conversationId: string | undefined;
  /** Write a `tool-output-available` chunk for this tool call. Silently no-ops if the writer is already closed. */
  emitResult(output: unknown): Promise<void>;
  /** Write a `tool-output-error` chunk for this tool call. Silently no-ops if the writer is already closed. */
  emitError(errorText: string): Promise<void>;
}

/**
 * A Copilot plugin extends the Data Grid Premium Copilot with one or more
 * client-side tools. Register via `<DataGridPremium copilotPlugins={[...]}>`.
 *
 * - `id`: stable string reported to the backend via `gridContext` or request
 *   metadata so the backend can conditionally register matching server-side
 *   tools with the model.
 * - `toolNames`: tool names this plugin claims. The grid's executor routes
 *   `tool-input-available` chunks whose `toolName` matches into the plugin's
 *   `handleToolCall` instead of letting them fall through unhandled.
 * - `handleToolCall`: client-side tool handler. Writes its own
 *   `tool-output-available` chunk into the chat stream when done.
 * - `toolSlots`: optional renderer overrides merged into the chat panel's
 *   `partProps.tool.toolSlots`. Keyed by tool name.
 */
export interface CopilotPlugin {
  readonly id: string;
  readonly toolNames: readonly string[];
  handleToolCall(ctx: CopilotPluginContext): Promise<void>;
  readonly toolSlots?: Readonly<Record<string, Partial<ToolPartSlots>>>;
}
