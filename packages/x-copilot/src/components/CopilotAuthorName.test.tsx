import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import {
  ChatProvider,
  ChatVariantProvider,
  type ChatAdapter,
  type ChatMessage,
} from '@mui/x-chat-headless';
import { CopilotThreadView } from './CopilotThreadView';

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

const USER_MESSAGE: ChatMessage = {
  id: 'u1',
  role: 'user',
  status: 'sent',
  parts: [{ type: 'text', text: 'Filter to last week' }],
};

const ASSISTANT_MESSAGE: ChatMessage = {
  id: 'a1',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'Done, here is the result.' }],
  metadata: { responseId: 'resp-1' },
};

function renderThread(
  ui: React.ReactElement,
  render: ReturnType<typeof createRenderer>['render'],
  messages: ChatMessage[],
) {
  return render(
    <ChatProvider adapter={createAdapter()} initialMessages={messages}>
      {ui}
    </ChatProvider>,
  );
}

describe('CopilotChatPanel authorName', () => {
  const { render } = createRenderer();

  it('labels assistant messages with a static authorName string', () => {
    renderThread(
      <CopilotThreadView authorName="DataGrid Copilot" />,
      render,
      [USER_MESSAGE, ASSISTANT_MESSAGE],
    );

    expect(screen.getByText('DataGrid Copilot')).not.to.equal(null);
  });

  it('does not relabel non-assistant messages', () => {
    renderThread(
      <CopilotThreadView authorName="DataGrid Copilot" />,
      render,
      [USER_MESSAGE, ASSISTANT_MESSAGE],
    );

    // The static label is applied only to assistant rows; the user row keeps
    // its default author label (its role), so "DataGrid Copilot" appears once.
    expect(screen.getAllByText('DataGrid Copilot')).to.have.length(1);
  });

  it('resolves authorName per message via a function', () => {
    renderThread(
      <CopilotThreadView
        authorName={(message) =>
          message.role === 'assistant' ? `Bot ${message.id}` : undefined
        }
      />,
      render,
      [USER_MESSAGE, ASSISTANT_MESSAGE],
    );

    expect(screen.getByText('Bot a1')).not.to.equal(null);
  });

  it('leaves the default author rendering unchanged when authorName is absent', () => {
    renderThread(<CopilotThreadView />, render, [USER_MESSAGE, ASSISTANT_MESSAGE]);

    expect(screen.queryByText('DataGrid Copilot')).to.equal(null);
    // The default author label for an unauthored assistant message is x-chat's
    // role display name ("Assistant").
    expect(screen.getByText('Assistant')).not.to.equal(null);
  });

  it('labels assistant messages in the compact variant', () => {
    // Regression: in the `compact` variant x-chat routes the author label
    // through `groupAuthorName`, which `ChatMessage` only renders in its
    // custom-children path (the panel's composition). Without that, the
    // assistant author label silently disappeared in the Data Grid panel.
    render(
      <ChatProvider adapter={createAdapter()} initialMessages={[USER_MESSAGE, ASSISTANT_MESSAGE]}>
        <ChatVariantProvider variant="compact">
          <CopilotThreadView authorName="DataGrid Copilot" />
        </ChatVariantProvider>
      </ChatProvider>,
    );

    expect(screen.getByText('DataGrid Copilot')).not.to.equal(null);
  });
});
