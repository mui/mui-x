import * as React from 'react';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import {
  ChatRoot,
  type ChatAdapter,
  type ChatConversation,
  type ChatMessage,
  type ChatVariant,
} from '@mui/x-chat-headless';
import { CopilotThreadView } from './CopilotThreadView';
import { CopilotChatPanel } from './CopilotChatPanel';
import type { HistoryCapableChatAdapter } from './CopilotChatPanel.types';

function createAdapter(): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
  };
}

const MESSAGES: ChatMessage[] = [
  { id: 'u1', role: 'user', status: 'sent', parts: [{ type: 'text', text: 'Filter to last week' }] },
  {
    id: 'a1',
    role: 'assistant',
    status: 'sent',
    parts: [{ type: 'text', text: 'Done.' }],
    metadata: { responseId: 'resp-1' },
  },
];

// Renders the thread inside the same `ChatRoot` provider `CopilotChatPanel`
// wires, with the `variant` the panel forwards from `messageVariant` /
// `showAvatars`. The thread reads the variant via x-chat's `useChatVariant`.
function renderThread(
  render: ReturnType<typeof createRenderer>['render'],
  variant?: ChatVariant,
) {
  return render(
    <ChatRoot adapter={createAdapter()} initialMessages={MESSAGES} variant={variant}>
      <CopilotThreadView authorName="DataGrid Copilot" />
    </ChatRoot>,
  );
}

// The avatar slot size is the canonical signal x-chat flips per variant:
// `36px` in the default (avatars-shown) layout, `28px` in the compact
// (no-avatar bubble) layout.
function avatarSizes(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll<HTMLElement>('.MuiChatMessage-root')).map((root) =>
    getComputedStyle(root).getPropertyValue('--MuiChatMessage-avatarSize').trim(),
  );
}

describe('CopilotChatPanel message layout', () => {
  const { render } = createRenderer();

  it('renders the default (avatar) layout when no variant is forwarded', () => {
    const { container } = renderThread(render);

    const sizes = avatarSizes(container);
    expect(sizes.length).to.be.greaterThan(0);
    sizes.forEach((size) => expect(size).to.equal('36px'));
  });

  it('switches to the compact (no-avatar) layout when variant="compact" is forwarded', () => {
    const { container } = renderThread(render, 'compact');

    const sizes = avatarSizes(container);
    expect(sizes.length).to.be.greaterThan(0);
    // Compact collapses the avatar column (28px slot) — the visible difference
    // from the default 36px avatar layout the grid suppresses entirely.
    sizes.forEach((size) => expect(size).to.equal('28px'));
  });

  it('compact layout differs from the default layout', () => {
    const { container: defaultContainer } = renderThread(render);
    const { container: compactContainer } = renderThread(render, 'compact');

    expect(avatarSizes(defaultContainer)).to.not.deep.equal(avatarSizes(compactContainer));
  });

  // The panel's prop-resolution (`messageVariant` wins; `showAvatars === false`
  // → compact) is wired to the `ChatRoot` provider; these guard that passing the
  // new props through the public component renders cleanly (the repo fails on
  // any console.error).
  it('accepts messageVariant / showAvatars on the public CopilotChatPanel', async () => {
    function createHistoryAdapter(): HistoryCapableChatAdapter {
      const conversations: ChatConversation[] = [];
      return {
        async listConversations() {
          return { conversations };
        },
        async listMessages() {
          return { messages: [] };
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

    render(<CopilotChatPanel adapter={createHistoryAdapter()} messageVariant="compact" />);
    await waitFor(() => {
      expect(screen.getByText('Copilot')).not.to.equal(null);
    });

    render(<CopilotChatPanel adapter={createHistoryAdapter()} showAvatars={false} />);
    await waitFor(() => {
      expect(screen.getAllByText('Copilot').length).to.be.greaterThan(0);
    });
  });
});
