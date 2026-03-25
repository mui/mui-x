---
productId: x-chat
title: Chat - ChatBox
packageName: '@mui/x-chat'
components: ChatBox
---

# ChatBox

<p class="description">The <code>ChatBox</code> component is a one-liner entry point that composes a complete, theme-aware chat UI from conversations, thread, and composer.</p>

## Basic usage

`ChatBox` wraps the headless runtime and the styled components into a single surface.
Pass an `adapter` and optional default data to get a working chat UI.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function ChatBoxBasic() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 560 }}>
        <ChatBox
          adapter={adapter}
          defaultActiveConversationId="triage"
          defaultConversations={inboxConversations}
          defaultMessages={inboxThreads.triage}
        />
      </Box>
    </Paper>
  );
}
```

## Thread-only layout

When no conversation source exists (`conversations`, `defaultConversations`, or `adapter.listConversations`), `ChatBox` renders a single-pane thread layout without the conversations sidebar.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function ChatBoxThreadOnly() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
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
                  text: 'This is the thread-only layout. There is no conversations sidebar because no conversation source was provided.',
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
                  text: 'This layout is ideal for embedded copilots and single-thread use cases.',
                },
              ],
            },
          ]}
        />
      </Box>
    </Paper>
  );
}
```

## Controlled state

`ChatBox` accepts the same controlled and uncontrolled state props as `ChatRoot`.
Use `messages` and `onMessagesChange` to own the message array, or `activeConversationId` and `onActiveConversationChange` to control conversation selection.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { ChatBox } from '@mui/x-chat';
import {
  createEchoAdapter,
  cloneConversations,
  cloneMessages,
} from 'docsx/data/chat/material/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function ChatBoxControlled() {
  const [activeConversationId, setActiveConversationId] = React.useState<
    string | undefined
  >('triage');
  const [conversations, setConversations] = React.useState<ChatConversation[]>(() =>
    cloneConversations(inboxConversations),
  );
  const [messages, setMessages] = React.useState<ChatMessage[]>(() =>
    cloneMessages(inboxThreads.triage),
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
      >
        <Box sx={{ height: 480 }}>
          <ChatBox
            activeConversationId={activeConversationId}
            adapter={adapter}
            conversations={conversations}
            messages={messages}
            onActiveConversationChange={setActiveConversationId}
            onConversationsChange={setConversations}
            onMessagesChange={setMessages}
          />
        </Box>
      </Paper>
      <Typography color="text.secondary" variant="caption">
        Active: {activeConversationId ?? 'none'} · Conversations:{' '}
        {conversations.length} · Messages: {messages.length}
      </Typography>
    </Box>
  );
}
```

## Default props

For prototyping, use `defaultMessages` and `defaultConversations` to seed the UI without wiring up state handlers.
The component manages internal state until you lift it.

```tsx
<ChatBox
  adapter={adapter}
  defaultActiveConversationId="c1"
  defaultConversations={conversations}
  defaultMessages={messages}
/>
```

## Adapter integration

`ChatBox` forwards the adapter to the underlying provider.
When the adapter implements `listConversations` and `listMessages`, `ChatBox` bootstraps entirely from the adapter without requiring default data.

See the [Overview](/x/react-chat/) for a custom adapter example.

## See also

- See [Composition](/x/react-chat/material/composition/) to build from modular styled components instead of the one-liner.
- See [Slots](/x/react-chat/material/slots/) for the complete ChatBox slot reference.
- See [Theming](/x/react-chat/material/theming/) to customize colors, dark mode, and RTL.
