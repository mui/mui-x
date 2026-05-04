import * as React from 'react';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
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

const conversationListFeatures = { conversationList: true } as const;

describe('ChatConversationList', () => {
  it('renders without crashing and applies MuiChatConversationList-root class', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialConversations={[
          { id: 'c1', title: 'General' },
          { id: 'c2', title: 'Support' },
        ]}
        features={conversationListFeatures}
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
        features={conversationListFeatures}
      >
        {null}
      </ChatBox>,
    );

    const items = document.querySelectorAll('.MuiChatConversationList-item');
    expect(items.length).toBe(2);
  });

  it('applies MuiChatConversationList-itemSelected class on the active conversation', async () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialConversations={[
          { id: 'c1', title: 'General' },
          { id: 'c2', title: 'Support' },
        ]}
        initialActiveConversationId="c1"
        features={conversationListFeatures}
      >
        {null}
      </ChatBox>,
    );

    await waitFor(() => {
      const selectedItem = document.querySelector('.MuiChatConversationList-itemSelected');
      expect(selectedItem).not.toBe(null);
      expect(document.querySelectorAll('.MuiChatConversationList-itemSelected').length).toBe(1);
    });
  });

  it('applies MuiChatConversationList-itemUnread class to unread conversations', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialConversations={[
          { id: 'c1', title: 'General', unreadCount: 3, readState: 'unread' as const },
        ]}
        features={conversationListFeatures}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('.MuiChatConversationList-itemUnread')).not.toBe(null);
  });

  it('renders NoopScrollbar (no scrollbar elements) in the conversation list', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialConversations={[{ id: 'c1', title: 'General' }]}
        features={conversationListFeatures}
      >
        {null}
      </ChatBox>,
    );

    // The scroller should be rendered but the scrollbar should not (NoopScrollbar renders null)
    expect(document.querySelector('.MuiChatConversationList-scroller')).not.toBe(null);
    // MuiChatConversationList-scrollbar slot is overridden by NoopScrollbar which renders null
    expect(document.querySelector('[data-scrollbar]')).toBe(null);
  });
});
