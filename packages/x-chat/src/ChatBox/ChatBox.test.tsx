import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
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
