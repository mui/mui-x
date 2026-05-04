---
title: Chat - Multi-conversation
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Multi-conversation

<p class="description">A two-pane inbox layout with a conversation sidebar and an active thread pane.</p>

This demo shows how to use `ChatBox` as a full inbox surface with multiple conversations.
The conversation sidebar is enabled explicitly with `features={{ conversationList: true }}`.

- A two-pane layout with a conversation list on the left and the active thread on the right
- Controlled `activeConversationId` with `onActiveConversationChange` for conversation switching
- Controlled `messages` and `onMessagesChange` for per-conversation message state
- `conversations` with `unreadCount` and `readState` reflected in the sidebar

{{"demo": "MultiConversation.js", "bg": "inline"}}

## Controlled vs. uncontrolled conversations

This demo uses **controlled state** so each conversation keeps its own message history:

```tsx
const [activeConversationId, setActiveConversationId] = React.useState('thread-a');
const [threads, setThreads] = React.useState({ 'thread-a': [], 'thread-b': [] });

<ChatBox
  activeConversationId={activeConversationId}
  messages={threads[activeConversationId] ?? []}
  features={{ conversationList: true }}
  onActiveConversationChange={(nextId) => setActiveConversationId(nextId)}
  onMessagesChange={(nextMessages) => {
    setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
  }}
/>;
```

For simpler use cases with a single conversation, use `initialActiveConversationId` and `initialMessages` instead.

## Conversation list behavior

The conversation list renders only when `features.conversationList` is `true`.
If you omit that flag, `ChatBox` renders only the active thread pane even when multiple conversations are available.

## Implementation notes

- Store message threads in a `Record<string, ChatMessage[]>` keyed by `conversationId`.
- Sync conversation previews after messages change using `onMessagesChange`.
- The `unreadCount` and `readState` on each conversation drive the sidebar badge and read indicator.

## See also

- [Custom theme](/x/react-chat/material/examples/custom-theme/) to apply brand colors across the entire surface
- [Customization](/x/react-chat/material/customization/) for `slotProps` on the conversation list and thread header

## API

- [ChatRoot](/x/api/chat/chat-root/)
