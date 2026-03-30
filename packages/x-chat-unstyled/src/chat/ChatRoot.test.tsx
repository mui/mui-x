import * as React from 'react';
import { createRenderer, renderHook, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { useChatStore } from '@mui/x-chat-headless';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatRoot } from './ChatRoot';

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

describe('ChatRoot', () => {
  it('provides headless chat context to descendants', () => {
    const wrapper = ({ children }: React.PropsWithChildren) => (
      <ChatRoot adapter={createAdapter()} initialMessages={[{ id: 'm1', role: 'user', parts: [] }]}>
        {children}
      </ChatRoot>
    );
    const { result } = renderHook(() => useChatStore(), { wrapper });

    expect(result.current.state.messageIds).toEqual(['m1']);
  });

  it('supports replacing the root slot and forwarding root props', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        data-testid="chat-root"
        slots={{ root: 'section' }}
        slotProps={{ root: { id: 'custom-root' } }}
      >
        <div>content</div>
      </ChatRoot>,
    );

    const root = screen.getByTestId('chat-root');

    expect(root.tagName).toBe('SECTION');
    expect(root).to.have.attribute('id', 'custom-root');
    expect(root).to.have.text('content');
  });

  it('forwards refs to the rendered root element', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <ChatRoot adapter={createAdapter()} ref={ref}>
        <div>content</div>
      </ChatRoot>,
    );

    expect(ref.current).to.be.instanceOf(window.HTMLDivElement);
    expect(ref.current).to.have.text('content');
  });
});
