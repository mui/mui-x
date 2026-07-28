---
title: Chat - Multi-conversation
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Multi-conversation

<p class="description">Render an inbox-style chat surface with a conversation sidebar alongside the active thread.</p>

Use `ChatBox` as a full inbox surface to coordinate multiple conversations from a single component.
The conversation sidebar is enabled explicitly with `features={{ conversationList: true }}`.

- A two-pane layout with a conversation list on the left and the active thread on the right.
- Controlled `activeConversationId` with `onActiveConversationChange` for conversation switching.
- Controlled `messages` and `onMessagesChange` for per-conversation message state.
- `conversations` with `unreadCount` and `readState` reflected in the sidebar.

The demo below shows the inbox layout switching between two conversations while preserving each thread's history:

{{"demo": "MultiConversation.js", "bg": "inline"}}

## Controlled and uncontrolled conversations

Use **controlled state** to keep each conversation's message history independent, as shown below:

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
Omit that flag to render only the active thread pane, even when multiple conversations are available.

## Implementing multi-conversation state

- Store message threads in a `Record<string, ChatMessage[]>` keyed by `conversationId`.
- Sync conversation previews after messages change using `onMessagesChange`.
- The `unreadCount` and `readState` on each conversation drive the sidebar badge and read indicator.

## See also

- See [Custom theme](/x/react-chat/material/examples/custom-theme/) for details on applying brand colors across the entire surface.
- See [Customization](/x/react-chat/material/customization/) for details on `slotProps` for the conversation list and thread header.

## API

- [ChatRoot](/x/api/chat/chat-root/)
