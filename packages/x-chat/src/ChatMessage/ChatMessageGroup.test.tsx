import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';

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

  it('overrides the author label via slots.message.authorName', () => {
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
        slots={{ message: { authorName: CustomLabel } }}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('[data-testid="custom-author-name"]')?.textContent).toBe(
      '[Alice]',
    );
  });

  it('hides the author label when slots.message.authorName is null', () => {
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
        slots={{ message: { authorName: null } }}
      >
        {null}
      </ChatBox>,
    );

    expect(document.body.textContent).not.toContain('Alice Hidden');
  });
});
