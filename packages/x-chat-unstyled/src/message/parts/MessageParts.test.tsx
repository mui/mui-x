import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, expect, it } from 'vitest';
import type { ChatAdapter, ChatMessage } from '@mui/x-chat-headless';
import { ChatRoot } from '../../chat/ChatRoot';
import {
  getDefaultMessagePartRenderer,
  renderDefaultDataPart,
  renderDefaultDynamicToolPart,
  renderDefaultFilePart,
  renderDefaultReasoningPart,
  renderDefaultSourceDocumentPart,
  renderDefaultSourceUrlPart,
  renderDefaultStepStartPart,
  renderDefaultTextPart,
  renderDefaultToolPart,
} from '../defaultMessagePartRenderers';
import { MessageContent } from '../MessageContent';
import { MessageRoot } from '../MessageRoot';

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
        <MessageContent data-testid="message-content" />
      </MessageRoot>
    </ChatRoot>,
  );
}

describe('ReasoningPart', () => {
  it('renders <details> with summary and text', () => {
    renderWithMessage({
      id: 'm1',
      role: 'assistant',
      parts: [{ type: 'reasoning', text: 'Some chain of thought' }],
    });

    expect(screen.getByText('Reasoning')).not.to.equal(null);
    expect(screen.getByText('Some chain of thought')).not.to.equal(null);
  });

  it('opens when streaming', () => {
    renderWithMessage({
      id: 'm1',
      role: 'assistant',
      status: 'streaming',
      parts: [{ type: 'reasoning', text: 'Some reasoning', state: 'streaming' }],
    });

    // Default streaming label is "Thinking..."
    expect(screen.getByText('Thinking...')).not.to.equal(null);
    // The details element should be open when streaming
    const details = screen.getByText('Thinking...').closest('details');

    expect(details).not.to.equal(null);
    expect(details!.hasAttribute('open')).to.equal(true);
  });

  it('uses locale label for streaming vs done', () => {
    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          {
            id: 'm1',
            role: 'assistant',
            parts: [{ type: 'reasoning', text: 'Done thinking' }],
          },
        ]}
        localeText={{ messageReasoningLabel: 'Denken' }}
      >
        <MessageRoot messageId="m1">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByText('Denken')).not.to.equal(null);
  });

  it('supports custom slots', () => {
    function CustomSummary(props: React.HTMLAttributes<HTMLElement> & { ownerState?: any }) {
      const { ownerState, ...other } = props;

      return <summary data-testid="custom-summary" {...other} />;
    }

    render(
      <ChatRoot
        adapter={createAdapter()}
        initialMessages={[
          {
            id: 'm1',
            role: 'assistant',
            parts: [{ type: 'reasoning', text: 'Think' }],
          },
        ]}
        partRenderers={{
          reasoning: (rendererProps) => (
            <details>
              <CustomSummary>{rendererProps.part.text}</CustomSummary>
            </details>
          ),
        }}
      >
        <MessageRoot messageId="m1">
          <MessageContent />
        </MessageRoot>
      </ChatRoot>,
    );

    expect(screen.getByTestId('custom-summary')).not.to.equal(null);
  });
});

describe('FilePart', () => {
  it('renders <img> inside link for image mediaType', () => {
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

    const img = screen.getByAltText('img.png');

    expect(img).not.to.equal(null);
    expect(img).to.have.attribute('src', 'https://example.com/img.png');
  });

  it('renders file icon + filename for non-image', () => {
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

    expect(screen.getByText('doc.pdf')).not.to.equal(null);
  });

  it('falls back to URL when no filename', () => {
    renderWithMessage({
      id: 'm1',
      role: 'assistant',
      parts: [
        {
          type: 'file',
          mediaType: 'application/pdf',
          url: 'https://example.com/doc.pdf',
        },
      ],
    });

    expect(screen.getByText('https://example.com/doc.pdf')).not.to.equal(null);
  });
});

describe('SourceUrlPart', () => {
  it('renders <a> with target="_blank", rel="noreferrer noopener"', () => {
    renderWithMessage({
      id: 'm1',
      role: 'assistant',
      parts: [
        {
          type: 'source-url',
          sourceId: 's1',
          url: 'https://mui.com',
          title: 'MUI Docs',
        },
      ],
    });

    const link = screen.getByText('MUI Docs');

    expect(link.closest('a')).to.have.attribute('target', '_blank');
    expect(link.closest('a')).to.have.attribute('rel', 'noreferrer noopener');
  });

  it('uses title as link text, falls back to URL', () => {
    renderWithMessage({
      id: 'm1',
      role: 'assistant',
      parts: [
        {
          type: 'source-url',
          sourceId: 's1',
          url: 'https://mui.com/x',
        },
      ],
    });

    expect(screen.getByText('https://mui.com/x')).not.to.equal(null);
  });
});

describe('SourceDocumentPart', () => {
  it('renders title when present', () => {
    renderWithMessage({
      id: 'm1',
      role: 'assistant',
      parts: [
        {
          type: 'source-document',
          sourceId: 'd1',
          title: 'Doc Title',
          text: 'Doc text',
        },
      ],
    });

    expect(screen.getByText('Doc Title')).not.to.equal(null);
  });

  it('renders text when present', () => {
    renderWithMessage({
      id: 'm1',
      role: 'assistant',
      parts: [
        {
          type: 'source-document',
          sourceId: 'd1',
          text: 'Some excerpt',
        },
      ],
    });

    expect(screen.getByText('Some excerpt')).not.to.equal(null);
  });

  it('renders empty root when neither title nor text', () => {
    renderWithMessage({
      id: 'm1',
      role: 'assistant',
      parts: [
        {
          type: 'source-document',
          sourceId: 'd1',
        },
      ],
    });

    // Should not crash; the root is still rendered
    expect(screen.getByTestId('message-content').textContent).to.equal('');
  });
});

describe('defaultMessagePartRenderers', () => {
  it('getDefaultMessagePartRenderer returns correct renderer for text', () => {
    expect(getDefaultMessagePartRenderer({ type: 'text', text: 'hi' })).toBe(renderDefaultTextPart);
  });

  it('getDefaultMessagePartRenderer returns correct renderer for reasoning', () => {
    expect(getDefaultMessagePartRenderer({ type: 'reasoning', text: 'x' })).toBe(
      renderDefaultReasoningPart,
    );
  });

  it('getDefaultMessagePartRenderer returns correct renderer for tool', () => {
    expect(
      getDefaultMessagePartRenderer({
        type: 'tool',
        toolInvocation: {
          toolCallId: 't1',
          toolName: 'x',
          state: 'output-available',
          input: {},
          output: {},
        },
      }),
    ).toBe(renderDefaultToolPart);
  });

  it('getDefaultMessagePartRenderer returns correct renderer for dynamic-tool', () => {
    expect(
      getDefaultMessagePartRenderer({
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: 't1',
          toolName: 'x',
          state: 'output-available',
          input: {},
          output: {},
        },
      }),
    ).toBe(renderDefaultDynamicToolPart);
  });

  it('getDefaultMessagePartRenderer returns correct renderer for file', () => {
    expect(
      getDefaultMessagePartRenderer({
        type: 'file',
        mediaType: 'image/png',
        url: 'http://example.com/a.png',
      }),
    ).toBe(renderDefaultFilePart);
  });

  it('getDefaultMessagePartRenderer returns correct renderer for source-url', () => {
    expect(
      getDefaultMessagePartRenderer({ type: 'source-url', sourceId: 's1', url: 'http://x.com' }),
    ).toBe(renderDefaultSourceUrlPart);
  });

  it('getDefaultMessagePartRenderer returns correct renderer for source-document', () => {
    expect(getDefaultMessagePartRenderer({ type: 'source-document', sourceId: 'd1' })).toBe(
      renderDefaultSourceDocumentPart,
    );
  });

  it('getDefaultMessagePartRenderer returns correct renderer for step-start', () => {
    expect(getDefaultMessagePartRenderer({ type: 'step-start' })).toBe(renderDefaultStepStartPart);
  });

  it('getDefaultMessagePartRenderer returns data renderer for data-* types', () => {
    expect(
      getDefaultMessagePartRenderer({
        type: 'data-weather',
        data: { temp: 20 },
      } as any),
    ).toBe(renderDefaultDataPart);
  });

  it('getDefaultMessagePartRenderer returns null for unknown types', () => {
    expect(getDefaultMessagePartRenderer({ type: 'totally-unknown' } as any)).to.equal(null);
  });
});
