import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatRoot } from '../chat/ChatRoot';
import type { MessageActionsProps } from './MessageActions';
import { MessageActions } from './MessageActions';
import type { MessageAvatarProps } from './MessageAvatar';
import { MessageAvatar } from './MessageAvatar';
import type { MessageContentProps } from './MessageContent';
import { MessageContent } from './MessageContent';
import type { MessageMetaProps } from './MessageMeta';
import { MessageMeta } from './MessageMeta';
import type { MessageRootProps } from './MessageRoot';
import { MessageRoot } from './MessageRoot';

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

const fullMessage: ChatMessage = {
  id: 'm1',
  role: 'assistant',
  status: 'streaming',
  createdAt: '2026-03-14T10:00:00.000Z',
  editedAt: '2026-03-14T10:05:00.000Z',
  author: {
    id: 'u1',
    displayName: 'Assistant',
    avatarUrl: 'https://example.com/avatar.png',
  },
  parts: [
    {
      type: 'text',
      text: 'Hello world',
    },
    {
      type: 'reasoning',
      text: 'Internal chain',
    },
    {
      type: 'tool',
      toolInvocation: {
        toolCallId: 'tool-1',
        toolName: 'search',
        state: 'output-available',
        input: {
          query: 'weather',
        },
        output: {
          result: 'sunny',
        },
      },
    },
    {
      type: 'dynamic-tool',
      toolInvocation: {
        toolCallId: 'tool-2',
        toolName: 'dynamic-search',
        state: 'output-denied',
        approval: {
          approved: false,
          reason: 'Need approval',
        },
      },
    },
    {
      type: 'file',
      mediaType: 'image/png',
      url: 'https://example.com/image.png',
      filename: 'image.png',
    },
    {
      type: 'file',
      mediaType: 'application/pdf',
      url: 'https://example.com/spec.pdf',
      filename: 'spec.pdf',
    },
    {
      type: 'source-url',
      sourceId: 'source-1',
      url: 'https://mui.com',
      title: 'MUI',
    },
    {
      type: 'source-document',
      sourceId: 'doc-1',
      title: 'Spec',
      text: 'Document excerpt',
    },
    {
      type: 'step-start',
    },
    {
      type: 'data-weather',
      data: {
        city: 'Prague',
        temperatureC: 12,
      },
    } as any,
    {
      type: 'poll',
      question: 'Pick one',
      options: ['A', 'B'],
    } as any,
  ],
};

const minimalMessage: ChatMessage = {
  id: 'm2',
  role: 'user',
  status: 'sent',
  parts: [
    {
      type: 'text',
      text: 'Minimal',
    },
  ],
};

const errorMessage: ChatMessage = {
  id: 'm3',
  role: 'assistant',
  status: 'error',
  parts: [
    {
      type: 'text',
      text: 'Error state',
    },
  ],
};

const CustomRoot = React.forwardRef(function CustomRoot(
  props: MessageRootProps & {
    ownerState?: {
      messageId: string;
      role?: string;
      streaming: boolean;
      error: boolean;
      isGrouped: boolean;
      status?: string;
    };
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, messageId, isGrouped, ownerState, slotProps, slots, ...other } = props;
  void messageId;
  void isGrouped;
  void slotProps;
  void slots;

  return (
    <section
      data-error={String(ownerState?.error)}
      data-grouped={String(ownerState?.isGrouped)}
      data-message-id={ownerState?.messageId ?? 'none'}
      data-role={ownerState?.role ?? 'none'}
      data-status={ownerState?.status ?? 'none'}
      data-streaming={String(ownerState?.streaming)}
      data-testid="custom-message-root"
      ref={ref}
      {...other}
    >
      {children}
    </section>
  );
});

function CustomAvatar(props: MessageAvatarProps & { ownerState?: { isGrouped: boolean } }) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <div
      data-grouped={String(ownerState?.isGrouped)}
      data-testid="custom-message-avatar"
      {...other}
    >
      {children}
    </div>
  );
}

function CustomContent(props: MessageContentProps & { ownerState?: { messageId: string } }) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <div
      data-message-id={ownerState?.messageId ?? 'none'}
      data-testid="custom-message-content"
      {...other}
    >
      {children}
    </div>
  );
}

function CustomBubble(
  props: React.HTMLAttributes<HTMLDivElement> & { ownerState?: { role?: string } },
) {
  const { children, ownerState, ...other } = props;

  return (
    <div data-role={ownerState?.role ?? 'none'} data-testid="custom-message-bubble" {...other}>
      {children}
    </div>
  );
}

function CustomMeta(props: MessageMetaProps & { ownerState?: { status?: string } }) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <div data-status={ownerState?.status ?? 'none'} data-testid="custom-message-meta" {...other}>
      {children}
    </div>
  );
}

function CustomTimestamp(
  props: React.HTMLAttributes<HTMLSpanElement> & { ownerState?: { status?: string } },
) {
  const { children, ownerState, ...other } = props;

  return (
    <span
      data-status={ownerState?.status ?? 'none'}
      data-testid="custom-message-timestamp"
      {...other}
    >
      {children}
    </span>
  );
}

function CustomStatus(
  props: React.HTMLAttributes<HTMLSpanElement> & { ownerState?: { streaming: boolean } },
) {
  const { children, ownerState, ...other } = props;

  return (
    <span
      data-streaming={String(ownerState?.streaming)}
      data-testid="custom-message-status"
      {...other}
    >
      {children}
    </span>
  );
}

function CustomEdited(
  props: React.HTMLAttributes<HTMLSpanElement> & { ownerState?: { error: boolean } },
) {
  const { children, ownerState, ...other } = props;

  return (
    <span data-error={String(ownerState?.error)} data-testid="custom-message-edited" {...other}>
      {children}
    </span>
  );
}

const CustomActions = React.forwardRef(function CustomActions(
  props: MessageActionsProps & { ownerState?: { messageId: string } },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, slotProps, slots, ...other } = props;
  void slotProps;
  void slots;

  return (
    <div
      data-message-id={ownerState?.messageId ?? 'none'}
      data-testid="custom-message-actions"
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

describe('MessageRoot', () => {
  it('renders the default part pipeline for built-in parts and falls back for unknown parts', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        defaultMessages={[fullMessage]}
        localeText={{
          messageTimestampLabel: (dateTime) => dateTime,
        }}
      >
        <MessageRoot messageId="m1">
          <MessageAvatar data-testid="message-avatar" />
          <MessageContent data-testid="message-content" />
          <MessageMeta data-testid="message-meta" />
          <MessageActions data-testid="message-actions">
            <button type="button">Reply</button>
          </MessageActions>
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByAltText('Assistant')).to.have.attribute(
      'src',
      'https://example.com/avatar.png',
    );
    expect(screen.getByText('Hello world')).not.to.equal(null);
    expect(screen.getByText('Reasoning')).not.to.equal(null);
    expect(screen.getByText('search')).not.to.equal(null);
    expect(screen.getByText('dynamic-search')).not.to.equal(null);
    expect(screen.getByText('spec.pdf')).not.to.equal(null);
    expect(screen.getByText('MUI')).not.to.equal(null);
    expect(screen.getByText('Spec')).not.to.equal(null);
    expect(screen.getByText('Document excerpt')).not.to.equal(null);
    expect(screen.getByTestId('message-content').textContent).to.contain('Prague');
    expect(screen.getByText('2026-03-14T10:00:00.000Z')).not.to.equal(null);
    expect(screen.getByText('Streaming')).not.to.equal(null);
    expect(screen.getByText('Edited')).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'Reply' })).not.to.equal(null);
    expect(screen.queryByRole('separator')).not.to.equal(null);
    expect(document.querySelector('[data-part-type="poll"]')).not.to.equal(null);
  });

  it('prefers custom part renderers and passes the provider onToolCall callback', () => {
    const onToolCall = vi.fn();
    let seenOnToolCall: unknown;

    render(
      <ChatRoot
        adapter={createAdapter()}
        defaultMessages={[minimalMessage]}
        onToolCall={onToolCall}
        partRenderers={{
          text: ({ part, onToolCall: currentOnToolCall }) => {
            seenOnToolCall = currentOnToolCall;

            return <div data-testid="custom-text-part">{part.text.toUpperCase()}</div>;
          },
        }}
      >
        <MessageRoot messageId="m2">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-text-part')).to.have.text('MINIMAL');
    expect(seenOnToolCall).toBe(onToolCall);
  });

  it('uses localeText for reasoning, tool state, and message meta labels', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        defaultMessages={[fullMessage]}
        localeText={{
          messageReasoningLabel: 'Denken',
          messageEditedLabel: 'Bearbeitet',
          messageStatusLabel: () => 'Laeuft',
          messageTimestampLabel: () => '14.03.2026 10:00',
          toolStateLabel: (state) =>
            state === 'output-available' ? 'Abgeschlossen' : 'Verweigert',
        }}
      >
        <MessageRoot messageId="m1">
          <MessageContent />
          <MessageMeta />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByText('Denken')).not.to.equal(null);
    expect(screen.getByText('Abgeschlossen')).not.to.equal(null);
    expect(screen.getByText('Verweigert')).not.to.equal(null);
    expect(screen.getByText('14.03.2026 10:00')).not.to.equal(null);
    expect(screen.getByText('Laeuft')).not.to.equal(null);
    expect(screen.getByText('Bearbeitet')).not.to.equal(null);
  });

  it('supports replacing all compound root slots and passes ownerState through them', () => {
    render(
      <ChatRoot adapter={createAdapter()} defaultMessages={[fullMessage]}>
        <MessageRoot messageId="m1" slots={{ root: CustomRoot }}>
          <MessageAvatar data-testid="avatar-slot" slots={{ avatar: CustomAvatar }} />
          <MessageContent
            data-testid="content-slot"
            slots={{ bubble: CustomBubble, content: CustomContent }}
          />
          <MessageMeta
            data-testid="meta-slot"
            slotProps={{ edited: { 'data-extra': 'edited' } as any }}
            slots={{
              edited: CustomEdited,
              meta: CustomMeta,
              status: CustomStatus,
              timestamp: CustomTimestamp,
            }}
          />
          <MessageActions data-testid="actions-slot" slots={{ actions: CustomActions }}>
            <button type="button">Reply</button>
          </MessageActions>
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-message-root')).to.have.attribute('data-message-id', 'm1');
    expect(screen.getByTestId('custom-message-root')).to.have.attribute('data-role', 'assistant');
    expect(screen.getByTestId('custom-message-root')).to.have.attribute('data-streaming', 'true');
    expect(screen.getByTestId('avatar-slot')).to.have.attribute('data-grouped', 'false');
    expect(screen.getByTestId('content-slot')).to.have.attribute('data-message-id', 'm1');
    expect(screen.getByTestId('custom-message-bubble')).to.have.attribute('data-role', 'assistant');
    expect(screen.getByTestId('meta-slot')).to.have.attribute('data-status', 'streaming');
    expect(screen.getByTestId('custom-message-timestamp')).to.have.attribute(
      'data-status',
      'streaming',
    );
    expect(screen.getByTestId('custom-message-status')).to.have.attribute('data-streaming', 'true');
    expect(screen.getByTestId('custom-message-edited')).to.have.attribute('data-extra', 'edited');
    expect(screen.getByTestId('actions-slot')).to.have.attribute('data-message-id', 'm1');
    expect(screen.getByRole('button', { name: 'Reply' })).not.to.equal(null);
  });

  it('passes the error ownerState flags for failed messages', () => {
    render(
      <ChatRoot adapter={createAdapter()} defaultMessages={[errorMessage]}>
        <MessageRoot messageId="m3" slots={{ root: CustomRoot }}>
          <MessageMeta slots={{ meta: CustomMeta }} />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-message-root')).to.have.attribute('data-message-id', 'm3');
    expect(screen.getByTestId('custom-message-root')).to.have.attribute('data-status', 'error');
    expect(screen.getByTestId('custom-message-root')).to.have.attribute('data-streaming', 'false');
    expect(screen.getByTestId('custom-message-root')).to.have.attribute('data-error', 'true');
    expect(screen.getByTestId('custom-message-meta')).to.have.attribute('data-status', 'error');
  });

  it('hides the avatar for grouped follow-up messages', () => {
    render(
      <ChatRoot adapter={createAdapter()} defaultMessages={[fullMessage]}>
        <MessageRoot isGrouped messageId="m1">
          <MessageAvatar />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.queryByRole('img')).to.equal(null);
  });

  it('tolerates missing messages and empty meta without crashing', () => {
    render(
      <ChatRoot adapter={createAdapter()} defaultMessages={[minimalMessage]}>
        <MessageRoot data-testid="missing-message-root" messageId="missing">
          <MessageAvatar />
          <MessageContent />
          <MessageMeta />
          <MessageActions />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('missing-message-root')).not.to.equal(null);
    expect(screen.queryByRole('img')).to.equal(null);
    expect(screen.getByTestId('missing-message-root').textContent).to.equal('');
  });
});
