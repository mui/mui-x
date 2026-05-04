---
title: Chat - Basic AI chat
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Basic AI chat

<p class="description">A minimal seeded <code>ChatBox</code> setup: an adapter, one conversation, and an initial message.</p>

This demo shows a small but fully seeded `ChatBox` surface using `@mui/x-chat`.

- `ChatBox` rendering a single conversation without a conversation list
- `initialConversations` and `initialMessages` for initial state
- `initialActiveConversationId` to open the conversation immediately
- `sx` for sizing the container

{{"demo": "BasicAiChat.js", "bg": "inline"}}

## Why start here

This demo answers: "What is the smallest working `@mui/x-chat` surface?"

This demo uses three pieces of initial state:

1. An `adapter` that implements `sendMessage`
2. An `initialConversations` array with at least one conversation
3. An `initialActiveConversationId` that matches one of those conversations

Only `adapter` is strictly required by the component API.
The conversation props in this example are there so the thread opens with seeded title and message history.

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
- Omitting `initialConversations` renders a blank thread surface until messages are loaded or sent.
- Omitting `initialActiveConversationId` keeps the built-in thread surface mounted, but there is no active conversation selected.
- The conversation list UI stays off by default; enable it explicitly with `features={{ conversationList: true }}`.

## See also

- [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) to add a conversation sidebar
- [Customization](/x/react-chat/material/customization/) for theme overrides, slots, and slotProps

## API

- [ChatRoot](/x/api/chat/chat-root/)
