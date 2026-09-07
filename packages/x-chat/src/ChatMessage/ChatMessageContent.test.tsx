import * as React from 'react';
import { act, createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { ChatAdapter, ChatMessage, ChatToolExpand } from '@mui/x-chat-headless';
import { ChatRoot, MessageRoot, useChatStore } from '@mui/x-chat-headless';
import { ChatMessageContent } from './ChatMessageContent';

const { render } = createRenderer();
const isJSDOM = /jsdom/.test(window.navigator.userAgent);

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

function renderWithMessage(message: ChatMessage) {
  return render(
    <ChatRoot adapter={createAdapter()} initialMessages={[message]}>
      <MessageRoot messageId={message.id}>
        <ChatMessageContent data-testid="message-content" />
      </MessageRoot>
    </ChatRoot>,
  );
}

describe('ChatMessageContent', () => {
  describe('text part', () => {
    it('renders markdown bold as <strong>', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [{ type: 'text', text: '**bold text**' }],
      });
      const strong = document.querySelector('strong');
      expect(strong).not.toBe(null);
      expect(strong!.textContent).toBe('bold text');
    });

    it('renders markdown code fence as ChatCodeBlock', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [{ type: 'text', text: '```ts\nconsole.log("hi")\n```' }],
      });
      // ChatCodeBlock root has class MuiChatCodeBlock-root
      expect(document.querySelector('.MuiChatCodeBlock-root')).not.toBe(null);
    });

    it('renders plain text without extra markup', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [{ type: 'text', text: 'Hello world' }],
      });
      expect(screen.getByText('Hello world')).not.toBe(null);
    });
  });

  describe('reasoning part', () => {
    it('renders collapsible details with summary', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [{ type: 'reasoning', text: 'Let me think…', state: 'done' }],
      });
      // Reasoning renders a <details> with a <summary>
      const details = document.querySelector('details');
      expect(details).not.toBe(null);
      // Summary should contain "Reasoning" (default locale)
      const summary = details!.querySelector('summary');
      expect(summary).not.toBe(null);
      expect(summary!.textContent).toContain('Reasoning');
    });

    it('is open when streaming', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [{ type: 'reasoning', text: 'thinking…', state: 'streaming' }],
      });
      const details = document.querySelector('details');
      expect(details).not.toBe(null);
      expect(details!.hasAttribute('open')).toBe(true);
    });

    it('renders reasoning text content', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [{ type: 'reasoning', text: 'My reasoning here', state: 'done' }],
      });
      expect(screen.getByText('My reasoning here')).not.toBe(null);
    });
  });

  describe('tool part', () => {
    it('renders tool title', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tc1',
              toolName: 'searchTool',
              state: 'output-available',
              input: { query: 'test' },
              output: { result: 'found' },
              title: 'Search Tool',
            },
          },
        ],
      });
      expect(screen.getByText('Search Tool')).not.toBe(null);
    });

    it('renders tool name as title fallback', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tc1',
              toolName: 'myTool',
              state: 'input-available',
              input: {},
            },
          },
        ],
      });
      expect(screen.getByText('myTool')).not.toBe(null);
    });

    it('shows approve/deny buttons on approval-requested', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tc1',
              toolName: 'dangerousTool',
              state: 'approval-requested',
              input: { action: 'delete' },
            },
          },
        ],
      });
      expect(screen.getByText('Approve')).not.toBe(null);
      expect(screen.getByText('Deny')).not.toBe(null);
    });

    it('renders a default tool icon SVG in the header', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tc1',
              toolName: 'searchTool',
              state: 'input-available',
              input: {},
            },
          },
        ],
      });
      // The default icon is now an inline SVG inside the styled icon span,
      // sitting in the summary header alongside the tool title.
      const summary = document.querySelector('summary');
      expect(summary).not.toBe(null);
      expect(summary!.querySelector('svg')).not.toBe(null);
    });

    it.skipIf(isJSDOM)('renders the tool header as a full-width row', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tc1',
              toolName: 'searchTool',
              state: 'output-available',
              input: {},
              output: {},
            },
          },
        ],
      });

      expect(document.querySelector('summary')).toHaveComputedStyle({ display: 'flex' });
    });

    it('renders Input and Output as independently collapsible sections', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tc1',
              toolName: 'searchTool',
              state: 'output-available',
              input: { query: 'test' },
              output: { result: 'found' },
              title: 'Search Tool',
            },
          },
        ],
      });
      // Find all <details> — root + 2 sections (input + output) = 3.
      const allDetails = document.querySelectorAll('details');
      expect(allDetails.length).toBe(3);
      expect(screen.getByText('Tool called:')).not.toBe(null);
      expect(screen.getByText('Tool result:')).not.toBe(null);
    });

    it('renders a status icon with state aria-label when output is available', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'tool',
            toolInvocation: {
              toolCallId: 'tc1',
              toolName: 'searchTool',
              state: 'output-available',
              input: {},
              output: {},
            },
          },
        ],
      });
      // State component is a [role="status"] element with aria-label = locale state label.
      const status = document.querySelector('[role="status"]');
      expect(status).not.toBe(null);
      expect(status!.getAttribute('aria-label')).toBe('Completed');
      expect(status!.querySelector('svg')).not.toBe(null);
    });

    it('auto-opens the input section when the state transitions to approval-requested', () => {
      let store!: ReturnType<typeof useChatStore>;
      function CaptureStore() {
        store = useChatStore();
        return null;
      }

      render(
        <ChatRoot
          adapter={createAdapter()}
          initialMessages={[
            {
              id: 'm1',
              role: 'assistant',
              parts: [
                {
                  type: 'tool',
                  toolInvocation: {
                    toolCallId: 'tc1',
                    toolName: 'dangerousTool',
                    state: 'input-available',
                    input: { action: 'delete' },
                  },
                },
              ],
            },
          ]}
        >
          <CaptureStore />
          <MessageRoot messageId="m1">
            <ChatMessageContent data-testid="message-content" />
          </MessageRoot>
        </ChatRoot>,
      );

      // The input section starts collapsed while the tool is `input-available`.
      const inputDetailsBefore = screen.getByText('Tool called:').closest('details');
      expect(inputDetailsBefore).not.toBe(null);
      expect(inputDetailsBefore!.hasAttribute('open')).toBe(false);

      // The same section component is reused when the state advances to
      // `approval-requested`; it must now auto-open so the input being approved is visible.
      act(() => {
        store.updateMessage('m1', {
          parts: [
            {
              type: 'tool',
              toolInvocation: {
                toolCallId: 'tc1',
                toolName: 'dangerousTool',
                state: 'approval-requested',
                input: { action: 'delete' },
              },
            },
          ],
        });
      });

      const inputDetailsAfter = screen.getByText('Tool called:').closest('details');
      expect(inputDetailsAfter!.hasAttribute('open')).toBe(true);
    });

    it('keeps the other Material tool slots when only one part slot is overridden', () => {
      function CustomSummary({ children }: { children?: React.ReactNode }) {
        return <strong data-testid="custom-summary">{children}</strong>;
      }

      render(
        <ChatRoot
          adapter={createAdapter()}
          initialMessages={[
            {
              id: 'm1',
              role: 'assistant',
              parts: [
                {
                  type: 'tool',
                  toolInvocation: {
                    toolCallId: 'tc1',
                    toolName: 'searchTool',
                    state: 'output-available',
                    input: { query: 'test' },
                    output: { result: 'found' },
                    title: 'Search Tool',
                  },
                },
              ],
            },
          ]}
        >
          <MessageRoot messageId="m1">
            <ChatMessageContent
              data-testid="message-content"
              partProps={{ tool: { slots: { sectionSummary: CustomSummary } } }}
            />
          </MessageRoot>
        </ChatRoot>,
      );

      // The overridden slot is used…
      expect(document.querySelector('[data-testid="custom-summary"]')).not.toBe(null);
      // …and the other Material defaults survive: the collapsible root + the input/output
      // section `<details>` elements (3 total) would collapse to plain divs if the partial
      // override had replaced the whole slot map.
      expect(document.querySelectorAll('details').length).toBe(3);
    });

    it('forwards a consumer section onToggle without breaking the controlled disclosure', () => {
      const handleToggle = vi.fn();
      render(
        <ChatRoot
          adapter={createAdapter()}
          initialMessages={[
            {
              id: 'm1',
              role: 'assistant',
              parts: [
                {
                  type: 'tool',
                  toolInvocation: {
                    toolCallId: 'tc1',
                    toolName: 'searchTool',
                    state: 'output-available',
                    input: { query: 'test' },
                    output: { result: 'found' },
                    title: 'Search Tool',
                  },
                },
              ],
            },
          ]}
        >
          <MessageRoot messageId="m1">
            <ChatMessageContent
              data-testid="message-content"
              partProps={{ tool: { slotProps: { section: { onToggle: handleToggle } } } }}
            />
          </MessageRoot>
        </ChatRoot>,
      );

      // The input section starts collapsed (only the output is auto-opened).
      const inputDetails = screen.getByText('Tool called:').closest('details')!;
      expect(inputDetails.hasAttribute('open')).toBe(false);

      // Simulate the user expanding it (native <details> toggle).
      inputDetails.open = true;
      fireEvent(inputDetails, new Event('toggle'));

      // The consumer handler is observed…
      expect(handleToggle).toHaveBeenCalledTimes(1);
      // …and the internal controlled updater still runs, so the section stays open.
      // A clobbered updater would let React snap `open` back to false on re-render.
      expect(inputDetails.hasAttribute('open')).toBe(true);
    });

    it('forwards a consumer root onToggle without breaking the controlled disclosure', () => {
      const handleToggle = vi.fn();
      render(
        <ChatRoot
          adapter={createAdapter()}
          initialMessages={[
            {
              id: 'm1',
              role: 'assistant',
              parts: [
                {
                  type: 'tool',
                  toolInvocation: {
                    toolCallId: 'tc1',
                    toolName: 'searchTool',
                    state: 'output-available',
                    input: {},
                    output: {},
                  },
                },
              ],
            },
          ]}
        >
          <MessageRoot messageId="m1">
            <ChatMessageContent
              data-testid="message-content"
              partProps={{ tool: { slotProps: { root: { onToggle: handleToggle } } } }}
            />
          </MessageRoot>
        </ChatRoot>,
      );

      const rootDetails = document.querySelector('details')!;
      rootDetails.open = true;
      fireEvent(rootDetails, new Event('toggle'));

      expect(handleToggle).toHaveBeenCalledTimes(1);
      expect(rootDetails.hasAttribute('open')).toBe(true);
    });

    it('auto-opens the root when a reused tool transitions to a streaming state', () => {
      let store!: ReturnType<typeof useChatStore>;
      function CaptureStore() {
        store = useChatStore();
        return null;
      }

      render(
        <ChatRoot
          adapter={createAdapter()}
          initialMessages={[
            {
              id: 'm1',
              role: 'assistant',
              parts: [
                {
                  type: 'tool',
                  toolInvocation: {
                    toolCallId: 'tc1',
                    toolName: 'searchTool',
                    state: 'input-available',
                    input: {},
                  },
                },
              ],
            },
          ]}
        >
          <CaptureStore />
          <MessageRoot messageId="m1">
            <ChatMessageContent data-testid="message-content" />
          </MessageRoot>
        </ChatRoot>,
      );

      const rootDetailsBefore = document.querySelector('details')!;
      expect(rootDetailsBefore.hasAttribute('open')).toBe(false);

      act(() => {
        store.updateMessage('m1', {
          parts: [
            {
              type: 'tool',
              toolInvocation: {
                toolCallId: 'tc1',
                toolName: 'searchTool',
                state: 'input-streaming',
                input: {},
              },
            },
          ],
        });
      });

      const rootDetailsAfter = document.querySelector('details')!;
      expect(rootDetailsAfter.hasAttribute('open')).toBe(true);
    });
  });

  describe('tool part — defaultExpanded', () => {
    function renderTool(message: ChatMessage, defaultExpanded: Record<string, ChatToolExpand>) {
      let store!: ReturnType<typeof useChatStore>;
      function CaptureStore() {
        store = useChatStore();
        return null;
      }
      const view = render(
        <ChatRoot adapter={createAdapter()} initialMessages={[message]}>
          <CaptureStore />
          <MessageRoot messageId={message.id}>
            <ChatMessageContent
              data-testid="message-content"
              partProps={{ tool: { defaultExpanded } }}
            />
          </MessageRoot>
        </ChatRoot>,
      );
      return { ...view, getStore: () => store };
    }

    const toolMessage = (
      toolInvocation: Extract<ChatMessage['parts'][number], { type: 'tool' }>['toolInvocation'],
      status?: ChatMessage['status'],
    ): ChatMessage => ({
      id: 'm1',
      role: 'assistant',
      status,
      parts: [{ type: 'tool', toolInvocation }],
    });

    const rootDetails = () => document.querySelector('details')!;

    it('collapses a card the built-in default would open (write: false)', () => {
      renderTool(
        toolMessage({ toolCallId: 'tc1', toolName: 'write', state: 'input-streaming', input: {} }),
        { write: false },
      );
      // built-in would open on input-streaming; the policy keeps it collapsed.
      expect(rootDetails().hasAttribute('open')).toBe(false);
    });

    it('expands a card the built-in default would leave collapsed (write: true)', () => {
      renderTool(
        toolMessage({
          toolCallId: 'tc1',
          toolName: 'write',
          state: 'output-available',
          input: {},
          output: {},
        }),
        { write: true },
      );
      expect(rootDetails().hasAttribute('open')).toBe(true);
    });

    it('collapses the card when the tool ends (resolver scoped to the root)', () => {
      const { getStore } = renderTool(
        toolMessage({ toolCallId: 'tc1', toolName: 'write', state: 'input-streaming', input: {} }),
        {
          write: (os) =>
            os.section
              ? undefined
              : os.state === 'input-streaming' || os.state === 'input-available',
        },
      );
      expect(rootDetails().hasAttribute('open')).toBe(true);
      act(() => {
        getStore().updateMessage('m1', {
          parts: [
            {
              type: 'tool',
              toolInvocation: {
                toolCallId: 'tc1',
                toolName: 'write',
                state: 'output-available',
                input: {},
                output: {},
              },
            },
          ],
        });
      });
      expect(rootDetails().hasAttribute('open')).toBe(false);
    });

    it('applies the "*" fallback to tools without their own entry', () => {
      renderTool(
        toolMessage({
          toolCallId: 'tc1',
          toolName: 'unknownTool',
          state: 'output-available',
          input: {},
          output: {},
        }),
        { '*': true },
      );
      expect(rootDetails().hasAttribute('open')).toBe(true);
    });

    it('prefers a per-tool entry over the "*" fallback', () => {
      renderTool(
        toolMessage({
          toolCallId: 'tc1',
          toolName: 'write',
          state: 'output-available',
          input: {},
          output: {},
        }),
        { write: true, '*': false },
      );
      expect(rootDetails().hasAttribute('open')).toBe(true);
    });

    it('controls an input/output section via ownerState.section', () => {
      // The output section auto-opens by default; the policy force-collapses it while
      // leaving the card root at its built-in (collapsed) state.
      renderTool(
        toolMessage({
          toolCallId: 'tc1',
          toolName: 'write',
          state: 'output-available',
          input: { a: 1 },
          output: { b: 2 },
        }),
        { write: (os) => (os.section === 'output' ? false : undefined) },
      );
      const outputDetails = screen.getByText('Tool result:').closest('details')!;
      expect(outputDetails.hasAttribute('open')).toBe(false);
    });

    it('keeps the card open while the message streams, then collapses when it ends', () => {
      const { getStore } = renderTool(
        toolMessage(
          {
            toolCallId: 'tc1',
            toolName: 'write',
            state: 'output-available',
            input: {},
            output: {},
          },
          'streaming',
        ),
        { write: (os) => (os.section ? undefined : os.isMessageStreaming) },
      );
      expect(rootDetails().hasAttribute('open')).toBe(true);
      act(() => {
        getStore().updateMessage('m1', { status: 'sent' });
      });
      expect(rootDetails().hasAttribute('open')).toBe(false);
    });
  });

  describe('source-url part', () => {
    it('renders link with URL', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'source-url',
            sourceId: 's1',
            url: 'https://example.com',
            title: 'Example',
          },
        ],
      });
      const link = screen.getByRole('link', { name: 'Example' });
      expect(link).not.toBe(null);
      expect(link.getAttribute('href')).toBe('https://example.com');
    });
  });

  describe('source-document part', () => {
    it('renders title and excerpt', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'source-document',
            sourceId: 'd1',
            title: 'Doc Title',
            text: 'Document excerpt text',
          },
        ],
      });
      expect(screen.getByText('Doc Title')).not.toBe(null);
      expect(screen.getByText('Document excerpt text')).not.toBe(null);
    });
  });

  describe('file part', () => {
    it('renders image for image mediaType', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'file',
            mediaType: 'image/png',
            url: 'https://example.com/img.png',
            filename: 'img.png',
          },
        ],
      });
      const img = document.querySelector('img');
      expect(img).not.toBe(null);
      expect(img!.getAttribute('src')).toBe('https://example.com/img.png');
    });

    it('renders link for non-image mediaType', () => {
      renderWithMessage({
        id: 'm1',
        role: 'assistant',
        parts: [
          {
            type: 'file',
            mediaType: 'application/pdf',
            url: 'https://example.com/doc.pdf',
            filename: 'doc.pdf',
          },
        ],
      });
      const link = screen.getByRole('link');
      expect(link).not.toBe(null);
      expect(link.getAttribute('href')).toBe('https://example.com/doc.pdf');
      expect(screen.getByText('doc.pdf')).not.toBe(null);
    });
  });
});
