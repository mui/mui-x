import * as React from 'react';
import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatRoot, MessageRoot } from '@mui/x-chat-headless';
import { ChatMessageActions } from './ChatMessageActions';

const { render } = createRenderer();

const sampleMessage: ChatMessage = {
  id: 'm1',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'Hi' }],
};

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

describe('ChatMessageActions', () => {
  it('renders and applies MuiChatMessage-actions class inside a message context', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
      >
        <MessageRoot messageId="m1">
          <ChatMessageActions />
        </MessageRoot>
      </ChatRoot>,
    );
    expect(document.querySelector('.MuiChatMessage-actions')).not.toBe(null);
  });

  it('forwards custom className to the actions container', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
      >
        <MessageRoot messageId="m1">
          <ChatMessageActions className="custom-actions" />
        </MessageRoot>
      </ChatRoot>,
    );
    expect(document.querySelector('.custom-actions')).not.toBe(null);
  });

  it('renders an extraActions text button from label with a data-action attribute', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[sampleMessage]}>
        <MessageRoot messageId="m1">
          <ChatMessageActions
            message={sampleMessage}
            extraActions={[{ id: 'regenerate', label: 'Regenerate', onClick: () => {} }]}
          />
        </MessageRoot>
      </ChatRoot>,
    );

    const button = document.querySelector('button[data-action="regenerate"]');
    expect(button).not.toBe(null);
    expect(button!.textContent).toContain('Regenerate');
  });

  it('renders an icon button with aria-label and title when icon is set', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[sampleMessage]}>
        <MessageRoot messageId="m1">
          <ChatMessageActions
            message={sampleMessage}
            extraActions={[
              {
                id: 'regenerate',
                label: 'Regenerate',
                icon: <span data-testid="icon" />,
                onClick: () => {},
              },
            ]}
          />
        </MessageRoot>
      </ChatRoot>,
    );

    const button = document.querySelector('button[data-action="regenerate"]') as HTMLButtonElement;
    expect(button).not.toBe(null);
    expect(button.getAttribute('aria-label')).toBe('Regenerate');
    expect(button.getAttribute('title')).toBe('Regenerate');
    expect(button.querySelector('[data-testid="icon"]')).not.toBe(null);
  });

  it('renders a disabled extraActions button when disabled is set', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[sampleMessage]}>
        <MessageRoot messageId="m1">
          <ChatMessageActions
            message={sampleMessage}
            extraActions={[{ id: 'a', label: 'Action', disabled: true, onClick: () => {} }]}
          />
        </MessageRoot>
      </ChatRoot>,
    );

    const button = document.querySelector('button[data-action="a"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('invokes onClick with (event, { message, chat }) where chat.regenerate works', () => {
    const onClick = vi.fn();
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[sampleMessage]}>
        <MessageRoot messageId="m1">
          <ChatMessageActions
            message={sampleMessage}
            extraActions={[{ id: 'regenerate', label: 'Regenerate', onClick }]}
          />
        </MessageRoot>
      </ChatRoot>,
    );

    fireEvent.click(document.querySelector('button[data-action="regenerate"]')!);

    expect(onClick).toHaveBeenCalledTimes(1);
    const [, context] = onClick.mock.calls[0];
    expect(context.message).toEqual(sampleMessage);
    expect(typeof context.chat.regenerate).toBe('function');
  });

  it('renders provider-less without throwing; extraActions buttons appear disabled', () => {
    expect(() => {
      render(
        <ChatMessageActions
          message={sampleMessage}
          extraActions={[{ id: 'a', label: 'Action', onClick: () => {} }]}
        />,
      );
    }).toWarnDev([
      'MUI X Chat: `extraActions` on the message actions bar require a `<ChatProvider>`',
    ]);

    const button = document.querySelector('button[data-action="a"]') as HTMLButtonElement;
    expect(button).not.toBe(null);
    expect(button.disabled).toBe(true);
  });
});
