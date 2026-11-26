import type { ChatMessage } from '../../types/chat-entities';

// Enough to rebuild the recent tail of a thread the user is not viewing, while
// keeping memory bounded when a busy conversation streams events for a long time.
export const REALTIME_MESSAGE_BUFFER_LIMIT = 50;

/**
 * Holds realtime messages for conversations other than the active one,
 * until that conversation is loaded.
 */
export function createRealtimeMessageBuffer() {
  const byConversation = new Map<string, Map<string, ChatMessage>>();

  // `message-updated` merges like `updateMessage`; `message-added` replaces like `addMessage`.
  function add(conversationId: string, message: ChatMessage, isUpdate: boolean) {
    let messages = byConversation.get(conversationId);

    if (!messages) {
      messages = new Map();
      byConversation.set(conversationId, messages);
    }

    const existing = messages.get(message.id);

    // Updating a key keeps its position, so only a new message can exceed the limit.
    messages.set(message.id, isUpdate && existing ? { ...existing, ...message } : message);
    if (messages.size > REALTIME_MESSAGE_BUFFER_LIMIT) {
      const oldestId = messages.keys().next().value;
      if (oldestId !== undefined) {
        messages.delete(oldestId);
      }
    }
  }

  // Keeps a buffered copy in step with an event applied to the store instead.
  function updateIfPresent(message: ChatMessage, isUpdate: boolean) {
    const { conversationId } = message;

    if (conversationId != null && byConversation.get(conversationId)?.has(message.id)) {
      add(conversationId, message, isUpdate);
    }
  }

  function remove(messageId: string, conversationId: string | undefined) {
    for (const id of conversationId != null ? [conversationId] : byConversation.keys()) {
      const messages = byConversation.get(id);

      if (messages?.delete(messageId) && messages.size === 0) {
        byConversation.delete(id);
      }
    }
  }

  function clear(conversationId: string) {
    byConversation.delete(conversationId);
  }

  function clearAll() {
    byConversation.clear();
  }

  /**
   * Returns `messages` with the conversation's buffered messages applied, then clears them.
   * `messages` wins for ids it contains: it was fetched after the buffered events arrived.
   * A missing message is appended in arrival order, like `addMessage`, only when `messages` is
   * the whole conversation. Otherwise it may be older than the page, and loading older history
   * brings it.
   */
  function flush(conversationId: string, messages: ChatMessage[], hasMore: boolean): ChatMessage[] {
    const buffered = byConversation.get(conversationId);
    byConversation.delete(conversationId);

    if (!buffered || hasMore) {
      return messages;
    }

    const ids = new Set(messages.map((message) => message.id));
    const missing = Array.from(buffered.values()).filter((message) => !ids.has(message.id));

    return missing.length > 0 ? [...messages, ...missing] : messages;
  }

  return { add, updateIfPresent, remove, clear, clearAll, flush };
}

export type RealtimeMessageBuffer = ReturnType<typeof createRealtimeMessageBuffer>;
