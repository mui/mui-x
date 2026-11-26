import type { ChatMessage } from '../../types/chat-entities';

// Enough to rebuild the recent tail of a thread the user is not viewing, while
// keeping memory bounded when a busy conversation streams events for a long time.
export const REALTIME_MESSAGE_BUFFER_LIMIT = 50;

interface BufferedRecord {
  message: ChatMessage;
  // Only `message-updated` events were received: merge onto the stored copy, like `updateMessage`.
  isUpdate: boolean;
}

interface BufferedMessage {
  // Received before the conversation's current `listMessages` request was sent.
  held?: BufferedRecord;
  // Received after it was sent, so newer than its result.
  live?: BufferedRecord;
}

function mergeRecord(
  record: BufferedRecord | undefined,
  message: ChatMessage,
  isUpdate: boolean,
): BufferedRecord {
  return isUpdate && record
    ? { message: { ...record.message, ...message }, isUpdate: record.isUpdate }
    : { message, isUpdate };
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

    const entry = messages.get(message.id) ?? {};
    // Once live, later events stay after it; `markStale` folds them into `held` in order.
    if (isLive || entry.live) {
      entry.live = mergeRecord(entry.live, message, isUpdate);
    } else {
      entry.held = mergeRecord(entry.held, message, isUpdate);
    }

    // Updating a key keeps its position, so only a new message can exceed the limit.
    messages.set(message.id, entry);
    if (messages.size > REALTIME_MESSAGE_BUFFER_LIMIT) {
      const oldestId = messages.keys().next().value;
      if (oldestId !== undefined) {
        messages.delete(oldestId);
      }
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

  // Called when a `listMessages` request starts: everything buffered so far is older than its result.
  function markStale(conversationId: string) {
    byConversation.get(conversationId)?.forEach((entry) => {
      if (entry.live) {
        entry.held = mergeRecord(entry.held, entry.live.message, entry.live.isUpdate);
        delete entry.live;
      }
    });
  }

  /**
   * Returns `messages` with the conversation's buffered messages applied, then clears them.
   * Listed messages win over held ones, and live ones win over both.
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

    buffered.forEach(({ held, live }, id) => {
      if (held && !hasMore && !merged.has(id)) {
        merged.set(id, held.message);
      }

      if (live) {
        const base = merged.get(id);

        if (base) {
          merged.set(id, live.isUpdate ? { ...base, ...live.message } : live.message);
        } else if (!hasMore || !live.isUpdate) {
          merged.set(id, live.message);
        }
      }
    });

    return Array.from(merged.values());
  }

  return { add, remove, clear, clearAll, markStale, flush };
}

export type RealtimeMessageBuffer = ReturnType<typeof createRealtimeMessageBuffer>;
