---
productId: x-chat
title: Chat - Customer support inbox
packageName: '@mui/x-chat'
---

# Customer support inbox

A two-pane inbox with conversations sidebar, unread badges, and streaming responses — the most common layout for support and operations tools.

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

const adapter = createEchoAdapter({
  respond: (text) =>
    `Support agent received: "${text}". I will investigate and follow up shortly.`,
});

export default function CustomerSupportInbox() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 600 }}>
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

## What this example demonstrates

- Two-pane layout with conversations sidebar and active thread
- Conversation selection and switching
- Unread count badges on conversation items
- Participant avatars
- Streaming echo responses via the adapter
- Message grouping and timestamps
