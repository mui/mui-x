---
productId: x-chat
title: Chat - Conversations
packageName: '@mui/x-chat'
components: ChatConversations, ChatConversationSkeleton
---

# Conversations

<p class="description"><code>ChatConversations</code> renders a themed conversation list with avatars, unread badges, timestamps, and selection state.</p>

## Default rendering

`ChatConversations` renders each conversation as a list item with:

- a participant avatar (or generated initials)
- the conversation title and subtitle
- a relative timestamp
- an unread count badge

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

export default function ConversationsBasic() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
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

## Dense mode

Set `dense` to use smaller avatars and tighter spacing for compact layouts.

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

export default function ConversationsDense() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
        <ChatBox
          adapter={adapter}
          defaultActiveConversationId="design"
          defaultConversations={inboxConversations}
          defaultMessages={inboxThreads.design}
          slotProps={{
            conversations: { dense: true },
          }}
        />
      </Box>
    </Paper>
  );
}

```

## Loading, empty, and error states

`ChatConversations` renders built-in state surfaces when conversations are loading, empty, or errored.
The states are driven by the adapter lifecycle.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';

type DemoState = 'loading' | 'empty' | 'loaded';

export default function ConversationsStates() {
  const [demoState, setDemoState] = React.useState<DemoState>('loaded');

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async listConversations() {
        if (demoState === 'loading') {
          await new Promise(() => {});
        }
        if (demoState === 'empty') {
          return { conversations: [] };
        }
        return {
          conversations: [
            {
              id: 'c1',
              title: 'Active thread',
              subtitle: 'Conversations loaded successfully',
              lastMessageAt: '2026-03-17T09:00:00.000Z',
            },
          ],
        };
      },
      async sendMessage() {
        return new ReadableStream({
          start(c) {
            c.close();
          },
        });
      },
    }),
    [demoState],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Stack direction="row" spacing={1}>
        <Button
          onClick={() => setDemoState('loaded')}
          size="small"
          variant={demoState === 'loaded' ? 'contained' : 'outlined'}
        >
          Loaded
        </Button>
        <Button
          onClick={() => setDemoState('empty')}
          size="small"
          variant={demoState === 'empty' ? 'contained' : 'outlined'}
        >
          Empty
        </Button>
        <Button
          onClick={() => setDemoState('loading')}
          size="small"
          variant={demoState === 'loading' ? 'contained' : 'outlined'}
        >
          Loading
        </Button>
      </Stack>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
      >
        <Box sx={{ height: 400 }}>
          <ChatBox adapter={adapter} key={demoState} />
        </Box>
      </Paper>
    </Box>
  );
}

```

## Slot customization

Replace individual conversation item parts through slots:

- `title` — the conversation title element
- `preview` — the subtitle/preview text
- `timestamp` — the relative time display
- `unreadBadge` — the unread count indicator

## Adjacent pages

- See [Unstyled conversation list](/x/react-chat/unstyled/conversation-list/) for the structural primitive model.
- See [Slots](/x/react-chat/material/slots/) for the complete slot reference.
