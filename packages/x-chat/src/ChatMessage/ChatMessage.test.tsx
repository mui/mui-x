import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatRoot } from '@mui/x-chat-headless';
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
            parts: [{ type: 'text', text: '…', state: 'streaming' }],
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

  it("treats role:'user' messages from non-current users as outer messages (Alice case)", () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        currentUser={{ id: 'me', displayName: 'Me' }}
        members={[
          { id: 'me', displayName: 'Me' },
          { id: 'alice', displayName: 'Alice Chen' },
          { id: 'agent', displayName: 'MUI Assistant' },
        ]}
        initialMessages={[
          {
            id: 'm-alice',
            role: 'user',
            author: { id: 'alice' },
            parts: [{ type: 'text', text: 'Hi from Alice' }],
          },
          {
            id: 'm-me',
            role: 'user',
            author: { id: 'me' },
            parts: [{ type: 'text', text: 'Hi from me' }],
          },
        ]}
      >
        {null}
      </ChatBox>,
    );

    const aliceRoot = document.querySelector(
      '.MuiChatMessage-root[aria-label="Message from Alice Chen"]',
    );
    const meRoot = document.querySelector('.MuiChatMessage-root[aria-label="Message from Me"]');

    expect(aliceRoot).not.toBe(null);
    expect(meRoot).not.toBe(null);

    // Alice's role is 'user' — the role hook is preserved for downstream styling.
    expect(aliceRoot!.classList.contains('MuiChatMessage-roleUser')).toBe(true);
    // …but Alice is NOT the current user, so the bubble must NOT be marked as own.
    expect(aliceRoot!.getAttribute('data-is-own-message')).toBe(null);
    // The current user's own user-role message IS marked as own.
    expect(meRoot!.getAttribute('data-is-own-message')).toBe('true');
  });

  it('honors slots.error in the children composition path', () => {
    function CustomError() {
      return <div data-testid="custom-error">custom error</div>;
    }

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          {
            id: 'm1',
            role: 'assistant',
            status: 'error',
            parts: [{ type: 'text', text: 'Boom' }],
          },
        ]}
      >
        <ChatMessage messageId="m1" slots={{ error: CustomError }}>
          <div data-testid="custom-child">child content</div>
        </ChatMessage>
      </ChatRoot>,
    );

    // Custom children render, and the error surface resolves through slots.error
    // rather than being hardcoded to the default ChatMessageError.
    expect(document.querySelector('[data-testid="custom-child"]')).not.toBe(null);
    expect(document.querySelector('[data-testid="custom-error"]')).not.toBe(null);
  });
});
