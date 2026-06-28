import * as React from 'react';
import { createRenderer, screen, fireEvent, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  ChatRoot,
  type ChatAdapter,
  type ChatConversation,
  type ChatMessage,
} from '@mui/x-chat-headless';
import { CopilotHistoryView } from './CopilotHistoryView';

const NOW = Date.now();
const DAY = 86_400_000;

const CONVERSATIONS: ChatConversation[] = [
  { id: 'c-active', title: 'Active conversation', lastMessageAt: new Date(NOW).toISOString() },
  { id: 'c-yesterday', title: 'Yesterday chat', lastMessageAt: new Date(NOW - DAY).toISOString() },
  { id: 'c-old', title: 'Old chat', lastMessageAt: new Date(NOW - DAY * 10).toISOString() },
];

function makeMessage(conversationId: string): ChatMessage {
  return {
    id: `${conversationId}-m1`,
    conversationId,
    role: 'assistant',
    parts: [{ type: 'text', text: 'Hello' }],
  };
}

// Map-backed fake adapter — window.localStorage is only a partial stub in jsdom,
// so the conversation/message stores are held in plain Maps.
function createMapBackedAdapter(): ChatAdapter {
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

function renderHistory(
  ui: React.ReactElement,
  render: ReturnType<typeof createRenderer>['render'],
) {
  return render(
    <ChatRoot
      adapter={createMapBackedAdapter()}
      initialConversations={CONVERSATIONS}
      initialActiveConversationId="c-active"
    >
      {ui}
    </ChatRoot>,
  );
}

describe('<CopilotHistoryView />', () => {
  const { render } = createRenderer();

  it('renders conversations grouped into "This session" and "Earlier"', async () => {
    renderHistory(<CopilotHistoryView />, render);

    await waitFor(() => {
      expect(screen.getByText('This session')).not.to.equal(null);
    });

    expect(screen.getByText('Earlier')).not.to.equal(null);
    expect(screen.getByText('Active conversation')).not.to.equal(null);
    expect(screen.getByText('Yesterday chat')).not.to.equal(null);
    expect(screen.getByText('Old chat')).not.to.equal(null);
    // The active conversation's relative date renders as the "Today" label.
    expect(screen.getByText('Today')).not.to.equal(null);
    expect(screen.getByText('Yesterday')).not.to.equal(null);
  });

  it('fires onSelectConversation when a conversation is clicked', async () => {
    const onSelectConversation = vi.fn();
    renderHistory(<CopilotHistoryView onSelectConversation={onSelectConversation} />, render);

    await waitFor(() => {
      expect(screen.getByText('Yesterday chat')).not.to.equal(null);
    });

    fireEvent.click(screen.getByText('Yesterday chat'));

    await waitFor(() => {
      expect(onSelectConversation).toHaveBeenCalledWith('c-yesterday');
    });
  });

  it('fires onNewConversation from the header action', async () => {
    const onNewConversation = vi.fn();
    renderHistory(<CopilotHistoryView onNewConversation={onNewConversation} />, render);

    await waitFor(() => {
      expect(screen.getByText('This session')).not.to.equal(null);
    });

    fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
    expect(onNewConversation).toHaveBeenCalledTimes(1);
  });

  it('fires onDeleteConversation without selecting the row', async () => {
    const onSelectConversation = vi.fn();
    const onDeleteConversation = vi.fn();
    renderHistory(
      <CopilotHistoryView
        onSelectConversation={onSelectConversation}
        onDeleteConversation={onDeleteConversation}
      />,
      render,
    );

    await waitFor(() => {
      expect(screen.getByText('Old chat')).not.to.equal(null);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Delete Old chat' }));

    await waitFor(() => {
      expect(onDeleteConversation).toHaveBeenCalledWith('c-old');
    });
    expect(onSelectConversation).not.toHaveBeenCalled();
  });

  it('honors localeText overrides for group headers', async () => {
    renderHistory(<CopilotHistoryView localeText={{ session: 'Current', all: 'Past' }} />, render);

    await waitFor(() => {
      expect(screen.getByText('Current')).not.to.equal(null);
    });
    expect(screen.getByText('Past')).not.to.equal(null);
  });
});
