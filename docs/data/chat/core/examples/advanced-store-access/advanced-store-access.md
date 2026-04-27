---
title: Chat - Advanced store access
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Advanced store access

<p class="description">Use the store escape hatch to subscribe to exactly the runtime slices you want.</p>

This demo is intentionally advanced.
It demonstrates how to bypass the convenience hooks and work directly with the normalized store for custom dashboards, metrics, or highly specialized derived views:

- `useChatStore()` to get the underlying store instance
- `chatSelectors` to read specific store slices
- custom selector subscriptions for derived values

## Key concepts

### Getting the store

`useChatStore()` returns the `ChatStore<Cursor>` instance created by `ChatProvider`:

```tsx
import { useChatStore, chatSelectors } from '@mui/x-chat/headless';
import { useStore } from '@mui/x-internals/store';

function Dashboard() {
  const store = useChatStore();
  const messageCount = useStore(store, chatSelectors.messageCount);
  const conversationCount = useStore(store, chatSelectors.conversationCount);
  const isStreaming = useStore(store, chatSelectors.isStreaming);

  return (
    <div>
      <span>{messageCount} messages</span>
      <span>{conversationCount} conversations</span>
      <span>{isStreaming ? 'Streaming' : 'Idle'}</span>
    </div>
  );
}
```

### Parameterized selectors

Some selectors accept arguments.
Pass them as additional arguments to `useStore()`:

```tsx
// Single message by ID
const message = useStore(store, chatSelectors.message, 'msg-42');

// Single conversation by ID
const conversation = useStore(store, chatSelectors.conversation, 'support');

// Typing users in a specific conversation
const typingUserIds = useStore(store, chatSelectors.typingUserIds, 'support');

// Typing users in the active conversation (no conversationId needed)
const activeTypingUserIds = useStore(
  store,
  chatSelectors.typingUserIdsForActiveConversation,
);
```

### When to use direct store access

Use `useChatStore()` + `chatSelectors` when:

- you need a derived value that no built-in hook provides (for example, message count, active conversation title)
- you are building a metrics dashboard or debug panel
- you need to subscribe to store changes outside the React render cycle
- you want to combine multiple selectors into a single subscription

For standard rendering, the built-in hooks (`useChat()`, `useMessageIds()`, `useMessage()`, etc.) are easier and sufficient.

{{"demo": "AdvancedStoreAccessHeadlessChat.js"}}

## Key takeaways

- `useChatStore()` is the escape hatch for advanced store access
- `chatSelectors` provides memoized selectors for all store slices
- Combine with `useStore()` for React subscriptions or use the store directly for imperative access
- Prefer the built-in hooks for standard use cases—they wrap these selectors with a better developer experience

## See also

- [Selectors](/x/react-chat/core/selectors/) for the full selector reference
- [Hooks](/x/react-chat/core/hooks/) for the convenience hooks that wrap these selectors
- [State and store](/x/react-chat/core/state/) for the normalized store internals
- [Selector-driven thread](/x/react-chat/core/examples/selector-driven-thread/) for the `useMessageIds()` + `useMessage(id)` pattern

## API

- [ChatRoot](/x/api/chat/chat-root/)
