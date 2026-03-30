import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-unstyled';
import { ChatBox } from '../ChatBox/ChatBox';
import { ChatMessage } from './ChatMessage';

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

describe('ChatMessage', () => {
  it('applies MuiChatMessage-roleUser class for user messages', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('.MuiChatMessage-roleUser')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessage-roleAssistant')).toBe(null);
  });

  it('applies MuiChatMessage-roleAssistant class for assistant messages', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[
          {
            id: 'm1',
            role: 'assistant',
            status: 'sent',
            parts: [{ type: 'text', text: 'Hi there' }],
          },
        ]}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('.MuiChatMessage-roleAssistant')).not.toBe(null);
    expect(document.querySelector('.MuiChatMessage-roleUser')).toBe(null);
  });

  it('applies MuiChatMessage-streaming class while a message is streaming', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[
          {
            id: 'm1',
            role: 'assistant',
            status: 'streaming',
            parts: [{ type: 'text', text: '...', state: 'streaming' }],
          },
        ]}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('.MuiChatMessage-streaming')).not.toBe(null);
  });

  it('applies Mui-error global state class for error status messages', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          {
            id: 'm1',
            role: 'user',
            status: 'error',
            parts: [{ type: 'text', text: 'Failed' }],
          },
        ]}
      >
        <ChatMessage messageId="m1" />
      </ChatRoot>,
    );

    // MUI uses the global state class 'Mui-error' (not 'MuiChatMessage-error')
    // because 'error' is a global state class in generateUtilityClass
    expect(document.querySelector('.Mui-error')).not.toBe(null);
  });

  it('applies MuiChatMessage-root class to the message root element', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('.MuiChatMessage-root')).not.toBe(null);
  });

  it('forwards custom className to the message root via slotProps.messageRoot', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        initialMessages={[{ id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]}
        slotProps={{
          messageRoot: { className: 'my-custom-class' },
        }}
      >
        {null}
      </ChatBox>,
    );

    expect(document.querySelector('.my-custom-class')).not.toBe(null);
  });
});
