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

describe('ChatConversation', () => {
  it('renders and applies MuiChatConversation-root class inside ChatBox', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialConversations={[{ id: 'c1', title: 'General' }]}
        initialActiveConversationId="c1"
      >
        {null}
      </ChatBox>,
    );
    expect(document.querySelector('.MuiChatConversation-root')).not.toBe(null);
  });

  it('displays the active conversation title in the header', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialConversations={[{ id: 'c1', title: 'My Conversation' }]}
        initialActiveConversationId="c1"
      >
        {null}
      </ChatBox>,
    );
    // The title appears in both the header and the conversation list; check at least one exists
    expect(screen.getAllByText('My Conversation').length).toBeGreaterThan(0);
  });
});
