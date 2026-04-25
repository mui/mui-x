import type { ChatStore } from '../store/ChatStore';
import type { ChatMessage } from '../types/chat-entities';
import type { ChatError } from '../types/chat-error';
import type {
  ChatDataMessagePart,
  ChatDynamicToolInvocation,
  ChatDynamicToolMessagePart,
  ChatMessagePart,
  ChatToolInvocation,
  ChatToolMessagePart,
} from '../types/chat-message-parts';
import type {
  ChatMessageChunk,
  ChatStreamEnvelope,
  ChatToolApprovalRequestChunk,
  ChatToolInputAvailableChunk,
  ChatToolInputStartChunk,
} from '../types/chat-stream';
import type { ChatOnData, ChatOnFinish, ChatOnToolCall } from '../types/chat-callbacks';
import { ChatStreamError } from './ChatStreamError';
import {
  getOrCreateMessage,
  getFinishMessage,
  finalizeStreamingParts,
  updateMessageParts,
  updateMessage,
} from './streamHelpers';
import { createTextDeltaBuffer } from './streamTextDeltaBuffer';

export interface ProcessStreamOptions {
  conversationId?: string;
  messageId?: string;
  signal?: AbortSignal;
  flushInterval?: number;
  onData?: ChatOnData;
  onToolCall?: ChatOnToolCall;
  onFinish?: ChatOnFinish;
  /**
   * Lower-bound sequence value to accept on a reconnected stream.
   *
   * When a reconnect adapter resumes a previously broken stream, the server
   * may legitimately replay envelopes whose `sequence` is below the value
   * we last processed. By default the in-flight `expectedSequence` would
   * silently drop those — set this to the sequence you want to resume from
   * so they apply (#5).
   */
  reconnectFromSequence?: number;
}

export interface ProcessStreamResult {
  messageId?: string;
  status: 'sent' | 'cancelled' | 'error';
  finishReason?: string;
  isAbort: boolean;
  isDisconnect: boolean;
  isError: boolean;
}

const DEFAULT_STREAM_FLUSH_INTERVAL = 16;

function createStreamError(message: string, details?: Record<string, unknown>): ChatError {
  return {
    code: 'STREAM_ERROR',
    message,
    source: 'stream',
    recoverable: true,
    retryable: true,
    details,
  };
}

function isStreamEnvelope(
  value: ChatMessageChunk | ChatStreamEnvelope,
): value is ChatStreamEnvelope {
  return 'chunk' in value;
}

function isDataChunk(
  chunk: ChatMessageChunk,
): chunk is Extract<ChatMessageChunk, { type: `data-${string}` }> {
  return chunk.type.startsWith('data-');
}

function isDynamicToolChunk(
  chunk: ChatToolInputStartChunk | ChatToolInputAvailableChunk | ChatToolApprovalRequestChunk,
) {
  return 'dynamic' in chunk && chunk.dynamic === true;
}

export async function processStream<Cursor = string>(
  store: ChatStore<Cursor>,
  stream: ReadableStream<ChatMessageChunk | ChatStreamEnvelope>,
  options: ProcessStreamOptions = {},
): Promise<ProcessStreamResult> {
  // Cast to ChatStore<unknown> for cursor-agnostic helper functions.
  // processStream never calls setHistoryState, so the cursor type is irrelevant here.
  const storeUnknown = store as unknown as ChatStore<unknown>;
  let targetMessageId = options.messageId;
  let finishReason: string | undefined;
  let didReceiveTerminalChunk = false;
  let didReceiveAnyChunk = false;
  let finishCalled = false;
  let didStartMessage = false;
  let aborted = options.signal?.aborted ?? false;
  let expectedSequence: number | undefined =
    options.reconnectFromSequence != null ? options.reconnectFromSequence : undefined;

  const seenEventIds = new Set<string>();
  const bufferedChunksBySequence = new Map<number, ChatMessageChunk>();
  const flushInterval = Math.max(0, options.flushInterval ?? DEFAULT_STREAM_FLUSH_INTERVAL);

  const reader = stream.getReader();

  const finish = async (result: ProcessStreamResult) => {
    if (finishCalled) {
      return result;
    }

    finishCalled = true;

    if (options.onFinish) {
      await options.onFinish({
        message: getFinishMessage(
          storeUnknown,
          targetMessageId,
          options.conversationId,
          result.status,
        ),
        messages: store.state.messageIds.map((id) => store.state.messagesById[id]).filter(Boolean),
        isAbort: result.isAbort,
        isDisconnect: result.isDisconnect,
        isError: result.isError,
        finishReason: result.finishReason,
      });
    }

    return result;
  };

  let startAuthor: ChatMessage['author'];

  const finalizeMessage = (status: ProcessStreamResult['status']) => {
    if (!targetMessageId) {
      return;
    }

    updateMessage(storeUnknown, targetMessageId, (message) => {
      const nextParts = finalizeStreamingParts(message.parts);
      const didChange = nextParts !== message.parts || message.status !== status;

      if (!didChange) {
        return null;
      }

      return {
        parts: nextParts,
        status,
      };
    });
  };

  const failStream = (message: string, details?: Record<string, unknown>): ChatStreamError => {
    const chatError = createStreamError(message, details);

    if (targetMessageId) {
      finalizeMessage('error');
    }

    store.setStreaming(false);
    store.setError(chatError);

    return new ChatStreamError(chatError);
  };

  const ensureAssistantMessage = () => {
    if (!targetMessageId) {
      throw failStream('Stream processing requires a target assistant message id.');
    }

    const message = getOrCreateMessage(
      storeUnknown,
      targetMessageId,
      options.conversationId,
      startAuthor,
    );

    if (!didStartMessage) {
      didStartMessage = true;
      store.setStreaming(true);
      store.setError(null);
    }

    return message;
  };

  const handleAbort = (): Promise<ProcessStreamResult> => {
    if (targetMessageId) {
      finalizeMessage('cancelled');
    }

    store.setStreaming(false);

    return finish({
      messageId: targetMessageId,
      status: 'cancelled',
      isAbort: true,
      isDisconnect: false,
      isError: false,
    });
  };

  const {
    resolveTextLikePartIndex,
    applyTextLikeDelta,
    flushPendingTextLikeDelta,
    scheduleTextLikeDelta,
    clearPendingTextLikeDeltaTimer,
    textPartIndexesByStreamId,
    reasoningPartIndexesByStreamId,
  } = createTextDeltaBuffer(storeUnknown, ensureAssistantMessage, flushInterval);

  const withToolInvocation = async (
    toolCallId: string,
    getInitialToolPart: (() => ChatToolMessagePart | ChatDynamicToolMessagePart) | null,
    updateInvocation: (
      invocation: ChatToolInvocation | ChatDynamicToolInvocation,
    ) => ChatToolInvocation | ChatDynamicToolInvocation,
  ) => {
    const message = ensureAssistantMessage();

    let updatedInvocation: ChatToolInvocation | ChatDynamicToolInvocation | undefined;

    updateMessageParts(storeUnknown, message.id, (parts) => {
      const partIndex = parts.findIndex(
        (part) =>
          (part.type === 'tool' || part.type === 'dynamic-tool') &&
          part.toolInvocation.toolCallId === toolCallId,
      );

      if (partIndex === -1) {
        if (!getInitialToolPart) {
          return parts;
        }

        const initialPart = getInitialToolPart();
        updatedInvocation = updateInvocation(
          initialPart.toolInvocation,
        ) as typeof initialPart.toolInvocation;
        return [...parts, { ...initialPart, toolInvocation: updatedInvocation } as ChatMessagePart];
      }

      const currentPart = parts[partIndex] as ChatToolMessagePart | ChatDynamicToolMessagePart;
      updatedInvocation = updateInvocation(
        currentPart.toolInvocation,
      ) as typeof currentPart.toolInvocation;
      const nextParts = [...parts];
      nextParts[partIndex] = {
        ...currentPart,
        toolInvocation: updatedInvocation,
      } as ChatMessagePart;

      return nextParts;
    });

    if (updatedInvocation && options.onToolCall) {
      await options.onToolCall({ toolCall: updatedInvocation });
    }
  };

  const processChunk = async (chunk: ChatMessageChunk) => {
    didReceiveAnyChunk = true;

    if (chunk.type !== 'text-delta' && chunk.type !== 'reasoning-delta') {
      flushPendingTextLikeDelta();
    }

    switch (chunk.type) {
      case 'start':
        targetMessageId = chunk.messageId;
        startAuthor = chunk.author;
        ensureAssistantMessage();
        return;

      case 'finish':
        targetMessageId ??= chunk.messageId;
        ensureAssistantMessage();
        finishReason = chunk.finishReason;
        didReceiveTerminalChunk = true;
        finalizeMessage('sent');
        store.setStreaming(false);
        store.setError(null);
        return;

      case 'abort':
        targetMessageId ??= chunk.messageId;
        ensureAssistantMessage();
        didReceiveTerminalChunk = true;
        finalizeMessage('cancelled');
        store.setStreaming(false);
        return;

      case 'text-start':
      case 'reasoning-start': {
        const partType = chunk.type === 'text-start' ? ('text' as const) : ('reasoning' as const);
        const indexMap =
          partType === 'text' ? textPartIndexesByStreamId : reasoningPartIndexesByStreamId;

        // `resolveTextLikePartIndex` allocates a fresh streaming part when the
        // mapping is missing or stale (the previous part for this streamId
        // was finalized). The handler below therefore only needs to handle
        // the no-op case — never the "revive a done part" case (#3).
        const partIndex = resolveTextLikePartIndex(partType, chunk.id, indexMap, {
          createIfMissing: true,
        });

        updateMessageParts(storeUnknown, ensureAssistantMessage().id, (parts) => {
          const currentPart = parts[partIndex];

          // Never revive a `done` part back to streaming.
          if (
            currentPart?.type !== partType ||
            currentPart.state === 'streaming' ||
            currentPart.state === 'done'
          ) {
            return parts;
          }

          const nextParts = [...parts];
          nextParts[partIndex] = { ...currentPart, state: 'streaming' };
          return nextParts;
        });
        return;
      }

      case 'text-delta':
      case 'reasoning-delta': {
        const partType = chunk.type === 'text-delta' ? ('text' as const) : ('reasoning' as const);

        if (flushInterval > 0) {
          scheduleTextLikeDelta(partType, chunk.id, chunk.delta);
          return;
        }

        applyTextLikeDelta(partType, chunk.id, chunk.delta);
        return;
      }

      case 'text-end':
      case 'reasoning-end': {
        const partType = chunk.type === 'text-end' ? ('text' as const) : ('reasoning' as const);
        const indexMap =
          partType === 'text' ? textPartIndexesByStreamId : reasoningPartIndexesByStreamId;
        // `*-end` must never instantiate a fresh part — if no live part is
        // bound to this `streamId`, the chunk is a no-op.
        const partIndex = resolveTextLikePartIndex(partType, chunk.id, indexMap, {
          createIfMissing: false,
        });

        if (partIndex === -1) {
          return;
        }

        updateMessageParts(storeUnknown, ensureAssistantMessage().id, (parts) => {
          const currentPart = parts[partIndex];

          if (currentPart?.type !== partType || currentPart.state === 'done') {
            return parts;
          }

          const nextParts = [...parts];
          nextParts[partIndex] = { ...currentPart, state: 'done' };
          return nextParts;
        });
        return;
      }

      case 'tool-input-start':
        await withToolInvocation(
          chunk.toolCallId,
          () =>
            isDynamicToolChunk(chunk)
              ? {
                  type: 'dynamic-tool',
                  toolInvocation: {
                    toolCallId: chunk.toolCallId,
                    toolName: chunk.toolName,
                    state: 'input-streaming',
                  },
                }
              : {
                  type: 'tool',
                  toolInvocation: {
                    toolCallId: chunk.toolCallId,
                    toolName: chunk.toolName,
                    state: 'input-streaming',
                  },
                },
          (invocation) => ({
            ...invocation,
            toolName: chunk.toolName,
            state: 'input-streaming',
          }),
        );
        return;

      case 'tool-input-delta': {
        await withToolInvocation(chunk.toolCallId, null, (invocation) => ({
          ...invocation,
          state: 'input-streaming',
        }));
        return;
      }

      case 'tool-input-available':
        await withToolInvocation(
          chunk.toolCallId,
          () =>
            isDynamicToolChunk(chunk)
              ? {
                  type: 'dynamic-tool',
                  toolInvocation: {
                    toolCallId: chunk.toolCallId,
                    toolName: chunk.toolName,
                    state: 'input-available',
                    input: chunk.input,
                  },
                }
              : {
                  type: 'tool',
                  toolInvocation: {
                    toolCallId: chunk.toolCallId,
                    toolName: chunk.toolName,
                    state: 'input-available',
                    input: chunk.input,
                  },
                },
          (invocation) => ({
            ...invocation,
            toolName: chunk.toolName,
            input: chunk.input as ChatToolInvocation['input'],
            state: 'input-available',
          }),
        );
        return;

      case 'tool-input-error':
        await withToolInvocation(chunk.toolCallId, null, (invocation) => ({
          ...invocation,
          errorText: chunk.errorText,
          state: 'output-error',
        }));
        return;

      case 'tool-approval-request':
        await withToolInvocation(
          chunk.toolCallId,
          () =>
            isDynamicToolChunk(chunk)
              ? {
                  type: 'dynamic-tool',
                  toolInvocation: {
                    toolCallId: chunk.toolCallId,
                    toolName: chunk.toolName,
                    input: chunk.input,
                    state: 'approval-requested',
                  },
                }
              : {
                  type: 'tool',
                  toolInvocation: {
                    toolCallId: chunk.toolCallId,
                    toolName: chunk.toolName,
                    input: chunk.input,
                    state: 'approval-requested',
                  },
                },
          (invocation) => ({
            ...invocation,
            toolName: chunk.toolName,
            input: chunk.input as ChatToolInvocation['input'],
            state: 'approval-requested',
          }),
        );
        return;

      case 'tool-output-available':
        await withToolInvocation(chunk.toolCallId, null, (invocation) => ({
          ...invocation,
          output: chunk.output as ChatToolInvocation['output'],
          preliminary: chunk.preliminary,
          state: 'output-available',
        }));
        return;

      case 'tool-output-error':
        await withToolInvocation(chunk.toolCallId, null, (invocation) => ({
          ...invocation,
          errorText: chunk.errorText,
          state: 'output-error',
        }));
        return;

      case 'tool-output-denied':
        await withToolInvocation(chunk.toolCallId, null, (invocation) => ({
          ...invocation,
          approval: {
            approved: false,
            reason: chunk.reason,
          },
          state: 'output-denied',
        }));
        return;

      case 'source-url':
        updateMessageParts(storeUnknown, ensureAssistantMessage().id, (parts) => [
          ...parts,
          {
            type: 'source-url',
            sourceId: chunk.sourceId,
            url: chunk.url,
            title: chunk.title,
          },
        ]);
        return;

      case 'source-document':
        updateMessageParts(storeUnknown, ensureAssistantMessage().id, (parts) => [
          ...parts,
          {
            type: 'source-document',
            sourceId: chunk.sourceId,
            title: chunk.title,
            text: chunk.text,
          },
        ]);
        return;

      case 'file':
        updateMessageParts(storeUnknown, ensureAssistantMessage().id, (parts) => [
          ...parts,
          {
            type: 'file',
            mediaType: chunk.mediaType,
            url: chunk.url,
            filename: chunk.filename,
          },
        ]);
        return;

      case 'start-step':
        updateMessageParts(storeUnknown, ensureAssistantMessage().id, (parts) => [
          ...parts,
          { type: 'step-start' },
        ]);
        return;

      case 'finish-step':
        ensureAssistantMessage();
        return;

      case 'message-metadata':
        updateMessage(storeUnknown, ensureAssistantMessage().id, (message) => ({
          metadata: {
            ...message.metadata,
            ...chunk.metadata,
          },
        }));
        return;

      default:
        if (isDataChunk(chunk)) {
          const message = ensureAssistantMessage();
          const part: ChatDataMessagePart = {
            type: chunk.type,
            id: chunk.id,
            data: chunk.data,
            transient: chunk.transient,
          } as ChatDataMessagePart;

          updateMessageParts(storeUnknown, message.id, (parts) => [...parts, part]);

          if (options.onData) {
            await options.onData(part);
          }
        }
    }
  };

  const processIncoming = async (value: ChatMessageChunk | ChatStreamEnvelope) => {
    if (!isStreamEnvelope(value)) {
      await processChunk(value);
      return;
    }

    if (value.eventId) {
      if (seenEventIds.has(value.eventId)) {
        return;
      }

      seenEventIds.add(value.eventId);
    }

    if (value.sequence == null) {
      await processChunk(value.chunk);
      return;
    }

    if (expectedSequence == null) {
      expectedSequence = value.sequence;
    }

    if (value.sequence < expectedSequence) {
      return;
    }

    if (value.sequence > expectedSequence) {
      bufferedChunksBySequence.set(value.sequence, value.chunk);
      return;
    }

    await processChunk(value.chunk);
    expectedSequence += 1;

    while (bufferedChunksBySequence.has(expectedSequence)) {
      const nextChunk = bufferedChunksBySequence.get(expectedSequence)!;
      bufferedChunksBySequence.delete(expectedSequence);
      // eslint-disable-next-line no-await-in-loop
      await processChunk(nextChunk);
      expectedSequence += 1;
    }
  };

  const abortListener = () => {
    aborted = true;
    void reader.cancel().catch(() => {});
  };

  options.signal?.addEventListener('abort', abortListener, { once: true });

  try {
    if (aborted) {
      flushPendingTextLikeDelta();
      return handleAbort();
    }

    while (true) {
      if (aborted) {
        return handleAbort();
      }

      // eslint-disable-next-line no-await-in-loop
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // eslint-disable-next-line no-await-in-loop
      await processIncoming(value);

      if (didReceiveTerminalChunk) {
        break;
      }
    }

    if (aborted) {
      flushPendingTextLikeDelta();
      return handleAbort();
    }

    if (didReceiveTerminalChunk) {
      flushPendingTextLikeDelta();
      const finalStatus = store.state.messagesById[targetMessageId ?? '']?.status;
      return finish({
        messageId: targetMessageId,
        status: finalStatus === 'cancelled' ? 'cancelled' : 'sent',
        finishReason,
        isAbort: finalStatus === 'cancelled',
        isDisconnect: false,
        isError: false,
      });
    }

    if (didReceiveAnyChunk) {
      flushPendingTextLikeDelta();
      failStream('Stream closed before a terminal chunk was received.');

      return finish({
        messageId: targetMessageId,
        status: 'error',
        isAbort: false,
        isDisconnect: true,
        isError: true,
      });
    }

    store.setStreaming(false);
    return finish({
      messageId: targetMessageId,
      status: 'sent',
      isAbort: false,
      isDisconnect: false,
      isError: false,
    });
  } catch (error) {
    if (aborted) {
      flushPendingTextLikeDelta();
      return handleAbort();
    }

    flushPendingTextLikeDelta();

    // ChatStreamError means failStream() already updated the store — avoid double-handling.
    if (!(error instanceof ChatStreamError)) {
      const streamError = error instanceof Error ? error : new Error('Stream processing failed.');
      failStream(streamError.message || 'Stream processing failed.');
    }

    await finish({
      messageId: targetMessageId,
      status: 'error',
      finishReason,
      isAbort: false,
      isDisconnect: false,
      isError: true,
    });
    throw error;
  } finally {
    options.signal?.removeEventListener('abort', abortListener);
    clearPendingTextLikeDeltaTimer();
    // Defensive: `releaseLock()` is normally safe in this branch, but if a
    // future code path leaves the reader in an unexpected state (e.g. an
    // already-cancelled stream from the abort listener), we don't want it
    // to mask the real failure or surface as an unhandled rejection (#1).
    try {
      reader.releaseLock();
    } catch {
      /* ignore — the lock is gone, nothing else to do */
    }
  }
}
