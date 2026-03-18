---
title: Chat - Selector-driven thread
productId: x-chat
packageName: '@mui/x-chat-headless'
---

# Selector-driven thread

<p class="description">Render large custom threads efficiently with IDs at the list level and row-level message subscriptions.</p>

## What this example shows

This recipe demonstrates the performance-focused rendering pattern for threads with many messages.
Instead of subscribing the entire list to every message change, each row subscribes only to its own message record.

## Key concepts

### The ID list + row subscription pattern

The parent component calls `useMessageIds()` to get the ordered list of message IDs.
Each row component calls `useMessage(id)` to subscribe to its own message:

```tsx
function Thread() {
  const messageIds = useMessageIds();

  return (
    <div>
      {messageIds.map((id) => (
        <MessageRow key={id} id={id} />
      ))}
    </div>
  );
}

const MessageRow = React.memo(function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  if (!message) return null;

  return <div>{message.parts[0]?.type === 'text' ? message.parts[0].text : null}</div>;
});
```

### Why this matters

The store keeps messages in a normalized shape (`messageIds` + `messagesById`).
When a single message updates during streaming:

- `messageIds` stays reference-equal because the ID list did not change
- Only the `messagesById` entry for the updated message changes
- `useMessage(id)` on the updated row triggers a re-render
- All other rows stay untouched

This means that for a thread with 100 messages where one is streaming, only one component re-renders per delta — not 100.

### Conversation-level selectors

The same pattern applies to conversations:

```tsx
const conversations = useConversations();
const conversation = useConversation('selectors');
```

{{"demo": "SelectorDrivenThread.js"}}

## Key takeaways

- `useMessageIds()` + `useMessage(id)` is the recommended pattern for threads with more than a handful of messages
- The normalized store ensures stable references — only changed data triggers re-renders
- Wrap row components in `React.memo()` for maximum efficiency
- `useConversations()` and `useConversation(id)` follow the same pattern for conversation lists

## Next steps

- [Selectors](/x/react-chat/headless/selectors/) for the full selector API and custom subscriptions
- [Hooks](/x/react-chat/headless/hooks/) for all available hooks
- [Advanced store access](/x/react-chat/headless/examples/advanced-store-access/) for custom selectors with `useChatStore()`
