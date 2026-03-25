---
productId: x-chat
title: Chat - Modular composition
packageName: '@mui/x-chat'
components: ChatConversation
---

# Modular composition

<p class="description">Build a chat UI from individual styled components when <code>ChatBox</code> does not fit your layout.</p>

## When to compose manually

Use `ChatBox` when the default two-pane or thread-only layout is a good fit.
Compose from `ChatConversation`, `ChatComposer`, and `ChatConversations` individually when:

- the layout is non-standard (e.g. conversations in a drawer, thread in a panel)
- you need to place the composer outside the thread container
- you want to share a provider across multiple surfaces

## Full composition

The styled components are designed to be used inside an unstyled `ChatRoot` provider.
`ChatRoot` owns the runtime state; the styled components read from the provider context.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Chat } from '@mui/x-chat/unstyled';
import { ChatConversations, ChatConversation, ChatComposer } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function ModularComposition() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Chat.Root
        adapter={adapter}
        defaultActiveConversationId="triage"
        defaultConversations={inboxConversations}
        defaultMessages={inboxThreads.triage}
      >
        <Box sx={{ display: 'flex', height: 560 }}>
          <Box sx={{ width: 280, borderRight: 1, borderColor: 'divider' }}>
            <ChatConversations />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ChatConversation sx={{ flex: 1 }} />
            <ChatComposer />
          </Box>
        </Box>
      </Chat.Root>
    </Paper>
  );
}
```

## Thread-only composition

When you do not need a conversations sidebar, compose `ChatConversation` and `ChatComposer` directly.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Chat } from '@mui/x-chat/unstyled';
import { ChatConversation, ChatComposer } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function ThreadOnlyComposition() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Chat.Root
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
                text: 'This thread and composer are composed manually from individual styled components, without using ChatBox.',
              },
            ],
          },
        ]}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 480 }}>
          <ChatConversation sx={{ flex: 1 }} />
          <ChatComposer />
        </Box>
      </Chat.Root>
    </Paper>
  );
}
```

## Component relationships

| Styled component    | Unstyled equivalent                      | Headless dependency                |
| :------------------ | :--------------------------------------- | :--------------------------------- |
| `ChatConversations` | `ConversationList.Root`                  | `useConversations`, `useChatStore` |
| `ChatConversation`  | `Conversation.Root` + `MessageList.Root` | `useMessageIds`, `useMessage`      |
| `ChatComposer`      | `Composer.Root`                          | `useChatComposer`                  |

Each styled component adds Material UI surface treatment (elevation, padding, typography, icon buttons) while preserving the slot and owner-state model from the unstyled layer.

## See also

- See [ChatBox](/x/react-chat/material/chat-box/) for the one-liner API.
- See [Unstyled composition](/x/react-chat/unstyled/composition/) for the structural primitive model.
