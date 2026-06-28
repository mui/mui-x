import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import {
  ChatProvider,
  type ChatAdapter,
  type ChatMessage,
} from '@mui/x-chat-headless';
import { CopilotThreadView } from './CopilotThreadView';
import type { CopilotChatPanelAppliedChangesProps } from './CopilotChatPanel.types';

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

describe('<CopilotThreadView />', () => {
  const { render } = createRenderer();

  it('renders the empty-state hero when there are no messages', () => {
    renderThread(<CopilotThreadView />, render, []);
    expect(screen.getByText('How can I help?')).not.to.equal(null);
  });

  it('renders fixture user + assistant messages', () => {
    renderThread(<CopilotThreadView />, render, [USER_MESSAGE, ASSISTANT_MESSAGE]);

    expect(screen.getByText('Filter to last week')).not.to.equal(null);
    expect(screen.getByText('Done, here is the result.')).not.to.equal(null);
    // The empty-state hero is gone once messages exist.
    expect(screen.queryByText('How can I help?')).to.equal(null);
  });

  it('renders the provided appliedChanges slot for an assistant message', () => {
    function AppliedChanges(props: CopilotChatPanelAppliedChangesProps) {
      // Host slots render per-message; mirror real ones by rendering only for
      // assistant messages.
      if (props.message.role !== 'assistant') {
        return null;
      }
      return <div data-testid="applied-changes">changes for {props.message.id}</div>;
    }

    // The metadataCard injection point is used to surface a host-supplied block
    // (here standing in for the grid's applied-changes view) per assistant
    // message; the generic panel defaults it to the metadata card.
    renderThread(
      <CopilotThreadView metadataCard={AppliedChanges} />,
      render,
      [USER_MESSAGE, ASSISTANT_MESSAGE],
    );

    const applied = screen.getAllByTestId('applied-changes');
    expect(applied.length).to.be.greaterThan(0);
    expect(applied[0].textContent).to.equal('changes for a1');
  });
});
