import * as React from 'react';
import { act, renderHook } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '../adapters';
import type { ChatMessage } from '../types/chat-entities';
import { ChatProvider } from '../ChatProvider';
import { useChatStore } from './useChatStore';
import { useMessageError } from './useMessageError';

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

const errorMessage: ChatMessage = {
  id: 'm-err',
  role: 'assistant',
  status: 'error',
  parts: [{ type: 'text', text: 'broken' }],
};

const okMessage: ChatMessage = {
  id: 'm-ok',
  role: 'assistant',
  status: 'sent',
  parts: [{ type: 'text', text: 'ok' }],
};

function wrapper({ children }: React.PropsWithChildren) {
  return (
    <ChatProvider adapter={createAdapter()} initialMessages={[errorMessage, okMessage]}>
      {children}
    </ChatProvider>
  );
}

describe('useMessageError', () => {
  it('returns null when no error is set', () => {
    const { result } = renderHook(() => useMessageError('m-err'), { wrapper });

    expect(result.current).to.equal(null);
  });

  it('returns the error for the matching message id', () => {
    const { result } = renderHook(
      () => ({
        err: useMessageError('m-err'),
        store: useChatStore(),
      }),
      { wrapper },
    );

    act(() => {
      result.current.store.setError({
        code: 'SEND_ERROR',
        message: 'Send failed',
        source: 'send',
        recoverable: true,
        retryable: true,
        details: { messageId: 'm-err' },
      });
    });

    expect(result.current.err?.message).to.equal('Send failed');
    expect(result.current.err?.retryable).to.equal(true);
  });

  it('returns null when the error messageId does not match', () => {
    const { result } = renderHook(
      () => ({
        err: useMessageError('m-err'),
        store: useChatStore(),
      }),
      { wrapper },
    );

    act(() => {
      result.current.store.setError({
        code: 'SEND_ERROR',
        message: 'Send failed for another message',
        source: 'send',
        recoverable: true,
        details: { messageId: 'some-other' },
      });
    });

    expect(result.current.err).to.equal(null);
  });

  it('returns null when the message does not have status `error`', () => {
    const { result } = renderHook(
      () => ({
        err: useMessageError('m-ok'),
        store: useChatStore(),
      }),
      { wrapper },
    );

    act(() => {
      result.current.store.setError({
        code: 'SEND_ERROR',
        message: 'Send failed',
        source: 'send',
        recoverable: true,
        details: { messageId: 'm-ok' },
      });
    });

    expect(result.current.err).to.equal(null);
  });
});
