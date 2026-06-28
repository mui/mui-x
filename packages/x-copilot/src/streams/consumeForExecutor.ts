import type { ChatMessageChunk, ChatStreamEnvelope } from '@mui/x-chat-headless';
import type { Executor } from '../executor/createExecutor';
import type { CopilotExecutionResult } from '../executor/types';
import {
  isEnvelope,
  safeParseWrapper,
  SUPPORTED_TOOL_NAMES,
  type ToolName,
  type ToolStreamState,
} from './types';

export interface ConsumeForExecutorOptions {
  executor: Executor;
  /** Per-message result snapshot — fired on each `finish` chunk. */
  onResults?(messageId: string, results: CopilotExecutionResult): void;
  /**
   * Per-call hook fired the moment a `setGridState` / `runCommands` tool call
   * completes. Receives the raw JSONL body so consumers can accumulate an
   * envelope cache for later replay (e.g. A/B `switchToVariant`).
   */
  onAssembledBody?(messageId: string, toolName: ToolName, body: string): void;
  /**
   * Decides whether a freshly-assembled tool body should be dispatched to
   * the executor. Returning `false` keeps the body buffered (via
   * `onAssembledBody`) without touching the host — that's how a variant B's
   * patches stay dormant until the user picks them.
   *
   * Defaults to apply-everything.
   */
  shouldApply?(messageId: string | undefined): boolean;
  /**
   * Surfaces `message-metadata` chunks. The consumer uses this to populate a
   * per-messageId variant map so `shouldApply` can decide whether to dispatch.
   */
  onMessageMetadata?(messageId: string, metadata: Readonly<Record<string, unknown>>): void;
  /**
   * Maps host-specific LLM-facing tool names onto the canonical executor wire
   * names (`setGridState` / `runCommands`). Lets a host expose a domain name to
   * the model and the chat UI — e.g. the Charts copilot calls its patch tool
   * `updateChart` (so "grid" never leaks into the chart context) — while the
   * executor still dispatches it through the shared `setGridState` path. Only
   * the executor branch is remapped; the chat branch keeps the original name, so
   * the rendered tool chip shows the host name. Unmapped names pass through
   * unchanged, so Grid / Studio are unaffected.
   */
  toolNameAliases?: Readonly<Record<string, ToolName>>;
}

function dispatchAssembled(
  state: ToolStreamState,
  input: Record<string, unknown> | undefined,
  executor: Executor,
  options: { apply: boolean; onBody?: (toolName: ToolName, body: string) => void } = {
    apply: true,
  },
): void {
  if (state.dispatched) {
    return;
  }
  state.dispatched = true;
  const field = state.toolName === 'setGridState' ? 'patches' : 'commands';
  const body = typeof input?.[field] === 'string' ? (input[field] as string) : '';
  if (!body) {
    return;
  }
  options.onBody?.(state.toolName, body);
  if (options.apply) {
    executor.pushChunk(state.toolIndex, state.toolName, body);
  }
}

/**
 * Consume the executor branch of a teed adapter response stream. Routes
 * `tool-input-*` events for `setGridState` / `runCommands` into the executor.
 *
 * Plugin-claimed and data-query tools (`queryGridData` etc.) are NOT handled
 * here — they live on the chat branch via `approvalAwareStream`.
 */
export async function consumeForExecutor(
  stream: ReadableStream<ChatMessageChunk | ChatStreamEnvelope>,
  options: ConsumeForExecutorOptions,
): Promise<void> {
  const { executor, onResults, onAssembledBody, shouldApply, onMessageMetadata, toolNameAliases } =
    options;
  const reader = stream.getReader();
  const toolsById = new Map<string, ToolStreamState>();
  let nextToolIndex = 0;
  let currentMessageId: string | undefined;
  const reportedMessageIds = new Set<string>();

  const dispatchOptionsFor = (messageId: string | undefined) => ({
    apply: shouldApply ? shouldApply(messageId) : true,
    onBody:
      onAssembledBody && messageId
        ? (toolName: ToolName, body: string) => onAssembledBody(messageId, toolName, body)
        : undefined,
  });

  const reportResults = () => {
    if (!currentMessageId || !onResults) {
      return;
    }
    if (reportedMessageIds.has(currentMessageId)) {
      return;
    }
    reportedMessageIds.add(currentMessageId);
    onResults(currentMessageId, {
      applied: [...executor.results.applied],
      skipped: [...executor.results.skipped],
    });
  };

  try {
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      const chunk: ChatMessageChunk = isEnvelope(value) ? value.chunk : value;
      switch (chunk.type) {
        case 'start': {
          const id = (chunk as { messageId?: string }).messageId;
          if (typeof id === 'string' && id.length > 0) {
            currentMessageId = id;
          }
          break;
        }
        case 'tool-input-start': {
          const rawToolName = chunk.toolName as string;
          // Resolve a host alias (e.g. charts' `updateChart`) to the canonical
          // executor wire name before dispatch; unmapped names pass through.
          const toolName = toolNameAliases?.[rawToolName] ?? rawToolName;
          if (SUPPORTED_TOOL_NAMES.has(toolName as ToolName)) {
            toolsById.set(chunk.toolCallId, {
              toolName: toolName as ToolName,
              toolIndex: nextToolIndex,
              buffer: '',
              dispatched: false,
            });
            nextToolIndex += 1;
          }
          break;
        }
        case 'tool-input-delta': {
          const state = toolsById.get(chunk.toolCallId);
          if (state) {
            const delta = (chunk as { inputTextDelta?: string }).inputTextDelta;
            if (typeof delta === 'string') {
              state.buffer += delta;
            }
          }
          break;
        }
        case 'tool-input-available': {
          const state = toolsById.get(chunk.toolCallId);
          if (state) {
            const fromChunk = chunk.input as Record<string, unknown> | undefined;
            const input = fromChunk ?? safeParseWrapper(state.buffer);
            dispatchAssembled(state, input, executor, dispatchOptionsFor(currentMessageId));
            executor.onToolStop(state.toolIndex, state.toolName);
            toolsById.delete(chunk.toolCallId);
          }
          break;
        }
        case 'tool-input-error': {
          const state = toolsById.get(chunk.toolCallId);
          if (state) {
            executor.onToolStop(state.toolIndex, state.toolName);
            toolsById.delete(chunk.toolCallId);
          }
          break;
        }
        case 'finish': {
          const id = (chunk as { messageId?: string }).messageId;
          if (typeof id === 'string' && id.length > 0) {
            currentMessageId = id;
          }
          for (const state of toolsById.values()) {
            if (!state.dispatched) {
              dispatchAssembled(
                state,
                safeParseWrapper(state.buffer),
                executor,
                dispatchOptionsFor(currentMessageId),
              );
            }
            executor.onToolStop(state.toolIndex, state.toolName);
          }
          toolsById.clear();
          executor.onAllToolsStop();
          reportResults();
          break;
        }
        case 'message-metadata': {
          const id = (chunk as { messageId?: string }).messageId;
          if (typeof id === 'string' && id.length > 0) {
            currentMessageId = id;
          }
          const metadata = (chunk as { metadata?: Record<string, unknown> }).metadata;
          if (onMessageMetadata && currentMessageId && metadata) {
            onMessageMetadata(currentMessageId, metadata);
          }
          break;
        }
        default:
          break;
      }
    }
  } finally {
    reader.releaseLock();
  }
}
