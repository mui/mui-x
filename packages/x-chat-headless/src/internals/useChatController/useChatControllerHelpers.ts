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

/**
 * Resolve the anchor and assistant run for a `regenerate(messageId)` call.
 *
 * Unlike {@link findAssistantMessageIdsForRetry}, this never short-circuits to
 * the single mapped assistant id: when one send streamed multiple assistant
 * messages, the mapped id is only one of them, and regenerating a non-mapped
 * sibling must still clear the whole run (otherwise the clicked message could
 * survive its own regeneration). The map is treated as a hint to union in.
 *
 * - assistant message id → walk backwards to the nearest preceding `role ===
 *   'user'` message (the anchor); the run is the union of the contiguous forward
 *   scan from the anchor and the mapped id (if any).
 * - user message id → tolerated: the message itself is the anchor; the run is
 *   resolved with the same union semantics (regenerate ≙ retry with corrected
 *   run resolution).
 * - unknown id, or assistant message with no preceding user message → `null`.
 */
export function resolveRegenerateAnchor(
  store: ChatStore<unknown>,
  messageId: string,
  assistantMessageIdByUserMessageId: Map<string, string>,
): { anchorUserMessageId: string; assistantMessageIds: string[] } | null {
  const message = store.state.messagesById[messageId];

  if (!message) {
    return null;
  }

  const messageIndex = store.state.messageIds.indexOf(messageId);

  if (messageIndex === -1) {
    return null;
  }

  let anchorUserMessageId: string | undefined;

  if (message.role === 'user') {
    anchorUserMessageId = messageId;
  } else {
    // Walk backwards to the nearest preceding user message.
    for (let index = messageIndex - 1; index >= 0; index -= 1) {
      const candidateId = store.state.messageIds[index];
      const candidate = store.state.messagesById[candidateId];

      if (candidate?.role === 'user') {
        anchorUserMessageId = candidateId;
        break;
      }
    }
  }

  if (anchorUserMessageId === undefined) {
    return null;
  }

  const anchorIndex = store.state.messageIds.indexOf(anchorUserMessageId);
  const assistantMessageIds = new Set<string>();

  // Contiguous forward scan from the anchor: every assistant message until the
  // next user message.
  for (let index = anchorIndex + 1; index < store.state.messageIds.length; index += 1) {
    const nextMessageId = store.state.messageIds[index];
    const nextMessage = store.state.messagesById[nextMessageId];

    if (!nextMessage) {
      continue;
    }

    if (nextMessage.role === 'user') {
      break;
    }

    if (nextMessage.role === 'assistant') {
      assistantMessageIds.add(nextMessage.id);
    }
  }

  // Union in the mapped id (if any) — never as a substitute for the scan.
  const mappedAssistantMessageId = assistantMessageIdByUserMessageId.get(anchorUserMessageId);
  if (mappedAssistantMessageId && store.state.messagesById[mappedAssistantMessageId]) {
    assistantMessageIds.add(mappedAssistantMessageId);
  }

  return {
    anchorUserMessageId,
    assistantMessageIds: Array.from(assistantMessageIds),
  };
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
