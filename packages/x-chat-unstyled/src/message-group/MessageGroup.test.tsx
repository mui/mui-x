import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatRoot } from '../chat/ChatRoot';
import type { MessageGroupProps } from './MessageGroup';
import { MessageGroup } from './MessageGroup';

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
    groupingWindowMs,
    index,
    items,
    messageId,
    ownerState,
    slotProps,
    slots,
    ...other
  } = props;
  void groupingWindowMs;
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
  it('groups adjacent messages by author and time and shows avatars for all messages in default variant', () => {
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
            text: 'New group message',
          }),
        ]}
      >
        <MessageGroup messageId="m1" />
        <MessageGroup messageId="m2" />
        <MessageGroup messageId="m3" />
      </ChatRoot>,
    );

    // Author name only shows on first message of each group (m1 and m3)
    expect(screen.getAllByText('Assistant')).to.have.length(2);
    // In default variant, avatars are shown for all messages including grouped ones
    expect(screen.getAllByRole('img')).to.have.length(3);
    expect(screen.getByText('First message')).not.to.equal(null);
    expect(screen.getByText('Follow-up message')).not.to.equal(null);
    expect(screen.getByText('New group message')).not.to.equal(null);
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

  it('respects custom item order, grouping windows, and slot ownerState', () => {
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
          groupingWindowMs={60_000}
          items={['m2', 'm1']}
          messageId="m1"
          slots={{ group: CustomRoot }}
        />
      </ChatRoot>,
    );

    expect(screen.getByTestId('group-root-m2')).to.have.attribute('data-first', 'true');
    expect(screen.getByTestId('custom-author-name')).to.have.attribute('data-first', 'true');
    expect(screen.getByTestId('group-root-m1')).to.have.attribute('data-first', 'true');
  });
});
