---
productId: x-chat
title: Customer Support demo
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Customer Support demo

A compact, embedded chat widget suited for customer support overlays and space-constrained layouts.

## Compact chat widget

Set `variant="compact"` on `ChatBox` to switch the entire surface to a messenger-style layout with no bubbles, left-aligned messages, and author names as group headers. This variant is ideal for embedded support widgets, floating chat panels, and any context where vertical space is limited.

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
    `Received: "${text}". Notice the compact layout — no message bubbles, everything left-aligned, author names above each group.`,
});

export default function CompactVariant() {
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
      variant="compact"
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

## API

- [`ChatBox`](/x/api/chat/chat-box/)
