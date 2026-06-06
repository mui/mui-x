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

describe('ChatComposerTextArea', () => {
  it('renders without crashing inside ChatBox', () => {
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    expect(screen.getByRole('textbox')).not.toBe(null);
  });

  it('applies MuiChatComposer-textArea class', () => {
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    expect(document.querySelector('.MuiChatComposer-textArea')).not.toBe(null);
  });

  it('forwards custom className via slotProps.input', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        slotProps={{ composerInput: { className: 'custom-textarea' } }}
      >
        {null}
      </ChatBox>,
    );
    expect(document.querySelector('.custom-textarea')).not.toBe(null);
  });

  it('composes slotProps.input.onChange with composer draft updates', async () => {
    const handleChange = vi.fn();
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
        slotProps={{
          composerInput: {
            slotProps: {
              input: { onChange: handleChange },
            },
          },
        }}
      >
        {null}
      </ChatBox>,
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Draft preserved' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledTimes(1);
    });
    expect(sendMessage.mock.calls[0]![0].message.parts).toEqual([
      { type: 'text', text: 'Draft preserved' },
    ]);
  });

  it('composes slotProps.input.onKeyDown with Enter submit', async () => {
    const handleKeyDown = vi.fn();
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
        slotProps={{
          composerInput: {
            slotProps: {
              input: { onKeyDown: handleKeyDown },
            },
          },
        }}
      >
        {null}
      </ChatBox>,
    );

    const textbox = screen.getByRole('textbox');
    fireEvent.change(textbox, { target: { value: 'Submit from keyboard' } });
    textbox.focus();
    fireEvent.keyDown(textbox, { key: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledTimes(1);
    });
    expect(sendMessage.mock.calls[0]![0].message.parts).toEqual([
      { type: 'text', text: 'Submit from keyboard' },
    ]);
  });

  it('forwards slotProps.input event handlers it does not compose (onFocus, onPaste)', () => {
    const handleFocus = vi.fn();
    const handlePaste = vi.fn();

    render(
      <ChatBox
        adapter={createAdapter()}
        slotProps={{
          composerInput: {
            slotProps: {
              input: { onFocus: handleFocus, onPaste: handlePaste },
            },
          },
        }}
      >
        {null}
      </ChatBox>,
    );

    const textbox = screen.getByRole('textbox');
    fireEvent.focus(textbox);
    fireEvent.paste(textbox);

    expect(handleFocus).toHaveBeenCalledTimes(1);
    expect(handlePaste).toHaveBeenCalledTimes(1);
  });

  it('lets slotProps.input.onChange preventDefault block the composer draft update', () => {
    const handleChange = vi.fn((event: React.ChangeEvent<HTMLTextAreaElement>) => {
      event.preventDefault();
    });

    render(
      <ChatBox
        adapter={createAdapter()}
        slotProps={{ composerInput: { slotProps: { input: { onChange: handleChange } } } }}
      >
        {null}
      </ChatBox>,
    );

    const textbox = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textbox, { target: { value: 'Blocked' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    // The controlled value stays empty because setValue was skipped.
    expect(textbox.value).to.equal('');
  });

  it('lets slotProps.input.onKeyDown preventDefault block Enter submit', async () => {
    const sendMessage = vi.fn<ChatAdapter['sendMessage']>(async () => {
      return new ReadableStream({
        start(c) {
          c.close();
        },
      });
    });
    const handleKeyDown = vi.fn((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    });

    render(
      <ChatBox
        adapter={createAdapter({ sendMessage })}
        slotProps={{ composerInput: { slotProps: { input: { onKeyDown: handleKeyDown } } } }}
      >
        {null}
      </ChatBox>,
    );

    const textbox = screen.getByRole('textbox');
    fireEvent.change(textbox, { target: { value: 'Should not send' } });
    textbox.focus();
    fireEvent.keyDown(textbox, { key: 'Enter' });

    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    await Promise.resolve();
    expect(sendMessage).toHaveBeenCalledTimes(0);
  });
});
