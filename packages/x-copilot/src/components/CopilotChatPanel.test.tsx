import * as React from 'react';
import { createRenderer, screen, fireEvent, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';
import { CopilotChatPanel } from './CopilotChatPanel';
import type { HistoryCapableChatAdapter } from './CopilotChatPanel.types';

const NOW = Date.now();
const DAY = 86_400_000;

const CONVERSATIONS: ChatConversation[] = [
  { id: 'c-active', title: 'Active conversation', lastMessageAt: new Date(NOW).toISOString() },
  { id: 'c-old', title: 'Older chat', lastMessageAt: new Date(NOW - DAY * 3).toISOString() },
];

function makeMessage(conversationId: string): ChatMessage {
  return {
    id: `${conversationId}-m1`,
    conversationId,
    role: 'assistant',
    parts: [{ type: 'text', text: 'Hello from history' }],
  };
}

// Map-backed fake adapter — window.localStorage is only a partial stub in
// jsdom, so the conversation/message stores live in plain Maps.
function createMapBackedAdapter(): HistoryCapableChatAdapter {
  const conversations = new Map<string, ChatConversation>(
    CONVERSATIONS.map((conversation) => [conversation.id, conversation]),
  );
  const messages = new Map<string, ChatMessage[]>(
    CONVERSATIONS.map((conversation) => [conversation.id, [makeMessage(conversation.id)]]),
  );

  return {
    async listConversations() {
      return { conversations: Array.from(conversations.values()) };
    },
    async listMessages(input) {
      return { messages: messages.get(input.conversationId) ?? [] };
    },
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
  };
}

describe('<CopilotChatPanel />', () => {
  const { render } = createRenderer();

  it('renders the panel chrome (title, BETA badge, and header buttons)', async () => {
    render(<CopilotChatPanel adapter={createMapBackedAdapter()} />);

    await waitFor(() => {
      expect(screen.getByText('Copilot')).not.to.equal(null);
    });

    expect(screen.getByText('BETA')).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'Open menu' })).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'New conversation' })).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'Close' })).not.to.equal(null);
  });

  it('shows the empty-state hero in the thread view', async () => {
    render(<CopilotChatPanel adapter={createMapBackedAdapter()} />);

    await waitFor(() => {
      expect(screen.getByText('How can I help?')).not.to.equal(null);
    });
  });

  it('opens the menu view (history + settings) when the hamburger button is clicked', async () => {
    render(<CopilotChatPanel adapter={createMapBackedAdapter()} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Open menu' })).not.to.equal(null);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    await waitFor(() => {
      // Menu view shows the History section + the Settings/Feedback/Report rows.
      expect(screen.getByText('History')).not.to.equal(null);
      expect(screen.getByText('Settings')).not.to.equal(null);
    });
    // The thread chrome (BETA badge) is replaced by the menu view.
    expect(screen.queryByText('BETA')).to.equal(null);
  });

  it('lists conversations in the menu and loads the selected one into the thread', async () => {
    render(<CopilotChatPanel adapter={createMapBackedAdapter()} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Open menu' })).not.to.equal(null);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    // The History section is populated from the adapter's listConversations.
    await waitFor(() => {
      expect(screen.getByText('Active conversation')).not.to.equal(null);
      expect(screen.getByText('Older chat')).not.to.equal(null);
    });

    // Selecting a conversation returns to the thread and loads its messages.
    fireEvent.click(screen.getByText('Older chat'));

    await waitFor(() => {
      expect(screen.getByText('Hello from history')).not.to.equal(null);
    });
  });

  it('restores initialActiveConversationId on mount instead of the empty state', async () => {
    render(
      <CopilotChatPanel adapter={createMapBackedAdapter()} initialActiveConversationId="c-old" />,
    );

    // The thread loads the seeded conversation's messages on mount...
    await waitFor(() => {
      expect(screen.getByText('Hello from history')).not.to.equal(null);
    });
    // ...rather than showing the empty-state hero.
    expect(screen.queryByText('How can I help?')).to.equal(null);
  });

  it('honors localeText overrides for the chrome', async () => {
    render(
      <CopilotChatPanel
        adapter={createMapBackedAdapter()}
        localeText={{ title: 'Assistant', beta: 'PREVIEW' }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Assistant')).not.to.equal(null);
    });
    expect(screen.getByText('PREVIEW')).not.to.equal(null);
  });
});
