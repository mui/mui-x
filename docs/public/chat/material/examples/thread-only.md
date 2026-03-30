---
title: Chat - Thread-only
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Thread-only

A single-pane chat surface with no conversation sidebar — ideal for embedded copilots and focused AI assistants.

When no `conversations` or `initialConversations` are provided, `ChatBox` automatically hides the left panel and renders the thread full-width.

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../shared/demoUtils';
import { demoUsers } from '../shared/demoData';

const demoMembers = [demoUsers.you, demoUsers.agent];

const adapter = createEchoAdapter({
  respond: (text) =>
    `Got your message: "${text}". No conversation list is needed for a single-thread copilot.`,
});

export default function ThreadOnly() {
  return (
    <ChatBox
      adapter={adapter}
      members={demoMembers}
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

## What it shows

- Thread-only layout — no conversation list pane
- Minimal props: just an `adapter` and a container size
- Automatic layout adaptation based on whether conversations are present

## When to use this layout

Use the thread-only mode when:

- Building an embedded copilot or AI assistant inside a dashboard or panel
- The product has a single chat thread per user (no inbox)
- You want a compact, focused chat surface without a sidebar

Use the two-pane layout ([Multi-conversation](/x/react-chat/material/examples/multi-conversation/)) when users need to switch between multiple conversations.

## How it works

`ChatBox` checks whether any `conversations` (or `initialConversations`) are present.
If none are provided, the conversation list component is not rendered, and `ChatLayout` collapses the left pane automatically — the thread fills the full width.

To restore the sidebar at any time, pass at least one conversation:

```tsx
<ChatBox
  adapter={adapter}
  initialConversations={[{ id: 'main', title: 'Support' }]}
  initialActiveConversationId="main"
/>
```

## Next steps

- See [Basic AI chat](/x/react-chat/material/examples/basic-ai-chat/) for the smallest working setup with a single conversation.
- See [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) for the full two-pane inbox layout.
