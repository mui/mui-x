import * as React from 'react';
import type { ChatAdapter } from '../../adapters';
import { processStream, type ProcessStreamResult } from '../../stream';
import type { ChatStore } from '../../store';
import type { ChatMessage, ChatOnData, ChatOnFinish, ChatOnToolCall } from '../../types';
import type { ChatDraftAttachment } from '../../types/chat-entities';
import type { ChatError } from '../../types/chat-error';
import { createLocalId } from '../createLocalId';
import type { UseChatSendMessageInput } from '../../types/chat-callbacks';
import {
  getMessages,
  createRuntimeError,
  getErrorMessage,
  findAssistantMessageIdsForRetry,
  removeAssistantMessageIds,
} from './useChatControllerHelpers';

export interface SendMessageActionsRuntimeRef<Cursor = string> {
  adapter: ChatAdapter<Cursor>;
  streamFlushInterval?: number;
  onToolCall?: ChatOnToolCall;
  onFinish?: ChatOnFinish;
  onData?: ChatOnData;
  onError?: (error: ChatError) => void;
}

export function createSendMessageActions<Cursor = string>(params: {
  store: ChatStore<Cursor>;
  storeUnknown: ChatStore<unknown>;
  runtimeRef: React.MutableRefObject<SendMessageActionsRuntimeRef<Cursor>>;
  setRuntimeError: (error: ChatError | null) => void;
  assistantMessageIdByUserMessageIdRef: React.MutableRefObject<Map<string, string>>;
}) {
  const { store, storeUnknown, runtimeRef, setRuntimeError, assistantMessageIdByUserMessageIdRef } =
    params;

  // Synchronous flag to guard against double-invocation in React 18 Strict Mode.
  // `store.state.isStreaming` is updated synchronously, but React 18 may re-trigger
  // effects before the store subscription causes a re-render that makes the guard
  // effective. This flag is set immediately before any async work.
  let isSending = false;
  const attachmentsByUserMessageId = new Map<string, ChatDraftAttachment[]>();

  async function processStreamWithReconnect(
    stream: Awaited<ReturnType<ChatAdapter<Cursor>['sendMessage']>>,
    conversationId: string | undefined,
    abortController: AbortController,
  ): Promise<ProcessStreamResult> {
    const processOptions = {
      conversationId,
      signal: abortController.signal,
      flushInterval: runtimeRef.current.streamFlushInterval,
      onToolCall: runtimeRef.current.onToolCall,
      onFinish: runtimeRef.current.onFinish,
      onData: runtimeRef.current.onData,
    };
    const result = await processStream(store, stream, processOptions);
    const adapter = runtimeRef.current.adapter;

    if (
      !result.isDisconnect ||
      !result.messageId ||
      !adapter.reconnectToStream ||
      abortController.signal.aborted
    ) {
      return result;
    }

    try {
      store.setStreaming(true);
      const reconnectStream = await adapter.reconnectToStream({
        conversationId,
        messageId: result.messageId,
        signal: abortController.signal,
      });

      if (!reconnectStream || abortController.signal.aborted) {
        store.setStreaming(false);
        return result;
      }

      return await processStream(store, reconnectStream, {
        ...processOptions,
        messageId: result.messageId,
        // Allow any replayed sequence number to apply on the reconnected
        // stream (#5). Without this, chunks the server resends from an
        // earlier point would be silently dropped by the sequence guard.
        reconnectFromSequence: 0,
      });
    } catch (error) {
      store.setStreaming(false);

      if (abortController.signal.aborted) {
        return {
          messageId: result.messageId,
          status: 'cancelled',
          isAbort: true,
          isDisconnect: false,
          isError: false,
        };
      }

      store.setError(
        createRuntimeError(
          'STREAM_ERROR',
          getErrorMessage('Unable to reconnect to the message stream.', error),
          'stream',
          true,
          true,
          {
            messageId: result.messageId,
            conversationId,
          },
        ),
      );

      return {
        messageId: result.messageId,
        status: 'error',
        isAbort: false,
        isDisconnect: true,
        isError: true,
      };
    }
  }

  async function sendExistingMessage(
    message: ChatMessage,
    attachments?: ChatDraftAttachment[],
  ): Promise<void> {
    if (isSending || store.state.isStreaming) {
      return;
    }

    const conversationId = message.conversationId ?? store.state.activeConversationId;
    const nextMessage: ChatMessage = {
      ...message,
      conversationId,
      role: 'user',
      status: 'sending',
    };

    isSending = true;
    store.addMessage(nextMessage);
    store.setStreaming(true);
    store.setError(null);

    if (attachments && attachments.length > 0) {
      attachmentsByUserMessageId.set(nextMessage.id, attachments);
    } else {
      attachmentsByUserMessageId.delete(nextMessage.id);
    }

    const abortController = new AbortController();
    store.setActiveStreamAbortController(abortController);

    try {
      const stream = await runtimeRef.current.adapter.sendMessage({
        conversationId,
        message: nextMessage,
        messages: getMessages(storeUnknown),
        attachments,
        signal: abortController.signal,
      });

      const result = await processStreamWithReconnect(stream, conversationId, abortController);

      let status: 'cancelled' | 'error' | 'sent';
      if (result.status === 'cancelled') {
        status = 'cancelled';
      } else if (result.status === 'error') {
        status = 'error';
      } else {
        status = 'sent';
      }
      store.updateMessage(nextMessage.id, { status });

      if (status === 'sent') {
        attachmentsByUserMessageId.delete(nextMessage.id);
      }

      if (result.messageId) {
        assistantMessageIdByUserMessageIdRef.current.set(nextMessage.id, result.messageId);
      }

      if (result.isError && store.state.error) {
        runtimeRef.current.onError?.(store.state.error);
      }
    } catch (error) {
      store.updateMessage(nextMessage.id, {
        status: abortController.signal.aborted ? 'cancelled' : 'error',
      });

      if (abortController.signal.aborted) {
        store.setStreaming(false);
        return;
      }

      if (store.state.error?.source === 'stream') {
        runtimeRef.current.onError?.(store.state.error);
        return;
      }

      setRuntimeError(
        createRuntimeError(
          'SEND_ERROR',
          getErrorMessage('Unable to send the message.', error),
          'send',
          true,
          true,
          {
            messageId: nextMessage.id,
            conversationId,
          },
        ),
      );
      store.setStreaming(false);
    } finally {
      isSending = false;
      if (store.state.activeStreamAbortController === abortController) {
        store.setActiveStreamAbortController(null);
      }
    }
  }

  async function sendMessage(input: UseChatSendMessageInput): Promise<void> {
    const message: ChatMessage = {
      id: input.id ?? createLocalId(),
      conversationId: input.conversationId ?? store.state.activeConversationId,
      role: 'user',
      parts: input.parts,
      metadata: input.metadata,
      author: input.author,
      createdAt: input.createdAt ?? new Date().toISOString(),
    };

    await sendExistingMessage(message, input.attachments);
  }

  async function retry(messageId: string): Promise<void> {
    // Hoist the streaming guard above any destructive work so retrying while a
    // stream is in flight is a clean no-op rather than wiping prior assistant
    // messages and then silently bailing inside `sendExistingMessage` (#2).
    if (isSending || store.state.isStreaming) {
      return;
    }

    const message = store.state.messagesById[messageId];

    if (!message || message.role !== 'user') {
      return;
    }

    const assistantMessageIds = findAssistantMessageIdsForRetry(
      storeUnknown,
      messageId,
      assistantMessageIdByUserMessageIdRef.current,
    );

    removeAssistantMessageIds(
      storeUnknown,
      assistantMessageIds,
      assistantMessageIdByUserMessageIdRef.current,
    );

    await sendExistingMessage(message, attachmentsByUserMessageId.get(messageId));
  }

  return { sendMessage, retry };
}
