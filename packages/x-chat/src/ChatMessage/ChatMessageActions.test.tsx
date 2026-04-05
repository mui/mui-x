import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatRoot, MessageRoot } from '@mui/x-chat-headless';
import { ChatMessageActions } from './ChatMessageActions';

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
});
