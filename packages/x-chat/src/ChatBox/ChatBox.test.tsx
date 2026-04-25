import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
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

    it('does not show suggestions when messages exist', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          suggestions={['Tell me a joke']}
          initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
        >
          {null}
        </ChatBox>,
      );
      expect(document.querySelector('.MuiChatSuggestions-root')).toBe(null);
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

    it('shows the conversation menu button only when the chat box container is narrow', async () => {
      const { rerender } = render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
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

    it('shows a close button in the narrow overlay and closes it when pressed', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
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

    it('treats the narrow conversation overlay as a modal dialog', async () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialConversations={conversations}
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
