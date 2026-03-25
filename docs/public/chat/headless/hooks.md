---
productId: x-chat
title: Chat - Headless hooks
packageName: '@mui/x-chat/headless'
---

# Headless hooks

Read chat state and trigger runtime actions through hooks scoped to exactly the data your component needs.

The headless package exposes nine public hooks.
Each one subscribes to a specific slice of the normalized chat store, so your components only re-render when their own data changes.

```tsx
import {
  useChat,
  useChatComposer,
  useChatStatus,
  useMessageIds,
  useMessage,
  useConversations,
  useConversation,
  useChatStore,
  useChatPartRenderer,
} from '@mui/x-chat/headless';
```

All hooks must be called inside a `<ChatProvider>`.

## `useChat()`

The all-in-one orchestration hook.
It returns both the public state fields and every runtime action in a single object.

### State

| Field                  | Type                  | Description                             |
| :--------------------- | :-------------------- | :-------------------------------------- |
| `messages`             | `ChatMessage[]`       | All messages in the active conversation |
| `conversations`        | `ChatConversation[]`  | All conversations                       |
| `activeConversationId` | `string \| undefined` | Currently active conversation           |
| `isStreaming`          | `boolean`             | Whether a response is being streamed    |
| `hasMoreHistory`       | `boolean`             | Whether older messages can be loaded    |
| `error`                | `ChatError \| null`   | Current error state                     |

### Actions

| Method                    | Signature                                                   | Description                 |
| :------------------------ | :---------------------------------------------------------- | :-------------------------- |
| `sendMessage`             | `(input: UseChatSendMessageInput) => Promise<void>`         | Send a user message         |
| `stopStreaming`           | `() => void`                                                | Abort the active stream     |
| `loadMoreHistory`         | `() => Promise<void>`                                       | Load older messages         |
| `setActiveConversation`   | `(id: string \| undefined) => Promise<void>`                | Switch conversations        |
| `retry`                   | `(messageId: string) => Promise<void>`                      | Retry a failed message      |
| `setError`                | `(error: ChatError \| null) => void`                        | Update the error state      |
| `addToolApprovalResponse` | `(input: ChatAddToolApproveResponseInput) => Promise<void>` | Approve or deny a tool call |

### `UseChatSendMessageInput`

When calling `sendMessage`, the input object has the following shape:

```ts
interface UseChatSendMessageInput {
  id?: string; // optional custom message ID
  conversationId?: string; // target conversation
  parts: ChatMessagePart[]; // message content
  metadata?: ChatMessageMetadata; // app-specific metadata
  author?: ChatUser; // user identity
  createdAt?: ChatDateTimeString; // optional timestamp
  attachments?: ChatDraftAttachment[]; // file attachments
}
```

### Usage

```tsx
function Thread() {
  const { messages, sendMessage, isStreaming } = useChat();

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.parts[0]?.type === 'text' ? msg.parts[0].text : null}
        </div>
      ))}
      <button
        disabled={isStreaming}
        onClick={() =>
          sendMessage({
            parts: [{ type: 'text', text: 'Hello!' }],
          })
        }
      >
        Send
      </button>
    </div>
  );
}
```

`useChat()` is the fastest way to get started, but it subscribes to multiple store slices at once.
For large threads or performance-sensitive trees, prefer the narrower hooks below.

## `useChatComposer()`

Manages draft text, file attachments, and submission behavior.

| Field              | Type                        | Description                                         |
| :----------------- | :-------------------------- | :-------------------------------------------------- |
| `value`            | `string`                    | Current draft text                                  |
| `setValue`         | `(value: string) => void`   | Update draft text                                   |
| `attachments`      | `ChatDraftAttachment[]`     | Draft file attachments                              |
| `addAttachment`    | `(file: File) => void`      | Add a file attachment                               |
| `removeAttachment` | `(localId: string) => void` | Remove an attachment by local ID                    |
| `clear`            | `() => void`                | Clear draft text and all attachments                |
| `submit`           | `() => Promise<void>`       | Send the composed message                           |
| `isSubmitting`     | `boolean`                   | Whether a stream is active (blocks new submissions) |

### Preview URLs

When you add an image attachment, `useChatComposer` automatically creates an object URL for previewing the image.
The hook revokes these URLs when the attachment is removed, the composer is cleared, or the component unmounts.
You do not need to manage URL lifecycle manually.

### IME-safe submission

The `submit` method blocks when the user is in an active IME composition session (common for East Asian input methods).
It also blocks when a stream is already active, preventing accidental double sends.

### Usage

```tsx
function DraftArea() {
  const composer = useChatComposer();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        composer.submit();
      }}
    >
      <input
        value={composer.value}
        onChange={(e) => composer.setValue(e.target.value)}
      />
      <button type="submit" disabled={composer.isSubmitting}>
        Send
      </button>
    </form>
  );
}
```

## `useChatStatus()`

A lightweight hook for status indicators, loading spinners, and error banners.

| Field            | Type                | Description                                              |
| :--------------- | :------------------ | :------------------------------------------------------- |
| `isStreaming`    | `boolean`           | Whether a response is being streamed                     |
| `hasMoreHistory` | `boolean`           | Whether older messages can be loaded                     |
| `error`          | `ChatError \| null` | Current error state                                      |
| `typingUserIds`  | `string[]`          | IDs of users currently typing in the active conversation |

Use this hook when you need to show a status chip, typing indicator, or error banner without subscribing to the full message list.

```tsx
function StatusBar() {
  const { isStreaming, typingUserIds, error } = useChatStatus();

  return (
    <div>
      {isStreaming && <span>Assistant is responding...</span>}
      {typingUserIds.length > 0 && <span>{typingUserIds.length} typing...</span>}
      {error && <span>{error.message}</span>}
    </div>
  );
}
```

## `useMessageIds()` and `useMessage(id)`

Row-level subscriptions for efficient thread rendering.

- `useMessageIds()` returns `string[]` — the ordered list of message IDs.
- `useMessage(id)` returns `ChatMessage | null` — a single message by ID.

The pattern works like this: the parent component calls `useMessageIds()` and renders a list of row components.
Each row calls `useMessage(id)` to subscribe to its own message.
When a single message updates during streaming, only that row re-renders — the parent and sibling rows stay untouched.

```tsx
function Thread() {
  const messageIds = useMessageIds();

  return (
    <div>
      {messageIds.map((id) => (
        <MessageRow key={id} id={id} />
      ))}
    </div>
  );
}

function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  if (!message) return null;

  return (
    <div>{message.parts[0]?.type === 'text' ? message.parts[0].text : null}</div>
  );
}
```

This is the recommended pattern for threads with more than a handful of messages.

## `useConversations()` and `useConversation(id)`

Conversation-level subscriptions following the same pattern as messages.

- `useConversations()` returns `ChatConversation[]` — all conversations.
- `useConversation(id)` returns `ChatConversation | null` — a single conversation by ID.

```tsx
function Sidebar() {
  const conversations = useConversations();

  return (
    <ul>
      {conversations.map((c) => (
        <li key={c.id}>{c.title}</li>
      ))}
    </ul>
  );
}
```

## `useChatStore()`

Returns the underlying `ChatStore<Cursor>` instance.

This is the escape hatch for advanced use cases that need direct store access — custom selectors, store subscriptions outside React render, or integration with external state management.

```tsx
import { useChatStore, chatSelectors } from '@mui/x-chat/headless';
import { useStore } from '@mui/x-internals/store';

function MessageCounter() {
  const store = useChatStore();
  const count = useStore(store, chatSelectors.messageCount);

  return <span>{count} messages</span>;
}
```

Use this hook sparingly.
For most use cases, the dedicated hooks above provide a better developer experience.

## `useChatPartRenderer(partType)`

Looks up a registered renderer for a specific message part type.

```ts
function useChatPartRenderer<TPartType extends ChatMessagePart['type']>(
  partType: TPartType,
): ChatPartRenderer<Extract<ChatMessagePart, { type: TPartType }>> | null;
```

Returns `null` if no renderer is registered for the given part type.
Renderers are registered through the `partRenderers` prop on `ChatProvider`.

```tsx
function CustomPart({ part, message, index }) {
  const renderer = useChatPartRenderer(part.type);

  if (renderer) {
    return renderer({ part, message, index });
  }

  return <span>Unknown part type: {part.type}</span>;
}
```

## Choosing the right hook

| Goal                                      | Hook                                          |
| :---------------------------------------- | :-------------------------------------------- |
| Prototype or small surface                | `useChat()`                                   |
| Efficient thread with many messages       | `useMessageIds()` + `useMessage(id)`          |
| Conversation sidebar                      | `useConversations()` or `useConversation(id)` |
| Custom draft area with attachments        | `useChatComposer()`                           |
| Status indicator, typing, or error banner | `useChatStatus()`                             |
| Custom selector or store subscription     | `useChatStore()` + `chatSelectors`            |
| Registered part renderer lookup           | `useChatPartRenderer(partType)`               |

## Adjacent pages

- [Selectors](/x/react-chat/headless/selectors/) for the full selector API and advanced store subscriptions.
- [State and store](/x/react-chat/headless/state/) for `ChatProvider` props and the controlled/uncontrolled model.
- [Minimal headless chat](/x/react-chat/headless/examples/minimal-chat/) for the smallest working example.
- [Selector-driven thread](/x/react-chat/headless/examples/selector-driven-thread/) for the `useMessageIds()` + `useMessage(id)` pattern in action.
- [Composer](/x/react-chat/headless/examples/composer/) for `useChatComposer()` with attachments.
