import type { ChatStore } from '../store/ChatStore';
import type { ChatMessage } from '../types/chat-entities';
import type { ChatMessagePart } from '../types/chat-message-parts';

export function getOrCreateMessage(
  store: ChatStore<unknown>,
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

  const resolvedAuthor = author ?? store.assistantUser;
  const nextMessage: ChatMessage = {
    id: messageId,
    conversationId,
    role: 'assistant',
    parts: [],
    status: 'streaming',
    ...(resolvedAuthor ? { author: resolvedAuthor } : undefined),
  };

  store.addMessage(nextMessage);
  return store.state.messagesById[messageId] ?? nextMessage;
}

export function getFinishMessage(
  store: ChatStore<unknown>,
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

export function finalizeStreamingParts(parts: ChatMessagePart[]): ChatMessagePart[] {
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

export function updateMessageParts(
  store: ChatStore<unknown>,
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

export function updateMessage(
  store: ChatStore<unknown>,
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

export function findLastStreamingPartIndex(parts: ChatMessagePart[], type: 'text' | 'reasoning') {
  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const part = parts[index];

    if (part.type === type && part.state === 'streaming') {
      return index;
    }
  }

  return -1;
}
