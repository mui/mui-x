---
title: Chat - Minimal headless chat
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Minimal headless chat

<p class="description">Start with the smallest working <code>ChatProvider</code> and <code>useChat()</code> setup</p>

This demo keeps the UI intentionally small to demonstrate the core headless pattern:

- `ChatProvider` owns the runtime and wraps your component tree
- `useChat()` reads messages and streaming state in one call
- a plain input and button trigger `sendMessage()`
- the assistant response streams back through the adapter

Everything else — layout, styling, message rendering — is plain React with no framework opinions.

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

### Wiring `ChatProvider`

Wrap your component tree with `ChatProvider` and pass the adapter:

```tsx
<ChatProvider adapter={adapter} initialActiveConversationId="support">
  <MinimalChatInner />
</ChatProvider>
```

`initialActiveConversationId` sets the initial conversation without requiring controlled state.

### Reading state with `useChat()`

Inside `ChatProvider`, call `useChat()` to get messages, streaming state, and actions:

```tsx
const { messages, sendMessage, isStreaming } = useChat();
```

{{"demo": "MinimalHeadlessChat.js"}}

## Key takeaways

- The adapter is the only backend integration point — the runtime handles everything else
- `useChat()` provides both state and actions in a single hook
- No CSS, no components, no design system required — headless is pure runtime

## API

- [ChatRoot](/x/api/chat/chat-root/)

## See also

- [Hooks](/x/react-chat/headless/hooks/) for the full hook API reference
- [Adapters](/x/react-chat/headless/adapters/) for writing real adapters
- [Controlled state](/x/react-chat/headless/examples/controlled-state/) for owning state externally
- [Selector-driven thread](/x/react-chat/headless/examples/selector-driven-thread/) for efficient large threads
