import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter } from '../adapters/chatAdapter';
import type { ChatMessage } from '../types/chat-entities';
import { ChatRoot } from '../chat/ChatRoot';
import { ChatVariantProvider } from '../chat/internals/ChatVariantContext';
import type { MessageActionsProps } from './MessageActions';
import { MessageActions } from './MessageActions';
import { MessageAuthorLabel } from './MessageAuthorLabel';
import type { MessageAvatarProps } from './MessageAvatar';
import { MessageAvatar } from './MessageAvatar';
import type { MessageContentProps } from './MessageContent';
import { MessageContent } from './MessageContent';
import type { MessageMetaProps } from './MessageMeta';
import { MessageMeta } from './MessageMeta';
import type { MessageRootProps } from './MessageRoot';
import { MessageRoot } from './MessageRoot';
import { createToolPartRenderer } from './parts/ToolPart';

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
  // A createdAt timestamp keeps MessageMeta renderable for the error state.
  // Without a timestamp, the meta footer still renders the generic error label
  // when no message-specific runtime error is available.
  createdAt: '2026-03-14T10:00:00.000Z',
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
        initialMessages={[fullMessage]}
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
    expect(screen.getByRole('progressbar', { name: 'Streaming' })).not.to.equal(null);
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
        initialMessages={[minimalMessage]}
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
        initialMessages={[fullMessage]}
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
    expect(screen.getByRole('progressbar', { name: 'Laeuft' })).not.to.equal(null);
    expect(screen.getByText('Bearbeitet')).not.to.equal(null);
  });

  it('supports replacing all compound root slots and passes ownerState through them', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[fullMessage]}>
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
    // When streaming, the Status slot is not rendered — a streaming progress bar takes its place
    expect(screen.queryByTestId('custom-message-status')).to.equal(null);
    expect(screen.getByRole('progressbar', { name: 'Streaming' })).not.to.equal(null);
    expect(screen.getByTestId('custom-message-edited')).to.have.attribute('data-extra', 'edited');
    expect(screen.getByTestId('actions-slot')).to.have.attribute('data-message-id', 'm1');
    expect(screen.getByRole('button', { name: 'Reply' })).not.to.equal(null);
  });

  it('passes the error ownerState flags for failed messages', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[errorMessage]}>
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

  it('renders the "Error" status label when no message-specific error is available', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[errorMessage]}>
        <MessageRoot messageId="m3">
          <MessageMeta data-testid="meta" />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByText('Error')).not.to.equal(null);
  });

  it('hides the avatar for grouped follow-up messages in compact variant', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[fullMessage]}>
        <ChatVariantProvider variant="compact">
          <MessageRoot isGrouped messageId="m1">
            <MessageAvatar />
          </MessageRoot>
        </ChatVariantProvider>
      </ChatRoot>,
    );

    expect(screen.queryByRole('img')).to.equal(null);
  });

  it('hides the avatar for grouped follow-up messages in default variant', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[fullMessage]}>
        <MessageRoot isGrouped messageId="m1">
          <MessageAvatar />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.queryByRole('img')).to.equal(null);
  });

  it('tolerates missing messages and empty meta without crashing', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[minimalMessage]}>
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

describe('ToolPart', () => {
  const toolMessage: ChatMessage = {
    id: 't1',
    role: 'assistant',
    parts: [
      {
        type: 'tool',
        toolInvocation: {
          toolCallId: 'tc1',
          toolName: 'search',
          title: 'Custom Search Title',
          state: 'output-available',
          input: { query: 'weather' },
          output: { results: ['sunny'] },
        },
      },
    ],
  };

  it('renders tool title from toolInvocation.title, falls back to toolName', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[toolMessage]}>
        <MessageRoot messageId="t1">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByText('Custom Search Title')).not.to.equal(null);
  });

  it('falls back to toolName when no title is provided', () => {
    const noTitleMessage: ChatMessage = {
      id: 't2',
      role: 'assistant',
      parts: [
        {
          type: 'tool',
          toolInvocation: {
            toolCallId: 'tc2',
            toolName: 'search',
            state: 'output-available',
            input: { query: '1+1' },
            output: { results: ['2'] },
          },
        },
      ],
    };

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[noTitleMessage]}>
        <MessageRoot messageId="t2">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByText('search')).not.to.equal(null);
  });

  it('renders state label via localeText.toolStateLabel', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[toolMessage]}>
        <MessageRoot messageId="t1">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    // Default locale: 'output-available' → 'Completed'
    expect(screen.getByText('Completed')).not.to.equal(null);
  });

  it('shows input section when input-available with input defined', () => {
    const inputAvailableMessage: ChatMessage = {
      id: 't3',
      role: 'assistant',
      parts: [
        {
          type: 'tool',
          toolInvocation: {
            toolCallId: 'tc3',
            toolName: 'search',
            state: 'input-available',
            input: { query: 'hello' },
          },
        },
      ],
    };

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[inputAvailableMessage]}>
        <MessageRoot messageId="t3">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    // Default locale: messageToolInputLabel → 'Input'
    expect(screen.getByText('Input')).not.to.equal(null);
  });

  it('shows output section when output-available with output defined', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[toolMessage]}>
        <MessageRoot messageId="t1">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    // Default locale: messageToolOutputLabel → 'Output'
    expect(screen.getByText('Output')).not.to.equal(null);
  });

  it('shows inline content for long payloads', () => {
    const longInputMessage: ChatMessage = {
      id: 't4',
      role: 'assistant',
      parts: [
        {
          type: 'tool',
          toolInvocation: {
            toolCallId: 'tc4',
            toolName: 'search',
            state: 'input-available',
            input: { query: 'a'.repeat(350) },
          },
        },
      ],
    };

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[longInputMessage]}>
        <MessageRoot messageId="t4">
          <MessageContent data-testid="content" />
        </MessageRoot>
      </ChatRoot>,
    );

    // Long content should be displayed inline with <strong> label, not collapsed
    const strong = screen.getByTestId('content').querySelector('strong');

    expect(strong).not.to.equal(null);
    expect(strong!.textContent).to.equal('Input');
  });

  it('shows inline content for short payloads', () => {
    const shortInputMessage: ChatMessage = {
      id: 't5',
      role: 'assistant',
      parts: [
        {
          type: 'tool',
          toolInvocation: {
            toolCallId: 'tc5',
            toolName: 'search',
            state: 'input-available',
            input: { query: 'hi' },
          },
        },
      ],
    };

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[shortInputMessage]}>
        <MessageRoot messageId="t5">
          <MessageContent data-testid="content" />
        </MessageRoot>
      </ChatRoot>,
    );

    // Short content should use <strong> label
    const strong = screen.getByTestId('content').querySelector('strong');

    expect(strong).not.to.equal(null);
    expect(strong!.textContent).to.equal('Input');
  });

  it('shows error text when output-error with errorText', () => {
    const errorToolMessage: ChatMessage = {
      id: 't6',
      role: 'assistant',
      parts: [
        {
          type: 'tool',
          toolInvocation: {
            toolCallId: 'tc6',
            toolName: 'search',
            state: 'output-error',
            errorText: 'Something went wrong',
          },
        },
      ],
    };

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[errorToolMessage]}>
        <MessageRoot messageId="t6">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByText('Something went wrong')).not.to.equal(null);
  });

  it('shows denial reason when output-denied with approval.reason', () => {
    const deniedMessage: ChatMessage = {
      id: 't7',
      role: 'assistant',
      parts: [
        {
          type: 'dynamic-tool',
          toolInvocation: {
            toolCallId: 'tc7',
            toolName: 'search',
            state: 'output-denied',
            approval: { approved: false, reason: 'User denied access' },
          },
        },
      ],
    };

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[deniedMessage]}>
        <MessageRoot messageId="t7">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByText('User denied access')).not.to.equal(null);
  });

  it('shows approve/deny buttons when approval-requested', () => {
    const approvalMessage: ChatMessage = {
      id: 't8',
      role: 'assistant',
      parts: [
        {
          type: 'dynamic-tool',
          toolInvocation: {
            toolCallId: 'tc8',
            toolName: 'dangerous-tool',
            state: 'approval-requested',
            input: { action: 'delete-all' },
          },
        },
      ],
    };

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[approvalMessage]}>
        <MessageRoot messageId="t8">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    // Default locale: messageToolApproveButtonLabel → 'Approve', messageToolDenyButtonLabel → 'Deny'
    expect(screen.getByRole('button', { name: 'Approve' })).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'Deny' })).not.to.equal(null);
  });

  it('approve/deny buttons are initially enabled', () => {
    const approvalMessage: ChatMessage = {
      id: 't9',
      role: 'assistant',
      parts: [
        {
          type: 'dynamic-tool',
          toolInvocation: {
            toolCallId: 'tc9',
            toolName: 'risky-tool',
            state: 'approval-requested',
          },
        },
      ],
    };

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[approvalMessage]}>
        <MessageRoot messageId="t9">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    const approveButton = screen.getByRole('button', { name: 'Approve' });
    const denyButton = screen.getByRole('button', { name: 'Deny' });

    expect(approveButton).to.have.property('disabled', false);
    expect(denyButton).to.have.property('disabled', false);
  });

  it('createToolPartRenderer produces a valid renderer function', () => {
    // eslint-disable-next-line testing-library/render-result-naming-convention -- not a render result
    const partFactory = createToolPartRenderer({ className: 'custom-tool' });

    expect(typeof partFactory).to.equal('function');
  });
});

describe('MessageAuthorLabel', () => {
  it('renders displayName in compact variant when not grouped', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[fullMessage]}>
        <ChatVariantProvider variant="compact">
          <MessageRoot messageId="m1">
            <MessageAuthorLabel data-testid="author-label" />
          </MessageRoot>
        </ChatVariantProvider>
      </ChatRoot>,
    );

    expect(screen.getByTestId('author-label')).to.have.text('Assistant');
  });

  it('resolves the displayName from members when the message only provides an author id', () => {
    const messageWithId: ChatMessage = {
      id: 'm-id',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Hi' }],
      author: { id: 'bot-123' },
    };

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[messageWithId]}
        members={[
          {
            id: 'bot-123',
            displayName: 'Member Bot',
          },
        ]}
      >
        <ChatVariantProvider variant="compact">
          <MessageRoot messageId="m-id">
            <MessageAuthorLabel data-testid="author-label" />
          </MessageRoot>
        </ChatVariantProvider>
      </ChatRoot>,
    );

    expect(screen.getByTestId('author-label')).to.have.text('Member Bot');
  });

  it('uses getMessageAuthorDisplayName when provided', () => {
    const messageWithMetadata: ChatMessage = {
      id: 'm-meta',
      role: 'assistant',
      metadata: {
        actorName: 'Getter Bot',
      } as any,
      parts: [{ type: 'text', text: 'Hi' }],
    };

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[messageWithMetadata]}
        getMessageAuthorDisplayName={(message) => (message.metadata as any)?.actorName}
      >
        <ChatVariantProvider variant="compact">
          <MessageRoot messageId="m-meta">
            <MessageAuthorLabel data-testid="author-label" />
          </MessageRoot>
        </ChatVariantProvider>
      </ChatRoot>,
    );

    expect(screen.getByTestId('author-label')).to.have.text('Getter Bot');
  });

  it('returns null when only the author id is available', () => {
    const messageWithId: ChatMessage = {
      id: 'm-id',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Hi' }],
      author: { id: 'bot-123' },
    };

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[messageWithId]}>
        <ChatVariantProvider variant="compact">
          <MessageRoot messageId="m-id">
            <MessageAuthorLabel data-testid="author-label" />
          </MessageRoot>
        </ChatVariantProvider>
      </ChatRoot>,
    );

    expect(screen.queryByTestId('author-label')).to.equal(null);
  });

  it('returns null when no author info exists', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[minimalMessage]}>
        <ChatVariantProvider variant="compact">
          <MessageRoot messageId="m2">
            <MessageAuthorLabel data-testid="author-label" />
          </MessageRoot>
        </ChatVariantProvider>
      </ChatRoot>,
    );

    expect(screen.queryByTestId('author-label')).to.equal(null);
  });

  it('returns null when variant is default', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[fullMessage]}>
        <MessageRoot messageId="m1">
          <MessageAuthorLabel data-testid="author-label" />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.queryByTestId('author-label')).to.equal(null);
  });

  it('returns null when isGrouped', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[fullMessage]}>
        <ChatVariantProvider variant="compact">
          <MessageRoot isGrouped messageId="m1">
            <MessageAuthorLabel data-testid="author-label" />
          </MessageRoot>
        </ChatVariantProvider>
      </ChatRoot>,
    );

    expect(screen.queryByTestId('author-label')).to.equal(null);
  });
});

describe('Resolved author data', () => {
  it('resolves avatar and aria-label from members when the message only provides an author id', () => {
    const memberMessage: ChatMessage = {
      id: 'm-member',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Hello from member' }],
      author: { id: 'bot-456' },
    };

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[memberMessage]}
        members={[
          {
            id: 'bot-456',
            displayName: 'Support Bot',
            avatarUrl: 'https://example.com/member-bot.png',
          },
        ]}
      >
        <MessageRoot messageId="m-member">
          <MessageAvatar />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByAltText('Support Bot')).to.have.attribute(
      'src',
      'https://example.com/member-bot.png',
    );
    expect(screen.getByRole('article', { name: 'Message from Support Bot' })).not.to.equal(null);
  });

  it('uses getter-derived author id and avatar url', () => {
    const metadataMessage: ChatMessage = {
      id: 'm-getters',
      role: 'assistant',
      metadata: {
        actorId: 'bot-getter',
        actorAvatarUrl: 'https://example.com/getter-bot.png',
      } as any,
      parts: [{ type: 'text', text: 'Hi from metadata' }],
    };

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[metadataMessage]}
        members={[
          {
            id: 'bot-getter',
            displayName: 'Getter Bot',
          },
        ]}
        getMessageAuthorId={(message) => (message.metadata as any)?.actorId}
        getMessageAuthorAvatarUrl={(message) => (message.metadata as any)?.actorAvatarUrl}
      >
        <ChatVariantProvider variant="compact">
          <MessageRoot messageId="m-getters">
            <MessageAvatar />
            <MessageAuthorLabel data-testid="author-label" />
          </MessageRoot>
        </ChatVariantProvider>
      </ChatRoot>,
    );

    expect(screen.getByAltText('Getter Bot')).to.have.attribute(
      'src',
      'https://example.com/getter-bot.png',
    );
    expect(screen.getByTestId('author-label')).to.have.text('Getter Bot');
  });
});

describe('MessageActions', () => {
  it('renders children within div', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[fullMessage]}>
        <MessageRoot messageId="m1">
          <MessageActions data-testid="actions">
            <button type="button">Reply</button>
            <button type="button">Copy</button>
          </MessageActions>
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('actions')).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'Reply' })).not.to.equal(null);
    expect(screen.getByRole('button', { name: 'Copy' })).not.to.equal(null);
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[fullMessage]}>
        <MessageRoot messageId="m1">
          <MessageActions ref={ref} />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(ref.current).to.be.instanceOf(window.HTMLDivElement);
  });
});

describe('MessageMeta', () => {
  it('returns null when no timestamp/status/editedAt and not streaming', () => {
    const bareMessage: ChatMessage = {
      id: 'm-bare',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Hi' }],
    };

    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[bareMessage]}>
        <MessageRoot messageId="m-bare">
          <MessageMeta data-testid="meta" />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.queryByTestId('meta')).to.equal(null);
  });

  it('shows timestamp after hydration', () => {
    const timedMessage: ChatMessage = {
      id: 'm-ts',
      role: 'assistant',
      createdAt: '2026-03-14T10:00:00.000Z',
      parts: [{ type: 'text', text: 'Hi' }],
    };

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[timedMessage]}
        localeText={{ messageTimestampLabel: (dt) => dt }}
      >
        <MessageRoot messageId="m-ts">
          <MessageMeta data-testid="meta" />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByText('2026-03-14T10:00:00.000Z')).not.to.equal(null);
  });

  it('shows status label when not streaming', () => {
    const sentMessage: ChatMessage = {
      id: 'm-sent',
      role: 'user',
      status: 'sent',
      parts: [{ type: 'text', text: 'Sent' }],
    };

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[sentMessage]}
        localeText={{ messageStatusLabel: () => 'Delivered' }}
      >
        <MessageRoot messageId="m-sent">
          <MessageMeta data-testid="meta" />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByText('Delivered')).not.to.equal(null);
  });

  it('shows streaming progress bar with aria-label', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[fullMessage]}>
        <MessageRoot messageId="m1">
          <MessageMeta />
        </MessageRoot>
      </ChatRoot>,
    );

    // fullMessage has status: 'streaming'
    expect(screen.getByRole('progressbar', { name: 'Streaming' })).not.to.equal(null);
  });

  it('shows edited label when editedAt is set', () => {
    render(
      <ChatRoot adapter={createAdapter()} initialMessages={[fullMessage]}>
        <MessageRoot messageId="m1">
          <MessageMeta />
        </MessageRoot>
      </ChatRoot>,
    );

    // fullMessage has editedAt set
    expect(screen.getByText('Edited')).not.to.equal(null);
  });
});
