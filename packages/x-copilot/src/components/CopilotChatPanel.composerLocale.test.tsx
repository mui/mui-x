import { describe, it, expect } from 'vitest';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { CopilotChatPanel } from './CopilotChatPanel';

const mockAdapter = {
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

function getTextarea(): HTMLTextAreaElement | null {
  return document.querySelector('textarea');
}

describe('<CopilotChatPanel /> composer localeText', () => {
  const { render } = createRenderer();

  it('forwards localeText.promptFieldPlaceholder to the composer', async () => {
    render(
      <CopilotChatPanel
        adapter={mockAdapter as never}
        localeText={{ promptFieldPlaceholder: 'Ask the chart…' }}
      />,
    );

    await waitFor(() => {
      expect(getTextarea()?.placeholder).to.equal('Ask the chart…');
    });
  });

  it('falls back to the panel default placeholder when not overridden', async () => {
    render(<CopilotChatPanel adapter={mockAdapter as never} />);

    await waitFor(() => {
      // The panel's own default (DEFAULT_LOCALE_TEXT.promptFieldPlaceholder),
      // not the bare x-chat default — confirming the locale is wired.
      expect(getTextarea()?.placeholder).to.equal('Ask Copilot…');
    });
  });
});
