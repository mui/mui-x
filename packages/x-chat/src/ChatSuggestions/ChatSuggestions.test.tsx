import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';

const { render } = createRenderer();

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({ start(c) { c.close(); } });
    },
    ...overrides,
  };
}

describe('ChatSuggestions', () => {
  it('renders without crashing inside ChatBox when suggestions are provided', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        suggestions={['How can I help you?', 'Tell me more']}
      >
        {null}
      </ChatBox>,
    );
    // Suggestions are shown when there are no messages; check via CSS class
    expect(document.querySelector('.MuiChatSuggestions-item')).not.toBe(null);
  });

  it('applies MuiChatSuggestions-root class when rendered', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        suggestions={['Suggestion A']}
      >
        {null}
      </ChatBox>,
    );
    expect(document.querySelector('.MuiChatSuggestions-root')).not.toBe(null);
  });

  it('does not render suggestions when there are existing messages', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
        suggestions={['Suggestion A']}
      >
        {null}
      </ChatBox>,
    );
    // Suggestions are hidden when messages exist
    expect(document.querySelector('.MuiChatSuggestions-root')).toBe(null);
  });

  it('forwards custom className via slotProps.suggestions', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        suggestions={['Suggestion A']}
        slotProps={{ suggestions: { className: 'custom-suggestions' } }}
      >
        {null}
      </ChatBox>,
    );
    expect(document.querySelector('.custom-suggestions')).not.toBe(null);
  });
});
