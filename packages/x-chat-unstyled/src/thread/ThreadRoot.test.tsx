import * as React from 'react';
import { createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { useChat } from '@mui/x-chat-headless';
import { ChatLayout } from '../chat/ChatLayout';
import { ChatRoot } from '../chat/ChatRoot';
import { ConversationListRoot } from '../conversation-list/ConversationListRoot';
import type { ThreadActionsProps } from './ThreadActions';
import type { ThreadHeaderProps } from './ThreadHeader';
import { ThreadRoot } from './ThreadRoot';
import type { ThreadRootProps } from './ThreadRoot';
import type { ThreadSubtitleProps } from './ThreadSubtitle';
import { ThreadSubtitle } from './ThreadSubtitle';
import type { ThreadTitleProps } from './ThreadTitle';
import { ThreadActions } from './ThreadActions';
import { ThreadHeader } from './ThreadHeader';
import { ThreadTitle } from './ThreadTitle';

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

function ActiveConversationSwitcher() {
  const { setActiveConversation } = useChat();

  return (
    <React.Fragment>
      <button onClick={() => void setActiveConversation('c1')} type="button">
        switch to c1
      </button>
      <button onClick={() => void setActiveConversation('c2')} type="button">
        switch to c2
      </button>
      <button onClick={() => void setActiveConversation(undefined)} type="button">
        clear
      </button>
    </React.Fragment>
  );
}

const CustomRoot = React.forwardRef(function CustomRoot(
  props: ThreadRootProps & {
    ownerState?: {
      conversationId?: string;
      hasConversation: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <section
      data-conversation-id={ownerState?.conversationId ?? 'none'}
      data-has-conversation={String(ownerState?.hasConversation)}
      data-testid="custom-thread-root"
      ref={ref}
      {...other}
    >
      {children}
    </section>
  );
});

const CustomHeader = React.forwardRef(function CustomHeader(
  props: ThreadHeaderProps & {
    ownerState?: {
      hasConversation: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <header
      data-has-conversation={String(ownerState?.hasConversation)}
      data-testid="custom-thread-header"
      ref={ref}
      {...other}
    >
      {children}
    </header>
  );
});

function CustomTitle(props: ThreadTitleProps & { ownerState?: { conversationId?: string } }) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <div
      data-conversation-id={ownerState?.conversationId ?? 'none'}
      data-testid="custom-thread-title"
      {...other}
    >
      {children}
    </div>
  );
}

function CustomSubtitle(
  props: ThreadSubtitleProps & { ownerState?: { hasConversation: boolean } },
) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <div
      data-has-conversation={String(ownerState?.hasConversation)}
      data-testid="custom-thread-subtitle"
      {...other}
    >
      {children}
    </div>
  );
}

const CustomActions = React.forwardRef(function CustomActions(
  props: ThreadActionsProps & {
    ownerState?: {
      hasConversation: boolean;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <div
      data-has-conversation={String(ownerState?.hasConversation)}
      data-testid="custom-thread-actions"
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

describe('ThreadRoot', () => {
  it('renders the active conversation title and subtitle and updates when the active conversation changes', async () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        defaultActiveConversationId="c1"
        defaultConversations={[
          { id: 'c1', subtitle: 'Alpha subtitle', title: 'Alpha conversation' },
          { id: 'c2', subtitle: 'Beta subtitle', title: 'Beta conversation' },
        ]}
      >
        <ActiveConversationSwitcher />
        <ThreadRoot>
          <ThreadHeader>
            <ThreadTitle data-testid="thread-title" />
            <ThreadSubtitle data-testid="thread-subtitle" />
          </ThreadHeader>
        </ThreadRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('thread-title')).to.have.text('Alpha conversation');
    expect(screen.getByTestId('thread-subtitle')).to.have.text('Alpha subtitle');

    fireEvent.click(screen.getByRole('button', { name: 'switch to c2' }));

    await waitFor(() => {
      expect(screen.getByTestId('thread-title')).to.have.text('Beta conversation');
      expect(screen.getByTestId('thread-subtitle')).to.have.text('Beta subtitle');
    });
  });

  it('supports replacing the root and child slots and passes ownerState to custom components', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        defaultActiveConversationId="c2"
        defaultConversations={[
          { id: 'c1', title: 'Alpha conversation' },
          { id: 'c2', subtitle: 'Beta subtitle', title: 'Beta conversation' },
        ]}
      >
        <ThreadRoot slots={{ root: CustomRoot }}>
          <ThreadHeader slots={{ header: CustomHeader }}>
            <ThreadTitle slots={{ title: CustomTitle }} />
            <ThreadSubtitle slots={{ subtitle: CustomSubtitle }} />
          </ThreadHeader>
          <ThreadActions slots={{ actions: CustomActions }}>
            <button type="button">Reply</button>
          </ThreadActions>
        </ThreadRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-thread-root')).to.have.attribute(
      'data-conversation-id',
      'c2',
    );
    expect(screen.getByTestId('custom-thread-root')).to.have.attribute(
      'data-has-conversation',
      'true',
    );
    expect(screen.getByTestId('custom-thread-header')).to.have.attribute(
      'data-has-conversation',
      'true',
    );
    expect(screen.getByTestId('custom-thread-title')).to.have.attribute(
      'data-conversation-id',
      'c2',
    );
    expect(screen.getByTestId('custom-thread-subtitle')).to.have.attribute(
      'data-has-conversation',
      'true',
    );
    expect(screen.getByTestId('custom-thread-actions')).to.have.attribute(
      'data-has-conversation',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Reply' })).toBeVisible();
  });

  it('renders empty title and subtitle output when there is no active conversation', async () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        defaultActiveConversationId="c1"
        defaultConversations={[
          { id: 'c1', subtitle: 'Alpha subtitle', title: 'Alpha conversation' },
        ]}
      >
        <ActiveConversationSwitcher />
        <ThreadRoot>
          <ThreadTitle data-testid="thread-title" />
          <ThreadSubtitle data-testid="thread-subtitle" />
        </ThreadRoot>
      </ChatRoot>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'clear' }));

    await waitFor(() => {
      expect(screen.getByTestId('thread-title')).to.have.text('');
      expect(screen.getByTestId('thread-subtitle')).to.have.text('');
    });
  });

  it('keeps subtitle empty when the active conversation has no subtitle', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        defaultActiveConversationId="c1"
        defaultConversations={[{ id: 'c1', title: 'Alpha conversation' }]}
      >
        <ThreadRoot>
          <ThreadSubtitle data-testid="thread-subtitle" />
        </ThreadRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('thread-subtitle')).to.have.text('');
  });

  it('is recognized by ChatLayout as the thread pane', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        defaultActiveConversationId="c1"
        defaultConversations={[{ id: 'c1', title: 'Alpha conversation' }]}
      >
        <ChatLayout data-testid="layout-root">
          <ThreadRoot data-testid="thread-root">
            <ThreadTitle />
          </ThreadRoot>
          <ConversationListRoot data-testid="conversation-list" />
        </ChatLayout>
      </ChatRoot>,
    );

    const root = screen.getByTestId('layout-root');

    expect(root.children).to.have.length(2);
    expect(root.children[0]).to.contain(screen.getByTestId('conversation-list'));
    expect(root.children[1]).to.contain(screen.getByTestId('thread-root'));
  });
});
