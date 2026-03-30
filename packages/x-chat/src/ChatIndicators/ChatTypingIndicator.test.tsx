import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';

const { render } = createRenderer();

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({ start(c) { c.close(); } });
    },
    ...overrides,
  };
}

describe('ChatTypingIndicator', () => {
  it('renders without crashing inside ChatBox', () => {
    // TypingIndicator returns null when no users are typing; just verify no crash
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    expect(document.querySelector('.MuiChatBox-root')).not.toBe(null);
  });

  it('does not render the typing indicator when no users are typing', () => {
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    expect(document.querySelector('.MuiChatTypingIndicator-root')).toBe(null);
  });

  it('does not crash when className is passed via slotProps.typingIndicator', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        slotProps={{ typingIndicator: { className: 'custom-typing' } }}
      >
        {null}
      </ChatBox>,
    );
    expect(document.querySelector('.MuiChatBox-root')).not.toBe(null);
  });
});
