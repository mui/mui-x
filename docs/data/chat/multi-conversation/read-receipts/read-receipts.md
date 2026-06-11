---
productId: x-chat
title: Read receipts
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatUnreadMarker
---

# Chat - Read receipts

<p class="description">Track unread conversations and mark them as read when you call markRead.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

Read receipts let users see which conversations have unread messages and let you mark them as read — for example, when a conversation is opened or scrolled to the bottom — by calling the adapter's `markRead()` method.
Three pieces work together: the `readState` and `unreadCount` fields on `ChatConversation`, the `markRead()` adapter method, and the `read` real-time event.

In the demo below, one conversation starts unread. Open it from the sidebar: the "New messages" divider marks the unread boundary, and scrolling to the bottom of the thread fires `onReachBottom`, which calls `markRead` — the sidebar badge and the divider clear together.

{{"demo": "ReadReceiptsTwoPane.js", "bg": "inline"}}

## Conversation read state

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

The conversation list renders an unread badge automatically when a conversation has `unreadCount > 0` or `readState: 'unread'`.
The `unreadBadge` slot displays the count, and the `title` slot renders in bold when the conversation is unread.

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

## Displaying the unread boundary

`ChatUnreadMarker` is an in-thread divider that appears inside the message list at the boundary between already-read messages and the first unread message.
It displays a "New messages" label (localizable via `unreadMarkerLabel`) styled as a horizontal rule with a centered caption.

The marker is disabled by default. Enable it on `ChatBox` (or a standalone `ChatMessageList`) with the `unreadMarker` feature flag:

```tsx
<ChatBox adapter={adapter} features={{ unreadMarker: true }} />
```

The component is position-aware: it reads `unreadCount` and `readState` from the active `ChatConversation` and calculates which message index sits at the read/unread boundary.
It renders itself only for that one message and returns `null` for every other message, so you can render it inside every list item without any extra bookkeeping.
With the feature flag enabled, the default message row renders the marker for you — the snippet below is only needed when you provide your own `renderItem` callback. The `id` and `index` values come from the message list's `renderItem` contract — see the [ChatMessageList API](/x/react-chat/api/chat-message-list/).

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

The marker chooses its position using these rules:

- When `unreadCount` is set and greater than zero, the marker appears before the last `unreadCount` messages (`items.length - unreadCount`).
- When `unreadCount` is absent but `readState` is `'unread'`, the marker appears before the very first message.
- When the conversation is fully read (or no conversation is active), the marker renders nothing.

The rendered root has `role="separator"` so assistive technology announces the read/unread boundary, and exposes `data-has-boundary` for styling and tests.
See the [Unread marker page](/x/react-chat/display/unread-marker/) for the full accessibility behavior.

### Customizing `ChatUnreadMarker`

With the feature enabled, pass `slotProps.unreadMarker` on `ChatBox` to forward extra props, or swap the component entirely with `slots.unreadMarker`:

```tsx
<ChatBox
  features={{ unreadMarker: true }}
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

For the full list of props, slots, and classes, see the [ChatUnreadMarker API](/x/react-chat/api/chat-unread-marker/) and the interactive playground on the [Unread marker page](/x/react-chat/display/unread-marker/).

## Marking messages as read

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

The runtime does not call `markRead` automatically. Call it from a UI event handler when the user opens or scrolls through a conversation.

### Triggering `markRead` when a conversation becomes active

The most common pattern is to mark a conversation as read the moment the user opens it.
Use the `onActiveConversationChange` prop on `ChatBox` (or `ChatProvider`) to call the adapter:

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
/>;
```

### Triggering `markRead` when the user scrolls to the bottom

For long conversations, mark messages as read only once the user has scrolled to the last message.
Use the `onReachBottom` callback on the `messageList` slot combined with a ref to the current conversation:

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
/>;
```

`onReachBottom` fires once per entry into the bottom zone (the auto-scroll `buffer`, 150 px by default), so `markRead` is not called repeatedly while the user stays at the bottom.
It does not fire when new messages arrive while the user is already at the bottom, nor when switching conversations.
Combine it with the `onActiveConversationChange` recipe above to cover conversation activation and conversations that open already scrolled to the bottom.
The demo at the top of this page implements this pattern.

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

## See also

- [Conversation list](/x/react-chat/multi-conversation/conversation-list/) for the sidebar that displays the unread badge.
- [Unread marker](/x/react-chat/display/unread-marker/) for the standalone component guide and playground.
- [Real-time sync](/x/react-chat/multi-conversation/real-time-sync/) for the full real-time event reference, including `read` events.
- [Adapter interface reference](/x/react-chat/backend/adapters/) for the full contract between your backend and the chat runtime, including `markRead()`.
