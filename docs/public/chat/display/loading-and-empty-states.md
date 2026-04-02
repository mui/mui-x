---
productId: x-chat
title: Loading & Empty States
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageSkeleton
---

# Chat - Loading & Empty States

Display loading skeletons while messages load and empty state content when a conversation has no messages.



## Loading state with ChatMessageSkeleton

`ChatMessageSkeleton` renders animated shimmer lines that serve as a placeholder while message content is loading. Use it during initial data fetching or when loading older messages via history pagination.

### Import

```tsx
import { ChatMessageSkeleton } from '@mui/x-chat';
```

### Basic usage

```tsx
<ChatMessageSkeleton />
```

By default, the skeleton renders 3 shimmer lines. The last line is shorter (60% width) to mimic the natural shape of a message.

### Configuring the number of lines

Set the `lines` prop to control how many shimmer lines are displayed:

```tsx
<ChatMessageSkeleton lines={2} />
<ChatMessageSkeleton lines={5} />
```

### Slots

| Slot   | Default element | Description                    |
| :----- | :-------------- | :----------------------------- |
| `root` | `div`           | The outer container            |
| `line` | `div`           | Each animated shimmer line     |

Customize the skeleton appearance through slot replacement:

```tsx
<ChatMessageSkeleton
  slots={{
    root: MySkeletonRoot,
    line: MySkeletonLine,
  }}
/>
```

### CSS classes

| Class name                        | Description          |
| :-------------------------------- | :------------------- |
| `.MuiChatMessageSkeleton-root`    | Root container       |
| `.MuiChatMessageSkeleton-line`    | Individual line      |

## Empty state

When a conversation exists but has no messages yet, `ChatBox` renders an empty message list area with the composer ready for input. This is the state users see when they start a new conversation.

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter, randomId } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/examples/shared/demoData';

const demoMembers = [demoUsers.you, demoUsers.agent];

const adapter = createEchoAdapter();

const emptyConversation = {
  id: randomId(),
  title: 'New conversation',
  subtitle: 'Start a new conversation',
  participants: [],
  readState: 'read' as const,
  unreadCount: 0,
  lastMessageAt: new Date().toISOString(),
};

export default function EmptyState() {
  return (
    <ChatBox
      adapter={adapter}
      members={demoMembers}
      initialActiveConversationId={emptyConversation.id}
      initialConversations={[emptyConversation]}
      initialMessages={[]}
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

Key characteristics of the empty state:

- The message list area is visible but empty
- The composer is ready for input
- The conversation header is visible (if configured)
- No visual artifacts appear when the message list is empty

### Custom empty state content

Provide custom empty state content by replacing the message list slot. A common pattern is to display suggested prompts that help users start a conversation:

```tsx
function EmptyStateContent() {
  const { messages } = useChat();

  if (messages.length > 0) return null;

  return (
    <div className="empty-state">
      <h3>How can I help you today?</h3>
      <div className="suggestions">
        <button onClick={() => sendMessage('Explain quantum computing')}>
          Explain quantum computing
        </button>
        <button onClick={() => sendMessage('Write a haiku about React')}>
          Write a haiku about React
        </button>
      </div>
    </div>
  );
}
```

## Streaming indicator

While the assistant is generating a response, streaming tokens are rendered incrementally inside the message bubble. The message list auto-scrolls to follow new content as long as the user is near the bottom.

The streaming state is reflected in:

- `ChatMessage.status` — set to `'streaming'` during generation
- `ChatTextMessagePart.state` — set to `'streaming'` on the active text part

Use these values to display a typing indicator or pulsing cursor:

```tsx
function TypingIndicator({ message }) {
  if (message.status !== 'streaming') return null;

  return <span className="typing-cursor" />;
}
```

## API

- [`ChatMessageSkeleton`](/x/api/chat-message-skeleton/)

## See also

- [Message Appearance](/x/react-chat/display/message-appearance/) for the overall message layout
- [Text & Markdown](/x/react-chat/display/message-parts/text-and-markdown/) for streaming text display
- [Message list](/x/react-chat/basics/messages/) for auto-scroll behavior during streaming
