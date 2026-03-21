---
title: Chat - Multi-conversation
productId: x-chat
packageName: '@mui/x-chat'
---

# Multi-conversation

<p class="description">A two-pane inbox layout with a conversation sidebar and an active thread pane.</p>

This recipe shows how to use `ChatBox` as a full inbox surface with multiple conversations.
The conversation sidebar is rendered automatically when more than one conversation is provided.

{{"demo": "MultiConversation.js", "bg": "inline"}}

## What it shows

- A two-pane layout with a conversation list on the left and the active thread on the right
- Controlled `activeConversationId` with `onActiveConversationChange` for conversation switching
- Controlled `messages` and `onMessagesChange` for per-conversation message state
- `conversations` with `unreadCount` and `readState` reflected in the sidebar

## Controlled vs. uncontrolled conversations

This demo uses **controlled state** so each conversation keeps its own message history:

```tsx
const [activeConversationId, setActiveConversationId] = React.useState('thread-a');
const [threads, setThreads] = React.useState({ 'thread-a': [], 'thread-b': [] });

<ChatBox
  activeConversationId={activeConversationId}
  messages={threads[activeConversationId] ?? []}
  onActiveConversationChange={(nextId) => setActiveConversationId(nextId)}
  onMessagesChange={(nextMessages) => {
    setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
  }}
/>;
```

For simpler use cases with a single conversation, use `defaultActiveConversationId` and `defaultMessages` instead.

## Conversation list behavior

The conversation list renders automatically when `conversations` contains more than one item.
If only one conversation is provided, `ChatBox` renders the thread pane directly without a sidebar.

## Implementation notes

- Store message threads in a `Record<string, ChatMessage[]>` keyed by `conversationId`.
- Sync conversation previews after messages change using `onMessagesChange`.
- The `unreadCount` and `readState` on each conversation drive the sidebar badge and read indicator.

## Next steps

- See [Custom theme](/x/react-chat/material/examples/custom-theme/) to apply brand colors across the entire surface.
- See [Customization](/x/react-chat/material/customization/) for `slotProps` on the conversation list and thread header.
