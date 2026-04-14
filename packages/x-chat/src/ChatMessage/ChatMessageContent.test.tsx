import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatRoot, MessageRoot } from '@mui/x-chat-headless';
import { ChatMessageContent } from './ChatMessageContent';

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
        parts: [{ type: 'reasoning', text: 'Let me think...', state: 'done' }],
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
        parts: [{ type: 'reasoning', text: 'thinking...', state: 'streaming' }],
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

    it('tool icon shows first letter of toolName', () => {
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
      // The icon component renders the first letter uppercased
      expect(screen.getByText('S')).not.toBe(null);
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
