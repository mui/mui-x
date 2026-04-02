import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from './ChatBox';

const { render } = createRenderer();

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

describe('ChatBox', () => {
  describe('rendering', () => {
    it('renders with adapter and displays messages', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          initialMessages={[
            { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
            { id: 'm2', role: 'assistant', parts: [{ type: 'text', text: 'Hi there!' }] },
          ]}
        >
          {null}
        </ChatBox>,
      );
      expect(screen.getByText('Hello')).not.toBe(null);
      expect(screen.getByText('Hi there!')).not.toBe(null);
    });

    it('renders empty state text when no messages', () => {
      render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
      expect(screen.getByText('No messages yet')).not.toBe(null);
    });
  });

  describe('feature: conversationHeader', () => {
    it('hides conversation header when features.conversationHeader=false', () => {
      render(
        <ChatBox adapter={createAdapter()} features={{ conversationHeader: false }}>
          {null}
        </ChatBox>,
      );
      expect(document.querySelector('.MuiChatConversationHeader-root')).toBe(null);
    });
  });

  describe('feature: attachments', () => {
    it('shows attach button by default', () => {
      render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
      expect(screen.getByRole('button', { name: 'Add attachment' })).not.toBe(null);
    });

    it('hides attach button when features.attachments=false', () => {
      render(
        <ChatBox adapter={createAdapter()} features={{ attachments: false }}>
          {null}
        </ChatBox>,
      );
      expect(screen.queryByRole('button', { name: 'Add attachment' })).toBe(null);
    });
  });

  describe('feature: helperText', () => {
    it('hides helper text when features.helperText=false', () => {
      render(
        <ChatBox adapter={createAdapter()} features={{ helperText: false }}>
          {null}
        </ChatBox>,
      );
      expect(document.querySelector('.MuiChatComposerHelperText-root')).toBe(null);
    });
  });

  describe('feature: suggestions', () => {
    it('shows suggestions in empty state when provided', () => {
      render(
        <ChatBox adapter={createAdapter()} suggestions={['Tell me a joke', 'What is AI?']}>
          {null}
        </ChatBox>,
      );
      // The styled suggestion items render as <button value="..."> elements
      const suggestionButtons = document.querySelectorAll('.MuiChatSuggestions-item');
      expect(suggestionButtons.length).toBe(2);
      expect(suggestionButtons[0].getAttribute('value')).toBe('Tell me a joke');
      expect(suggestionButtons[1].getAttribute('value')).toBe('What is AI?');
    });

    it('hides suggestions when features.suggestions=false', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          suggestions={['Tell me a joke']}
          features={{ suggestions: false }}
        >
          {null}
        </ChatBox>,
      );
      expect(document.querySelector('.MuiChatSuggestions-root')).toBe(null);
    });

    it('does not show suggestions when messages exist', () => {
      render(
        <ChatBox
          adapter={createAdapter()}
          suggestions={['Tell me a joke']}
          initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
        >
          {null}
        </ChatBox>,
      );
      expect(document.querySelector('.MuiChatSuggestions-root')).toBe(null);
    });
  });

  describe('composer', () => {
    it('renders composer with placeholder', () => {
      render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
      const textarea = screen.getByPlaceholderText('Type a message');
      expect(textarea).not.toBe(null);
    });

    it('renders send button', () => {
      render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
      expect(screen.getByRole('button', { name: 'Send message' })).not.toBe(null);
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to root element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <ChatBox ref={ref} adapter={createAdapter()}>
          {null}
        </ChatBox>,
      );
      expect(ref.current).not.toBe(null);
      expect(ref.current!.tagName).toBe('DIV');
    });
  });
});
