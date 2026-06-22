import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '../adapters/chatAdapter';
import type { ChatConversation } from '../types/chat-entities';
import { ChatRoot } from '../chat/ChatRoot';
import { ConversationListItem } from './ConversationListItem';
import { ConversationListItemAvatar } from './ConversationListItemAvatar';
import { ConversationListPreview } from './ConversationListPreview';
import { ConversationListTimestamp } from './ConversationListTimestamp';
import { ConversationListTitle } from './ConversationListTitle';
import { ConversationListUnreadBadge } from './ConversationListUnreadBadge';

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

const basicConversation: ChatConversation = {
  id: 'c1',
  title: 'First Conversation',
  subtitle: 'A preview text',
  lastMessageAt: '2026-03-14T10:00:00.000Z',
  unreadCount: 5,
  participants: [
    {
      id: 'u1',
      displayName: 'Alice',
      avatarUrl: 'https://example.com/alice.png',
    },
  ],
};

const minimalConversation: ChatConversation = {
  id: 'c2',
};

function Wrapper({ children }: React.PropsWithChildren) {
  return <ChatRoot adapter={createAdapter()}>{children}</ChatRoot>;
}

describe('ConversationListItem', () => {
  it('renders children with data-selected and data-unread attributes', () => {
    render(
      <Wrapper>
        <ConversationListItem
          conversation={basicConversation}
          data-testid="list-item"
          selected
          unread
        >
          <span>Item content</span>
        </ConversationListItem>
      </Wrapper>,
    );

    const item = screen.getByTestId('list-item');

    expect(item).to.have.attribute('data-selected', 'true');
    expect(item).to.have.attribute('data-unread', 'true');
    expect(screen.getByText('Item content')).not.to.equal(null);
  });

  it('does not render data-selected when not selected', () => {
    render(
      <Wrapper>
        <ConversationListItem conversation={basicConversation} data-testid="list-item">
          <span>Content</span>
        </ConversationListItem>
      </Wrapper>,
    );

    const item = screen.getByTestId('list-item');

    expect(item.hasAttribute('data-selected')).to.equal(false);
    expect(item.hasAttribute('data-unread')).to.equal(false);
  });

  it('supports custom slot with ownerState', () => {
    function CustomRoot(
      props: React.HTMLAttributes<HTMLDivElement> & {
        ownerState?: { selected: boolean; unread: boolean };
      },
    ) {
      const { ownerState, ...other } = props;

      return (
        <div
          data-custom-selected={String(ownerState?.selected)}
          data-testid="custom-item"
          {...other}
        />
      );
    }

    render(
      <Wrapper>
        <ConversationListItem
          conversation={basicConversation}
          selected
          slots={{ root: CustomRoot }}
        >
          Child
        </ConversationListItem>
      </Wrapper>,
    );

    expect(screen.getByTestId('custom-item')).to.have.attribute('data-custom-selected', 'true');
  });
});

describe('ConversationListTitle', () => {
  it('renders conversation.title', () => {
    render(
      <Wrapper>
        <ConversationListTitle conversation={basicConversation} data-testid="title" />
      </Wrapper>,
    );

    expect(screen.getByTestId('title')).to.have.text('First Conversation');
  });

  it('falls back to conversation.id when no title', () => {
    render(
      <Wrapper>
        <ConversationListTitle conversation={minimalConversation} data-testid="title" />
      </Wrapper>,
    );

    expect(screen.getByTestId('title')).to.have.text('c2');
  });
});

describe('ConversationListPreview', () => {
  it('renders conversation.subtitle', () => {
    render(
      <Wrapper>
        <ConversationListPreview conversation={basicConversation} data-testid="preview" />
      </Wrapper>,
    );

    expect(screen.getByTestId('preview')).to.have.text('A preview text');
  });

  it('returns null when no subtitle', () => {
    render(
      <Wrapper>
        <ConversationListPreview conversation={minimalConversation} data-testid="preview" />
      </Wrapper>,
    );

    expect(screen.queryByTestId('preview')).to.equal(null);
  });
});

describe('ConversationListTimestamp', () => {
  it('renders formatted timestamp', () => {
    render(
      <Wrapper>
        <ConversationListTimestamp conversation={basicConversation} data-testid="timestamp" />
      </Wrapper>,
    );

    const el = screen.getByTestId('timestamp');
    const timeEl = el.querySelector('time');

    expect(timeEl).not.to.equal(null);
    expect(timeEl!.getAttribute('dateTime')).to.equal('2026-03-14T10:00:00.000Z');
  });

  it('returns null when no lastMessageAt', () => {
    render(
      <Wrapper>
        <ConversationListTimestamp conversation={minimalConversation} data-testid="timestamp" />
      </Wrapper>,
    );

    expect(screen.queryByTestId('timestamp')).to.equal(null);
  });
});

describe('ConversationListUnreadBadge', () => {
  it('renders unread count', () => {
    render(
      <Wrapper>
        <ConversationListUnreadBadge conversation={basicConversation} data-testid="badge" />
      </Wrapper>,
    );

    expect(screen.getByTestId('badge')).to.have.text('5');
  });

  it('renders 99+ for counts over 99', () => {
    render(
      <Wrapper>
        <ConversationListUnreadBadge
          conversation={{ ...basicConversation, unreadCount: 150 }}
          data-testid="badge"
        />
      </Wrapper>,
    );

    expect(screen.getByTestId('badge')).to.have.text('99+');
  });

  it('returns null when count is 0', () => {
    render(
      <Wrapper>
        <ConversationListUnreadBadge
          conversation={{ ...basicConversation, unreadCount: 0 }}
          data-testid="badge"
        />
      </Wrapper>,
    );

    expect(screen.queryByTestId('badge')).to.equal(null);
  });

  it('returns null when unreadCount is not set', () => {
    render(
      <Wrapper>
        <ConversationListUnreadBadge conversation={minimalConversation} data-testid="badge" />
      </Wrapper>,
    );

    expect(screen.queryByTestId('badge')).to.equal(null);
  });
});

describe('ConversationListItemAvatar', () => {
  it('renders avatar image when participant has avatarUrl', () => {
    render(
      <Wrapper>
        <ConversationListItemAvatar conversation={basicConversation} data-testid="avatar" />
      </Wrapper>,
    );

    const img = screen.getByAltText('Alice');

    expect(img).not.to.equal(null);
    expect(img).to.have.attribute('src', 'https://example.com/alice.png');
  });

  it('renders empty root when no participant avatarUrl', () => {
    render(
      <Wrapper>
        <ConversationListItemAvatar conversation={minimalConversation} data-testid="avatar" />
      </Wrapper>,
    );

    expect(screen.getByTestId('avatar')).not.to.equal(null);
    expect(screen.queryByRole('img')).to.equal(null);
  });

  it('renders empty root when participant has no avatarUrl', () => {
    const conv: ChatConversation = {
      id: 'c3',
      participants: [{ id: 'u1', displayName: 'Bob' }],
    };

    render(
      <Wrapper>
        <ConversationListItemAvatar conversation={conv} data-testid="avatar" />
      </Wrapper>,
    );

    expect(screen.getByTestId('avatar')).not.to.equal(null);
    expect(screen.queryByRole('img')).to.equal(null);
  });
});
