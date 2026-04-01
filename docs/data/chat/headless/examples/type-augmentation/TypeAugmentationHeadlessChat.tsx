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
} from '@mui/x-chat/headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { demoUsers } from 'docsx/data/chat/headless/examples/shared/demoData';
import { createChunkStream } from 'docsx/data/chat/headless/examples/shared/demoUtils';

declare module '@mui/x-chat/headless/types' {
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
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="body2" fontWeight={700}>
          {part.ticketId}
        </Typography>
        <Chip
          size="small"
          label={`${part.severity} severity`}
          color={part.severity === 'high' ? 'error' : 'default'}
        />
      </Stack>
      <Typography variant="body2">{part.summary}</Typography>
    </Paper>
  ),
};

const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    const messageId = `typed-response-${message.id}`;
    const textId = `${messageId}-text`;
    const toolCallId = `ticket-lookup-${message.id}`;

    return createChunkStream(
      [
        { type: 'start', messageId },
        { type: 'text-start', id: textId },
        {
          type: 'text-delta',
          id: textId,
          delta:
            'The runtime is now streaming typed tool, metadata, and data-part updates.',
        },
        { type: 'text-end', id: textId },
        {
          type: 'tool-input-available',
          toolCallId,
          toolName: 'ticket.lookup',
          input: {
            ticketId: 'CHAT-128',
          },
        },
        {
          type: 'tool-output-available',
          toolCallId,
          output: {
            status: 'blocked',
            owner: 'Sam',
            priority: 'high',
          },
        },
        {
          type: 'data-ticket-status',
          id: `${messageId}-ticket-status`,
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
        { type: 'finish', messageId, finishReason: 'stop' },
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
      <Box sx={{ display: 'grid', gap: 1 }}>
        <Typography variant="body2">{part.text}</Typography>
        {index === 0 ? (
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
            {message.author?.metadata ? (
              <Chip
                size="small"
                label={`${message.author.metadata.team} \u00b7 ${message.author.metadata.shift} shift`}
              />
            ) : null}
            {message.metadata?.model ? (
              <Chip size="small" label={`model ${message.metadata.model}`} />
            ) : null}
            {message.metadata?.confidence ? (
              <Chip
                size="small"
                label={`${message.metadata.confidence} confidence`}
              />
            ) : null}
          </Stack>
        ) : null}
      </Box>
    );
  }

  if (part.type === 'tool') {
    const { toolInvocation } = part;
    const ticketLookup = isTicketLookupInvocation(toolInvocation)
      ? toolInvocation
      : null;

    return (
      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
        <Typography variant="body2" fontWeight={700}>
          {toolInvocation.toolName} &middot; {toolInvocation.state}
        </Typography>
        {ticketLookup?.input ? (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Lookup ticket: {ticketLookup.input.ticketId}
          </Typography>
        ) : null}
        {ticketLookup?.output ? (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {ticketLookup.output.status} &middot; owner {ticketLookup.output.owner}{' '}
            &middot; {ticketLookup.output.priority} priority
          </Typography>
        ) : null}
      </Paper>
    );
  }

  if (part.type === 'data-ticket-status') {
    return (
      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
        <Typography variant="body2" fontWeight={700}>
          data-ticket-status
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {part.data.ticketId} is <Chip size="small" label={part.data.status} />
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last updated {part.data.lastUpdated}
        </Typography>
      </Paper>
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
    <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Type augmentation
        </Typography>
        <Button
          size="small"
          variant="contained"
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
        </Button>
      </Box>

      {/* Stats */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        {[
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
        ].map((stat) => (
          <Paper
            key={stat.label}
            variant="outlined"
            sx={{ px: 1.5, py: 0.75, flex: 1, textAlign: 'center' }}
          >
            <Typography variant="caption" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography variant="body2" fontWeight={700} noWrap>
              {stat.value}
            </Typography>
          </Paper>
        ))}
      </Stack>

      {/* Messages */}
      <Box
        sx={{
          p: 2,
          minHeight: 300,
          maxHeight: 400,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {messages.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 8 }}
          >
            Send a message to stream typed tool and data-part updates.
          </Typography>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 1,
                    maxWidth: '80%',
                    bgcolor: isUser ? 'primary.main' : 'grey.100',
                    color: isUser ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: isUser ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    {message.author?.displayName ?? message.role}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    {message.parts.map((part, index) => (
                      <Box key={`${message.id}-${part.type}-${index}`}>
                        {renderPart(part, message, index)}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
}

export default function TypeAugmentationHeadlessChat() {
  return (
    <ChatProvider
      adapter={adapter}
      initialConversations={conversations}
      initialMessages={initialMessages}
      initialActiveConversationId="triage"
      partRenderers={partRenderers}
    >
      <TypeAugmentationInner />
    </ChatProvider>
  );
}
