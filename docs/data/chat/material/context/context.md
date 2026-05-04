---
productId: x-chat
title: Chat - Context
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Context

<p class="description">Understand how ChatProvider manages state, controlled vs. uncontrolled patterns, and how to share chat context across your application.</p>

Every chat component reads its data — messages, conversations, composer state, streaming status — from a shared store provided by `ChatProvider`.
`ChatBox` renders a `ChatProvider` internally, so in the simplest case you never interact with the provider directly.

When you need more control — sharing state with components outside `ChatBox`, controlling the message list externally, or mounting multiple independent chat instances — you work with `ChatProvider` explicitly.

## ChatBox vs. ChatProvider

### ChatBox (all-in-one)

`ChatBox` is the fastest way to render a complete chat surface.
It creates a `ChatProvider` internally and composes all the themed subcomponents:

```tsx
import { ChatBox } from '@mui/x-chat';

<ChatBox adapter={adapter} sx={{ height: 500 }} />;
```

All hooks work inside any component rendered as a child or descendant of `ChatBox`. Here a `StreamingBadge` component reads the streaming status via `useChatStatus()` and displays a chip while the assistant is responding:

{{"demo": "ChatBoxWithHooks.js", "defaultCodeOpen": false, "bg": "inline"}}

### ChatProvider (custom layout)

When you need full control over the layout, use `ChatProvider` directly and compose the pieces yourself:

{{"demo": "ChatProviderCustomLayout.js", "defaultCodeOpen": false, "bg": "inline"}}

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

## Multiple independent instances

Each `ChatProvider` creates an isolated store.
To render multiple independent chat surfaces, use separate `ChatBox` instances — each one creates its own provider internally:

{{"demo": "MultipleInstances.js", "defaultCodeOpen": false, "bg": "inline"}}

## Provider props reference

| Prop                          | Type                               | Description                                                |
| :---------------------------- | :--------------------------------- | :--------------------------------------------------------- |
| `adapter`                     | `ChatAdapter`                      | **Required.** The backend adapter                          |
| `messages`                    | `ChatMessage[]`                    | Controlled messages                                        |
| `initialMessages`             | `ChatMessage[]`                    | Initial messages (uncontrolled)                            |
| `onMessagesChange`            | `(messages) => void`               | Called when messages change                                |
| `conversations`               | `ChatConversation[]`               | Controlled conversations                                   |
| `initialConversations`        | `ChatConversation[]`               | Initial conversations (uncontrolled)                       |
| `onConversationsChange`       | `(conversations) => void`          | Called when conversations change                           |
| `activeConversationId`        | `string`                           | Controlled active conversation                             |
| `initialActiveConversationId` | `string`                           | Initial active conversation (uncontrolled)                 |
| `onActiveConversationChange`  | `(id) => void`                     | Called when active conversation changes                    |
| `composerValue`               | `string`                           | Controlled composer text                                   |
| `initialComposerValue`        | `string`                           | Initial composer text (uncontrolled)                       |
| `onComposerValueChange`       | `(value) => void`                  | Called when composer value changes                         |
| `members`                     | `ChatUser[]`                       | Known participants for sender fallback and author lookup   |
| `currentUser`                 | `ChatUser`                         | Explicit local sender and author match                     |
| `getMessageAuthorId`          | `(message) => string \| undefined` | Maps a message to the author id used for member lookup     |
| `getMessageAuthorDisplayName` | `(message) => string \| undefined` | Maps a message to a display name override                  |
| `getMessageAuthorAvatarUrl`   | `(message) => string \| undefined` | Maps a message to an avatar URL override                   |
| `onToolCall`                  | `ChatOnToolCall`                   | Handler for tool call messages                             |
| `onFinish`                    | `ChatOnFinish`                     | Called when a response finishes streaming                  |
| `onData`                      | `ChatOnData`                       | Called for each streaming chunk                            |
| `onError`                     | `(error) => void`                  | Called on adapter errors                                   |
| `streamFlushInterval`         | `number`                           | Batching interval for streaming deltas (default: 16 ms)    |
| `storeClass`                  | `ChatStoreConstructor`             | Custom store class (default: ChatStore)                    |
| `partRenderers`               | `ChatPartRendererMap`              | Custom message part renderers                              |

## API

- [ChatRoot](/x/api/chat/chat-root/)
