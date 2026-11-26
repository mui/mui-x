import type { ChatMessage } from '../../types/chat-entities';

// Enough to rebuild the recent tail of a thread the user is not viewing, while
// keeping memory bounded when a busy conversation streams events for a long time.
export const REALTIME_MESSAGE_BUFFER_LIMIT = 50;

interface BufferedMessage {
  message: ChatMessage;
  // Received after the conversation's current `listMessages` request was sent, so newer than its result.
  isLive: boolean;
}

/**
 * Holds realtime messages for conversations whose thread is not in the store,
 * until that conversation is loaded.
 */
export function createRealtimeMessageBuffer() {
  const byConversation = new Map<string, Map<string, BufferedMessage>>();

  function add(conversationId: string, message: ChatMessage, isLive: boolean) {
    let messages = byConversation.get(conversationId);

    if (!messages) {
      messages = new Map();
      byConversation.set(conversationId, messages);
    }

    if (!messages.has(message.id) && messages.size >= REALTIME_MESSAGE_BUFFER_LIMIT) {
      const oldestId = messages.keys().next().value;
      if (oldestId !== undefined) {
        messages.delete(oldestId);
      }
    }

    messages.set(message.id, { message, isLive });
  }

  function remove(messageId: string) {
    byConversation.forEach((messages) => messages.delete(messageId));
  }

  function clear(conversationId: string) {
    byConversation.delete(conversationId);
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
   * New messages are appended in arrival order, like `addMessage`.
   */
  function flush(conversationId: string, messages: ChatMessage[]): ChatMessage[] {
    const buffered = byConversation.get(conversationId);
    byConversation.delete(conversationId);

    if (!buffered) {
      return messages;
    }

    const merged = [...messages];
    const indexById = new Map(merged.map((message, index) => [message.id, index]));

    buffered.forEach(({ message, isLive }) => {
      const index = indexById.get(message.id);

      if (index === undefined) {
        merged.push(message);
      } else if (isLive) {
        merged[index] = message;
      }
    });

    return merged;
  }

  return { add, remove, clear, markStale, flush };
}

export type RealtimeMessageBuffer = ReturnType<typeof createRealtimeMessageBuffer>;
