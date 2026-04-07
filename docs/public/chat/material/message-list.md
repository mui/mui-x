---
productId: x-chat
title: Chat - Message list
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: MessageListRoot, MessageListDateDivider, ScrollToBottomAffordance
---

# Chat - Message list

Display messages in a scrollable, auto-scrolling list with date dividers, message groups, and streaming indicators.



The message list is the scrollable region that renders conversation history.
`ChatMessageList` provides Material UI styling — scroll behavior, overflow, padding, and thin scrollbar are handled out of the box.

## Import

```tsx
import { ChatMessageList } from '@mui/x-chat';
```

:::info
When using `ChatBox`, the message list is already included as a built-in part of the composition.
You only need to import `ChatMessageList` directly when building a custom layout.
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

## Auto-scrolling

The message list automatically scrolls to the bottom when:

- The user sends a new message (always active).
- New messages arrive from the assistant while the user is near the bottom.
- Streaming content grows (token-by-token updates).

The auto-scroll behavior is gated by a **buffer** — if the user has scrolled more than `buffer` pixels away from the bottom, automatic scrolling pauses so the user can read earlier messages without interruption.

### Configuration

Control auto-scrolling through the `features` prop on `ChatBox`.
Use the toggle in the demo below to compare the behavior with auto-scroll enabled and disabled.
When auto-scroll is disabled, the user can still scroll to the bottom manually using the scroll-to-bottom affordance button.

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
        features={{ autoScroll }}
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

### Scroll-to-bottom affordance

A floating button appears when the user scrolls away from the bottom.
Clicking it smoothly scrolls back to the latest message:

```tsx
{
  /* Enabled by default; disable with: */
}
<ChatBox adapter={adapter} features={{ scrollToBottom: false }} />;
```

## History loading

When the user scrolls to the top of the message list, older messages are loaded automatically via the adapter's `listMessages` method.
The message list preserves the current scroll position during prepend so the user doesn't lose their place.

## Date dividers

When consecutive messages span different calendar dates, a date divider is rendered automatically between them.
The divider shows a localized date string and is styled as a centered label with horizontal rules.

Customize the date format through `slotProps`. The demo below uses a short month + day format:

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = 'date-divider-conv';

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
    id: 'dd-msg-1',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-14T15:00:00.000Z',
    text: 'Here is a message from two days ago.',
  }),
  createTextMessage({
    id: 'dd-msg-2',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:30:00.000Z',
    text: 'And this one is from yesterday.',
  }),
  createTextMessage({
    id: 'dd-msg-3',
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

## Message groups

Consecutive messages from the same author are grouped together into a `ChatMessageGroup`.
Within a group only the first message displays the avatar, reducing visual repetition and making the conversation easier to scan.

The grouping window defaults to 5 minutes (300,000 ms). Customize it through `slotProps`.
The demo below sets the window to 1 minute (60,000 ms) — notice how messages more than 1 minute apart start a new group with a fresh avatar:

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';
import { createTimeWindowGroupKey } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = 'grouping-conv';

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
    id: 'mg-msg-1',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'First message from the user.',
  }),
  createTextMessage({
    id: 'mg-msg-2',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:30.000Z',
    text: 'Second message, sent 30 seconds later. Same group because the window is 1 minute.',
  }),
  createTextMessage({
    id: 'mg-msg-3',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:02:00.000Z',
    text: 'Third message, sent 2 minutes after the first. This starts a new group.',
  }),
  createTextMessage({
    id: 'mg-msg-4',
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

## Compact variant

Set `variant="compact"` on `ChatBox` to switch to a dense, messenger-style layout.
Compact mode applies the following changes to the message list:

- **No bubbles** — messages render as plain text without background colors or padding.
- **Left-aligned** — all messages are left-aligned regardless of role (no right-aligned user messages).
- **Group header timestamps** — the timestamp moves from below each message to the group header, displayed next to the author name.
- **Avatars preserved** — avatars remain visible for the first message in each group.

When set on `ChatBox`, the variant automatically applies to the conversation list as well.

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = 'compact-conv';

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
    id: 'cv-msg-1',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:55:00.000Z',
    text: 'Good morning! Here is the agenda for today.',
  }),
  createTextMessage({
    id: 'cv-msg-2',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:55:10.000Z',
    text: 'We need to review the sprint progress and plan next steps.',
  }),
  createTextMessage({
    id: 'cv-msg-3',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'Sounds good. I finished the variant feature yesterday.',
  }),
  createTextMessage({
    id: 'cv-msg-4',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:15.000Z',
    text: 'The compact layout is ready for review.',
  }),
  createTextMessage({
    id: 'cv-msg-5',
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
      }}
    />
  );
}

```

```tsx
<ChatBox variant="compact" adapter={adapter} />
```

## Density

The `density` prop controls the vertical spacing between messages.
Three values are available — `compact`, `standard` (default), and `comfortable` — mirroring the density model used in [Data Grid](/x/react-data-grid/accessibility/#density).

Use the toggle in the demo below to compare the three density levels:

```tsx
'use client';
import * as React from 'react';
import { ChatBox, type ChatDensity } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Stack from '@mui/material/Stack';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = 'density-conv';

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
    id: 'dp-msg-1',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T14:00:00.000Z',
    text: 'Hey! I just pushed the updated mockups for the settings page.',
  }),
  createTextMessage({
    id: 'dp-msg-2',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T14:00:10.000Z',
    text: 'Let me know what you think about the new spacing.',
  }),
  createTextMessage({
    id: 'dp-msg-3',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T14:02:00.000Z',
    text: 'Looks great! The layout feels much more balanced now.',
  }),
  createTextMessage({
    id: 'dp-msg-4',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T14:02:15.000Z',
    text: 'One thing: can we increase the gap between the sections?',
  }),
  createTextMessage({
    id: 'dp-msg-5',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T14:05:00.000Z',
    text: 'Sure, I will add more vertical breathing room. Give me 10 minutes.',
  }),
  createTextMessage({
    id: 'dp-msg-6',
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

## Loading and streaming states

While the assistant is generating a response, streaming tokens are rendered incrementally inside a `ChatMessageContent` bubble.
The message list auto-scrolls to follow new content as long as the user is near the bottom.

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

## Imperative scrolling

The `ChatMessageList` exposes a ref handle for imperative scroll control:

```tsx
import { ChatMessageList } from '@mui/x-chat';
import type { MessageListRootHandle } from '@mui/x-chat';

const listRef = React.useRef<MessageListRootHandle>(null);

// Scroll to bottom programmatically
listRef.current?.scrollToBottom({ behavior: 'smooth' });

<ChatMessageList ref={listRef} />;
```

## MessageListContext

Child components inside the message list can access scroll state via context:

```tsx
import { useMessageListContext } from '@mui/x-chat';

function CustomScrollIndicator() {
  const { isAtBottom, unseenMessageCount, scrollToBottom } = useMessageListContext();

  if (isAtBottom) return null;
  return (
    <button onClick={() => scrollToBottom({ behavior: 'smooth' })}>
      {unseenMessageCount} new messages
    </button>
  );
}
```

| Property             | Type                 | Description                                  |
| :------------------- | :------------------- | :------------------------------------------- |
| `isAtBottom`         | `boolean`            | Whether the scroll position is at the bottom |
| `unseenMessageCount` | `number`             | Messages added since the user scrolled away  |
| `scrollToBottom`     | `(options?) => void` | Scroll to the latest message                 |

## Accessibility

The message list includes built-in ARIA attributes:

- The scroller element has `role="log"` and `aria-live="polite"` for screen reader announcements
- Date dividers use `role="separator"`
- The `aria-label` is derived from the locale text system

## Slots

The following slots are available for customization through `ChatBox`:

| Slot             | Component            | Description               |
| :--------------- | :------------------- | :------------------------ |
| `messageList`    | `ChatMessageList`    | The scrollable container  |
| `messageRoot`    | `ChatMessage`        | Individual message row    |
| `messageAvatar`  | `ChatMessageAvatar`  | Author avatar             |
| `messageContent` | `ChatMessageContent` | Message bubble            |
| `messageMeta`    | `ChatMessageMeta`    | Timestamp and status      |
| `messageActions` | `ChatMessageActions` | Hover action menu         |
| `messageGroup`   | `ChatMessageGroup`   | Same-author message group |
| `dateDivider`    | `ChatDateDivider`    | Date separator            |

## API

- [MessageListRoot](/x/api/chat/message-list-root/)
- [MessageListDateDivider](/x/api/chat/message-list-date-divider/)
- [ScrollToBottomAffordance](/x/api/chat/scroll-to-bottom-affordance/)
