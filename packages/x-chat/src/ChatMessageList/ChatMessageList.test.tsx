import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';
import { ChatConversation } from '../ChatConversation/ChatConversation';
import { ChatMessageList } from './ChatMessageList';

const { render } = createRenderer();

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(c) {
          c.close();
        },
      });
    },
    ...overrides,
  };
}

describe('ChatMessageList', () => {
  it('renders and applies MuiChatMessageList-root class inside ChatBox', () => {
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    expect(document.querySelector('.MuiChatMessageList-root')).not.toBe(null);
  });

  it('renders messages inside the list', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
      >
        {null}
      </ChatBox>,
    );
    expect(screen.getByText('Hello')).not.toBe(null);
  });

  it('renders the default row when used standalone without renderItem', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hi' }] }]}
      >
        <ChatConversation>
          <ChatMessageList />
        </ChatConversation>
      </ChatRoot>,
    );
    expect(document.querySelector('.MuiChatMessage-group')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessage-root')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessage-avatar')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessage-content')).not.toBe(null);
    expect(screen.getByText('Hi')).not.toBe(null);
  });

  it('uses a custom renderItem when provided', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Ignored' }] }]}
      >
        <ChatConversation>
          <ChatMessageList renderItem={({ id }) => <div data-testid="custom-row">{id}</div>} />
        </ChatConversation>
      </ChatRoot>,
    );
    expect(screen.getByTestId('custom-row').textContent).toBe('m1');
    // Default row chrome should not render when a custom renderItem wins.
    expect(document.querySelector('.MuiChatMessage-root')).toBe(null);
  });

  it('honors a row slot override in the default render path', () => {
    function CustomAvatar() {
      return <span data-testid="custom-avatar" />;
    }
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
      >
        <ChatConversation>
          <ChatMessageList slots={{ messageAvatar: CustomAvatar }} />
        </ChatConversation>
      </ChatRoot>,
    );
    // Custom avatar replaces the default, but the rest of the row chrome stays.
    expect(screen.getByTestId('custom-avatar')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessage-group')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessage-root')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessage-content')).not.toBe(null);
  });

  it('preserves Material list slot defaults when list slots are explicitly undefined', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
      >
        <ChatConversation>
          <ChatMessageList
            slots={
              {
                messageList: undefined,
                messageListScroller: undefined,
                messageListContent: undefined,
              } as any
            }
          />
        </ChatConversation>
      </ChatRoot>,
    );

    expect(document.querySelector('.MuiChatMessageList-root')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessageList-scroller')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessageList-content')).not.toBe(null);
    expect(document.querySelector('style[href="base-ui-disable-scrollbar"]')).toBe(null);
  });

  it('does not render row dividers by default when used standalone', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          {
            id: 'm1',
            role: 'user',
            createdAt: '2026-03-13T10:00:00.000Z',
            parts: [{ type: 'text', text: 'Day one' }],
          },
          {
            id: 'm2',
            role: 'user',
            createdAt: '2026-03-14T10:00:00.000Z',
            parts: [{ type: 'text', text: 'Day two' }],
          },
        ]}
      >
        <ChatConversation>
          <ChatMessageList />
        </ChatConversation>
      </ChatRoot>,
    );

    // Dividers are an opt-in feature; a day boundary alone must not render one.
    expect(document.querySelector('.MuiChatMessage-dateDivider')).toBe(null);
  });

  it('renders the date divider when features.dateDivider is enabled standalone', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          {
            id: 'm1',
            role: 'user',
            createdAt: '2026-03-13T10:00:00.000Z',
            parts: [{ type: 'text', text: 'Day one' }],
          },
          {
            id: 'm2',
            role: 'user',
            createdAt: '2026-03-14T10:00:00.000Z',
            parts: [{ type: 'text', text: 'Day two' }],
          },
        ]}
      >
        <ChatConversation>
          <ChatMessageList features={{ dateDivider: true }} />
        </ChatConversation>
      </ChatRoot>,
    );

    // One day boundary (m1→m2) → exactly one self-suppressing divider renders.
    expect(document.querySelectorAll('.MuiChatMessage-dateDivider').length).toBe(1);
  });

  it('groups against the rendered items subset, not the full conversation', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        members={[{ id: 'alice', displayName: 'Alice Author' }]}
        initialMessages={[
          {
            id: 'm1',
            role: 'assistant',
            status: 'sent',
            author: { id: 'alice' },
            parts: [{ type: 'text', text: 'One' }],
          },
          {
            id: 'm2',
            role: 'assistant',
            status: 'sent',
            author: { id: 'alice' },
            parts: [{ type: 'text', text: 'Two' }],
          },
          {
            id: 'm3',
            role: 'assistant',
            status: 'sent',
            author: { id: 'alice' },
            parts: [{ type: 'text', text: 'Three' }],
          },
        ]}
      >
        <ChatConversation>
          <ChatMessageList items={['m2', 'm3']} />
        </ChatConversation>
      </ChatRoot>,
    );

    // Only m2/m3 are rendered. m2 is the first row of the rendered list, so it must be
    // treated as the start of a group (author label shown) — it would be wrongly grouped
    // against the off-list m1 if grouping ran on the full conversation.
    expect(screen.getByText('Two')).not.toBe(null);
    expect(screen.queryByText('One')).toBe(null);
    expect(document.body.textContent).toContain('Alice Author');
  });
});
