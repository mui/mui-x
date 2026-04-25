import { describe, expect, it } from 'vitest';
import { ChatStore } from './ChatStore';
import type { ChatConversation, ChatDraftAttachment, ChatMessage } from '../types/chat-entities';
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

function createAttachment(overrides: Partial<ChatDraftAttachment> = {}): ChatDraftAttachment {
  return {
    localId: 'a1',
    file: new File(['hello'], 'hello.txt', { type: 'text/plain' }),
    status: 'queued',
    ...overrides,
  };
}

describe('ChatStore', () => {
  it('normalizes default messages and conversations during construction', () => {
    const store = new ChatStore({
      initialMessages: [message1, message2],
      initialConversations: [conversation1, conversation2],
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
    expect(store.state.composerIsComposing).toBe(false);
    expect(store.state.composerAttachments).toEqual([]);
    expect(store.state.error).toBeNull();
  });

  it('uses controlled values instead of defaults during construction', () => {
    const store = new ChatStore({
      messages: [message2],
      initialMessages: [message1],
      conversations: [conversation2],
      initialConversations: [conversation1],
      activeConversationId: 'c2',
      initialActiveConversationId: 'c1',
      composerValue: 'Controlled draft',
      initialComposerValue: 'Initial draft',
    });

    expect(store.state.messageIds).toEqual(['m2']);
    expect(store.state.conversationIds).toEqual(['c2']);
    expect(store.state.activeConversationId).toBe('c2');
    expect(store.state.composerValue).toBe('Controlled draft');
  });

  it('addMessage appends new ids and updates duplicate ids without reordering', () => {
    const store = new ChatStore({
      initialMessages: [message1],
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
      initialMessages: [message1],
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
      initialMessages: [message1, message2],
    });

    store.removeMessage('m1');

    expect(store.state.messageIds).toEqual(['m2']);
    expect(store.state.messagesById).toEqual({
      m2: message2,
    });
  });

  it('prependMessages inserts unique ids at the front and refreshes duplicate message models', () => {
    const store = new ChatStore({
      initialMessages: [message2],
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
    expect(store.state.messagesById.m2.parts).toEqual([{ type: 'text', text: 'Updated response' }]);
  });

  it('setMessages replaces the normalized message state', () => {
    const store = new ChatStore({
      initialMessages: [message1],
    });

    store.setMessages([message2]);

    expect(store.state.messageIds).toEqual(['m2']);
    expect(store.state.messagesById).toEqual({
      m2: message2,
    });
  });

  it('setMessages deduplicates duplicate ids and keeps the first-seen order with the latest model', () => {
    const store = new ChatStore();

    store.setMessages([
      message1,
      message2,
      {
        ...message1,
        status: 'sent',
      },
    ]);

    expect(store.state.messageIds).toEqual(['m1', 'm2']);
    expect(store.state.messagesById.m1).toEqual({
      ...message1,
      status: 'sent',
    });
  });

  it('setConversations replaces normalized conversation state only', () => {
    const store = new ChatStore({
      initialMessages: [message1],
      initialConversations: [conversation1],
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

  it('setConversations deduplicates duplicate ids and keeps the first-seen order with the latest model', () => {
    const store = new ChatStore();

    store.setConversations([
      conversation1,
      conversation2,
      {
        ...conversation1,
        title: 'General updated',
      },
    ]);

    expect(store.state.conversationIds).toEqual(['c1', 'c2']);
    expect(store.state.conversationsById.c1).toEqual({
      ...conversation1,
      title: 'General updated',
    });
  });

  it('addConversation, updateConversation, and removeConversation keep normalized ordering consistent', () => {
    const store = new ChatStore({
      initialConversations: [conversation1],
    });

    store.addConversation(conversation2);
    store.addConversation({
      ...conversation1,
      title: 'General updated',
    });
    store.updateConversation('c2', {
      title: 'Support updated',
    });
    store.removeConversation('c1');

    expect(store.state.conversationIds).toEqual(['c2']);
    expect(store.state.conversationsById).toEqual({
      c2: {
        ...conversation2,
        title: 'Support updated',
      },
    });
  });

  it('setActiveConversation, setStreaming, and setError update their flags', () => {
    const store = new ChatStore();
    const error: ChatError = {
      code: 'STREAM_ERROR',
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

  it('setHistoryState updates history cursor and pagination flags', () => {
    const store = new ChatStore();

    store.setHistoryState({
      cursor: 'cursor-1',
      hasMore: true,
    });

    expect(store.state.historyCursor).toBe('cursor-1');
    expect(store.state.hasMoreHistory).toBe(true);
  });

  it('setComposerValue updates the composer model', () => {
    const store = new ChatStore();

    store.setComposerValue('Draft message');

    expect(store.state.composerValue).toBe('Draft message');
  });

  it('setComposerIsComposing updates the composer composition flag', () => {
    const store = new ChatStore();

    store.setComposerIsComposing(true);
    expect(store.state.composerIsComposing).toBe(true);

    store.clearComposer();
    expect(store.state.composerIsComposing).toBe(false);
  });

  it('setComposerAttachments, addComposerAttachment, removeComposerAttachment, and clearComposer update draft state', () => {
    const store = new ChatStore({
      initialComposerValue: 'Draft message',
    });
    const attachment1 = createAttachment();
    const attachment2 = createAttachment({
      localId: 'a2',
      file: new File(['world'], 'world.txt', { type: 'text/plain' }),
    });

    store.setComposerAttachments([attachment1]);
    expect(store.state.composerAttachments).toEqual([attachment1]);

    store.addComposerAttachment(attachment2);
    expect(store.state.composerAttachments).toEqual([attachment1, attachment2]);

    store.removeComposerAttachment('missing');
    expect(store.state.composerAttachments).toEqual([attachment1, attachment2]);

    store.removeComposerAttachment('a1');
    expect(store.state.composerAttachments).toEqual([attachment2]);

    store.setComposerIsComposing(true);
    store.clearComposer();
    expect(store.state.composerValue).toBe('');
    expect(store.state.composerIsComposing).toBe(false);
    expect(store.state.composerAttachments).toEqual([]);
  });

  it('ignores empty or missing-id transitions that should be no-ops', () => {
    const store = new ChatStore({
      initialMessages: [message1],
      initialConversations: [conversation1],
    });

    const initialState = store.state;

    store.prependMessages([]);
    store.removeMessage('missing');
    store.updateMessage('missing', {
      status: 'error',
    });

    expect(store.state).toBe(initialState);
    expect(store.state.messageIds).toEqual(['m1']);
    expect(store.state.conversationIds).toEqual(['c1']);
  });

  it('updateStateFromParameters resyncs controlled models', () => {
    const store = new ChatStore({
      messages: [message1],
      conversations: [conversation1],
      activeConversationId: 'c1',
      activeConversationIdControlled: true,
      composerValue: 'Draft one',
    });

    store.addMessage(message2);
    store.setConversations([conversation2]);
    store.setActiveConversation('c2');
    store.setComposerValue('Draft two');

    store.updateStateFromParameters({
      messages: [message1],
      conversations: [conversation1],
      activeConversationId: 'c1',
      activeConversationIdControlled: true,
      composerValue: 'Draft one',
    });

    expect(store.state.messageIds).toEqual(['m1']);
    expect(store.state.conversationIds).toEqual(['c1']);
    expect(store.state.activeConversationId).toBe('c1');
    expect(store.state.composerValue).toBe('Draft one');
  });

  it('updateStateFromParameters ignores default model changes after initialization', () => {
    const store = new ChatStore({
      initialMessages: [message1],
      initialConversations: [conversation1],
      initialActiveConversationId: 'c1',
      initialComposerValue: 'Draft one',
    });

    store.updateStateFromParameters({
      initialMessages: [message2],
      initialConversations: [conversation2],
      initialActiveConversationId: 'c2',
      initialComposerValue: 'Draft two',
    });

    expect(store.state.messageIds).toEqual(['m1']);
    expect(store.state.conversationIds).toEqual(['c1']);
    expect(store.state.activeConversationId).toBe('c1');
    expect(store.state.composerValue).toBe('Draft one');
  });

  it('registerStoreEffect fires only when the selected slice changes', () => {
    const store = new ChatStore({
      initialMessages: [message1],
    });
    const changes: string[] = [];

    const unsubscribe = store.registerStoreEffect(
      (state) => state.composerValue,
      (previous, next) => {
        changes.push(`${previous}->${next}`);
      },
    );

    store.setComposerValue('Draft one');
    store.setComposerValue('Draft one');
    store.setComposerValue('Draft two');
    unsubscribe();
    store.setComposerValue('Draft three');

    expect(changes).toEqual(['->Draft one', 'Draft one->Draft two']);
  });

  it('hasDirtyControlledModels is true after internal mutation and false after resync', () => {
    const store = new ChatStore({
      messages: [message1],
    });

    expect(store.hasDirtyControlledModels).toBe(false);

    store.addMessage(message2);

    expect(store.hasDirtyControlledModels).toBe(true);

    store.updateStateFromParameters({
      messages: [message1, message2],
    });

    expect(store.hasDirtyControlledModels).toBe(false);
  });

  it('currentUser fallback: members → participants → message authors', () => {
    // From explicit currentUser
    const explicitUser = { id: 'u1', displayName: 'Alice', role: 'user' as const };
    const storeExplicit = new ChatStore({ currentUser: explicitUser });
    expect(storeExplicit.currentUser).toBe(explicitUser);

    // From members list
    const members = [
      { id: 'u1', displayName: 'Alice', role: 'user' as const },
      { id: 'a1', displayName: 'Bot', role: 'assistant' as const },
    ];
    const storeMembers = new ChatStore({ members });
    expect(storeMembers.currentUser).toEqual(members[0]);

    // From conversation participants
    const storeParticipants = new ChatStore({
      initialConversations: [
        {
          id: 'c1',
          title: 'General',
          participants: [{ id: 'p1', displayName: 'Participant', role: 'user' as const }],
        },
      ],
      initialActiveConversationId: 'c1',
    });
    expect(storeParticipants.currentUser).toEqual({
      id: 'p1',
      displayName: 'Participant',
      role: 'user',
    });

    // From message authors
    const storeAuthors = new ChatStore({
      initialMessages: [
        {
          id: 'm1',
          role: 'user',
          parts: [{ type: 'text', text: 'Hello' }],
          author: { id: 'author-1', displayName: 'Author', role: 'user' as const },
        },
      ],
    });
    expect(storeAuthors.currentUser).toEqual({
      id: 'author-1',
      displayName: 'Author',
      role: 'user',
    });
  });

  it('assistantUser fallback: members → participants → message authors', () => {
    // From members
    const members = [
      { id: 'u1', displayName: 'Alice', role: 'user' as const },
      { id: 'bot-1', displayName: 'Bot', role: 'assistant' as const },
    ];
    const storeMembers = new ChatStore({ members });
    expect(storeMembers.assistantUser).toEqual(members[1]);

    // From participants
    const storeParticipants = new ChatStore({
      initialConversations: [
        {
          id: 'c1',
          title: 'General',
          participants: [{ id: 'bot-1', displayName: 'Bot', role: 'assistant' as const }],
        },
      ],
      initialActiveConversationId: 'c1',
    });
    expect(storeParticipants.assistantUser).toEqual({
      id: 'bot-1',
      displayName: 'Bot',
      role: 'assistant',
    });

    // From message authors
    const storeAuthors = new ChatStore({
      initialMessages: [
        {
          id: 'm1',
          role: 'assistant',
          status: 'sent',
          parts: [{ type: 'text', text: 'Hi' }],
          author: { id: 'bot-1', displayName: 'Bot', role: 'assistant' as const },
        },
      ],
    });
    expect(storeAuthors.assistantUser).toEqual({
      id: 'bot-1',
      displayName: 'Bot',
      role: 'assistant',
    });
  });

  it('resetMessages clears activeStreamAbortController', () => {
    const store = new ChatStore({
      initialMessages: [message1],
    });

    store.setActiveStreamAbortController(new AbortController());
    expect(store.state.activeStreamAbortController).toBeInstanceOf(AbortController);

    store.resetMessages();

    expect(store.state.activeStreamAbortController).toBeNull();
  });

  it('disposeEffect aborts and clears active streaming state', () => {
    const store = new ChatStore();
    const abortController = new AbortController();

    store.setActiveStreamAbortController(abortController);
    store.setStreaming(true);

    const cleanup = store.disposeEffect();
    cleanup();

    expect(abortController.signal.aborted).toBe(true);
    expect(store.state.activeStreamAbortController).toBeNull();
    expect(store.state.isStreaming).toBe(false);
  });

  it('setTypingUser is idempotent when called with the same value', () => {
    const store = new ChatStore();

    store.setTypingUser('c1', 'u1', true);
    const stateAfterFirst = store.state;

    store.setTypingUser('c1', 'u1', true);

    expect(store.state).toBe(stateAfterFirst);
  });

  it('removeConversation is a no-op for a missing id', () => {
    const store = new ChatStore({
      initialConversations: [conversation1],
    });
    const initialState = store.state;

    store.removeConversation('missing');

    expect(store.state).toBe(initialState);
  });

  it('updateConversation is a no-op for a missing id', () => {
    const store = new ChatStore({
      initialConversations: [conversation1],
    });
    const initialState = store.state;

    store.updateConversation('missing', { title: 'Updated' });

    expect(store.state).toBe(initialState);
  });

  it('resetMessages clears message and history state without affecting conversations or composer state', () => {
    const store = new ChatStore({
      initialMessages: [message1, message2],
      initialConversations: [conversation1],
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
        code: 'STREAM_ERROR',
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
