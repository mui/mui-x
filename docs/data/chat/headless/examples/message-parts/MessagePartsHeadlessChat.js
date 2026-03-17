import * as React from 'react';
import { ChatProvider, useChat } from '@mui/x-chat-headless';
import { demoUsers } from '../shared/demoData';
import { createChunkStream } from '../shared/demoUtils';
import {
  DemoButton,
  DemoCodeBlock,
  DemoFrame,
  DemoHeading,
  DemoMessageList,
  DemoSplitLayout,
} from '../shared/DemoPrimitives';

const adapter = {
  async sendMessage() {
    return createChunkStream(
      [
        { type: 'start', messageId: 'parts-assistant' },
        { type: 'reasoning-start', id: 'parts-reasoning' },
        {
          type: 'reasoning-delta',
          id: 'parts-reasoning',
          delta:
            'Scanning the docs, ranking sources, and assembling a grounded answer.',
        },
        { type: 'reasoning-end', id: 'parts-reasoning' },
        { type: 'start-step' },
        { type: 'text-start', id: 'parts-text' },
        {
          type: 'text-delta',
          id: 'parts-text',
          delta:
            'Here is a structured response with supporting links, a document extract, and a downloadable artifact.',
        },
        { type: 'text-end', id: 'parts-text' },
        {
          type: 'source-url',
          sourceId: 'source-url-1',
          url: 'https://mui.com/x/react-chat/headless/',
          title: 'Headless docs',
        },
        {
          type: 'source-document',
          sourceId: 'source-document-1',
          title: 'Adapter checklist',
          text: 'Adapters should return a ReadableStream and emit terminal chunks such as finish or abort.',
        },
        {
          type: 'file',
          url: 'https://mui.com/static/x-logo.svg',
          filename: 'chat-research.svg',
          mediaType: 'image/svg+xml',
        },
        {
          type: 'data-summary',
          id: 'data-summary-1',
          data: {
            citations: 2,
            files: 1,
            confidence: 'high',
          },
        },
        { type: 'finish-step' },
        { type: 'finish', messageId: 'parts-assistant', finishReason: 'stop' },
      ],
      { delayMs: 180 },
    );
  },
};

const partStyles = {
  card: {
    border: '1px solid #d7dee7',
    borderRadius: 12,
    padding: 10,
    background: '#fff',
  },
  subtle: {
    color: '#5c6b7c',
    fontSize: 12,
  },
  badge: {
    display: 'inline-flex',
    borderRadius: 999,
    padding: '3px 8px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    background: '#eef6ff',
    color: '#0b4f8a',
  },
};

function renderPart(part, _message, index) {
  if (part.type === 'reasoning') {
    return (
      <div style={{ ...partStyles.card, background: '#f7fafc' }}>
        <div style={partStyles.badge}>Reasoning</div>
        <div style={{ marginTop: 8 }}>{part.text}</div>
      </div>
    );
  }

  if (part.type === 'text') {
    return <div>{part.text}</div>;
  }

  if (part.type === 'source-url') {
    return (
      <div style={partStyles.card}>
        <div style={partStyles.badge}>Source URL</div>
        <a
          href={part.url}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'block', marginTop: 8 }}
        >
          {part.title ?? part.url}
        </a>
      </div>
    );
  }

  if (part.type === 'source-document') {
    return (
      <div style={partStyles.card}>
        <div style={partStyles.badge}>Source document</div>
        <div style={{ marginTop: 8, fontWeight: 700 }}>
          {part.title ?? 'Document excerpt'}
        </div>
        <div style={{ marginTop: 4 }}>{part.text}</div>
      </div>
    );
  }

  if (part.type === 'file') {
    return (
      <div style={partStyles.card}>
        <div style={partStyles.badge}>File</div>
        <a
          href={part.url}
          target="_blank"
          rel="noreferrer"
          style={{ display: 'block', marginTop: 8 }}
        >
          {part.filename ?? part.url}
        </a>
        <div style={{ ...partStyles.subtle, marginTop: 4 }}>{part.mediaType}</div>
      </div>
    );
  }

  if (part.type === 'step-start') {
    return (
      <div style={{ ...partStyles.badge, background: '#edf2f8', color: '#334a62' }}>
        Step {index + 1}
      </div>
    );
  }

  if (part.type.startsWith('data-') && 'data' in part) {
    return (
      <div style={partStyles.card}>
        <div style={partStyles.badge}>{part.type}</div>
        <DemoCodeBlock>{JSON.stringify(part.data, null, 2)}</DemoCodeBlock>
      </div>
    );
  }

  return null;
}

function MessagePartsInner() {
  const { messages, sendMessage, isStreaming } = useChat();

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Part model</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              Headless messages are arrays of parts. This demo renders each part type
              with plain React branches.
            </p>
            <DemoButton
              disabled={isStreaming}
              onClick={() =>
                void sendMessage({
                  conversationId: 'research',
                  author: demoUsers.alice,
                  parts: [
                    {
                      type: 'text',
                      text: 'Summarize the adapter contract with supporting evidence.',
                    },
                  ],
                })
              }
            >
              Generate rich answer
            </DemoButton>
          </React.Fragment>
        }
      >
        <DemoHeading
          title="Assistant message parts"
          description="Reasoning, sources, files, and data parts all flow through the same message array."
        />
        <DemoMessageList
          messages={messages}
          renderPart={renderPart}
          emptyLabel="Send a message to stream a multi-part assistant response."
        />
      </DemoSplitLayout>
    </DemoFrame>
  );
}

export default function MessagePartsHeadlessChat() {
  return (
    <ChatProvider adapter={adapter} defaultActiveConversationId="research">
      <MessagePartsInner />
    </ChatProvider>
  );
}
