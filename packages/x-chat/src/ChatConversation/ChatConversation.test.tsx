import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage,
  ChatRealtimeEvent,
} from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-unstyled';
import type {
  MessageListRootProps,
  ConversationHeaderActionsProps,
  ConversationHeaderProps,
  ConversationSubtitleProps,
  ConversationTitleProps,
} from '@mui/x-chat-unstyled';
import { ChatConversation as ChatConversationComponent } from './ChatConversation';
import { chatConversationClasses } from './chatConversationClasses';

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

function renderChatConversation(
  ui: React.ReactElement,
  options?: {
    adapter?: ChatAdapter;
    conversations?: ChatConversation[];
    dark?: boolean;
    messages?: ChatMessage[];
    rtl?: boolean;
  },
) {
  const theme = createTheme({
    direction: options?.rtl ? 'rtl' : 'ltr',
    palette: {
      mode: options?.dark ? 'dark' : 'light',
      Chat: {
        composerBorder: '#d0d7de',
      },
    },
  });

  return render(
    <ThemeProvider theme={theme}>
      <div dir={theme.direction}>
        <ChatRoot
          adapter={options?.adapter ?? createAdapter()}
          defaultActiveConversationId="c1"
          defaultConversations={
            options?.conversations ?? [
              {
                id: 'c1',
                subtitle: 'Alpha subtitle',
                title: 'Alpha conversation',
              },
            ]
          }
          defaultMessages={
            options?.messages ??
            Array.from({ length: 24 }, (_, index) =>
              createMessage(`m${index + 1}`, index % 2 === 0 ? 'assistant' : 'user'),
            )
          }
        >
          {ui}
        </ChatRoot>
      </div>
    </ThemeProvider>,
  );
}

const CustomHeader = React.forwardRef(function CustomHeader(
  props: ConversationHeaderProps & { ownerState?: { hasConversation: boolean } },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <header
      data-has-conversation={String(ownerState?.hasConversation)}
      data-testid="custom-header"
      ref={ref}
      {...other}
    >
      {children}
    </header>
  );
});

function CustomTitle(props: ConversationTitleProps & { ownerState?: { conversationId?: string } }) {
  const { ownerState, ...other } = props;

  return (
    <div
      data-testid="custom-title"
      data-thread-id={ownerState?.conversationId ?? 'none'}
      {...other}
    />
  );
}

function CustomSubtitle(
  props: ConversationSubtitleProps & { ownerState?: { hasConversation: boolean } },
) {
  const { ownerState, ...other } = props;

  return (
    <div
      data-has-conversation={String(ownerState?.hasConversation)}
      data-testid="custom-subtitle"
      {...other}
    />
  );
}

const CustomActions = React.forwardRef(function CustomActions(
  props: ConversationHeaderActionsProps & { ownerState?: { hasConversation: boolean } },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <div
      data-has-conversation={String(ownerState?.hasConversation)}
      data-testid="custom-actions"
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

const CustomMessageList = React.forwardRef(function CustomMessageList(
  props: React.PropsWithChildren<MessageListRootProps> & {
    ownerState?: {
      messageCount: number;
      virtualization: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    estimatedItemSize,
    getItemKey,
    items,
    overlay,
    onReachTop,
    overscan,
    ownerState,
    renderItem,
    slotProps,
    slots,
    virtualization,
    ...other
  } = props;
  void estimatedItemSize;
  void getItemKey;
  void items;
  void overlay;
  void onReachTop;
  void overscan;
  void renderItem;
  void slotProps;
  void slots;
  void virtualization;

  return (
    <div
      data-message-count={String(ownerState?.messageCount)}
      data-testid="custom-message-list"
      data-virtualization={String(ownerState?.virtualization)}
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

function ControlledChatConversation() {
  const [messages, setMessages] = React.useState(
    Array.from({ length: 6 }, (_, index) =>
      createMessage(`m${index + 1}`, index % 2 === 0 ? 'assistant' : 'user'),
    ),
  );

  return (
    <ChatRoot
      adapter={createAdapter()}
      defaultActiveConversationId="c1"
      defaultConversations={[
        {
          id: 'c1',
          subtitle: 'Alpha subtitle',
          title: 'Alpha conversation',
        },
      ]}
      messages={messages}
    >
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
      <ChatConversationComponent
        slotProps={{ messageListScroller: { style: { height: 160 } } }}
        virtualization={false}
      />
    </ChatRoot>
  );
}

describe('ChatConversation', () => {
  it('renders the default styled timeline with grouped rows, date dividers, and built-in actions', async () => {
    let onEvent: ((event: ChatRealtimeEvent) => void) | undefined;
    const sendMessage = vi.fn(
      async () =>
        new ReadableStream({
          start(controller) {
            controller.close();
          },
        }),
    );
    const adapter: ChatAdapter = {
      sendMessage,
      subscribe({ onEvent: nextOnEvent }) {
        onEvent = nextOnEvent;
        return () => {};
      },
    };

    renderChatConversation(
      <ChatConversationComponent
        actions={<button type="button">More</button>}
        slotProps={{ messageListScroller: { style: { height: 200 } } }}
        virtualization={false}
      />,
      {
        adapter,
        conversations: [
          {
            id: 'c1',
            subtitle: 'Alpha subtitle',
            title: 'Alpha conversation',
            unreadCount: 1,
            participants: [{ id: 'assistant-1', displayName: 'Assistant' }],
          },
        ],
        messages: [
          {
            author: { id: 'assistant-1', displayName: 'Assistant' },
            createdAt: '2026-03-15T09:00:00.000Z',
            id: 'm1',
            parts: [{ type: 'text', text: 'First assistant message' }],
            role: 'assistant',
            status: 'streaming',
          },
          {
            author: { id: 'assistant-1', displayName: 'Assistant' },
            createdAt: '2026-03-15T09:03:00.000Z',
            id: 'm2',
            parts: [{ type: 'text', text: 'Grouped follow-up' }],
            role: 'assistant',
          },
          {
            author: { id: 'user-1', displayName: 'Reporter' },
            createdAt: '2026-03-16T08:00:00.000Z',
            id: 'm3',
            parts: [{ type: 'text', text: 'User error' }],
            role: 'user',
            status: 'error',
          },
        ],
      },
    );

    expect(screen.getByText('Alpha conversation').className).to.contain(
      chatConversationClasses.title,
    );
    expect(screen.getByText('Alpha subtitle').className).to.contain(
      chatConversationClasses.subtitle,
    );
    expect(screen.getByRole('button', { name: 'More' })).toBeVisible();
    expect(screen.getByRole('log')).to.have.attribute('aria-live', 'polite');
    expect(screen.getByText('First assistant message')).toBeVisible();
    expect(screen.getByText('Grouped follow-up')).toBeVisible();
    expect(screen.getByText('New messages')).toBeVisible();
    expect(screen.getByText('March 16, 2026')).toBeVisible();
    expect(screen.getByText('Streaming')).toBeVisible();
    expect(screen.getByText('AS')).toBeVisible();
    expect(screen.getByText('RE')).toBeVisible();
    expect(screen.getAllByRole('button', { name: 'Copy' })).to.have.length(3);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() => {
      expect(sendMessage).toHaveBeenCalledTimes(1);
    });

    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'assistant-1', isTyping: true });
    });

    await waitFor(() => {
      expect(screen.getByText('Assistant is typing')).toBeVisible();
    });
  });

  it('supports replacing the styled shell slots', () => {
    renderChatConversation(
      <ChatConversationComponent
        actions={<button type="button">Inspect</button>}
        renderItem={({ id }) => <div data-testid={`row-${id}`}>{id}</div>}
        slots={{
          actions: CustomActions,
          header: CustomHeader,
          messageList: CustomMessageList,
          subtitle: CustomSubtitle,
          title: CustomTitle,
        }}
        slotProps={{ messageListScroller: { style: { height: 200 } } }}
        virtualization={false}
      />,
    );

    expect(screen.getByTestId('custom-header')).to.have.attribute('data-has-conversation', 'true');
    expect(screen.getByTestId('custom-title')).to.have.attribute('data-thread-id', 'c1');
    expect(screen.getByTestId('custom-subtitle')).to.have.attribute(
      'data-has-conversation',
      'true',
    );
    expect(screen.getByTestId('custom-actions')).to.contain.text('Inspect');
    expect(screen.getByTestId('custom-message-list')).to.have.attribute('data-message-count', '24');
  });

  it('renders correctly in dark mode and RTL', () => {
    renderChatConversation(
      <ChatConversationComponent
        actions={<button type="button">Archive</button>}
        slotProps={{ messageListScroller: { style: { height: 200 } } }}
        virtualization={false}
      />,
      { dark: true, rtl: true },
    );

    expect(screen.getByRole('log')).toBeVisible();
    expect(screen.getByText('Alpha conversation')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Archive' })).toBeVisible();
  });

  it('shows the default scroll-to-bottom affordance in the overlay when the conversation is away from bottom', async () => {
    render(
      <ThemeProvider
        theme={createTheme({
          palette: {
            Chat: {
              composerBorder: '#d0d7de',
            },
          },
        })}
      >
        <ControlledChatConversation />
      </ThemeProvider>,
    );

    const log = screen.getByRole('log');
    Object.defineProperty(log, 'clientHeight', {
      configurable: true,
      value: 160,
    });
    Object.defineProperty(log, 'scrollHeight', {
      configurable: true,
      value: 320,
    });
    const scrollTo = vi.fn(({ top }: { top: number }) => {
      log.scrollTop = top;
    });
    Object.defineProperty(log, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });

    log.scrollTop = 0;
    fireEvent.scroll(log);

    fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Scroll to bottom, 1 new messages' }),
      ).toBeVisible();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Scroll to bottom, 1 new messages' }));

    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: 'smooth',
      top: 320,
    });
  });

  it.skipIf(isJSDOM)('uses the virtualized message list path by default', async () => {
    renderChatConversation(
      <ChatConversationComponent
        renderItem={({ id }) => (
          <div data-testid={`row-${id}`} style={{ boxSizing: 'border-box', height: 40 }}>
            {id}
          </div>
        )}
        slots={{ messageList: CustomMessageList }}
        slotProps={{ messageListScroller: { style: { height: 160 } } }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom-message-list')).to.have.attribute(
        'data-virtualization',
        'true',
      );
    });

    await waitFor(() => {
      expect(screen.getAllByTestId(/row-m/).length).toBeLessThan(24);
    });
  });

  it('fully replaces the default timeline when renderItem is provided', () => {
    renderChatConversation(
      <ChatConversationComponent
        renderItem={({ id }) => <div data-testid={`custom-row-${id}`}>{id}</div>}
        slotProps={{ messageListScroller: { style: { height: 200 } } }}
        virtualization={false}
      />,
      {
        messages: [
          createMessage('m1', 'assistant', 'Custom assistant'),
          createMessage('m2', 'user', 'Custom user'),
        ],
      },
    );

    expect(screen.getByTestId('custom-row-m1')).toBeVisible();
    expect(screen.queryByText('Copy')).toBeNull();
    expect(screen.queryByRole('separator')).toBeNull();
  });
});
