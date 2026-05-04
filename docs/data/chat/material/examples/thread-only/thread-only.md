---
title: Chat - Thread-only
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Thread-only

<p class="description">A single-pane chat surface with no built-in conversation sidebar — ideal for embedded copilots and focused AI assistants.</p>

`ChatBox` renders a thread-only surface by default.
The built-in conversation list appears only when you opt in with `features={{ conversationList: true }}`.

- Thread-only layout — no conversation list pane
- Minimal props: just an `adapter` and a container size
- No extra feature flags needed for a focused single-thread surface

{{"demo": "ThreadOnly.js", "bg": "inline"}}

## When to use this layout

Use the thread-only mode when:

- Building an embedded copilot or AI assistant inside a dashboard or panel
- The product has a single chat thread per user (no inbox)
- You want a compact, focused chat surface without a sidebar

Use the two-pane layout ([Multi-conversation](/x/react-chat/material/examples/multi-conversation/)) when users need to switch between multiple conversations.

## How it works

`ChatBox` leaves the built-in conversation list off unless `features.conversationList` is `true`.
That means the thread fills the available width whether or not conversation data exists in state.

To restore the sidebar at any time, opt into the feature and provide conversation data:

```tsx
<ChatBox
  adapter={adapter}
  features={{ conversationList: true }}
  initialConversations={[{ id: 'main', title: 'Support' }]}
  initialActiveConversationId="main"
/>
```

## See also

- [Basic AI chat](/x/react-chat/material/examples/basic-ai-chat/) for the smallest working setup with a single conversation
- [Multi-conversation](/x/react-chat/material/examples/multi-conversation/) for the full two-pane inbox layout

## API

- [ChatRoot](/x/api/chat/chat-root/)
