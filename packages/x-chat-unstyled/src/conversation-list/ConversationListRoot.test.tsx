import * as React from 'react';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { useChat } from '@mui/x-chat-headless';
import { ChatLayout } from '../chat/ChatLayout';
import { ChatRoot } from '../chat/ChatRoot';
import type { ConversationListItemAvatarProps } from './ConversationListItemAvatar';
import type { ConversationListItemProps } from './ConversationListItem';
import type { ConversationListPreviewProps } from './ConversationListPreview';
import type { ConversationListTitleProps } from './ConversationListTitle';
import { ConversationListRoot } from './ConversationListRoot';

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

function ActiveConversationIndicator() {
  const { activeConversationId } = useChat();

  return <div data-testid="active-conversation-id">{activeConversationId ?? 'none'}</div>;
}

function ToggleableConversationList() {
  const [open, setOpen] = React.useState(true);

  return (
    <React.Fragment>
      <button onClick={() => setOpen((value) => !value)} type="button">
        toggle
      </button>
      {open ? <ConversationListRoot /> : null}
    </React.Fragment>
  );
}

const CustomItem = React.forwardRef(function CustomItem(
  props: ConversationListItemProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    conversation,
    focused,
    ownerState,
    selected,
    slotProps,
    slots,
    unread,
    ...other
  } = props as ConversationListItemProps & {
    ownerState?: {
      selected: boolean;
      unread: boolean;
    };
  };
  void focused;
  void selected;
  void slotProps;
  void slots;
  void unread;

  return (
    <div
      data-selected={String(ownerState?.selected)}
      data-testid={`custom-item-${conversation.id}`}
      data-unread={String(ownerState?.unread)}
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

function CustomTitle(props: ConversationListTitleProps) {
  const { conversation, focused, ownerState, selected, slotProps, slots, unread, ...other } =
    props as ConversationListTitleProps & {
      ownerState?: {
        selected: boolean;
      };
    };
  void focused;
  void selected;
  void slotProps;
  void slots;
  void unread;

  return (
    <div
      data-selected={String(ownerState?.selected)}
      data-testid={`custom-title-${conversation.id}`}
      {...other}
    >
      {conversation.title}
    </div>
  );
}

function CustomPreview(props: ConversationListPreviewProps) {
  const { conversation, focused, ownerState, selected, slotProps, slots, unread, ...other } =
    props as ConversationListPreviewProps & {
      ownerState?: {
        unread: boolean;
      };
    };
  void focused;
  void selected;
  void slotProps;
  void slots;
  void unread;

  return (
    <div
      data-testid={`custom-preview-${conversation.id}`}
      data-unread={String(ownerState?.unread)}
      {...other}
    >
      {conversation.subtitle}
    </div>
  );
}

function CustomItemAvatar(props: ConversationListItemAvatarProps) {
  const { conversation, focused, ownerState, selected, slotProps, slots, unread, ...other } =
    props as ConversationListItemAvatarProps & {
      ownerState?: {
        unread: boolean;
      };
    };
  void focused;
  void selected;
  void slotProps;
  void slots;
  void unread;

  return (
    <div
      data-testid={`custom-avatar-${conversation.id}`}
      data-unread={String(ownerState?.unread)}
      {...other}
    >
      {conversation.participants?.[0]?.displayName ?? 'none'}
    </div>
  );
}

describe('ConversationListRoot', () => {
  it('renders conversations from chat state and marks the active one as selected', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialActiveConversationId="c2"
        initialConversations={[
          { id: 'c1', subtitle: 'First preview', title: 'First conversation' },
          { id: 'c2', subtitle: 'Second preview', title: 'Second conversation', unreadCount: 2 },
        ]}
      >
        <ConversationListRoot />
      </ChatRoot>,
    );

    const listbox = screen.getByRole('listbox');
    const options = screen.getAllByRole('option');

    expect(listbox).toBeVisible();
    expect(options).to.have.length(2);
    expect(options[0]).to.contain.text('First conversation');
    expect(options[0]).to.contain.text('First preview');
    expect(options[1]).to.have.attribute('aria-selected', 'true');
    expect(options[1]).to.have.attribute('tabindex', '0');
    expect(options[1]).to.contain.text('Second conversation');
    expect(options[1]).to.contain.text('Second preview');
    expect(options[1]).to.contain.text('2');
  });

  it('updates the active conversation when an item is clicked', async () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialConversations={[
          { id: 'c1', title: 'First conversation' },
          { id: 'c2', title: 'Second conversation' },
        ]}
      >
        <ActiveConversationIndicator />
        <ConversationListRoot />
      </ChatRoot>,
    );

    fireEvent.click(screen.getByRole('option', { name: /second conversation/i }));

    await waitFor(() => {
      expect(screen.getByTestId('active-conversation-id')).to.have.text('c2');
    });
  });

  it('supports roving focus with arrow keys and selects on Enter', async () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialActiveConversationId="c2"
        initialConversations={[
          { id: 'c1', title: 'First conversation' },
          { id: 'c2', title: 'Second conversation' },
          { id: 'c3', title: 'Third conversation' },
        ]}
      >
        <ActiveConversationIndicator />
        <ConversationListRoot />
      </ChatRoot>,
    );

    let options = screen.getAllByRole('option');
    act(() => {
      (options[1] as HTMLElement).focus();
    });
    fireEvent.keyDown(options[1], { key: 'ArrowDown' });

    options = screen.getAllByRole('option');
    expect(document.activeElement).toBe(options[2]);
    expect(options[2]).to.have.attribute('tabindex', '0');
    expect(options[2]).to.have.attribute('aria-selected', 'false');

    fireEvent.keyDown(options[2], { key: 'Home' });
    options = screen.getAllByRole('option');
    expect(document.activeElement).toBe(options[0]);
    expect(options[0]).to.have.attribute('tabindex', '0');

    fireEvent.keyDown(options[0], { key: 'End' });
    options = screen.getAllByRole('option');
    expect(document.activeElement).toBe(options[2]);

    fireEvent.keyDown(options[2], { key: 'Enter' });

    await waitFor(() => {
      expect(screen.getByTestId('active-conversation-id')).to.have.text('c3');
    });
  });

  it('restores focus to the last focused item when the list remounts', async () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialConversations={[
          { id: 'c1', title: 'First conversation' },
          { id: 'c2', title: 'Second conversation' },
        ]}
      >
        <ToggleableConversationList />
      </ChatRoot>,
    );

    let options = screen.getAllByRole('option');
    act(() => {
      (options[1] as HTMLElement).focus();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(options[1]);
    });

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.queryByRole('listbox')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));

    await waitFor(() => {
      options = screen.getAllByRole('option');
      expect(document.activeElement).toBe(options[1]);
    });
  });

  it('supports replacing the root and row slots and passes ownerState-derived flags', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialActiveConversationId="c2"
        initialConversations={[
          { id: 'c1', title: 'First conversation' },
          { id: 'c2', readState: 'unread', title: 'Second conversation' },
        ]}
      >
        <ConversationListRoot
          data-testid="conversation-list"
          slotProps={{
            root: { id: 'custom-root' },
          }}
          slots={{
            item: CustomItem,
            itemAvatar: CustomItemAvatar,
            preview: CustomPreview,
            title: CustomTitle,
            root: 'section',
          }}
        />
      </ChatRoot>,
    );

    const root = screen.getByTestId('conversation-list');

    expect(root.tagName).toBe('SECTION');
    expect(root).to.have.attribute('id', 'custom-root');
    expect(screen.getByTestId('custom-item-c1')).to.have.attribute('data-selected', 'false');
    expect(screen.getByTestId('custom-item-c2')).to.have.attribute('data-selected', 'true');
    expect(screen.getByTestId('custom-item-c2')).to.have.attribute('data-unread', 'true');
    expect(screen.getByTestId('custom-title-c2')).to.have.attribute('data-selected', 'true');
    expect(screen.getByTestId('custom-preview-c2')).to.have.attribute('data-unread', 'true');
    expect(screen.getByTestId('custom-avatar-c2')).to.have.attribute('data-unread', 'true');
  });

  it('renders an empty listbox when there are no conversations', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialConversations={[]}>
        <ConversationListRoot />
      </ChatRoot>,
    );

    expect(screen.getByRole('listbox')).toBeVisible();
    expect(screen.queryAllByRole('option')).to.have.length(0);
  });

  it('is recognized by ChatLayout as the conversations pane', () => {
    // The test mixes a marked ConversationListRoot with an unmarked <div>,
    // which triggers a development warning about ambiguous pane assignment.
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialConversations={[{ id: 'c1', title: 'First conversation' }]}
      >
        <ChatLayout data-testid="layout-root">
          <div data-testid="thread-pane">thread</div>
          <ConversationListRoot data-testid="conversation-list" />
        </ChatLayout>
      </ChatRoot>,
    );

    const root = screen.getByTestId('layout-root');

    expect(root.children).to.have.length(2);
    expect(root.children[0]).to.contain(screen.getByTestId('conversation-list'));
    expect(root.children[1]).to.contain(screen.getByTestId('thread-pane'));

    warnSpy.mockRestore();
  });
});
