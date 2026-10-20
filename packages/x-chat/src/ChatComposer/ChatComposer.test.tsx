import * as React from 'react';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ChatProvider } from '@mui/x-chat-headless';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '../ChatBox/ChatBox';
import { ChatComposer } from './ChatComposer';

const { render } = createRenderer();

function createAdapter(overrides: Partial<ChatAdapter> = {}): ChatAdapter {
  return {
    async sendMessage() {
      return new ReadableStream({
        start(c) {
          c.close();
        },
      });
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

  it('forwards custom className via slotProps.composer', () => {
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

  describe('attachment config', () => {
    function selectNonPdfFile() {
      const input = document.querySelector('input[type="file"]');
      if (!(input instanceof HTMLInputElement)) {
        throw new Error('File input not found');
      }
      expect(input.getAttribute('accept')).to.equal('application/pdf');
      fireEvent.change(input, {
        target: { files: [new File(['x'], 'a.txt', { type: 'text/plain' })] },
      });
    }

    it('applies features.attachments passed to ChatBox', () => {
      const onAttachmentReject = vi.fn();
      render(
        <ChatBox
          adapter={createAdapter()}
          features={{ attachments: { acceptedMimeTypes: ['application/pdf'], onAttachmentReject } }}
        />,
      );
      selectNonPdfFile();
      expect(onAttachmentReject).toHaveBeenCalledTimes(1);
    });

    it('applies the attachmentConfig prop', () => {
      const onAttachmentReject = vi.fn();
      render(
        <ChatProvider adapter={createAdapter()}>
          <ChatComposer
            attachmentConfig={{ acceptedMimeTypes: ['application/pdf'], onAttachmentReject }}
          />
        </ChatProvider>,
      );
      selectNonPdfFile();
      expect(onAttachmentReject).toHaveBeenCalledTimes(1);
    });
  });
});
