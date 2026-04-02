import { describe, expect, it } from 'vitest';
import { ChatStore } from '../../store/ChatStore';
import type { ChatMessage, ChatConversation } from '../../types/chat-entities';
import {
  getMessages,
  createRuntimeError,
  getErrorMessage,
  findAssistantMessageIdsForRetry,
  removeAssistantMessageIds,
  applyPresenceUpdate,
  applyReadUpdate,
} from './useChatControllerHelpers';

// Cast helper — the helpers accept ChatStore<unknown> but our store is ChatStore<string>.
// processStream does the same cast internally with `as unknown as ChatStore<unknown>`.
function asUnknown(store: ChatStore): ChatStore<unknown> {
  return store as unknown as ChatStore<unknown>;
}

const userMessage: ChatMessage = {
  id: 'u1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello' }],
};

const assistantMessage1: ChatMessage = {
  id: 'a1',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'Hi' }],
};

const assistantMessage2: ChatMessage = {
  id: 'a2',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'More' }],
};

const userMessage2: ChatMessage = {
  id: 'u2',
  role: 'user',
  parts: [{ type: 'text', text: 'Follow-up' }],
};

describe('useChatControllerHelpers', () => {
  describe('getMessages', () => {
    it('returns ordered messages from the store', () => {
      const store = new ChatStore({
        initialMessages: [userMessage, assistantMessage1],
      });

      const messages = getMessages(asUnknown(store));

      expect(messages).toEqual([userMessage, assistantMessage1]);
    });

    it('filters null entries when messageIds reference missing messages', () => {
      const store = new ChatStore({
        initialMessages: [userMessage, assistantMessage1],
      });

      // Simulate a dangling reference by directly removing from messagesById
      store.removeMessage('a1');
      store.addMessage(userMessage2);

      const messages = getMessages(asUnknown(store));

      expect(messages.map((m) => m.id)).toEqual(['u1', 'u2']);
    });

    it('returns empty array for an empty store', () => {
      const store = new ChatStore();

      const messages = getMessages(asUnknown(store));

      expect(messages).toEqual([]);
    });
  });

  describe('createRuntimeError', () => {
    it('returns a ChatError with all fields', () => {
      const error = createRuntimeError('SEND_ERROR', 'Failed to send', 'send', true, true, {
        messageId: 'u1',
      });

      expect(error).toEqual({
        code: 'SEND_ERROR',
        message: 'Failed to send',
        source: 'send',
        recoverable: true,
        retryable: true,
        details: { messageId: 'u1' },
      });
    });

    it('includes details when provided', () => {
      const error = createRuntimeError('STREAM_ERROR', 'Stream broke', 'stream', false, false, {
        streamId: 's1',
        chunkIndex: 42,
      });

      expect(error.details).toEqual({ streamId: 's1', chunkIndex: 42 });
    });

    it('defaults retryable to false', () => {
      const error = createRuntimeError('HISTORY_ERROR', 'Cannot load', 'history', true);

      expect(error.retryable).toBe(false);
      expect(error.details).toBeUndefined();
    });
  });

  describe('getErrorMessage', () => {
    it('returns error.message for Error instances', () => {
      const result = getErrorMessage('fallback', new Error('Network error'));

      expect(result).toBe('Network error');
    });

    it('returns fallback for non-Error values', () => {
      expect(getErrorMessage('fallback', 'some string')).toBe('fallback');
      expect(getErrorMessage('fallback', 42)).toBe('fallback');
      expect(getErrorMessage('fallback', { message: 'not an error' })).toBe('fallback');
    });

    it('returns fallback for null and undefined', () => {
      expect(getErrorMessage('fallback', null)).toBe('fallback');
      expect(getErrorMessage('fallback', undefined)).toBe('fallback');
    });

    it('returns fallback for Error with empty message', () => {
      expect(getErrorMessage('fallback', new Error(''))).toBe('fallback');
    });
  });

  describe('findAssistantMessageIdsForRetry', () => {
    it('returns mapped id from the Map when available', () => {
      const store = new ChatStore({
        initialMessages: [userMessage, assistantMessage1],
      });
      const map = new Map([['u1', 'a1']]);

      const ids = findAssistantMessageIdsForRetry(asUnknown(store), 'u1', map);

      expect(ids).toEqual(['a1']);
    });

    it('scans consecutive assistant messages after the user message', () => {
      const store = new ChatStore({
        initialMessages: [userMessage, assistantMessage1, assistantMessage2],
      });
      const map = new Map<string, string>();

      const ids = findAssistantMessageIdsForRetry(asUnknown(store), 'u1', map);

      expect(ids).toEqual(['a1', 'a2']);
    });

    it('stops scanning at the next user message', () => {
      const store = new ChatStore({
        initialMessages: [userMessage, assistantMessage1, userMessage2, assistantMessage2],
      });
      const map = new Map<string, string>();

      const ids = findAssistantMessageIdsForRetry(asUnknown(store), 'u1', map);

      expect(ids).toEqual(['a1']);
    });

    it('returns empty array when user message is not found', () => {
      const store = new ChatStore({
        initialMessages: [userMessage, assistantMessage1],
      });
      const map = new Map<string, string>();

      const ids = findAssistantMessageIdsForRetry(asUnknown(store), 'missing', map);

      expect(ids).toEqual([]);
    });

    it('returns empty array when no assistant messages follow the user message', () => {
      const store = new ChatStore({
        initialMessages: [userMessage],
      });
      const map = new Map<string, string>();

      const ids = findAssistantMessageIdsForRetry(asUnknown(store), 'u1', map);

      expect(ids).toEqual([]);
    });

    it('skips null entries (dangling references) while scanning', () => {
      const store = new ChatStore({
        initialMessages: [userMessage, assistantMessage1, assistantMessage2],
      });
      // Remove the first assistant message from the lookup but leave the ID
      const { a1: _, ...messagesById } = store.state.messagesById;
      void _;
      store.setState({
        ...store.state,
        messagesById,
      });

      const map = new Map<string, string>();
      const ids = findAssistantMessageIdsForRetry(asUnknown(store), 'u1', map);

      expect(ids).toEqual(['a2']);
    });
  });

  describe('removeAssistantMessageIds', () => {
    it('removes messages from the store and cleans Map entries', () => {
      const store = new ChatStore({
        initialMessages: [userMessage, assistantMessage1, assistantMessage2],
      });
      const map = new Map([
        ['u1', 'a1'],
        ['u2', 'a2'],
      ]);

      removeAssistantMessageIds(asUnknown(store), ['a1', 'a2'], map);

      expect(store.state.messageIds).toEqual(['u1']);
      expect(store.state.messagesById.a1).toBeUndefined();
      expect(store.state.messagesById.a2).toBeUndefined();
      expect(map.size).toBe(0);
    });

    it('no-ops when given an empty array', () => {
      const store = new ChatStore({
        initialMessages: [userMessage, assistantMessage1],
      });
      const initialState = store.state;
      const map = new Map([['u1', 'a1']]);

      removeAssistantMessageIds(asUnknown(store), [], map);

      expect(store.state).toBe(initialState);
      expect(map.size).toBe(1);
    });

    it('only cleans Map entries that match removed ids', () => {
      const store = new ChatStore({
        initialMessages: [userMessage, assistantMessage1, assistantMessage2],
      });
      const map = new Map([
        ['u1', 'a1'],
        ['u2', 'a2'],
      ]);

      removeAssistantMessageIds(asUnknown(store), ['a1'], map);

      expect(store.state.messageIds).toEqual(['u1', 'a2']);
      expect(map.size).toBe(1);
      expect(map.get('u2')).toBe('a2');
    });
  });

  describe('applyPresenceUpdate', () => {
    it('updates isOnline across conversations with matching participants', () => {
      const conv1: ChatConversation = {
        id: 'c1',
        title: 'General',
        participants: [
          { id: 'u1', displayName: 'Alice', isOnline: false },
          { id: 'u2', displayName: 'Bob', isOnline: true },
        ],
      };
      const conv2: ChatConversation = {
        id: 'c2',
        title: 'Support',
        participants: [{ id: 'u1', displayName: 'Alice', isOnline: false }],
      };
      const store = new ChatStore({
        initialConversations: [conv1, conv2],
      });

      applyPresenceUpdate(asUnknown(store), { type: 'presence', userId: 'u1', isOnline: true });

      expect(store.state.conversationsById.c1.participants?.[0].isOnline).toBe(true);
      expect(store.state.conversationsById.c1.participants?.[1].isOnline).toBe(true);
      expect(store.state.conversationsById.c2.participants?.[0].isOnline).toBe(true);
    });

    it('skips conversations without participants', () => {
      const conv1: ChatConversation = {
        id: 'c1',
        title: 'General',
      };
      const conv2: ChatConversation = {
        id: 'c2',
        title: 'Support',
        participants: [{ id: 'u1', displayName: 'Alice', isOnline: false }],
      };
      const store = new ChatStore({
        initialConversations: [conv1, conv2],
      });

      applyPresenceUpdate(asUnknown(store), { type: 'presence', userId: 'u1', isOnline: true });

      expect(store.state.conversationsById.c1.participants).toBeUndefined();
      expect(store.state.conversationsById.c2.participants?.[0].isOnline).toBe(true);
    });

    it('no-ops when the participant already has the same value', () => {
      const conv: ChatConversation = {
        id: 'c1',
        title: 'General',
        participants: [{ id: 'u1', displayName: 'Alice', isOnline: true }],
      };
      const store = new ChatStore({
        initialConversations: [conv],
      });
      const stateBefore = store.state;

      applyPresenceUpdate(asUnknown(store), { type: 'presence', userId: 'u1', isOnline: true });

      expect(store.state.conversationsById).toBe(stateBefore.conversationsById);
    });

    it('no-ops when userId is not found among any participants', () => {
      const conv: ChatConversation = {
        id: 'c1',
        title: 'General',
        participants: [{ id: 'u1', displayName: 'Alice', isOnline: false }],
      };
      const store = new ChatStore({
        initialConversations: [conv],
      });
      const stateBefore = store.state;

      applyPresenceUpdate(asUnknown(store), {
        type: 'presence',
        userId: 'unknown',
        isOnline: true,
      });

      expect(store.state.conversationsById).toBe(stateBefore.conversationsById);
    });
  });

  describe('applyReadUpdate', () => {
    it('sets readState and unreadCount on the conversation', () => {
      const conv: ChatConversation = {
        id: 'c1',
        title: 'General',
        unreadCount: 5,
        readState: 'unread',
      };
      const store = new ChatStore({
        initialConversations: [conv],
      });

      applyReadUpdate(asUnknown(store), { type: 'read', conversationId: 'c1' });

      expect(store.state.conversationsById.c1.readState).toBe('read');
      expect(store.state.conversationsById.c1.unreadCount).toBe(0);
    });

    it('no-ops when the conversation is not found', () => {
      const store = new ChatStore({
        initialConversations: [{ id: 'c1', title: 'General' }],
      });
      const stateBefore = store.state;

      applyReadUpdate(asUnknown(store), { type: 'read', conversationId: 'missing' });

      expect(store.state).toBe(stateBefore);
    });
  });
});
