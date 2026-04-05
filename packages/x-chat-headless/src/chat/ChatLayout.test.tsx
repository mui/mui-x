import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import { ChatLayout } from './ChatLayout';
import { markChatLayoutPane } from './internals/chatLayoutPaneKind';

const { render } = createRenderer();

const MockConversationRoot = markChatLayoutPane(function MockConversationRoot() {
  return <div data-testid="conversation-root">conversation</div>;
}, 'conversations');

const MockThreadRoot = markChatLayoutPane(function MockThreadRoot() {
  return <div data-testid="thread-root">thread</div>;
}, 'thread');

describe('ChatLayout', () => {
  it('renders a flex root and wraps both panes by default', () => {
    render(
      <ChatLayout data-testid="layout-root">
        <div data-testid="conversations-child">conversations</div>
        <div data-testid="thread-child">thread</div>
      </ChatLayout>,
    );

    const root = screen.getByTestId('layout-root');

    expect(root).to.have.attribute('style', 'display: flex;');
    expect(root.children).to.have.length(2);
    expect(root.children[0]).to.have.text('conversations');
    expect(root.children[1]).to.have.text('thread');
  });

  it('defaults a single unmarked child to the thread pane', () => {
    render(
      <ChatLayout data-testid="layout-root">
        <div data-testid="single-child">thread</div>
      </ChatLayout>,
    );

    const root = screen.getByTestId('layout-root');

    expect(root.children).to.have.length(1);
    expect(root.children[0]).to.have.text('thread');
  });

  it('uses pane markers to support a single conversation child', () => {
    render(
      <ChatLayout data-testid="layout-root">
        <MockConversationRoot />
      </ChatLayout>,
    );

    const root = screen.getByTestId('layout-root');

    expect(root.children).to.have.length(1);
    expect(root.children[0]).to.have.text('conversation');
  });

  it('uses pane markers to place reversed children into the correct panes', () => {
    render(
      <ChatLayout data-testid="layout-root">
        <MockThreadRoot />
        <MockConversationRoot />
      </ChatLayout>,
    );

    const root = screen.getByTestId('layout-root');

    expect(root.children).to.have.length(2);
    expect(root.children[0]).to.have.text('conversation');
    expect(root.children[1]).to.have.text('thread');
  });

  it('supports replacing the pane slots', () => {
    render(
      <ChatLayout
        data-testid="layout-root"
        slots={{
          conversationsPane: 'aside',
          threadPane: 'main',
        }}
        slotProps={{
          conversationsPane: { id: 'conversations-pane' },
          threadPane: { id: 'thread-pane' },
        }}
      >
        <div>conversations</div>
        <div>thread</div>
      </ChatLayout>,
    );

    expect(screen.getByText('conversations').parentElement?.tagName).toBe('ASIDE');
    expect(screen.getByText('conversations').parentElement).to.have.attribute(
      'id',
      'conversations-pane',
    );
    expect(screen.getByText('thread').parentElement?.tagName).toBe('MAIN');
    expect(screen.getByText('thread').parentElement).to.have.attribute('id', 'thread-pane');
  });
});
