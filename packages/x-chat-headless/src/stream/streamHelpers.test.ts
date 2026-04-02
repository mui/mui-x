import { describe, expect, it, vi } from 'vitest';
import { ChatStore } from '../store/ChatStore';
import {
  getOrCreateMessage,
  getFinishMessage,
  finalizeStreamingParts,
  updateMessageParts,
  updateMessage,
  findLastStreamingPartIndex,
} from './streamHelpers';
import type { ChatMessage } from '../types/chat-entities';
import type { ChatMessagePart } from '../types/chat-message-parts';

function asUnknown(store: ChatStore): ChatStore<unknown> {
  return store as unknown as ChatStore<unknown>;
}

const assistantUser = { id: 'bot', displayName: 'Assistant' };

describe('getOrCreateMessage', () => {
  it('returns an existing streaming message without modifying it', () => {
    const existingMessage: ChatMessage = {
      id: 'a1',
      role: 'assistant',
      status: 'streaming',
      parts: [{ type: 'text', text: 'Hello', state: 'streaming' }],
    };
    const store = new ChatStore({ initialMessages: [existingMessage] });

    const message = getOrCreateMessage(asUnknown(store), 'a1', 'c1');

    expect(message).toBe(store.state.messagesById.a1);
    expect(message.status).toBe('streaming');
  });

  it('updates an existing non-streaming message to streaming status', () => {
    const existing: ChatMessage = {
      id: 'a1',
      role: 'assistant',
      status: 'sent',
      parts: [],
    };
    const store = new ChatStore({ initialMessages: [existing] });

    const message = getOrCreateMessage(asUnknown(store), 'a1', 'c1');

    expect(message.status).toBe('streaming');
    expect(store.state.messagesById.a1.status).toBe('streaming');
  });

  it('creates a new assistant message when not found in store', () => {
    const store = new ChatStore();

    const message = getOrCreateMessage(asUnknown(store), 'new-a1', 'c1');

    expect(store.state.messagesById['new-a1']).toBeDefined();
    expect(message.id).toBe('new-a1');
    expect(message.role).toBe('assistant');
    expect(message.status).toBe('streaming');
    expect(message.conversationId).toBe('c1');
    expect(message.parts).toEqual([]);
  });

  it('applies store.assistantUser as author when creating a new message', () => {
    const assistantMember = { id: 'bot', displayName: 'Assistant', role: 'assistant' as const };
    const store = new ChatStore({ members: [assistantMember] });

    const message = getOrCreateMessage(asUnknown(store), 'new-a1', 'c1');

    expect(message.author).toEqual(assistantMember);
  });

  it('applies the explicit author argument over store.assistantUser', () => {
    const store = new ChatStore({ members: [assistantUser] });
    const explicitAuthor = { id: 'custom-bot', displayName: 'Custom Bot' };

    const message = getOrCreateMessage(asUnknown(store), 'new-a1', 'c1', explicitAuthor);

    expect(message.author).toEqual(explicitAuthor);
  });
});

describe('getFinishMessage', () => {
  it('returns the existing message when messageId is in the store', () => {
    const existing: ChatMessage = {
      id: 'a1',
      role: 'assistant',
      status: 'streaming',
      parts: [{ type: 'text', text: 'Hi', state: 'streaming' }],
    };
    const store = new ChatStore({ initialMessages: [existing] });

    const message = getFinishMessage(asUnknown(store), 'a1', 'c1', 'sent');

    expect(message).toBe(store.state.messagesById.a1);
  });

  it('returns a shell message when messageId is not in the store', () => {
    const store = new ChatStore();

    const message = getFinishMessage(asUnknown(store), 'missing', 'c1', 'sent');

    expect(message.id).toBe('missing');
    expect(message.role).toBe('assistant');
    expect(message.status).toBe('sent');
    expect(message.parts).toEqual([]);
  });

  it('returns a shell message when messageId is undefined', () => {
    const store = new ChatStore();

    const message = getFinishMessage(asUnknown(store), undefined, 'c1', 'error');

    expect(message.id).toBe('');
    expect(message.status).toBe('error');
  });
});

describe('finalizeStreamingParts', () => {
  it('sets state to "done" on all streaming text and reasoning parts', () => {
    const parts: ChatMessagePart[] = [
      { type: 'text', text: 'Hello', state: 'streaming' },
      { type: 'reasoning', text: 'Thinking', state: 'streaming' },
    ];

    const result = finalizeStreamingParts(parts);

    expect(result[0]).toMatchObject({ type: 'text', text: 'Hello', state: 'done' });
    expect(result[1]).toMatchObject({ type: 'reasoning', text: 'Thinking', state: 'done' });
  });

  it('returns the same array reference when no streaming parts exist', () => {
    const parts: ChatMessagePart[] = [{ type: 'text', text: 'Hello', state: 'done' }];

    const result = finalizeStreamingParts(parts);

    expect(result).toBe(parts);
  });

  it('leaves non-text/reasoning parts untouched', () => {
    const toolPart: ChatMessagePart = {
      type: 'dynamic-tool',
      toolInvocation: {
        toolName: 'custom-tool',
        toolCallId: 'tc1',
        state: 'input-available',
        input: {},
      },
    };
    const parts: ChatMessagePart[] = [
      { type: 'text', text: 'Hello', state: 'streaming' },
      toolPart,
    ];

    const result = finalizeStreamingParts(parts);

    expect(result[1]).toBe(toolPart);
  });
});

describe('updateMessageParts', () => {
  it('applies the updater function and updates the store', () => {
    const store = new ChatStore({
      initialMessages: [
        {
          id: 'a1',
          role: 'assistant',
          status: 'streaming',
          parts: [{ type: 'text', text: 'Hi', state: 'streaming' }],
        },
      ],
    });

    updateMessageParts(asUnknown(store), 'a1', (parts) => [
      ...parts,
      { type: 'text', text: ' there', state: 'streaming' } as ChatMessagePart,
    ]);

    expect(store.state.messagesById.a1.parts).toHaveLength(2);
  });

  it('no-ops when the message is not found in the store', () => {
    const store = new ChatStore();
    const updater = vi.fn((parts: ChatMessagePart[]) => parts);

    updateMessageParts(asUnknown(store), 'nonexistent', updater);

    expect(updater).not.toHaveBeenCalled();
  });

  it('no-ops when the updater returns the same parts reference', () => {
    const store = new ChatStore({
      initialMessages: [{ id: 'a1', role: 'assistant', status: 'streaming', parts: [] }],
    });
    const stateBefore = store.state;

    updateMessageParts(asUnknown(store), 'a1', (parts) => parts);

    expect(store.state).toBe(stateBefore);
  });
});

describe('updateMessage', () => {
  it('applies the updater patch and updates the store', () => {
    const store = new ChatStore({
      initialMessages: [{ id: 'a1', role: 'assistant', status: 'streaming', parts: [] }],
    });

    updateMessage(asUnknown(store), 'a1', () => ({ status: 'sent' }));

    expect(store.state.messagesById.a1.status).toBe('sent');
  });

  it('no-ops when the updater returns null', () => {
    const store = new ChatStore({
      initialMessages: [{ id: 'a1', role: 'assistant', status: 'streaming', parts: [] }],
    });
    const stateBefore = store.state;

    updateMessage(asUnknown(store), 'a1', () => null);

    expect(store.state).toBe(stateBefore);
  });

  it('no-ops when the message is not found in the store', () => {
    const store = new ChatStore();
    const updater = vi.fn(() => ({ status: 'sent' as const }));

    updateMessage(asUnknown(store), 'nonexistent', updater);

    expect(updater).not.toHaveBeenCalled();
  });
});

describe('findLastStreamingPartIndex', () => {
  it('returns the index of the last streaming text part', () => {
    const parts: ChatMessagePart[] = [
      { type: 'text', text: 'First', state: 'done' },
      { type: 'text', text: 'Second', state: 'streaming' },
      { type: 'text', text: 'Third', state: 'streaming' },
    ];

    expect(findLastStreamingPartIndex(parts, 'text')).toBe(2);
  });

  it('returns the index of the last streaming reasoning part', () => {
    const parts: ChatMessagePart[] = [
      { type: 'reasoning', text: 'Step 1', state: 'streaming' },
      { type: 'text', text: 'Answer', state: 'streaming' },
    ];

    expect(findLastStreamingPartIndex(parts, 'reasoning')).toBe(0);
  });

  it('returns -1 when no streaming parts of the given type exist', () => {
    const parts: ChatMessagePart[] = [
      { type: 'text', text: 'Done', state: 'done' },
      { type: 'reasoning', text: 'Done', state: 'done' },
    ];

    expect(findLastStreamingPartIndex(parts, 'text')).toBe(-1);
    expect(findLastStreamingPartIndex(parts, 'reasoning')).toBe(-1);
  });

  it('returns -1 for an empty parts array', () => {
    expect(findLastStreamingPartIndex([], 'text')).toBe(-1);
  });
});
