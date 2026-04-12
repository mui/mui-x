---
title: Chat - Controlled state
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Controlled state

<p class="description">Drive the public chat models from React state while the runtime keeps normalized internals.</p>

This demo demonstrates the controlled state model — the major public design choice of the core package.
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

- sync chat state with a global store (Redux, Zustand, etc.)
- persist messages across navigation or page reloads
- drive the conversation list from an external data source
- coordinate the composer value with external UI (for example, slash commands)

Start with `default*` props for prototyping and switch to controlled when the need arises — no other changes are required.

{{"demo": "ControlledStateHeadlessChat.js"}}

## Key takeaways

- Controlled state lets you own the source of truth while the runtime still handles streaming and normalization
- You can switch from uncontrolled to controlled at any time without changing the runtime model
- The `onMessagesChange` callback fires with the full array after every update, including streaming deltas

## See also

- [State and store](/x/react-chat/core/state/) for the full `ChatProvider` props reference
- [Selector-driven thread](/x/react-chat/core/examples/selector-driven-thread/) for efficient rendering with controlled state
- [Conversation history](/x/react-chat/core/examples/conversation-history/) for adapter-driven conversation loading

## API

- [ChatRoot](/x/api/chat/chat-root/)
