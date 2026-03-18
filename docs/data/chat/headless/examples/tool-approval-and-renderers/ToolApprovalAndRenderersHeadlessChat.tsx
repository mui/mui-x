import * as React from 'react';
import {
  ChatProvider,
  useChat,
  useChatPartRenderer,
  type ChatAdapter,
  type ChatMessage,
  type ChatRealtimeEvent,
  type ChatPartRendererMap,
} from '@mui/x-chat-headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { demoUsers } from '../shared/demoData';
import { createChunkStream } from '../shared/demoUtils';

declare module '@mui/x-chat-headless/types' {
  interface ChatCustomMessagePartMap {
    poll: {
      type: 'poll';
      question: string;
      options: string[];
    };
  }
}

function createToolAdapter() {
  let onEventRef: ((event: ChatRealtimeEvent) => void) | null = null;
  let callCounter = 0;
  let latestAssistantMessage: ChatMessage | null = null;

  const pollPart: Extract<ChatMessage['parts'][number], { type: 'poll' }> = {
    type: 'poll',
    question: 'Was this approval flow understandable?',
    options: ['Yes', 'Mostly', 'Needs work'],
  };

  return {
    adapter: {
      async sendMessage() {
        callCounter += 1;
        const messageId = `assistant-tool-${callCounter}`;
        const textId = `assistant-tool-text-${callCounter}`;
        const toolCallId = `weather-approval-${callCounter}`;

        latestAssistantMessage = {
          id: messageId,
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
                toolCallId,
                toolName: 'weather',
                state: 'approval-requested',
                input: { location: 'Prague' },
              },
            },
          ],
        };

        return createChunkStream(
          [
            { type: 'start', messageId },
            { type: 'text-start', id: textId },
            {
              type: 'text-delta',
              id: textId,
              delta:
                'I can fetch the weather, but the tool call needs approval first.',
            },
            { type: 'text-end', id: textId },
            {
              type: 'tool-approval-request',
              toolCallId,
              toolName: 'weather',
              input: { location: 'Prague' },
            },
            {
              type: 'finish',
              messageId,
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
        if (!latestAssistantMessage) {
          return;
        }

        // 1. Update the tool invocation state on the current message
        onEventRef?.({
          type: 'message-updated',
          message: {
            ...latestAssistantMessage,
            parts: [
              latestAssistantMessage.parts[0],
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

        // 2. Emit a follow-up assistant message after a short delay
        setTimeout(() => {
          const followUpText = approved
            ? 'The weather in Prague is Cloudy with a temperature of 18 °C.'
            : `The weather tool call was denied${reason ? `: ${reason}` : ''}. Let me know if you change your mind.`;

          onEventRef?.({
            type: 'message-added',
            message: {
              id: `assistant-followup-${id}`,
              conversationId: 'tools',
              role: 'assistant',
              author: demoUsers.agent,
              status: 'sent',
              parts: [{ type: 'text', text: followUpText }],
            },
          });
        }, 400);
      },
    } satisfies ChatAdapter,
  };
}

function PollPart({
  message,
  index,
  part,
}: {
  message: ChatMessage;
  index: number;
  part: Extract<ChatMessage['parts'][number], { type: 'poll' }>;
}) {
  const renderer = useChatPartRenderer('poll');

  if (!renderer) {
    return null;
  }

  return <React.Fragment>{renderer({ part, message, index })}</React.Fragment>;
}

function ToolAndRendererInner() {
  const { messages, sendMessage, addToolApprovalResponse } = useChat();

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Tool approval and custom renderers
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Approve or deny the tool call, then render the custom poll part through
            the registry.
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            void sendMessage({
              conversationId: 'tools',
              author: demoUsers.alice,
              parts: [{ type: 'text', text: 'Check the weather for Prague.' }],
            })
          }
        >
          Request weather tool
        </Button>
      </Box>

      {/* Message list */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          p: 2,
          minHeight: 280,
        }}
      >
        {messages.map((message) => (
          <Paper key={message.id} variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {message.role}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <Typography variant="body2" key={`${message.id}-text-${index}`}>
                      {part.text}
                    </Typography>
                  );
                }

                if (part.type === 'tool') {
                  return (
                    <Box key={`${message.id}-tool-${index}`}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2">
                        <strong>{part.toolInvocation.toolName}</strong>
                        {' · '}
                        {part.toolInvocation.state}
                      </Typography>
                      {part.toolInvocation.output ? (
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            mt: 1,
                            bgcolor: 'grey.900',
                            color: 'grey.100',
                            fontFamily: 'monospace',
                            fontSize: 12,
                            maxHeight: 160,
                            overflow: 'auto',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {JSON.stringify(part.toolInvocation.output, null, 2)}
                        </Paper>
                      ) : null}
                      {part.toolInvocation.state === 'output-denied' ? (
                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                          {part.toolInvocation.approval?.reason ??
                            'Tool execution was denied'}
                        </Typography>
                      ) : null}
                      {part.toolInvocation.state === 'approval-requested' ? (
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() =>
                              void addToolApprovalResponse({
                                id: part.toolInvocation.toolCallId,
                                approved: true,
                                reason: 'Safe demo tool',
                              })
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() =>
                              void addToolApprovalResponse({
                                id: part.toolInvocation.toolCallId,
                                approved: false,
                                reason: 'No tool execution in this run',
                              })
                            }
                          >
                            Deny
                          </Button>
                        </Stack>
                      ) : null}
                    </Box>
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
            </Box>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}

const partRenderers: ChatPartRendererMap = {
  poll: ({ part }) => (
    <Box>
      <Divider sx={{ my: 1 }} />
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
        {part.question}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {part.options.map((option: string) => (
          <Chip key={option} label={option} variant="outlined" />
        ))}
      </Stack>
    </Box>
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
