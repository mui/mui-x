import { describe, expect, it } from 'vitest';
import { ChatStore } from './ChatStore';
import type { ChatConversation, ChatMessage } from '../types/chat-entities';
import type { ChatError } from '../types/chat-error';

const message1: ChatMessage = {
  id: 'm1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello' }],
};

const message2: ChatMessage = {
  id: 'm2',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'Hi' }],
};

const conversation1: ChatConversation = {
  id: 'c1',
  title: 'General',
};

const conversation2: ChatConversation = {
  id: 'c2',
  title: 'Support',
};

describe('ChatStore', () => {
  it('normalizes default messages and conversations during construction', () => {
    const store = new ChatStore({
      defaultMessages: [message1, message2],
      defaultConversations: [conversation1, conversation2],
    });

    expect(store.state.messageIds).toEqual(['m1', 'm2']);
    expect(store.state.messagesById).toEqual({
      m1: message1,
      m2: message2,
    });
    expect(store.state.conversationIds).toEqual(['c1', 'c2']);
    expect(store.state.conversationsById).toEqual({
      c1: conversation1,
      c2: conversation2,
    });
    expect(store.state.activeConversationId).toBeUndefined();
    expect(store.state.isStreaming).toBe(false);
    expect(store.state.hasMoreHistory).toBe(false);
    expect(store.state.historyCursor).toBeUndefined();
    expect(store.state.composerValue).toBe('');
    expect(store.state.composerAttachments).toEqual([]);
    expect(store.state.error).toBeNull();
  });

  it('addMessage appends new ids and updates duplicate ids without reordering', () => {
    const store = new ChatStore({
      defaultMessages: [message1],
    });

    store.addMessage(message2);

    expect(store.state.messageIds).toEqual(['m1', 'm2']);
    expect(store.state.messagesById.m2).toEqual(message2);

    store.addMessage({
      ...message1,
      status: 'sent',
    });

    expect(store.state.messageIds).toEqual(['m1', 'm2']);
    expect(store.state.messagesById.m1.status).toBe('sent');
  });

  it('updateMessage shallow-merges existing messages and ignores missing ids', () => {
    const store = new ChatStore({
      defaultMessages: [message1],
    });

    store.updateMessage('m1', {
      status: 'streaming',
      metadata: {
        traceId: 'trace-1',
      },
    });

    expect(store.state.messagesById.m1).toEqual({
      ...message1,
      status: 'streaming',
      metadata: {
        traceId: 'trace-1',
      },
    });

    store.updateMessage('missing', {
      status: 'error',
    });

    expect(store.state.messageIds).toEqual(['m1']);
  });

  it('removeMessage deletes from ids and lookup', () => {
    const store = new ChatStore({
      defaultMessages: [message1, message2],
    });

    store.removeMessage('m1');

    expect(store.state.messageIds).toEqual(['m2']);
    expect(store.state.messagesById).toEqual({
      m2: message2,
    });
  });

  it('prependMessages inserts unique ids at the front and refreshes duplicate message models', () => {
    const store = new ChatStore({
      defaultMessages: [message2],
    });

    store.prependMessages([
      {
        ...message1,
        status: 'sent',
      },
      {
        ...message2,
        parts: [{ type: 'text', text: 'Updated response' }],
      },
    ]);

    expect(store.state.messageIds).toEqual(['m1', 'm2']);
    expect(store.state.messagesById.m1.status).toBe('sent');
    expect(store.state.messagesById.m2.parts).toEqual([
      { type: 'text', text: 'Updated response' },
    ]);
  });

  it('setConversations replaces normalized conversation state only', () => {
    const store = new ChatStore({
      defaultMessages: [message1],
      defaultConversations: [conversation1],
    });

    store.setConversations([conversation2]);

    expect(store.state.conversationIds).toEqual(['c2']);
    expect(store.state.conversationsById).toEqual({
      c2: conversation2,
    });
    expect(store.state.messageIds).toEqual(['m1']);
    expect(store.state.messagesById).toEqual({
      m1: message1,
    });
  });

  it('setActiveConversation, setStreaming, and setError update their flags', () => {
    const store = new ChatStore();
    const error: ChatError = {
      code: 'CHAT_ERROR',
      message: 'Stream failed',
      source: 'stream',
      recoverable: true,
    };

    store.setActiveConversation('c1');
    store.setStreaming(true);
    store.setError(error);

    expect(store.state.activeConversationId).toBe('c1');
    expect(store.state.isStreaming).toBe(true);
    expect(store.state.error).toEqual(error);
  });

  it('resetMessages clears message and history state without affecting conversations or composer state', () => {
    const store = new ChatStore({
      defaultMessages: [message1, message2],
      defaultConversations: [conversation1],
    });

    store.setState({
      ...store.state,
      activeConversationId: 'c1',
      composerValue: 'Draft message',
      composerAttachments: [
        {
          localId: 'a1',
          file: new File(['hello'], 'hello.txt', { type: 'text/plain' }),
          status: 'queued',
        },
      ],
      isStreaming: true,
      hasMoreHistory: true,
      historyCursor: 'cursor-1',
      error: {
        code: 'CHAT_ERROR',
        message: 'Oops',
        source: 'send',
        recoverable: false,
      },
    });

    store.resetMessages();

    expect(store.state.messageIds).toEqual([]);
    expect(store.state.messagesById).toEqual({});
    expect(store.state.isStreaming).toBe(false);
    expect(store.state.hasMoreHistory).toBe(false);
    expect(store.state.historyCursor).toBeUndefined();
    expect(store.state.error).toBeNull();
    expect(store.state.conversationIds).toEqual(['c1']);
    expect(store.state.conversationsById).toEqual({
      c1: conversation1,
    });
    expect(store.state.activeConversationId).toBe('c1');
    expect(store.state.composerValue).toBe('Draft message');
    expect(store.state.composerAttachments).toHaveLength(1);
  });
});
