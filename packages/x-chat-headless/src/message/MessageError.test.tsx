import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '../adapters/chatAdapter';
import type { ChatMessage } from '../types/chat-entities';
import { ChatRoot } from '../chat/ChatRoot';
import { useChatStore } from '../hooks/useChatStore';
import { MessageRoot } from './MessageRoot';
import { MessageError } from './MessageError';

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
  parts: [{ type: 'text', text: 'broken' }],
};

let storeRef: ReturnType<typeof useChatStore> | null = null;
function StoreCapture() {
  storeRef = useChatStore();
  return null;
}

describe('MessageError', () => {
  it('returns null when there is no error for the message', () => {
    const rootSlotProps = vi.fn(() => {
      throw new Error('slotProps.root should not be evaluated without a message error');
    });

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[errorMessage]}>
        <MessageRoot messageId="m1">
          <MessageError data-testid="error" slotProps={{ root: rootSlotProps }} />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(rootSlotProps).not.toHaveBeenCalled();
    expect(screen.queryByTestId('error')).to.equal(null);
  });

  it('renders with role="alert" when the error matches the message id', () => {
    storeRef = null;
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[errorMessage]}>
        <StoreCapture />
        <MessageRoot messageId="m1">
          <MessageError data-testid="error" />
        </MessageRoot>
      </ChatRoot>,
    );

    act(() => {
      storeRef!.setMessageError('m1', {
        code: 'SEND_ERROR',
        message: 'Network down',
        source: 'send',
        recoverable: true,
        retryable: true,
        details: { messageId: 'm1' },
      });
    });

    const alert = screen.getByTestId('error');
    expect(alert).to.have.attribute('role', 'alert');
    expect(alert.textContent).to.equal('Network down');
  });

  it('returns null when the error does not match the message id', () => {
    storeRef = null;
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[errorMessage]}>
        <StoreCapture />
        <MessageRoot messageId="m1">
          <MessageError data-testid="error" />
        </MessageRoot>
      </ChatRoot>,
    );

    act(() => {
      storeRef!.setMessageError('other', {
        code: 'SEND_ERROR',
        message: 'Network down',
        source: 'send',
        recoverable: true,
        details: { messageId: 'other' },
      });
    });

    expect(screen.queryByTestId('error')).to.equal(null);
  });

  it('calls retry(messageId) when its ownerState.retry is invoked', async () => {
    storeRef = null;
    const sendMessage = vi.fn(async () => {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    });

    const CustomRoot = React.forwardRef<HTMLDivElement, any>(function CustomRoot(props, ref) {
      const { ownerState, children, ...other } = props;
      return (
        <div
          data-testid="custom-error-root"
          ref={ref}
          {...other}
          // Render a retry button that calls the bound retry() from ownerState
        >
          {children}
          <button
            type="button"
            onClick={() => {
              void ownerState.retry();
            }}
          >
            Retry
          </button>
        </div>
      );
    });

    render(
      <ChatRoot adapter={createAdapter({ sendMessage })} initialMessages={[errorMessage]}>
        <StoreCapture />
        <MessageRoot messageId="m1">
          <MessageError slots={{ root: CustomRoot }} />
        </MessageRoot>
      </ChatRoot>,
    );

    act(() => {
      storeRef!.setMessageError('m1', {
        code: 'SEND_ERROR',
        message: 'Network down',
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
});
