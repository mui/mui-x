---
productId: x-chat
title: Selectors reference
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Selectors reference

<p class="description">Subscribe to exactly the store slices you need with selectors for efficient, granular rendering.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`chatSelectors` is a collection of selectors — several memoized — that read from the normalized chat store.
They power the built-in hooks and can also be used directly with `useChatStore()` and `useStore()` for advanced subscriptions.

```tsx
import { chatSelectors, useChatStore } from '@mui/x-chat/headless';
```

## Direct state selectors

These selectors read a single field from the store and return it directly:

| Selector               | Return type                        | Description                          |
| :--------------------- | :--------------------------------- | :----------------------------------- |
| `messageIds`           | `string[]`                         | Ordered message IDs                  |
| `messagesById`         | `Record<string, ChatMessage>`      | Message map by ID                    |
| `conversationIds`      | `string[]`                         | Ordered conversation IDs             |
| `conversationsById`    | `Record<string, ChatConversation>` | Conversation map by ID               |
| `activeConversationId` | `string \| undefined`              | Active conversation ID               |
| `isStreaming`          | `boolean`                          | Whether a stream is active           |
| `hasMoreHistory`       | `boolean`                          | Whether more history can be loaded   |
| `isLoadingHistory`     | `boolean`                          | Whether a history fetch is in flight |
| `error`                | `ChatError \| null`                | Current runtime error                |
| `composerValue`        | `string`                           | Current draft text                   |
| `composerAttachments`  | `ChatDraftAttachment[]`            | Draft attachments                    |

## Derived selectors

These selectors combine multiple store fields. Array-building selectors memoize their result; the others return stored references or primitives, which are stable by construction:

| Selector                             | Return type                     | Description                                          |
| :----------------------------------- | :------------------------------ | :--------------------------------------------------- |
| `messages`                           | `ChatMessage[]`                 | All messages as an array (derived from IDs + map)    |
| `conversations`                      | `ChatConversation[]`            | All conversations as an array                        |
| `activeConversation`                 | `ChatConversation \| undefined` | The active conversation record                       |
| `messageCount`                       | `number`                        | Number of messages                                   |
| `conversationCount`                  | `number`                        | Number of conversations                              |
| `typingUserIdsForActiveConversation` | `string[]`                      | User IDs currently typing in the active conversation |

## Parameterized selectors

| Selector        | Signature                                              | Description                                                                                                                                                                                     |
| :-------------- | :----------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message`       | `(state, id: string) => ChatMessage \| undefined`      | Single message by ID                                                                                                                                                                            |
| `conversation`  | `(state, id: string) => ChatConversation \| undefined` | Single conversation by ID                                                                                                                                                                       |
| `typingUserIds` | `(state, conversationId?: string) => string[]`         | User IDs typing in a conversation (defaults to active)                                                                                                                                          |
| `messageError`  | `(state, id: string) => ChatError \| null`             | Error for a message; `null` unless the message `status` is `'error'`                                                                                                                            |
| `messageAuthor` | `(state, id: string, parameters) => author \| null`    | Resolved author for a message (`id`, `displayName`, `avatarUrl`, `isOwnMessage`), applying `currentUser`, `members`, and the author getter props; pass `store.parameters` as the third argument |

:::warning
When reading typing users for the active conversation, use `chatSelectors.typingUserIdsForActiveConversation` instead of wrapping `typingUserIds` in an inline function like `(state) => chatSelectors.typingUserIds(state, undefined)` — a new inline wrapper on every render defeats memoization and forces resubscription.
:::

## Using selectors with `useChatStore()`

The hooks `useMessageIds()`, `useMessage(id)`, and others are convenience wrappers around `useChatStore()` + `chatSelectors`.
When you need a custom derived value, use the store directly:

`useChatStore()` returns the chat `Store` instance. To subscribe a component to a selector, pass both to `useStore()` from `@mui/x-internals/store` — the same subscription utility the built-in hooks use internally. This import is the supported way to read the store with a selector.

```tsx
import { useChatStore, chatSelectors } from '@mui/x-chat/headless';
import { createSelectorMemoized, useStore } from '@mui/x-internals/store';

const failedMessageCount = createSelectorMemoized(
  chatSelectors.messages,
  (messages) => messages.filter((message) => message.status === 'error').length,
);

function FailedMessageBadge() {
  const store = useChatStore();
  const count = useStore(store, failedMessageCount);

  return <span>{count} failed</span>;
}
```

{{"demo": "../../core/examples/advanced-store-access/AdvancedStoreAccessHeadlessChat.js", "bg": "inline", "defaultCodeOpen": false}}

### Calling parameterized selectors

For selectors that take an argument, pass a selector function:

```tsx
function ConversationTitle({ id }: { id: string }) {
  const store = useChatStore();
  const conversation = useStore(store, chatSelectors.conversation, id);
  const author = useStore(store, chatSelectors.messageAuthor, id, store.parameters);

  return <span>{conversation?.title ?? author?.displayName ?? 'Untitled'}</span>;
}
```

## Memoization and reference stability

`messages`, `conversations`, `messageAuthor`, `typingUserIds`, and `typingUserIdsForActiveConversation` are built with `createSelectorMemoized` and return reference-equal results while their inputs are unchanged.
`message`, `conversation`, and `activeConversation` use plain `createSelector` but return the stored record itself, so the reference only changes when that record updates.
`messageCount`, `conversationCount`, and `messageError` return primitives or `null`-able stored values, where reference stability is moot.

`createSelectorMemoized` keeps a single-entry cache per store (`maxSize: 1`), so for the parameterized memoized selectors (`messageAuthor`, `typingUserIds`) reference equality only holds while consecutive calls use the same arguments — alternating IDs across many ad-hoc subscribers thrashes the single-entry cache.
Each `useStore` subscription still avoids re-renders via its own equality handling; this caveat is about cross-subscriber cache hits, not correctness.

## Why normalization matters

The store keeps messages and conversations in a normalized shape (`ids` + `byId` maps) rather than flat arrays.
The design has three benefits:

- **Point updates**—updating a single message during streaming does not rebuild the message array.
  Only the `messagesById` record changes.
- **Stable references**—the `messageIds` array only changes when messages are added or removed, not when their content updates.
  `useMessageIds()` stays stable during streaming.
- **Memoized derivation**—the `messages` selector rebuilds the array only when either `messageIds` or `messagesById` changes, and the result is reference-equal when inputs are unchanged.

This is why the `useMessageIds()` + `useMessage(id)` pattern performs well for large threads—the ID list stays stable while individual rows subscribe to their own message record.

{{"demo": "../../core/examples/selector-driven-thread/SelectorDrivenThread.js", "bg": "inline", "defaultCodeOpen": false}}

## See also

- See [Hooks reference](/x/react-chat/resources/hooks/) for details.
- See [Controlled state](/x/react-chat/backend/controlled-state/) for details.
- See [Performance](/x/react-chat/resources/performance/) for details.
