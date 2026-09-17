import type * as React from 'react';
import { warnOnce } from '@mui/x-internals/warning';
import type { ChatAdapter } from '../../adapters';
import { processStream } from '../../stream';
import type { ProcessStreamResult } from '../../stream';
import type { ChatStore } from '../../store';
import type {
  ChatMessage,
  ChatOnData,
  ChatOnError,
  ChatOnFinish,
  ChatOnToolCall,
} from '../../types';
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
  resolveRegenerateAnchor,
} from './useChatControllerHelpers';
import { getFinishMessage } from '../../stream/streamHelpers';

export interface SendMessageActionsRuntimeRef<Cursor = string> {
  adapter: ChatAdapter<Cursor>;
  streamFlushInterval?: number;
  onToolCall?: ChatOnToolCall;
  onFinish?: ChatOnFinish;
  onData?: ChatOnData;
  onError?: ChatOnError;
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

  function pruneAttachmentsByMessageIds(messageIds: readonly string[]) {
    if (attachmentsByUserMessageId.size === 0) {
      return;
    }

    const activeMessageIds = new Set(messageIds);

    for (const messageId of attachmentsByUserMessageId.keys()) {
      if (!activeMessageIds.has(messageId)) {
        attachmentsByUserMessageId.delete(messageId);
      }
    }
  }

  async function processStreamWithReconnect(
    stream: Awaited<ReturnType<ChatAdapter<Cursor>['sendMessage']>>,
    conversationId: string | undefined,
    abortController: AbortController,
    fallbackMessageId: string,
  ): Promise<ProcessStreamResult> {
    const adapter = runtimeRef.current.adapter;
    const shouldDeferFinish = Boolean(adapter.reconnectToStream);
    const processOptions = {
      conversationId,
      signal: abortController.signal,
      flushInterval: runtimeRef.current.streamFlushInterval,
      onToolCall: runtimeRef.current.onToolCall,
      onFinish: shouldDeferFinish ? undefined : runtimeRef.current.onFinish,
      onData: runtimeRef.current.onData,
      // Unique-per-run fallback the stream binds to when the adapter omits a
      // `messageId` on `start`. A backend-supplied id still overrides it (see
      // processStream's `start` handler), so this only fills the gap — but it
      // guarantees each run targets a distinct assistant message even when the
      // adapter mints no id, instead of all such runs colliding on one id.
      messageId: fallbackMessageId,
    };
    const emitDeferredFinish = async (result: ProcessStreamResult) => {
      if (!shouldDeferFinish || !runtimeRef.current.onFinish) {
        return;
      }

      await runtimeRef.current.onFinish({
        message: getFinishMessage(storeUnknown, result.messageId, conversationId, result.status),
        messages: getMessages(storeUnknown),
        isAbort: result.isAbort,
        isDisconnect: result.isDisconnect,
        isError: result.isError,
        finishReason: result.finishReason,
      });
    };

    const result = await processStream(store, stream, processOptions);

    if (
      !result.isDisconnect ||
      !result.messageId ||
      !adapter.reconnectToStream ||
      abortController.signal.aborted
    ) {
      await emitDeferredFinish(result);
      return result;
    }

    try {
      store.setStreaming(true, conversationId);
      const reconnectStream = await adapter.reconnectToStream({
        conversationId,
        messageId: result.messageId,
        signal: abortController.signal,
      });

      if (!reconnectStream || abortController.signal.aborted) {
        store.setStreaming(false);
        await emitDeferredFinish(result);
        return result;
      }

      return await processStream(store, reconnectStream, {
        ...processOptions,
        onFinish: runtimeRef.current.onFinish,
        messageId: result.messageId,
        reconnectFromSequence: result.nextSequence,
        seenEventIds: result.seenEventIds,
      });
    } catch (error) {
      store.setStreaming(false);

      if (abortController.signal.aborted) {
        const cancelledResult: ProcessStreamResult = {
          messageId: result.messageId,
          status: 'cancelled',
          isAbort: true,
          isDisconnect: false,
          isError: false,
        };
        await emitDeferredFinish(cancelledResult);
        return cancelledResult;
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

      const errorResult: ProcessStreamResult = {
        messageId: result.messageId,
        status: 'error',
        isAbort: false,
        isDisconnect: true,
        isError: true,
      };
      await emitDeferredFinish(errorResult);
      return errorResult;
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
    store.setStreaming(true, conversationId);
    store.setError(null);
    store.clearMessageError(nextMessage.id);

    if (attachments && attachments.length > 0) {
      attachmentsByUserMessageId.set(nextMessage.id, attachments);
    } else {
      attachmentsByUserMessageId.delete(nextMessage.id);
    }

    const abortController = new AbortController();
    store.setActiveStreamAbortController(abortController);

    // Unique fallback id for this run; used only when the adapter's `start`
    // chunk carries no `messageId` of its own.
    const fallbackMessageId = createLocalId();

    try {
      const stream = await runtimeRef.current.adapter.sendMessage({
        conversationId,
        message: nextMessage,
        messages: getMessages(storeUnknown),
        attachments,
        signal: abortController.signal,
      });

      const result = await processStreamWithReconnect(
        stream,
        conversationId,
        abortController,
        fallbackMessageId,
      );

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
        store.clearMessageError(nextMessage.id);
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
        (() => {
          const runtimeError = createRuntimeError(
            'SEND_ERROR',
            getErrorMessage('Unable to send the message.', error),
            'send',
            true,
            true,
            {
              messageId: nextMessage.id,
              conversationId,
            },
          );

          store.setMessageError(nextMessage.id, runtimeError);
          return runtimeError;
        })(),
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
    pruneAttachmentsByMessageIds(store.state.messageIds);

    await sendExistingMessage(message, attachmentsByUserMessageId.get(messageId));
  }

  async function regenerate(messageId: string): Promise<void> {
    // Hoist the streaming guard above any destructive work — same as `retry`.
    if (isSending || store.state.isStreaming) {
      return;
    }

    const resolution = resolveRegenerateAnchor(
      storeUnknown,
      messageId,
      assistantMessageIdByUserMessageIdRef.current,
    );

    if (!resolution) {
      if (process.env.NODE_ENV !== 'production') {
        warnOnce([
          'MUI X Chat: `regenerate()` could not resolve the target message.',
          'The id must reference an assistant reply (or the user message that prompted it); regeneration is skipped, so the UI will not change.',
          'Pass the `message.id` of an assistant message that follows a user message in the active conversation.',
        ]);
      }
      return;
    }

    const { anchorUserMessageId, assistantMessageIds } = resolution;
    const anchorMessage = store.state.messagesById[anchorUserMessageId];

    if (!anchorMessage) {
      return;
    }

    const adapter = runtimeRef.current.adapter;

    // Fallback path: no `adapter.regenerate` — remove the resolved run and
    // re-send the anchor user message through the existing send pipeline. This
    // makes `regenerate` work against any adapter; `adapter.regenerate` is an
    // opt-in transport refinement. `sendExistingMessage`'s own postlude provides
    // the `onError` behavior here.
    if (!adapter.regenerate) {
      removeAssistantMessageIds(
        storeUnknown,
        assistantMessageIds,
        assistantMessageIdByUserMessageIdRef.current,
      );
      pruneAttachmentsByMessageIds(store.state.messageIds);

      await sendExistingMessage(anchorMessage, attachmentsByUserMessageId.get(anchorUserMessageId));
      return;
    }

    // Adapter path. Set `isSending` synchronously, before any `await`, so the
    // Strict Mode double-invocation guard is effective (the same failure mode
    // the flag defeats in `sendExistingMessage`).
    isSending = true;

    const conversationId = anchorMessage.conversationId ?? store.state.activeConversationId;

    // Snapshot the assistant-run messages so we can roll back if the adapter
    // call rejects before any output streams (rollback precedent:
    // `addToolApprovalResponse`).
    const removedMessages = assistantMessageIds
      .map((id) => store.state.messagesById[id])
      .filter((message): message is ChatMessage => message != null);

    removeAssistantMessageIds(
      storeUnknown,
      assistantMessageIds,
      assistantMessageIdByUserMessageIdRef.current,
    );
    pruneAttachmentsByMessageIds(store.state.messageIds);

    store.setStreaming(true, conversationId);
    store.setError(null);

    const abortController = new AbortController();
    store.setActiveStreamAbortController(abortController);

    // Fresh fallback id: the prior assistant run was just removed above, so a
    // regenerated reply with no adapter-supplied id targets a new message.
    const fallbackMessageId = createLocalId();

    try {
      const stream = await adapter.regenerate({
        conversationId,
        messageId,
        message: anchorMessage,
        messages: getMessages(storeUnknown),
        signal: abortController.signal,
      });

      const result = await processStreamWithReconnect(
        stream,
        conversationId,
        abortController,
        fallbackMessageId,
      );

      if (result.messageId) {
        assistantMessageIdByUserMessageIdRef.current.set(anchorUserMessageId, result.messageId);
      }

      // Postlude (mirrors `sendExistingMessage` — `processStreamWithReconnect`
      // never fires `onError` itself): surface mid-stream errors through the
      // public callback. Partial output is kept with the stream-reported status.
      if (result.isError && store.state.error) {
        runtimeRef.current.onError?.(store.state.error);
      }
    } catch (error) {
      if (abortController.signal.aborted) {
        store.setStreaming(false);
        return;
      }

      if (store.state.error?.source === 'stream') {
        runtimeRef.current.onError?.(store.state.error);
        return;
      }

      // Pre-stream rejection: restore the snapshot assistant messages (D4) and
      // surface a REGENERATE_ERROR.
      for (const removedMessage of removedMessages) {
        store.addMessage(removedMessage);
      }

      store.setStreaming(false);
      setRuntimeError(
        createRuntimeError(
          'REGENERATE_ERROR',
          getErrorMessage('Unable to regenerate the response.', error),
          'send',
          true,
          true,
          {
            messageId,
            conversationId,
          },
        ),
      );
    } finally {
      isSending = false;
      if (store.state.activeStreamAbortController === abortController) {
        store.setActiveStreamAbortController(null);
      }
    }
  }

  return { sendMessage, retry, regenerate, pruneAttachmentsByMessageIds };
}
