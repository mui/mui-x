import * as React from 'react';
import { act, renderHook, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '../adapters';
import { ChatProvider, type ChatProviderProps } from '../ChatProvider';
import { useChatComposer } from './useChatComposer';

function createStream(values: any[] = []): ReadableStream<any> {
  return new ReadableStream({
    start(controller) {
      values.forEach((value) => controller.enqueue(value));
      controller.close();
    },
  });
}

function createPendingStream() {
  return new ReadableStream({
    start() {},
    cancel() {},
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
  let currentProps = initialProps;

  function Wrapper({ children }: React.PropsWithChildren) {
    return <ChatProvider {...currentProps}>{children}</ChatProvider>;
  }

  return {
    Wrapper,
    setProps(nextProps: Omit<ChatProviderProps, 'children'>) {
      currentProps = nextProps;
    },
  };
}

describe('useChatComposer', () => {
  it('updates draft value and attachments and can clear them', () => {
    const { Wrapper } = createProviderWrapper({
      adapter: createAdapter(),
    });
    const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });
    const attachmentFile = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    act(() => {
      result.current.setValue('Draft message');
      result.current.addAttachment(attachmentFile);
    });

    expect(result.current.value).toBe('Draft message');
    expect(result.current.attachments).toHaveLength(1);
    expect(result.current.attachments[0].file).toBe(attachmentFile);
    expect(result.current.attachments[0].status).toBe('queued');

    act(() => {
      result.current.removeAttachment(result.current.attachments[0].localId);
    });

    expect(result.current.attachments).toEqual([]);

    act(() => {
      result.current.addAttachment(attachmentFile);
      result.current.clear();
    });

    expect(result.current.value).toBe('');
    expect(result.current.attachments).toEqual([]);
  });

  it('drives controlled composer values through onComposerValueChange', () => {
    const onComposerValueChange = vi.fn();
    const { Wrapper, setProps } = createProviderWrapper({
      adapter: createAdapter(),
      composerValue: 'Draft one',
      onComposerValueChange,
    });
    const { result, rerender } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

    expect(result.current.value).toBe('Draft one');

    act(() => {
      result.current.setValue('Draft two');
    });

    expect(onComposerValueChange).toHaveBeenCalledWith('Draft two');

    setProps({
      adapter: createAdapter(),
      composerValue: 'Draft two',
      onComposerValueChange,
    });
    rerender();

    expect(result.current.value).toBe('Draft two');
  });

  it('submits the composer draft through the runtime and clears it on success', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async ({ conversationId, message, attachments }) => {
        expect(conversationId).toBe('c1');
        expect(message.parts).toEqual([{ type: 'text', text: 'Hello there' }]);
        expect(attachments).toHaveLength(1);
        expect(attachments?.[0].file.name).toBe('hello.txt');

        return createStream();
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      defaultActiveConversationId: 'c1',
    });
    const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

    act(() => {
      result.current.setValue('Hello there');
      result.current.addAttachment(new File(['hello'], 'hello.txt', { type: 'text/plain' }));
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
    expect(result.current.value).toBe('');
    expect(result.current.attachments).toEqual([]);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('preserves the draft when sendMessage fails', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => {
        throw new Error('Network down');
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      defaultActiveConversationId: 'c1',
    });
    const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });
    const attachmentFile = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    act(() => {
      result.current.setValue('Hello there');
      result.current.addAttachment(attachmentFile);
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.value).toBe('Hello there');
    expect(result.current.attachments).toHaveLength(1);
    expect(result.current.attachments[0].file).toBe(attachmentFile);
  });

  it('does not submit empty drafts', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createStream()),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
    });
    const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

    act(() => {
      result.current.setValue('   ');
    });

    await act(async () => {
      await result.current.submit();
    });

    expect(adapter.sendMessage).not.toHaveBeenCalled();
  });

  it('reflects submission progress while the stream is active', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createPendingStream()),
      stop: vi.fn(),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      defaultActiveConversationId: 'c1',
    });
    const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

    act(() => {
      result.current.setValue('Hello there');
      void result.current.submit();
    });

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(true);
    });
  });
});
