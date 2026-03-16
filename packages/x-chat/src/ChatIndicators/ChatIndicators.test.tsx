import * as React from 'react';
import {
  act,
  createRenderer,
  fireEvent,
  screen,
  waitFor,
} from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter, ChatMessage, ChatRealtimeEvent } from '@mui/x-chat-headless';
import { ChatRoot, MessageListRoot } from '@mui/x-chat-unstyled';
import {
  ChatScrollToBottomAffordance,
  ChatTypingIndicator,
  ChatUnreadMarker,
} from './index';
import { chatScrollToBottomAffordanceClasses } from './chatScrollToBottomAffordanceClasses';
import { chatTypingIndicatorClasses } from './chatTypingIndicatorClasses';
import { chatUnreadMarkerClasses } from './chatUnreadMarkerClasses';

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

function createMessage(id: string, role: ChatMessage['role'], text = id): ChatMessage {
  return {
    id,
    role,
    parts: [{ type: 'text', text }],
  };
}

function renderInTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider
      theme={createTheme({
        palette: {
          Chat: {
            composerBorder: '#d0d7de',
          },
        },
      })}
    >
      {ui}
    </ThemeProvider>,
  );
}

function ControlledMessageListWithStyledAffordance() {
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
          setMessages((previous) => [...previous, createMessage(`m${previous.length + 1}`, 'assistant')]);
        }}
        type="button"
      >
        append assistant
      </button>
      <MessageListRoot
        estimatedItemSize={40}
        overlay={<ChatScrollToBottomAffordance />}
        renderItem={({ id }) => (
          <div data-testid={`message-${id}`} style={{ boxSizing: 'border-box', height: 40 }}>
            {id}
          </div>
        )}
        style={{ height: 160 }}
        virtualization={false}
      />
    </ChatRoot>
  );
}

describe('ChatIndicators', () => {
  it('styles the typing indicator root and keeps the polite live region behavior', async () => {
    let onEvent: ((event: ChatRealtimeEvent) => void) | undefined;
    const adapter = createAdapter({
      subscribe({ onEvent: nextOnEvent }) {
        onEvent = nextOnEvent;
        return () => {};
      },
    });

    renderInTheme(
      <ChatRoot
        adapter={adapter}
        defaultActiveConversationId="c1"
        defaultConversations={[{ id: 'c1', participants: [{ id: 'u1', displayName: 'Alice' }] }]}
      >
        <ChatTypingIndicator />
      </ChatRoot>,
    );

    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: true });
    });

    await waitFor(() => {
      expect(screen.getByText('Alice is typing')).toBeVisible();
    });

    const root = screen.getByText('Alice is typing');
    expect(root.className).to.contain(chatTypingIndicatorClasses.root);
    expect(root).to.have.attribute('aria-live', 'polite');
  });

  it('styles the unread marker and supports replacing the label slot', () => {
    function CustomLabel(
      props: React.ComponentProps<'span'> & { ownerState?: unknown },
    ) {
      const { ownerState, ...other } = props;
      void ownerState;

      return <span data-testid="custom-unread-label" {...other} />;
    }

    renderInTheme(
      <ChatRoot
        adapter={createAdapter()}
        defaultActiveConversationId="c1"
        defaultConversations={[{ id: 'c1', unreadCount: 1 }]}
        defaultMessages={[createMessage('m1', 'assistant'), createMessage('m2', 'assistant')]}
      >
        <ChatUnreadMarker
          messageId="m2"
          slots={{ label: CustomLabel }}
        />
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-unread-label')).to.have.text('New messages');
    expect(screen.getByRole('separator').className).to.contain(chatUnreadMarkerClasses.root);
  });

  it('uses smooth scrolling for the styled scroll-to-bottom affordance and shows the unseen count', async () => {
    renderInTheme(<ControlledMessageListWithStyledAffordance />);

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

    act(() => {
      log.scrollTop = 0;
      fireEvent.scroll(log);
    });

    fireEvent.click(screen.getByRole('button', { name: 'append assistant' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Scroll to bottom, 1 new messages' })).toBeVisible();
    });

    const affordance = screen.getByRole('button', { name: 'Scroll to bottom, 1 new messages' });
    expect(affordance.className).to.contain(chatScrollToBottomAffordanceClasses.root);
    expect(screen.getByText('1').className).to.contain(chatScrollToBottomAffordanceClasses.badge);

    fireEvent.click(affordance);

    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: 'smooth',
      top: 320,
    });
  });

  it('renders correctly in dark mode and RTL', async () => {
    let onEvent: ((event: ChatRealtimeEvent) => void) | undefined;
    const adapter = createAdapter({
      subscribe({ onEvent: nextOnEvent }) {
        onEvent = nextOnEvent;
        return () => {};
      },
    });

    render(
      <ThemeProvider
        theme={createTheme({
          direction: 'rtl',
          palette: {
            Chat: {
              composerBorder: '#4b5563',
            },
            mode: 'dark',
          },
        })}
      >
        <div dir="rtl">
          <ChatRoot
            adapter={adapter}
            defaultActiveConversationId="c1"
            defaultConversations={[{ id: 'c1', participants: [{ id: 'u1', displayName: 'Alice' }] }]}
            defaultMessages={[createMessage('m1', 'assistant')]}
          >
            <ChatTypingIndicator />
            <MessageListRoot
              overlay={<ChatScrollToBottomAffordance />}
              renderItem={({ id }) => <div>{id}</div>}
              style={{ height: 160 }}
              virtualization={false}
            />
          </ChatRoot>
        </div>
      </ThemeProvider>,
    );

    act(() => {
      onEvent?.({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: true });
    });

    await waitFor(() => {
      expect(screen.getByText('Alice is typing')).toBeVisible();
    });
  });
});
