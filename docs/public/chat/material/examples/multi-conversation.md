---
title: Chat - Multi-conversation
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Multi-conversation

A two-pane inbox layout with a conversation sidebar and an active thread pane.

This demo shows how to use `ChatBox` as a full inbox surface with multiple conversations.
The conversation sidebar is rendered automatically when more than one conversation is provided.

- A two-pane layout with a conversation list on the left and the active thread on the right
- Controlled `activeConversationId` with `onActiveConversationChange` for conversation switching
- Controlled `messages` and `onMessagesChange` for per-conversation message state
- `conversations` with `unreadCount` and `readState` reflected in the sidebar

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import {
  createEchoAdapter,
  syncConversationPreview,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/examples/shared/demoData';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". Select a different conversation in the sidebar to see the two-pane layout.`,
});

export default function MultiConversation() {
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => inboxConversations[0].id,
  );
  const [conversations, setConversations] = React.useState<ChatConversation[]>(() =>
    inboxConversations.map((c) => ({ ...c })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      Object.entries(inboxThreads).map(([id, msgs]) => [
        id,
        msgs.map((m) => ({ ...m })),
      ]),
    ),
  );

  const messages = threads[activeConversationId] ?? [];

  return (
    <ChatBox
      adapter={adapter}
      activeConversationId={activeConversationId}
      conversations={conversations}
      messages={messages}
      onActiveConversationChange={(nextId) => {
        if (nextId) {
          setActiveConversationId(nextId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
        setConversations((prev) =>
          syncConversationPreview(prev, activeConversationId, nextMessages),
        );
      }}
      sx={{
        height: 560,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

## Controlled vs. uncontrolled conversations

This demo uses **controlled state** so each conversation keeps its own message history:

```tsx
const [activeConversationId, setActiveConversationId] = React.useState('thread-a');
const [threads, setThreads] = React.useState({ 'thread-a': [], 'thread-b': [] });

<ChatBox
  activeConversationId={activeConversationId}
  messages={threads[activeConversationId] ?? []}
  onActiveConversationChange={(nextId) => setActiveConversationId(nextId)}
  onMessagesChange={(nextMessages) => {
    setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
  }}
/>;
```

For simpler use cases with a single conversation, use `initialActiveConversationId` and `initialMessages` instead.

## Conversation list behavior

The conversation list renders automatically when `conversations` contains more than one item.
If only one conversation is provided, `ChatBox` renders the thread pane directly without a sidebar.

## Implementation notes

- Store message threads in a `Record<string, ChatMessage[]>` keyed by `conversationId`.
- Sync conversation previews after messages change using `onMessagesChange`.
- The `unreadCount` and `readState` on each conversation drive the sidebar badge and read indicator.

## See also

- [Custom theme](/x/react-chat/material/examples/custom-theme/) to apply brand colors across the entire surface
- [Customization](/x/react-chat/material/customization/) for `slotProps` on the conversation list and thread header

## API

- [ChatRoot](/x/api/chat/chat-root/)
