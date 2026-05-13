import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
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

  it('forwards custom className via slotProps.composerInput', () => {
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
});
