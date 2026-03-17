import * as React from 'react';
import {
  ChatProvider,
  useChat,
  useChatPartRenderer,
  useConversation,
  type ChatAdapter,
  type ChatConversation,
  type ChatMessage,
  type ChatPartRendererMap,
  type ChatUser,
} from '@mui/x-chat-headless';
import { demoUsers } from '../shared/demoData';
import { createChunkStream } from '../shared/demoUtils';
import {
  DemoButton,
  DemoFrame,
  DemoHeading,
  DemoMessageList,
  DemoSplitLayout,
  DemoStats,
  DemoTag,
} from '../shared/DemoPrimitives';

declare module '@mui/x-chat-headless/types' {
  interface ChatUserMetadata {
    team: 'support' | 'ops';
    shift: 'day' | 'night';
  }

  interface ChatConversationMetadata {
    channel: 'support' | 'incident';
    slaMinutes: number;
    escalated: boolean;
  }

  interface ChatMessageMetadata {
    model?: 'gpt-4.1' | 'gpt-5';
    confidence?: 'medium' | 'high';
  }

  interface ChatToolDefinitionMap {
    weather: {
      input: {
        location: string;
      };
      output: {
        forecast: string;
        temperatureC: number;
      };
    };
    'inventory.search': {
      input: {
        sku: string;
        warehouse: string;
      };
      output: {
        sku: string;
        available: number;
        warehouse: string;
      };
    };
    'ticket.lookup': {
      input: {
        ticketId: string;
      };
      output: {
        status: 'open' | 'blocked' | 'resolved';
        owner: string;
        priority: 'medium' | 'high';
      };
    };
  }

  interface ChatDataPartMap {
    'data-summary': {
      citations: number;
      files: number;
      confidence: 'high' | 'medium';
    };
    'data-insight': {
      source: string;
      confidence: number;
    };
    'data-ticket-status': {
      ticketId: string;
      status: 'open' | 'blocked' | 'resolved';
      lastUpdated: string;
    };
  }

  interface ChatCustomMessagePartMap {
    'ticket-summary': {
      type: 'ticket-summary';
      ticketId: string;
      severity: 'medium' | 'high';
      summary: string;
    };
  }
}

const triageUser: ChatUser = {
  ...demoUsers.alice,
  metadata: {
    team: 'support',
    shift: 'day',
  },
};

const triageAgent: ChatUser = {
  ...demoUsers.agent,
  metadata: {
    team: 'ops',
    shift: 'day',
  },
};

const conversations: ChatConversation[] = [
  {
    id: 'triage',
    title: 'Typed extensions',
    subtitle: 'Module augmentation in action',
    readState: 'read',
    participants: [triageUser, triageAgent],
    metadata: {
      channel: 'support',
      slaMinutes: 45,
      escalated: true,
    },
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: 'typed-seed',
    conversationId: 'triage',
    role: 'assistant',
    author: triageAgent,
    status: 'sent',
    metadata: {
      model: 'gpt-5',
      confidence: 'high',
    },
    parts: [
      {
        type: 'text',
        text: 'This thread is using app-specific metadata, typed tools, typed data parts, and a custom summary card.',
      },
      {
        type: 'ticket-summary',
        ticketId: 'CHAT-128',
        severity: 'high',
        summary:
          'Checkout assistance is blocked by an expired integration token and needs ops review.',
      },
    ],
  },
];

const partRenderers: ChatPartRendererMap = {
  'ticket-summary': ({ part }) => (
    <div
      style={{
        border: '1px solid #d7dee7',
        borderRadius: 12,
        padding: 10,
        background: part.severity === 'high' ? '#fff5f3' : '#f7fafc',
        display: 'grid',
        gap: 6,
      }}
    >
      <div
        style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}
      >
        <strong>{part.ticketId}</strong>
        <DemoTag>{part.severity} severity</DemoTag>
      </div>
      <div>{part.summary}</div>
    </div>
  ),
};

const adapter: ChatAdapter = {
  async sendMessage() {
    return createChunkStream(
      [
        { type: 'start', messageId: 'typed-response' },
        { type: 'text-start', id: 'typed-response-text' },
        {
          type: 'text-delta',
          id: 'typed-response-text',
          delta:
            'The runtime is now streaming typed tool, metadata, and data-part updates.',
        },
        { type: 'text-end', id: 'typed-response-text' },
        {
          type: 'tool-input-available',
          toolCallId: 'ticket-lookup-1',
          toolName: 'ticket.lookup',
          input: {
            ticketId: 'CHAT-128',
          },
        },
        {
          type: 'tool-output-available',
          toolCallId: 'ticket-lookup-1',
          output: {
            status: 'blocked',
            owner: 'Sam',
            priority: 'high',
          },
        },
        {
          type: 'data-ticket-status',
          id: 'ticket-status-1',
          data: {
            ticketId: 'CHAT-128',
            status: 'blocked',
            lastUpdated: '10:24 UTC',
          },
        },
        {
          type: 'message-metadata',
          metadata: {
            model: 'gpt-5',
            confidence: 'high',
          },
        },
        { type: 'finish', messageId: 'typed-response', finishReason: 'stop' },
      ],
      { delayMs: 180 },
    );
  },
};

function TicketSummaryPart({
  message,
  index,
  part,
}: {
  message: ChatMessage;
  index: number;
  part: Extract<ChatMessage['parts'][number], { type: 'ticket-summary' }>;
}) {
  const renderer = useChatPartRenderer('ticket-summary');

  if (!renderer) {
    return null;
  }

  return <React.Fragment>{renderer({ part, message, index })}</React.Fragment>;
}

function isTicketLookupInvocation(
  invocation: Extract<
    ChatMessage['parts'][number],
    { type: 'tool' }
  >['toolInvocation'],
): invocation is Extract<
  ChatMessage['parts'][number],
  { type: 'tool' }
>['toolInvocation'] & {
  toolName: 'ticket.lookup';
  input?: {
    ticketId: string;
  };
  output?: {
    status: 'open' | 'blocked' | 'resolved';
    owner: string;
    priority: 'medium' | 'high';
  };
} {
  return invocation.toolName === 'ticket.lookup';
}

function renderPart(
  part: ChatMessage['parts'][number],
  message: ChatMessage,
  index: number,
) {
  if (part.type === 'text') {
    return (
      <div style={{ display: 'grid', gap: 8 }}>
        <div>{part.text}</div>
        {index === 0 ? (
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              fontSize: 12,
              color: '#5c6b7c',
            }}
          >
            {message.author?.metadata ? (
              <span>
                {message.author.metadata.team} · {message.author.metadata.shift}{' '}
                shift
              </span>
            ) : null}
            {message.metadata?.model ? (
              <span>model {message.metadata.model}</span>
            ) : null}
            {message.metadata?.confidence ? (
              <span>{message.metadata.confidence} confidence</span>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  if (part.type === 'tool') {
    const { toolInvocation } = part;
    const ticketLookup = isTicketLookupInvocation(toolInvocation)
      ? toolInvocation
      : null;

    return (
      <div
        style={{
          border: '1px solid #d7dee7',
          borderRadius: 12,
          padding: 10,
          display: 'grid',
          gap: 6,
          background: '#fff',
        }}
      >
        <div>
          <strong>{toolInvocation.toolName}</strong> · {toolInvocation.state}
        </div>
        {ticketLookup?.input ? (
          <div>Lookup ticket: {ticketLookup.input.ticketId}</div>
        ) : null}
        {ticketLookup?.output ? (
          <div>
            {ticketLookup.output.status} · owner {ticketLookup.output.owner} ·{' '}
            {ticketLookup.output.priority} priority
          </div>
        ) : null}
      </div>
    );
  }

  if (part.type === 'data-ticket-status') {
    return (
      <div
        style={{
          border: '1px solid #d7dee7',
          borderRadius: 12,
          padding: 10,
          display: 'grid',
          gap: 6,
          background: '#f7fafc',
        }}
      >
        <strong>data-ticket-status</strong>
        <div>
          {part.data.ticketId} is {part.data.status}
        </div>
        <div style={{ fontSize: 12, color: '#5c6b7c' }}>
          Last updated {part.data.lastUpdated}
        </div>
      </div>
    );
  }

  if (part.type === 'ticket-summary') {
    return <TicketSummaryPart message={message} index={index} part={part} />;
  }

  return null;
}

function TypeAugmentationInner() {
  const { messages, sendMessage, isStreaming } = useChat();
  const conversation = useConversation('triage');

  return (
    <DemoFrame>
      <DemoSplitLayout
        sidebar={
          <React.Fragment>
            <h3 style={{ margin: 0 }}>Augmented types</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#5c6b7c' }}>
              One module augmentation shapes metadata, tool payloads, data parts, and
              custom part rendering across the runtime.
            </p>
            <DemoStats
              items={[
                {
                  label: 'Channel',
                  value: conversation?.metadata?.channel ?? 'n/a',
                },
                {
                  label: 'SLA',
                  value: `${conversation?.metadata?.slaMinutes ?? 0}m`,
                },
                {
                  label: 'Escalated',
                  value: conversation?.metadata?.escalated ? 'yes' : 'no',
                },
              ]}
            />
            <DemoButton
              disabled={isStreaming}
              onClick={() =>
                void sendMessage({
                  conversationId: 'triage',
                  author: triageUser,
                  parts: [
                    {
                      type: 'text',
                      text: 'Look up ticket CHAT-128 and summarize the state.',
                    },
                  ],
                })
              }
            >
              Run typed lookup
            </DemoButton>
          </React.Fragment>
        }
      >
        <DemoHeading
          title="Type augmentation"
          description="The conversation metadata, author metadata, message metadata, tool payloads, and data part payloads are all strongly typed."
        />
        <DemoMessageList
          messages={messages}
          renderPart={renderPart}
          emptyLabel="Send a message to stream typed tool and data-part updates."
        />
      </DemoSplitLayout>
    </DemoFrame>
  );
}

export default function TypeAugmentationHeadlessChat() {
  return (
    <ChatProvider
      adapter={adapter}
      defaultConversations={conversations}
      defaultMessages={initialMessages}
      defaultActiveConversationId="triage"
      partRenderers={partRenderers}
    >
      <TypeAugmentationInner />
    </ChatProvider>
  );
}
