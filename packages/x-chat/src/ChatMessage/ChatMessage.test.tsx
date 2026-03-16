import * as React from 'react';
import {
  createRenderer,
  screen,
  waitFor,
} from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type {
  ChatAdapter,
  ChatMessage as ChatMessageModel,
  ChatPartRendererMap,
} from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-unstyled';
import type {
  ChatDateDividerProps,
  ChatMessageActionsProps,
  ChatMessageAvatarProps,
  ChatMessageContentProps,
  ChatMessageGroupProps,
  ChatMessageMetaProps,
  ChatMessageRootProps,
} from './ChatMessage';
import {
  ChatDateDivider,
  ChatFilePartRenderer,
  ChatMessage,
  ChatMessageActions,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageMeta,
  ChatMessageRoot,
  ChatReasoningPartRenderer,
  ChatSourceDocumentPartRenderer,
  ChatSourceUrlPartRenderer,
  ChatToolPartRenderer,
  createChatToolPartRenderer,
  createChatMarkdownTextPartRenderer,
  chatMessageClasses,
} from './ChatMessage';

const { render } = createRenderer();
const isJSDOM = /jsdom/.test(window.navigator.userAgent);

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(controller) {
          controller.close();
        },
      });
    },
    ...overrides,
  };
}

function createMessage(
  id: string,
  options: Partial<ChatMessageModel> & {
    parts?: ChatMessageModel['parts'];
    text?: string;
  },
): ChatMessageModel {
  const { parts, text = '', ...message } = options;

  return {
    id,
    parts: parts ?? [{ type: 'text', text }],
    role: message.role ?? 'assistant',
    ...message,
  };
}

function renderChatMessage(
  ui: React.ReactElement,
  messages: ChatMessageModel[],
  options: {
    adapter?: ChatAdapter;
    localeText?: Record<string, unknown>;
    partRenderers?: ChatPartRendererMap;
  } = {},
) {
  const theme = createTheme({
    palette: {
      Chat: {
        assistantMessageBg: '#f5f7fb',
        assistantMessageColor: '#102030',
        userMessageBg: '#1d4ed8',
        userMessageColor: '#ffffff',
      },
    },
  });

  return render(
    <ThemeProvider theme={theme}>
      <ChatRoot
        adapter={options.adapter ?? createAdapter()}
        defaultMessages={messages}
        localeText={options.localeText}
        partRenderers={options.partRenderers}
      >
        {ui}
      </ChatRoot>
    </ThemeProvider>,
  );
}

const CustomRoot = React.forwardRef(function CustomRoot(
  props: ChatMessageRootProps & { ownerState?: { role?: string; messageId: string } },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props as ChatMessageRootProps & {
    ownerState?: { role?: string; messageId: string };
  };

  return (
    <section
      data-message-id={ownerState?.messageId ?? 'none'}
      data-role={ownerState?.role ?? 'none'}
      data-testid="custom-chat-message-root"
      ref={ref}
      {...other}
    >
      {children}
    </section>
  );
});

function CustomAvatar(props: ChatMessageAvatarProps & { ownerState?: { messageId: string } }) {
  const { ownerState, ...other } = props as ChatMessageAvatarProps & {
    ownerState?: { messageId: string };
  };

  return <div data-message-id={ownerState?.messageId ?? 'none'} data-testid="custom-chat-avatar" {...other} />;
}

function CustomContent(props: ChatMessageContentProps & { ownerState?: { role?: string } }) {
  const { children, ownerState, ...other } = props as ChatMessageContentProps & {
    ownerState?: { role?: string };
  };

  return (
    <div data-role={ownerState?.role ?? 'none'} data-testid="custom-chat-content" {...other}>
      {children}
    </div>
  );
}

function CustomBubble(props: React.HTMLAttributes<HTMLDivElement> & { ownerState?: { status?: string } }) {
  const { children, ownerState, ...other } = props;

  return (
    <div data-status={ownerState?.status ?? 'none'} data-testid="custom-chat-bubble" {...other}>
      {children}
    </div>
  );
}

function CustomMeta(props: ChatMessageMetaProps & { ownerState?: { streaming: boolean } }) {
  const { children, ownerState, ...other } = props as ChatMessageMetaProps & {
    ownerState?: { streaming: boolean };
  };

  return (
    <div data-streaming={String(ownerState?.streaming)} data-testid="custom-chat-meta" {...other}>
      {children}
    </div>
  );
}

const CustomActions = React.forwardRef(function CustomActions(
  props: ChatMessageActionsProps & { ownerState?: { error: boolean } },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props as ChatMessageActionsProps & {
    ownerState?: { error: boolean };
  };

  return (
    <div data-error={String(ownerState?.error)} data-testid="custom-chat-actions" ref={ref} {...other}>
      {children}
    </div>
  );
});

const CustomGroup = React.forwardRef(function CustomGroup(
  props: ChatMessageGroupProps & { ownerState?: { isFirst: boolean; isLast: boolean } },
  ref: React.Ref<HTMLDivElement>,
) {
  const { children, ownerState, ...other } = props as ChatMessageGroupProps & {
    ownerState?: { isFirst: boolean; isLast: boolean };
  };

  return (
    <div
      data-first={String(ownerState?.isFirst)}
      data-last={String(ownerState?.isLast)}
      data-testid="custom-chat-group"
      ref={ref}
      {...other}
    >
      {children}
    </div>
  );
});

function CustomDivider(props: ChatDateDividerProps & { ownerState?: { hasBoundary: boolean } }) {
  const { ownerState, ...other } = props as ChatDateDividerProps & {
    ownerState?: { hasBoundary: boolean };
  };

  return <div data-boundary={String(ownerState?.hasBoundary)} data-testid="custom-chat-divider" {...other} />;
}

describe('ChatMessage', () => {
  it('renders assistant, user, and system rows with the styled compound family', () => {
    renderChatMessage(
      <React.Fragment>
        <ChatMessageRoot messageId="m1">
          <ChatMessageAvatar />
          <ChatMessageContent />
          <ChatMessageMeta />
          <ChatMessageActions>
            <button type="button">Reply</button>
          </ChatMessageActions>
        </ChatMessageRoot>
        <ChatMessageRoot messageId="m2">
          <ChatMessageAvatar />
          <ChatMessageContent />
          <ChatMessageMeta />
        </ChatMessageRoot>
        <ChatMessageRoot messageId="m3">
          <ChatMessageAvatar />
          <ChatMessageContent />
          <ChatMessageMeta />
        </ChatMessageRoot>
      </React.Fragment>,
      [
        createMessage('m1', {
          author: { id: 'assistant-1', displayName: 'Assistant One' },
          createdAt: '2026-03-15T09:00:00.000Z',
          role: 'assistant',
          status: 'streaming',
          text: 'Assistant message',
        }),
        createMessage('m2', {
          author: { id: 'user-1', displayName: 'Jane Doe' },
          createdAt: '2026-03-15T09:05:00.000Z',
          editedAt: '2026-03-15T09:06:00.000Z',
          role: 'user',
          status: 'sent',
          text: 'User message',
        }),
        createMessage('m3', {
          createdAt: '2026-03-15T09:10:00.000Z',
          role: 'system',
          status: 'sent',
          text: 'System notice',
        }),
      ],
    );

    expect(screen.getByText('AO')).toBeVisible();
    expect(screen.getByText('JD')).toBeVisible();
    expect(screen.queryByText('SY')).toBeNull();
    expect(screen.getByText('Assistant message').closest(`.${chatMessageClasses.bubble}`)).not.toBeNull();
    expect(screen.getByText('User message').closest(`.${chatMessageClasses.bubble}`)).not.toBeNull();
    expect(screen.getByText('System notice').closest(`.${chatMessageClasses.bubble}`)).not.toBeNull();
    expect(screen.getByText('Streaming').closest(`.${chatMessageClasses.status}`)).not.toBeNull();
    expect(screen.getByText('Edited').closest(`.${chatMessageClasses.edited}`)).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Reply' })).toBeVisible();
  });

  it('supports slot replacement across the styled message, group, and divider helpers', () => {
    renderChatMessage(
      <React.Fragment>
        <ChatMessageRoot messageId="m2" slots={{ root: CustomRoot }}>
          <ChatMessageAvatar slots={{ avatar: CustomAvatar }} />
          <ChatMessageContent slots={{ bubble: CustomBubble, content: CustomContent }} />
          <ChatMessageMeta slots={{ meta: CustomMeta }} />
          <ChatMessageActions slots={{ actions: CustomActions }}>
            <button type="button">Inspect</button>
          </ChatMessageActions>
        </ChatMessageRoot>
        <ChatDateDivider messageId="m2" slots={{ divider: CustomDivider }} />
        <ChatMessageGroup messageId="m2" slots={{ group: CustomGroup }}>
          <ChatMessageAvatar slots={{ avatar: CustomAvatar }} />
          <ChatMessageContent slots={{ bubble: CustomBubble, content: CustomContent }} />
          <ChatMessageMeta slots={{ meta: CustomMeta }} />
          <ChatMessageActions slots={{ actions: CustomActions }}>
            <button type="button">Inspect</button>
          </ChatMessageActions>
        </ChatMessageGroup>
      </React.Fragment>,
      [
        createMessage('m1', {
          author: { id: 'assistant-2', displayName: 'Assistant' },
          createdAt: '2026-03-15T09:00:00.000Z',
          role: 'assistant',
          text: 'First',
        }),
        createMessage('m2', {
          author: { id: 'assistant-2', displayName: 'Assistant' },
          createdAt: '2026-03-16T09:00:00.000Z',
          role: 'assistant',
          status: 'streaming',
          text: 'Second',
        }),
      ],
    );

    expect(screen.getByTestId('custom-chat-divider')).to.have.attribute('data-boundary', 'true');
    expect(screen.getByTestId('custom-chat-group')).to.have.attribute('data-first', 'true');
    expect(screen.getByTestId('custom-chat-message-root')).to.have.attribute('data-role', 'assistant');
    expect(screen.getAllByTestId('custom-chat-avatar')[0]).to.have.attribute('data-message-id', 'm2');
    expect(screen.getAllByTestId('custom-chat-content')[0]).to.have.attribute('data-role', 'assistant');
    expect(screen.getAllByTestId('custom-chat-bubble')[0]).to.have.attribute('data-status', 'streaming');
    expect(screen.getAllByTestId('custom-chat-meta')[0]).to.have.attribute('data-streaming', 'true');
    expect(screen.getAllByTestId('custom-chat-actions')[0]).to.have.attribute('data-error', 'false');
  });

  it('uses grouped spacing and date dividers in the styled helpers', () => {
    renderChatMessage(
      <React.Fragment>
        <ChatDateDivider messageId="m1" />
        <ChatDateDivider messageId="m3" />
        <ChatMessageGroup messageId="m1" />
        <ChatMessageGroup messageId="m2" />
        <ChatMessageGroup messageId="m3" />
      </React.Fragment>,
      [
        createMessage('m1', {
          author: { id: 'assistant-3', displayName: 'Assistant', avatarUrl: 'https://example.com/avatar.png' },
          createdAt: '2026-03-15T09:00:00.000Z',
          role: 'assistant',
          text: 'First grouped',
        }),
        createMessage('m2', {
          author: { id: 'assistant-3', displayName: 'Assistant', avatarUrl: 'https://example.com/avatar.png' },
          createdAt: '2026-03-15T09:02:00.000Z',
          role: 'assistant',
          text: 'Second grouped',
        }),
        createMessage('m3', {
          author: { id: 'assistant-3', displayName: 'Assistant', avatarUrl: 'https://example.com/avatar.png' },
          createdAt: '2026-03-16T09:00:00.000Z',
          role: 'assistant',
          text: 'Third grouped',
        }),
      ],
    );

    expect(screen.getAllByText('Assistant')).to.have.length(2);
    expect(screen.getAllByRole('img')).to.have.length(2);
    expect(screen.getByText('2026-03-16')).toBeVisible();
  });

  it('renders correctly in dark mode and RTL', () => {
    const theme = createTheme({
      direction: 'rtl',
      palette: {
        mode: 'dark',
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <ChatRoot
            adapter={createAdapter()}
            defaultMessages={[
              createMessage('m1', {
                author: { id: 'assistant-rtl', displayName: 'RTL Assistant' },
                createdAt: '2026-03-15T09:00:00.000Z',
                role: 'assistant',
                text: 'RTL message',
              }),
            ]}
          >
            <ChatMessageRoot messageId="m1">
              <ChatMessageAvatar />
              <ChatMessageContent />
              <ChatMessageMeta />
            </ChatMessageRoot>
          </ChatRoot>
        </div>
      </ThemeProvider>,
    );

    expect(screen.getByText('RTL message')).toBeVisible();
    expect(screen.getByText('RA')).toBeVisible();
  });

  it('renders markdown text parts with safe links, blockquotes, inline code, and images', () => {
    renderChatMessage(
      <ChatMessageRoot messageId="m1">
        <ChatMessageContent />
      </ChatMessageRoot>,
      [
        createMessage('m1', {
          createdAt: '2026-03-15T09:00:00.000Z',
          role: 'assistant',
          text: `# Heading

[Safe](https://mui.com)
[Unsafe](javascript:alert(1))

> Quoted text

\`inline()\`

![Preview](https://example.com/preview.png)

<script>alert('xss')</script>`,
        }),
      ],
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Heading' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Safe' })).to.have.attribute('href', 'https://mui.com');
    expect(screen.queryByRole('link', { name: 'Unsafe' })).toBeNull();
    expect(screen.getByText('Unsafe')).toBeVisible();
    expect(screen.getByText('Quoted text').closest('blockquote')).not.toBeNull();
    expect(screen.getByText('inline()').closest('code')).not.toBeNull();
    expect(screen.getByRole('img', { name: 'Preview' })).to.have.attribute(
      'src',
      'https://example.com/preview.png',
    );
    const markdownContent = screen
      .getByRole('heading', { level: 1, name: 'Heading' })
      .closest(`.${chatMessageClasses.markdownContent}`);

    expect(markdownContent?.querySelector('script')).toBeNull();
    expect(markdownContent?.textContent ?? '').not.toContain("alert('xss')");
  });

  it('renders fenced code blocks with localized copy labels and highlight fallback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const clipboardDescriptor = Object.getOwnPropertyDescriptor(window.navigator, 'clipboard');

    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    try {
      renderChatMessage(
        <ChatMessageRoot messageId="m1">
          <ChatMessageContent />
        </ChatMessageRoot>,
        [
          createMessage('m1', {
            createdAt: '2026-03-15T09:00:00.000Z',
            role: 'assistant',
            text: '```tsx\nconst total = 1;\n```',
          }),
        ],
        {
          localeText: {
            messageCopyCodeButtonLabel: 'Copy snippet',
            messageCopiedCodeButtonLabel: 'Snippet copied',
          },
        },
      );

      expect(screen.getByText('tsx')).toBeVisible();
      expect(screen.getByText('const total = 1;')).toBeVisible();

      const copyButton = screen.getByRole('button', { name: 'Copy snippet' });
      copyButton.click();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Snippet copied' })).toBeVisible();
      });

      await waitFor(() => {
        expect(document.querySelector('.shiki')).not.toBeNull();
      });
    } finally {
      if (clipboardDescriptor) {
        Object.defineProperty(window.navigator, 'clipboard', clipboardDescriptor);
      } else {
        Object.defineProperty(window.navigator, 'clipboard', {
          configurable: true,
          value: undefined,
        });
      }
    }
  });

  it('renders styled reasoning, file, and source parts with Material defaults', () => {
    renderChatMessage(
      <ChatMessageRoot messageId="m1">
        <ChatMessageContent />
      </ChatMessageRoot>,
      [
        createMessage('m1', {
          createdAt: '2026-03-15T09:00:00.000Z',
          role: 'assistant',
          parts: [
            {
              type: 'reasoning',
              text: 'Investigating the issue',
              state: 'streaming',
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
              title: 'MUI Docs',
            },
            {
              type: 'source-document',
              sourceId: 'source-2',
              title: 'Internal spec',
              text: 'Document excerpt',
            },
          ],
        }),
      ],
      {
        localeText: {
          messageReasoningStreamingLabel: 'Thinking now',
        },
      },
    );

    const reasoning = screen.getByText('Thinking now').closest('details');

    expect(reasoning).not.toBeNull();
    expect(reasoning).to.have.attribute('open');
    expect(screen.getByRole('img', { name: 'image.png' })).to.have.attribute(
      'src',
      'https://example.com/image.png',
    );
    expect(screen.getByRole('link', { name: 'spec.pdf' })).to.have.attribute(
      'href',
      'https://example.com/spec.pdf',
    );
    expect(screen.getByRole('link', { name: 'MUI Docs' })).to.have.attribute('href', 'https://mui.com');
    expect(screen.getByText('Internal spec')).toBeVisible();
    expect(screen.getByText('Document excerpt')).toBeVisible();
  });

  it('renders tool states, collapses long payloads, and forwards approval responses', async () => {
    const addToolApprovalResponse = vi.fn(async () => {});

    renderChatMessage(
      <ChatMessageRoot messageId="m1">
        <ChatMessageContent />
      </ChatMessageRoot>,
      [
        createMessage('m1', {
          createdAt: '2026-03-15T09:00:00.000Z',
          role: 'assistant',
          parts: [
            {
              type: 'tool',
              toolInvocation: {
                toolCallId: 'tool-approval',
                toolName: 'search',
                state: 'approval-requested',
                input: {
                  query: Array.from({ length: 40 }, (_, index) => `weather-${index + 1}`).join(' '),
                },
              },
            },
            {
              type: 'tool',
              toolInvocation: {
                toolCallId: 'tool-output',
                toolName: 'search',
                state: 'output-available',
                output: {
                  results: Array.from({ length: 12 }, (_, index) => ({
                    title: `Result ${index + 1}`,
                    url: `https://example.com/${index + 1}`,
                  })),
                },
              },
            },
            {
              type: 'tool',
              toolInvocation: {
                toolCallId: 'tool-error',
                toolName: 'search',
                state: 'output-error',
                errorText: 'Request failed',
              },
            },
            {
              type: 'dynamic-tool',
              toolInvocation: {
                toolCallId: 'tool-denied',
                toolName: 'dynamic-search',
                state: 'output-denied',
                approval: {
                  approved: false,
                  reason: 'Manager approval required',
                },
              },
            },
          ],
        }),
      ],
      {
        adapter: createAdapter({ addToolApprovalResponse }),
      },
    );

    expect(screen.getAllByText('Input')[0].closest('summary')).not.toBeNull();
    expect(screen.getAllByText('Output')[0].closest('summary')).not.toBeNull();
    expect(screen.getByText('Request failed')).toBeVisible();
    expect(screen.getByText('Manager approval required')).toBeVisible();

    await React.act(async () => {
      screen.getByRole('button', { name: 'Approve' }).click();
    });

    await waitFor(() => {
      expect(addToolApprovalResponse).toHaveBeenCalledWith({
        id: 'tool-approval',
        approved: true,
      });
    });
  });

  it('exports reusable non-text AI renderers for provider-level composition', () => {
    renderChatMessage(
      <ChatMessageRoot messageId="m1">
        <ChatMessageContent />
      </ChatMessageRoot>,
      [
        createMessage('m1', {
          createdAt: '2026-03-15T09:00:00.000Z',
          role: 'assistant',
          parts: [
            {
              type: 'tool',
              toolInvocation: {
                toolCallId: 'tool-1',
                toolName: 'search',
                state: 'output-available',
                output: {
                  results: [{ title: 'Sunny', url: 'https://example.com/weather' }],
                },
              },
            },
          ],
        }),
      ],
      {
        partRenderers: {
          tool: createChatToolPartRenderer({
            slotProps: {
              root: {
                id: 'custom-tool-root',
              },
            },
          }),
        },
      },
    );

    const customToolRoot = document.getElementById('custom-tool-root');

    expect(customToolRoot).not.toBeNull();
    expect(customToolRoot?.textContent ?? '').toContain('search');
  });

  it('lets partRenderers.text replace the built-in markdown renderer', () => {
    renderChatMessage(
      <ChatMessageRoot messageId="m1">
        <ChatMessageContent />
      </ChatMessageRoot>,
      [
        createMessage('m1', {
          createdAt: '2026-03-15T09:00:00.000Z',
          role: 'assistant',
          text: '# Override me',
        }),
      ],
      {
        partRenderers: {
          text: ({ part }) => <div data-testid="custom-text-part">{part.text.toUpperCase()}</div>,
        },
      },
    );

    expect(screen.getByTestId('custom-text-part')).to.have.text('# OVERRIDE ME');
    expect(screen.queryByRole('heading', { level: 1, name: 'Override me' })).toBeNull();
  });

  it('exports a reusable markdown text renderer for provider-level composition', () => {
    renderChatMessage(
      <ChatMessageRoot messageId="m1">
        <ChatMessageContent />
      </ChatMessageRoot>,
      [
        createMessage('m1', {
          createdAt: '2026-03-15T09:00:00.000Z',
          role: 'assistant',
          text: '`composable`',
        }),
      ],
      {
        partRenderers: {
          text: createChatMarkdownTextPartRenderer({
            localeText: {
              messageCopyCodeButtonLabel: 'Copy snippet',
              messageCopiedCodeButtonLabel: 'Snippet copied',
            },
            slotProps: {
              root: {
                id: 'markdown-text-part',
              },
            },
          }),
        },
      },
    );

    expect(document.getElementById('markdown-text-part')).not.toBeNull();
    expect(screen.getByText('composable').closest('code')).not.toBeNull();
  });

  it('exports standalone non-text renderer components', () => {
    const toolMessage = createMessage('m-tool', {
      role: 'assistant',
      parts: [
        {
          type: 'tool',
          toolInvocation: {
            toolCallId: 'tool-standalone',
            toolName: 'search',
            state: 'output-available',
            output: {
              results: [{ title: 'Sunny', url: 'https://example.com/weather' }],
            },
          },
        },
      ],
    });

    render(
      <ThemeProvider theme={createTheme()}>
        <ChatRoot adapter={createAdapter()} defaultMessages={[toolMessage]}>
          <React.Fragment>
            <ChatReasoningPartRenderer
              index={0}
              message={toolMessage}
              onToolCall={undefined}
              part={{ type: 'reasoning', text: 'Standalone reasoning', state: 'done' }}
            />
            <ChatToolPartRenderer
              index={0}
              message={toolMessage}
              onToolCall={undefined}
              part={toolMessage.parts[0] as any}
            />
            <ChatFilePartRenderer
              index={0}
              message={toolMessage}
              onToolCall={undefined}
              part={{
                type: 'file',
                mediaType: 'application/pdf',
                url: 'https://example.com/file.pdf',
                filename: 'file.pdf',
              }}
            />
            <ChatSourceUrlPartRenderer
              index={0}
              message={toolMessage}
              onToolCall={undefined}
              part={{
                type: 'source-url',
                sourceId: 'source-url',
                title: 'Standalone source',
                url: 'https://example.com',
              }}
            />
            <ChatSourceDocumentPartRenderer
              index={0}
              message={toolMessage}
              onToolCall={undefined}
              part={{
                type: 'source-document',
                sourceId: 'source-doc',
                title: 'Standalone document',
                text: 'Excerpt',
              }}
            />
          </React.Fragment>
        </ChatRoot>
      </ThemeProvider>,
    );

    expect(screen.getByText('Standalone reasoning')).toBeVisible();
    expect(screen.getByText('Standalone source')).toBeVisible();
    expect(screen.getByText('Standalone document')).toBeVisible();
    expect(screen.getByText('file.pdf')).toBeVisible();
  });

  it.skipIf(isJSDOM)('reveals actions when focus moves inside the styled row', async () => {
    renderChatMessage(
      <ChatMessageRoot messageId="m1">
        <ChatMessageContent />
        <ChatMessageActions>
          <button type="button">Inspect</button>
        </ChatMessageActions>
      </ChatMessageRoot>,
      [
        createMessage('m1', {
          createdAt: '2026-03-15T09:00:00.000Z',
          role: 'assistant',
          text: 'Hover me',
        }),
      ],
    );

    const button = screen.getByRole('button', { name: 'Inspect' });
    const actions = screen.getByText('Inspect').closest(`.${chatMessageClasses.actions}`)!;

    expect(window.getComputedStyle(actions).opacity).to.equal('0');
    button.focus();

    await waitFor(() => {
      expect(window.getComputedStyle(actions).opacity).to.equal('1');
    });
  });
});
