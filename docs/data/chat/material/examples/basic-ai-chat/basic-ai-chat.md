---
title: Chat - Basic AI chat
productId: x-chat
packageName: '@mui/x-chat'
---

# Basic AI chat

<p class="description">The smallest working <code>ChatBox</code> setup: an adapter, a conversation, and an initial message.</p>

This recipe shows the minimum required props to render a styled, interactive chat surface using `@mui/x-chat`.

{{"demo": "BasicAiChat.js", "bg": "inline"}}

## What it shows

- `ChatBox` rendering a single conversation without a conversation list
- `defaultConversations` and `defaultMessages` for initial state
- `defaultActiveConversationId` to open the conversation immediately
- `sx` for sizing the container

## Why start here

This recipe answers: "What is the smallest working `@mui/x-chat` surface?"

The answer is three things:

1. An `adapter` that implements `sendMessage`
2. A `defaultConversations` array with at least one conversation
3. A `defaultActiveConversationId` that matches one of those conversations

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
- Omitting `defaultConversations` renders an empty surface without a thread.
- Omitting `defaultActiveConversationId` shows the conversation list pane without an active thread.

## Next steps

- Continue with [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) to add a conversation sidebar.
- See [Customization](/x/react-chat/material/customization/) for theme overrides, slots, and slotProps.
