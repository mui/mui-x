import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
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

describe('ChatComposer', () => {
  it('renders without crashing inside ChatBox', () => {
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    // The composer textarea is part of the default ChatBox layout
    expect(screen.getByRole('textbox')).not.toBe(null);
  });

  it('applies MuiChatComposer-root class to the composer root element', () => {
    render(<ChatBox adapter={createAdapter()}>{null}</ChatBox>);
    expect(document.querySelector('.MuiChatComposer-root')).not.toBe(null);
  });

  it('forwards custom className via slotProps.composerRoot', () => {
    render(
      <ChatBox
        adapter={createAdapter()}
        slotProps={{ composerRoot: { className: 'custom-composer' } }}
      >
        {null}
      </ChatBox>,
    );
    expect(document.querySelector('.custom-composer')).not.toBe(null);
  });
});
