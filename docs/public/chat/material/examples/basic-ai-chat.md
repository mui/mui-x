---
title: Chat - Basic AI chat
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Basic AI chat

<p class="description">The smallest working <code>ChatBox</code> setup: an adapter, a conversation, and an initial message.</p>

This demo shows the minimum required props to render a styled, interactive chat surface using `@mui/x-chat`.

- `ChatBox` rendering a single conversation without a conversation list
- `initialConversations` and `initialMessages` for initial state
- `initialActiveConversationId` to open the conversation immediately
- `sx` for sizing the container

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function BasicAiChat() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
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

## Why start here

This demo answers: "What is the smallest working `@mui/x-chat` surface?"

The answer is three things:

1. An `adapter` that implements `sendMessage`
2. A `initialConversations` array with at least one conversation
3. A `initialActiveConversationId` that matches one of those conversations

Every other prop is optional.

## The adapter

The demo uses a local echo adapter that echoes the user message back as a streaming response.
In a real application, replace it with an adapter that calls your backend:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message, signal }) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      signal,
    });
    return response.body; // ReadableStream<ChatMessageChunk>
  },
};
```

## Implementation notes

- Keep the container height explicit so the message list and composer render correctly.
- Omitting `initialConversations` renders an empty surface without a thread.
- Omitting `initialActiveConversationId` shows the conversation list pane without an active thread.

## API

- [ChatRoot](/x/api/chat/chat-root/)

## See also

- [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) to add a conversation sidebar
- [Customization](/x/react-chat/material/customization/) for theme overrides, slots, and slotProps
