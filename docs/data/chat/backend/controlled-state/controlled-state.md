---
productId: x-chat
title: Controlled State
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Controlled State

<p class="description">Own messages, conversations, active conversation, and composer value externally using the controlled/uncontrolled pattern on <code>ChatProvider</code>.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

Every chat component reads its data — messages, conversations, composer state, streaming status — from a shared store provided by `ChatProvider`.
`ChatBox` renders a `ChatProvider` internally, so in the simplest case you never interact with the provider directly.

When you need more control — sharing state with components outside `ChatBox`, controlling the message list externally, or mounting multiple independent chat instances — you work with `ChatProvider` explicitly.

## Controlled and uncontrolled state

`ChatProvider` supports both controlled and uncontrolled patterns for every piece of state.
In uncontrolled mode, state lives entirely inside the store.
In controlled mode, you own the state and the provider synchronizes it.

### Messages

```tsx
{/* Uncontrolled — internal store owns the messages */}
<ChatProvider adapter={adapter} initialMessages={initialMessages}>

{/* Controlled — you own the messages array */}
<ChatProvider
  adapter={adapter}
  messages={messages}
  onMessagesChange={setMessages}
>
```

### Conversations

```tsx
{/* Uncontrolled */}
<ChatProvider
  adapter={adapter}
  initialConversations={conversations}
  initialActiveConversationId="conv-1"
>

{/* Controlled */}
<ChatProvider
  adapter={adapter}
  conversations={conversations}
  onConversationsChange={setConversations}
  activeConversationId={activeId}
  onActiveConversationChange={setActiveId}
>
```

### Composer value

```tsx
{/* Uncontrolled */}
<ChatProvider adapter={adapter} initialComposerValue="Hello">

{/* Controlled */}
<ChatProvider
  adapter={adapter}
  composerValue={composerValue}
  onComposerValueChange={setComposerValue}
>
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
```

:::info
Start with `initial*` (uncontrolled) props during prototyping, then switch to controlled props when you need to sync with external state. You can switch modes at any time without changing the runtime model.
:::

## State model reference

| Model               | Controlled prop        | Initial prop                  | Change callback              |
| :------------------ | :--------------------- | :---------------------------- | :--------------------------- |
| Messages            | `messages`             | `initialMessages`             | `onMessagesChange`           |
| Conversations       | `conversations`        | `initialConversations`        | `onConversationsChange`      |
| Active conversation | `activeConversationId` | `initialActiveConversationId` | `onActiveConversationChange` |
| Composer value      | `composerValue`        | `initialComposerValue`        | `onComposerValueChange`      |

## Sharing context across the app

Place `ChatProvider` higher in the tree to share chat state with components that live outside the chat surface:

```tsx
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
`ChatBox` always creates its own internal `ChatProvider`. If you need to share state with external components, wrap them in a single `ChatProvider` and use the individual themed components (`ChatMessageList`, `ChatComposer`, etc.) instead of `ChatBox`.
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

The runtime still streams, normalizes, and derives selectors — you just own the source of truth.

## Multiple independent instances

Each `ChatProvider` creates an isolated store.
To render multiple independent chat surfaces, use separate `ChatBox` instances — each one creates its own provider internally.

## Provider props reference

| Prop                          | Type                      | Description                                             |
| :---------------------------- | :------------------------ | :------------------------------------------------------ |
| `adapter`                     | `ChatAdapter`             | **Required.** The backend adapter                       |
| `messages`                    | `ChatMessage[]`           | Controlled messages                                     |
| `initialMessages`             | `ChatMessage[]`           | Initial messages (uncontrolled)                         |
| `onMessagesChange`            | `(messages) => void`      | Called when messages change                             |
| `conversations`               | `ChatConversation[]`      | Controlled conversations                                |
| `initialConversations`        | `ChatConversation[]`      | Initial conversations (uncontrolled)                    |
| `onConversationsChange`       | `(conversations) => void` | Called when conversations change                        |
| `activeConversationId`        | `string`                  | Controlled active conversation                          |
| `initialActiveConversationId` | `string`                  | Initial active conversation (uncontrolled)              |
| `onActiveConversationChange`  | `(conversationId: string \| undefined) => void` | Called when active conversation changes    |
| `composerValue`               | `string`                  | Controlled composer text                                |
| `initialComposerValue`        | `string`                  | Initial composer text (uncontrolled)                    |
| `onComposerValueChange`       | `(value) => void`         | Called when composer value changes                      |
| `members`                     | `ChatUser[]`              | Participant metadata (avatars, names, roles)            |
| `currentUser`                 | `ChatUser`                | The current user object                                 |
| `onToolCall`                  | `ChatOnToolCall`          | Handler for tool call messages                          |
| `onFinish`                    | `ChatOnFinish`            | Called when a response finishes streaming               |
| `onData`                      | `ChatOnData`              | Called for each streaming chunk                         |
| `onError`                     | `(error) => void`         | Called on adapter errors                                |
| `streamFlushInterval`         | `number`                  | Batching interval for streaming deltas (default: 16 ms) |
| `storeClass`                  | `ChatStoreConstructor`    | Custom store class (default: ChatStore)                 |
| `partRenderers`               | `ChatPartRendererMap`     | Custom message part renderers                           |

## See also

- [Adapters](/x/react-chat/backend/adapters/) for the backend adapter interface.
- [Hooks Reference](/x/react-chat/resources/hooks/) for reading state from the store.
- [Events & Callbacks](/x/react-chat/resources/events-and-callbacks/) for `onFinish`, `onToolCall`, `onData`, and `onError`.
