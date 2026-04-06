---
productId: x-chat
title: Messages
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageList, ChatMessageGroup
---

# Chat - Messages

Understand the ChatMessage data model and how messages render in a scrollable, grouped list.



## The ChatMessage data model

Every message in the chat system is represented by the `ChatMessage` interface:

```tsx
import type { ChatMessage } from '@mui/x-chat';
```

A `ChatMessage` has the following shape:

| Field            | Type                  | Description                                                                                        |
| :--------------- | :-------------------- | :------------------------------------------------------------------------------------------------- |
| `id`             | `string`              | Unique identifier for the message                                                                  |
| `role`           | `ChatRole`            | `'user'`, `'assistant'`, or `'system'`                                                             |
| `parts`          | `ChatMessagePart[]`   | Content parts that make up the message body (text, files, tools, etc.)                             |
| `status`         | `ChatMessageStatus`   | Delivery lifecycle: `'pending'`, `'sending'`, `'streaming'`, `'sent'`, `'error'`, or `'cancelled'` |
| `author`         | `ChatUser`            | The user who sent the message (display name, avatar, role)                                         |
| `createdAt`      | `string`              | ISO 8601 timestamp when the message was created                                                    |
| `updatedAt`      | `string`              | ISO 8601 timestamp when the message was last updated                                               |
| `editedAt`       | `string`              | ISO 8601 timestamp if the message was edited                                                       |
| `conversationId` | `string`              | The conversation this message belongs to                                                           |
| `metadata`       | `ChatMessageMetadata` | Extensible metadata object for custom data                                                         |

### Message parts

The `parts` array is the core content model.
Each part has a `type` discriminant that determines how it renders:

| Part type         | Description                              |
| :---------------- | :--------------------------------------- |
| `text`            | Plain or markdown text content           |
| `reasoning`       | Model reasoning / chain-of-thought text  |
| `file`            | An attached file (image, document, etc.) |
| `source-url`      | A URL citation                           |
| `source-document` | A document citation                      |
| `tool`            | A tool call invocation and its result    |
| `step-start`      | A visual separator between agentic steps |

This part-based model means a single message can contain mixed content — for example, a text explanation followed by a code block and a source citation.

### Message status lifecycle

Messages progress through a status lifecycle:

```text
pending → sending → streaming → sent
                 \→ error
                 \→ cancelled
```

- **pending** — the message is queued but not yet dispatched to the adapter.
- **sending** — the message has been dispatched; waiting for the first response chunk.
- **streaming** — the assistant is actively generating tokens.
- **sent** — the response is complete.
- **error** — the adapter encountered an error.
- **cancelled** — the user or application cancelled the response.

## Import

```tsx
import { ChatMessageList, ChatMessageGroup, ChatMessage } from '@mui/x-chat';
```

:::info
When using `ChatBox`, the message list is already included as a built-in part of the composition.
You only need to import these components directly when building a custom layout.
:::

## Component anatomy

Inside `ChatBox`, the message list renders a subtree of themed components:

```text
ChatMessageList                     ← scrollable container
  MessageListDateDivider            ← date separator between message groups
  ChatMessageGroup                  ← groups consecutive same-author messages
    ChatMessage                     ← individual message row
      ChatMessageAvatar             ← author avatar
      ChatMessageContent            ← message bubble with part renderers
      ChatMessageMeta               ← timestamp, delivery status
      ChatMessageActions            ← hover action buttons
```

## How messages render

The `ChatMessageList` component is the scrollable region that renders conversation history.
Scroll behavior, overflow, padding, and thin scrollbar are handled out of the box.

### Message groups

Consecutive messages from the same author are grouped together into a `ChatMessageGroup`.
Within a group, only the first message displays the avatar, reducing visual repetition and making the conversation easier to scan.

The grouping window defaults to 5 minutes (300,000 ms). Customize it through `slotProps`.
The demo below sets the window to 1 minute (60,000 ms) — notice how messages more than 1 minute apart start a new group with a fresh avatar:

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';
import { createTimeWindowGroupKey } from '@mui/x-chat-headless';
import {
  createEchoAdapter,
  randomId,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = randomId();

const conversation: ChatConversation = {
  id: CONV_ID,
  title: 'Message grouping demo',
  subtitle: 'Custom grouping window',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T10:05:00.000Z',
};

// Messages from the same author spaced 30 seconds apart — well within a
// 1-minute grouping window but outside a very short one.
const messages: ChatMessage[] = [
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'First message from the user.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:30.000Z',
    text: 'Second message, sent 30 seconds later. Same group because the window is 1 minute.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:02:00.000Z',
    text: 'Third message, sent 2 minutes after the first. This starts a new group.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T10:05:00.000Z',
    text: 'With createTimeWindowGroupKey(60 000), consecutive messages from the same author are grouped only when they are less than 1 minute apart. The avatar appears only on the first message in each group.',
  }),
];

export default function MessageGrouping() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={conversation.id}
      initialConversations={[conversation]}
      initialMessages={messages}
      slotProps={{
        messageGroup: { groupKey: createTimeWindowGroupKey(60_000) },
      }}
      sx={{
        height: 400,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

### Date dividers

When consecutive messages span different calendar dates, the message list renders a date divider automatically between them.
The divider shows a localized date string and is styled as a centered label with horizontal rules.

Customize the date format through `slotProps`:

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';
import {
  createEchoAdapter,
  randomId,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = randomId();

const conversation: ChatConversation = {
  id: CONV_ID,
  title: 'Date divider demo',
  subtitle: 'Custom date formatting',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-16T10:00:00.000Z',
};

const messages: ChatMessage[] = [
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-14T15:00:00.000Z',
    text: 'Here is a message from two days ago.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:30:00.000Z',
    text: 'And this one is from yesterday.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-16T10:00:00.000Z',
    text: 'This message is from today. Notice the short date format in the dividers above.',
  }),
];

export default function DateDividerFormat() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={conversation.id}
      initialConversations={[conversation]}
      initialMessages={messages}
      slotProps={{
        dateDivider: {
          formatDate: (date: Date) =>
            date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        },
      }}
      sx={{
        height: 400,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

### Auto-scrolling

The message list automatically scrolls to the bottom when:

- The user sends a new message (always active).
- New messages arrive from the assistant while the user is near the bottom.
- Streaming content grows (token-by-token updates).

The auto-scroll behavior is gated by a buffer — if the user has scrolled more than `buffer` pixels away from the bottom, automatic scrolling pauses so the user can read earlier messages without interruption.

```tsx
'use client';
import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function AutoScrollConfig() {
  const [autoScroll, setAutoScroll] = React.useState(true);

  return (
    <div>
      <FormControlLabel
        control={
          <Switch
            checked={autoScroll}
            onChange={(event) => setAutoScroll(event.target.checked)}
          />
        }
        label="Auto-scroll"
      />
      <ChatBox
        adapter={adapter}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
        features={{ autoScroll: autoScroll ? true : false }}
        sx={{
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </div>
  );
}

```

## Standalone usage

When building a custom layout outside of `ChatBox`, use `ChatMessageList` directly inside a `ChatRoot` provider.
The demo below renders only the message list with a placeholder for a custom composer:

```tsx
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  ChatMessageList,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageInlineMeta,
  ChatConversation,
} from '@mui/x-chat';
import { ChatProvider, useMessageIds } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

function CustomLayout() {
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    ({ id }: { id: string }) => (
      <ChatMessageGroup key={id} messageId={id}>
        <ChatMessage messageId={id}>
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
      <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button variant="outlined" size="small" disabled>
          Custom composer placeholder
        </Button>
      </Box>
    </ChatConversation>
  );
}

export default function StandaloneMessageList() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <CustomLayout />
      </Box>
    </ChatProvider>
  );
}

```

## API

- [`ChatMessageList`](/x/api/chat/chat-message-list/)
- [`ChatMessageGroup`](/x/api/chat/chat-message-group/)
