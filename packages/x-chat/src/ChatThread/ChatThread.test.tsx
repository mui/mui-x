import * as React from 'react';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-unstyled';
import type {
  MessageListRootProps,
  ThreadActionsProps,
  ThreadHeaderProps,
  ThreadSubtitleProps,
  ThreadTitleProps,
} from '@mui/x-chat-unstyled';
import { ChatThread } from './ChatThread';
import { chatThreadClasses } from './chatThreadClasses';

const { render } = createRenderer();
const isJSDOM = /jsdom/.test(window.navigator.userAgent);

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

function createMessage(id: string, role: ChatMessage['role'], text = id): ChatMessage {
  return {
    id,
    role,
    parts: [{ type: 'text', text }],
  };
}

function renderChatThread(ui: React.ReactElement, options?: { dark?: boolean; rtl?: boolean }) {
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
          adapter={createAdapter()}
          defaultActiveConversationId="c1"
          defaultConversations={[
            {
              id: 'c1',
              subtitle: 'Alpha subtitle',
              title: 'Alpha conversation',
            },
          ]}
          defaultMessages={Array.from({ length: 24 }, (_, index) =>
            createMessage(`m${index + 1}`, index % 2 === 0 ? 'assistant' : 'user'),
          )}
        >
          {ui}
        </ChatRoot>
      </div>
    </ThemeProvider>,
  );
}

const CustomHeader = React.forwardRef(function CustomHeader(
  props: ThreadHeaderProps & { ownerState?: { hasConversation: boolean } },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <header data-has-conversation={String(ownerState?.hasConversation)} data-testid="custom-header" ref={ref} {...other}>
      {children}
    </header>
  );
});

function CustomTitle(props: ThreadTitleProps & { ownerState?: { conversationId?: string } }) {
  const { ownerState, ...other } = props;

  return <div data-testid="custom-title" data-thread-id={ownerState?.conversationId ?? 'none'} {...other} />;
}

function CustomSubtitle(props: ThreadSubtitleProps & { ownerState?: { hasConversation: boolean } }) {
  const { ownerState, ...other } = props;

  return (
    <div data-has-conversation={String(ownerState?.hasConversation)} data-testid="custom-subtitle" {...other} />
  );
}

const CustomActions = React.forwardRef(function CustomActions(
  props: ThreadActionsProps & { ownerState?: { hasConversation: boolean } },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props;

  return (
    <div data-has-conversation={String(ownerState?.hasConversation)} data-testid="custom-actions" ref={ref} {...other}>
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

describe('ChatThread', () => {
  it('renders the default styled thread shell with header content, actions, and message list semantics', () => {
    renderChatThread(
      <ChatThread
        actions={<button type="button">More</button>}
        renderItem={({ id }) => <div data-testid={`row-${id}`}>{id}</div>}
        slotProps={{ messageListScroller: { style: { height: 200 } } }}
        virtualization={false}
      />,
    );

    expect(screen.getByText('Alpha conversation').className).to.contain(chatThreadClasses.title);
    expect(screen.getByText('Alpha subtitle').className).to.contain(chatThreadClasses.subtitle);
    expect(screen.getByRole('button', { name: 'More' })).toBeVisible();
    expect(screen.getByRole('log')).to.have.attribute('aria-live', 'polite');
    expect(screen.getByTestId('row-m1')).toBeVisible();
  });

  it('supports replacing the styled shell slots', () => {
    renderChatThread(
      <ChatThread
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
    expect(screen.getByTestId('custom-subtitle')).to.have.attribute('data-has-conversation', 'true');
    expect(screen.getByTestId('custom-actions')).to.contain.text('Inspect');
    expect(screen.getByTestId('custom-message-list')).to.have.attribute('data-message-count', '24');
  });

  it('renders correctly in dark mode and RTL', () => {
    renderChatThread(
      <ChatThread
        actions={<button type="button">Archive</button>}
        renderItem={({ id }) => <div data-testid={`row-${id}`}>{id}</div>}
        slotProps={{ messageListScroller: { style: { height: 200 } } }}
        virtualization={false}
      />,
      { dark: true, rtl: true },
    );

    expect(screen.getByRole('log')).toBeVisible();
    expect(screen.getByText('Alpha conversation')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Archive' })).toBeVisible();
  });

  it.skipIf(isJSDOM)('uses the virtualized message list path by default', async () => {
    renderChatThread(
      <ChatThread
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
});
