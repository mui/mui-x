import { describe, expect, it, vi } from 'vitest';
import { ChatStore } from '../../store/ChatStore';
import { createRealtimeActions } from './realtimeActions';
import type { ChatConversation, ChatMessage } from '../../types/chat-entities';

function asUnknown(store: ChatStore): ChatStore<unknown> {
  return store as unknown as ChatStore<unknown>;
}

const baseMessage: ChatMessage = {
  id: 'm1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello' }],
};

const updatedMessage: ChatMessage = {
  id: 'm1',
  role: 'user',
  status: 'sent',
  parts: [{ type: 'text', text: 'Hello (edited)' }],
};

const conversation1: ChatConversation = { id: 'c1', title: 'General' };
const conversation2: ChatConversation = { id: 'c2', title: 'Support' };

describe('createRealtimeActions', () => {
  describe('handleRealtimeEvent', () => {
    it('message-added: adds message to store', () => {
      const store = new ChatStore();
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'message-added', message: baseMessage });

      expect(store.state.messageIds).toEqual(['m1']);
      expect(store.state.messagesById.m1).toEqual(baseMessage);
    });

    it('message-updated: updates existing message in store', () => {
      const store = new ChatStore({ initialMessages: [baseMessage] });
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'message-updated', message: updatedMessage });

      expect(store.state.messagesById.m1.status).toBe('sent');
      expect(store.state.messagesById.m1.parts[0]).toMatchObject({ text: 'Hello (edited)' });
    });

    it('message-updated: adds message when it does not exist (upsert)', () => {
      const store = new ChatStore();
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'message-updated', message: baseMessage });

      expect(store.state.messageIds).toEqual(['m1']);
    });

    it('message-removed: removes message from store', () => {
      const store = new ChatStore({ initialMessages: [baseMessage] });
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'message-removed', messageId: 'm1' });

      expect(store.state.messageIds).toEqual([]);
      expect(store.state.messagesById.m1).toBeUndefined();
    });

    it('conversation-added: adds conversation to store', () => {
      const store = new ChatStore();
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'conversation-added', conversation: conversation1 });

      expect(store.state.conversationIds).toEqual(['c1']);
      expect(store.state.conversationsById.c1).toEqual(conversation1);
    });

    it('conversation-updated: updates existing conversation', () => {
      const store = new ChatStore({ initialConversations: [conversation1] });
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({
        type: 'conversation-updated',
        conversation: { id: 'c1', title: 'General (updated)' },
      });

      expect(store.state.conversationsById.c1.title).toBe('General (updated)');
    });

    it('conversation-updated: adds conversation when it does not exist (upsert)', () => {
      const store = new ChatStore();
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'conversation-updated', conversation: conversation1 });

      expect(store.state.conversationIds).toEqual(['c1']);
    });

    it('conversation-removed: removes conversation from store', () => {
      const store = new ChatStore({ initialConversations: [conversation1, conversation2] });
      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'conversation-removed', conversationId: 'c1' });

      expect(store.state.conversationIds).toEqual(['c2']);
      expect(store.state.conversationsById.c1).toBeUndefined();
    });

    it('conversation-removed: clears active conversation and messages when the removed conversation is active', () => {
      const store = new ChatStore({
        initialConversations: [conversation1],
        initialMessages: [baseMessage],
      });
      store.setActiveConversation('c1');

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'conversation-removed', conversationId: 'c1' });

      expect(store.state.activeConversationId).toBeUndefined();
      expect(store.state.messageIds).toEqual([]);
    });

    it('conversation-removed: increments the navigation request ID when the active conversation is removed', () => {
      const store = new ChatStore({ initialConversations: [conversation1] });
      store.setActiveConversation('c1');
      const conversationNavigationRequestIdRef = { current: 0 };

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef,
      });

      handleRealtimeEvent({ type: 'conversation-removed', conversationId: 'c1' });

      expect(conversationNavigationRequestIdRef.current).toBe(1);
    });

    it('conversation-removed: does not increment navigation request ID when a non-active conversation is removed', () => {
      const store = new ChatStore({ initialConversations: [conversation1, conversation2] });
      store.setActiveConversation('c2');
      const conversationNavigationRequestIdRef = { current: 0 };

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef,
      });

      handleRealtimeEvent({ type: 'conversation-removed', conversationId: 'c1' });

      expect(conversationNavigationRequestIdRef.current).toBe(0);
    });

    it('presence: updates participant isOnline status via applyPresenceUpdate', () => {
      const conv: ChatConversation = {
        id: 'c1',
        title: 'General',
        participants: [{ id: 'u1', displayName: 'Alice', isOnline: false }],
      };
      const store = new ChatStore({ initialConversations: [conv] });

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'presence', userId: 'u1', isOnline: true });

      expect(store.state.conversationsById.c1.participants?.[0].isOnline).toBe(true);
    });

    it('read: sets readState and unreadCount via applyReadUpdate', () => {
      const conv: ChatConversation = {
        id: 'c1',
        title: 'General',
        unreadCount: 3,
        readState: 'unread',
      };
      const store = new ChatStore({ initialConversations: [conv] });

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'read', conversationId: 'c1' });

      expect(store.state.conversationsById.c1.readState).toBe('read');
      expect(store.state.conversationsById.c1.unreadCount).toBe(0);
    });

    it('typing: calls store.setTypingUser with conversationId, userId, and isTyping', () => {
      const store = new ChatStore({ initialConversations: [conversation1] });
      const setTypingUser = vi.spyOn(store, 'setTypingUser');

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      handleRealtimeEvent({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: true });

      expect(setTypingUser).toHaveBeenCalledWith('c1', 'u1', true);
    });

    it('unknown event type: does nothing and does not throw', () => {
      const store = new ChatStore({ initialMessages: [baseMessage] });
      const stateBefore = store.state;

      const { handleRealtimeEvent } = createRealtimeActions({
        store: asUnknown(store),
        conversationNavigationRequestIdRef: { current: 0 },
      });

      // @ts-expect-error — testing an unknown type at runtime
      expect(() => handleRealtimeEvent({ type: 'unknown-event' })).not.toThrow();
      expect(store.state).toBe(stateBefore);
    });
  });
});
