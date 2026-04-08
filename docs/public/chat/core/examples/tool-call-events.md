---
title: Chat - Tool call events
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Tool call events

<p class="description">Observe tool invocation state changes with <code>onToolCall</code> and drive side effects outside the message list.</p>

This demo focuses on the `onToolCall` callback and how to use it for side effects that live outside the message store:

- observing tool input and output state changes
- building a local audit log from tool invocations
- reacting to specific tool names with app-level logic

## Key concepts

### The `onToolCall` callback

Register `onToolCall` on `ChatProvider` to observe every tool invocation state change during streaming:

```tsx
<ChatProvider
  adapter={adapter}
  onToolCall={({ toolCall }) => {
    console.log(`Tool "${toolCall.toolName}" is now ${toolCall.state}`);

    if (toolCall.state === 'output-available') {
      // Drive side effects — update dashboards, trigger notifications, etc.
    }
  }}
>
  <MyChat />
</ChatProvider>
```

### Tool invocation states

The `toolCall.state` field tracks the tool lifecycle:

| State                | Description                        |
| :------------------- | :--------------------------------- |
| `input-streaming`    | Tool input is being streamed       |
| `input-available`    | Tool input is fully available      |
| `approval-requested` | User approval is needed            |
| `approval-responded` | User has responded to the approval |
| `output-available`   | Tool output is ready               |
| `output-error`       | Tool execution failed              |
| `output-denied`      | User denied the tool call          |

### The `ChatOnToolCallPayload`

```ts
interface ChatOnToolCallPayload {
  toolCall: ChatToolInvocation | ChatDynamicToolInvocation;
}
```

The `toolCall` object includes `toolCallId`, `toolName`, `state`, `input`, `output`, `errorText`, and `approval` fields — all typed based on your `ChatToolDefinitionMap` augmentation.

```tsx
import * as React from 'react';
import {
  ChatProvider,
  useChat,
  type ChatAdapter,
  type ChatOnToolCallPayload,
} from '@mui/x-chat/headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { demoUsers } from 'docsx/data/chat/core/examples/shared/demoData';
import { createChunkStream } from 'docsx/data/chat/core/examples/shared/demoUtils';

const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    const messageId = `tool-events-assistant-${message.id}`;
    const textId = `${messageId}-text`;
    const toolCallId = `inventory-${message.id}`;

    return createChunkStream(
      [
        { type: 'start', messageId },
        { type: 'text-start', id: textId },
        {
          type: 'text-delta',
          id: textId,
          delta:
            'I am checking inventory and will keep the tool state in sync as it changes.',
        },
        { type: 'text-end', id: textId },
        {
          type: 'tool-input-start',
          toolCallId,
          toolName: 'inventory.search',
        },
        {
          type: 'tool-input-available',
          toolCallId,
          toolName: 'inventory.search',
          input: { sku: 'CHAIR-04', warehouse: 'prg-1' },
        },
        {
          type: 'tool-output-available',
          toolCallId,
          output: {
            sku: 'CHAIR-04',
            available: 14,
            warehouse: 'prg-1',
          },
        },
        { type: 'finish', messageId, finishReason: 'stop' },
      ],
      { delayMs: 220 },
    );
  },
};

function ToolCallEventsInner() {
  const { messages, sendMessage, isStreaming } = useChat();

  return (
    <React.Fragment>
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
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Tool call callback log
        </Typography>
        <Button
          size="small"
          variant="contained"
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
        </Button>
      </Box>

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
            Send a message to stream a tool invocation and watch the callback log
            update.
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
                  {message.parts.map((part, index) => (
                    <Typography
                      variant="body2"
                      key={`${message.id}-${part.type}-${index}`}
                    >
                      {part.type === 'text' ? part.text : null}
                      {part.type === 'tool'
                        ? `${part.toolInvocation.toolName}: ${part.toolInvocation.state}`
                        : null}
                    </Typography>
                  ))}
                </Paper>
              </Box>
            );
          })
        )}
      </Box>
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
      initialActiveConversationId="ops"
      onToolCall={handleToolCall}
    >
      <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
        <ToolCallEventsInner />

        {/* Stats */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider' }}
        >
          {[
            { label: 'Tool', value: toolName },
            { label: 'Latest state', value: latestState },
            { label: 'Events', value: events.length },
          ].map((stat) => (
            <Paper
              key={stat.label}
              variant="outlined"
              sx={{ px: 1.5, py: 0.75, flex: 1, textAlign: 'center' }}
            >
              <Typography variant="caption" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
            </Paper>
          ))}
        </Stack>

        {/* Event log */}
        <Box sx={{ px: 2, pb: 2, pt: 1 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
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
            {events.join('\n') || 'Tool events will appear here.'}
          </Paper>
        </Box>
      </Paper>
    </ChatProvider>
  );
}
```

## Key takeaways

- `onToolCall` fires on every tool state change — not just when output is available
- Use it for side effects outside the store: logging, analytics, external API calls
- Tool invocation state progresses through a well-defined lifecycle from input to output
- For approval flows, see the [Tool approval and renderers](/x/react-chat/core/examples/tool-approval-and-renderers/) demo

## See also

- [Streaming](/x/react-chat/core/streaming/) for the tool chunk protocol reference
- [Type augmentation](/x/react-chat/core/types/) for typing tool input and output
- [Tool approval and renderers](/x/react-chat/core/examples/tool-approval-and-renderers/) for approval flows and custom part rendering
- [State and store](/x/react-chat/core/state/) for all callback signatures

## API

- [ChatRoot](/x/api/chat/chat-root/)
