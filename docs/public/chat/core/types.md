---
productId: x-chat
title: Chat - Type augmentation
packageName: '@mui/x-chat-headless'
githubLabel: 'scope: chat'
---

# Chat - Type augmentation

Extend the type system with app-specific metadata, typed tools, data parts, and custom message parts via module augmentation.

The core package uses [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) instead of generic props for type-safe customization.
This means you declare your app-specific types once, and they flow through the entire stack — messages, stream chunks, selectors, hooks, and renderers.

The following demo shows type augmentation in practice:

```tsx
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
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { demoUsers } from 'docsx/data/chat/core/examples/shared/demoData';
import { createChunkStream } from 'docsx/data/chat/core/examples/shared/demoUtils';

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
```

## The six registry interfaces

All augmentable interfaces live under `@mui/x-chat-headless/types`:

| Interface                  | Affects                                  | Description                           |
| :------------------------- | :--------------------------------------- | :------------------------------------ |
| `ChatUserMetadata`         | `ChatUser.metadata`                      | Extra fields on user objects          |
| `ChatConversationMetadata` | `ChatConversation.metadata`              | Extra fields on conversation objects  |
| `ChatMessageMetadata`      | `ChatMessage.metadata`                   | Extra fields on message objects       |
| `ChatToolDefinitionMap`    | `ChatToolInvocation`, stream tool chunks | Typed tool input/output per tool name |
| `ChatDataPartMap`          | `ChatDataMessagePart`, data chunks       | Typed payloads per `data-*` type      |
| `ChatCustomMessagePartMap` | `ChatMessagePart`                        | Entirely new message part types       |

## How to augment

### Step 1: Declare the module

Create a type declaration file (e.g. `chat-types.d.ts`) or use `declare module` in any `.ts` file:

```ts
declare module '@mui/x-chat-headless/types' {
  interface ChatMessageMetadata {
    model?: 'gpt-4.1' | 'gpt-5';
    confidence?: 'low' | 'medium' | 'high';
  }
}
```

### Step 2: Register tool definitions

Add entries to `ChatToolDefinitionMap` to get typed `input` and `output` on tool invocations:

```ts
declare module '@mui/x-chat-headless/types' {
  interface ChatToolDefinitionMap {
    'ticket.lookup': {
      input: { ticketId: string };
      output: { status: 'open' | 'blocked' | 'resolved'; assignee: string };
    };
    weather: {
      input: { location: string; units?: 'metric' | 'imperial' };
      output: { forecast: string; temperatureC: number };
    };
  }
}
```

Once registered, `ChatToolInvocation<'weather'>` has typed `input` and `output` fields, and stream chunks like `tool-input-available` and `tool-output-available` carry the corresponding types.

### Step 3: Register data part types

Add entries to `ChatDataPartMap` to type `data-*` stream chunks and message parts:

```ts
declare module '@mui/x-chat-headless/types' {
  interface ChatDataPartMap {
    'data-citations': {
      citations: Array<{ url: string; title: string }>;
      count: number;
    };
  }
}
```

### Step 4: Register custom message parts

Add entries to `ChatCustomMessagePartMap` for entirely new part types:

```ts
declare module '@mui/x-chat-headless/types' {
  interface ChatCustomMessagePartMap {
    'ticket-summary': {
      type: 'ticket-summary';
      ticketId: string;
      severity: 'low' | 'medium' | 'high';
    };
  }
}
```

Custom parts are included in the `ChatMessagePart` union, so they appear in `message.parts` and can be rendered through `partRenderers` and `useChatPartRenderer()`.

## End-to-end example

Here is a complete augmentation that combines metadata, a typed tool, a typed data part, and a custom message part:

```ts
// chat-types.d.ts
declare module '@mui/x-chat-headless/types' {
  interface ChatUserMetadata {
    department?: string;
  }

  interface ChatMessageMetadata {
    model?: string;
    tokenCount?: number;
  }

  interface ChatToolDefinitionMap {
    'ticket.lookup': {
      input: { ticketId: string };
      output: { status: string; assignee: string };
    };
  }

  interface ChatDataPartMap {
    'data-ticket-status': {
      ticketId: string;
      status: 'open' | 'blocked' | 'resolved';
    };
  }

  interface ChatCustomMessagePartMap {
    'ticket-summary': {
      type: 'ticket-summary';
      summary: string;
      ticketId: string;
    };
  }
}
```

With this declaration in place:

- `message.metadata?.model` is typed as `string | undefined`
- `message.metadata?.tokenCount` is typed as `number | undefined`
- Tool invocations for `'ticket.lookup'` have typed `input` and `output`
- `data-ticket-status` chunks and parts carry the `ticketId` and `status` fields
- `message.parts` includes the `'ticket-summary'` variant
- `useChatPartRenderer('ticket-summary')` returns a typed renderer

## How augmentation propagates

When you add entries to the registry interfaces, TypeScript merges them into the existing types at compile time.
The effect flows through:

1. **Entity types** — `ChatMessage.metadata`, `ChatUser.metadata`, `ChatConversation.metadata` gain the declared fields.
2. **Stream chunks** — Tool and data chunks carry the registered input, output, and payload types.
3. **Message parts** — `ChatMessagePart` union expands to include custom parts.
4. **Hooks** — `useChat().messages` and `useMessage(id)` return messages with augmented types.
5. **Renderers** — `useChatPartRenderer('ticket-summary')` returns a renderer typed for the custom part.

No runtime code changes are needed. The augmentation is purely compile-time.

## Gotchas

### Module resolution

Make sure your `.d.ts` file is included in your `tsconfig.json`.
If the declaration is in a `types/` directory, add it to the `include` array:

```json
{
  "include": ["src", "types"]
}
```

### Avoid circular references

Do not import from `@mui/x-chat-headless` inside a `declare module` block.
Use inline types or import types outside the declaration:

```ts
// Good
declare module '@mui/x-chat-headless/types' {
  interface ChatMessageMetadata {
    model?: string;
  }
}

// Bad — may cause circular resolution
declare module '@mui/x-chat-headless/types' {
  import { ChatUser } from '@mui/x-chat-headless'; // avoid this
  interface ChatMessageMetadata {
    reviewer?: ChatUser;
  }
}
```

### Multiple augmentation files

You can split augmentations across multiple files. TypeScript merges all declarations for the same module. Just make sure each file is included in your `tsconfig`.

## See also

- [Hooks](/x/react-chat/core/hooks/) for `useChatPartRenderer()` and typed hook return values.
- [State and store](/x/react-chat/core/state/) for `partRenderers` registration on `ChatProvider`.
- [Streaming](/x/react-chat/core/streaming/) for how typed chunks flow through the stream.
- [Type augmentation](/x/react-chat/core/examples/type-augmentation/) for a runnable demo combining all registry interfaces.
- [Tool approval and renderers](/x/react-chat/core/examples/tool-approval-and-renderers/) for custom part rendering with the registry.

## API

- [ChatRoot](/x/api/chat/chat-root/)
