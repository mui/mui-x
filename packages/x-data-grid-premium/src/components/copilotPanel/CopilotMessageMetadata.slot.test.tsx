import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import type { ChatMessage } from '@mui/x-chat-headless';
// Internal provider — not part of the public surface, used here only to drive
// the `useMessageContext()` fallback path the way `GridCopilotPanel` does.
import {
  MessageContextProvider,
  // eslint-disable-next-line import/no-relative-packages
} from '../../../../x-chat-headless/src/message/internals/MessageContext';
import type {
  MessageOwnerState,
  // eslint-disable-next-line import/no-relative-packages
} from '../../../../x-chat-headless/src/message/message.types';
import { CopilotMessageMetadata } from './CopilotMessageMetadata';

const ASSISTANT_MESSAGE: ChatMessage = {
  id: 'assistant-1',
  role: 'assistant',
  parts: [],
  metadata: {
    modelId: 'gpt-test',
    costUsd: 0.0123,
    elapsedTime: '1.2s',
  },
};

function makeContextValue(message: ChatMessage | null): MessageOwnerState {
  return {
    messageId: message?.id ?? '',
    message,
    role: message?.role,
    status: message?.status,
    streaming: false,
    error: false,
    isGrouped: false,
    variant: 'default',
    density: 'standard',
    showAvatar: false,
  };
}

describe('<CopilotMessageMetadata /> slot prop shape', () => {
  const { render } = createRenderer();

  let originalSearch: string;

  beforeEach(() => {
    // The metadata table is gated behind the `expose-metadata=1` URL flag.
    originalSearch = window.location.search;
    window.history.replaceState(null, '', `${window.location.pathname}?expose-metadata=1`);
  });

  afterEach(() => {
    window.history.replaceState(null, '', `${window.location.pathname}${originalSearch}`);
  });

  it('renders metadata from the `message` prop (shared-panel slot path)', () => {
    // No surrounding message context: the component must use the prop directly.
    render(<CopilotMessageMetadata message={ASSISTANT_MESSAGE} />);

    expect(screen.getByText('Model')).not.to.equal(null);
    expect(screen.getByText('gpt-test')).not.to.equal(null);
    expect(screen.getByText('Latency')).not.to.equal(null);
    expect(screen.getByText('1.2s')).not.to.equal(null);
  });

  it('falls back to `useMessageContext()` when no `message` prop is passed', () => {
    render(
      <MessageContextProvider value={makeContextValue(ASSISTANT_MESSAGE)}>
        <CopilotMessageMetadata />
      </MessageContextProvider>,
    );

    expect(screen.getByText('Model')).not.to.equal(null);
    expect(screen.getByText('gpt-test')).not.to.equal(null);
  });

  it('renders nothing when neither the prop nor the context provide a message', () => {
    const { container } = render(
      <MessageContextProvider value={makeContextValue(null)}>
        <CopilotMessageMetadata />
      </MessageContextProvider>,
    );

    expect(container.textContent).to.equal('');
  });
});
