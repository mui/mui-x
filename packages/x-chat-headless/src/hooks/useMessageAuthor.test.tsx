import * as React from 'react';
import { act, createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { ChatStore } from '../store';
import type { ChatMessage } from '../types/chat-entities';
import { ChatStoreContext } from '../internals/useChatStoreContext';
import { useMessageAuthor } from './useMessageAuthor';

const messages: ChatMessage[] = [
  { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
  { id: 'm2', role: 'assistant', parts: [{ type: 'text', text: 'Hi there' }] },
];

describe('useMessageAuthor', () => {
  const { render } = createRenderer();

  it('does not re-render rows when an unrelated store field changes', () => {
    const store = new ChatStore({ initialMessages: messages });
    const renderCounts: Record<string, number> = {};
    const authors: Record<string, unknown[]> = {};

    function Row({ messageId }: { messageId: string }) {
      const author = useMessageAuthor(messageId);
      renderCounts[messageId] = (renderCounts[messageId] ?? 0) + 1;
      (authors[messageId] ??= []).push(author);
      return null;
    }

    render(
      <ChatStoreContext.Provider value={store}>
        <Row messageId="m1" />
        <Row messageId="m2" />
      </ChatStoreContext.Provider>,
    );

    const initialCounts = { ...renderCounts };

    act(() => {
      store.setComposerValue('a');
    });
    act(() => {
      store.setComposerValue('ab');
    });

    expect(renderCounts).toEqual(initialCounts);
    expect(authors.m1.every((author) => author === authors.m1[0])).toBe(true);
    expect(authors.m2.every((author) => author === authors.m2[0])).toBe(true);
  });

  it('updates existing memoized rows when author parameters change', () => {
    const store = new ChatStore({ initialMessages: messages });
    const authors: Record<string, ReturnType<typeof useMessageAuthor>> = {};

    const Row = React.memo(function Row({ messageId }: { messageId: string }) {
      authors[messageId] = useMessageAuthor(messageId);
      return null;
    });

    render(
      <ChatStoreContext.Provider value={store}>
        <Row messageId="m1" />
        <Row messageId="m2" />
      </ChatStoreContext.Provider>,
    );

    expect(authors.m1?.displayName).not.toBe('Alice');

    act(() => {
      store.updateStateFromParameters({
        ...store.parameters,
        currentUser: { id: 'alice', displayName: 'Alice' },
      });
    });

    expect(authors.m1?.displayName).toBe('Alice');

    act(() => {
      store.updateStateFromParameters({
        ...store.parameters,
        getMessageAuthorDisplayName: () => 'From getter',
      });
    });

    expect(authors.m1?.displayName).toBe('From getter');
    expect(authors.m2?.displayName).toBe('From getter');
  });

  it('updates existing memoized rows when an active conversation participant changes', () => {
    const store = new ChatStore({
      initialMessages: [
        { id: 'm1', role: 'user', author: { id: 'bob' }, parts: [{ type: 'text', text: 'Hi' }] },
      ],
      initialConversations: [
        { id: 'c1', title: 'Chat', participants: [{ id: 'bob', displayName: 'Bob' }] },
      ],
      initialActiveConversationId: 'c1',
    });
    const authors: Record<string, ReturnType<typeof useMessageAuthor>> = {};

    const Row = React.memo(function Row({ messageId }: { messageId: string }) {
      authors[messageId] = useMessageAuthor(messageId);
      return null;
    });

    render(
      <ChatStoreContext.Provider value={store}>
        <Row messageId="m1" />
      </ChatStoreContext.Provider>,
    );

    expect(authors.m1?.displayName).toBe('Bob');

    act(() => {
      store.updateConversation('c1', { participants: [{ id: 'bob', displayName: 'Robert' }] });
    });

    expect(authors.m1?.displayName).toBe('Robert');
  });

  it('does not re-render rows when author parameters are recreated with equal values', () => {
    const store = new ChatStore({
      initialMessages: messages,
      members: [{ id: 'alice', displayName: 'Alice' }],
      currentUser: { id: 'alice', displayName: 'Alice' },
      roleDisplayNames: { assistant: 'Bot' },
    });
    const renderCounts: Record<string, number> = {};
    const authors: Record<string, unknown[]> = {};

    function Row({ messageId }: { messageId: string }) {
      const author = useMessageAuthor(messageId);
      renderCounts[messageId] = (renderCounts[messageId] ?? 0) + 1;
      (authors[messageId] ??= []).push(author);
      return null;
    }

    render(
      <ChatStoreContext.Provider value={store}>
        <Row messageId="m1" />
        <Row messageId="m2" />
      </ChatStoreContext.Provider>,
    );

    const initialCounts = { ...renderCounts };
    const initialVersion = store.state.authorParametersVersion;

    act(() => {
      store.updateStateFromParameters({
        ...store.parameters,
        members: [{ id: 'alice', displayName: 'Alice' }],
        currentUser: { id: 'alice', displayName: 'Alice' },
        roleDisplayNames: { assistant: 'Bot' },
      });
    });

    expect(store.state.authorParametersVersion).toBe(initialVersion);
    expect(renderCounts).toEqual(initialCounts);
    expect(authors.m1.every((author) => author === authors.m1[0])).toBe(true);
    expect(authors.m2.every((author) => author === authors.m2[0])).toBe(true);
  });
});
