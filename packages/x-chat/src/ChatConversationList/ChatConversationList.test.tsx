import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';

const { render } = createRenderer();

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
    ...overrides,
  };
}

describe('ChatConversationList', () => {
  it('renders without crashing and applies MuiChatConversationList-root class', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialConversations={[
          { id: 'c1', title: 'General' },
          { id: 'c2', title: 'Support' },
        ]}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('.MuiChatConversationList-root')).not.toBe(null);
  });

  it('applies MuiChatConversationList-item class to each conversation item', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialConversations={[
          { id: 'c1', title: 'General' },
          { id: 'c2', title: 'Support' },
        ]}
      >
        {null}
      </ChatBox>,
    );

    const items = document.querySelectorAll('.MuiChatConversationList-item');
    expect(items.length).toBe(2);
  });

  it('applies MuiChatConversationList-itemSelected class on the active conversation', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialConversations={[
          { id: 'c1', title: 'General' },
          { id: 'c2', title: 'Support' },
        ]}
        initialActiveConversationId="c1"
      >
        {null}
      </ChatBox>,
    );

    const selectedItem = document.querySelector('.MuiChatConversationList-itemSelected');
    expect(selectedItem).not.toBe(null);
    // Only one item should be selected
    expect(document.querySelectorAll('.MuiChatConversationList-itemSelected').length).toBe(1);
  });

  it('applies MuiChatConversationList-itemUnread class to unread conversations', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialConversations={[
          { id: 'c1', title: 'General', unreadCount: 3, readState: 'unread' as const },
        ]}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('.MuiChatConversationList-itemUnread')).not.toBe(null);
  });

  it('renders NoopScrollbar (no scrollbar elements) in the conversation list', () => {
    render(
      <ChatBox adapter={createAdapter()} initialConversations={[{ id: 'c1', title: 'General' }]}>
        {null}
      </ChatBox>,
    );

    // The scroller should be rendered but the scrollbar should not (NoopScrollbar renders null)
    expect(document.querySelector('.MuiChatConversationList-scroller')).not.toBe(null);
    // MuiChatConversationList-scrollbar slot is overridden by NoopScrollbar which renders null
    expect(document.querySelector('[data-scrollbar]')).toBe(null);
  });
});
