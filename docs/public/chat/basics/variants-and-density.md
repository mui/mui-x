---
productId: x-chat
title: Variants & Density
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Variants & Density

Switch between the default bubble layout and a compact messenger-style layout, and control vertical spacing with the density prop.

## Variants

`ChatBox` supports two visual variants that control how messages are laid out: **default** and **compact**.

### Default variant

The default variant renders messages as colored bubbles.
The default variant right-aligns user messages with a primary-colored background and left-aligns assistant messages with a neutral background.
Timestamps appear below each message.
This is the standard layout used by most AI chat interfaces.

### Compact variant

Set `variant="compact"` on `ChatBox` to switch to a dense, messenger-style layout:

```tsx
<ChatBox variant="compact" adapter={adapter} />
```

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

### When to use each variant

| Scenario                                            | Recommended variant |
| :-------------------------------------------------- | :------------------ |
| AI assistant interface (single bot, longer replies) | Default             |
| Team messaging or multi-party chat                  | Compact             |
| Customer support widget                             | Default             |
| Slack/Discord-style channel view                    | Compact             |
| Code review or agentic workflows                    | Default             |

The compact variant is particularly effective for conversations with many short messages from multiple participants, where bubbles would create excessive visual noise.

## Density

The `density` prop controls the vertical spacing between messages independently of the variant.
Three values are available — `compact`, `standard` (default), and `comfortable` — mirroring the density model used in [Data Grid](/x/react-data-grid/accessibility/#density).

```tsx
<ChatBox density="compact" adapter={adapter} />
<ChatBox density="standard" adapter={adapter} />
<ChatBox density="comfortable" adapter={adapter} />
```

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

### Density effects

| Density       | Vertical gap between messages | Use case                               |
| :------------ | :---------------------------- | :------------------------------------- |
| `compact`     | Minimal                       | Dense information displays, dashboards |
| `standard`    | Default                       | General-purpose chat                   |
| `comfortable` | Generous                      | Accessibility, relaxed reading         |

### Combining variant and density

The `density` prop is independent of `variant` — you can combine `variant="compact"` with any density value:

```tsx
{
  /* Dense messenger-style layout with minimal spacing */
}
<ChatBox variant="compact" density="compact" adapter={adapter} />;

{
  /* Dense messenger-style layout with generous spacing */
}
<ChatBox variant="compact" density="comfortable" adapter={adapter} />;
```

This independence gives you fine-grained control over both the visual style (bubbles vs. plain text) and the spatial rhythm (tight vs. relaxed) of the chat surface.
