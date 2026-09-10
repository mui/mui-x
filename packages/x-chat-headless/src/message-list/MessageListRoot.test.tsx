import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '../adapters/chatAdapter';
import type { ChatMessage } from '../types/chat-entities';
import { ChatRoot } from '../chat/ChatRoot';
import { MessageListRoot } from './MessageListRoot';
import type { MessageListRootHandle, MessageListRootProps } from './MessageListRoot';
import { useMessageListContext } from './internals/MessageListContext';

const { render } = createRenderer();
const isJSDOM = /jsdom/.test(window.navigator.userAgent);

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

function createMessage(id: string, role: ChatMessage['role'], text = id): ChatMessage {
  return {
    id,
    role,
    parts: [{ type: 'text', text }],
  };
}

function DefaultRenderItem({ id }: { id: string }) {
  return <div data-testid={`message-${id}`}>{id}</div>;
}

const CustomRoot = React.forwardRef(function CustomRoot(
  props: React.PropsWithChildren<MessageListRootProps> & {
    ownerState?: {
      messageCount: number;
      isAtBottom: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    ownerState,
    getItemKey,
    items,
    overlay,
    onReachTop,
    onReachBottom,
    renderItem,
    slotProps,
    slots,
    estimatedItemSize,
    ...other
  } = props;
  void getItemKey;
  void items;
  void overlay;
  void onReachTop;
  void onReachBottom;
  void renderItem;
  void slotProps;
  void slots;
  void estimatedItemSize;

  return (
    <section
      data-bottom={String(ownerState?.isAtBottom)}
      data-message-count={String(ownerState?.messageCount)}
      data-testid="custom-message-list-root"
      ref={ref}
      {...other}
    >
      {children}
    </section>
  );
});

function BottomStateIndicator() {
  const { isAtBottom } = useMessageListContext();

  return <div data-testid="message-list-bottom-state">{String(isAtBottom)}</div>;
}

function UnseenCountIndicator() {
  const { unseenMessageCount } = useMessageListContext();

  return <div data-testid="message-list-unseen-count">{String(unseenMessageCount)}</div>;
}

const RootWithBottomState = React.forwardRef(function RootWithBottomState(
  props: React.PropsWithChildren<MessageListRootProps> & {
    ownerState?: {
      messageCount: number;
      isAtBottom: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    ownerState,
    getItemKey,
    items,
    overlay,
    onReachTop,
    onReachBottom,
    renderItem,
    slotProps,
    slots,
    estimatedItemSize,
    ...other
  } = props;
  void getItemKey;
  void items;
  void overlay;
  void onReachTop;
  void onReachBottom;
  void ownerState;
  void renderItem;
  void slotProps;
  void slots;
  void estimatedItemSize;

  return (
    <div ref={ref} {...other}>
      {children}
      <BottomStateIndicator />
      <UnseenCountIndicator />
    </div>
  );
});

function StreamingMessageList(props: { onReachBottom?: MessageListRootProps['onReachBottom'] }) {
  const { onReachBottom } = props;
  const [growCount, setGrowCount] = React.useState(0);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    createMessage('m1', 'assistant'),
    createMessage('m2', 'assistant'),
    createMessage('m3', 'assistant'),
    createMessage('m4', 'assistant'),
    { ...createMessage('m-streaming', 'assistant'), status: 'streaming' },
  ]);

  return (
    <ChatRoot adapter={createAdapter()} messages={messages}>
      <button
        onClick={() => {
          setGrowCount((previous) => previous + 1);
          // Mutate the streaming message so the prop reference changes (mirrors
          // a real word-by-word stream). Status stays 'streaming' so the
          // resize-driven auto-scroll path is exercised.
          setMessages((previous) =>
            previous.map((message) =>
              message.id === 'm-streaming'
                ? {
                    ...message,
                    parts: [{ type: 'text', text: `grown-${growCount + 1}` }],
                  }
                : message,
            ),
          );
        }}
        type="button"
      >
        grow streaming row
      </button>
      <MessageListRoot
        // Buffer wider than the row growth so `isAtBottomRef.current` remains
        // true after the in-place resize. Otherwise the bottom check itself
        // (not the lifecycle bug we want to cover) would short-circuit the
        // auto-scroll.
        autoScroll={{ buffer: 60 }}
        estimatedItemSize={40}
        onReachBottom={onReachBottom}
        renderItem={({ id }) => (
          <div
            data-testid={`message-${id}`}
            style={{
              boxSizing: 'border-box',
              height: id === 'm-streaming' ? 40 + growCount * 40 : 40,
            }}
          >
            {id}
          </div>
        )}
        style={{ height: 160, overflowY: 'auto' }}
      />
    </ChatRoot>
  );
}

function ControlledMessageList(props: {
  slots?: MessageListRootProps['slots'];
  autoScroll?: MessageListRootProps['autoScroll'];
  onReachBottom?: MessageListRootProps['onReachBottom'];
}) {
  const { slots, autoScroll = { buffer: 10 }, onReachBottom } = props;
  const [messages, setMessages] = React.useState([
    createMessage('m1', 'assistant'),
    createMessage('m2', 'assistant'),
    createMessage('m3', 'assistant'),
    createMessage('m4', 'assistant'),
    createMessage('m5', 'assistant'),
    createMessage('m6', 'assistant'),
  ]);

  return (
    <ChatRoot adapter={createAdapter()} messages={messages}>
      <button
        onClick={() => {
          setMessages((previous) => [
            createMessage('m-1', 'assistant'),
            createMessage('m0', 'assistant'),
            ...previous,
          ]);
        }}
        type="button"
      >
        prepend
      </button>
      <button
        onClick={() => {
          setMessages((previous) => [
            ...previous,
            createMessage(`m${previous.length + 1}`, 'assistant'),
          ]);
        }}
        type="button"
      >
        append assistant
      </button>
      <button
        onClick={() => {
          setMessages((previous) => [
            ...previous,
            createMessage(`m${previous.length + 1}`, 'user'),
          ]);
        }}
        type="button"
      >
        append user
      </button>
      <button
        onClick={() => {
          setMessages((previous) =>
            previous.map((message, index) =>
              index === 0
                ? {
                    ...message,
                    metadata: {
                      expanded: true,
                    },
                  }
                : message,
            ),
          );
        }}
        type="button"
      >
        expand first
      </button>
      <MessageListRoot
        autoScroll={autoScroll}
        estimatedItemSize={40}
        onReachBottom={onReachBottom}
        renderItem={({ id }) => {
          const message = messages.find((item) => item.id === id)!;
          const expanded = Boolean(
            message.metadata && 'expanded' in message.metadata && message.metadata.expanded,
          );

          return (
            <div
              data-testid={`message-${id}`}
              style={{
                boxSizing: 'border-box',
                height: expanded ? 120 : 40,
              }}
            >
              {id}
            </div>
          );
        }}
        slots={slots}
        style={{ height: 160, overflowY: 'auto' }}
      />
    </ChatRoot>
  );
}

const conversationAMessages = [
  createMessage('a1', 'assistant'),
  createMessage('a2', 'assistant'),
  createMessage('a3', 'assistant'),
  createMessage('a4', 'assistant'),
  createMessage('a5', 'assistant'),
  createMessage('a6', 'assistant'),
];

const conversationBMessages = [
  createMessage('b1', 'assistant'),
  createMessage('b2', 'assistant'),
  createMessage('b3', 'assistant'),
  createMessage('b4', 'assistant'),
  createMessage('b5', 'assistant'),
];

function SwitchableConversationList(props: {
  onReachBottom: MessageListRootProps['onReachBottom'];
}) {
  const { onReachBottom } = props;
  const [messages, setMessages] = React.useState(conversationAMessages);

  return (
    <ChatRoot adapter={createAdapter()} messages={messages}>
      <button onClick={() => setMessages(conversationBMessages)} type="button">
        switch conversation
      </button>
      <MessageListRoot
        autoScroll={{ buffer: 10 }}
        estimatedItemSize={40}
        onReachBottom={onReachBottom}
        renderItem={({ id }) => (
          <div data-testid={`message-${id}`} style={{ boxSizing: 'border-box', height: 40 }}>
            {id}
          </div>
        )}
        style={{ height: 160, overflowY: 'auto' }}
      />
    </ChatRoot>
  );
}

describe('MessageListRoot', () => {
  // Base UI's ScrollArea performs internal state updates on mount that trigger
  // React "not wrapped in act()" warnings in JSDOM.
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {
        return;
      }
      // eslint-disable-next-line no-console
      console.info(...args);
    });
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('defaults items from useMessageIds when no items prop is provided', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1', 'assistant'), createMessage('m2', 'user')]}
      >
        <MessageListRoot renderItem={({ id }) => <DefaultRenderItem id={id} />} />
      </ChatRoot>,
    );

    expect(screen.getByRole('log')).to.have.attribute('aria-live', 'polite');
    expect(screen.getByTestId('message-m1')).to.have.text('m1');
    expect(screen.getByTestId('message-m2')).to.have.text('m2');
  });

  it('supports custom item order and passes ownerState to a custom messageList slot', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1', 'assistant'), createMessage('m2', 'user')]}
      >
        <MessageListRoot
          items={['m2', 'm1']}
          renderItem={({ id }) => <DefaultRenderItem id={id} />}
          slots={{ messageList: CustomRoot }}
          style={{ overflowY: 'auto' }}
        />
      </ChatRoot>,
    );

    const customRoot = screen.getByTestId('custom-message-list-root');

    expect(customRoot).to.have.attribute('data-message-count', '2');
    expect(screen.getAllByTestId(/message-m[12]/).map((node) => node.textContent)).to.deep.equal([
      'm2',
      'm1',
    ]);
  });

  it.skipIf(!isJSDOM)('exposes an imperative scrollToBottom handle', () => {
    const handleRef = React.createRef<MessageListRootHandle>();

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[createMessage('m1', 'assistant')]}>
        <MessageListRoot
          ref={handleRef}
          renderItem={({ id }) => <DefaultRenderItem id={id} />}
          style={{ overflowY: 'auto' }}
        />
      </ChatRoot>,
    );

    const log = screen.getByRole('log');
    Object.defineProperty(log, 'clientHeight', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(log, 'scrollHeight', {
      configurable: true,
      value: 640,
    });
    const scrollTo = vi.fn(({ top }: { top: number }) => {
      log.scrollTop = top;
    });
    Object.defineProperty(log, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });
    log.scrollTop = 0;

    handleRef.current!.scrollToBottom();

    expect(scrollTo).toHaveBeenCalledWith({
      behavior: 'auto',
      top: 640,
    });
    expect(log.scrollTop).toBe(640);

    handleRef.current!.scrollToBottom({ behavior: 'smooth' });

    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: 'smooth',
      top: 640,
    });
  });

  it('renders overlay content in the dedicated messageListOverlay slot', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1', 'assistant'), createMessage('m2', 'user')]}
      >
        <MessageListRoot
          overlay={<div data-testid="message-list-overlay">Overlay</div>}
          renderItem={({ id }) => <DefaultRenderItem id={id} />}
        />
      </ChatRoot>,
    );

    expect(screen.getByTestId('message-list-overlay')).to.have.text('Overlay');
  });

  it('fires onReachTop and loads more history when the list reaches the top edge', async () => {
    const onReachTop = vi.fn();
    const adapter = createAdapter({
      listMessages: vi.fn(async ({ cursor }) => {
        if (cursor == null) {
          return {
            messages: [createMessage('m3', 'assistant'), createMessage('m4', 'assistant')],
            cursor: 'cursor-1',
            hasMore: true,
          };
        }

        if (cursor === 'cursor-1') {
          return {
            messages: [createMessage('m2', 'assistant')],
            cursor: 'cursor-2',
            hasMore: true,
          };
        }

        return {
          messages: [createMessage('m1', 'assistant')],
          cursor: undefined,
          hasMore: false,
        };
      }),
    });

    render(
      <ChatRoot adapter={adapter} initialActiveConversationId="c1">
        <MessageListRoot
          onReachTop={onReachTop}
          renderItem={({ id }) => <DefaultRenderItem id={id} />}
          style={{ overflowY: 'auto' }}
        />
      </ChatRoot>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('message-m4')).toBeVisible();
    });

    const log = screen.getByRole('log');
    log.scrollTop = 0;
    fireEvent.scroll(log);

    await waitFor(() => {
      expect(screen.getByTestId('message-m2')).toBeVisible();
    });

    expect(onReachTop).toHaveBeenCalledTimes(1);

    log.scrollTop = 200;
    fireEvent.scroll(log);
    log.scrollTop = 0;
    fireEvent.scroll(log);

    await waitFor(() => {
      expect(screen.getByTestId('message-m1')).toBeVisible();
    });

    expect(onReachTop).toHaveBeenCalledTimes(2);
  });

  it.skipIf(isJSDOM)('preserves the viewport anchor when history is prepended', async () => {
    render(<ControlledMessageList />);
    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    log.scrollTop = 80;
    fireEvent.scroll(log);

    fireEvent.click(screen.getByRole('button', { name: 'prepend' }));

    await waitFor(() => {
      expect(log.scrollTop).toBe(160);
    });
  });

  it.skipIf(isJSDOM)('auto-scrolls on append when already near the bottom', async () => {
    render(<ControlledMessageList />);
    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    log.scrollTop = 75;
    fireEvent.scroll(log);

    fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));

    await waitFor(() => {
      expect(log.scrollTop).toBe(120);
    });
  });

  it.skipIf(isJSDOM)('auto-scrolls on user append even when away from the bottom', async () => {
    render(<ControlledMessageList />);
    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    log.scrollTop = 0;
    fireEvent.scroll(log);

    fireEvent.click(screen.getByRole('button', { name: 'append user' }));

    await waitFor(() => {
      expect(log.scrollTop).toBe(120);
    });
  });

  it.skipIf(isJSDOM)(
    'does not auto-scroll for assistant appends when away from the bottom',
    async () => {
      render(<ControlledMessageList />);
      const log = screen.getByRole('log');

      await waitFor(() => {
        expect(log.scrollHeight).toBeGreaterThan(160);
      });

      log.scrollTop = 0;
      fireEvent.scroll(log);

      fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));

      await waitFor(() => {
        expect(log.scrollTop).toBe(0);
      });
    },
  );

  it.skipIf(isJSDOM)(
    'tracks unseen appended messages while away from the bottom and resets at the bottom',
    async () => {
      render(<ControlledMessageList slots={{ messageList: RootWithBottomState }} />);

      const log = screen.getByRole('log');

      await waitFor(() => {
        expect(log.scrollHeight).toBeGreaterThan(160);
      });

      log.scrollTop = 0;
      fireEvent.scroll(log);

      fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));

      await waitFor(() => {
        expect(screen.getByTestId('message-list-unseen-count')).to.have.text('1');
      });

      log.scrollTop = log.scrollHeight;
      fireEvent.scroll(log);

      await waitFor(() => {
        expect(screen.getByTestId('message-list-unseen-count')).to.have.text('0');
      });
    },
  );

  it.skipIf(isJSDOM)('restores the anchor when a row above the viewport grows', async () => {
    render(<ControlledMessageList />);
    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    log.scrollTop = 80;
    fireEvent.scroll(log);

    fireEvent.click(screen.getByRole('button', { name: 'expand first' }));

    await waitFor(() => {
      expect(log.scrollTop).toBe(160);
    });
  });

  it.skipIf(isJSDOM)('auto-scrolls when a streaming row grows in place', async () => {
    render(<StreamingMessageList />);
    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    log.scrollTop = log.scrollHeight - log.clientHeight;
    fireEvent.scroll(log);

    fireEvent.click(screen.getByRole('button', { name: 'grow streaming row' }));

    await waitFor(() => {
      expect(log.scrollTop).toBe(log.scrollHeight - log.clientHeight);
      expect(log.scrollHeight).toBe(240);
    });
  });

  it.skipIf(isJSDOM)(
    'auto-scrolls when a streaming row grows in place under React.StrictMode',
    async () => {
      // Regression: in StrictMode the initial effect runs mount → cleanup →
      // mount, which previously left `isMountedRef.current` stuck at false
      // because the effect body never restored it. That made
      // `scheduleResizeRestore` bail before calling `scrollToBottom`, so
      // streaming wraps no longer followed the bottom (visible in the Captions
      // demo).
      render(
        <React.StrictMode>
          <StreamingMessageList />
        </React.StrictMode>,
      );
      const log = screen.getByRole('log');

      await waitFor(() => {
        expect(log.scrollHeight).toBeGreaterThan(160);
      });

      log.scrollTop = log.scrollHeight - log.clientHeight;
      fireEvent.scroll(log);

      fireEvent.click(screen.getByRole('button', { name: 'grow streaming row' }));

      await waitFor(() => {
        expect(log.scrollTop).toBe(log.scrollHeight - log.clientHeight);
        expect(log.scrollHeight).toBe(240);
      });
    },
  );

  it.skipIf(isJSDOM)('updates the internal bottom state as the user scrolls', async () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          createMessage('m1', 'assistant'),
          createMessage('m2', 'assistant'),
          createMessage('m3', 'assistant'),
          createMessage('m4', 'assistant'),
          createMessage('m5', 'assistant'),
          createMessage('m6', 'assistant'),
        ]}
      >
        <MessageListRoot
          autoScroll={{ buffer: 10 }}
          estimatedItemSize={40}
          renderItem={({ id }) => (
            <div data-testid={`message-${id}`} style={{ boxSizing: 'border-box', height: 40 }}>
              {id}
            </div>
          )}
          slots={{ messageList: RootWithBottomState }}
          style={{ height: 160, overflowY: 'auto' }}
        />
      </ChatRoot>,
    );

    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    log.scrollTop = log.scrollHeight;
    fireEvent.scroll(log);

    await waitFor(() => {
      expect(screen.getByTestId('message-list-bottom-state')).to.have.text('true');
    });

    log.scrollTop = 0;
    fireEvent.scroll(log);

    await waitFor(() => {
      expect(screen.getByTestId('message-list-bottom-state')).to.have.text('false');
    });
  });

  describe('onReachBottom', () => {
    it.skipIf(isJSDOM)(
      'fires once when entering the bottom zone and again on re-entry',
      async () => {
        const onReachBottom = vi.fn();
        render(<ControlledMessageList onReachBottom={onReachBottom} />);
        const log = screen.getByRole('log');

        await waitFor(() => {
          expect(log.scrollHeight).toBeGreaterThan(160);
        });

        log.scrollTop = 0;
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(0);

        log.scrollTop = log.scrollHeight;
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(1);

        // Additional scrolls inside the zone do not re-fire.
        log.scrollTop = log.scrollHeight - log.clientHeight - 5;
        fireEvent.scroll(log);
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(1);

        // Leaving the zone does not fire; re-entering fires again.
        log.scrollTop = 0;
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(1);

        log.scrollTop = log.scrollHeight;
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(2);
      },
    );

    it.skipIf(isJSDOM)('respects the configured autoScroll buffer threshold', async () => {
      const onReachBottom = vi.fn();
      render(<ControlledMessageList onReachBottom={onReachBottom} />);
      const log = screen.getByRole('log');

      await waitFor(() => {
        expect(log.scrollHeight).toBeGreaterThan(160);
      });

      log.scrollTop = 0;
      fireEvent.scroll(log);

      // ~30px away from the bottom: outside the 10px buffer.
      log.scrollTop = log.scrollHeight - log.clientHeight - 30;
      fireEvent.scroll(log);

      expect(onReachBottom).toHaveBeenCalledTimes(0);

      // 10px away: inside the buffer.
      log.scrollTop = log.scrollHeight - log.clientHeight - 10;
      fireEvent.scroll(log);

      expect(onReachBottom).toHaveBeenCalledTimes(1);
    });

    it.skipIf(isJSDOM)('uses the default 150px auto-scroll buffer as the bottom zone', async () => {
      const onReachBottom = vi.fn();
      render(
        <ChatRoot
          adapter={createAdapter()}
          initialMessages={Array.from({ length: 10 }, (_, index) =>
            createMessage(`m${index + 1}`, 'assistant'),
          )}
        >
          <MessageListRoot
            estimatedItemSize={40}
            onReachBottom={onReachBottom}
            renderItem={({ id }) => (
              <div data-testid={`message-${id}`} style={{ boxSizing: 'border-box', height: 40 }}>
                {id}
              </div>
            )}
            style={{ height: 160, overflowY: 'auto' }}
          />
        </ChatRoot>,
      );
      const log = screen.getByRole('log');

      await waitFor(() => {
        expect(log.scrollHeight).toBeGreaterThan(160);
      });

      log.scrollTop = 0;
      fireEvent.scroll(log);

      // 160px away from the bottom: outside the default 150px buffer.
      log.scrollTop = log.scrollHeight - log.clientHeight - 160;
      fireEvent.scroll(log);

      expect(onReachBottom).toHaveBeenCalledTimes(0);

      // 100px away: inside the default buffer.
      log.scrollTop = log.scrollHeight - log.clientHeight - 100;
      fireEvent.scroll(log);

      expect(onReachBottom).toHaveBeenCalledTimes(1);
    });

    it.skipIf(isJSDOM)(
      'falls back to estimatedItemSize as the bottom zone when autoScroll is disabled',
      async () => {
        const onReachBottom = vi.fn();
        render(<ControlledMessageList autoScroll={false} onReachBottom={onReachBottom} />);
        const log = screen.getByRole('log');

        await waitFor(() => {
          expect(log.scrollHeight).toBeGreaterThan(160);
        });

        log.scrollTop = 0;
        fireEvent.scroll(log);

        // 45px away from the bottom: outside the 40px estimatedItemSize zone.
        log.scrollTop = log.scrollHeight - log.clientHeight - 45;
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(0);

        // 35px away: inside the zone.
        log.scrollTop = log.scrollHeight - log.clientHeight - 35;
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(1);
      },
    );

    it.skipIf(isJSDOM)(
      'does not fire while pinned at the bottom during streaming growth',
      async () => {
        const onReachBottom = vi.fn();
        render(<StreamingMessageList onReachBottom={onReachBottom} />);
        const log = screen.getByRole('log');

        await waitFor(() => {
          expect(log.scrollHeight).toBeGreaterThan(160);
        });

        log.scrollTop = log.scrollHeight - log.clientHeight;
        fireEvent.scroll(log);

        const growButton = screen.getByRole('button', { name: 'grow streaming row' });

        fireEvent.click(growButton);
        await waitFor(() => {
          expect(log.scrollHeight).toBe(240);
          expect(log.scrollTop).toBe(log.scrollHeight - log.clientHeight);
        });

        fireEvent.click(growButton);
        await waitFor(() => {
          expect(log.scrollHeight).toBe(280);
          expect(log.scrollTop).toBe(log.scrollHeight - log.clientHeight);
        });

        fireEvent.click(growButton);
        await waitFor(() => {
          expect(log.scrollHeight).toBe(320);
          expect(log.scrollTop).toBe(log.scrollHeight - log.clientHeight);
        });

        expect(onReachBottom).toHaveBeenCalledTimes(0);
      },
    );

    it.skipIf(isJSDOM)(
      'does not fire when messages are appended while pinned at the bottom',
      async () => {
        const onReachBottom = vi.fn();
        render(<ControlledMessageList onReachBottom={onReachBottom} />);
        const log = screen.getByRole('log');

        await waitFor(() => {
          expect(log.scrollHeight).toBeGreaterThan(160);
        });

        // Enter the bottom zone once (single legitimate fire).
        log.scrollTop = log.scrollHeight;
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(1);

        // Appends while pinned keep the list at the bottom: `true → true`, no fire.
        fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));
        await waitFor(() => {
          expect(log.scrollTop).toBe(120);
        });

        fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));
        await waitFor(() => {
          expect(log.scrollTop).toBe(160);
        });

        expect(onReachBottom).toHaveBeenCalledTimes(1);
      },
    );

    it.skipIf(isJSDOM)('fires on programmatic scrollToBottom from away', async () => {
      const onReachBottom = vi.fn();
      const handleRef = React.createRef<MessageListRootHandle>();
      render(
        <ChatRoot
          adapter={createAdapter()}
          initialMessages={Array.from({ length: 6 }, (_, index) =>
            createMessage(`m${index + 1}`, 'assistant'),
          )}
        >
          <MessageListRoot
            autoScroll={{ buffer: 10 }}
            estimatedItemSize={40}
            onReachBottom={onReachBottom}
            ref={handleRef}
            renderItem={({ id }) => (
              <div data-testid={`message-${id}`} style={{ boxSizing: 'border-box', height: 40 }}>
                {id}
              </div>
            )}
            style={{ height: 160, overflowY: 'auto' }}
          />
        </ChatRoot>,
      );
      const log = screen.getByRole('log');

      await waitFor(() => {
        expect(log.scrollHeight).toBeGreaterThan(160);
      });

      log.scrollTop = 0;
      fireEvent.scroll(log);

      expect(onReachBottom).toHaveBeenCalledTimes(0);

      handleRef.current!.scrollToBottom();

      expect(onReachBottom).toHaveBeenCalledTimes(1);
    });

    it.skipIf(isJSDOM)('fires when a user message forces a scroll from away', async () => {
      const onReachBottom = vi.fn();
      render(<ControlledMessageList onReachBottom={onReachBottom} />);
      const log = screen.getByRole('log');

      await waitFor(() => {
        expect(log.scrollHeight).toBeGreaterThan(160);
      });

      log.scrollTop = 0;
      fireEvent.scroll(log);

      expect(onReachBottom).toHaveBeenCalledTimes(0);

      fireEvent.click(screen.getByRole('button', { name: 'append user' }));

      await waitFor(() => {
        expect(log.scrollTop).toBe(120);
      });

      expect(onReachBottom).toHaveBeenCalledTimes(1);
    });

    it.skipIf(isJSDOM)(
      'does not fire on conversation switch and keeps the latch working afterwards',
      async () => {
        const onReachBottom = vi.fn();
        render(<SwitchableConversationList onReachBottom={onReachBottom} />);
        const log = screen.getByRole('log');

        await waitFor(() => {
          expect(log.scrollHeight).toBe(240);
        });

        // Scroll away from the bottom of conversation A (at-bottom: false).
        log.scrollTop = 45;
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(0);

        // Switching to the shorter conversation B clamps the viewport into the
        // bottom zone (scrollTop 45 → 40, 0px from the bottom). The latch is
        // re-seeded silently — no fire.
        fireEvent.click(screen.getByRole('button', { name: 'switch conversation' }));

        await waitFor(() => {
          expect(screen.getByTestId('message-b5')).toBeVisible();
          expect(log.scrollHeight).toBe(200);
        });

        expect(onReachBottom).toHaveBeenCalledTimes(0);

        // Later real entries into the zone still fire.
        log.scrollTop = 0;
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(0);

        log.scrollTop = log.scrollHeight;
        fireEvent.scroll(log);

        expect(onReachBottom).toHaveBeenCalledTimes(1);
      },
    );

    it('does not fire on mount', () => {
      const onReachBottom = vi.fn();
      render(
        <ChatRoot adapter={createAdapter()} initialMessages={[createMessage('m1', 'assistant')]}>
          <MessageListRoot
            onReachBottom={onReachBottom}
            renderItem={({ id }) => <DefaultRenderItem id={id} />}
            style={{ overflowY: 'auto' }}
          />
        </ChatRoot>,
      );

      expect(onReachBottom).toHaveBeenCalledTimes(0);
    });
  });
});
