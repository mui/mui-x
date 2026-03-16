import * as React from 'react';
import {
  act,
  createRenderer,
  fireEvent,
  screen,
  waitFor,
} from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatRoot } from '../chat/ChatRoot';
import { MessageListRoot, type MessageListRootHandle, type MessageListRootProps } from './MessageListRoot';
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
      virtualization: boolean;
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
    onReachTop,
    overscan,
    renderItem,
    slotProps,
    slots,
    virtualization,
    estimatedItemSize,
    ...other
  } = props;
  void getItemKey;
  void items;
  void onReachTop;
  void overscan;
  void renderItem;
  void slotProps;
  void slots;
  void virtualization;
  void estimatedItemSize;

  return (
    <section
      data-bottom={String(ownerState?.isAtBottom)}
      data-message-count={String(ownerState?.messageCount)}
      data-testid="custom-message-list-root"
      data-virtualization={String(ownerState?.virtualization)}
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
      virtualization: boolean;
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
    onReachTop,
    overscan,
    renderItem,
    slotProps,
    slots,
    virtualization,
    estimatedItemSize,
    ...other
  } = props;
  void getItemKey;
  void items;
  void onReachTop;
  void overscan;
  void ownerState;
  void renderItem;
  void slotProps;
  void slots;
  void virtualization;
  void estimatedItemSize;

  return (
    <div ref={ref} {...other}>
      {children}
      <BottomStateIndicator />
      <UnseenCountIndicator />
    </div>
  );
});

function ControlledMessageList(props: {
  virtualization?: boolean;
  slots?: MessageListRootProps['slots'];
}) {
  const { virtualization = false, slots } = props;
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
          setMessages((previous) => [...previous, createMessage(`m${previous.length + 1}`, 'assistant')]);
        }}
        type="button"
      >
        append assistant
      </button>
      <button
        onClick={() => {
          setMessages((previous) => [...previous, createMessage(`m${previous.length + 1}`, 'user')]);
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
        estimatedItemSize={40}
        renderItem={({ id }) => {
          const message = messages.find((item) => item.id === id)!;
          const expanded = Boolean(message.metadata && 'expanded' in message.metadata && message.metadata.expanded);

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
        virtualization={virtualization}
      />
    </ChatRoot>
  );
}

describe('MessageListRoot', () => {
  it('defaults items from useMessageIds when no items prop is provided', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        defaultMessages={[createMessage('m1', 'assistant'), createMessage('m2', 'user')]}
      >
        <MessageListRoot
          renderItem={({ id }) => <DefaultRenderItem id={id} />}
          virtualization={false}
        />
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
        defaultMessages={[createMessage('m1', 'assistant'), createMessage('m2', 'user')]}
      >
        <MessageListRoot
          items={['m2', 'm1']}
          renderItem={({ id }) => <DefaultRenderItem id={id} />}
          slots={{ messageList: CustomRoot }}
          style={{ overflowY: 'auto' }}
          virtualization={false}
        />
      </ChatRoot>,
    );

    const customRoot = screen.getByTestId('custom-message-list-root');

    expect(customRoot).to.have.attribute('data-message-count', '2');
    expect(customRoot).to.have.attribute('data-virtualization', 'false');
    expect(screen.getAllByTestId(/message-m[12]/).map((node) => node.textContent)).to.deep.equal([
      'm2',
      'm1',
    ]);
  });

  it.skipIf(!isJSDOM)('exposes an imperative scrollToBottom handle', () => {
    const handleRef = React.createRef<MessageListRootHandle>();

    render(
      <ChatRoot adapter={createAdapter()} defaultMessages={[createMessage('m1', 'assistant')]}>
        <MessageListRoot
          ref={handleRef}
          renderItem={({ id }) => <DefaultRenderItem id={id} />}
          style={{ overflowY: 'auto' }}
          virtualization={false}
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
    log.scrollTop = 0;

    act(() => {
      handleRef.current!.scrollToBottom();
    });

    expect(log.scrollTop).toBe(640);
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
      <ChatRoot adapter={adapter} defaultActiveConversationId="c1">
        <MessageListRoot
          onReachTop={onReachTop}
          renderItem={({ id }) => <DefaultRenderItem id={id} />}
          style={{ overflowY: 'auto' }}
          virtualization={false}
        />
      </ChatRoot>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('message-m4')).toBeVisible();
    });

    const log = screen.getByRole('log');
    await act(async () => {
      log.scrollTop = 0;
      fireEvent.scroll(log);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId('message-m2')).toBeVisible();
    });

    expect(onReachTop).toHaveBeenCalledTimes(1);

    act(() => {
      log.scrollTop = 200;
      fireEvent.scroll(log);
    });
    await act(async () => {
      log.scrollTop = 0;
      fireEvent.scroll(log);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId('message-m1')).toBeVisible();
    });

    expect(onReachTop).toHaveBeenCalledTimes(2);
  });

  it.skipIf(isJSDOM)('windows rows when virtualization is enabled', async () => {
    const messages = Array.from({ length: 50 }, (_, index) =>
      createMessage(`m${index + 1}`, 'assistant'),
    );

    render(
      <ChatRoot adapter={createAdapter()} defaultMessages={messages}>
        <MessageListRoot
          estimatedItemSize={40}
          renderItem={({ id }) => (
            <div data-testid={`message-${id}`} style={{ height: 40 }}>
              {id}
            </div>
          )}
          style={{ height: 160, overflowY: 'auto' }}
        />
      </ChatRoot>,
    );

    await waitFor(() => {
      expect(screen.getAllByTestId(/message-m\d+/).length).toBeLessThan(50);
    });
  });

  it.skipIf(isJSDOM)('preserves the viewport anchor when history is prepended', async () => {
    render(<ControlledMessageList virtualization={false} />);

    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    act(() => {
      log.scrollTop = 80;
      fireEvent.scroll(log);
    });

    fireEvent.click(screen.getByRole('button', { name: 'prepend' }));

    await waitFor(() => {
      expect(log.scrollTop).toBe(160);
    });
  });

  it.skipIf(isJSDOM)('auto-scrolls on append when already near the bottom', async () => {
    render(<ControlledMessageList virtualization={false} />);

    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    act(() => {
      log.scrollTop = 75;
      fireEvent.scroll(log);
    });

    fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));

    await waitFor(() => {
      expect(log.scrollTop).toBe(120);
    });
  });

  it.skipIf(isJSDOM)('auto-scrolls on user append even when away from the bottom', async () => {
    render(<ControlledMessageList virtualization={false} />);

    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    act(() => {
      log.scrollTop = 0;
      fireEvent.scroll(log);
    });

    fireEvent.click(screen.getByRole('button', { name: 'append user' }));

    await waitFor(() => {
      expect(log.scrollTop).toBe(120);
    });
  });

  it.skipIf(isJSDOM)('does not auto-scroll for assistant appends when away from the bottom', async () => {
    render(<ControlledMessageList virtualization={false} />);

    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    act(() => {
      log.scrollTop = 0;
      fireEvent.scroll(log);
    });

    fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));

    await waitFor(() => {
      expect(log.scrollTop).toBe(0);
    });
  });

  it.skipIf(isJSDOM)('tracks unseen appended messages while away from the bottom and resets at the bottom', async () => {
    render(<ControlledMessageList slots={{ messageList: RootWithBottomState }} virtualization={false} />);

    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    act(() => {
      log.scrollTop = 0;
      fireEvent.scroll(log);
    });

    fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));

    await waitFor(() => {
      expect(screen.getByTestId('message-list-unseen-count')).to.have.text('1');
    });

    act(() => {
      log.scrollTop = log.scrollHeight;
      fireEvent.scroll(log);
    });

    await waitFor(() => {
      expect(screen.getByTestId('message-list-unseen-count')).to.have.text('0');
    });
  });

  it.skipIf(isJSDOM)('restores the anchor when a row above the viewport grows', async () => {
    render(<ControlledMessageList virtualization={false} />);

    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    act(() => {
      log.scrollTop = 80;
      fireEvent.scroll(log);
    });

    fireEvent.click(screen.getByRole('button', { name: 'expand first' }));

    await waitFor(() => {
      expect(log.scrollTop).toBe(160);
    });
  });

  it.skipIf(isJSDOM)('updates the internal bottom state as the user scrolls', async () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        defaultMessages={[
          createMessage('m1', 'assistant'),
          createMessage('m2', 'assistant'),
          createMessage('m3', 'assistant'),
          createMessage('m4', 'assistant'),
          createMessage('m5', 'assistant'),
          createMessage('m6', 'assistant'),
        ]}
      >
        <MessageListRoot
          estimatedItemSize={40}
          renderItem={({ id }) => (
            <div data-testid={`message-${id}`} style={{ boxSizing: 'border-box', height: 40 }}>
              {id}
            </div>
          )}
          slots={{ messageList: RootWithBottomState }}
          style={{ height: 160, overflowY: 'auto' }}
          virtualization={false}
        />
      </ChatRoot>,
    );

    const log = screen.getByRole('log');

    await waitFor(() => {
      expect(log.scrollHeight).toBeGreaterThan(160);
    });

    act(() => {
      log.scrollTop = log.scrollHeight;
      fireEvent.scroll(log);
    });

    await waitFor(() => {
      expect(screen.getByTestId('message-list-bottom-state')).to.have.text('true');
    });

    act(() => {
      log.scrollTop = 0;
      fireEvent.scroll(log);
    });

    await waitFor(() => {
      expect(screen.getByTestId('message-list-bottom-state')).to.have.text('false');
    });
  });
});
