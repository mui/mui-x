import * as React from 'react';
import {
  ChatProvider,
  useChat,
  type ChatAdapter,
  type ChatOnToolCallPayload,
} from '@mui/x-chat-headless';
import { demoUsers } from '../shared/demoData';
import { createChunkStream } from '../shared/demoUtils';
import {
  DemoButton,
  DemoCodeBlock,
  DemoFrame,
  DemoHeading,
  DemoMessageList,
  DemoSplitLayout,
  DemoStats,
} from '../shared/DemoPrimitives';

const adapter: ChatAdapter = {
  async sendMessage() {
    return createChunkStream(
      [
        { type: 'start', messageId: 'tool-events-assistant' },
        { type: 'text-start', id: 'tool-events-text' },
        {
          type: 'text-delta',
          id: 'tool-events-text',
          delta:
            'I am checking inventory and will keep the tool state in sync as it changes.',
        },
        { type: 'text-end', id: 'tool-events-text' },
        {
          type: 'tool-input-start',
          toolCallId: 'inventory-1',
          toolName: 'inventory.search',
        },
        {
          type: 'tool-input-available',
          toolCallId: 'inventory-1',
          toolName: 'inventory.search',
          input: { sku: 'CHAIR-04', warehouse: 'prg-1' },
        },
        {
          type: 'tool-output-available',
          toolCallId: 'inventory-1',
          output: {
            sku: 'CHAIR-04',
            available: 14,
            warehouse: 'prg-1',
          },
        },
        { type: 'finish', messageId: 'tool-events-assistant', finishReason: 'stop' },
      ],
      { delayMs: 220 },
    );
  },
};

function ToolCallEventsInner() {
  const { messages, sendMessage, isStreaming } = useChat();

  return (
    <React.Fragment>
      <DemoHeading
        title="Tool call callback log"
        description="The message list reflects tool state, while the sidebar shows side effects driven by onToolCall."
        actions={
          <DemoButton
            disabled={isStreaming}
            onClick={() =>
              void sendMessage({
                conversationId: 'ops',
                author: demoUsers.alice,
                parts: [{ type: 'text', text: 'Check stock for CHAIR-04.' }],
              })
            }
          >
            Run inventory tool
          </DemoButton>
        }
      />
      <DemoMessageList
        messages={messages}
        emptyLabel="Send a message to stream a tool invocation and watch the callback log update."
      />
    </React.Fragment>
  );
}

export default function ToolCallEventsHeadlessChat() {
  const [events, setEvents] = React.useState<string[]>([]);
  const [latestState, setLatestState] = React.useState('idle');
  const [toolName, setToolName] = React.useState('none');

  const handleToolCall = React.useCallback((payload: ChatOnToolCallPayload) => {
    const entry = `${payload.toolCall.toolName} -> ${payload.toolCall.state}`;

    setToolName(payload.toolCall.toolName);
    setLatestState(payload.toolCall.state);
    setEvents((previous) => [entry, ...previous].slice(0, 8));
  }, []);

  return (
    <ChatProvider
      adapter={adapter}
      defaultActiveConversationId="ops"
      onToolCall={handleToolCall}
    >
      <DemoFrame>
        <DemoSplitLayout
          sidebar={
            <React.Fragment>
              <h3 style={{ margin: 0 }}>Side effects</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
                <code>onToolCall</code> runs outside the store, so it is a good place
                for logs, analytics, and orchestration.
              </p>
              <DemoStats
                items={[
                  { label: 'Tool', value: toolName },
                  { label: 'Latest state', value: latestState },
                  { label: 'Events', value: events.length },
                ]}
              />
              <DemoCodeBlock>
                {events.join('\n') || 'Tool events will appear here.'}
              </DemoCodeBlock>
            </React.Fragment>
          }
        >
          <ToolCallEventsInner />
        </DemoSplitLayout>
      </DemoFrame>
    </ChatProvider>
  );
}
