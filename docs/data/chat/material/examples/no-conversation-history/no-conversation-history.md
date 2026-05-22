---
title: Chat - No Conversation History
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - No Conversation History

<p class="description">ChatBox hides the conversation list when neither the adapter nor a prop supplies conversation data.</p>

{{"demo": "NoConversationHistory.js", "bg": "inline"}}

## How it works

`ChatBox` gates the conversation list on a single condition: whether the internal `conversations` array has any items.

There are exactly two ways to populate that array:

1. **Controlled or uncontrolled state**: pass `conversations` or `initialConversations` props to `ChatBox`.
2. **Adapter**: implement `listConversations?()` on the adapter so `ChatBox` can fetch history from a backend.

When neither is present, the array stays empty and `ChatBox` skips rendering the list panel entirely. The thread fills the full width automatically—no extra configuration needed.

```tsx
// Adapter with no `listConversations`—history cannot be fetched
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return streamResponse(message);
  },
};

// No `conversations` or `initialConversations` prop—state stays empty
<ChatBox adapter={adapter} />;
```

## When this is the right choice

Use this pattern when:

- Your backend has no conversation history API (for example, a stateless AI endpoint).
- The product intentionally gives users a fresh thread each session.
- You are building an embedded copilot or assistant that lives inside another page and doesn't need a sidebar.

## Restoring the conversation list

To show the conversation list, provide at least one of the two sources:

**Via props (uncontrolled):**

```tsx
<ChatBox
  adapter={adapter}
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

## See also

- [Thread-only](/x/react-chat/material/examples/thread-only/) for a layout-focused view of the single-pane pattern
- [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) for the full two-pane inbox with a conversation sidebar

## API

- [ChatRoot](/x/api/chat/chat-root/)
