---
productId: x-chat
title: Chat - Context
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Context

Understand how ChatProvider manages state, controlled vs. uncontrolled patterns, and how to share chat context across your application.

Every chat component reads its data — messages, conversations, composer state, streaming status — from a shared store provided by `ChatProvider`.
`ChatBox` renders a `ChatProvider` internally, so in the simplest case you never interact with the provider directly.

When you need more control — sharing state with components outside `ChatBox`, controlling the message list externally, or mounting multiple independent chat instances — you work with `ChatProvider` explicitly.

## ChatBox vs. ChatProvider

### ChatBox (all-in-one)

`ChatBox` is the fastest way to render a complete chat surface.
It creates a `ChatProvider` internally and composes all the themed sub-components:

```tsx
import { ChatBox } from '@mui/x-chat';

<ChatBox adapter={adapter} sx={{ height: 500 }} />;
```

All hooks work inside any component rendered as a child or descendant of `ChatBox`. Here a `StreamingBadge` component reads the streaming status via `useChatStatus()` and displays a chip while the assistant is responding:

```tsx
'use client';
import * as React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { ChatBox } from '@mui/x-chat';
import { useChatStatus } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

function StreamingBadge() {
  const { isStreaming } = useChatStatus();
  return isStreaming ? (
    <Chip label="Responding..." color="info" size="small" />
  ) : null;
}

export default function ChatBoxWithHooks() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <StreamingBadge />
      </Box>
    </ChatBox>
  );
}

```

### ChatProvider (custom layout)

When you need full control over the layout, use `ChatProvider` directly and compose the pieces yourself:

```tsx
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatConversation,
  ChatComposer,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageInlineMeta,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatProvider, useMessageIds } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';

const CONVERSATION_ID = 'custom-layout-conv';

const adapter = createEchoAdapter();

const initialMessages = [
  createTextMessage({
    id: 'cl-msg-1',
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:58:00.000Z',
    text: 'This layout is built with ChatProvider directly. The message list and composer are composed manually.',
  }),
  createTextMessage({
    id: 'cl-msg-2',
    conversationId: CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'So I get full control over what is rendered?',
  }),
  createTextMessage({
    id: 'cl-msg-3',
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T10:01:00.000Z',
    text: 'Exactly. You pick only the pieces you need and arrange them however you like.',
  }),
];

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '1em', height: '1em' }}
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function CustomChat() {
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    (params: { id: string }) => (
      <ChatMessageGroup key={params.id} messageId={params.id}>
        <ChatMessage messageId={params.id}>
          <ChatMessageAvatar />
          <ChatMessageContent afterContent={<ChatMessageInlineMeta />} />
        </ChatMessage>
      </ChatMessageGroup>
    ),
    [],
  );

  return (
    <ChatConversation>
      <ChatMessageList renderItem={renderItem} items={messageIds} />
      <ChatComposer>
        <ChatComposerTextArea placeholder="Type a message..." />
        <ChatComposerToolbar>
          <ChatComposerSendButton aria-label="Send message">
            <SendIcon />
          </ChatComposerSendButton>
        </ChatComposerToolbar>
      </ChatComposer>
    </ChatConversation>
  );
}

export default function ChatProviderCustomLayout() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      initialMessages={initialMessages}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          boxSizing: 'border-box',
          '*, *::before, *::after': { boxSizing: 'inherit' },
        }}
      >
        <CustomChat />
      </Box>
    </ChatProvider>
  );
}

```

## Controlled and uncontrolled state

`ChatProvider` supports both controlled and uncontrolled patterns for every piece of state.
In uncontrolled mode, state lives entirely inside the store.
In controlled mode, you own the state and the provider synchronizes it.

### Messages

```tsx
{/* Uncontrolled — internal store owns the messages */}
<ChatProvider adapter={adapter} initialMessages={initialMessages}>

{/* Controlled — you own the messages array */}
<ChatProvider
  adapter={adapter}
  messages={messages}
  onMessagesChange={setMessages}
>
```

### Conversations

```tsx
{/* Uncontrolled */}
<ChatProvider
  adapter={adapter}
  initialConversations={conversations}
  initialActiveConversationId="conv-1"
>

{/* Controlled */}
<ChatProvider
  adapter={adapter}
  conversations={conversations}
  onConversationsChange={setConversations}
  activeConversationId={activeId}
  onActiveConversationChange={setActiveId}
>
```

### Composer value

```tsx
{/* Uncontrolled */}
<ChatProvider adapter={adapter} initialComposerValue="Hello">

{/* Controlled */}
<ChatProvider
  adapter={adapter}
  composerValue={composerValue}
  onComposerValueChange={setComposerValue}
>
```

### Mixed mode

You can mix controlled and uncontrolled state freely.
For example, control the active conversation while letting messages be managed internally:

```tsx
<ChatProvider
  adapter={adapter}
  activeConversationId={activeId}
  onActiveConversationChange={setActiveId}
  initialMessages={[]}
>
```

## Sharing context across the app

Place `ChatProvider` higher in the tree to share chat state with components that live outside the chat surface:

```tsx
function App() {
  return (
    <ChatProvider adapter={adapter}>
      <Header /> {/* can use hooks like useChatStatus */}
      <Sidebar /> {/* can use useConversations */}
      <MainContent /> {/* renders ChatBox or custom layout */}
    </ChatProvider>
  );
}
```

:::warning
`ChatBox` always creates its own internal `ChatProvider`. If you need to share state with external components, wrap them in a single `ChatProvider` and use the individual themed components (`ChatMessageList`, `ChatComposer`, etc.) instead of `ChatBox`.
:::

## Multiple independent instances

Each `ChatProvider` creates an isolated store.
To render multiple independent chat surfaces, use separate `ChatBox` instances — each one creates its own provider internally:

```tsx
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/examples/shared/demoData';

const supportAdapter = createEchoAdapter({
  agent: { ...demoUsers.agent, displayName: 'Support Bot' },
  respond: (text) => `Support received: "${text}". How else can I help?`,
});

const salesAdapter = createEchoAdapter({
  agent: { ...demoUsers.agent, displayName: 'Sales Bot' },
  respond: (text) => `Sales received: "${text}". Let me check our catalog.`,
});

export default function MultipleInstances() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Support
        </Typography>
        <ChatBox
          adapter={supportAdapter}
          features={{ conversationHeader: false }}
          sx={{
            height: 400,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Sales
        </Typography>
        <ChatBox
          adapter={salesAdapter}
          features={{ conversationHeader: false }}
          sx={{
            height: 400,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />
      </Box>
    </Box>
  );
}

```

## Provider props reference

| Prop                          | Type                      | Description                                             |
| :---------------------------- | :------------------------ | :------------------------------------------------------ |
| `adapter`                     | `ChatAdapter`             | **Required.** The backend adapter                       |
| `messages`                    | `ChatMessage[]`           | Controlled messages                                     |
| `initialMessages`             | `ChatMessage[]`           | Initial messages (uncontrolled)                         |
| `onMessagesChange`            | `(messages) => void`      | Called when messages change                             |
| `conversations`               | `ChatConversation[]`      | Controlled conversations                                |
| `initialConversations`        | `ChatConversation[]`      | Initial conversations (uncontrolled)                    |
| `onConversationsChange`       | `(conversations) => void` | Called when conversations change                        |
| `activeConversationId`        | `string`                  | Controlled active conversation                          |
| `initialActiveConversationId` | `string`                  | Initial active conversation (uncontrolled)              |
| `onActiveConversationChange`  | `(id) => void`            | Called when active conversation changes                 |
| `composerValue`               | `string`                  | Controlled composer text                                |
| `initialComposerValue`        | `string`                  | Initial composer text (uncontrolled)                    |
| `onComposerValueChange`       | `(value) => void`         | Called when composer value changes                      |
| `members`                     | `ChatUser[]`              | Participant metadata (avatars, names, roles)            |
| `currentUser`                 | `ChatUser`                | The current user object                                 |
| `onToolCall`                  | `ChatOnToolCall`          | Handler for tool call messages                          |
| `onFinish`                    | `ChatOnFinish`            | Called when a response finishes streaming               |
| `onData`                      | `ChatOnData`              | Called for each streaming chunk                         |
| `onError`                     | `(error) => void`         | Called on adapter errors                                |
| `streamFlushInterval`         | `number`                  | Batching interval for streaming deltas (default: 16 ms) |
| `storeClass`                  | `ChatStoreConstructor`    | Custom store class (default: ChatStore)                 |
| `partRenderers`               | `ChatPartRendererMap`     | Custom message part renderers                           |

## API

- [ChatRoot](/x/api/chat/chat-root/)
