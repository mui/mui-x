import type { ChatStore } from '../../store';
import type { ChatMessage } from '../../types';
import type { ChatError, ChatErrorCode } from '../../types/chat-error';
import type { ChatRealtimeEvent } from '../../types/chat-realtime';

export function getMessages(store: ChatStore<unknown>): ChatMessage[] {
  return store.state.messageIds
    .map((id) => store.state.messagesById[id])
    .filter((message): message is ChatMessage => message != null);
}

export function createRuntimeError(
  code: ChatErrorCode,
  message: string,
  source: ChatError['source'],
  recoverable: boolean,
  retryable = false,
  details?: Record<string, unknown>,
): ChatError {
  return {
    code,
    message,
    source,
    recoverable,
    retryable,
    details,
  };
}

export function getErrorMessage(fallbackMessage: string, error: unknown): string {
  return error instanceof Error && error.message ? error.message : fallbackMessage;
}

export function getMessageIdFromError(error: ChatError | null): string | undefined {
  const messageId = error?.details?.messageId;

  return typeof messageId === 'string' && messageId !== '' ? messageId : undefined;
}

export function findAssistantMessageIdsForRetry(
  store: ChatStore<unknown>,
  userMessageId: string,
  assistantMessageIdByUserMessageId: Map<string, string>,
): string[] {
  const mappedAssistantMessageId = assistantMessageIdByUserMessageId.get(userMessageId);

  if (mappedAssistantMessageId) {
    return [mappedAssistantMessageId];
  }

  const userMessageIndex = store.state.messageIds.indexOf(userMessageId);

  if (userMessageIndex === -1) {
    return [];
  }

  const assistantMessageIds: string[] = [];

  for (let index = userMessageIndex + 1; index < store.state.messageIds.length; index += 1) {
    const nextMessageId = store.state.messageIds[index];
    const nextMessage = store.state.messagesById[nextMessageId];

    if (!nextMessage) {
      continue;
    }

    if (nextMessage.role === 'user') {
      break;
    }

    if (nextMessage.role === 'assistant') {
      assistantMessageIds.push(nextMessage.id);
    }
  }

  return assistantMessageIds;
}

export function removeAssistantMessageIds(
  store: ChatStore<unknown>,
  assistantMessageIds: string[],
  assistantMessageIdByUserMessageId: Map<string, string>,
) {
  if (assistantMessageIds.length === 0) {
    return;
  }

  const removedIds = new Set(assistantMessageIds);

  for (const assistantMessageId of assistantMessageIds) {
    store.removeMessage(assistantMessageId);
  }

  for (const [userMessageId, assistantMessageId] of assistantMessageIdByUserMessageId.entries()) {
    if (removedIds.has(assistantMessageId)) {
      assistantMessageIdByUserMessageId.delete(userMessageId);
    }
  }
}

export function applyPresenceUpdate(
  store: ChatStore<unknown>,
  event: Extract<ChatRealtimeEvent, { type: 'presence' }>,
) {
  for (const conversationId of store.state.conversationIds) {
    const conversation = store.state.conversationsById[conversationId];

    if (!conversation?.participants?.length) {
      continue;
    }

    let didChange = false;
    const participants = conversation.participants.map((participant) => {
      if (participant.id !== event.userId || participant.isOnline === event.isOnline) {
        return participant;
      }
      didChange = true;
      return { ...participant, isOnline: event.isOnline };
    });

    if (didChange) {
      store.updateConversation(conversationId, { participants });
    }
  }
}

export function applyReadUpdate(
  store: ChatStore<unknown>,
  event: Extract<ChatRealtimeEvent, { type: 'read' }>,
) {
  const conversation = store.state.conversationsById[event.conversationId];

  if (!conversation) {
    return;
  }

  store.updateConversation(event.conversationId, {
    readState: 'read',
    unreadCount: 0,
  });
}
