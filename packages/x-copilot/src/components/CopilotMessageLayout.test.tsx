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

// The avatar slot size is the canonical signal x-chat flips per variant. The
// Copilot composes its own message body and never renders an avatar, so in the
// `compact` variant it hides the avatar slot and the reserved track collapses to
// `0px`; the `default` variant keeps x-chat's `36px` avatar track.
function avatarSizes(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll<HTMLElement>('.MuiChatMessage-root')).map((root) =>
    getComputedStyle(root).getPropertyValue('--MuiChatMessage-avatarSize').trim(),
  );
}

describe('CopilotChatPanel message layout', () => {
  const { render } = createRenderer();

  it('keeps x-chat\'s avatar track in the default variant', () => {
    const { container } = renderThread(render);

    const sizes = avatarSizes(container);
    expect(sizes.length).to.be.greaterThan(0);
    sizes.forEach((size) => expect(size).to.equal('36px'));
  });

  it('collapses the avatar track in the compact variant', () => {
    const { container } = renderThread(render, 'compact');

    const sizes = avatarSizes(container);
    expect(sizes.length).to.be.greaterThan(0);
    // The Copilot hides the avatar in compact, so the reserved track collapses
    // to `0px` (vs the `28px` x-chat would otherwise reserve).
    sizes.forEach((size) => expect(size).to.equal('0px'));
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
