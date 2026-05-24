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
   * When `true`, the read loop keeps going past the first sibling's
   * terminal chunk (`finish` / `abort`) until the upstream stream closes
   * naturally. Lets a single `sendMessage` call land more than one
   * assistant message in the store — used by the grid Copilot A/B adapter,
   * which merges two parallel responses into one logical chunk stream.
   *
   * Default `false` — the production single-response path is unchanged.
   */
  allowMultipleMessages?: boolean;
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
  let expectedSequence: number | undefined;

  const seenEventIds = new Set<string>();
  const bufferedChunksBySequence = new Map<number, ChatMessageChunk>();
  const flushInterval = Math.max(0, options.flushInterval ?? DEFAULT_STREAM_FLUSH_INTERVAL);
  // Metadata frames that arrived before the `start` chunk (e.g. the
  // server-side A/B preamble that ships `responseId` / `abPairId` /
  // `abTwinUrl` ahead of any model output). Flushed onto the assistant
  // message the moment it gets created so the consumer (e.g. the A/B
  // adapter) can read it from the very first render.
  const pendingMessageMetadataByMessageId = new Map<
    string,
    Partial<import('../types').ChatMessageMetadata>
  >();
  let pendingMessageMetadataForNextStart:
    | Partial<import('../types').ChatMessageMetadata>
    | undefined;

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
      case 'start': {
        // Multi-message-per-turn support: when an upstream adapter wraps
        // multiple assistant responses into one logical stream (e.g. the
        // grid Copilot A/B adapter, which fires a twin fetch in parallel),
        // a second `start` chunk arrives with a different `messageId`. We
        // finalize the previous target as `sent` before switching, so each
        // sibling message ends up in the store with its own status, and we
        // reset `didReceiveTerminalChunk` so the read loop doesn't exit on
        // the previous sibling's `finish` chunk. The single-message path is
        // unchanged (the guards collapse to no-ops).
        if (targetMessageId && targetMessageId !== chunk.messageId) {
          finalizeMessage('sent');
          didReceiveTerminalChunk = false;
          finishReason = undefined;
        }
        targetMessageId = chunk.messageId;
        startAuthor = chunk.author;
        ensureAssistantMessage();
        // Flush any metadata frames that landed BEFORE this `start` —
        // either ones explicitly addressed to this id, or the floating
        // pre-`start` slot that's filled by adapters which emit metadata
        // ahead of the model output.
        const pendingByMessageId = pendingMessageMetadataByMessageId.get(chunk.messageId);
        const pendingFloating = pendingMessageMetadataForNextStart;
        if (pendingByMessageId || pendingFloating) {
          updateMessage(storeUnknown, chunk.messageId, (message) => ({
            metadata: {
              ...message.metadata,
              ...(pendingFloating ?? {}),
              ...(pendingByMessageId ?? {}),
            },
          }));
          pendingMessageMetadataByMessageId.delete(chunk.messageId);
          pendingMessageMetadataForNextStart = undefined;
        }
        return;
      }

      case 'finish':
        // Finish chunks always target the specific messageId on the chunk
        // — never the floating `targetMessageId`, which may be pointing at
        // a sibling sent in parallel. Without this distinction, an
        // interleaved AB stream would write the second message's finish
        // metadata onto the first sibling.
        targetMessageId = chunk.messageId ?? targetMessageId;
        ensureAssistantMessage();
        finishReason = chunk.finishReason;
        if (chunk.messageMetadata) {
          updateMessage(storeUnknown, ensureAssistantMessage().id, (message) => ({
            metadata: {
              ...message.metadata,
              ...chunk.messageMetadata,
            },
          }));
        }
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
        const partIndex = resolveTextLikePartIndex(partType, chunk.id, indexMap);

        updateMessageParts(storeUnknown, ensureAssistantMessage().id, (parts) => {
          const currentPart = parts[partIndex];

          if (currentPart?.type !== partType || currentPart.state === 'streaming') {
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
        const partIndex = resolveTextLikePartIndex(partType, chunk.id, indexMap);

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

      case 'message-metadata': {
        // The AI SDK's UI Message Stream emits `message-metadata` chunks with
        // a `messageMetadata` field — the same shape `finish` carries. The
        // historical chat-headless type called it `metadata`. Accept both so
        // adapters streaming from the AI SDK directly (the grid Copilot
        // does) keep working without a translation layer.
        const payload =
          ((chunk as { messageMetadata?: Partial<import('../types').ChatMessageMetadata> })
            .messageMetadata as Partial<import('../types').ChatMessageMetadata> | undefined) ??
          ((chunk as { metadata?: Partial<import('../types').ChatMessageMetadata> }).metadata as
            | Partial<import('../types').ChatMessageMetadata>
            | undefined);
        if (!payload) {
          return;
        }
        // Two buffering cases route this metadata away from the current
        // `targetMessageId`:
        //   1. Stream hasn't started yet — `targetMessageId` is unset, so a
        //      leading metadata frame can't be addressed; buffer for the next
        //      `start`.
        //   2. The current target has already finished (a `finish` chunk
        //      came earlier). The next chunk we care about is a fresh
        //      `start` for a sibling message (the grid Copilot A/B adapter
        //      sequence: finish(A) → message-metadata(B preamble) → start(B)).
        //      Without this guard, B's leading metadata would mutate A's
        //      already-finalized message and overwrite A's `responseId` /
        //      `abVariant`.
        const targetClosed = didReceiveTerminalChunk;
        if (!targetMessageId || targetClosed) {
          pendingMessageMetadataForNextStart = {
            ...(pendingMessageMetadataForNextStart ?? {}),
            ...payload,
          };
          return;
        }
        updateMessage(storeUnknown, ensureAssistantMessage().id, (message) => ({
          metadata: {
            ...message.metadata,
            ...payload,
          },
        }));
        return;
      }

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

      // In multi-message mode (the grid Copilot A/B adapter merges two
      // parallel responses into one logical stream) we DON'T break on the
      // first sibling's `finish` chunk — the upstream will close the reader
      // naturally once both siblings are done. The next `start` chunk in
      // `processChunk` resets `didReceiveTerminalChunk` and finalizes the
      // previous sibling.
      if (didReceiveTerminalChunk && !options.allowMultipleMessages) {
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
    reader.releaseLock();
  }
}
