import * as React from 'react';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter, ChatRealtimeEvent } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';

const isJSDOM = /jsdom/.test(window.navigator.userAgent);

const { render } = createRenderer();

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(c) {
          c.close();
        },
      });
    },
    ...overrides,
  };
}

describe('ChatTypingIndicator', () => {
  it('renders without crashing inside ChatBox', () => {
    // TypingIndicator returns null when no users are typing; just verify no crash
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    expect(document.querySelector('.MuiChatBox-root')).not.toBe(null);
  });

  it('does not render the typing indicator when no users are typing', () => {
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    expect(document.querySelector('.MuiChatTypingIndicator-root')).toBe(null);
  });

  it('does not crash when className is passed via slotProps.typingIndicator', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        slotProps={{ typingIndicator: { className: 'custom-typing' } }}
      >
        {null}
      </ChatBox>,
    );
    expect(document.querySelector('.MuiChatBox-root')).not.toBe(null);
  });

  function renderChatBox(props: Partial<React.ComponentProps<typeof ChatBox>> = {}) {
    let onEvent: ((event: ChatRealtimeEvent) => void) | undefined;
    const adapter = createAdapter({
      subscribe({ onEvent: nextOnEvent }) {
        onEvent = nextOnEvent;
        return () => {};
      },
    });
    const view = render(
      <ChatBox
        adapter={adapter}
        initialActiveConversationId="c1"
        initialConversations={[{ id: 'c1', participants: [{ id: 'u1', displayName: 'Alice' }] }]}
        {...props}
      />,
    );
    const startTyping = () => {
      expect(onEvent).not.to.equal(undefined);
      act(() => {
        onEvent!({ type: 'typing', conversationId: 'c1', userId: 'u1', isTyping: true });
      });
    };
    return { ...view, startTyping };
  }

  function renderWithTypingUser(props: Partial<React.ComponentProps<typeof ChatBox>> = {}) {
    const view = renderChatBox(props);
    view.startTyping();
    return view;
  }

  it('renders the typing indicator inside ChatBox while a member is typing', async () => {
    renderWithTypingUser({ slotProps: { typingIndicator: { className: 'custom-typing' } } });

    await waitFor(() => {
      expect(document.querySelector('.MuiChatTypingIndicator-root')).to.have.text(
        'Alice is typing',
      );
    });
    expect(document.querySelector('.MuiChatTypingIndicator-root')).to.have.class('custom-typing');
  });

  it('renders a custom typingIndicator slot with its slotProps', async () => {
    function CustomTypingIndicator(props: { 'data-testid'?: string }) {
      return <div data-testid={props['data-testid']}>custom dots</div>;
    }

    renderWithTypingUser({
      slots: { typingIndicator: CustomTypingIndicator },
      slotProps: { typingIndicator: { 'data-testid': 'custom-typing-indicator' } },
    });

    await waitFor(() => {
      expect(screen.getByTestId('custom-typing-indicator')).to.have.text('custom dots');
    });
  });

  it('hides the typing indicator when the typingIndicator slot is null', async () => {
    const view = renderWithTypingUser();

    await waitFor(() => {
      expect(document.querySelector('.MuiChatTypingIndicator-root')).to.have.text(
        'Alice is typing',
      );
    });

    view.setProps({ slots: { typingIndicator: null } });

    expect(document.querySelector('.MuiChatTypingIndicator-root')).to.equal(null);
  });

  async function renderScrolledToBottom(props: Partial<React.ComponentProps<typeof ChatBox>> = {}) {
    const view = renderChatBox({
      style: { height: 400 },
      initialMessages: Array.from({ length: 30 }, (_, index) => ({
        id: `m${index}`,
        conversationId: 'c1',
        role: 'user' as const,
        parts: [{ type: 'text' as const, text: `Message ${index}` }],
      })),
      ...props,
    });
    const scroller = document.querySelector<HTMLElement>('[role="log"]')!;
    const getDistanceFromBottom = () =>
      scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop;

    await waitFor(() => {
      expect(scroller.scrollHeight).to.be.greaterThan(scroller.clientHeight);
    });
    act(() => {
      scroller.scrollTop = scroller.scrollHeight;
      scroller.dispatchEvent(new Event('scroll'));
    });
    expect(getDistanceFromBottom()).to.be.at.most(1);

    return { ...view, scroller, getDistanceFromBottom };
  }

  it.skipIf(isJSDOM)('keeps the message list pinned to the bottom when typing starts', async () => {
    const { startTyping, getDistanceFromBottom } = await renderScrolledToBottom();

    startTyping();

    await waitFor(() => {
      expect(document.querySelector('.MuiChatTypingIndicator-root')).not.to.equal(null);
    });
    await waitFor(() => {
      expect(getDistanceFromBottom()).to.be.at.most(1);
    });
  });

  it.skipIf(isJSDOM)('does not re-pin the message list when autoScroll is disabled', async () => {
    const { startTyping, scroller } = await renderScrolledToBottom({
      features: { autoScroll: false },
    });
    const scrollTop = scroller.scrollTop;

    startTyping();

    await waitFor(() => {
      expect(document.querySelector('.MuiChatTypingIndicator-root')).not.to.equal(null);
    });
    // Let the ResizeObserver callback run before asserting.
    await act(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        }),
    );
    expect(scroller.scrollTop).to.equal(scrollTop);
  });
});
