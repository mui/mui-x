import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-headless';
import { ChatDateDivider } from './ChatDateDivider';

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

// Two timestamps guaranteed to be on different calendar days
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const today = new Date().toISOString();

describe('ChatDateDivider', () => {
  it('renders MuiChatMessage-dateDivider class when messages span multiple days', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          {
            id: 'm1',
            role: 'user',
            parts: [{ type: 'text', text: 'Yesterday' }],
            createdAt: yesterday,
          },
          { id: 'm2', role: 'user', parts: [{ type: 'text', text: 'Today' }], createdAt: today },
        ]}
      >
        {/* Render the divider for message m2 — index 1, previous day was m1 */}
        <ChatDateDivider messageId="m2" />
      </ChatRoot>,
    );

    expect(document.querySelector('.MuiChatMessage-dateDivider')).not.toBe(null);
  });

  it('does not render a date divider when all messages are from the same day', () => {
    const now = new Date().toISOString();
    const slightlyLater = new Date(Date.now() + 60 * 1000).toISOString();

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'First' }], createdAt: now },
          {
            id: 'm2',
            role: 'user',
            parts: [{ type: 'text', text: 'Second' }],
            createdAt: slightlyLater,
          },
        ]}
      >
        <ChatDateDivider messageId="m2" />
      </ChatRoot>,
    );

    expect(document.querySelector('.MuiChatMessage-dateDivider')).toBe(null);
  });
});
