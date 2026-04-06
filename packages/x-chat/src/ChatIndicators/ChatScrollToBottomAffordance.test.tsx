import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatRoot, MessageListRoot } from '@mui/x-chat-headless';
import { ChatScrollToBottomAffordance } from './ChatScrollToBottomAffordance';

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

describe('ChatScrollToBottomAffordance', () => {
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

  it('renders without crashing inside a message list overlay', () => {
    const { container } = render(
      <ChatRoot adapter={createAdapter()}>
        <MessageListRoot renderItem={() => null} overlay={<ChatScrollToBottomAffordance />} />
      </ChatRoot>,
    );
    // In jsdom, isAtBottom=true so the affordance returns null — just verify no crash
    expect(container).toBeTruthy();
  });

  it.skipIf(isJSDOM)(
    'applies MuiChatScrollToBottomAffordance-root class when visible',
    async () => {
      const listRef = React.createRef<any>();
      render(
        <div style={{ height: '100px', overflow: 'hidden' }}>
          <ChatRoot
            adapter={createAdapter()}
            initialMessages={Array.from({ length: 20 }, (_, i) => ({
              id: `m${i}`,
              role: 'user' as const,
              parts: [{ type: 'text' as const, text: `Message ${i}` }],
            }))}
          >
            <MessageListRoot
              ref={listRef}
              renderItem={({ id }) => (
                <div key={id} style={{ height: '50px' }}>
                  Message
                </div>
              )}
              overlay={<ChatScrollToBottomAffordance />}
            />
          </ChatRoot>
        </div>,
      );

      // Scroll to top to trigger isAtBottom=false
      listRef.current?.scrollToBottom?.();

      // After scrolling away from bottom, the affordance should appear
      expect(document.querySelector('.MuiChatScrollToBottomAffordance-root')).not.toBe(null);
    },
  );

  it.skipIf(isJSDOM)('renders the down-arrow SVG icon as the default icon slot', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <MessageListRoot
          renderItem={() => null}
          overlay={<ChatScrollToBottomAffordance data-testid="affordance" />}
        />
      </ChatRoot>,
    );
    expect(document.querySelector('.MuiChatScrollToBottomAffordance-root svg')).not.toBe(null);
  });

  it.skipIf(isJSDOM)('forwards className to the root slot', () => {
    render(
      <ChatRoot adapter={createAdapter()}>
        <MessageListRoot
          renderItem={() => null}
          overlay={<ChatScrollToBottomAffordance className="custom-affordance" />}
        />
      </ChatRoot>,
    );
    expect(document.querySelector('.custom-affordance')).not.toBe(null);
  });
});
