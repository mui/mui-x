import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
  ChatProvider,
  type ChatAdapter,
  type ChatMessage,
} from '@mui/x-chat-headless';
import { CopilotMessageFooter } from './CopilotMessageFooter';
import { CopilotFeedbackProvider } from './CopilotFeedbackProvider';
import type { CopilotFeedbackSubmit } from './CopilotChatPanel.types';

const ASSISTANT_MESSAGE: ChatMessage = {
  id: 'm1',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'Done.' }],
  metadata: { responseId: 'resp-1' },
};

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

function renderFooter(options: {
  message?: ChatMessage;
  submit?: CopilotFeedbackSubmit;
} = {}) {
  const message = options.message ?? ASSISTANT_MESSAGE;
  const tree = (
    <ChatProvider adapter={createAdapter()} initialMessages={[message]}>
      {options.submit ? (
        <CopilotFeedbackProvider submit={options.submit}>
          <CopilotMessageFooter message={message} />
        </CopilotFeedbackProvider>
      ) : (
        <CopilotMessageFooter message={message} />
      )}
    </ChatProvider>
  );
  return tree;
}

describe('<CopilotMessageFooter />', () => {
  const { render } = createRenderer();

  it('renders thumbs-up / thumbs-down buttons for an assistant message', () => {
    render(renderFooter({ submit: () => {} }));
    expect(screen.getByLabelText('Mark this answer as helpful')).not.to.equal(null);
    expect(screen.getByLabelText('Mark this answer as not helpful')).not.to.equal(null);
  });

  it('calls the provided submit handler with a thumbs payload when clicked', async () => {
    const submit = vi.fn();
    render(renderFooter({ submit }));

    fireEvent.click(screen.getByLabelText('Mark this answer as helpful'));

    await waitFor(() => {
      expect(submit).toHaveBeenCalledTimes(1);
    });
    expect(submit).toHaveBeenCalledWith({
      kind: 'thumbs',
      responseId: 'resp-1',
      feedback: 'positive',
    });
  });

  it('submits negative feedback when the thumbs-down button is clicked', async () => {
    const submit = vi.fn();
    render(renderFooter({ submit }));

    fireEvent.click(screen.getByLabelText('Mark this answer as not helpful'));

    await waitFor(() => {
      expect(submit).toHaveBeenCalledTimes(1);
    });
    expect(submit).toHaveBeenCalledWith({
      kind: 'thumbs',
      responseId: 'resp-1',
      feedback: 'negative',
    });
  });

  it('renders nothing without a responseId to correlate feedback', () => {
    const message: ChatMessage = { ...ASSISTANT_MESSAGE, metadata: {} };
    render(renderFooter({ message, submit: () => {} }));
    expect(screen.queryByLabelText('Mark this answer as helpful')).to.equal(null);
  });

  it('renders nothing for an A/B-pair message (handled by the A/B tabs)', () => {
    const message: ChatMessage = {
      ...ASSISTANT_MESSAGE,
      metadata: { responseId: 'resp-1', abPairId: 'pair-1', abVariant: 'A' },
    };
    render(renderFooter({ message, submit: () => {} }));
    expect(screen.queryByLabelText('Mark this answer as helpful')).to.equal(null);
  });

  it('renders nothing for a non-assistant message', () => {
    const message: ChatMessage = { ...ASSISTANT_MESSAGE, role: 'user' };
    render(renderFooter({ message, submit: () => {} }));
    expect(screen.queryByLabelText('Mark this answer as helpful')).to.equal(null);
  });
});
