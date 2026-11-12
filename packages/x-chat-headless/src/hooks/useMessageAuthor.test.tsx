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
});
