import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatRoot } from '../chat/ChatRoot';
import type { MessageListDateDividerProps } from './MessageListDateDivider';
import { MessageListDateDivider } from './MessageListDateDivider';

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

function createMessage(id: string, createdAt?: string): ChatMessage {
  return {
    id,
    role: 'assistant',
    createdAt,
    parts: [{ type: 'text', text: id }],
  };
}

const CustomRoot = React.forwardRef(function CustomRoot(
  props: MessageListDateDividerProps & {
    ownerState?: {
      hasBoundary: boolean;
      messageId: string;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { formatDate, index, items, messageId, ownerState, slotProps, slots, ...other } = props;
  void formatDate;
  void index;
  void items;
  void slotProps;
  void slots;

  return (
    <section
      data-boundary={String(ownerState?.hasBoundary)}
      data-message-id={ownerState?.messageId ?? 'none'}
      data-testid="custom-date-divider-root"
      ref={ref}
      {...other}
    />
  );
});

function CustomLabel(
  props: React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: {
      hasBoundary: boolean;
    };
  },
) {
  const { children, ownerState, ...other } = props;

  return (
    <div
      data-boundary={String(ownerState?.hasBoundary)}
      data-testid="custom-date-divider-label"
      {...other}
    >
      {children}
    </div>
  );
}

function CustomLine(
  props: React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: {
      hasBoundary: boolean;
    };
  },
) {
  const { ownerState, ...other } = props;

  return (
    <div
      data-boundary={String(ownerState?.hasBoundary)}
      data-testid="custom-date-divider-line"
      {...other}
    />
  );
}

describe('MessageListDateDivider', () => {
  it('renders only on calendar day boundaries with the default locale-formatted label', () => {
    const { rerender } = render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          createMessage('m1', '2026-03-15T09:00:00.000Z'),
          createMessage('m2', '2026-03-15T10:00:00.000Z'),
          createMessage('m3', '2026-03-16T08:00:00.000Z'),
        ]}
      >
        <MessageListDateDivider messageId="m1" />
      </ChatRoot>,
    );

    expect(screen.queryByRole('separator')).to.equal(null);

    rerender(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          createMessage('m1', '2026-03-15T09:00:00.000Z'),
          createMessage('m2', '2026-03-15T10:00:00.000Z'),
          createMessage('m3', '2026-03-16T08:00:00.000Z'),
        ]}
      >
        <MessageListDateDivider messageId="m2" />
      </ChatRoot>,
    );

    expect(screen.queryByRole('separator')).to.equal(null);

    rerender(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          createMessage('m1', '2026-03-15T09:00:00.000Z'),
          createMessage('m2', '2026-03-15T10:00:00.000Z'),
          createMessage('m3', '2026-03-16T08:00:00.000Z'),
        ]}
      >
        <MessageListDateDivider messageId="m3" />
      </ChatRoot>,
    );

    expect(screen.getByRole('separator')).not.to.equal(null);
    expect(screen.getByText('March 16, 2026')).not.to.equal(null);
  });

  it('supports formatDate and custom slots with ownerState', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          createMessage('m1', '2026-03-15T09:00:00.000Z'),
          createMessage('m2', '2026-03-16T08:00:00.000Z'),
        ]}
      >
        <MessageListDateDivider
          formatDate={(date) => `Day ${date.toISOString().slice(8, 10)}`}
          messageId="m2"
          slots={{ divider: CustomRoot, label: CustomLabel, line: CustomLine }}
        />
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-date-divider-root')).to.have.attribute(
      'data-boundary',
      'true',
    );
    expect(screen.getByTestId('custom-date-divider-root')).to.have.attribute('role', 'separator');
    expect(screen.getAllByTestId('custom-date-divider-line')).to.have.length(2);
    expect(screen.getByTestId('custom-date-divider-label')).to.have.attribute(
      'data-boundary',
      'true',
    );
    expect(screen.getByTestId('custom-date-divider-label')).to.have.text('Day 16');
  });

  it('respects custom item order when determining boundaries', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          createMessage('m1', '2026-03-15T09:00:00.000Z'),
          createMessage('m2', '2026-03-16T08:00:00.000Z'),
        ]}
      >
        <MessageListDateDivider items={['m2', 'm1']} messageId="m1" />
      </ChatRoot>,
    );

    expect(screen.getByRole('separator')).not.to.equal(null);
    expect(screen.getByText('March 15, 2026')).not.to.equal(null);
  });
});
