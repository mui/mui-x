---
title: Chat - Minimal core chat
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Minimal core chat

<p class="description">Wire up a minimal headless chat using <code>ChatProvider</code> and the <code>useChat()</code> hook.</p>

The minimal example demonstrates the core pattern:

- `ChatProvider` owns the runtime and wraps the component tree.
- `useChat()` reads messages and streaming state in one call
- A plain input and button trigger `sendMessage()`.
- the assistant response streams back through the adapter

Everything else—layout, styling, message rendering—is plain React with no framework opinions.

## Key concepts

### Defining an adapter

The adapter is the only required prop on `ChatProvider`.
At minimum, it implements `sendMessage()` and returns a `ReadableStream` of chunks:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return createChunkStream(
      createTextResponseChunks(
        `response-${message.id}`,
        `You said: "${getMessageText(message)}".`,
      ),
      { delayMs: 220 },
    );
  },
};
```

### Wiring the provider

Wrap the component tree with `ChatProvider` and pass the adapter:

```tsx
<ChatProvider adapter={adapter} initialActiveConversationId="support">
  <MinimalChatInner />
</ChatProvider>
```

`initialActiveConversationId` sets the initial conversation without requiring controlled state.

### Reading state from the runtime

Inside `ChatProvider`, call `useChat()` to get messages, streaming state, and actions:

```tsx
const { messages, sendMessage, isStreaming } = useChat();
```

{{"demo": "MinimalHeadlessChat.js"}}

## Key takeaways

- The adapter is the only backend integration point—the runtime handles everything else.
- `useChat()` provides both state and actions in a single hook
- No CSS, no components, no design system required—core is pure runtime.

## See also

- [Hooks](/x/react-chat/core/hooks/) for details on the full hook API.
- [Adapters](/x/react-chat/core/adapters/) for details on writing real adapters.
- [Controlled state](/x/react-chat/core/examples/controlled-state/) for details on owning state externally.
- [Selector-driven thread](/x/react-chat/core/examples/selector-driven-thread/) for details on efficient large threads.

## API

- [ChatRoot](/x/api/chat/chat-root/)
