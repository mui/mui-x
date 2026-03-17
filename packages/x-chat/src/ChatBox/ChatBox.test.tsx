import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatBox } from './ChatBox';

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

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return { promise, reject, resolve };
}

function renderChatBox(
  ui: React.ReactElement,
  _options?: {
    adapter?: ChatAdapter;
    defaultMessages?: ChatMessage[];
  },
) {
  const theme = createTheme({
    palette: {
      Chat: {
        composerBorder: '#d0d7de',
        composerFocusRing: '#1976d2',
        conversationHoverBg: '#eef3ff',
        conversationSelectedBg: '#dbe7ff',
        conversationSelectedColor: '#123456',
      },
    },
  });

  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('ChatBox', () => {
  it('renders the default one-liner composition', () => {
    renderChatBox(
      <ChatBox
        adapter={createAdapter()}
        defaultActiveConversationId="c1"
        defaultConversations={[{ id: 'c1', title: 'General' }]}
        defaultMessages={[
          {
            id: 'm1',
            role: 'assistant',
            parts: [{ type: 'text', text: 'Hello there' }],
          },
        ]}
      />,
    );

    expect(screen.getByRole('option', { name: /general/i })).toBeVisible();
    expect(screen.getByRole('log')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeVisible();
  });

  it('falls back to a thread-only layout when no conversations source exists', () => {
    renderChatBox(
      <ChatBox
        adapter={createAdapter()}
        defaultMessages={[
          {
            id: 'm1',
            role: 'assistant',
            parts: [{ type: 'text', text: 'Thread only' }],
          },
        ]}
      />,
    );

    expect(screen.queryByRole('option')).to.equal(null);
    expect(screen.getByRole('log')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeVisible();
  });

  it('forwards mirrored nested slots through the one-liner API', () => {
    const ConversationTitleSlot = React.forwardRef<HTMLDivElement, any>(
      function ConversationTitleSlot(props, ref) {
        const { conversation, dense, focused, ownerState, selected, unread, ...other } = props;

        void conversation;
        void dense;
        void focused;
        void ownerState;
        void selected;
        void unread;

        return (
          <div data-testid="conversation-title-slot" ref={ref} {...other}>
            {typeof conversation === 'object' && conversation && 'title' in conversation
              ? ((conversation as { id: string; title?: string }).title ??
                (conversation as { id: string; title?: string }).id)
              : null}
          </div>
        );
      },
    );

    const MessageContentSlot = React.forwardRef<HTMLDivElement, any>(
      function MessageContentSlot(props, ref) {
        const { ownerState, ...other } = props;

        void ownerState;

        return <div data-testid="message-content-slot" ref={ref} {...other} />;
      },
    );

    const ComposerInputSlot = React.forwardRef<HTMLTextAreaElement, any>(
      function ComposerInputSlot(props, ref) {
        const { ownerState, ...other } = props;

        void ownerState;

        return <textarea data-testid="composer-input-slot" ref={ref} {...other} />;
      },
    );

    renderChatBox(
      <ChatBox
        adapter={createAdapter()}
        defaultActiveConversationId="c1"
        defaultConversations={[{ id: 'c1', title: 'General' }]}
        defaultMessages={[
          {
            id: 'm1',
            role: 'assistant',
            parts: [{ type: 'text', text: 'Hello there' }],
          },
        ]}
        slots={{
          composerInput: ComposerInputSlot,
          conversationTitle: ConversationTitleSlot,
          messageContent: MessageContentSlot,
        }}
      />,
    );

    expect(screen.getByTestId('conversation-title-slot').textContent).to.contain('General');
    expect(screen.getByTestId('message-content-slot').textContent).to.contain('Hello there');
    expect(screen.getByTestId('composer-input-slot')).toBeVisible();
  });

  it('renders a blocking loading state while bootstrapping', () => {
    const deferred = createDeferred<{ conversations: Array<{ id: string; title: string }> }>();

    renderChatBox(
      <ChatBox
        adapter={createAdapter({
          listConversations: vi.fn(async () => deferred.promise),
        })}
      />,
    );

    expect(screen.getByText('Loading...')).toBeVisible();
    expect(screen.getByRole('progressbar')).toBeVisible();
  });

  it('renders a blocking error state and retries conversations loading', async () => {
    let shouldFail = true;
    const listConversations = vi
      .fn<NonNullable<ChatAdapter['listConversations']>>()
      .mockImplementation(async () => {
        if (shouldFail) {
          throw new Error('Bootstrap failed');
        }

        return {
          conversations: [{ id: 'c1', title: 'Recovered' }],
        };
      });

    renderChatBox(
      <ChatBox
        adapter={createAdapter({
          listConversations,
        })}
        defaultConversations={[]}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Bootstrap failed')).toBeVisible();
    });

    shouldFail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => {
      expect(screen.getByRole('option', { name: /recovered/i })).toBeVisible();
    });
  });
});
