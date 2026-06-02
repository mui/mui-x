import * as React from 'react';
import { act, renderHook, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '../adapters';
import { ChatProvider, type ChatProviderProps } from '../ChatProvider';
import { useChatComposer } from './useChatComposer';
import { useChatStore } from './useChatStore';

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

function mockObjectUrlApis() {
  let createCount = 0;
  const createObjectURL = vi.fn((blob: Blob) => {
    createCount += 1;
    return `blob:${(blob as File).name}-${createCount}`;
  });
  const revokeObjectURL = vi.fn();
  const originalCreateDescriptor = Object.getOwnPropertyDescriptor(URL, 'createObjectURL');
  const originalRevokeDescriptor = Object.getOwnPropertyDescriptor(URL, 'revokeObjectURL');

  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: createObjectURL,
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    writable: true,
    value: revokeObjectURL,
  });

  return {
    createObjectURL,
    revokeObjectURL,
    restore() {
      if (originalCreateDescriptor) {
        Object.defineProperty(URL, 'createObjectURL', originalCreateDescriptor);
      } else {
        Reflect.deleteProperty(URL, 'createObjectURL');
      }

      if (originalRevokeDescriptor) {
        Object.defineProperty(URL, 'revokeObjectURL', originalRevokeDescriptor);
      } else {
        Reflect.deleteProperty(URL, 'revokeObjectURL');
      }
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
    expect(result.current.attachments[0].previewUrl).toBeUndefined();

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

  it('creates image preview URLs and revokes them when attachments are removed or cleared', () => {
    const objectUrls = mockObjectUrlApis();

    try {
      const { Wrapper } = createProviderWrapper({
        adapter: createAdapter(),
      });
      const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });
      const imageA = new File(['a'], 'a.png', { type: 'image/png' });
      const imageB = new File(['b'], 'b.jpeg', { type: 'image/jpeg' });

      act(() => {
        result.current.addAttachment(imageA);
        result.current.addAttachment(imageB);
      });

      expect(objectUrls.createObjectURL).toHaveBeenCalledTimes(2);
      expect(result.current.attachments.map((attachment) => attachment.previewUrl)).toEqual([
        'blob:a.png-1',
        'blob:b.jpeg-2',
      ]);

      act(() => {
        result.current.removeAttachment(result.current.attachments[0].localId);
      });

      expect(objectUrls.revokeObjectURL).toHaveBeenCalledWith('blob:a.png-1');

      act(() => {
        result.current.clear();
      });

      expect(objectUrls.revokeObjectURL).toHaveBeenCalledWith('blob:b.jpeg-2');
      expect(result.current.attachments).toEqual([]);
    } finally {
      objectUrls.restore();
    }
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
    const objectUrls = mockObjectUrlApis();
    const adapter = createAdapter({
      sendMessage: vi.fn(async ({ conversationId, message, attachments }) => {
        expect(conversationId).toBe('c1');
        expect(message.parts).toEqual([
          { type: 'text', text: 'Hello there' },
          {
            type: 'file',
            mediaType: 'image/png',
            url: 'blob:hello.png-1',
            filename: 'hello.png',
          },
        ]);
        expect(attachments).toHaveLength(1);
        expect(attachments?.[0].file.name).toBe('hello.png');

        return createStream();
      }),
    });
    try {
      const { Wrapper } = createProviderWrapper({
        adapter,
        initialActiveConversationId: 'c1',
      });
      const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

      act(() => {
        result.current.setValue('Hello there');
        result.current.addAttachment(new File(['hello'], 'hello.png', { type: 'image/png' }));
      });

      await act(async () => {
        await result.current.submit();
      });

      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        // Preview URLs of submitted attachments are NOT revoked — they are
        // now referenced by the stored message parts.
        expect(objectUrls.revokeObjectURL).not.toHaveBeenCalledWith('blob:hello.png-1');
        expect(result.current.value).toBe('');
        expect(result.current.attachments).toEqual([]);
        expect(result.current.isSubmitting).toBe(false);
      });
    } finally {
      objectUrls.restore();
    }
  });

  it('submits when there are only attachments and no text', async () => {
    const objectUrls = mockObjectUrlApis();
    const adapter = createAdapter({
      sendMessage: vi.fn(async ({ message, attachments }) => {
        expect(message.parts).toEqual([
          {
            type: 'file',
            mediaType: 'image/png',
            url: 'blob:photo.png-1',
            filename: 'photo.png',
          },
        ]);
        expect(attachments).toHaveLength(1);

        return createStream();
      }),
    });
    try {
      const { Wrapper } = createProviderWrapper({
        adapter,
        initialActiveConversationId: 'c1',
      });
      const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

      act(() => {
        result.current.addAttachment(new File(['photo'], 'photo.png', { type: 'image/png' }));
      });

      await act(async () => {
        await result.current.submit();
      });

      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(result.current.attachments).toEqual([]);
      });
    } finally {
      objectUrls.restore();
    }
  });

  it('preserves the draft when sendMessage fails', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => {
        throw new Error('Network down');
      }),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      initialActiveConversationId: 'c1',
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

  it('does not submit while IME composition is active', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createStream()),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      initialActiveConversationId: 'c1',
    });
    const { result } = renderHook(
      () => ({
        composer: useChatComposer(),
        store: useChatStore(),
      }),
      { wrapper: Wrapper },
    );

    act(() => {
      result.current.composer.setValue('Hello there');
      result.current.store.setComposerIsComposing(true);
    });

    await act(async () => {
      await result.current.composer.submit();
    });

    expect(adapter.sendMessage).not.toHaveBeenCalled();
    expect(result.current.composer.value).toBe('Hello there');

    act(() => {
      result.current.store.setComposerIsComposing(false);
    });

    await act(async () => {
      await result.current.composer.submit();
    });

    expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
  });

  it('reflects submission progress while the stream is active', async () => {
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createPendingStream()),
      stop: vi.fn(),
    });
    const { Wrapper } = createProviderWrapper({
      adapter,
      initialActiveConversationId: 'c1',
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

  it('clears composer optimistically before send completes', async () => {
    const objectUrls = mockObjectUrlApis();
    const adapter = createAdapter({
      sendMessage: vi.fn(async () => createPendingStream()),
      stop: vi.fn(),
    });
    try {
      const { Wrapper } = createProviderWrapper({
        adapter,
        initialActiveConversationId: 'c1',
      });
      const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

      act(() => {
        result.current.setValue('Hello there');
        result.current.addAttachment(new File(['img'], 'photo.png', { type: 'image/png' }));
      });

      expect(result.current.value).toBe('Hello there');
      expect(result.current.attachments).toHaveLength(1);

      act(() => {
        void result.current.submit();
      });

      // Composer should be cleared immediately, even though the send is still in flight.
      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true);
        expect(result.current.value).toBe('');
        expect(result.current.attachments).toEqual([]);
      });
    } finally {
      objectUrls.restore();
    }
  });

  it('sets mediaType to application/octet-stream for files with empty type', async () => {
    const objectUrls = mockObjectUrlApis();
    const adapter = createAdapter({
      sendMessage: vi.fn(async ({ message }) => {
        const filePart = message.parts.find((part: any) => part.type === 'file');
        expect(filePart).toEqual(
          expect.objectContaining({
            type: 'file',
            mediaType: 'application/octet-stream',
            filename: 'data.bin',
          }),
        );

        return createStream();
      }),
    });
    try {
      const { Wrapper } = createProviderWrapper({
        adapter,
        initialActiveConversationId: 'c1',
      });
      const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

      act(() => {
        // File with empty type
        result.current.addAttachment(new File(['binary'], 'data.bin', { type: '' }));
      });

      await act(async () => {
        await result.current.submit();
      });

      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
    } finally {
      objectUrls.restore();
    }
  });

  it('uses file.type as mediaType for non-image files', async () => {
    const objectUrls = mockObjectUrlApis();
    const adapter = createAdapter({
      sendMessage: vi.fn(async ({ message }) => {
        const filePart = message.parts.find((part: any) => part.type === 'file');
        expect(filePart).toEqual(
          expect.objectContaining({
            type: 'file',
            mediaType: 'application/pdf',
            filename: 'doc.pdf',
          }),
        );

        return createStream();
      }),
    });
    try {
      const { Wrapper } = createProviderWrapper({
        adapter,
        initialActiveConversationId: 'c1',
      });
      const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

      act(() => {
        result.current.addAttachment(
          new File(['pdf-content'], 'doc.pdf', { type: 'application/pdf' }),
        );
      });

      await act(async () => {
        await result.current.submit();
      });

      expect(adapter.sendMessage).toHaveBeenCalledTimes(1);
    } finally {
      objectUrls.restore();
    }
  });

  it('does not create previewUrl for non-image attachments', () => {
    const objectUrls = mockObjectUrlApis();

    try {
      const { Wrapper } = createProviderWrapper({
        adapter: createAdapter(),
      });
      const { result } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

      act(() => {
        result.current.addAttachment(
          new File(['pdf-content'], 'doc.pdf', { type: 'application/pdf' }),
        );
      });

      expect(objectUrls.createObjectURL).not.toHaveBeenCalled();
      expect(result.current.attachments[0].previewUrl).toBeUndefined();
    } finally {
      objectUrls.restore();
    }
  });

  it('keeps the original preview URL when the user types and adds a new attachment mid-flight on a successful send (#7)', async () => {
    const objectUrls = mockObjectUrlApis();
    let resolveSend!: (stream: ReadableStream<any>) => void;
    const sendPromise = new Promise<ReadableStream<any>>((resolve) => {
      resolveSend = resolve;
    });
    const adapter = createAdapter({
      sendMessage: vi.fn(() => sendPromise),
    });
    try {
      const { Wrapper } = createProviderWrapper({
        adapter,
        initialActiveConversationId: 'c1',
      });
      const { result } = renderHook(
        () => ({ composer: useChatComposer(), store: useChatStore() }),
        { wrapper: Wrapper },
      );

      const original = new File(['original'], 'original.png', { type: 'image/png' });

      act(() => {
        result.current.composer.addAttachment(original);
      });

      expect(objectUrls.createObjectURL).toHaveBeenCalledTimes(1);
      expect(result.current.composer.attachments[0].previewUrl).toBe('blob:original.png-1');

      // Submit but don't resolve the send yet — the composer clears
      // optimistically and transfers preview-URL ownership to the message.
      let submitPromise!: Promise<void>;
      act(() => {
        submitPromise = result.current.composer.submit();
      });

      await waitFor(() => {
        expect(result.current.composer.value).toBe('');
        expect(result.current.composer.attachments).toEqual([]);
      });

      // While the send is in flight, the user starts typing again and adds a
      // new attachment. The new attachment must get its OWN preview URL, and
      // the original URL must NOT be revoked — it now belongs to the in-flight
      // user message.
      const second = new File(['second'], 'second.png', { type: 'image/png' });
      act(() => {
        result.current.composer.setValue('typing again');
        result.current.composer.addAttachment(second);
      });

      expect(objectUrls.createObjectURL).toHaveBeenCalledTimes(2);
      expect(result.current.composer.attachments).toHaveLength(1);
      expect(result.current.composer.attachments[0].previewUrl).toBe('blob:second.png-2');
      expect(objectUrls.revokeObjectURL).not.toHaveBeenCalledWith('blob:original.png-1');

      // Resolve sendMessage successfully.
      resolveSend(createStream([{ type: 'finish', messageId: 'assistant-1' }]));

      await act(async () => {
        await submitPromise;
      });

      // After the send completes the composer still holds the user's new draft
      // and the original URL is still NOT revoked — the failed-send restoration
      // path doesn't run on success, and the URL belongs to the sent message.
      expect(result.current.composer.value).toBe('typing again');
      expect(result.current.composer.attachments).toHaveLength(1);
      expect(result.current.composer.attachments[0].previewUrl).toBe('blob:second.png-2');
      expect(objectUrls.revokeObjectURL).not.toHaveBeenCalledWith('blob:original.png-1');

      // Removing the user message from the store releases the transferred URL.
      const userMessage = Object.values(result.current.store.state.messagesById).find(
        (message) => message.role === 'user',
      );
      expect(userMessage).toBeDefined();
      act(() => {
        result.current.store.removeMessage(userMessage!.id);
      });

      await waitFor(() => {
        expect(objectUrls.revokeObjectURL).toHaveBeenCalledWith('blob:original.png-1');
      });
    } finally {
      objectUrls.restore();
    }
  });

  it('does not restore the original draft when the send fails after the user typed mid-flight (#7)', async () => {
    const objectUrls = mockObjectUrlApis();
    let rejectSend!: (reason: Error) => void;
    const sendPromise = new Promise<ReadableStream<any>>((_, reject) => {
      rejectSend = reject;
    });
    const adapter = createAdapter({
      sendMessage: vi.fn(() => sendPromise),
    });
    try {
      const { Wrapper } = createProviderWrapper({
        adapter,
        initialActiveConversationId: 'c1',
      });
      const { result } = renderHook(
        () => ({ composer: useChatComposer(), store: useChatStore() }),
        { wrapper: Wrapper },
      );

      const original = new File(['original'], 'original.png', { type: 'image/png' });
      act(() => {
        result.current.composer.addAttachment(original);
      });

      let submitPromise!: Promise<void>;
      act(() => {
        submitPromise = result.current.composer.submit();
      });

      await waitFor(() => {
        expect(result.current.composer.attachments).toEqual([]);
      });

      // User types something new and adds another attachment before the send
      // fails — the composer is now non-empty.
      const second = new File(['second'], 'second.png', { type: 'image/png' });
      act(() => {
        result.current.composer.setValue('typing again');
        result.current.composer.addAttachment(second);
      });

      // Now the send rejects.
      rejectSend(new Error('Network down'));

      await act(async () => {
        await submitPromise;
      });

      // Restoration is skipped because the composer is no longer empty —
      // we must NOT clobber the user's in-flight typing. The original URL
      // also stays alive (it's still owned by the failed user message until
      // that message is removed from the store).
      expect(result.current.composer.value).toBe('typing again');
      expect(result.current.composer.attachments).toHaveLength(1);
      expect(result.current.composer.attachments[0].file).toBe(second);
      expect(objectUrls.revokeObjectURL).not.toHaveBeenCalledWith('blob:original.png-1');

      // Removing the failed user message releases the original URL.
      const userMessage = Object.values(result.current.store.state.messagesById).find(
        (message) => message.role === 'user',
      );
      expect(userMessage?.status).toBe('error');
      act(() => {
        result.current.store.removeMessage(userMessage!.id);
      });

      await waitFor(() => {
        expect(objectUrls.revokeObjectURL).toHaveBeenCalledWith('blob:original.png-1');
      });
    } finally {
      objectUrls.restore();
    }
  });

  it('revokes owned preview URLs on unmount', () => {
    const objectUrls = mockObjectUrlApis();

    try {
      const { Wrapper } = createProviderWrapper({
        adapter: createAdapter(),
      });
      const { result, unmount } = renderHook(() => useChatComposer(), { wrapper: Wrapper });

      act(() => {
        result.current.addAttachment(new File(['hello'], 'hello.png', { type: 'image/png' }));
      });

      unmount();

      expect(objectUrls.revokeObjectURL).toHaveBeenCalledWith('blob:hello.png-1');
    } finally {
      objectUrls.restore();
    }
  });
});
