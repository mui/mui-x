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

describe('ChatComposerAttachButton', () => {
  it('renders without crashing inside ChatBox', () => {
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    expect(screen.getByRole('button', { name: /attach/i })).not.toBe(null);
  });

  it('applies MuiChatComposer-attachButton class', () => {
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    expect(document.querySelector('.MuiChatComposer-attachButton')).not.toBe(null);
  });

  it('forwards custom className via slotProps.composerAttachButton', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        slotProps={{ composerAttachButton: { className: 'custom-attach-btn' } }}
      >
        {null}
      </ChatBox>,
    );
    expect(document.querySelector('.custom-attach-btn')).not.toBe(null);
  });
});
