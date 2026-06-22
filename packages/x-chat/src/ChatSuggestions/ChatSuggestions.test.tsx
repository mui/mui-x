import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';

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

describe('ChatSuggestions', () => {
  it('renders without crashing inside ChatBox when suggestions are provided', () => {
    render(
      <ChatBox adapter={createAdapter()} suggestions={['How can I help you?', 'Tell me more']}>
        {null}
      </ChatBox>,
    );
    // Suggestions are shown when there are no messages; check via CSS class
    expect(document.querySelector('.MuiChatSuggestions-item')).not.toBe(null);
  });

  it('applies MuiChatSuggestions-root class when rendered', () => {
    render(
      <ChatBox adapter={createAdapter()} suggestions={['Suggestion A']}>
        {null}
      </ChatBox>,
    );
    expect(document.querySelector('.MuiChatSuggestions-root')).not.toBe(null);
  });

  it('renders suggestions above the composer when there are existing messages', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
        suggestions={['Suggestion A']}
      >
        {null}
      </ChatBox>,
    );
    // ChatBox surfaces suggestions as a next-prompt row above the composer when
    // the thread already has messages (ChatSuggestions opts in via `alwaysVisible`).
    const root = document.querySelector('.MuiChatSuggestions-root');
    expect(root).not.toBe(null);
    // `data-empty` is only set when empty (kebab-cased attributes skip `false`).
    expect(root!.hasAttribute('data-empty')).toBe(false);
    expect(document.querySelectorAll('.MuiChatSuggestions-item').length).toBe(1);
  });

  it('forwards custom className via slotProps.suggestions', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        suggestions={['Suggestion A']}
        slotProps={{ suggestions: { className: 'custom-suggestions' } }}
      >
        {null}
      </ChatBox>,
    );
    expect(document.querySelector('.custom-suggestions')).not.toBe(null);
  });

  it('composes object-form suggestion item onClick with selection and auto-submit', async () => {
    const handleItemClick = vi.fn();
    const sendMessage = vi.fn<ChatAdapter['sendMessage']>(async () => {
      return new ReadableStream({
        start(c) {
          c.close();
        },
      });
    });

    render(
      <ChatBox
        adapter={createAdapter({ sendMessage })}
        suggestions={['Run diagnostics']}
        suggestionsAutoSubmit
        slotProps={{
          suggestions: {
            slotProps: {
              item: { onClick: handleItemClick },
            },
          },
        }}
      >
        {null}
      </ChatBox>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Run diagnostics' }));

    expect(handleItemClick).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledTimes(1);
    });
    expect(sendMessage.mock.calls[0]![0].message.parts).toEqual([
      { type: 'text', text: 'Run diagnostics' },
    ]);
  });

  it('composes callback-form suggestion item onClick with composer prefill', () => {
    const handleItemClick = vi.fn();

    render(
      <ChatBox
        adapter={createAdapter()}
        suggestions={['Explain slots']}
        slotProps={{
          suggestions: {
            slotProps: {
              item: () => ({ onClick: handleItemClick }),
            },
          },
        }}
      >
        {null}
      </ChatBox>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Explain slots' }));

    expect(handleItemClick).toHaveBeenCalledTimes(1);
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('Explain slots');
  });
});
