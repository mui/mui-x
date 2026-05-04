---
title: Chat - No conversation history
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - No conversation history

<p class="description">Compose a single-thread surface directly from <code>ChatRoot</code>, <code>ChatConversation</code>, <code>ChatMessageList</code>, and <code>ChatComposer</code> when you do not need conversation history.</p>

{{"demo": "NoConversationHistory.js", "bg": "inline"}}

## How it works

This example does not use `ChatBox` at all.
Instead it composes a thread directly from lower-level components, so there is no built-in conversation list, header, or conversation-history model to configure.

That makes it a good fit when you only need:

1. a `ChatRoot` provider for adapter + state
2. a `ChatConversation` container for the thread
3. a `ChatMessageList` and `ChatComposer` inside that thread

```tsx
// Adapter with no `listConversations` — only send/stream behavior is needed
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return streamResponse(message);
  },
};

<ChatRoot adapter={adapter} initialActiveConversationId="main" initialMessages={messages}>
  <ChatConversation>
    <ChatMessageList />
    <ChatComposer />
  </ChatConversation>
</ChatRoot>;
```

## When this is the right choice

Use this pattern when:

- Your backend has no conversation history API (for example, a stateless AI endpoint).
- The product intentionally gives users a fresh thread each session.
- You are building an embedded copilot or assistant that lives inside another page and doesn't need the built-in multi-conversation shell.

## If you want the built-in conversation list later

Switch back to `ChatBox` and opt into `features={{ conversationList: true }}`.
Conversation data can come from either source below:

**Via props (uncontrolled):**

```tsx
<ChatBox
  adapter={adapter}
  features={{ conversationList: true }}
  initialConversations={[{ id: 'main', title: 'My chat' }]}
  initialActiveConversationId="main"
/>
```

**Via adapter (fetched from backend):**

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
The `conversationList` feature flag controls whether that state is rendered through the built-in sidebar / drawer.

## See also

- [Thread-only](/x/react-chat/material/examples/thread-only/) for a layout-focused view of the single-pane pattern
- [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) for the full two-pane inbox with a conversation sidebar

## API

- [ChatRoot](/x/api/chat/chat-root/)
