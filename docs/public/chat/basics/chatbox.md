---
productId: x-chat
title: ChatBox
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox, ChatProvider
---

# Chat - ChatBox

The all-in-one component that renders a complete chat surface with a single import.



## Overview

`ChatBox` is the fastest way to add a chat interface to your application.
It creates a `ChatProvider` internally and composes every themed sub-component — conversation list, thread header, message list, and composer — into a ready-to-use surface:

```tsx
import { ChatBox } from '@mui/x-chat';

<ChatBox adapter={adapter} sx={{ height: 500 }} />;
```

All visual styles are derived from your active Material UI theme.
No additional configuration is needed — `ChatBox` reads `palette`, `typography`, `shape`, and `spacing` from the closest `ThemeProvider`.

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function BasicAiChat() {
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
    />
  );
}

```

## ChatBox vs. ChatProvider

### ChatBox (all-in-one)

`ChatBox` is the right choice when you want a complete chat surface with minimal setup.
It creates a `ChatProvider` internally, so all headless hooks work inside any component rendered as a child or descendant of `ChatBox`:

```tsx
'use client';
import * as React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { ChatBox } from '@mui/x-chat';
import { useChatStatus } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from 'docsx/data/chat/material/examples/shared/demoData';

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

When you need full control over the layout — for example, placing the conversation list in a sidebar and the thread in a main content area — use `ChatProvider` directly and compose the pieces yourself:

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
  ChatMessageMeta,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatProvider, useMessageIds } from '@mui/x-chat/headless';
import { createEchoAdapter, randomId } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { createTextMessage, demoUsers } from 'docsx/data/chat/material/examples/shared/demoData';

const CONVERSATION_ID = randomId();

const adapter = createEchoAdapter();

const initialMessages = [
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:58:00.000Z',
    text: 'This layout is built with ChatProvider directly. The message list and composer are composed manually.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'So I get full control over what is rendered?',
  }),
  createTextMessage({
    id: randomId(),
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
    ({ id }: { id: string }) => (
      <ChatMessageGroup key={id} messageId={id}>
        <ChatMessage messageId={id}>
          <ChatMessageAvatar />
          <ChatMessageContent />
          <ChatMessageMeta />
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

:::warning
`ChatBox` always creates its own internal `ChatProvider`. If you need to share state with external components, wrap them in a single `ChatProvider` and use the individual themed components (`ChatMessageList`, `ChatComposer`, etc.) instead of `ChatBox`.
:::

## Feature flags

`ChatBox` accepts a `features` prop that toggles built-in capabilities on or off:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    attachments: false, // hide the attach button
    helperText: false, // hide the helper text
    scrollToBottom: false, // disable scroll-to-bottom affordance
    autoScroll: { buffer: 300 }, // custom auto-scroll threshold
  }}
/>
```

Feature flags let you progressively enable functionality without replacing slots or restructuring the component tree.

## Package model

`@mui/x-chat` is the Material UI styling layer of a three-tier package family:

```text
@mui/x-chat
  -> @mui/x-chat/unstyled
       -> @mui/x-chat/headless
```

Each layer builds on the one below it:

- **Material UI** (`@mui/x-chat`) adds visual styles via Material UI `styled()` on top of the unstyled primitives.
- **Unstyled** (`@mui/x-chat/unstyled`) adds structural DOM wiring, slots, and accessibility on top of the headless runtime.
- **Headless** (`@mui/x-chat/headless`) owns state, streaming, adapters, and hooks with no DOM output.

### Choosing a layer

| If you want…                                                                   | Use                    |
| :----------------------------------------------------------------------------- | :--------------------- |
| A styled chat surface that inherits your MUI theme with minimal setup          | `@mui/x-chat`          |
| Full control over visual design using your own CSS, Tailwind, or design system | `@mui/x-chat/unstyled` |
| Complete control over DOM structure with only React state and hooks            | `@mui/x-chat/headless` |

### Package boundary

`@mui/x-chat` re-exports `@mui/x-chat/headless` and `@mui/x-chat/unstyled` through dedicated entry points:

```tsx
// Headless hooks and types
import { useChat, useChatComposer } from '@mui/x-chat/headless';

// Unstyled structural primitives
import { Chat, MessageList } from '@mui/x-chat/unstyled';
```

This means you can mix the styled layer with lower-level primitives in the same application.

## Controlled and uncontrolled state

`ChatBox` supports both controlled and uncontrolled patterns for every piece of state.
These props are forwarded to the internal `ChatProvider`.

### Messages

```tsx
{/* Uncontrolled — internal store owns the messages */}
<ChatBox adapter={adapter} initialMessages={initialMessages} />

{/* Controlled — you own the messages array */}
<ChatBox
  adapter={adapter}
  messages={messages}
  onMessagesChange={setMessages}
/>
```

### Conversations

```tsx
{/* Uncontrolled */}
<ChatBox
  adapter={adapter}
  initialConversations={conversations}
  initialActiveConversationId="conv-1"
/>

{/* Controlled */}
<ChatBox
  adapter={adapter}
  conversations={conversations}
  onConversationsChange={setConversations}
  activeConversationId={activeId}
  onActiveConversationChange={setActiveId}
/>
```

### Composer value

```tsx
{/* Uncontrolled */}
<ChatBox adapter={adapter} initialComposerValue="Hello" />

{/* Controlled */}
<ChatBox
  adapter={adapter}
  composerValue={composerValue}
  onComposerValueChange={setComposerValue}
/>
```

You can mix controlled and uncontrolled state freely.
For example, control the active conversation while letting messages be managed internally.

## Multiple independent instances

Each `ChatBox` creates its own isolated store.
To render multiple independent chat surfaces side by side, use separate `ChatBox` instances:

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

## API

- [`ChatBox`](/x/api/chat-box/)
- [`ChatProvider`](/x/api/chat-provider/)

## Next steps

- [Messages](/x/react-chat/basics/messages/) — the message data model and how messages render
- [Composer](/x/react-chat/basics/composer/) — the text input experience
- [Layout](/x/react-chat/basics/layout/) — the two-pane structure and thread-only mode
- [Variants & Density](/x/react-chat/basics/variants-and-density/) — compact variant and density levels
