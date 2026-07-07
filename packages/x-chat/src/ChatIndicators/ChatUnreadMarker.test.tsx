import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';
import { ChatUnreadMarker } from './ChatUnreadMarker';

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

describe('ChatUnreadMarker', () => {
  it('renders without crashing inside ChatBox', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
      >
        {null}
      </ChatBox>,
    );
    // No crash — the marker only renders when there are unread messages
    expect(document.querySelector('.MuiChatBox-root')).not.toBe(null);
  });

  it('renders MuiChatUnreadMarker-root when the conversation has unread messages', () => {
    // unreadCount: 2 with 3 messages → boundaryIndex = 3 - 2 = 1 → marker appears before m2
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialConversations={[
          { id: 'c1', title: 'Chat', unreadCount: 2, readState: 'unread' as const },
        ]}
        initialActiveConversationId="c1"
        initialMessages={[
          { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Old' }] },
          { id: 'm2', role: 'assistant', status: 'sent', parts: [{ type: 'text', text: 'New 1' }] },
          { id: 'm3', role: 'assistant', status: 'sent', parts: [{ type: 'text', text: 'New 2' }] },
        ]}
      >
        <ChatUnreadMarker messageId="m2" />
      </ChatRoot>,
    );

    expect(document.querySelector('.MuiChatUnreadMarker-root')).not.toBe(null);
  });
});
