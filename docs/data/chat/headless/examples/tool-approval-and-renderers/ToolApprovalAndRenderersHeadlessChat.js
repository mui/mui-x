import * as React from 'react';
import { ChatProvider, useChat, useChatPartRenderer } from '@mui/x-chat-headless';
import { demoUsers } from '../shared/demoData';
import { createChunkStream } from '../shared/demoUtils';
import {
  DemoButton,
  DemoFrame,
  DemoHeading,
  DemoSplitLayout,
} from '../shared/DemoPrimitives';

function createToolAdapter() {
  let onEventRef = null;
  const pollPart = {
    type: 'poll',
    question: 'Was this approval flow understandable?',
    options: ['Yes', 'Mostly', 'Needs work'],
  };

  const baseAssistantMessage = {
    id: 'assistant-tool',
    conversationId: 'tools',
    role: 'assistant',
    author: demoUsers.agent,
    status: 'sent',
    parts: [
      {
        type: 'text',
        text: 'I can fetch the weather, but the tool call needs approval first.',
      },
      {
        type: 'tool',
        toolInvocation: {
          toolCallId: 'weather-approval',
          toolName: 'weather',
          state: 'approval-requested',
          input: { location: 'Prague' },
        },
      },
    ],
  };

  return {
    adapter: {
      async sendMessage() {
        return createChunkStream(
          [
            { type: 'start', messageId: 'assistant-tool' },
            { type: 'text-start', id: 'assistant-tool-text' },
            {
              type: 'text-delta',
              id: 'assistant-tool-text',
              delta:
                'I can fetch the weather, but the tool call needs approval first.',
            },
            { type: 'text-end', id: 'assistant-tool-text' },
            {
              type: 'tool-approval-request',
              toolCallId: 'weather-approval',
              toolName: 'weather',
              input: { location: 'Prague' },
            },
            {
              type: 'finish',
              messageId: 'assistant-tool',
              finishReason: 'tool-call',
            },
          ],
          { delayMs: 220 },
        );
      },
      subscribe({ onEvent }) {
        onEventRef = onEvent;
        return () => {
          onEventRef = null;
        };
      },
      async addToolApprovalResponse({ id, approved, reason }) {
        onEventRef?.({
          type: 'message-updated',
          message: {
            ...baseAssistantMessage,
            parts: [
              baseAssistantMessage.parts[0],
              {
                type: 'tool',
                toolInvocation: {
                  toolCallId: id,
                  toolName: 'weather',
                  state: approved ? 'output-available' : 'output-denied',
                  input: { location: 'Prague' },
                  approval: {
                    approved,
                    reason,
                  },
                  output: approved
                    ? {
                        forecast: 'Cloudy',
                        temperatureC: 18,
                      }
                    : undefined,
                },
              },
              ...(approved ? [pollPart] : []),
            ],
          },
        });
      },
    },
  };
}

function PollPart({ message, index, part }) {
  const renderer = useChatPartRenderer('poll');

  if (!renderer) {
    return null;
  }

  return <React.Fragment>{renderer({ part, message, index })}</React.Fragment>;
}

function ToolAndRendererInner() {
  const { messages, sendMessage, addToolApprovalResponse } = useChat();

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Extension points</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              This recipe combines tool approval with a custom part renderer.
            </p>
            <DemoButton
              onClick={() =>
                void sendMessage({
                  conversationId: 'tools',
                  author: demoUsers.alice,
                  parts: [{ type: 'text', text: 'Check the weather for Prague.' }],
                })
              }
            >
              Request weather tool
            </DemoButton>
          </React.Fragment>
        }
      >
        <DemoHeading
          title="Tool approval and custom renderers"
          description="Approve or deny the tool call, then render the custom poll part through the registry."
        />
        <div style={{ display: 'grid', gap: 10, minHeight: 280 }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                border: '1px solid #d7dee7',
                borderRadius: 12,
                padding: 12,
                background: '#fff',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 8 }}>{message.role}</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {message.parts.map((part, index) => {
                  if (part.type === 'text') {
                    return (
                      <div key={`${message.id}-text-${index}`}>{part.text}</div>
                    );
                  }

                  if (part.type === 'tool') {
                    return (
                      <div
                        key={`${message.id}-tool-${index}`}
                        style={{ borderTop: '1px dashed #d7dee7', paddingTop: 8 }}
                      >
                        <div>
                          <strong>{part.toolInvocation.toolName}</strong> ·{' '}
                          {part.toolInvocation.state}
                        </div>
                        {part.toolInvocation.output ? (
                          <pre style={{ margin: '8px 0 0', fontSize: 12 }}>
                            {JSON.stringify(part.toolInvocation.output, null, 2)}
                          </pre>
                        ) : null}
                        {part.toolInvocation.state === 'approval-requested' ? (
                          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <DemoButton
                              onClick={() =>
                                void addToolApprovalResponse({
                                  id: part.toolInvocation.toolCallId,
                                  approved: true,
                                  reason: 'Safe demo tool',
                                })
                              }
                            >
                              Approve
                            </DemoButton>
                            <DemoButton
                              onClick={() =>
                                void addToolApprovalResponse({
                                  id: part.toolInvocation.toolCallId,
                                  approved: false,
                                  reason: 'No tool execution in this run',
                                })
                              }
                            >
                              Deny
                            </DemoButton>
                          </div>
                        ) : null}
                      </div>
                    );
                  }

                  if (part.type === 'poll') {
                    return (
                      <PollPart
                        key={`${message.id}-poll-${index}`}
                        message={message}
                        index={index}
                        part={part}
                      />
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      </DemoSplitLayout>
    </DemoFrame>
  );
}

const partRenderers = {
  poll: ({ part }) => (
    <div
      style={{
        borderTop: '1px dashed #d7dee7',
        paddingTop: 8,
        display: 'grid',
        gap: 6,
      }}
    >
      <strong>{part.question}</strong>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {part.options.map((option) => (
          <span
            key={option}
            style={{
              border: '1px solid #c4d0dd',
              borderRadius: 999,
              padding: '4px 10px',
            }}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  ),
};

export default function ToolApprovalAndRenderersHeadlessChat() {
  const { adapter } = React.useMemo(() => createToolAdapter(), []);

  return (
    <ChatProvider
      adapter={adapter}
      defaultActiveConversationId="tools"
      partRenderers={partRenderers}
    >
      <ToolAndRendererInner />
    </ChatProvider>
  );
}
