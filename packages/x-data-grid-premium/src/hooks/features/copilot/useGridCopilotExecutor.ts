'use client';
import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import type { ChatAdapter, ChatMessageChunk, ChatStreamEnvelope } from '@mui/x-chat-headless';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridCopilotAdapter } from './gridCopilotInterfaces';
import {
  makeExecutor,
  type Executor,
  type GridCopilotEnvelope,
  type GridCopilotExecutionResult,
  type ToolName,
} from './executor';

const SUPPORTED_TOOL_NAMES = new Set<ToolName>(['setGridState', 'runCommands']);

interface ToolStreamState {
  toolName: ToolName;
  toolIndex: number;
  buffer: string;
  dispatched: boolean;
}

function safeParseWrapper(text: string): { patches?: string; commands?: string } | undefined {
  if (!text) {
    return undefined;
  }
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function dispatchAssembled(
  state: ToolStreamState,
  input: { patches?: string; commands?: string } | undefined,
  executor: Executor,
): void {
  if (state.dispatched) {
    return;
  }
  const field = state.toolName === 'setGridState' ? 'patches' : 'commands';
  const body = typeof input?.[field] === 'string' ? input[field]! : '';
  if (body) {
    executor.pushChunk(state.toolIndex, state.toolName, body);
  }
  state.dispatched = true;
}

// Consume the executor branch of a teed adapter response stream. Routes
// `tool-input-*` events for `setGridState` / `runCommands` into the executor's
// `pushChunk` / `onToolStop` callbacks.
//
// Some backends emit only `tool-input-delta` chunks followed by `finish` (no
// `tool-input-available`). To stay tolerant, we buffer `inputTextDelta` per
// `toolCallId` and fall back to parsing that buffer at finish-time when
// `tool-input-available` never lands.
async function consumeForExecutor(
  stream: ReadableStream<ChatMessageChunk | ChatStreamEnvelope>,
  executor: Executor,
  onResults?: (messageId: string, results: GridCopilotExecutionResult) => void,
): Promise<void> {
  const reader = stream.getReader();
  const toolsById = new Map<string, ToolStreamState>();
  let nextToolIndex = 0;
  let currentMessageId: string | undefined;
  let resultsReported = false;

  const reportResults = () => {
    if (resultsReported || !currentMessageId || !onResults) {
      return;
    }
    resultsReported = true;
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
          const toolName = chunk.toolName as string;
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
            const fromChunk = chunk.input as { patches?: string; commands?: string } | undefined;
            const input = fromChunk ?? safeParseWrapper(state.buffer);
            dispatchAssembled(state, input, executor);
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
              dispatchAssembled(state, safeParseWrapper(state.buffer), executor);
            }
            executor.onToolStop(state.toolIndex, state.toolName);
          }
          toolsById.clear();
          executor.onAllToolsStop();
          reportResults();
          break;
        }
        default:
          // Other chunks (text, reasoning, etc.) are ignored on the executor branch.
          break;
      }
    }
  } finally {
    reader.releaseLock();
    if (toolsById.size > 0) {
      for (const state of toolsById.values()) {
        if (!state.dispatched) {
          dispatchAssembled(state, safeParseWrapper(state.buffer), executor);
        }
        executor.onToolStop(state.toolIndex, state.toolName);
      }
      executor.onAllToolsStop();
    }
    reportResults();
  }
}

function isEnvelope(
  value: ChatMessageChunk | ChatStreamEnvelope | undefined,
): value is ChatStreamEnvelope {
  return (
    !!value &&
    typeof (value as ChatStreamEnvelope).chunk === 'object' &&
    (value as ChatStreamEnvelope).chunk !== null
  );
}

export interface GridCopilotExecutorHandle {
  // The wrapped adapter that should be handed to `<ChatBox>` when present.
  wrappedAdapter: GridCopilotAdapter | undefined;
  // Apply a synchronous envelope (legacy adapter / programmatic / tests).
  applyEnvelope: (envelope: GridCopilotEnvelope) => GridCopilotExecutionResult;
  // The current executor instance — useful for inspection in tests.
  executor: () => Executor;
  // Look up cached executor results for a chat message id (set by the stream consumer).
  getResultsForMessage: (messageId: string) => GridCopilotExecutionResult | undefined;
  // Subscribe to result-cache updates; returns an unsubscribe function.
  subscribeResults: (listener: () => void) => () => void;
}

const RESULTS_CACHE_CAP = 50;

/**
 * Wraps `props.copilotAdapter` so that responses are teed: one branch reaches
 * `<ChatBox>` unchanged, the other is consumed by the executor to apply
 * `setGridState` / `runCommands` tool calls to the grid.
 *
 * A fresh executor instance is created per `sendMessage` call so per-batch
 * state (buffers, applied slices, deferred commands, dedup `seen` set) resets
 * cleanly between turns.
 */
export function useGridCopilotExecutor(
  apiRef: RefObject<GridPrivateApiPremium>,
  props: DataGridPremiumProcessedProps,
): GridCopilotExecutorHandle {
  const executorRef = React.useRef<Executor | null>(null);
  const resultsByMessageId = React.useRef<Map<string, GridCopilotExecutionResult>>(new Map());
  const subscribers = React.useRef<Set<() => void>>(new Set());

  const onResults = React.useCallback((messageId: string, results: GridCopilotExecutionResult) => {
    const map = resultsByMessageId.current;
    map.set(messageId, results);
    while (map.size > RESULTS_CACHE_CAP) {
      const firstKey = map.keys().next().value;
      if (firstKey === undefined) {
        break;
      }
      map.delete(firstKey);
    }
    subscribers.current.forEach((listener) => {
      try {
        listener();
      } catch {
        // Swallow listener errors; one bad subscriber shouldn't stop notification.
      }
    });
  }, []);

  const getResultsForMessage = React.useCallback(
    (messageId: string) => resultsByMessageId.current.get(messageId),
    [],
  );

  const subscribeResults = React.useCallback((listener: () => void) => {
    subscribers.current.add(listener);
    return () => {
      subscribers.current.delete(listener);
    };
  }, []);

  const getExecutor = React.useCallback((): Executor => {
    if (!executorRef.current) {
      executorRef.current = makeExecutor({ apiRef, props });
    }
    return executorRef.current;
  }, [apiRef, props]);

  const wrappedAdapter = React.useMemo<GridCopilotAdapter | undefined>(() => {
    if (!props.copilot || !props.copilotAdapter) {
      return undefined;
    }
    const inner: ChatAdapter = props.copilotAdapter;
    return {
      ...inner,
      sendMessage: async (input) => {
        const stream = await inner.sendMessage(input);
        const [forChatBox, forExecutor] = stream.tee();
        const executor = makeExecutor({ apiRef, props });
        executorRef.current = executor;
        // Fire-and-forget. Errors land in the executor's `skipped[]`.
        void consumeForExecutor(forExecutor, executor, onResults);
        return forChatBox;
      },
    };
  }, [apiRef, props, onResults]);

  const applyEnvelope = React.useCallback(
    (envelope: GridCopilotEnvelope): GridCopilotExecutionResult => {
      // Fresh executor per envelope.
      const executor = makeExecutor({ apiRef, props });
      executorRef.current = executor;
      return executor.applyEnvelope(envelope);
    },
    [apiRef, props],
  );

  return {
    wrappedAdapter,
    applyEnvelope,
    executor: getExecutor,
    getResultsForMessage,
    subscribeResults,
  };
}
