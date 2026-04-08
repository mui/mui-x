---
productId: x-chat
title: Chat - Core selectors
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Core selectors

Subscribe to exactly the store slices you need with memoized selectors for efficient, granular rendering.

`chatSelectors` is a collection of memoized selectors that read from the normalized chat store.
They power the built-in hooks and can also be used directly with `useChatStore()` for advanced subscriptions.

```tsx
import { chatSelectors, useChatStore } from '@mui/x-chat/headless';
```

The following demo uses selectors for efficient rendering:

```tsx
import * as React from 'react';
import {
  ChatProvider,
  useConversation,
  useConversations,
  useMessage,
  useMessageIds,
  type ChatAdapter,
  type ChatConversation,
  type ChatMessage,
} from '@mui/x-chat/headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { demoUsers } from 'docsx/data/chat/core/examples/shared/demoData';

function createMessages() {
  return Array.from({ length: 14 }, (_, index) => ({
    id: `selector-${index + 1}`,
    conversationId: 'selectors',
    role: index % 2 === 0 ? 'assistant' : 'user',
    author: index % 2 === 0 ? demoUsers.agent : demoUsers.alice,
    status: 'sent',
    parts: [
      {
        type: 'text',
        text: `Row ${index + 1} is subscribed independently.`,
      },
    ],
  })) as ChatMessage[];
}

const MessageRow = React.memo(function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  const renders = React.useRef(0);

  React.useEffect(() => {
    renders.current += 1;
  });

  if (!message) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
      <Typography variant="caption" color="text.secondary">
        {message.id} &middot; renders {renders.current}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
        {message.author?.displayName ?? message.role}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {message.parts[0]?.type === 'text' ? message.parts[0].text : null}
      </Typography>
    </Paper>
  );
});

function SelectorThread() {
  const messageIds = useMessageIds();
  const conversations = useConversations();
  const conversation = useConversation('selectors');

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {conversation?.title ?? 'Selector lab'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update one controlled message from the parent to see only the matching row
          rerender.
        </Typography>
      </Box>

      {/* Conversations */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {conversations.map((conv) => (
            <Chip
              key={conv.id}
              label={conv.title ?? conv.id}
              size="small"
              variant={conv.id === 'selectors' ? 'filled' : 'outlined'}
              color={conv.id === 'selectors' ? 'primary' : 'default'}
            />
          ))}
        </Stack>
      </Box>

      {/* Message rows */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxHeight: 480,
          overflow: 'auto',
        }}
      >
        {messageIds.map((id) => (
          <MessageRow key={id} id={id} />
        ))}
      </Box>
    </Paper>
  );
}

export default function SelectorDrivenThread() {
  const [messages, setMessages] = React.useState(createMessages);
  const [conversations] = React.useState<ChatConversation[]>([
    {
      id: 'selectors',
      title: 'Selector-driven thread',
      subtitle: 'Row-level subscriptions',
    },
  ]);

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage() {
        return new ReadableStream({
          start(controller) {
            controller.close();
          },
        });
      },
    }),
    [],
  );

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setMessages((previous) =>
              previous.map((message) =>
                message.id === 'selector-6'
                  ? {
                      ...message,
                      parts: [
                        {
                          type: 'text',
                          text: 'Only this row changed in the controlled state.',
                        },
                      ],
                    }
                  : message,
              ),
            );
          }}
        >
          Update message 6
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setMessages((previous) => [
              ...previous,
              {
                id: `selector-${previous.length + 1}`,
                conversationId: 'selectors',
                role: 'assistant',
                author: demoUsers.agent,
                status: 'sent',
                parts: [
                  {
                    type: 'text',
                    text: 'A new row appears without rerendering every item.',
                  },
                ],
              },
            ]);
          }}
        >
          Append one row
        </Button>
      </Stack>
      <ChatProvider
        adapter={adapter}
        messages={messages}
        conversations={conversations}
        activeConversationId="selectors"
      >
        <SelectorThread />
      </ChatProvider>
    </Stack>
  );
}
```

## Selector reference

### Direct state selectors

These selectors read a single field from the store and return it directly:

| Selector               | Return type                        | Description                        |
| :--------------------- | :--------------------------------- | :--------------------------------- |
| `messageIds`           | `string[]`                         | Ordered message IDs                |
| `messagesById`         | `Record<string, ChatMessage>`      | Message map by ID                  |
| `conversationIds`      | `string[]`                         | Ordered conversation IDs           |
| `conversationsById`    | `Record<string, ChatConversation>` | Conversation map by ID             |
| `activeConversationId` | `string \| undefined`              | Active conversation ID             |
| `isStreaming`          | `boolean`                          | Whether a stream is active         |
| `hasMoreHistory`       | `boolean`                          | Whether more history can be loaded |
| `error`                | `ChatError \| null`                | Current runtime error              |
| `composerValue`        | `string`                           | Current draft text                 |
| `composerAttachments`  | `ChatDraftAttachment[]`            | Draft attachments                  |

### Derived selectors

These selectors combine multiple store fields and memoize the result:

| Selector             | Return type                     | Description                                       |
| :------------------- | :------------------------------ | :------------------------------------------------ |
| `messages`           | `ChatMessage[]`                 | All messages as an array (derived from IDs + map) |
| `conversations`      | `ChatConversation[]`            | All conversations as an array                     |
| `activeConversation` | `ChatConversation \| undefined` | The active conversation record                    |
| `messageCount`       | `number`                        | Number of messages                                |
| `conversationCount`  | `number`                        | Number of conversations                           |

### Parameterized selectors

| Selector        | Signature                                              | Description                                            |
| :-------------- | :----------------------------------------------------- | :----------------------------------------------------- |
| `message`       | `(state, id: string) => ChatMessage \| undefined`      | Single message by ID                                   |
| `conversation`  | `(state, id: string) => ChatConversation \| undefined` | Single conversation by ID                              |
| `typingUserIds` | `(state, conversationId?: string) => string[]`         | User IDs typing in a conversation (defaults to active) |

## Using selectors with `useChatStore()`

The hooks `useMessageIds()`, `useMessage(id)`, and others are convenience wrappers around `useChatStore()` + `chatSelectors`.
When you need a custom derived value, use the store directly:

```tsx
import { useChatStore, chatSelectors } from '@mui/x-chat/headless';
import { useStore } from '@mui/x-internals/store';

function MessageCounter() {
  const store = useChatStore();
  const count = useStore(store, chatSelectors.messageCount);

  return <span>{count} messages</span>;
}
```

### Parameterized selectors

For selectors that take an argument, pass a selector function:

```tsx
function ConversationTitle({ id }: { id: string }) {
  const store = useChatStore();
  const conversation = useStore(store, chatSelectors.conversation, id);

  return <span>{conversation?.title ?? 'Untitled'}</span>;
}
```

## Why normalization matters

The store keeps messages and conversations in a normalized shape (`ids` + `byId` maps) rather than flat arrays.
This design has three benefits:

1. **Point updates** — Updating a single message during streaming does not rebuild the message array. Only the `messagesById` record changes.
2. **Stable references** — The `messageIds` array only changes when messages are added or removed, not when their content updates. `useMessageIds()` stays stable during streaming.
3. **Memoized derivation** — The `messages` selector rebuilds the array only when either `messageIds` or `messagesById` changes, and the result is reference-equal when inputs are unchanged.

This is why the `useMessageIds()` + `useMessage(id)` pattern performs well for large threads — the ID list stays stable while individual rows subscribe to their own message record.

## See also

- [Hooks](/x/react-chat/core/hooks/) for the hook API that wraps these selectors.
- [State and store](/x/react-chat/core/state/) for the internal state shape and controlled/uncontrolled models.
- [Advanced store access](/x/react-chat/core/examples/advanced-store-access/) for a demo using `useChatStore()` with custom selectors.
- [Selector-driven thread](/x/react-chat/core/examples/selector-driven-thread/) for the row-level subscription pattern in action.

## API

- [ChatRoot](/x/api/chat/chat-root/)
