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
import { createEchoAdapter, syncConversationPreview } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { inboxConversations, inboxThreads } from 'docsx/data/chat/material/examples/shared/demoData';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';

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

## What this demo shows

- **Compact variant** — a single prop (`variant="compact"`) transforms the chat from a bubble-based layout to a dense, messenger-style design
- **Minimal footprint** — no colored bubbles, no right-aligned user messages; all content flows left-aligned for maximum density
- **Group headers** — author names and timestamps appear in message group headers rather than below each individual message
- **Embedded widget style** — the compact layout fits naturally inside a floating panel, sidebar drawer, or bottom-right overlay without overwhelming the host page
- **Full feature parity** — despite the visual changes, all ChatBox features (streaming, adapters, conversation switching) remain fully functional

### Default vs. compact comparison

| Default                                  | Compact                                         |
| :--------------------------------------- | :---------------------------------------------- |
| Colored message bubbles                  | Plain text, no background                       |
| User messages right-aligned              | All messages left-aligned                        |
| Timestamp below each message             | Timestamp in the group header, next to author   |
| Conversation list shows avatar + preview | Conversation list shows compact title + actions |

## API

- [`ChatBox`](/x/api/chat-box/)
