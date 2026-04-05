import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '../adapters/chatAdapter';
import type { ChatMessage } from '../types/chat-entities';
import { ChatRoot } from '../chat/ChatRoot';
import type { MessageGroupProps } from './MessageGroup';
import { MessageGroup, createTimeWindowGroupKey } from './MessageGroup';

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
  options: {
    role?: ChatMessage['role'];
    authorId?: string;
    displayName?: string;
    avatarUrl?: string;
    createdAt?: string;
    text?: string;
  } = {},
): ChatMessage {
  const { role = 'assistant', authorId, displayName, avatarUrl, createdAt, text = id } = options;

  return {
    id,
    role,
    createdAt,
    author:
      authorId || displayName || avatarUrl
        ? {
            id: authorId ?? '',
            displayName,
            avatarUrl,
          }
        : undefined,
    parts: [{ type: 'text', text }],
  };
}

const CustomRoot = React.forwardRef(function CustomRoot(
  props: MessageGroupProps & {
    ownerState?: {
      isFirst: boolean;
      isLast: boolean;
      authorRole?: string;
      authorId?: string;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    children,
    groupKey,
    index,
    items,
    messageId,
    ownerState,
    slotProps,
    slots,
    ...other
  } = props;
  void groupKey;
  void index;
  void items;
  void slotProps;
  void slots;

  return (
    <section
      data-author-id={ownerState?.authorId ?? 'none'}
      data-author-role={ownerState?.authorRole ?? 'none'}
      data-first={String(ownerState?.isFirst)}
      data-last={String(ownerState?.isLast)}
      data-testid={`message-group-root-${messageId}`}
      ref={ref}
      {...other}
    >
      {children}
    </section>
  );
});

function CustomAuthorName(
  props: React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: {
      isFirst: boolean;
    };
  },
) {
  const { children, ownerState, ...other } = props;

  return (
    <div data-first={String(ownerState?.isFirst)} data-testid="custom-author-name" {...other}>
      {children}
    </div>
  );
}

describe('MessageGroup', () => {
  it('groups all messages from the same author by default, regardless of time', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          createMessage('m1', {
            authorId: 'assistant-1',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: '2026-03-15T10:00:00.000Z',
            displayName: 'Assistant',
            text: 'First message',
          }),
          createMessage('m2', {
            authorId: 'assistant-1',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: '2026-03-15T10:03:00.000Z',
            displayName: 'Assistant',
            text: 'Follow-up message',
          }),
          createMessage('m3', {
            authorId: 'assistant-1',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: '2026-03-15T10:11:00.000Z',
            displayName: 'Assistant',
            text: 'Later message — still same group by default',
          }),
        ]}
      >
        <MessageGroup messageId="m1" />
        <MessageGroup messageId="m2" />
        <MessageGroup messageId="m3" />
      </ChatRoot>,
    );

    // All three messages are from the same author — default groupKey groups them all together.
    // Only the first message in the group shows the author name and avatar.
    expect(screen.getAllByText('Assistant')).to.have.length(1);
    expect(screen.getAllByRole('img')).to.have.length(1);
    expect(screen.getByText('First message')).not.to.equal(null);
    expect(screen.getByText('Follow-up message')).not.to.equal(null);
    expect(screen.getByText('Later message — still same group by default')).not.to.equal(null);
  });

  it('splits groups at time boundaries when using createTimeWindowGroupKey', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          createMessage('m1', {
            authorId: 'assistant-1',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: '2026-03-15T10:00:00.000Z',
            displayName: 'Assistant',
            text: 'First message',
          }),
          createMessage('m2', {
            authorId: 'assistant-1',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: '2026-03-15T10:03:00.000Z',
            displayName: 'Assistant',
            text: 'Follow-up message (3 min later, same group)',
          }),
          createMessage('m3', {
            authorId: 'assistant-1',
            avatarUrl: 'https://example.com/avatar.png',
            createdAt: '2026-03-15T10:11:00.000Z',
            displayName: 'Assistant',
            text: 'New group message (11 min later, new group)',
          }),
        ]}
      >
        <MessageGroup groupKey={createTimeWindowGroupKey()} messageId="m1" />
        <MessageGroup groupKey={createTimeWindowGroupKey()} messageId="m2" />
        <MessageGroup groupKey={createTimeWindowGroupKey()} messageId="m3" />
      </ChatRoot>,
    );

    // m1 and m2 are within the default 5-minute window → one group.
    // m3 is 11 minutes after m1 → new group. So 2 author names and 2 avatars.
    expect(screen.getAllByText('Assistant')).to.have.length(2);
    expect(screen.getAllByRole('img')).to.have.length(2);
  });

  it('falls back to role-based grouping when author ids are absent and supports custom children', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          createMessage('m1', {
            createdAt: '2026-03-15T10:00:00.000Z',
            role: 'assistant',
          }),
          createMessage('m2', {
            createdAt: '2026-03-15T10:01:00.000Z',
            role: 'assistant',
          }),
        ]}
      >
        <MessageGroup messageId="m1" />
        <MessageGroup data-testid="group-root-m2" messageId="m2" slots={{ group: CustomRoot }}>
          <div data-testid="custom-group-child">Custom child</div>
        </MessageGroup>
      </ChatRoot>,
    );

    expect(screen.getByTestId('group-root-m2')).to.have.attribute('data-first', 'false');
    expect(screen.getByTestId('group-root-m2')).to.have.attribute('data-author-role', 'assistant');
    expect(screen.getByTestId('custom-group-child')).to.have.text('Custom child');
  });

  it('respects custom item order, groupKey, and slot ownerState', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          createMessage('m1', {
            authorId: 'assistant-1',
            createdAt: '2026-03-15T10:00:00.000Z',
            displayName: 'Assistant',
          }),
          createMessage('m2', {
            authorId: 'assistant-1',
            createdAt: '2026-03-15T10:04:00.000Z',
            displayName: 'Assistant',
          }),
        ]}
      >
        <MessageGroup
          data-testid="group-root-m2"
          items={['m2', 'm1']}
          messageId="m2"
          slots={{ authorName: CustomAuthorName, group: CustomRoot }}
        />
        <MessageGroup
          data-testid="group-root-m1"
          groupKey={createTimeWindowGroupKey(60_000)}
          items={['m2', 'm1']}
          messageId="m1"
          slots={{ group: CustomRoot }}
        />
      </ChatRoot>,
    );

    // m2 is first in items — isFirst=true
    expect(screen.getByTestId('group-root-m2')).to.have.attribute('data-first', 'true');
    expect(screen.getByTestId('custom-author-name')).to.have.attribute('data-first', 'true');
    // m1 is 4 min after m2, outside the 1-minute window — isFirst=true
    expect(screen.getByTestId('group-root-m1')).to.have.attribute('data-first', 'true');
  });
});
