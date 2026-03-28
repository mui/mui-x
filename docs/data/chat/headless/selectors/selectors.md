---
productId: x-chat
title: Chat - Headless selectors
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Headless selectors

<p class="description">Subscribe to exactly the store slices you need with memoized selectors for efficient, granular rendering</p>

`chatSelectors` is a collection of memoized selectors that read from the normalized chat store.
They power the built-in hooks and can also be used directly with `useChatStore()` for advanced subscriptions.

```tsx
import { chatSelectors, useChatStore } from '@mui/x-chat/headless';
```

The following demo uses selectors for efficient rendering:

{{"demo": "../examples/selector-driven-thread/SelectorDrivenThread.js", "bg": "inline", "defaultCodeOpen": false}}

## Selector reference

### Direct state selectors

These selectors read a single field from the store and return it directly:

| Selector               | Return type                        | Description                        |
| :--------------------- | :--------------------------------- | :--------------------------------- |
| `messageIds`           | `string[]`                         | Ordered message IDs                |
| `messagesById`         | `Record<string, ChatMessage>`      | Message map by ID                  |
| `conversationIds`      | `string[]`                         | Ordered conversation IDs           |
| `conversationsById`    | `Record<string, ChatConversation>` | Conversation map by ID             |
| `activeConversationId` | `string \| undefined`              | Active conversation ID             |
| `isStreaming`          | `boolean`                          | Whether a stream is active         |
| `hasMoreHistory`       | `boolean`                          | Whether more history can be loaded |
| `error`                | `ChatError \| null`                | Current runtime error              |
| `composerValue`        | `string`                           | Current draft text                 |
| `composerAttachments`  | `ChatDraftAttachment[]`            | Draft attachments                  |

### Derived selectors

These selectors combine multiple store fields and memoize the result:

| Selector             | Return type                     | Description                                       |
| :------------------- | :------------------------------ | :------------------------------------------------ |
| `messages`           | `ChatMessage[]`                 | All messages as an array (derived from IDs + map) |
| `conversations`      | `ChatConversation[]`            | All conversations as an array                     |
| `activeConversation` | `ChatConversation \| undefined` | The active conversation record                    |
| `messageCount`       | `number`                        | Number of messages                                |
| `conversationCount`  | `number`                        | Number of conversations                           |

### Parameterized selectors

| Selector        | Signature                                              | Description                                            |
| :-------------- | :----------------------------------------------------- | :----------------------------------------------------- |
| `message`       | `(state, id: string) => ChatMessage \| undefined`      | Single message by ID                                   |
| `conversation`  | `(state, id: string) => ChatConversation \| undefined` | Single conversation by ID                              |
| `typingUserIds` | `(state, conversationId?: string) => string[]`         | User IDs typing in a conversation (defaults to active) |

## Using selectors with `useChatStore()`

The hooks `useMessageIds()`, `useMessage(id)`, and others are convenience wrappers around `useChatStore()` + `chatSelectors`.
When you need a custom derived value, use the store directly:

```tsx
import { useChatStore, chatSelectors } from '@mui/x-chat/headless';
import { useStore } from '@mui/x-internals/store';

function MessageCounter() {
  const store = useChatStore();
  const count = useStore(store, chatSelectors.messageCount);

  return <span>{count} messages</span>;
}
```

### Parameterized selectors

For selectors that take an argument, pass a selector function:

```tsx
function ConversationTitle({ id }: { id: string }) {
  const store = useChatStore();
  const conversation = useStore(store, chatSelectors.conversation, id);

  return <span>{conversation?.title ?? 'Untitled'}</span>;
}
```

## Why normalization matters

The store keeps messages and conversations in a normalized shape (`ids` + `byId` maps) rather than flat arrays.
This design has three benefits:

1. **Point updates** — Updating a single message during streaming does not rebuild the message array. Only the `messagesById` record changes.
2. **Stable references** — The `messageIds` array only changes when messages are added or removed, not when their content updates. `useMessageIds()` stays stable during streaming.
3. **Memoized derivation** — The `messages` selector rebuilds the array only when either `messageIds` or `messagesById` changes, and the result is reference-equal when inputs are unchanged.

This is why the `useMessageIds()` + `useMessage(id)` pattern performs well for large threads — the ID list stays stable while individual rows subscribe to their own message record.

## API

- [ChatRoot](/x/api/chat/chat-root/)

## See also

- [Hooks](/x/react-chat/headless/hooks/) for the hook API that wraps these selectors.
- [State and store](/x/react-chat/headless/state/) for the internal state shape and controlled/uncontrolled models.
- [Advanced store access](/x/react-chat/headless/examples/advanced-store-access/) for a demo using `useChatStore()` with custom selectors.
- [Selector-driven thread](/x/react-chat/headless/examples/selector-driven-thread/) for the row-level subscription pattern in action.
