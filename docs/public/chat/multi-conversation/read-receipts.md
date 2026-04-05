---
productId: x-chat
title: Read Receipts
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatUnreadMarker
---

# Chat - Read Receipts

<p class="description">Track and display read/unread state for conversations using the <code>markRead</code> adapter method and the conversation list's unread badge.</p>



Read receipts let users see which conversations have unread messages and mark them as read when opened. The system uses three pieces working together: the `readState` and `unreadCount` fields on `ChatConversation`, the `markRead()` adapter method, and the `read` realtime event.

## Read/unread state on `ChatConversation`

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

| Field         | Type                  | Description                                        |
| :------------ | :-------------------- | :------------------------------------------------- |
| `unreadCount` | `number \| undefined` | Number of unread messages in the conversation      |
| `readState`   | `'read' \| 'unread'`  | Whether the conversation has been read by the user |

These fields are set when conversations are loaded through `listConversations()` and updated in real time through `read` events from the `subscribe()` method.

## Badge display in the conversation list

The conversation list renders an unread badge automatically when a conversation has `unreadCount > 0` or `readState: 'unread'`. The `unreadBadge` slot displays the count, and the `title` slot renders in bold when the conversation is unread.

The item's `ownerState` includes an `unread` boolean derived from the conversation's read state:

```ts
// Item ownerState
{
  selected: boolean;
  unread: boolean; // true when readState === 'unread' or unreadCount > 0
  focused: boolean;
  conversation: ChatConversation;
}
```

This `unread` flag drives both the badge visibility and the bold title weight in the default styled slots.

## The `ChatUnreadMarker` component

`ChatUnreadMarker` is an in-thread divider that appears inside the message list at the boundary between already-read messages and the first unread message. It displays a "New messages" label (localizable via `unreadMarkerLabel`) styled as a horizontal rule with a centered caption.

The component is position-aware: it reads `unreadCount` and `readState` from the active `ChatConversation` and calculates which message index sits at the read/unread boundary. It renders itself only for that one message and returns `null` for every other message, so you can render it inside every list item without any extra bookkeeping:

```tsx
// Inside a custom renderItem callback
function MessageItem({ id, index }) {
  return (
    <React.Fragment>
      <ChatUnreadMarker messageId={id} index={index} />
      <ChatMessage messageId={id} />
    </React.Fragment>
  );
}
```

The boundary is computed as follows:

- When `unreadCount` is set and greater than zero, the marker appears before the last `unreadCount` messages (`items.length - unreadCount`).
- When `unreadCount` is absent but `readState` is `'unread'`, the marker appears before the very first message.
- When the conversation is fully read (or no conversation is active), the marker renders nothing.

### Customizing `ChatUnreadMarker`

Pass `slotProps.unreadMarker` on `ChatBox` to forward extra props, or swap the component entirely with `slots.unreadMarker`:

```tsx
<ChatBox
  slotProps={{
    unreadMarker: {
      label: <strong>Unread messages below</strong>,
    },
  }}
/>
```

To override styles with the MUI theme, use the `MuiChatUnreadMarker` key:

```tsx
const theme = createTheme({
  components: {
    MuiChatUnreadMarker: {
      styleOverrides: {
        root: { opacity: 0.7 },
        label: { fontStyle: 'italic' },
      },
    },
  },
});
```

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

The runtime does not call `markRead` automatically — call it from your own UI event handler when the user opens or scrolls through a conversation.

### Triggering `markRead` when a conversation becomes active

The most common pattern is to mark a conversation as read the moment the user opens it. Use the `onActiveConversationChange` prop on `ChatBox` (or `ChatProvider`) to call the adapter:

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

<ChatBox
  adapter={adapter}
  onActiveConversationChange={(id) => {
    if (id) {
      adapter.markRead({ conversationId: id });
    }
  }}
/>
```

### Triggering `markRead` when the user scrolls to the bottom

For long conversations you may prefer to mark messages as read only once the user has scrolled to the last message. Use the `onReachBottom` callback on the `messageList` slot combined with a ref to the current conversation:

```tsx
const activeConversationIdRef = React.useRef<string | undefined>(undefined);

<ChatBox
  adapter={adapter}
  onActiveConversationChange={(id) => {
    activeConversationIdRef.current = id ?? undefined;
  }}
  slotProps={{
    messageList: {
      onReachBottom: () => {
        const id = activeConversationIdRef.current;
        if (id) {
          adapter.markRead({ conversationId: id });
        }
      },
    },
  }}
/>
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

| Event field      | Type                  | Description                           |
| :--------------- | :-------------------- | :------------------------------------ |
| `conversationId` | `string`              | The conversation being marked as read |
| `messageId`      | `string \| undefined` | Mark all messages up to this one      |
| `userId`         | `string \| undefined` | The user who read the conversation    |

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

- [`ChatUnreadMarker`](/x/api/chat/chat-unread-marker/)

## See also

- [Conversation List](/x/react-chat/multi-conversation/conversation-list/) for the sidebar that displays the unread badge.
- [Real-Time Sync](/x/react-chat/multi-conversation/real-time-sync/) for the full realtime event reference including `read` events.
- [Adapter](/x/react-chat/backend/adapters/) for the complete adapter interface including `markRead()`.
