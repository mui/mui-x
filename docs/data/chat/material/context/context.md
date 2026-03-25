---
productId: x-chat
title: Chat - Context
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Context

<p class="description">Understand how ChatProvider manages state, controlled vs. uncontrolled patterns, and how to share chat context across your application.</p>

Every chat component reads its data — messages, conversations, composer state, streaming status — from a shared store provided by `ChatProvider`.
`ChatBox` renders a `ChatProvider` internally, so in the simplest case you never interact with the provider directly.

When you need more control — sharing state with components outside `ChatBox`, controlling the message list externally, or mounting multiple independent chat instances — you work with `ChatProvider` explicitly.

## ChatBox vs. ChatProvider

### ChatBox (all-in-one)

`ChatBox` is the fastest way to render a complete chat surface.
It creates a `ChatProvider` internally and composes all the themed sub-components:

```tsx
import { ChatBox } from '@mui/x-chat';

<ChatBox adapter={adapter} sx={{ height: 500 }} />;
```

All hooks work inside any component rendered as a child or descendant of `ChatBox`:

```tsx
function StreamingBadge() {
  const { isStreaming } = useChatStatus();
  return isStreaming ? <Chip label="Responding..." /> : null;
}

<ChatBox adapter={adapter}>
  <StreamingBadge />
</ChatBox>;
```

### ChatProvider (custom layout)

When you need full control over the layout, use `ChatProvider` directly and compose the pieces yourself:

```tsx
import { ChatProvider } from '@mui/x-chat/headless';
import { ChatMessageList, ChatComposer } from '@mui/x-chat';

function CustomChat({ adapter }) {
  return (
    <ChatProvider adapter={adapter}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <ChatMessageList />
        <ChatComposer />
      </div>
    </ChatProvider>
  );
}
```

## Controlled and uncontrolled state

`ChatProvider` supports both controlled and uncontrolled patterns for every piece of state.
In uncontrolled mode, state lives entirely inside the store.
In controlled mode, you own the state and the provider synchronizes it.

### Messages

```tsx
{/* Uncontrolled — internal store owns the messages */}
<ChatProvider adapter={adapter} defaultMessages={initialMessages}>

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
  defaultConversations={conversations}
  defaultActiveConversationId="conv-1"
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
<ChatProvider adapter={adapter} defaultComposerValue="Hello">

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
  defaultMessages={[]}
>
```

## Sharing context across the app

Place `ChatProvider` higher in the tree to share chat state with components that live outside the chat surface:

```tsx
function App() {
  return (
    <ChatProvider adapter={adapter}>
      <Header />       {/* can use hooks like useChatStatus */}
      <Sidebar />      {/* can use useConversations */}
      <MainContent />  {/* renders ChatBox or custom layout */}
    </ChatProvider>
  );
}
```

When `ChatBox` detects an existing `ChatProvider` ancestor, it reuses the existing store instead of creating a new one.

## Multiple independent instances

Each `ChatProvider` creates an isolated store.
To render multiple independent chat surfaces, wrap each in its own provider:

```tsx
function DualChat() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <ChatProvider adapter={supportAdapter}>
        <ChatBox sx={{ flex: 1, height: 500 }} />
      </ChatProvider>
      <ChatProvider adapter={salesAdapter}>
        <ChatBox sx={{ flex: 1, height: 500 }} />
      </ChatProvider>
    </div>
  );
}
```

## Provider props reference

| Prop | Type | Description |
| :--- | :--- | :--- |
| `adapter` | `ChatAdapter` | **Required.** The backend adapter |
| `messages` | `ChatMessage[]` | Controlled messages |
| `defaultMessages` | `ChatMessage[]` | Initial messages (uncontrolled) |
| `onMessagesChange` | `(messages) => void` | Called when messages change |
| `conversations` | `ChatConversation[]` | Controlled conversations |
| `defaultConversations` | `ChatConversation[]` | Initial conversations (uncontrolled) |
| `onConversationsChange` | `(conversations) => void` | Called when conversations change |
| `activeConversationId` | `string` | Controlled active conversation |
| `defaultActiveConversationId` | `string` | Initial active conversation (uncontrolled) |
| `onActiveConversationChange` | `(id) => void` | Called when active conversation changes |
| `composerValue` | `string` | Controlled composer text |
| `defaultComposerValue` | `string` | Initial composer text (uncontrolled) |
| `onComposerValueChange` | `(value) => void` | Called when composer value changes |
| `members` | `ChatMember[]` | Participant metadata for avatars and names |
| `currentUser` | `string` | The current user's member ID |
| `onToolCall` | `ChatOnToolCall` | Handler for tool call messages |
| `onFinish` | `ChatOnFinish` | Called when a response finishes streaming |
| `onData` | `ChatOnData` | Called for each streaming chunk |
| `onError` | `(error) => void` | Called on adapter errors |
| `streamFlushInterval` | `number` | Batching interval for streaming deltas (default: 16 ms) |
| `partRenderers` | `ChatPartRendererMap` | Custom message part renderers |
