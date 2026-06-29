---
title: Chat - Controlled state
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Controlled state

<p class="description">Manage messages, conversations, and composer state externally using the controlled and uncontrolled patterns.</p>

The controlled state model lets the parent component own messages, conversations, and composer state while the runtime still streams and normalizes them internally.
All four public state models are owned by the parent component while the runtime still streams, normalizes, and derives selectors internally.

## Key concepts

### The four controlled models

Each model has a controlled prop, a change callback, and an uncontrolled default:

| Model               | Controlled prop        | Change callback              |
| :------------------ | :--------------------- | :--------------------------- |
| Messages            | `messages`             | `onMessagesChange`           |
| Conversations       | `conversations`        | `onConversationsChange`      |
| Active conversation | `activeConversationId` | `onActiveConversationChange` |
| Composer value      | `composerValue`        | `onComposerValueChange`      |

### Wiring controlled state

Pass your React state directly to `ChatProvider`:

```tsx
<ChatProvider
  adapter={adapter}
  conversations={conversations}
  onConversationsChange={setConversations}
  activeConversationId={activeConversationId}
  onActiveConversationChange={setActiveConversationId}
  messages={messages}
  onMessagesChange={setMessages}
  composerValue={composerValue}
  onComposerValueChange={setComposerValue}
>
  <ControlledStateChat />
</ChatProvider>
```

### When to use controlled state

Use controlled state when you need to:

- sync chat state with a global store (Redux, Zustand, and so on)
- persist messages across navigation or page reloads
- drive the conversation list from an external data source
- coordinate the composer value with external UI (for example, slash commands)

The demo below shows controlled state wired through `ChatProvider`:

{{"demo": "ControlledStateHeadlessChat.js"}}

## Key takeaways

- Controlled state lets you own the source of truth while the runtime handles streaming and normalization.
- Switch from uncontrolled to controlled at any time without changing the runtime model.
- The `onMessagesChange` callback fires with the full array after every update, including streaming deltas.

## See also

- [State and store](/x/react-chat/core/state/) for details on the `ChatProvider` props reference.
- [Selector-driven thread](/x/react-chat/core/examples/selector-driven-thread/) for details on efficient rendering with controlled state.
- [Conversation history](/x/react-chat/core/examples/conversation-history/) for details on adapter-driven conversation loading.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
