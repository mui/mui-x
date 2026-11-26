import type { ChatMessage } from '../../types/chat-entities';

// Enough to rebuild the recent tail of a thread the user is not viewing, while
// keeping memory bounded when a busy conversation streams events for a long time.
export const REALTIME_MESSAGE_BUFFER_LIMIT = 50;

interface BufferedMessage {
  message: ChatMessage;
  // Received after the conversation's current `listMessages` request was sent, so newer than its result.
  isLive: boolean;
  // Only `message-updated` events were received: merge onto the stored copy, like `updateMessage`.
  isUpdate: boolean;
}

/**
 * Holds realtime messages for conversations whose thread is not in the store,
 * until that conversation is loaded.
 */
export function createRealtimeMessageBuffer() {
  const byConversation = new Map<string, Map<string, BufferedMessage>>();

  function add(
    conversationId: string,
    message: ChatMessage,
    { isLive, isUpdate }: { isLive: boolean; isUpdate: boolean },
  ) {
    let messages = byConversation.get(conversationId);

    if (!messages) {
      messages = new Map();
      byConversation.set(conversationId, messages);
    }

    const existing = messages.get(message.id);

    // Updating a key keeps its position, so only a new message can exceed the limit.
    messages.set(
      message.id,
      isUpdate && existing
        ? { message: { ...existing.message, ...message }, isLive, isUpdate: existing.isUpdate }
        : { message, isLive, isUpdate },
    );
    if (messages.size > REALTIME_MESSAGE_BUFFER_LIMIT) {
      const oldestId = messages.keys().next().value;
      if (oldestId !== undefined) {
        messages.delete(oldestId);
      }
    }
  }

  function remove(messageId: string, conversationId: string | undefined) {
    const conversationIds =
      conversationId != null ? [conversationId] : Array.from(byConversation.keys());

    conversationIds.forEach((id) => {
      const messages = byConversation.get(id);

      if (messages?.delete(messageId) && messages.size === 0) {
        byConversation.delete(id);
      }
    });
  }

  function clear(conversationId: string) {
    byConversation.delete(conversationId);
  }

  function clearAll() {
    byConversation.clear();
  }

  // Called when a `listMessages` request starts: everything buffered so far is older than its result.
  function markStale(conversationId: string) {
    byConversation.get(conversationId)?.forEach((entry) => {
      entry.isLive = false;
    });
  }

  /**
   * Returns `messages` with the conversation's buffered messages applied, then clears them.
   * A buffered message replaces a listed one with the same id only when it is live.
   * A message missing from `messages` is appended in arrival order, like `addMessage`, when
   * `messages` is the whole conversation or it was added live. Otherwise it may be older
   * than the page, and loading older history brings it.
   */
  function flush(conversationId: string, messages: ChatMessage[], hasMore: boolean): ChatMessage[] {
    const buffered = byConversation.get(conversationId);
    byConversation.delete(conversationId);

    if (!buffered) {
      return messages;
    }

    // Replacing a key keeps its position; a new key is appended.
    const merged = new Map(messages.map((message) => [message.id, message]));

    buffered.forEach(({ message, isLive, isUpdate }) => {
      const listed = merged.get(message.id);

      if (listed) {
        if (isLive) {
          merged.set(message.id, isUpdate ? { ...listed, ...message } : message);
        }
      } else if (!hasMore || (isLive && !isUpdate)) {
        merged.set(message.id, message);
      }
    });

    return Array.from(merged.values());
  }

  return { add, remove, clear, clearAll, markStale, flush };
}

export type RealtimeMessageBuffer = ReturnType<typeof createRealtimeMessageBuffer>;
