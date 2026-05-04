import { describe, expect, it } from 'vitest';
import { ChatStore } from '../store/ChatStore';
import { chatSelectors } from './chatSelectors';
import type { ChatConversation, ChatMessage } from '../types/chat-entities';

const userMessage: ChatMessage = {
  id: 'm1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello' }],
};

const assistantMessage: ChatMessage = {
  id: 'm2',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'Hi there' }],
};

const conversation1: ChatConversation = {
  id: 'c1',
  title: 'General',
};

const conversation2: ChatConversation = {
  id: 'c2',
  title: 'Support',
};

describe('chatSelectors', () => {
  it('returns normalized ids, lookups, and derived arrays in store order', () => {
    const store = new ChatStore({
      initialMessages: [userMessage, assistantMessage],
      initialConversations: [conversation1, conversation2],
    });

    expect(chatSelectors.messageIds(store.state)).toEqual(['m1', 'm2']);
    expect(chatSelectors.messagesById(store.state)).toEqual({
      m1: userMessage,
      m2: assistantMessage,
    });
    expect(chatSelectors.messages(store.state)).toEqual([userMessage, assistantMessage]);

    expect(chatSelectors.conversationIds(store.state)).toEqual(['c1', 'c2']);
    expect(chatSelectors.conversationsById(store.state)).toEqual({
      c1: conversation1,
      c2: conversation2,
    });
    expect(chatSelectors.conversations(store.state)).toEqual([conversation1, conversation2]);
  });

  it('returns lookup and scalar selectors correctly', () => {
    const store = new ChatStore({
      initialMessages: [userMessage, assistantMessage],
      initialConversations: [conversation1, conversation2],
    });

    store.setActiveConversation('c2');
    store.setStreaming(true);
    store.setError({
      code: 'STREAM_ERROR',
      message: 'Oops',
      source: 'stream',
      recoverable: true,
    });

    expect(chatSelectors.message(store.state, 'm1')).toEqual(userMessage);
    expect(chatSelectors.message(store.state, 'missing')).toBeUndefined();
    expect(chatSelectors.conversation(store.state, 'c1')).toEqual(conversation1);
    expect(chatSelectors.conversation(store.state, 'missing')).toBeUndefined();
    expect(chatSelectors.activeConversationId(store.state)).toBe('c2');
    expect(chatSelectors.activeConversation(store.state)).toEqual(conversation2);
    expect(chatSelectors.messageCount(store.state)).toBe(2);
    expect(chatSelectors.conversationCount(store.state)).toBe(2);
    expect(chatSelectors.isStreaming(store.state)).toBe(true);
    expect(chatSelectors.hasMoreHistory(store.state)).toBe(false);
    expect(chatSelectors.error(store.state)?.message).toBe('Oops');
    expect(chatSelectors.composerValue(store.state)).toBe('');
    expect(chatSelectors.composerAttachments(store.state)).toEqual([]);
  });

  it('returns message-scoped errors independently from the global runtime error', () => {
    const store = new ChatStore({
      initialMessages: [
        { ...userMessage, status: 'error' },
        { ...assistantMessage, id: 'm3', status: 'error' },
      ],
    });

    store.setError({
      code: 'HISTORY_ERROR',
      message: 'History failed',
      source: 'history',
      recoverable: true,
    });
    store.setMessageError('m1', {
      code: 'SEND_ERROR',
      message: 'User message failed',
      source: 'send',
      recoverable: true,
      details: { messageId: 'm1' },
    });
    store.setMessageError('m3', {
      code: 'STREAM_ERROR',
      message: 'Assistant message failed',
      source: 'stream',
      recoverable: true,
      details: { messageId: 'm3' },
    });

    expect(chatSelectors.error(store.state)?.message).toBe('History failed');
    expect(chatSelectors.messageError(store.state, 'm1')?.message).toBe('User message failed');
    expect(chatSelectors.messageError(store.state, 'm3')?.message).toBe(
      'Assistant message failed',
    );
  });

  it('memoizes message and conversation arrays when their inputs have not changed', () => {
    const store = new ChatStore({
      initialMessages: [userMessage],
      initialConversations: [conversation1],
    });

    const messagesBefore = chatSelectors.messages(store.state);
    const conversationsBefore = chatSelectors.conversations(store.state);

    store.setStreaming(true);

    const messagesAfterUnrelatedUpdate = chatSelectors.messages(store.state);
    const conversationsAfterUnrelatedUpdate = chatSelectors.conversations(store.state);

    expect(messagesAfterUnrelatedUpdate).toBe(messagesBefore);
    expect(conversationsAfterUnrelatedUpdate).toBe(conversationsBefore);

    store.addMessage(assistantMessage);
    const messagesAfterMessageUpdate = chatSelectors.messages(store.state);

    expect(messagesAfterMessageUpdate).not.toBe(messagesBefore);
    expect(messagesAfterMessageUpdate).toEqual([userMessage, assistantMessage]);

    store.setConversations([conversation1, conversation2]);
    const conversationsAfterConversationUpdate = chatSelectors.conversations(store.state);

    expect(conversationsAfterConversationUpdate).not.toBe(conversationsBefore);
    expect(conversationsAfterConversationUpdate).toEqual([conversation1, conversation2]);
  });
});
