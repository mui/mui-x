---
productId: x-chat
title: Message Appearance
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageGroup, ChatMessageAvatar, ChatMessageMeta, ChatDateDivider
---

# Chat - Message Appearance

Control the visual presentation of messages — grouping, date dividers, avatars, timestamps, and layout variants.

This page covers the visual aspects of how messages are displayed in the message list. For message content rendering (text, files, code blocks), see the [Message Parts](/x/react-chat/display/message-parts/text-and-markdown/) section.

## Message groups

Consecutive messages from the same author are grouped together into a `ChatMessageGroup`. Within a group, only the first message displays the avatar, reducing visual repetition and making the conversation easier to scan.

Grouping is controlled by the `groupKey` prop — a function that maps each message to a string or number. Messages that resolve to the same key are placed in the same visual group. Customize it through `slotProps`:

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { createTimeWindowGroupKey } from '@mui/x-chat/headless';
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

The default `groupKey` groups all messages from the same author together, regardless of time (falling back to role when no explicit author ID exists). Pass `createTimeWindowGroupKey(windowMs)` to also split groups at time boundaries.

## Date dividers

When consecutive messages span different calendar dates, a date divider is rendered automatically between them. The divider shows a localized date string and is styled as a centered label with horizontal rules.

Customize the date format through `slotProps`:

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
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

## Avatars

The `ChatMessageAvatar` component renders the author's avatar for the first message in each group. Avatars are sourced from the `ChatUser.avatarUrl` field on the message's author.

Within a group, subsequent messages omit the avatar entirely — the component returns `null` rather than rendering a placeholder. If no `avatarUrl` is set on the author and no custom `avatar` slot is provided, the avatar is also omitted for the first message in the group.

## Timestamps and metadata

`ChatMessageMeta` renders metadata below each message: a streaming progress bar while the message is being streamed, a delivery status label (`sent` or `read`) for outgoing messages, an "edited" label when `message.editedAt` is set, and a timestamp derived from the `createdAt` field on `ChatMessage`.

In the default layout, timestamps appear below the message bubble, aligned to the same side as the bubble (right for user messages, left for assistant messages).

## Component anatomy

Inside `ChatBox`, the message list renders this component tree:

```text
ChatMessageList                     ← scrollable container
  ChatDateDivider                   ← date separator between groups
  ChatMessageGroup                  ← groups consecutive same-author messages
    ChatMessage                     ← individual message row
      ChatMessageAvatar             ← author avatar
      ChatMessageContent            ← message bubble with part renderers
      ChatMessageMeta               ← timestamp, delivery status, streaming progress, edited label
      ChatMessageActions            ← hover action buttons
```

## Compact variant

Set `variant="compact"` on `ChatBox` to switch to a dense, messenger-style layout:

- **No bubbles** — messages render as plain text without background colors or padding.
- **Left-aligned** — all messages are left-aligned regardless of role.
- **Group header timestamps** — the timestamp moves from below each message to the group header, displayed next to the author name.
- **Avatars preserved** — avatars remain visible for the first message in each group.

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
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
  title: 'Team standup',
  subtitle: 'Daily sync',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T10:05:00.000Z',
};

const messages: ChatMessage[] = [
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:55:00.000Z',
    text: 'Good morning! Here is the agenda for today.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:55:10.000Z',
    text: 'We need to review the sprint progress and plan next steps.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'Sounds good. I finished the variant feature yesterday.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:15.000Z',
    text: 'The compact layout is ready for review.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T10:02:00.000Z',
    text: 'Great work! The compact variant removes message bubbles and aligns everything to the left — perfect for dense message feeds.',
  }),
];

export default function CompactVariant() {
  return (
    <ChatBox
      variant="compact"
      adapter={adapter}
      initialActiveConversationId={conversation.id}
      initialConversations={[conversation]}
      initialMessages={messages}
      sx={{
        height: 460,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
```

```tsx
<ChatBox variant="compact" adapter={adapter} />
```

When set on `ChatBox`, the variant automatically applies to the conversation list as well.

## Density

The `density` prop controls the vertical spacing between messages. Three values are available:

| Value         | Description                           |
| :------------ | :------------------------------------ |
| `compact`     | Tight spacing, minimal gaps           |
| `standard`    | Default spacing                       |
| `comfortable` | Generous spacing, more breathing room |

```tsx
'use client';
import * as React from 'react';
import { ChatBox, type ChatDensity } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Stack from '@mui/material/Stack';
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
  title: 'Design review',
  subtitle: 'UI team',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T14:10:00.000Z',
};

const messages: ChatMessage[] = [
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T14:00:00.000Z',
    text: 'Hey! I just pushed the updated mockups for the settings page.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T14:00:10.000Z',
    text: 'Let me know what you think about the new spacing.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T14:02:00.000Z',
    text: 'Looks great! The layout feels much more balanced now.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T14:02:15.000Z',
    text: 'One thing: can we increase the gap between the sections?',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T14:05:00.000Z',
    text: 'Sure, I will add more vertical breathing room. Give me 10 minutes.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T14:10:00.000Z',
    text: 'Perfect, take your time!',
  }),
];

export default function DensityProp() {
  const [density, setDensity] = React.useState<ChatDensity>('standard');

  return (
    <Stack spacing={2}>
      <ToggleButtonGroup
        value={density}
        exclusive
        onChange={(_, value) => {
          if (value !== null) {
            setDensity(value as ChatDensity);
          }
        }}
        size="small"
      >
        <ToggleButton value="compact">Compact</ToggleButton>
        <ToggleButton value="standard">Standard</ToggleButton>
        <ToggleButton value="comfortable">Comfortable</ToggleButton>
      </ToggleButtonGroup>
      <ChatBox
        density={density}
        adapter={adapter}
        initialActiveConversationId={conversation.id}
        initialConversations={[conversation]}
        initialMessages={messages}
        sx={{
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </Stack>
  );
}
```

```tsx
<ChatBox density="compact" adapter={adapter} />
<ChatBox density="comfortable" adapter={adapter} />
```

The `density` prop is independent of `variant` — you can combine `variant="compact"` with any density value.

## Slots

The following slots are available for customization through `ChatBox`:

| Slot             | Component            | Description               |
| :--------------- | :------------------- | :------------------------ |
| `messageList`    | `ChatMessageList`    | The scrollable container  |
| `messageRoot`    | `ChatMessage`        | Individual message row    |
| `messageAvatar`  | `ChatMessageAvatar`  | Author avatar             |
| `messageContent` | `ChatMessageContent` | Message bubble            |
| `messageMeta`    | `ChatMessageMeta`    | Timestamp, status, streaming progress, edited label |
| `messageActions` | `ChatMessageActions` | Hover action menu         |
| `messageGroup`   | `ChatMessageGroup`   | Same-author message group |
| `dateDivider`    | `ChatDateDivider`    | Date separator            |

## API

- [`ChatMessageGroup`](/x/api/chat/chat-message-group/)
- [`ChatMessageAvatar`](/x/api/chat/chat-message-avatar/)
- [`ChatMessageMeta`](/x/api/chat/chat-message-meta/)
- [`ChatDateDivider`](/x/api/chat/chat-date-divider/)

## See also

- [Message list](/x/react-chat/basics/messages/) for scrolling behavior, auto-scroll configuration, and history loading
- [Message Actions](/x/react-chat/display/message-actions/) for the hover action menu on messages
- [Loading & Empty States](/x/react-chat/display/loading-and-empty-states/) for skeleton and empty state display
