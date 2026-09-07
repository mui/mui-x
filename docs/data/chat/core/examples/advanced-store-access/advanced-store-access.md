---
title: Chat - Advanced store access
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Advanced store access

<p class="description">Use the store escape hatch to subscribe to exactly the runtime slices you want.</p>

Bypass the convenience hooks and work directly with the normalized store to build custom dashboards, metrics, or specialized derived views:

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

- You need a derived value that no built-in hook provides (for example, message count, active conversation title).
- You are building a metrics dashboard or debug panel.
- You need to subscribe to store changes outside the React render cycle.
- You want to combine multiple selectors into a single subscription.

For standard rendering, the built-in hooks (`useChat()`, `useMessageIds()`, `useMessage()`, and so on) are sufficient.

The demo below shows how to combine `useChatStore()` with `chatSelectors` to render live counts and streaming state:

{{"demo": "AdvancedStoreAccessHeadlessChat.js"}}

## Key takeaways

- `useChatStore()` is the escape hatch for advanced store access.
- `chatSelectors` provides memoized selectors for all store slices.
- Combine with `useStore()` for React subscriptions or use the store directly for imperative access.
- Prefer the built-in hooks for standard use cases—they wrap these selectors with a better developer experience.

## See also

- See [Selectors](/x/react-chat/core/selectors/) for the full selector reference.
- See [Hooks](/x/react-chat/core/hooks/) for the convenience hooks that wrap these selectors.
- See [State and store](/x/react-chat/core/state/) for details on the normalized store internals.
- See [Selector-driven thread](/x/react-chat/core/examples/selector-driven-thread/) for the `useMessageIds()` + `useMessage(id)` pattern.

## API

- [ChatRoot](/x/api/chat/chat-root/)
