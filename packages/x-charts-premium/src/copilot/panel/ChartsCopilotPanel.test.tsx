import { describe, it, expect } from 'vitest';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChartsCopilotPanel } from './ChartsCopilotPanel';

const mockAdapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  },
  async listConversations() {
    return { conversations: [], hasMore: false };
  },
  async listMessages() {
    return { messages: [], hasMore: false };
  },
  subscribe() {
    return () => {};
  },
} as ChatAdapter;

describe('<ChartsCopilotPanel />', () => {
  const { render } = createRenderer();

  it('renders the shared Copilot chat panel with the charts title', async () => {
    render(
      <div data-testid="container">
        <ChartsCopilotPanel adapter={mockAdapter} />
      </div>,
    );

    // CopilotChatPanel loads its conversation list asynchronously; waitFor
    // flushes that state update inside act() so it doesn't escape the test (the
    // repo fails on any console.error, including act() warnings).
    await waitFor(() => {
      expect(screen.queryByText('Chart Copilot')).not.to.equal(null);
    });
  });
});
