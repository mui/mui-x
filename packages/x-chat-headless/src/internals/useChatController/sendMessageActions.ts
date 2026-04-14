import * as React from 'react';
import type { ChatAdapter } from '../../adapters';
import { processStream } from '../../stream';
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

      const result = await processStream(store, stream, {
        conversationId,
        signal: abortController.signal,
        flushInterval: runtimeRef.current.streamFlushInterval,
        onToolCall: runtimeRef.current.onToolCall,
        onFinish: runtimeRef.current.onFinish,
        onData: runtimeRef.current.onData,
      });

      let status: 'cancelled' | 'error' | 'sent';
      if (result.status === 'cancelled') {
        status = 'cancelled';
      } else if (result.status === 'error') {
        status = 'error';
      } else {
        status = 'sent';
      }
      store.updateMessage(nextMessage.id, { status });

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

    await sendExistingMessage(message);
  }

  return { sendMessage, retry };
}
