'use client';
import type { ToolPartSlots } from '@mui/x-chat-headless';

/**
 * Runtime context handed to a Copilot plugin's `handleToolCall`.
 *
 * Generic over the host's API type (`TApi`) and the host's data-query result
 * type (`TQueryResult`). A host (Grid, Studio, …) re-exports a typed alias
 * with concrete generics so plugin authors don't have to restate them.
 *
 * Plugins read the model-emitted `input`, optionally consult earlier
 * `queryResults`, then call `emitResult(output)` (or `emitError(text)`) to
 * transition the tool invocation to its terminal state in the chat stream.
 */
export interface CopilotPluginContext<TApi = unknown, TQueryResult = unknown> {
  /** Tool-call id from the streamed `tool-input-available` chunk. */
  toolCallId: string;
  /** The model-emitted tool name (matches one of `plugin.toolNames`). */
  toolName: string;
  /** Raw tool input emitted by the model. The plugin parses / validates it. */
  input: unknown;
  /**
   * Approved data-query results for this conversation, keyed by the original
   * tool-call id. Live reference — plugins should snapshot what they need.
   */
  queryResults: ReadonlyMap<string, TQueryResult>;
  /** Host's imperative API (Grid: `RefObject<GridApiPremium>`; Studio: its own façade). */
  api: TApi;
  /** Active conversation id, if any. */
  conversationId: string | undefined;
  /** Write a `tool-output-available` chunk for this tool call. */
  emitResult(output: unknown): Promise<void>;
  /** Write a `tool-output-error` chunk for this tool call. */
  emitError(errorText: string): Promise<void>;
}

/**
 * A Copilot plugin extends the host's Copilot with one or more client-side tools.
 *
 * - `id`: stable string reported to the backend so it can conditionally register
 *   matching server-side tools with the model.
 * - `toolNames`: tool names this plugin claims. The host's executor routes
 *   `tool-input-available` chunks whose `toolName` matches into the plugin's
 *   `handleToolCall` instead of letting them fall through unhandled.
 * - `handleToolCall`: client-side tool handler. Writes its own
 *   `tool-output-available` chunk into the chat stream when done.
 * - `toolSlots`: optional renderer overrides merged into the chat panel's
 *   `partProps.tool.toolSlots`. Keyed by tool name.
 */
export interface CopilotPlugin<TApi = unknown, TQueryResult = unknown> {
  readonly id: string;
  readonly toolNames: readonly string[];
  handleToolCall(ctx: CopilotPluginContext<TApi, TQueryResult>): Promise<void>;
  readonly toolSlots?: Readonly<Record<string, Partial<ToolPartSlots>>>;
}
