import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatRoot, MessageRoot, useChatStore } from '@mui/x-chat-headless';
import { ChatMessage as ChatMessageComponent } from '../ChatMessage/ChatMessage';
import { ChatMessageError } from './ChatMessageError';

const { render } = createRenderer();

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
    ...overrides,
  };
}

const errorMessage: ChatMessage = {
  id: 'm1',
  role: 'user',
  status: 'error',
  parts: [{ type: 'text', text: 'Failed' }],
};

const okMessage: ChatMessage = {
  id: 'm2',
  role: 'user',
  status: 'sent',
  parts: [{ type: 'text', text: 'Fine' }],
};

let storeRef: ReturnType<typeof useChatStore> | null = null;
function StoreCapture() {
  storeRef = useChatStore();
  return null;
}

describe('ChatMessageError', () => {
  it('renders nothing when there is no error for the message', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[okMessage]}>
        <ChatMessageComponent messageId="m2" />
      </ChatRoot>,
    );

    expect(screen.queryByRole('alert')).to.equal(null);
  });

  it('renders the inline error card with a retry button when the error matches the message', () => {
    storeRef = null;
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[errorMessage]}>
        <StoreCapture />
        <ChatMessageComponent messageId="m1" />
      </ChatRoot>,
    );

    expect(storeRef).not.to.equal(null);

    act(() => {
      storeRef!.setMessageError('m1', {
        code: 'SEND_ERROR',
        message: 'Send failed',
        source: 'send',
        recoverable: true,
        retryable: true,
        details: { messageId: 'm1' },
      });
    });

    const alert = screen.getByRole('alert');
    expect(alert.textContent).to.contain('Send failed');
    // Polite (not assertive) so loading a conversation with historical errors
    // does not interrupt the screen reader with every past failure.
    expect(alert.getAttribute('aria-live')).to.equal('polite');
    expect(screen.getByRole('button', { name: 'Retry' })).not.to.equal(null);
  });

  it('preserves a function-form root slotProp instead of dropping it', () => {
    storeRef = null;
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[errorMessage]}>
        <StoreCapture />
        <MessageRoot messageId="m1">
          <ChatMessageError slotProps={{ root: (() => ({ 'data-fn-root': 'applied' })) as any }} />
        </MessageRoot>
      </ChatRoot>,
    );

    act(() => {
      storeRef!.setMessageError('m1', {
        code: 'SEND_ERROR',
        message: 'Send failed',
        source: 'send',
        recoverable: true,
        retryable: true,
        details: { messageId: 'm1' },
      });
    });

    // The `(ownerState) => props` callback form of slotProps.root must be resolved,
    // not spread as an object (which would drop its owner-state-driven props).
    expect(screen.getByRole('alert').getAttribute('data-fn-root')).to.equal('applied');
  });

  it('invokes the runtime retry action when the retry button is clicked', async () => {
    const sendMessage = vi.fn(async () => {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    });
    storeRef = null;
    render(
      <ChatRoot adapter={createAdapter({ sendMessage })} initialMessages={[errorMessage]}>
        <StoreCapture />
        <ChatMessageComponent messageId="m1" />
      </ChatRoot>,
    );

    act(() => {
      storeRef!.setMessageError('m1', {
        code: 'SEND_ERROR',
        message: 'Send failed',
        source: 'send',
        recoverable: true,
        retryable: true,
        details: { messageId: 'm1' },
      });
    });

    const retryButton = screen.getByRole('button', { name: 'Retry' });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledTimes(1);
    });
  });

  it('disables the retry button while another stream is in flight', () => {
    storeRef = null;
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[errorMessage]}>
        <StoreCapture />
        <ChatMessageComponent messageId="m1" />
      </ChatRoot>,
    );

    act(() => {
      storeRef!.setMessageError('m1', {
        code: 'SEND_ERROR',
        message: 'Send failed',
        source: 'send',
        recoverable: true,
        retryable: true,
        details: { messageId: 'm1' },
      });
      storeRef!.setStreaming(true);
    });

    const retryButton = screen.getByRole('button', { name: 'Retry' });
    expect(retryButton).to.have.property('disabled', true);
  });

  it('forwards consumer-supplied classes to the message and retryButton slots', () => {
    storeRef = null;
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[errorMessage]}>
        <StoreCapture />
        <MessageRoot messageId="m1">
          <ChatMessageError
            classes={{
              root: 'custom-root',
              message: 'custom-message',
              retryButton: 'custom-retry',
            }}
          />
        </MessageRoot>
      </ChatRoot>,
    );

    act(() => {
      storeRef!.setMessageError('m1', {
        code: 'SEND_ERROR',
        message: 'Send failed',
        source: 'send',
        recoverable: true,
        retryable: true,
        details: { messageId: 'm1' },
      });
    });

    const alert = screen.getByRole('alert');
    expect(alert.classList.contains('custom-root')).to.equal(true);
    const messageSpan = alert.querySelector('.custom-message');
    expect(messageSpan).not.to.equal(null);
    const retryButton = screen.getByRole('button', { name: 'Retry' });
    expect(retryButton.classList.contains('custom-retry')).to.equal(true);
  });
});
