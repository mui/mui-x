---
title: Chat - No conversation history
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - No conversation history

<p class="description">Build a single-thread chat surface without a conversation list when your backend has no history API.</p>

{{"demo": "NoConversationHistory.js", "bg": "inline"}}

## Composing the thread directly

This example does not use `ChatBox`.
Instead it composes a thread directly from lower-level components, so there is no built-in conversation list, header, or conversation-history model to configure.

That makes it a good fit when you only need:

1. a `ChatRoot` provider for adapter + state
2. a `ChatConversation` container for the thread
3. a `ChatMessageList` and `ChatComposer` inside that thread

```tsx
// Adapter with no `listConversations`—only send/stream behavior is needed
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return streamResponse(message);
  },
};

<ChatRoot
  adapter={adapter}
  initialActiveConversationId="main"
  initialMessages={messages}
>
  <ChatConversation>
    <ChatMessageList />
    <ChatComposer />
  </ChatConversation>
</ChatRoot>;
```

## When to use this pattern

Use this pattern when:

- The backend exposes no conversation history API—for example, a stateless AI endpoint.
- The product intentionally gives users a fresh thread each session.
- You're building an embedded copilot or assistant inside another page that doesn't need the built-in multi-conversation shell.

## Enabling the built-in conversation list

Switch back to `ChatBox` and set `features={{ conversationList: true }}`.
Provide conversation data in one of two ways:

### Via props (uncontrolled)

```tsx
<ChatBox
  adapter={adapter}
  features={{ conversationList: true }}
  initialConversations={[{ id: 'main', title: 'My chat' }]}
  initialActiveConversationId="main"
/>
```

### Via adapter

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    /* ... */
  },
  async listConversations() {
    const data = await fetch('/api/conversations').then((r) => r.json());
    return { conversations: data };
  },
};
```

`listConversations()` loads conversation state on mount even when the sidebar UI is disabled.
The `conversationList` feature flag controls whether that state renders through the built-in sidebar or drawer.

## See also

- See [Thread-only](/x/react-chat/material/examples/thread-only/) for a layout-focused view of the single-pane pattern.
- See [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) for the full two-pane inbox with a sidebar.

## API

- [ChatRoot](/x/api/chat/chat-root/)
