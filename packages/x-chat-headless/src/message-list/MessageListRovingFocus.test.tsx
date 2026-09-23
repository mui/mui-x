import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '../adapters/chatAdapter';
import type { ChatMessage } from '../types/chat-entities';
import { ChatRoot } from '../chat/ChatRoot';
import { ConversationListRoot } from '../conversation-list/ConversationListRoot';
import { MessageRoot } from '../message/MessageRoot';
import { MessageListRoot } from './MessageListRoot';

const { render } = createRenderer();

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

function createMessage(
  id: string,
  role: ChatMessage['role'] = 'assistant',
  text = id,
): ChatMessage {
  return {
    id,
    role,
    parts: [{ type: 'text', text }],
  };
}

function renderMessageItem({ id }: { id: string }) {
  return <MessageRoot messageId={id}>{id}</MessageRoot>;
}

function getArticleByMessageId(id: string) {
  const article = document.querySelector(`[data-message-id="${id}"] [role="article"]`);
  expect(article).not.toBeNull();
  return article as HTMLElement;
}

function getTabbableArticleIds() {
  return Array.from(document.querySelectorAll('[role="article"][tabindex="0"]')).map((article) =>
    article.closest('[data-message-id]')?.getAttribute('data-message-id'),
  );
}

describe('MessageListRoot roving focus', () => {
  // Base UI's ScrollArea performs internal state updates on mount that trigger
  // React "not wrapped in act()" warnings in JSDOM.
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {
        return;
      }
      // eslint-disable-next-line no-console
      console.info(...args);
    });
  });
  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('exposes exactly one tab stop, on the newest message', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1'), createMessage('m2'), createMessage('m3')]}
      >
        <MessageListRoot renderItem={renderMessageItem} />
      </ChatRoot>,
    );

    const articles = screen.getAllByRole('article');
    expect(articles).to.have.length(3);
    expect(getTabbableArticleIds()).to.deep.equal(['m3']);
    expect(getArticleByMessageId('m1')).to.have.attribute('tabindex', '-1');
    expect(getArticleByMessageId('m2')).to.have.attribute('tabindex', '-1');
  });

  it('moves focus between messages with ArrowUp/ArrowDown/Home/End and clamps at the ends', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1'), createMessage('m2'), createMessage('m3')]}
      >
        <MessageListRoot renderItem={renderMessageItem} />
      </ChatRoot>,
    );

    act(() => {
      getArticleByMessageId('m3').focus();
    });

    fireEvent.keyDown(getArticleByMessageId('m3'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(getArticleByMessageId('m2'));
    expect(getTabbableArticleIds()).to.deep.equal(['m2']);

    fireEvent.keyDown(getArticleByMessageId('m2'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(getArticleByMessageId('m1'));

    // Clamped at the first message — no wrap.
    fireEvent.keyDown(getArticleByMessageId('m1'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(getArticleByMessageId('m1'));

    fireEvent.keyDown(getArticleByMessageId('m1'), { key: 'End' });
    expect(document.activeElement).toBe(getArticleByMessageId('m3'));

    fireEvent.keyDown(getArticleByMessageId('m3'), { key: 'Home' });
    expect(document.activeElement).toBe(getArticleByMessageId('m1'));

    fireEvent.keyDown(getArticleByMessageId('m1'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(getArticleByMessageId('m2'));
  });

  it('leaves PageDown/PageUp to native scrolling (no focus move)', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1'), createMessage('m2'), createMessage('m3')]}
      >
        <MessageListRoot renderItem={renderMessageItem} />
      </ChatRoot>,
    );

    act(() => {
      getArticleByMessageId('m3').focus();
    });
    const notPrevented = fireEvent.keyDown(getArticleByMessageId('m3'), { key: 'PageUp' });
    expect(document.activeElement).toBe(getArticleByMessageId('m3'));
    expect(notPrevented).toBe(true);
  });

  it('keeps focus on the same message when new messages are appended', () => {
    function Harness() {
      const [messages, setMessages] = React.useState<ChatMessage[]>([
        createMessage('m1'),
        createMessage('m2'),
      ]);
      return (
        <ChatRoot adapter={createAdapter()} messages={messages}>
          <button
            onClick={() => setMessages((previous) => [...previous, createMessage('m3')])}
            type="button"
          >
            append
          </button>
          <MessageListRoot renderItem={renderMessageItem} />
        </ChatRoot>
      );
    }
    render(<Harness />);

    act(() => {
      getArticleByMessageId('m2').focus();
    });
    fireEvent.keyDown(getArticleByMessageId('m2'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(getArticleByMessageId('m1'));

    fireEvent.click(screen.getByRole('button', { name: 'append' }));

    expect(document.activeElement).toBe(getArticleByMessageId('m1'));
    expect(getTabbableArticleIds()).to.deep.equal(['m1']);
    expect(getArticleByMessageId('m3')).to.have.attribute('tabindex', '-1');
  });

  it('roves over the rendered subset when the items prop is provided', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1'), createMessage('m2'), createMessage('m3')]}
      >
        <MessageListRoot items={['m1', 'm3']} renderItem={renderMessageItem} />
      </ChatRoot>,
    );

    expect(screen.getAllByRole('article')).to.have.length(2);
    act(() => {
      getArticleByMessageId('m3').focus();
    });
    fireEvent.keyDown(getArticleByMessageId('m3'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(getArticleByMessageId('m1'));
  });

  it('drills into a message with Enter and returns with Escape', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1'), createMessage('m2')]}
      >
        <MessageListRoot
          renderItem={({ id }) => (
            <MessageRoot messageId={id}>
              {id === 'm1' ? (
                <button data-testid="inner-action" tabIndex={-1} type="button">
                  copy
                </button>
              ) : (
                id
              )}
            </MessageRoot>
          )}
        />
      </ChatRoot>,
    );

    act(() => {
      getArticleByMessageId('m2').focus();
    });
    fireEvent.keyDown(getArticleByMessageId('m2'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(getArticleByMessageId('m1'));

    fireEvent.keyDown(getArticleByMessageId('m1'), { key: 'Enter' });
    expect(getArticleByMessageId('m1')).to.have.attribute('data-actionable', 'true');
    expect(document.activeElement).toBe(screen.getByTestId('inner-action'));

    // Arrow keys while drilled in must not move between messages.
    fireEvent.keyDown(screen.getByTestId('inner-action'), { key: 'ArrowDown' });
    expect(document.activeElement).toBe(screen.getByTestId('inner-action'));

    fireEvent.keyDown(screen.getByTestId('inner-action'), { key: 'Escape' });
    expect(document.activeElement).toBe(getArticleByMessageId('m1'));
    expect(getArticleByMessageId('m1')).not.to.have.attribute('data-actionable');
  });

  it('re-enters the controls when Enter is pressed while already drilled in', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1'), createMessage('m2')]}
      >
        <MessageListRoot
          renderItem={({ id }) => (
            <MessageRoot messageId={id}>
              {id === 'm2' ? (
                <button data-testid="inner-action" tabIndex={-1} type="button">
                  copy
                </button>
              ) : (
                id
              )}
            </MessageRoot>
          )}
        />
      </ChatRoot>,
    );

    act(() => {
      getArticleByMessageId('m2').focus();
    });
    fireEvent.keyDown(getArticleByMessageId('m2'), { key: 'Enter' });
    expect(document.activeElement).toBe(screen.getByTestId('inner-action'));

    // Click back onto the article body: focus returns to the article but the
    // message stays actionable (focus never left it).
    act(() => {
      getArticleByMessageId('m2').focus();
    });
    expect(getArticleByMessageId('m2')).to.have.attribute('data-actionable', 'true');

    // Enter again is a same-id no-op for the state, so the focus move must be
    // issued directly.
    fireEvent.keyDown(getArticleByMessageId('m2'), { key: 'Enter' });
    expect(document.activeElement).toBe(screen.getByTestId('inner-action'));
  });

  it('clears the drill-in state when the actionable message unmounts', () => {
    function Harness() {
      const [items, setItems] = React.useState(['m1', 'm2']);
      return (
        <ChatRoot
          adapter={createAdapter()}
          initialMessages={[createMessage('m1'), createMessage('m2')]}
        >
          <button onClick={() => setItems(['m1'])} type="button">
            remove
          </button>
          <button onClick={() => setItems(['m1', 'm2'])} type="button">
            restore
          </button>
          <MessageListRoot
            items={items}
            renderItem={({ id }) => (
              <MessageRoot messageId={id}>
                {id === 'm2' ? (
                  <button data-testid="inner-action" tabIndex={-1} type="button">
                    copy
                  </button>
                ) : (
                  id
                )}
              </MessageRoot>
            )}
          />
        </ChatRoot>
      );
    }
    render(<Harness />);

    act(() => {
      getArticleByMessageId('m2').focus();
    });
    fireEvent.keyDown(getArticleByMessageId('m2'), { key: 'Enter' });
    expect(document.activeElement).toBe(screen.getByTestId('inner-action'));

    // Unmounting fires no focusout — deregistration must clear the state so
    // the restored message does not come back pre-drilled.
    fireEvent.click(screen.getByRole('button', { name: 'remove' }));
    fireEvent.click(screen.getByRole('button', { name: 'restore' }));

    expect(getArticleByMessageId('m2')).not.to.have.attribute('data-actionable');
    expect(screen.getByTestId('inner-action')).to.have.attribute('tabindex', '-1');
  });

  it('ignores Enter on a message without focusable content', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1'), createMessage('m2')]}
      >
        <MessageListRoot renderItem={renderMessageItem} />
      </ChatRoot>,
    );

    act(() => {
      getArticleByMessageId('m2').focus();
    });
    fireEvent.keyDown(getArticleByMessageId('m2'), { key: 'Enter' });
    expect(document.activeElement).toBe(getArticleByMessageId('m2'));
    expect(getArticleByMessageId('m2')).not.to.have.attribute('data-actionable');
  });

  it('exits drill-in when focus leaves the message without stealing focus back', async () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1'), createMessage('m2')]}
      >
        <MessageListRoot
          renderItem={({ id }) => (
            <MessageRoot messageId={id}>
              {id === 'm2' ? (
                <button data-testid="inner-action" tabIndex={-1} type="button">
                  copy
                </button>
              ) : (
                id
              )}
            </MessageRoot>
          )}
        />
        <input data-testid="outside" />
      </ChatRoot>,
    );

    act(() => {
      getArticleByMessageId('m2').focus();
    });
    fireEvent.keyDown(getArticleByMessageId('m2'), { key: 'Enter' });
    expect(document.activeElement).toBe(screen.getByTestId('inner-action'));

    act(() => {
      screen.getByTestId('outside').focus();
    });

    await waitFor(() => {
      expect(getArticleByMessageId('m2')).not.to.have.attribute('data-actionable');
    });
    expect(document.activeElement).toBe(screen.getByTestId('outside'));
  });

  it('marks the streaming message with aria-busy', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1'), { ...createMessage('m2'), status: 'streaming' }]}
      >
        <MessageListRoot renderItem={renderMessageItem} />
      </ChatRoot>,
    );

    expect(getArticleByMessageId('m2')).to.have.attribute('aria-busy', 'true');
    expect(getArticleByMessageId('m1')).not.to.have.attribute('aria-busy');
  });

  it('renders no tab stop when roving focus is disabled or outside a list', () => {
    const { unmount } = render(
      <ChatRoot adapter={createAdapter()} initialMessages={[createMessage('m1')]}>
        <MessageListRoot enableRovingFocus={false} renderItem={renderMessageItem} />
      </ChatRoot>,
    );
    expect(screen.getByRole('article')).not.to.have.attribute('tabindex');
    unmount();

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[createMessage('m1')]}>
        <MessageRoot messageId="m1">standalone</MessageRoot>
      </ChatRoot>,
    );
    expect(screen.getByRole('article')).not.to.have.attribute('tabindex');
  });

  it('does not re-render memoized rows on focus moves (perf guard)', () => {
    const renderCounts = new Map<string, number>();
    const RowItem = React.memo(function RowItem({ id }: { id: string }) {
      renderCounts.set(id, (renderCounts.get(id) ?? 0) + 1);
      return <MessageRoot messageId={id}>{id}</MessageRoot>;
    });

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[createMessage('m1'), createMessage('m2'), createMessage('m3')]}
      >
        <MessageListRoot renderItem={({ id }) => <RowItem id={id} key={id} />} />
      </ChatRoot>,
    );

    const countsAfterMount = new Map(renderCounts);

    act(() => {
      getArticleByMessageId('m3').focus();
    });
    fireEvent.keyDown(getArticleByMessageId('m3'), { key: 'ArrowUp' });
    fireEvent.keyDown(getArticleByMessageId('m2'), { key: 'ArrowUp' });

    // The roving state lives outside React context values, so moving focus
    // must not punch through the memoized row components.
    expect(Object.fromEntries(renderCounts)).to.deep.equal(Object.fromEntries(countsAfterMount));
  });

  it('announces streaming transitions once each, never per token', () => {
    function Harness() {
      const [messages, setMessages] = React.useState<ChatMessage[]>([createMessage('m1')]);
      return (
        <ChatRoot adapter={createAdapter()} messages={messages}>
          <button
            onClick={() =>
              setMessages([
                createMessage('m1'),
                { ...createMessage('m2', 'assistant', ''), status: 'streaming' },
              ])
            }
            type="button"
          >
            start
          </button>
          <button
            onClick={() =>
              setMessages((previous) =>
                previous.map((message) =>
                  message.id === 'm2'
                    ? { ...message, parts: [{ type: 'text', text: `${Math.random()}` }] }
                    : message,
                ),
              )
            }
            type="button"
          >
            token
          </button>
          <button
            onClick={() =>
              setMessages((previous) =>
                previous.map((message) =>
                  message.id === 'm2' ? { ...message, status: 'sent' as const } : message,
                ),
              )
            }
            type="button"
          >
            complete
          </button>
          <MessageListRoot renderItem={renderMessageItem} />
        </ChatRoot>
      );
    }
    render(<Harness />);

    const status = screen.getByRole('status');
    expect(status).to.have.text('');

    fireEvent.click(screen.getByRole('button', { name: 'start' }));
    expect(status).to.have.text('Assistant is responding');

    // Streamed content updates must not change the announcement.
    fireEvent.click(screen.getByRole('button', { name: 'token' }));
    fireEvent.click(screen.getByRole('button', { name: 'token' }));
    expect(status).to.have.text('Assistant is responding');

    fireEvent.click(screen.getByRole('button', { name: 'complete' }));
    expect(status).to.have.text('Response complete');
  });

  it('does not share focus restoration with the conversation list', async () => {
    function Harness() {
      const [open, setOpen] = React.useState(true);
      return (
        <ChatRoot
          adapter={createAdapter()}
          initialActiveConversationId="c1"
          initialConversations={[
            { id: 'c1', title: 'First conversation' },
            { id: 'c2', title: 'Second conversation' },
          ]}
          initialMessages={[createMessage('m1'), createMessage('m2')]}
        >
          <button onClick={() => setOpen((value) => !value)} type="button">
            toggle
          </button>
          {open ? (
            <React.Fragment>
              <ConversationListRoot />
              <MessageListRoot renderItem={renderMessageItem} />
            </React.Fragment>
          ) : null}
        </ChatRoot>
      );
    }
    render(<Harness />);

    // Interact with the message list first, then the conversation list. Both
    // lists store their focus under the same chat store: only the scope
    // namespacing keeps them from clobbering each other.
    act(() => {
      getArticleByMessageId('m2').focus();
    });
    fireEvent.keyDown(getArticleByMessageId('m2'), { key: 'ArrowUp' });
    expect(document.activeElement).toBe(getArticleByMessageId('m1'));

    const options = screen.getAllByRole('option');
    act(() => {
      (options[1] as HTMLElement).focus();
    });

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));

    // The conversation list actively restores focus to its stored item…
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getAllByRole('option')[1]);
    });
    // …while the message list's stored tab stop survives independently.
    expect(getTabbableArticleIds()).to.deep.equal(['m1']);
  });
});
