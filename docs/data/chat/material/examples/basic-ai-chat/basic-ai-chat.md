---
title: Chat - Basic AI chat
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Basic AI chat

<p class="description">Render a single-conversation <code>ChatBox</code> seeded with an adapter, a conversation, and an initial message.</p>

The `ChatBox` component renders with seeded conversation state from `@mui/x-chat`.

- `ChatBox` rendering a single conversation without a conversation list
- `initialConversations` and `initialMessages` for initial state
- `initialActiveConversationId` to open the conversation immediately
- `sx` for sizing the container

The demo below shows the resulting `ChatBox` surface:

{{"demo": "BasicAiChat.js", "bg": "inline"}}

## Seeding initial state

The smallest working `@mui/x-chat` surface needs three pieces of initial state:

1. An `adapter` that implements `sendMessage`
2. An `initialConversations` array with at least one conversation
3. An `initialActiveConversationId` that matches one of those conversations

Only `adapter` is required by the component API.
The conversation props in this example are there so the thread opens with seeded title and message history.

## Implementing the adapter

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

## Tips for setup

- Keep the container height explicit so the message list and composer render correctly.
- Omitting `initialConversations` renders a blank thread surface until messages are loaded or sent.
- Omitting `initialActiveConversationId` keeps the built-in thread surface mounted, but there is no active conversation selected.
- The conversation list UI stays off by default.
  Enable it with `features={{ conversationList: true }}`.

## See also

- See [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) for details on adding a conversation sidebar.
- See [Customization](/x/react-chat/material/customization/) for details on theme overrides, slots, and slot props.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
