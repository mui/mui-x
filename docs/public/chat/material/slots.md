---
productId: x-chat
title: Chat - Slots
packageName: '@mui/x-chat'
---

# Slots

<p class="description">Every region of the chat surface can be replaced or customized through <code>slots</code> and <code>slotProps</code>.</p>

## How slots work

All styled chat components expose `slots` and `slotProps` props.
A slot replaces the rendered element for a specific region, while `slotProps` passes additional props to slots without replacing them.

```tsx
<ChatBox
  slots={{ messageContent: CustomBubble }}
  slotProps={{ composerInput: { rows: 1 } }}
/>
```

## ChatBox mirrored slots

`ChatBox` mirrors slots from its child components so you can customize deeply without breaking down to manual composition.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(c) {
        c.close();
      },
    });
  },
};

const CustomConversationTitle = React.forwardRef(function CustomConversationTitle(
  props: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { conversation, dense, focused, ownerState, selected, unread, ...other } =
    props;
  void dense;
  void focused;
  void ownerState;
  void selected;
  void unread;

  const title =
    typeof conversation === 'object' && conversation && 'title' in conversation
      ? (conversation.title ?? conversation.id)
      : '';

  return (
    <Box
      ref={ref}
      sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
      {...other}
    >
      <Typography fontWeight={600} variant="body2">
        {title}
      </Typography>
      {unread ? <Chip color="primary" label="New" size="small" /> : null}
    </Box>
  );
});

export default function SlotCustomization() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
        <ChatBox
          adapter={adapter}
          defaultActiveConversationId="c1"
          defaultConversations={[
            {
              id: 'c1',
              title: 'Design sync',
              subtitle: 'With custom slots',
              unreadCount: 1,
            },
            { id: 'c2', title: 'Ops review', subtitle: 'All read' },
          ]}
          defaultMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'The conversation title uses a custom slot with a chip badge. The message content and composer input can also be replaced.',
                },
              ],
            },
          ]}
          slots={{
            conversationTitle: CustomConversationTitle,
          }}
        />
      </Box>
    </Paper>
  );
}
```

### Conversations region

| Slot                        | Description                 |
| :-------------------------- | :-------------------------- |
| `conversationsRoot`         | Conversation list container |
| `conversationItem`          | Individual conversation row |
| `conversationItemAvatar`    | Avatar in conversation item |
| `conversationTitle`         | Title text                  |
| `conversationPreview`       | Subtitle/preview text       |
| `conversationTimestamp`     | Relative time               |
| `conversationUnreadBadge`   | Unread count badge          |
| `conversationsLoadingState` | Loading placeholder         |
| `conversationsEmptyState`   | Empty state                 |
| `conversationsErrorState`   | Error state                 |

### Thread region

| Slot                 | Description                 |
| :------------------- | :-------------------------- |
| `threadRoot`         | Thread container            |
| `threadHeader`       | Thread header bar           |
| `threadTitle`        | Thread title text           |
| `threadSubtitle`     | Thread subtitle             |
| `threadActions`      | Thread header actions       |
| `threadLoadingState` | Thread loading state        |
| `threadEmptyState`   | Thread empty state          |
| `threadErrorState`   | Thread error state          |
| `historyLoading`     | History load-more indicator |
| `messageList`        | Message list container      |

### Message region

| Slot                       | Description                  |
| :------------------------- | :--------------------------- |
| `messageGroup`             | Message group wrapper        |
| `messageRoot`              | Individual message container |
| `messageAvatar`            | Message author avatar        |
| `messageContent`           | Message bubble content       |
| `messageBubble`            | Bubble element               |
| `messageMeta`              | Timestamp and status         |
| `messageTimestamp`         | Timestamp text               |
| `messageStatus`            | Status indicator             |
| `messageActions`           | Action buttons               |
| `dateDivider`              | Date separator               |
| `unreadMarker`             | Unread boundary              |
| `typingIndicator`          | Typing dots                  |
| `scrollToBottomAffordance` | Scroll FAB                   |

### Composer region

| Slot                   | Description       |
| :--------------------- | :---------------- |
| `composerRoot`         | Composer form     |
| `composerInput`        | Input textarea    |
| `composerSendButton`   | Send button       |
| `composerAttachButton` | Attach trigger    |
| `composerToolbar`      | Toolbar row       |
| `composerHelperText`   | Status/error text |

## Owner state

Custom slot components receive `ownerState` with runtime values for conditional styling:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(c) {
        c.close();
      },
    });
  },
};

const CustomBubble = React.forwardRef(function CustomBubble(
  props: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { ownerState, ...other } = props;
  const role =
    typeof ownerState === 'object' && ownerState && 'role' in ownerState
      ? ownerState.role
      : 'assistant';

  return (
    <Box
      ref={ref}
      sx={{
        borderRadius: role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        border: 1,
        borderColor: role === 'user' ? 'primary.main' : 'divider',
        px: 2,
        py: 1,
      }}
      {...other}
    />
  );
});

export default function OwnerStateDemo() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 400 }}>
        <ChatBox
          adapter={adapter}
          defaultMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'This bubble uses owner state to apply different border-radius for user and assistant messages.',
                },
              ],
            },
            {
              id: 'm2',
              role: 'user',
              author: demoUsers.you,
              createdAt: '2026-03-17T09:01:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'User messages get a primary-colored border and a different corner shape.',
                },
              ],
            },
          ]}
          slots={{ messageBubble: CustomBubble }}
        />
      </Box>
    </Paper>
  );
}
```

Common owner state values:

- `role` — `'user'` | `'assistant'` | `'system'`
- `status` — `'pending'` | `'sending'` | `'streaming'` | `'sent'` | `'error'`
- `isGrouped` — whether the message is in a visual group
- `hasValue` — whether the composer has draft text
- `isSubmitting` — whether a send is in progress
- `selected` — whether a conversation is active
- `unread` — whether a conversation has unread messages

## Adjacent pages

- See [Unstyled customization](/x/react-chat/unstyled/customization/) for the structural slot model.
- See [Theming](/x/react-chat/material/theming/) for theme-level visual customization.
