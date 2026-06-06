import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useChatStatus, type ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from './ChatBox';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

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

function readNumericZIndex(element: HTMLElement) {
  const zIndex = window.getComputedStyle(element).zIndex;
  const parsed = Number(zIndex);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function ResizeObserverMock(
  callback: (
    entries: Array<{ borderBoxSize: [{ inlineSize: number }]; contentRect: { width: number } }>,
  ) => void,
) {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return {
    observe(element: HTMLElement) {
      const inlineSize = Number(element.dataset.resizeWidth ?? 0);
      timeout = setTimeout(() => {
        callback([
          {
            borderBoxSize: [{ inlineSize }],
            contentRect: { width: inlineSize },
          },
        ]);
      });
    },
    disconnect() {
      clearTimeout(timeout);
    },
    unobserve() {
      clearTimeout(timeout);
    },
  };
}

const conversationListFeatures = { conversationList: true } as const;

describe('ChatBox', () => {
  const originalResizeObserver = window.ResizeObserver;

  beforeEach(() => {
    window.ResizeObserver = ResizeObserverMock as any;
  });

  afterEach(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  describe('rendering', () => {
    it('renders with adapter and displays messages', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialMessages={[
            { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
            { id: 'm2', role: 'assistant', parts: [{ type: 'text', text: 'Hi there!' }] },
          ]}
        >
          {null}
        </ChatBox>,
      );
      expect(screen.getByText('Hello')).not.toBe(null);
      expect(screen.getByText('Hi there!')).not.toBe(null);
    });

    it('renders empty state text when no messages', () => {
      render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
      expect(screen.getByText('No messages yet')).not.toBe(null);
    });

    it('renders children inside the internal ChatProvider', () => {
      function StatusChild() {
        const { isStreaming } = useChatStatus();
        return <div data-testid="chatbox-child">{String(isStreaming)}</div>;
      }

      render(
        <ChatBox adapter={createAdapter()}>
          <StatusChild />
        </ChatBox>,
      );

      expect(screen.getByTestId('chatbox-child')).to.have.text('false');
    });

    it('honors the root slot and merges root slotProps with wrapper classes', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          slots={{ root: 'section' }}
          slotProps={{ root: { 'data-testid': 'custom-root', className: 'custom-root' } as any }}
        >
          {null}
        </ChatBox>,
      );

      const root = screen.getByTestId('custom-root');
      expect(root.tagName).toBe('SECTION');
      expect(root.className).to.include('MuiChatBox-root');
      expect(root.className).to.include('custom-root');
    });

    it('does not treat theme defaultProps.activeConversationId as a controlled prop', async () => {
      const listMessages = vi.fn().mockResolvedValue({ messages: [] });
      const theme = createTheme({
        components: {
          MuiChatBox: {
            defaultProps: {
              activeConversationId: 'theme-default',
            },
          },
        },
      } as any);

      render(
        <ThemeProvider theme={theme}>
          <ChatBox adapter={createAdapter({ listMessages })}>{null}</ChatBox>
        </ThemeProvider>,
      );

      await waitFor(() => {
        expect(listMessages).not.toHaveBeenCalled();
      });
    });

    it('resolves message avatars from getter-based author ids', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialMessages={[
            {
              id: 'm1',
              role: 'assistant',
              metadata: { actorId: 'bot-1' } as any,
              parts: [{ type: 'text', text: 'Hello' }],
            },
          ]}
          members={[
            {
              id: 'bot-1',
              displayName: 'Support Bot',
              avatarUrl: 'https://example.com/support-bot.png',
            },
          ]}
          getMessageAuthorId={(message) => (message.metadata as any)?.actorId}
        >
          {null}
        </ChatBox>,
      );

      expect(screen.getByAltText('Support Bot')).to.have.attribute(
        'src',
        'https://example.com/support-bot.png',
      );
    });
  });

  describe('feature: conversationHeader', () => {
    it('hides conversation header when features.conversationHeader=false', () => {
      render(
        <ChatBox adapter={createAdapter()} features={{ conversationHeader: false }}>
          {null}
        </ChatBox>,
      );
      expect(document.querySelector('.MuiChatConversationHeader-root')).toBe(null);
    });

    it('keeps the back navigation when the header is hidden in split layout', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          layoutMode="split"
          initialConversations={[{ id: 'c1', title: 'General' }]}
          initialActiveConversationId="c1"
          features={{ conversationList: true, conversationHeader: false }}
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      // The header chrome is gone…
      expect(document.querySelector('.MuiChatConversationHeader-root')).toBe(null);
      // …but the back-to-list affordance must survive, or split/narrow users get
      // trapped in the thread with no built-in way back to the conversation list.
      expect(screen.getByRole('button', { name: 'Back to conversations' })).not.toBe(null);
    });
  });

  describe('feature: emptyState', () => {
    it('resolves a function-form emptyState slotProp', () => {
      function CustomEmpty(props: React.HTMLAttributes<HTMLDivElement>) {
        return <div data-testid="custom-empty" {...props} />;
      }

      render(
        <ChatBox
          adapter={createAdapter()}
          slots={{ emptyState: CustomEmpty }}
          slotProps={{ emptyState: (() => ({ 'data-fn-empty': 'applied' })) as any }}
        >
          {null}
        </ChatBox>,
      );

      // The empty-state slotProps callback form must be resolved, not spread as an
      // object (which would drop its owner-state-driven props).
      expect(screen.getByTestId('custom-empty').getAttribute('data-fn-empty')).toBe('applied');
    });
  });

  describe('row dividers', () => {
    it('renders a date divider at a calendar-day boundary in the default list', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialMessages={[
            {
              id: 'm1',
              role: 'user',
              createdAt: '2026-03-13T10:00:00.000Z',
              parts: [{ type: 'text', text: 'Day one' }],
            },
            {
              id: 'm2',
              role: 'user',
              createdAt: '2026-03-14T10:00:00.000Z',
              parts: [{ type: 'text', text: 'Day two' }],
            },
          ]}
        >
          {null}
        </ChatBox>,
      );

      // One day boundary (m1→m2) → exactly one self-suppressing divider renders.
      expect(document.querySelectorAll('.MuiChatMessage-dateDivider').length).toBe(1);
    });

    it('hides date dividers when slots.dateDivider is null', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          slots={{ dateDivider: null }}
          initialMessages={[
            {
              id: 'm1',
              role: 'user',
              createdAt: '2026-03-13T10:00:00.000Z',
              parts: [{ type: 'text', text: 'Day one' }],
            },
            {
              id: 'm2',
              role: 'user',
              createdAt: '2026-03-14T10:00:00.000Z',
              parts: [{ type: 'text', text: 'Day two' }],
            },
          ]}
        >
          {null}
        </ChatBox>,
      );

      expect(document.querySelector('.MuiChatMessage-dateDivider')).toBe(null);
    });

    it('renders the unread marker at the conversation unread boundary', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={[{ id: 'c1', title: 'General', unreadCount: 1 }]}
          initialActiveConversationId="c1"
          initialMessages={[
            { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Read' }] },
            {
              id: 'm2',
              role: 'assistant',
              status: 'sent',
              parts: [{ type: 'text', text: 'Unread' }],
            },
          ]}
        >
          {null}
        </ChatBox>,
      );

      // unreadCount=1 over 2 messages → boundary before the last → one marker renders.
      expect(document.querySelector('.MuiChatUnreadMarker-root')).not.toBe(null);
    });
  });

  describe('slot: messageList', () => {
    it('treats slots.messageList as a wrapper-only root with rows rendered inside', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialMessages={[
            { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello list' }] },
          ]}
          slots={{ messageList: 'section' }}
        >
          {null}
        </ChatBox>,
      );

      // The custom element becomes the scrollable list root…
      const section = document.querySelector('section.MuiChatMessageList-root');
      expect(section).not.toBe(null);
      // …and the default rows still render inside it — `messageList` is wrapper-only,
      // not a whole-component replacement that would drop the list renderer.
      expect(screen.getByText('Hello list')).not.toBe(null);
      expect(section?.querySelector('.MuiChatMessage-root')).not.toBe(null);
      // Internal list props must not leak onto the wrapper element.
      expect(section?.hasAttribute('renderItem')).toBe(false);
      expect(section?.hasAttribute('items')).toBe(false);
    });
  });

  describe('feature: conversationList', () => {
    it('does not render the conversation list by default', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={[
            { id: 'c1', title: 'General' },
            { id: 'c2', title: 'Support' },
          ]}
          initialActiveConversationId="c1"
        >
          {null}
        </ChatBox>,
      );

      expect(screen.queryByRole('listbox')).toBe(null);
      expect(screen.queryByRole('button', { name: 'Open conversations' })).toBe(null);
    });

    it('renders the conversation list when features.conversationList=true', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={[
            { id: 'c1', title: 'General' },
            { id: 'c2', title: 'Support' },
          ]}
          initialActiveConversationId="c1"
          features={conversationListFeatures}
        >
          {null}
        </ChatBox>,
      );

      await waitFor(() => {
        expect(screen.getByRole('listbox')).not.toBe(null);
      });
    });
  });

  describe('feature: attachments', () => {
    it('shows attach button by default', () => {
      render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
      expect(screen.getByRole('button', { name: 'Add attachment' })).not.toBe(null);
    });

    it('hides attach button when features.attachments=false', () => {
      render(
        <ChatBox adapter={createAdapter()} features={{ attachments: false }}>
          {null}
        </ChatBox>,
      );
      expect(screen.queryByRole('button', { name: 'Add attachment' })).toBe(null);
    });

    it('features.attachments=false overrides a provided composerAttachButton slot', () => {
      function CustomAttach() {
        return <button type="button" data-testid="custom-attach" />;
      }
      render(
        <ChatBox
          adapter={createAdapter()}
          features={{ attachments: false }}
          slots={{ composerAttachButton: CustomAttach }}
        >
          {null}
        </ChatBox>,
      );
      expect(screen.queryByTestId('custom-attach')).toBe(null);
    });
  });

  describe('flat slots (context distribution)', () => {
    it('distributes a ChatBox-level message slot down to a rendered message', () => {
      function CustomAvatar() {
        return <div data-testid="ctx-avatar" />;
      }
      render(
        <ChatBox
          adapter={createAdapter()}
          initialMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: { id: 'a' },
              parts: [{ type: 'text', text: 'Hi' }],
            },
          ]}
          slots={{ messageAvatar: CustomAvatar }}
        >
          {null}
        </ChatBox>,
      );
      // The slot is provided only at the ChatBox level and reaches the deep
      // ChatMessage through the ChatSlots context (no prop drilling).
      expect(screen.getByTestId('ctx-avatar')).not.toBe(null);
    });

    it('forwards messageInlineMeta slotProps to the default inline meta', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialMessages={[
            {
              id: 'm1',
              role: 'assistant',
              createdAt: '2026-06-06T12:00:00.000Z',
              parts: [{ type: 'text', text: 'Hello' }],
            },
          ]}
          slotProps={{ messageInlineMeta: { 'data-testid': 'inline-meta' } as any }}
        >
          {null}
        </ChatBox>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('inline-meta')).not.toBe(null);
      });
    });
  });

  describe('rendered list context', () => {
    it('groups messages against the rendered items subset, not the full conversation', () => {
      function GroupAuthorName(props: { children?: React.ReactNode }) {
        return <div data-testid="group-author">{props.children}</div>;
      }

      // Two consecutive messages from the same author form a single group in the
      // full conversation, so only the first one starts a group (shows the author
      // name). Narrowing the rendered list to just the second message must make it
      // a group start — which only happens if `renderItem` forwards the rendered
      // `index`/`items` instead of letting the group fall back to the full thread.
      render(
        <ChatBox
          adapter={createAdapter()}
          members={[{ id: 'alice', displayName: 'Alice' }]}
          initialMessages={[
            {
              id: 'm1',
              role: 'assistant',
              status: 'sent',
              author: { id: 'alice' },
              parts: [{ type: 'text', text: 'one' }],
            },
            {
              id: 'm2',
              role: 'assistant',
              status: 'sent',
              author: { id: 'alice' },
              parts: [{ type: 'text', text: 'two' }],
            },
          ]}
          slots={{ messageAuthorName: GroupAuthorName }}
          slotProps={{ messageList: { items: ['m2'] } }}
        >
          {null}
        </ChatBox>,
      );

      // Only the subset renders…
      expect(screen.queryByText('one')).toBe(null);
      expect(screen.getByText('two')).not.toBe(null);
      // …and the subset's first row is treated as a group start (author shown).
      expect(screen.getByTestId('group-author').textContent).toBe('Alice');
    });
  });

  describe('feature: helperText', () => {
    it('hides helper text when features.helperText=false', () => {
      render(
        <ChatBox adapter={createAdapter()} features={{ helperText: false }}>
          {null}
        </ChatBox>,
      );
      expect(document.querySelector('.MuiChatComposerHelperText-root')).toBe(null);
    });
  });

  describe('feature: suggestions', () => {
    it('shows suggestions in empty state when provided', () => {
      render(
        <ChatBox adapter={createAdapter()} suggestions={['Tell me a joke', 'What is AI?']}>
          {null}
        </ChatBox>,
      );
      // The styled suggestion items render as buttons with their label as text content
      const suggestionButtons = document.querySelectorAll('.MuiChatSuggestions-item');
      expect(suggestionButtons.length).toBe(2);
      expect(suggestionButtons[0].textContent).toBe('Tell me a joke');
      expect(suggestionButtons[1].textContent).toBe('What is AI?');
    });

    it('hides suggestions when features.suggestions=false', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          suggestions={['Tell me a joke']}
          features={{ suggestions: false }}
        >
          {null}
        </ChatBox>,
      );
      expect(document.querySelector('.MuiChatSuggestions-root')).toBe(null);
    });

    it('hides the "no messages" empty state when suggestions are shown', () => {
      render(
        <ChatBox adapter={createAdapter()} suggestions={['Tell me a joke']}>
          {null}
        </ChatBox>,
      );
      // Suggestions take over the empty state; the "no messages" label must not appear
      expect(document.querySelector('.MuiChatBox-emptyState')).toBe(null);
      expect(document.querySelector('.MuiChatSuggestions-root')).not.toBe(null);
    });

    it('moves suggestions above the composer when messages exist', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          suggestions={['Tell me a joke']}
          initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
        >
          {null}
        </ChatBox>,
      );
      // The empty-state-centered suggestions are gone, but a "next prompt" row
      // is rendered above the composer instead (opted in via `alwaysVisible`).
      const root = document.querySelector('.MuiChatSuggestions-root');
      expect(root).not.toBe(null);
      expect(root!.hasAttribute('data-empty')).toBe(false);
    });

    it('applies a function-form suggestions root slotProp in the active-thread path', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          suggestions={['Tell me a joke']}
          initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
          slotProps={{
            suggestions: {
              slotProps: {
                root: (() => ({ 'data-fn-root': 'applied' })) as any,
              },
            },
          }}
        >
          {null}
        </ChatBox>,
      );
      const root = document.querySelector('.MuiChatSuggestions-root');
      expect(root).not.toBe(null);
      // The above-composer (active-thread) path must preserve the callback form of
      // `slotProps.suggestions.slotProps.root` rather than replacing it with `{ sx }`.
      expect(root!.getAttribute('data-fn-root')).toBe('applied');
      // …while the above-composer layout default still applies (not the empty state).
      expect(root!.hasAttribute('data-empty')).toBe(false);
    });

    it('shows the empty state when a rendered message subset is empty', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
          slotProps={{ messageList: { items: [] } as any }}
        >
          {null}
        </ChatBox>,
      );

      expect(screen.getByText('No messages yet')).not.toBe(null);
      expect(screen.queryByText('Hello')).toBe(null);
    });

    it.skipIf(isJSDOM)('applies a top-level suggestions sx in the active-thread path', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          suggestions={['Tell me a joke']}
          initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
          slotProps={{ suggestions: { sx: { color: 'rgb(1, 2, 3)' } } }}
        >
          {null}
        </ChatBox>,
      );
      // The consumer's top-level `slotProps.suggestions.sx` must survive the
      // above-composer layout `sx` injection (it's folded into the root `sx`),
      // not be overwritten as it was before.
      const root = document.querySelector('.MuiChatSuggestions-root') as HTMLElement;
      expect(root).not.toBe(null);
      expect(window.getComputedStyle(root).color).toBe('rgb(1, 2, 3)');
    });
  });

  describe('composer', () => {
    it('renders composer with placeholder', () => {
      render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
      const textarea = screen.getByPlaceholderText('Type a message');
      expect(textarea).not.toBe(null);
    });

    it('renders send button', () => {
      render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
      expect(screen.getByRole('button', { name: 'Send message' })).not.toBe(null);
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to root element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <ChatBox ref={ref} adapter={createAdapter()}>
          {null}
        </ChatBox>,
      );
      expect(ref.current).not.toBe(null);
      expect(ref.current!.tagName).toBe('DIV');
    });
  });

  describe('responsive layout', () => {
    const conversations = [
      { id: 'c1', title: 'General' },
      { id: 'c2', title: 'Support' },
    ];

    it('renders custom layout and pane slots without dropping layout styles', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="720"
          sx={{ height: 480 }}
          slots={{
            layout: 'section',
            conversationsPane: 'aside',
            threadPane: 'main',
          }}
          slotProps={{
            layout: {
              id: 'custom-layout',
              className: 'custom-layout',
              style: { backgroundColor: 'rgb(1, 2, 3)' },
            },
            conversationsPane: {
              id: 'custom-conversations-pane',
              className: 'custom-conversations-pane',
              style: { backgroundColor: 'rgb(4, 5, 6)' },
            },
            threadPane: {
              id: 'custom-thread-pane',
              className: 'custom-thread-pane',
              style: { backgroundColor: 'rgb(7, 8, 9)' },
            },
          }}
        >
          {null}
        </ChatBox>,
      );

      const layout = document.getElementById('custom-layout') as HTMLElement;
      const conversationsPane = document.getElementById('custom-conversations-pane') as HTMLElement;
      const threadPane = document.getElementById('custom-thread-pane') as HTMLElement;

      expect(layout).not.toBe(null);
      expect(conversationsPane).not.toBe(null);
      expect(threadPane).not.toBe(null);
      expect(layout.tagName).toBe('SECTION');
      expect(conversationsPane.tagName).toBe('ASIDE');
      expect(threadPane.tagName).toBe('MAIN');
      expect(layout.className).to.include('MuiChatBox-layout');
      expect(layout.className).to.include('custom-layout');
      expect(conversationsPane.className).to.include('MuiChatBox-conversationsPane');
      expect(conversationsPane.className).to.include('custom-conversations-pane');
      expect(threadPane.className).to.include('MuiChatBox-threadPane');
      expect(threadPane.className).to.include('custom-thread-pane');
      expect(conversationsPane.contains(screen.getByRole('listbox'))).toBe(true);
      expect(threadPane.querySelector('.MuiChatConversation-root')).not.toBe(null);
      expect(layout.style.display).toBe('flex');
      expect(['0', '0px']).to.include(layout.style.minHeight);
      expect(layout.style.backgroundColor).toBe('rgb(1, 2, 3)');
      expect(['0', '0px']).to.include(conversationsPane.style.minHeight);
      expect(conversationsPane.style.backgroundColor).toBe('rgb(4, 5, 6)');
      expect(threadPane.style.display).toBe('flex');
      expect(threadPane.style.overflow).toBe('hidden');
      expect(threadPane.style.backgroundColor).toBe('rgb(7, 8, 9)');
    });

    // Computed layout width is only meaningful in a real browser; JSDOM does not
    // resolve `width: 100%` against the pane, so this assertion runs browser-only.
    it.skipIf(isJSDOM)(
      'keeps the conversation list width controlled by the ChatBox layout pane',
      async () => {
        render(
          <ChatBox
            adapter={createAdapter()}
            initialConversations={conversations}
            initialActiveConversationId="c1"
            features={conversationListFeatures}
            variant="compact"
            data-resize-width="720"
            sx={{ height: 480 }}
          >
            {null}
          </ChatBox>,
        );

        await waitFor(() => {
          expect(screen.getByRole('listbox')).not.toBe(null);
        });

        const conversationList = document.querySelector(
          '.MuiChatConversationList-root',
        ) as HTMLElement;
        const scroller = document.querySelector('.MuiChatConversationList-scroller') as HTMLElement;

        expect(
          window
            .getComputedStyle(conversationList)
            .getPropertyValue('--ChatBox-conversationListWidth'),
        ).toBe('220px');
        // `width: 100%` resolves against the 220px pane, so the scroller fills it.
        expect(scroller).toHaveComputedStyle({ width: '220px' });
      },
    );

    // Forcing `layoutMode="standard"` on a narrow container renders the inline
    // sidebar rather than a drawer. The headless `ConversationListRoot` pins an
    // inline `display: flex` on the scroller, so the sidebar stays visible at
    // narrow widths (the scroller carries no width-based hide that could blank it).
    it('keeps the forced-standard sidebar scroller visible on a narrow container', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          initialActiveConversationId="c1"
          features={conversationListFeatures}
          layoutMode="standard"
          data-resize-width="480"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      await waitFor(() => {
        expect(screen.getByRole('listbox')).not.toBe(null);
      });

      const scroller = document.querySelector('.MuiChatConversationList-scroller') as HTMLElement;
      expect(scroller.style.display).toBe('flex');
    });

    it('shows the conversation menu button only when the chat box container is narrow', async () => {
      const { rerender } = render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="720"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Open conversations' })).toBe(null);
      });

      rerender(
        <ChatBox
          key="narrow"
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="480"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Open conversations' })).not.toBe(null);
      });
    });

    it('lets users override the automatic layout mode breakpoints', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          layoutModeBreakpoints={{ overlay: 700, split: 500 }}
          data-resize-width="650"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Open conversations' })).not.toBe(null);
      });

      expect(screen.queryByRole('listbox')).toBe(null);
    });

    it('lets users control the responsive layout mode explicitly', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          layoutMode="split"
          data-resize-width="720"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      await waitFor(() => {
        expect(screen.getByRole('listbox')).not.toBe(null);
      });

      expect(screen.queryByRole('button', { name: 'Open conversations' })).toBe(null);
    });

    it('renders the narrow conversation overlay inside the chat box instead of portaling to the page', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="480"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      const chatBox = document.querySelector('.MuiChatBox-root') as HTMLElement;

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Open conversations' })).not.toBe(null);
      });

      fireEvent.click(screen.getByRole('button', { name: 'Open conversations' }));

      await waitFor(() => {
        const overlay = chatBox.querySelector('[class*="MuiChatBox-conversationOverlay"]');
        expect(overlay).not.toBe(null);
        expect(chatBox.contains(overlay)).toBe(true);
      });
    });

    it('closes the narrow overlay when a conversation is selected via keyboard', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="480"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      const chatBox = document.querySelector('.MuiChatBox-root') as HTMLElement;

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Open conversations' })).not.toBe(null);
      });

      fireEvent.click(screen.getByRole('button', { name: 'Open conversations' }));

      await waitFor(() => {
        expect(chatBox.querySelector('[class*="MuiChatBox-conversationOverlay"]')).not.toBe(null);
      });

      // Select a conversation with the keyboard. `ConversationListRoot`'s Enter
      // handler calls `setActiveConversation` directly, bypassing the item onClick
      // where the overlay close is otherwise wired.
      const option = screen.getByRole('option', { name: 'General' });
      act(() => {
        option.focus();
      });
      fireEvent.keyDown(option, { key: 'Enter' });

      // The overlay must close on keyboard selection too, not just pointer clicks —
      // otherwise focus stays trapped in the modal after the thread changed.
      await waitFor(() => {
        expect(chatBox.querySelector('[class*="MuiChatBox-conversationOverlay"]')).toBe(null);
      });
    });

    it('closes the narrow overlay when the already-active conversation is reselected via keyboard', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          initialActiveConversationId="c1"
          features={conversationListFeatures}
          data-resize-width="480"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      const chatBox = document.querySelector('.MuiChatBox-root') as HTMLElement;

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Open conversations' })).not.toBe(null);
      });

      fireEvent.click(screen.getByRole('button', { name: 'Open conversations' }));

      await waitFor(() => {
        expect(chatBox.querySelector('[class*="MuiChatBox-conversationOverlay"]')).not.toBe(null);
      });

      const option = screen.getByRole('option', { name: 'General' });
      act(() => {
        option.focus();
      });
      fireEvent.keyDown(option, { key: 'Enter' });

      await waitFor(() => {
        expect(chatBox.querySelector('[class*="MuiChatBox-conversationOverlay"]')).toBe(null);
      });
    });

    it('places the split conversation list in the conversations pane when no conversation is active', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          layoutMode="split"
          initialConversations={conversations}
          features={conversationListFeatures}
          sx={{ height: 480 }}
          slotProps={{
            conversationsPane: { 'data-testid': 'conversations-pane' } as any,
            threadPane: { 'data-testid': 'thread-pane' } as any,
          }}
        >
          {null}
        </ChatBox>,
      );

      // Split layout, list visible, no active conversation → the list is the only
      // child of ChatLayout. It must be assigned to the conversations pane (the
      // Material wrapper carries the pane marker), not fall back to the thread pane.
      const conversationsPane = screen.getByTestId('conversations-pane');
      const listbox = screen.getByRole('listbox');
      expect(conversationsPane.contains(listbox)).toBe(true);
      // The thread pane has no child here, so it isn't rendered as a conversations host.
      expect(screen.queryByTestId('thread-pane')).toBe(null);
    });

    it('stretches the thread pane to full width in narrow mode', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="480"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      const chatBox = document.querySelector('.MuiChatBox-root') as HTMLElement;

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Open conversations' })).not.toBe(null);
      });

      const layout = chatBox.firstElementChild as HTMLElement;
      const layoutChildren = Array.from(layout.children) as HTMLElement[];
      const threadPane = layoutChildren.find((element) => element.style.width === '100%') as
        | HTMLElement
        | undefined;

      expect(threadPane).not.toBe(undefined);
      expect(threadPane!.style.width).toBe('100%');
    });

    it('renders the narrow conversation overlay above the composer', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="480"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      const chatBox = document.querySelector('.MuiChatBox-root') as HTMLElement;

      fireEvent.click(await screen.findByRole('button', { name: 'Open conversations' }));

      await waitFor(() => {
        expect(chatBox.querySelector('[class*="MuiChatBox-conversationOverlay"]')).not.toBe(null);
      });

      const overlay = chatBox.querySelector(
        '[class*="MuiChatBox-conversationOverlay"]',
      ) as HTMLElement;
      const composer = chatBox.querySelector('.MuiChatComposer-root') as HTMLElement;

      expect(overlay).not.toBe(null);
      expect(composer).not.toBe(null);
      expect(readNumericZIndex(overlay)).toBeGreaterThan(readNumericZIndex(composer));
    });

    it('shows a close button in the narrow overlay and closes it when pressed', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="480"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      fireEvent.click(await screen.findByRole('button', { name: 'Open conversations' }));

      const closeButtons = await screen.findAllByRole('button', { name: 'Close conversations' });
      fireEvent.click(closeButtons[0]);

      await waitFor(() => {
        expect(screen.queryAllByRole('button', { name: 'Close conversations' })).toHaveLength(0);
      });
    });

    it('does not expose the backdrop as an extra close button', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="480"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      fireEvent.click(await screen.findByRole('button', { name: 'Open conversations' }));

      expect(await screen.findAllByRole('button', { name: 'Close conversations' })).toHaveLength(1);
    });

    it('treats the narrow conversation overlay as a modal dialog', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="480"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      const menuButton = await screen.findByRole('button', { name: 'Open conversations' });
      act(() => {
        menuButton.focus();
      });
      fireEvent.click(menuButton);

      const dialog = await screen.findByRole('dialog', { name: 'Open conversations' });
      expect(dialog).to.have.attribute('aria-modal', 'true');
      const closeButton = dialog.querySelector(
        'button[aria-label="Close conversations"]',
      ) as HTMLButtonElement;

      await waitFor(() => {
        expect(document.activeElement).toBe(closeButton);
      });

      act(() => {
        closeButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: 'Open conversations' })).toBe(null);
        expect(document.activeElement).toBe(menuButton);
      });
    });

    it('shows a full-width conversation list below 450px and navigates to the thread with a back button', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
          features={conversationListFeatures}
          data-resize-width="360"
          sx={{ height: 480 }}
        >
          {null}
        </ChatBox>,
      );

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Open conversations' })).toBe(null);
      });

      expect(screen.getByRole('listbox')).not.toBe(null);

      fireEvent.click(screen.getByText('General'));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Back to conversations' })).not.toBe(null);
      });

      expect(screen.queryByRole('listbox')).toBe(null);

      fireEvent.click(screen.getByRole('button', { name: 'Back to conversations' }));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).not.toBe(null);
      });

      expect(screen.queryByRole('button', { name: 'Back to conversations' })).toBe(null);
    });

    it('restores conversation messages after navigating back to the list and reopening the same conversation', async () => {
      const listMessages = vi.fn(async ({ conversationId }: { conversationId: string }) => ({
        messages:
          conversationId === 'c1'
            ? [
                {
                  id: 'm1',
                  conversationId: 'c1',
                  role: 'user' as const,
                  parts: [{ type: 'text' as const, text: 'Question for c1' }],
                },
                {
                  id: 'm2',
                  conversationId: 'c1',
                  role: 'assistant' as const,
                  parts: [{ type: 'text' as const, text: 'Answer for c1' }],
                },
              ]
            : [
                {
                  id: 'm3',
                  conversationId: 'c2',
                  role: 'assistant' as const,
                  parts: [{ type: 'text' as const, text: 'Support thread' }],
                },
              ],
        hasMore: false,
      }));

      render(
        <React.StrictMode>
          <ChatBox
            adapter={createAdapter({ listMessages })}
            conversations={conversations}
            initialActiveConversationId="c1"
            features={conversationListFeatures}
            data-resize-width="360"
            sx={{ height: 480 }}
          >
            {null}
          </ChatBox>
        </React.StrictMode>,
      );

      expect(await screen.findByText('Question for c1')).not.toBe(null);
      expect(await screen.findByRole('button', { name: 'Back to conversations' })).not.toBe(null);

      fireEvent.click(screen.getByRole('button', { name: 'Back to conversations' }));

      await waitFor(() => {
        expect(screen.getByRole('listbox')).not.toBe(null);
      });

      fireEvent.click(screen.getByText('General'));

      await waitFor(() => {
        expect(screen.getByText('Question for c1')).not.toBe(null);
      });

      expect(screen.getByText('Answer for c1')).not.toBe(null);
      expect(listMessages.mock.calls.map(([arg]) => arg.conversationId)).toEqual([
        'c1',
        'c1',
        'c1',
      ]);
    });
  });
});
