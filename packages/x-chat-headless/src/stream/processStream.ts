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

export interface ProcessStreamOptions {
  conversationId?: string;
  messageId?: string;
  signal?: AbortSignal;
  flushInterval?: number;
  onData?: ChatOnData;
  onToolCall?: ChatOnToolCall;
  onFinish?: ChatOnFinish;
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

function getOrCreateMessage(
  store: ChatStore<any>,
  messageId: string,
  conversationId: string | undefined,
  author?: ChatMessage['author'],
): ChatMessage {
  const existingMessage = store.state.messagesById[messageId];

  if (existingMessage) {
    const nextMessage: ChatMessage =
      existingMessage.status === 'streaming'
        ? existingMessage
        : {
            ...existingMessage,
            conversationId: existingMessage.conversationId ?? conversationId,
            status: 'streaming',
          };

    if (nextMessage !== existingMessage) {
      store.updateMessage(messageId, nextMessage);
    }

    return store.state.messagesById[messageId] ?? nextMessage;
  }

  const nextMessage: ChatMessage = {
    id: messageId,
    conversationId,
    role: 'assistant',
    parts: [],
    status: 'streaming',
    ...(author ? { author } : undefined),
  };

  store.addMessage(nextMessage);
  return store.state.messagesById[messageId] ?? nextMessage;
}

function getFinishMessage(
  store: ChatStore<any>,
  messageId: string | undefined,
  conversationId: string | undefined,
  status: ChatMessage['status'],
): ChatMessage {
  if (messageId) {
    const existingMessage = store.state.messagesById[messageId];

    if (existingMessage) {
      return existingMessage;
    }
  }

  return {
    id: messageId ?? '',
    conversationId,
    role: 'assistant',
    parts: [],
    status,
  };
}

function finalizeStreamingParts(parts: ChatMessagePart[]): ChatMessagePart[] {
  let didChange = false;

  const nextParts = parts.map((part) => {
    if ((part.type === 'text' || part.type === 'reasoning') && part.state === 'streaming') {
      didChange = true;
      return {
        ...part,
        state: 'done' as const,
      } satisfies ChatMessagePart;
    }

    return part;
  });

  return didChange ? nextParts : parts;
}

function updateMessageParts(
  store: ChatStore<any>,
  messageId: string,
  updater: (parts: ChatMessagePart[]) => ChatMessagePart[],
) {
  const message = store.state.messagesById[messageId];

  if (!message) {
    return;
  }

  const nextParts = updater(message.parts);

  if (nextParts !== message.parts) {
    store.updateMessage(messageId, { parts: nextParts });
  }
}

function updateMessage(
  store: ChatStore<any>,
  messageId: string,
  updater: (message: ChatMessage) => Partial<ChatMessage> | null,
) {
  const message = store.state.messagesById[messageId];

  if (!message) {
    return;
  }

  const patch = updater(message);

  if (patch) {
    store.updateMessage(messageId, patch);
  }
}

function findLastStreamingPartIndex(parts: ChatMessagePart[], type: 'text' | 'reasoning') {
  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const part = parts[index];

    if (part.type === type && part.state === 'streaming') {
      return index;
    }
  }

  return -1;
}

export async function processStream<Cursor = string>(
  store: ChatStore<Cursor>,
  stream: ReadableStream<ChatMessageChunk | ChatStreamEnvelope>,
  options: ProcessStreamOptions = {},
): Promise<ProcessStreamResult> {
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
  const textPartIndexesByStreamId = new Map<string, number>();
  const reasoningPartIndexesByStreamId = new Map<string, number>();
  const flushInterval = Math.max(0, options.flushInterval ?? DEFAULT_STREAM_FLUSH_INTERVAL);
  let pendingTextLikeDelta: {
    partType: 'text' | 'reasoning';
    streamId: string;
    delta: string;
  } | null = null;
  let pendingTextLikeDeltaTimer: ReturnType<typeof setTimeout> | null = null;

  const reader = stream.getReader();

  const finish = async (result: ProcessStreamResult) => {
    if (finishCalled) {
      return result;
    }

    finishCalled = true;

    if (options.onFinish) {
      await options.onFinish({
        message: getFinishMessage(store, targetMessageId, options.conversationId, result.status),
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

  const ensureAssistantMessage = () => {
    if (!targetMessageId) {
      throw new Error('Stream processing requires a target assistant message id.');
    }

    const message = getOrCreateMessage(store, targetMessageId, options.conversationId, startAuthor);

    if (!didStartMessage) {
      didStartMessage = true;
      store.setStreaming(true);
      store.setError(null);
    }

    return message;
  };

  const finalizeMessage = (status: ProcessStreamResult['status']) => {
    if (!targetMessageId) {
      return;
    }

    updateMessage(store, targetMessageId, (message) => {
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

  const failStream = (message: string, details?: Record<string, unknown>) => {
    const error = createStreamError(message, details);

    if (targetMessageId) {
      finalizeMessage('error');
    }

    store.setStreaming(false);
    store.setError(error);

    return error;
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

  const resolveTextLikePartIndex = (
    partType: 'text' | 'reasoning',
    streamId: string,
    partIndexesByStreamId: Map<string, number>,
  ) => {
    const message = ensureAssistantMessage();
    const mappedIndex = partIndexesByStreamId.get(streamId);

    if (mappedIndex != null && message.parts[mappedIndex]?.type === partType) {
      return mappedIndex;
    }

    const fallbackIndex = findLastStreamingPartIndex(message.parts, partType);

    if (fallbackIndex !== -1) {
      partIndexesByStreamId.set(streamId, fallbackIndex);
      return fallbackIndex;
    }

    const nextIndex = message.parts.length;
    const nextPart =
      partType === 'text'
        ? ({ type: 'text', text: '', state: 'streaming' } as const)
        : ({ type: 'reasoning', text: '', state: 'streaming' } as const);

    store.updateMessage(message.id, { parts: [...message.parts, nextPart] });
    partIndexesByStreamId.set(streamId, nextIndex);

    return nextIndex;
  };

  const clearPendingTextLikeDeltaTimer = () => {
    if (pendingTextLikeDeltaTimer) {
      clearTimeout(pendingTextLikeDeltaTimer);
      pendingTextLikeDeltaTimer = null;
    }
  };

  const applyTextLikeDelta = (partType: 'text' | 'reasoning', streamId: string, delta: string) => {
    const indexMap =
      partType === 'text' ? textPartIndexesByStreamId : reasoningPartIndexesByStreamId;
    const partIndex = resolveTextLikePartIndex(partType, streamId, indexMap);

    updateMessageParts(store, ensureAssistantMessage().id, (parts) => {
      const currentPart = parts[partIndex];

      if (currentPart?.type !== partType) {
        return parts;
      }

      const nextParts = [...parts];
      nextParts[partIndex] = {
        ...currentPart,
        text: `${currentPart.text}${delta}`,
        state: 'streaming',
      };
      return nextParts;
    });
  };

  const flushPendingTextLikeDelta = () => {
    if (!pendingTextLikeDelta) {
      return;
    }

    const { partType, streamId, delta } = pendingTextLikeDelta;
    pendingTextLikeDelta = null;
    clearPendingTextLikeDeltaTimer();
    applyTextLikeDelta(partType, streamId, delta);
  };

  const scheduleTextLikeDelta = (
    partType: 'text' | 'reasoning',
    streamId: string,
    delta: string,
  ) => {
    if (
      pendingTextLikeDelta &&
      (pendingTextLikeDelta.partType !== partType || pendingTextLikeDelta.streamId !== streamId)
    ) {
      flushPendingTextLikeDelta();
    }

    if (!pendingTextLikeDelta) {
      pendingTextLikeDelta = {
        partType,
        streamId,
        delta,
      };

      clearPendingTextLikeDeltaTimer();
      pendingTextLikeDeltaTimer = setTimeout(() => {
        flushPendingTextLikeDelta();
      }, flushInterval);
      return;
    }

    pendingTextLikeDelta = {
      ...pendingTextLikeDelta,
      delta: `${pendingTextLikeDelta.delta}${delta}`,
    };
  };

  const withToolInvocation = async (
    toolCallId: string,
    getInitialToolPart: (() => ChatToolMessagePart | ChatDynamicToolMessagePart) | null,
    updateInvocation: (
      invocation: ChatToolInvocation | ChatDynamicToolInvocation,
    ) => ChatToolInvocation | ChatDynamicToolInvocation,
  ) => {
    const message = ensureAssistantMessage();

    let updatedInvocation: ChatToolInvocation | ChatDynamicToolInvocation | undefined;

    updateMessageParts(store, message.id, (parts) => {
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
        const partIndex = resolveTextLikePartIndex(partType, chunk.id, indexMap);

        updateMessageParts(store, ensureAssistantMessage().id, (parts) => {
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

        updateMessageParts(store, ensureAssistantMessage().id, (parts) => {
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
        updateMessageParts(store, ensureAssistantMessage().id, (parts) => [
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
        updateMessageParts(store, ensureAssistantMessage().id, (parts) => [
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
        updateMessageParts(store, ensureAssistantMessage().id, (parts) => [
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
        updateMessageParts(store, ensureAssistantMessage().id, (parts) => [
          ...parts,
          { type: 'step-start' },
        ]);
        return;

      case 'finish-step':
        ensureAssistantMessage();
        return;

      case 'message-metadata':
        updateMessage(store, ensureAssistantMessage().id, (message) => ({
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

          updateMessageParts(store, message.id, (parts) => [...parts, part]);

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
    const streamError = error instanceof Error ? error : new Error('Stream processing failed.');

    failStream(streamError.message || 'Stream processing failed.');
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
