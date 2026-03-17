import * as React from 'react';
import {
  ChatProvider,
  useChat,
  type ChatAdapter,
  type ChatDataMessagePart,
} from '@mui/x-chat-headless';
import { demoUsers } from '../shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  getMessageText,
} from '../shared/demoUtils';
import {
  DemoButton,
  DemoCodeBlock,
  DemoFrame,
  DemoHeading,
  DemoInput,
  DemoMessageList,
  DemoSplitLayout,
} from '../shared/DemoPrimitives';

function createStreamingAdapter(): ChatAdapter {
  return {
    async sendMessage({ message }) {
      const text = getMessageText(message);

      if (text.includes('fail')) {
        return createChunkStream(
          [
            { type: 'start', messageId: 'streaming-failure' },
            { type: 'text-start', id: 'streaming-failure-text' },
            {
              type: 'text-delta',
              id: 'streaming-failure-text',
              delta: 'The stream will fail',
            },
            {
              type: 'text-delta',
              id: 'streaming-failure-text',
              delta: ' after this chunk.',
            },
          ],
          {
            delayMs: 260,
            errorAfterChunk: 3,
            error: new Error('Demo transport lost the stream.'),
          },
        );
      }

      if (text.includes('slow')) {
        return createChunkStream(
          createTextResponseChunks(
            'streaming-slow',
            'This long-running stream is useful for demonstrating stopStreaming().',
          ),
          { delayMs: 420 },
        );
      }

      return createChunkStream(
        [
          { type: 'start', messageId: 'streaming-success' },
          { type: 'text-start', id: 'streaming-success-text' },
          {
            type: 'text-delta',
            id: 'streaming-success-text',
            delta: 'Streaming updates are visible',
          },
          {
            type: 'text-delta',
            id: 'streaming-success-text',
            delta: ' before the final chunk arrives.',
          },
          {
            type: 'data-insight',
            id: 'data-1',
            data: { source: 'demo', confidence: 0.92 },
          },
          { type: 'text-end', id: 'streaming-success-text' },
          { type: 'finish', messageId: 'streaming-success', finishReason: 'stop' },
        ],
        { delayMs: 220 },
      );
    },
  };
}

export default function StreamingLifecycleHeadlessChat() {
  const adapter = React.useMemo(() => createStreamingAdapter(), []);

  return (
    <ChatProvider
      adapter={adapter}
      defaultActiveConversationId="support"
      onData={(part: ChatDataMessagePart) => {
        console.log('onData', part.type);
      }}
      onFinish={(payload) => {
        console.log(
          'onFinish',
          payload.finishReason,
          payload.isError,
          payload.isAbort,
        );
      }}
      onError={(error) => {
        console.log('onError', error.message);
      }}
    >
      <StreamingLifecycleWithLogs />
    </ChatProvider>
  );
}

function StreamingLifecycleWithLogs() {
  const { messages, isStreaming, sendMessage, stopStreaming, retry } = useChat();
  const [draft, setDraft] = React.useState('success');
  const [events, setEvents] = React.useState<string[]>([]);

  const appendLog = React.useCallback((entry: string) => {
    setEvents((previous) => [entry, ...previous].slice(0, 8));
  }, []);

  React.useEffect(() => {
    const originalLog = console.log;

    console.log = (...args: unknown[]) => {
      appendLog(
        args
          .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
          .join(' '),
      );
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, [appendLog]);

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Lifecycle controls</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              Use <code>success</code>, <code>slow</code>, or <code>fail</code> to
              drive different flows.
            </p>
            <DemoCodeBlock>
              {events.join('\n') || 'Callback events will appear here.'}
            </DemoCodeBlock>
          </React.Fragment>
        }
      >
        <DemoHeading
          title="Streaming lifecycle"
          description="This recipe shows callbacks, cancellation, errors, and retry in one headless UI."
          actions={
            <DemoButton disabled={!isStreaming} onClick={() => stopStreaming()}>
              Stop stream
            </DemoButton>
          }
        />
        <DemoMessageList messages={messages} />
        <div style={{ display: 'flex', gap: 8 }}>
          <DemoInput
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <DemoButton
            disabled={isStreaming || draft.trim() === ''}
            onClick={() =>
              void sendMessage({
                conversationId: 'support',
                author: demoUsers.alice,
                parts: [{ type: 'text', text: draft }],
              })
            }
          >
            Send
          </DemoButton>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <DemoButton onClick={() => setDraft('success')}>Success</DemoButton>
          <DemoButton onClick={() => setDraft('slow')}>Slow stream</DemoButton>
          <DemoButton onClick={() => setDraft('fail')}>Failure</DemoButton>
          {messages
            .filter(
              (message) =>
                message.role === 'user' &&
                (message.status === 'error' || message.status === 'cancelled'),
            )
            .map((message) => (
              <DemoButton key={message.id} onClick={() => void retry(message.id)}>
                Retry
              </DemoButton>
            ))}
        </div>
      </DemoSplitLayout>
    </DemoFrame>
  );
}
