---
productId: x-chat
title: Controlled state
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Controlled state

<p class="description">Manage messages, conversations, and composer state externally using the controlled and uncontrolled patterns.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

Every chat component reads its data from a shared store provided by `ChatProvider`: messages, conversations, composer state, and streaming status.
`ChatBox` renders a `ChatProvider` internally, so in the simplest case you never interact with the provider directly.
`ChatBox` forwards all of the provider props described on this page, so you can pass controlled props like `composerValue` or `activeConversationId` to `ChatBox` directly — an explicit `ChatProvider` is only needed when components outside the chat surface must read the same store.

When you need more control, you work with `ChatProvider` explicitly. Typical cases: sharing state with components outside `ChatBox`, controlling the message list externally, or mounting multiple independent chat instances.

`ChatProvider` is exported from the headless entry point:

```tsx
import { ChatProvider } from '@mui/x-chat/headless';
```

## Controlled and uncontrolled state

`ChatProvider` supports both controlled and uncontrolled patterns for every piece of state.
In uncontrolled mode, state lives entirely inside the store.
In controlled mode, you own the state and the provider synchronizes it.

### Messages

```tsx
// Uncontrolled — internal store owns the messages
<ChatProvider adapter={adapter} initialMessages={initialMessages}>
  {children}
</ChatProvider>

// Controlled — you own the messages array
<ChatProvider adapter={adapter} messages={messages} onMessagesChange={setMessages}>
  {children}
</ChatProvider>
```

### Conversations

```tsx
// Uncontrolled
<ChatProvider
  adapter={adapter}
  initialConversations={conversations}
  initialActiveConversationId="conv-1"
>
  {children}
</ChatProvider>

// Controlled
<ChatProvider
  adapter={adapter}
  conversations={conversations}
  onConversationsChange={setConversations}
  activeConversationId={activeId}
  onActiveConversationChange={setActiveId}
>
  {children}
</ChatProvider>
```

### Composer value

```tsx
// Uncontrolled
<ChatProvider adapter={adapter} initialComposerValue="Hello">
  {children}
</ChatProvider>

// Controlled
<ChatProvider
  adapter={adapter}
  composerValue={composerValue}
  onComposerValueChange={setComposerValue}
>
  {children}
</ChatProvider>
```

### Mixed mode

You can mix controlled and uncontrolled state freely.
For example, control the active conversation while letting messages be managed internally:

```tsx
<ChatProvider
  adapter={adapter}
  activeConversationId={activeId}
  onActiveConversationChange={setActiveId}
  initialMessages={[]}
>
  {children}
</ChatProvider>
```

:::info
Start with `initial*` (uncontrolled) props during prototyping, then switch to controlled props when you need to sync with external state.
Switching modes means changing which props your code passes — like other MUI controlled components, a given prop must stay controlled or uncontrolled for the lifetime of the provider; don't toggle it between defined and `undefined` at runtime.
:::

The demo below controls `activeConversationId` from outside the chat surface — select a conversation with the external buttons, or in the conversation list, and watch the single source of truth stay in sync:

{{"demo": "ControlledActiveConversation.js", "bg": "inline", "defaultCodeOpen": false}}

## State model reference

| Model               | Controlled prop        | Initial prop                  | Change callback              |
| :------------------ | :--------------------- | :---------------------------- | :--------------------------- |
| Messages            | `messages`             | `initialMessages`             | `onMessagesChange`           |
| Conversations       | `conversations`        | `initialConversations`        | `onConversationsChange`      |
| Active conversation | `activeConversationId` | `initialActiveConversationId` | `onActiveConversationChange` |
| Composer value      | `composerValue`        | `initialComposerValue`        | `onComposerValueChange`      |

## Sharing state across the app

Place `ChatProvider` higher in the tree to share chat state with components that live outside the chat surface:

```tsx
import { ChatProvider } from '@mui/x-chat/headless';

function App() {
  return (
    <ChatProvider adapter={adapter}>
      <Header /> {/* can use hooks like useChatStatus */}
      <Sidebar /> {/* can use useConversations */}
      <MainContent /> {/* renders ChatBox or custom layout */}
    </ChatProvider>
  );
}
```

:::warning
`ChatBox` always creates its own internal `ChatProvider`.
If you need to share state with external components, wrap them in a single `ChatProvider` and use the individual themed components (`ChatMessageList`, `ChatComposer`, and so on) instead of `ChatBox`.
Note that `ChatRoot` from `@mui/x-chat/headless` — the primitive `ChatBox` renders internally — also creates its own provider. It gives you a `ChatBox`-like root element that accepts the full set of provider props (controlled state included), but to share one store with components outside the chat surface you still need a single explicit `ChatProvider` wrapping themed components.
:::

## Syncing with a global state manager

Use the controlled props with change callbacks to keep the chat store synchronized with your global state manager:

```tsx
function App() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectChatMessages);
  const activeId = useAppSelector(selectActiveConversationId);

  return (
    <ChatProvider
      adapter={adapter}
      messages={messages}
      onMessagesChange={(msgs) => dispatch(setChatMessages(msgs))}
      activeConversationId={activeId}
      onActiveConversationChange={(id) => dispatch(setActiveConversation(id))}
    >
      <MyChat />
    </ChatProvider>
  );
}
```

The runtime still handles streaming, normalization, and derived state — you just own the source of truth.

## Multiple independent instances

Each `ChatProvider` creates an isolated store.
To render multiple independent chat surfaces, use separate `ChatBox` instances—each one creates its own provider internally.

{{"demo": "../../material/context/MultipleInstances.js", "defaultCodeOpen": false, "bg": "inline"}}

## Provider props reference

| Prop                          | Type                                            | Description                                                                      |
| :---------------------------- | :---------------------------------------------- | :------------------------------------------------------------------------------- |
| `adapter`                     | `ChatAdapter`                                   | **Required.** The backend adapter                                                |
| `messages`                    | `ChatMessage[]`                                 | Controlled messages                                                              |
| `initialMessages`             | `ChatMessage[]`                                 | Initial messages (uncontrolled)                                                  |
| `onMessagesChange`            | `(messages) => void`                            | Called when messages change                                                      |
| `conversations`               | `ChatConversation[]`                            | Controlled conversations                                                         |
| `initialConversations`        | `ChatConversation[]`                            | Initial conversations (uncontrolled)                                             |
| `onConversationsChange`       | `(conversations) => void`                       | Called when conversations change                                                 |
| `activeConversationId`        | `string \| undefined`                           | Controlled active conversation (`undefined` = no selection)                      |
| `initialActiveConversationId` | `string`                                        | Initial active conversation (uncontrolled)                                       |
| `onActiveConversationChange`  | `(conversationId: string \| undefined) => void` | Called when active conversation changes                                          |
| `composerValue`               | `string`                                        | Controlled composer text                                                         |
| `initialComposerValue`        | `string`                                        | Initial composer text (uncontrolled)                                             |
| `onComposerValueChange`       | `(value) => void`                               | Called when composer value changes                                               |
| `members`                     | `ChatUser[]`                                    | Known participants for sender fallback and author lookup                         |
| `currentUser`                 | `ChatUser`                                      | Explicit local sender and author match                                           |
| `roleDisplayNames`            | `Partial<Record<ChatRole, string>>`             | Fallback display names per role for messages without explicit author information |
| `getMessageAuthorId`          | `(message) => string \| undefined`              | Maps a message to the author id used for member lookup                           |
| `getMessageAuthorDisplayName` | `(message) => string \| undefined`              | Maps a message to a display name override                                        |
| `getMessageAuthorAvatarUrl`   | `(message) => string \| undefined`              | Maps a message to an avatar URL override                                         |
| `onToolCall`                  | `ChatOnToolCall`                                | Handler for tool call messages                                                   |
| `onFinish`                    | `ChatOnFinish`                                  | Called when a response finishes streaming                                        |
| `onData`                      | `ChatOnData`                                    | Called for each streaming chunk                                                  |
| `onError`                     | `(error) => void`                               | Called on adapter errors                                                         |
| `streamFlushInterval`         | `number`                                        | Batching interval for streaming deltas (default: 16 ms)                          |
| `storeClass`                  | `ChatStoreConstructor`                          | Custom store class (default: ChatStore)                                          |
| `partRenderers`               | `ChatPartRendererMap`                           | Custom message part renderers                                                    |

## See also

- [Adapters](/x/react-chat/backend/adapters/) for details on the backend adapter interface.
- [Hooks reference](/x/react-chat/resources/hooks/) for reading state from the store.
- [Events and callbacks](/x/react-chat/resources/events-and-callbacks/) for `onFinish`, `onToolCall`, `onData`, and `onError`.
