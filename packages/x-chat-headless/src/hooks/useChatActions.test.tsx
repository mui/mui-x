import * as React from 'react';
import { act, renderHook } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '../adapters';
import { ChatProvider, type ChatProviderProps } from '../ChatProvider';
import { useChat } from './useChat';
import { useChatActions } from './useChatActions';

function createStream(values: any[] = []): ReadableStream<any> {
  return new ReadableStream({
    start(controller) {
      values.forEach((value) => controller.enqueue(value));
      controller.close();
    },
  });
}

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return createStream();
    },
    ...overrides,
  };
}

function createProviderWrapper(initialProps: Omit<ChatProviderProps, 'children'>) {
  function Wrapper({ children }: React.PropsWithChildren) {
    return <ChatProvider {...initialProps}>{children}</ChatProvider>;
  }
  return Wrapper;
}

describe('useChatActions', () => {
  it('returns the same actions object as the runtime context exposed through useChat', () => {
    const Wrapper = createProviderWrapper({ adapter: createAdapter() });
    const { result } = renderHook(
      () => ({ actions: useChatActions(), chat: useChat() }),
      { wrapper: Wrapper },
    );

    expect(result.current.actions.regenerate).toBe(result.current.chat.regenerate);
    expect(result.current.actions.retry).toBe(result.current.chat.retry);
    expect(result.current.actions.sendMessage).toBe(result.current.chat.sendMessage);
  });

  it('keeps a stable actions reference across message updates (subscription-free)', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () =>
        createStream([
          { type: 'start', messageId: 'a1' },
          { type: 'text-delta', id: 't1', delta: 'Hi' },
          { type: 'finish', messageId: 'a1', finishReason: 'stop' },
        ]),
      ),
    });
    const Wrapper = createProviderWrapper({ adapter });

    const { result } = renderHook(() => useChatActions(), { wrapper: Wrapper });
    const actionsBefore = result.current;

    await act(async () => {
      await result.current.sendMessage({
        conversationId: 'c1',
        parts: [{ type: 'text', text: 'Hello' }],
      });
    });

    // The message round-trip updated the store, but `useChatActions` reads only
    // the runtime context (stable) — so the actions object is reference-equal
    // before and after, i.e. message-state changes never re-derive it.
    expect(result.current).toBe(actionsBefore);
  });

  it('returns null outside a ChatProvider when called with optional: true', () => {
    const { result } = renderHook(() => useChatActions(true));

    expect(result.current).toBeNull();
  });

  it('throws outside a ChatProvider when called without the optional flag', () => {
    expect(() =>
      renderHook(() => useChatActions(), {
        // No wrapper — no provider.
      }),
    ).toThrow(/ChatProvider/);
  });
});
