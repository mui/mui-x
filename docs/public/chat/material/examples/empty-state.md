---
title: Chat - Empty state
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Empty state

A ChatBox with an active conversation but no messages yet.

This demo shows the empty state of a ChatBox - an active conversation with zero messages, revealing how the component looks before any interaction.

- Empty message list area
- Composer is ready for input
- Conversation header is visible
- No visual artifacts when the message list is empty

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/examples/shared/demoData';

const demoMembers = [demoUsers.you, demoUsers.agent];

const adapter = createEchoAdapter();

const emptyConversation = {
  id: 'empty-conv',
  title: 'New conversation',
  subtitle: 'Start a new conversation',
  participants: [],
  readState: 'read' as const,
  unreadCount: 0,
  lastMessageAt: '2026-03-15T10:00:00.000Z',
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

## API

- [ChatRoot](/x/api/chat/chat-root/)
