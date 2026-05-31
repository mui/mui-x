import * as React from 'react';
import { createRenderer, screen, fireEvent, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';
import { CopilotChatPanel } from './CopilotChatPanel';
import { copilotPanelClasses } from './copilotPanelClasses';
import type { HistoryCapableChatAdapter } from './CopilotChatPanel.types';

const CONVERSATIONS: ChatConversation[] = [
  { id: 'c-1', title: 'Existing conversation', lastMessageAt: new Date().toISOString() },
];

const MESSAGES: ChatMessage[] = [
  { id: 'u1', role: 'user', status: 'sent', parts: [{ type: 'text', text: 'Hello there' }] },
  { id: 'a1', role: 'assistant', status: 'sent', parts: [{ type: 'text', text: 'Hi!' }] },
];

// Map-backed history adapter, seeded with one conversation + a couple of
// messages so the thread, message, and history nodes all render.
function createAdapter(): HistoryCapableChatAdapter {
  return {
    async listConversations() {
      return { conversations: CONVERSATIONS };
    },
    async listMessages() {
      return { messages: MESSAGES };
    },
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
  };
}

describe('<CopilotChatPanel /> styleability', () => {
  const { render } = createRenderer();

  it('forwards `className` to the root element', async () => {
    render(<CopilotChatPanel adapter={createAdapter()} className="host-root" />);

    await waitFor(() => {
      expect(screen.getByText('Copilot')).not.to.equal(null);
    });

    const root = document.querySelector(`.${copilotPanelClasses.root}`);
    expect(root).not.to.equal(null);
    expect(root!.classList.contains('host-root')).to.equal(true);
  });

  it('honors the `classes` prop on the thread-view chrome (root/header/title/beta/body/footer/thread/composer)', async () => {
    render(
      <CopilotChatPanel
        adapter={createAdapter()}
        classes={{
          root: 'x-root',
          header: 'x-header',
          title: 'x-title',
          beta: 'x-beta',
          body: 'x-body',
          footer: 'x-footer',
          thread: 'x-thread',
          composer: 'x-composer',
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Copilot')).not.to.equal(null);
    });

    expect(document.querySelector('.x-root')).not.to.equal(null);
    expect(document.querySelector('.x-header')).not.to.equal(null);
    expect(document.querySelector('.x-title')).not.to.equal(null);
    expect(document.querySelector('.x-beta')).not.to.equal(null);
    expect(document.querySelector('.x-body')).not.to.equal(null);
    expect(document.querySelector('.x-footer')).not.to.equal(null);
    expect(document.querySelector('.x-thread')).not.to.equal(null);
    expect(document.querySelector('.x-composer')).not.to.equal(null);

    // The host override is composed with (not replacing) the public class hook.
    const title = document.querySelector('.x-title')!;
    expect(title.classList.contains(copilotPanelClasses.title)).to.equal(true);
  });

  it('honors the `classes.message` override on rendered messages', async () => {
    render(<CopilotChatPanel adapter={createAdapter()} classes={{ message: 'x-message' }} />);

    // The panel opens on the empty thread; open the history and select the
    // seeded conversation so its messages hydrate into the thread.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Open menu' })).not.to.equal(null);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    await waitFor(() => {
      expect(screen.getByText('Existing conversation')).not.to.equal(null);
    });
    fireEvent.click(screen.getByText('Existing conversation'));

    await waitFor(() => {
      expect(document.querySelector('.x-message')).not.to.equal(null);
    });
  });

  it('honors the `classes.history` / `classes.header` overrides in the history view', async () => {
    render(
      <CopilotChatPanel
        adapter={createAdapter()}
        classes={{ history: 'x-history', header: 'x-history-header' }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Open menu' })).not.to.equal(null);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));

    await waitFor(() => {
      expect(screen.getByText('History')).not.to.equal(null);
    });

    expect(document.querySelector('.x-history')).not.to.equal(null);
    expect(document.querySelector('.x-history-header')).not.to.equal(null);
  });
});
