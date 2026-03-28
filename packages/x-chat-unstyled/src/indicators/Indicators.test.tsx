import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter, ChatMessage, ChatRealtimeEvent } from '@mui/x-chat-headless';
import { ChatRoot } from '../chat/ChatRoot';
import { MessageListRoot, type MessageListRootProps } from '../message-list/MessageListRoot';
import { MessageListContextProvider } from '../message-list/internals/MessageListContext';
import { ScrollToBottomAffordance, TypingIndicator, UnreadMarker } from './index';

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

const TypingRoot = React.forwardRef(function TypingRoot(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: {
      users: Array<{ id: string }>;
      count: number;
      label: string;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <div
      data-count={String(ownerState?.count)}
      data-testid="typing-indicator-root"
      data-users={ownerState?.users.map((user) => user.id).join(',') ?? ''}
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

const UnreadRoot = React.forwardRef(function UnreadRoot(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> & {
    ownerState?: {
      messageId: string;
      hasBoundary: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <div
      data-boundary={String(ownerState?.hasBoundary)}
      data-testid={`unread-${ownerState?.messageId}`}
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

const LabelRoot = React.forwardRef(function LabelRoot(
  props: React.PropsWithChildren<React.HTMLAttributes<HTMLSpanElement>> & {
    ownerState?: {
      messageId: string;
    };
  },
  ref: React.Ref<HTMLSpanElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <span data-testid={`unread-label-${ownerState?.messageId}`} ref={ref} {...other}>
      {children}
    </span>
  );
});

const RootWithAffordance = React.forwardRef(function RootWithAffordance(
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
    renderItem,
    slotProps,
    slots,
    estimatedItemSize,
    ...other
  } = props;
  void estimatedItemSize;
  void getItemKey;
  void items;
  void overlay;
  void onReachTop;
  void ownerState;
  void renderItem;
  void slotProps;
  void slots;

  return (
    <div ref={ref} {...other}>
      {children}
      <ScrollToBottomAffordance />
    </div>
  );
});

function ControlledMessageListWithAffordance() {
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
            ...previous,
            createMessage(`m${previous.length + 1}`, 'assistant'),
          ]);
        }}
        type="button"
      >
        append assistant
      </button>
      <MessageListRoot
        estimatedItemSize={40}
        renderItem={({ id }) => (
          <div data-testid={`message-${id}`} style={{ boxSizing: 'border-box', height: 40 }}>
            {id}
          </div>
        )}
        slots={{ messageList: RootWithAffordance }}
        style={{ height: 160, overflowY: 'auto' }}
      />
    </ChatRoot>
  );
}

describe('Indicators', () => {
  it('TypingIndicator shows and hides based on typing events and resolves users', async () => {
    let onEvent: ((event: ChatRealtimeEvent) => void) | undefined;
    const adapter = createAdapter({
      subscribe({ onEvent: nextOnEvent }) {
        onEvent = nextOnEvent;
        return () => {};
      },
    });

    render(
      <ChatRoot
        adapter={adapter}
        initialActiveConversationId="c1"
        initialConversations={[
          {
            id: 'c1',
            participants: [{ id: 'u1', displayName: 'Alice' }],
          },
        ]}
        initialMessages={[
          {
            ...createMessage('m1', 'assistant'),
            author: { id: 'u2', displayName: 'Bob' },
          },
        ]}
      >
        <TypingIndicator slots={{ root: TypingRoot }} />
      </ChatRoot>,
    );

    expect(screen.queryByTestId('typing-indicator-root')).toBeNull();

    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: true });
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u2', isTyping: true });
    });

    await waitFor(() => {
      expect(screen.getByTestId('typing-indicator-root')).to.have.text('Alice, Bob are typing');
    });

    expect(screen.getByTestId('typing-indicator-root')).to.have.attribute('data-users', 'u1,u2');

    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: false });
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u2', isTyping: false });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('typing-indicator-root')).toBeNull();
    });
  });

  it('TypingIndicator synthesizes unresolved typing users', async () => {
    let onEvent: ((event: ChatRealtimeEvent) => void) | undefined;
    const adapter = createAdapter({
      subscribe({ onEvent: nextOnEvent }) {
        onEvent = nextOnEvent;
        return () => {};
      },
    });

    render(
      <ChatRoot
        adapter={adapter}
        initialActiveConversationId="c1"
        initialConversations={[{ id: 'c1' }]}
      >
        <TypingIndicator slots={{ root: TypingRoot }} />
      </ChatRoot>,
    );

    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u3', isTyping: true });
    });

    await waitFor(() => {
      expect(screen.getByTestId('typing-indicator-root')).to.have.text('u3 is typing');
    });

    expect(screen.getByTestId('typing-indicator-root')).to.have.attribute('data-users', 'u3');
  });

  it('TypingIndicator uses a polite live region by default', async () => {
    let onEvent: ((event: ChatRealtimeEvent) => void) | undefined;
    const adapter = createAdapter({
      subscribe({ onEvent: nextOnEvent }) {
        onEvent = nextOnEvent;
        return () => {};
      },
    });

    render(
      <ChatRoot
        adapter={adapter}
        initialActiveConversationId="c1"
        initialConversations={[
          {
            id: 'c1',
            participants: [{ id: 'u1', displayName: 'Alice' }],
          },
        ]}
      >
        <TypingIndicator />
      </ChatRoot>,
    );

    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: true });
    });

    await waitFor(() => {
      expect(screen.getByText('Alice is typing')).to.have.attribute('aria-live', 'polite');
    });
  });

  it('uses localeText for typing, unread, and scroll affordance labels', async () => {
    let onEvent: ((event: ChatRealtimeEvent) => void) | undefined;
    const adapter = createAdapter({
      subscribe({ onEvent: nextOnEvent }) {
        onEvent = nextOnEvent;
        return () => {};
      },
    });

    render(
      <ChatRoot
        adapter={adapter}
        initialActiveConversationId="c1"
        initialConversations={[
          {
            id: 'c1',
            participants: [{ id: 'u1', displayName: 'Alice' }],
            unreadCount: 1,
          },
        ]}
        initialMessages={[createMessage('m1', 'assistant')]}
        localeText={{
          typingIndicatorLabel: (users) =>
            `${users.map((user) => user.displayName ?? user.id).join(', ')} schreibt`,
          unreadMarkerLabel: 'Neue Nachrichten',
          scrollToBottomLabel: 'Nach unten',
          scrollToBottomWithCountLabel: (count) => `Nach unten, ${count} neu`,
        }}
      >
        <TypingIndicator />
        <UnreadMarker messageId="m1" />
      </ChatRoot>,
    );

    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: true });
    });

    await waitFor(() => {
      expect(screen.getByText('Alice schreibt')).to.have.attribute('aria-live', 'polite');
    });

    expect(screen.getByText('Neue Nachrichten')).not.to.equal(null);

    const scrollToBottom = vi.fn();
    const { rerender } = render(
      <MessageListContextProvider
        value={{ isAtBottom: false, scrollToBottom, unseenMessageCount: 2 }}
      >
        <ChatRoot
          adapter={createAdapter()}
          localeText={{
            scrollToBottomLabel: 'Nach unten',
            scrollToBottomWithCountLabel: (count) => `Nach unten, ${count} neu`,
          }}
        >
          <ScrollToBottomAffordance />
        </ChatRoot>
      </MessageListContextProvider>,
    );

    expect(screen.getByRole('button', { name: 'Nach unten, 2 neu' })).to.have.text(
      'Nach unten2',
    );

    rerender(
      <MessageListContextProvider
        value={{ isAtBottom: false, scrollToBottom, unseenMessageCount: 0 }}
      >
        <ChatRoot
          adapter={createAdapter()}
          localeText={{
            scrollToBottomLabel: 'Nach unten',
            scrollToBottomWithCountLabel: (count) => `Nach unten, ${count} neu`,
          }}
        >
          <ScrollToBottomAffordance />
        </ChatRoot>
      </MessageListContextProvider>,
    );

    expect(screen.getByRole('button', { name: 'Nach unten' })).to.have.text(
      'Nach unten',
    );
  });

  it('UnreadMarker renders at the unread boundary derived from unreadCount', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialActiveConversationId="c1"
        initialConversations={[{ id: 'c1', unreadCount: 2 }]}
        initialMessages={[
          createMessage('m1', 'assistant'),
          createMessage('m2', 'assistant'),
          createMessage('m3', 'assistant'),
        ]}
      >
        {['m1', 'm2', 'm3'].map((id, index, items) => (
          <UnreadMarker
            index={index}
            items={items}
            key={id}
            messageId={id}
            slots={{ root: UnreadRoot, label: LabelRoot }}
          />
        ))}
      </ChatRoot>,
    );

    expect(screen.queryByTestId('unread-m1')).toBeNull();
    expect(screen.getByTestId('unread-m2')).to.have.attribute('role', 'separator');
    expect(screen.getByTestId('unread-label-m2')).to.have.text('New messages');
    expect(screen.queryByTestId('unread-m3')).toBeNull();
  });

  it('UnreadMarker renders before the first message for whole-thread unread conversations', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialActiveConversationId="c1"
        initialConversations={[{ id: 'c1', readState: 'unread' }]}
        initialMessages={[createMessage('m1', 'assistant'), createMessage('m2', 'assistant')]}
      >
        {['m1', 'm2'].map((id, index, items) => (
          <UnreadMarker
            index={index}
            items={items}
            key={id}
            label="Unread"
            messageId={id}
            slots={{ root: UnreadRoot, label: LabelRoot }}
          />
        ))}
      </ChatRoot>,
    );

    expect(screen.getByTestId('unread-m1')).to.have.attribute('role', 'separator');
    expect(screen.getByTestId('unread-label-m1')).to.have.text('Unread');
    expect(screen.queryByTestId('unread-m2')).toBeNull();
  });

  it('ScrollToBottomAffordance hides at the bottom and uses unseen count in its label', () => {
    const scrollToBottom = vi.fn();
    const { rerender } = render(
      <MessageListContextProvider
        value={{ isAtBottom: true, scrollToBottom, unseenMessageCount: 0 }}
      >
        <ScrollToBottomAffordance />
      </MessageListContextProvider>,
    );

    expect(screen.queryByRole('button', { name: 'Scroll to bottom' })).toBeNull();

    rerender(
      <MessageListContextProvider
        value={{ isAtBottom: false, scrollToBottom, unseenMessageCount: 3 }}
      >
        <ScrollToBottomAffordance />
      </MessageListContextProvider>,
    );

    const button = screen.getByRole('button', { name: 'Scroll to bottom, 3 new messages' });
    expect(button).to.have.text('Scroll to bottom3');

    fireEvent.click(button);

    expect(scrollToBottom).toHaveBeenCalledTimes(1);
  });

  it.skipIf(isJSDOM)(
    'ScrollToBottomAffordance follows message-list scroll state and unseen count',
    async () => {
      render(<ControlledMessageListWithAffordance />);

      const log = screen.getByRole('log');

      await waitFor(() => {
        expect(log.scrollHeight).toBeGreaterThan(160);
      });

      log.scrollTop = 0;
      fireEvent.scroll(log);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Scroll to bottom' })).toBeVisible();
      });

      fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Scroll to bottom, 1 new messages' }),
        ).toBeVisible();
      });

      fireEvent.click(screen.getByRole('button', { name: 'Scroll to bottom, 1 new messages' }));

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Scroll to bottom/ })).toBeNull();
      });
    },
  );
});
