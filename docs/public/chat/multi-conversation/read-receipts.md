---
productId: x-chat
title: Read Receipts
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatUnreadMarker
---

# Chat - Read Receipts

<p class="description">Track and display read/unread state for conversations using the <code>markRead</code> adapter method and the conversation list's unread badge.</p>



:::info
Read Receipts is part of the MUI X Pro plan.
:::

Read receipts let users see which conversations have unread messages and mark them as read when opened. The system uses three pieces working together: the `readState` and `unreadCount` fields on `ChatConversation`, the `markRead()` adapter method, and the `read` realtime event.

## Read/unread state on `ChatConversation` [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Each `ChatConversation` object carries read state:

```ts
interface ChatConversation {
  id: string;
  title?: string;
  unreadCount?: number;
  readState?: ConversationReadState; // 'read' | 'unread'
  // ... other fields
}
```

| Field         | Type                     | Description                                          |
| :------------ | :----------------------- | :--------------------------------------------------- |
| `unreadCount` | `number \| undefined`    | Number of unread messages in the conversation        |
| `readState`   | `'read' \| 'unread'`    | Whether the conversation has been read by the user   |

These fields are set when conversations are loaded through `listConversations()` and updated in real time through `read` events from the `subscribe()` method.

## Badge display in the conversation list

The conversation list renders an unread badge automatically when a conversation has `unreadCount > 0` or `readState: 'unread'`. The `unreadBadge` slot displays the count, and the `title` slot renders in bold when the conversation is unread.

The item's `ownerState` includes an `unread` boolean derived from the conversation's read state:

```ts
// Item ownerState
{
  selected: boolean;
  unread: boolean;    // true when readState === 'unread' or unreadCount > 0
  focused: boolean;
  conversation: ChatConversation;
}
```

This `unread` flag drives both the badge visibility and the bold title weight in the default styled slots.

## The `markRead` adapter method

Implement `markRead` to signal to your backend that the user has seen a conversation or a specific message:

```ts
interface ChatMarkReadInput {
  conversationId: string;
  messageId?: string; // mark all messages up to this one as read
}
```

```tsx
async markRead({ conversationId, messageId }) {
  await fetch('/api/mark-read', {
    method: 'POST',
    body: JSON.stringify({ conversationId, messageId }),
  });
},
```

The runtime does not call `markRead` automatically — call it from your own UI event handler when the user opens or scrolls through a conversation. For example, mark a conversation as read when it becomes the active thread:

```tsx
const adapter = React.useMemo(
  () => ({
    async sendMessage(input) {
      /* ... */
    },
    async markRead({ conversationId }) {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
      });
    },
  }),
  [],
);
```

## Real-time read events

When other users read messages, your backend can push `read` events through the `subscribe()` method to update the conversation's read state in real time:

```ts
onEvent({
  type: 'read',
  conversationId: 'support',
  messageId: 'msg-42',
  userId: 'user-2',
});
```

The runtime processes `read` events and updates the `readState` and `unreadCount` fields on the matching `ChatConversation` in the store.

| Event field      | Type                  | Description                                |
| :--------------- | :-------------------- | :----------------------------------------- |
| `conversationId` | `string`              | The conversation being marked as read      |
| `messageId`      | `string \| undefined` | Mark all messages up to this one           |
| `userId`         | `string \| undefined` | The user who read the conversation         |

## Providing initial conversations with read state

When loading conversations through `listConversations`, include the read state from your backend:

```tsx
async listConversations() {
  const res = await fetch('/api/conversations');
  const { conversations } = await res.json();
  // Each conversation includes unreadCount and readState from the server
  return { conversations };
},
```

Or provide initial conversations directly:

```tsx
<ChatBox
  conversations={[
    { id: 'support', title: 'Support', unreadCount: 3, readState: 'unread' },
    { id: 'general', title: 'General', unreadCount: 0, readState: 'read' },
  ]}
/>
```

## API

- [`ChatUnreadMarker`](/x/api/chat-unread-marker/)

## See also

- [Conversation List](/x/react-chat/multi-conversation/conversation-list/) for the sidebar that displays the unread badge.
- [Real-Time Sync](/x/react-chat/multi-conversation/real-time-sync/) for the full realtime event reference including `read` events.
- [Adapter](/x/react-chat/backend/adapters/) for the complete adapter interface including `markRead()`.
