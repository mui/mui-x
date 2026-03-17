import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { ChatAdapter, ChatConversation } from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-unstyled';
import type {
  ConversationListItemProps,
  ConversationListPreviewProps,
  ConversationListTimestampProps,
  ConversationListTitleProps,
  ConversationListUnreadBadgeProps,
} from '@mui/x-chat-unstyled';
import { ChatConversations } from './ChatConversations';
import { chatConversationsClasses } from './chatConversationsClasses';

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

function renderChatConversations(
  ui: React.ReactElement,
  options?: {
    adapter?: ChatAdapter;
    defaultConversations?: ChatConversation[];
  },
) {
  const theme = createTheme({
    palette: {
      Chat: {
        conversationHoverBg: '#eef3ff',
        conversationSelectedBg: '#dbe7ff',
        conversationSelectedColor: '#123456',
      },
    },
  });

  return render(
    <ThemeProvider theme={theme}>
      <ChatRoot
        adapter={options?.adapter ?? createAdapter()}
        defaultActiveConversationId="c2"
        defaultConversations={
          options?.defaultConversations ?? [
            {
              id: 'c1',
              subtitle: 'First preview',
              title: 'First conversation',
            },
            {
              id: 'c2',
              lastMessageAt: '2026-03-15T12:34:00.000Z',
              subtitle: 'Second preview',
              title: 'Second conversation',
              unreadCount: 120,
            },
          ]
        }
      >
        {ui}
      </ChatRoot>
    </ThemeProvider>,
  );
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, reject, resolve };
}

const CustomItem = React.forwardRef(function CustomItem(
  props: ConversationListItemProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, conversation, focused, ownerState, selected, unread, ...other } =
    props as ConversationListItemProps & {
      ownerState?: unknown;
    };

  void focused;
  void ownerState;
  void selected;
  void unread;

  return (
    <div data-testid={`custom-item-${conversation.id}`} ref={ref} {...other}>
      {children}
    </div>
  );
});

function CustomTitle(props: ConversationListTitleProps) {
  const { conversation, focused, ownerState, selected, unread, ...other } =
    props as ConversationListTitleProps & {
      ownerState?: unknown;
    };

  void focused;
  void ownerState;
  void selected;
  void unread;

  return (
    <div data-testid={`custom-title-${conversation.id}`} {...other}>
      title:{conversation.title}
    </div>
  );
}

function CustomPreview(props: ConversationListPreviewProps) {
  const { conversation, focused, ownerState, selected, unread, ...other } =
    props as ConversationListPreviewProps & {
      ownerState?: unknown;
    };

  void focused;
  void ownerState;
  void selected;
  void unread;

  return (
    <div data-testid={`custom-preview-${conversation.id}`} {...other}>
      preview:{conversation.subtitle}
    </div>
  );
}

function CustomTimestamp(props: ConversationListTimestampProps) {
  const { conversation, focused, ownerState, selected, unread, ...other } =
    props as ConversationListTimestampProps & {
      ownerState?: unknown;
    };

  void focused;
  void ownerState;
  void selected;
  void unread;

  return (
    <div data-testid={`custom-timestamp-${conversation.id}`} {...other}>
      timestamp:{conversation.lastMessageAt}
    </div>
  );
}

function CustomUnreadBadge(props: ConversationListUnreadBadgeProps) {
  const { conversation, focused, ownerState, selected, unread, ...other } =
    props as ConversationListUnreadBadgeProps & {
      ownerState?: unknown;
    };

  void focused;
  void ownerState;
  void selected;
  void unread;

  return (
    <div data-testid={`custom-unread-${conversation.id}`} {...other}>
      unread:{conversation.unreadCount ?? 0}
    </div>
  );
}

describe('ChatConversations', () => {
  it('renders the conversation list with Material defaults and selected styling', () => {
    renderChatConversations(<ChatConversations />);

    const options = screen.getAllByRole('option');

    expect(options).to.have.length(2);
    expect(options[0]).to.contain.text('First conversation');
    expect(options[1]).to.contain.text('Second conversation');
    expect(options[1]).to.contain.text('Second preview');
    expect(options[1]).to.contain.text('12:34');
    expect(options[1]).to.contain.text('99+');
    expect(options[1]).to.have.attribute('aria-selected', 'true');
    expect(options[1].className).to.contain(chatConversationsClasses.item);
  });

  it('uses avatar initials fallbacks and dense sizing', () => {
    renderChatConversations(<ChatConversations dense />);

    expect(screen.getByText('FC')).not.to.equal(null);
    expect(screen.getByText('SC')).not.to.equal(null);
  });

  it('supports replacing the styled slots', () => {
    renderChatConversations(
      <ChatConversations
        slots={{
          item: CustomItem,
          preview: CustomPreview,
          timestamp: CustomTimestamp,
          title: CustomTitle,
          unreadBadge: CustomUnreadBadge,
        }}
      />,
    );

    expect(screen.getByTestId('custom-item-c2')).not.to.equal(null);
    expect(screen.getByTestId('custom-title-c2')).to.contain.text('title:Second conversation');
    expect(screen.getByTestId('custom-preview-c2')).to.contain.text('preview:Second preview');
    expect(screen.getByTestId('custom-timestamp-c2')).to.contain.text(
      'timestamp:2026-03-15T12:34:00.000Z',
    );
    expect(screen.getByTestId('custom-unread-c2')).to.contain.text('unread:120');
  });

  it('hides empty unread badges and keeps RTL and dark mode rendering stable', () => {
    const theme = createTheme({
      palette: {
        mode: 'dark',
      },
      direction: 'rtl',
    });

    render(
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <ChatRoot
            adapter={createAdapter()}
            defaultConversations={[{ id: 'c1', title: 'Conversation only' }]}
          >
            <ChatConversations />
          </ChatRoot>
        </div>
      </ThemeProvider>,
    );

    expect(screen.getByRole('listbox')).toBeVisible();
    expect(screen.queryByText('99+')).toBeNull();
    expect(screen.getByRole('option', { name: /conversation only/i })).toBeVisible();
  });

  it('renders a loading state with skeleton rows while conversations are loading', () => {
    const deferred = createDeferred<{ conversations: any[] }>();

    renderChatConversations(<ChatConversations />, {
      adapter: createAdapter({
        listConversations: vi.fn(async () => deferred.promise),
      }),
      defaultConversations: [],
    });

    expect(screen.getByText('Loading...')).toBeVisible();
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
  });

  it('renders the empty state and optional empty action when no conversations exist', () => {
    renderChatConversations(
      <ChatConversations emptyAction={<button type="button">Create conversation</button>} />,
      {
        defaultConversations: [],
      },
    );

    expect(screen.getByText('No conversations')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Create conversation' })).toBeVisible();
  });

  it('renders an error state and retries loading conversations', async () => {
    let shouldFail = true;
    const listConversations = vi
      .fn<NonNullable<ChatAdapter['listConversations']>>()
      .mockImplementation(async () => {
        if (shouldFail) {
          throw new Error('Failed to load conversations');
        }

        return {
          conversations: [{ id: 'c1', title: 'Recovered conversation' }],
        };
      });

    renderChatConversations(<ChatConversations />, {
      adapter: createAdapter({
        listConversations,
      }),
      defaultConversations: [],
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to load conversations')).toBeVisible();
    });

    shouldFail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /recovered conversation/i })).toBeVisible();
    });

    expect(listConversations.mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
