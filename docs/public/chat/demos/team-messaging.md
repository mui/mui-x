---
productId: x-chat
title: Team Messaging demo
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Team Messaging demo

A two-pane inbox layout with a conversation sidebar, thread switching, and per-conversation message state.



## Multi-conversation inbox

A full team messaging surface with multiple conversations. The sidebar renders automatically when more than one conversation is provided, allowing users to switch between threads while each conversation maintains its own message history.

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter, syncConversationPreview } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { inboxConversations, inboxThreads } from 'docsx/data/chat/material/examples/shared/demoData';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';

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

## What this demo shows

- **Conversation list sidebar** — a navigable list of conversations with titles, previews, and unread indicators rendered automatically when multiple conversations are provided
- **Thread switching** — clicking a conversation in the sidebar loads its message history into the thread pane, with controlled `activeConversationId` state
- **Per-conversation message state** — each conversation stores its own message array, managed through `onMessagesChange` callbacks and keyed by conversation ID
- **Read state and unread counts** — the `unreadCount` and `readState` properties on each conversation drive sidebar badges and visual indicators
- **Responsive layout** — the two-pane layout adapts to the container, with the sidebar and thread pane sharing the available space

## API

- [`ChatBox`](/x/api/chat-box/)
