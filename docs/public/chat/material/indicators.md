---
productId: x-chat
title: Chat - Indicators and skeletons
packageName: '@mui/x-chat'
components: ChatTypingIndicator, ChatUnreadMarker, ChatScrollToBottomAffordance
---

# Indicators and skeletons

Typed indicators, unread markers, scroll affordances, and skeleton placeholders provide real-time feedback while the chat loads and updates.

## Typing indicator

`ChatTypingIndicator` shows an animated dots indicator when the assistant is composing a response.
It is automatically displayed inside `ChatConversation` during streaming.

## Unread marker

`ChatUnreadMarker` inserts a colored separator between read and unread messages.

## Scroll-to-bottom affordance

`ChatScrollToBottomAffordance` is a floating action button that appears when the user scrolls away from the bottom of the thread.
It shows a badge with the count of unseen messages.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import {
  demoUsers,
  createTextMessage,
} from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

const messages = [
  createTextMessage({
    id: 'ind-a1',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-17T09:00:00.000Z',
    text: 'I analyzed the latest deployment logs.',
  }),
  createTextMessage({
    id: 'ind-a2',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-17T09:01:00.000Z',
    text: 'No regressions found. The scroll-to-bottom affordance appears when you scroll up in a long thread. Send a message to see the typing indicator.',
  }),
  createTextMessage({
    id: 'ind-u1',
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-17T09:05:00.000Z',
    text: 'Good. Let me test the indicators by sending another message.',
  }),
];

export default function IndicatorsDemo() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
        <ChatBox adapter={adapter} initialMessages={messages} />
      </Box>
    </Paper>
  );
}
```

## Message skeleton

`ChatMessageSkeleton` renders a placeholder message bubble while messages are loading.
Customize the alignment and number of text lines.

## Conversation skeleton

`ChatConversationSkeleton` renders a placeholder conversation list item.
Use `dense` for compact layouts.

```tsx
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChatMessageSkeleton, ChatConversationSkeleton } from '@mui/x-chat';

export default function SkeletonStates() {
  return (
    <Stack spacing={2}>
      <div>
        <Typography gutterBottom variant="subtitle2">
          Message skeletons
        </Typography>
        <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', p: 2 }}>
          <Stack spacing={2}>
            <ChatMessageSkeleton align="assistant" lines={3} />
            <ChatMessageSkeleton align="user" lines={1} />
            <ChatMessageSkeleton align="assistant" lines={2} />
          </Stack>
        </Paper>
      </div>
      <div>
        <Typography gutterBottom variant="subtitle2">
          Conversation skeletons
        </Typography>
        <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', p: 2 }}>
          <Stack spacing={1}>
            <ChatConversationSkeleton />
            <ChatConversationSkeleton />
            <ChatConversationSkeleton dense />
          </Stack>
        </Paper>
      </div>
    </Stack>
  );
}
```

## See also

- See [Unstyled indicators](/x/react-chat/unstyled/indicators/) for the structural primitive model.
