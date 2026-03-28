import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
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

describe('ChatMessageList', () => {
  it('renders without crashing inside ChatBox', () => {
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    // The message list is always rendered inside ChatBox
    expect(document.querySelector('.MuiChatMessageList-root')).not.toBe(null);
  });

  it('applies MuiChatMessageList-root class to the list root element', () => {
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
});
