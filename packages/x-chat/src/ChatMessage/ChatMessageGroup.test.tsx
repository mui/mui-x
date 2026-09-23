import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { ChatRoot, createTimeWindowGroupKey } from '@mui/x-chat-headless';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';
import { ChatMessageGroup } from './ChatMessageGroup';

const { render } = createRenderer();

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
    ...overrides,
  };
}

describe('ChatMessageGroup', () => {
  it('applies MuiChatMessage-group class to the group root element', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[
          { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
          { id: 'm2', role: 'user', parts: [{ type: 'text', text: 'World' }] },
        ]}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('.MuiChatMessage-group')).not.toBe(null);
  });

  it('renders without crashing with a single message', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('.MuiChatMessage-root')).not.toBe(null);
  });

  it('renders groups for both user and assistant messages', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[
          { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Question' }] },
          {
            id: 'm2',
            role: 'assistant',
            status: 'sent',
            parts: [{ type: 'text', text: 'Answer' }],
          },
        ]}
      >
        {null}
      </ChatBox>,
    );

    const groups = document.querySelectorAll('.MuiChatMessage-group');
    // One group per author run
    expect(groups.length).toBeGreaterThanOrEqual(2);
  });

  it('renders the author label via the default authorName slot', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        members={[{ id: 'alice', displayName: 'Alice Author' }]}
        initialMessages={[
          {
            id: 'm1',
            role: 'assistant',
            status: 'sent',
            author: { id: 'alice' },
            parts: [{ type: 'text', text: 'Hi' }],
          },
        ]}
      >
        {null}
      </ChatBox>,
    );

    expect(document.body.textContent).toContain('Alice Author');
  });

  it('overrides the author label via slots.messageAuthorName', () => {
    function CustomLabel(props: { children?: React.ReactNode }) {
      return <span data-testid="custom-author-name">[{props.children}]</span>;
    }

    render(
      <ChatBox
        adapter={createAdapter()}
        members={[{ id: 'alice', displayName: 'Alice' }]}
        initialMessages={[
          {
            id: 'm1',
            role: 'assistant',
            status: 'sent',
            author: { id: 'alice' },
            parts: [{ type: 'text', text: 'Hi' }],
          },
        ]}
        slots={{ messageAuthorName: CustomLabel }}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('[data-testid="custom-author-name"]')?.textContent).toBe(
      '[Alice]',
    );
  });

  it('hides the author label when slots.messageAuthorName is null', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        members={[{ id: 'alice', displayName: 'Alice Hidden' }]}
        initialMessages={[
          {
            id: 'm1',
            role: 'assistant',
            status: 'sent',
            author: { id: 'alice' },
            parts: [{ type: 'text', text: 'Hi' }],
          },
        ]}
        slots={{ messageAuthorName: null }}
      >
        {null}
      </ChatBox>,
    );

    expect(document.body.textContent).not.toContain('Alice Hidden');
  });

  it('forwards slots.messageRoot to ChatMessage instead of replacing the row', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Body text' }] }]}
      >
        <ChatMessageGroup messageId="m1" slots={{ messageRoot: 'section' }} />
      </ChatRoot>,
    );

    // The message body still renders — the root slot only swaps the root element,
    // it must not replace the whole ChatMessage row.
    expect(screen.getByText('Body text')).not.toBe(null);
    // …and the custom element is applied as the message root.
    expect(document.querySelector('section.MuiChatMessage-root')).not.toBe(null);
  });

  it('treats children={null} as explicit empty content', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hidden' }] }]}
      >
        <ChatMessageGroup messageId="m1">{null}</ChatMessageGroup>
      </ChatRoot>,
    );

    expect(document.querySelector('.MuiChatMessage-group')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessage-root')).toBe(null);
    expect(screen.queryByText('Hidden')).toBe(null);
  });

  it('uses slots.messageGroup as the group wrapper, not the whole row', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Body text' }] }]}
        slots={{ messageGroup: 'section' }}
      >
        {null}
      </ChatBox>,
    );

    // The custom element wraps the group; the default message tree still renders
    // inside it (it must not replace the whole row and leave it empty).
    const group = document.querySelector('section.MuiChatMessage-group');
    expect(group).not.toBe(null);
    expect(group?.querySelector('.MuiChatMessage-root')).not.toBe(null);
    expect(screen.getByText('Body text')).not.toBe(null);
  });

  it('forwards slotProps.messageGroup.groupKey to the headless MessageGroup', () => {
    const farApartSameAuthor = [
      {
        id: 'm1',
        role: 'assistant' as const,
        status: 'sent' as const,
        author: { id: 'bot' },
        createdAt: '2026-03-14T10:00:00.000Z',
        parts: [{ type: 'text' as const, text: 'one' }],
      },
      {
        id: 'm2',
        role: 'assistant' as const,
        status: 'sent' as const,
        author: { id: 'bot' },
        createdAt: '2026-03-14T12:00:00.000Z',
        parts: [{ type: 'text' as const, text: 'two' }],
      },
    ];
    const members = [{ id: 'bot', displayName: 'Bot', avatarUrl: 'https://example.com/bot.png' }];

    // Default author-based grouping: the two same-author messages form one group,
    // so the follow-up's avatar is hidden — a single avatar renders.
    const { unmount } = render(
      <ChatBox adapter={createAdapter()} members={members} initialMessages={farApartSameAuthor}>
        {null}
      </ChatBox>,
    );
    expect(screen.getAllByRole('img')).to.have.length(1);
    unmount();

    // A time-window `groupKey` passed via `slotProps.messageGroup` must reach the
    // headless MessageGroup (not leak onto the wrapper): the messages are 2h apart,
    // so they fall into separate groups and both render their avatar.
    render(
      <ChatBox
        adapter={createAdapter()}
        members={members}
        initialMessages={farApartSameAuthor}
        slotProps={{ messageGroup: { groupKey: createTimeWindowGroupKey(60_000) } }}
      >
        {null}
      </ChatBox>,
    );
    expect(screen.getAllByRole('img')).to.have.length(2);
  });
});
