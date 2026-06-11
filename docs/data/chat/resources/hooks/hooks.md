---
productId: x-chat
title: Hooks Reference
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Hooks Reference

<p class="description">Read chat state and trigger runtime actions from your own components using hooks exported from <code>@mui/x-chat/headless</code>.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatBox` covers most use cases out of the box, but sometimes you need to reach into chat state from components that live outside `ChatBox` — a page header that shows streaming status, a sidebar that renders conversation metadata, or a custom toolbar that controls the composer.

The hook layer makes this possible.
Each hook subscribes only to the state it returns, so components re-render only when that data changes.

## Import

All hooks are exported from the `@mui/x-chat/headless` entry point (re-exported from `@mui/x-chat-headless`):

```tsx
import {
  useChat,
  useChatActions,
  useChatComposer,
  useChatStatus,
  useConversations,
  useConversation,
  useMessageIds,
  useMessage,
  useMessageError,
  useChatOnToolCall,
  useChatPartRenderer,
  useChatVariant,
  useChatDensity,
  useChatLocaleText,
  useChatStore,
} from '@mui/x-chat/headless';
```

## Provider requirement

Every hook listed on this page must be called inside a component that has a `<ChatProvider>` (or `<ChatBox>`) ancestor in the tree.
Calling a hook outside a provider throws an error in both development and production builds, so there is no silent fallback — always make sure a provider is present.

`ChatBox` renders a `ChatProvider` internally, so hooks work naturally inside any component rendered as a child or descendant of `ChatBox`:

```tsx
function MyStatusBadge() {
  const { isStreaming } = useChatStatus(); // works — inside ChatBox's provider
  return isStreaming ? <Chip label="Responding…" /> : null;
}

export default function App() {
  return (
    <ChatBox adapter={adapter}>
      <MyStatusBadge />
    </ChatBox>
  );
}
```

If you are building a custom layout without `ChatBox`, wrap your tree in `<ChatProvider>` and use hooks freely anywhere inside.

## Hooks in action

The following demo is built entirely from hooks — no `ChatBox` — composing `useMessageIds()` + `useMessage(id)` for the thread, `useChatStatus()` for the progress indicator, `useChatComposer()` for the input, and `useChatStore()` for the message counter.
Send a message to watch the echo adapter stream a reply.

{{"demo": "HooksHeadlessChat.js"}}

## Choosing the right hook

| Goal                                                     | Hook                                         |
| :------------------------------------------------------- | :------------------------------------------- |
| Prototype or component that needs both state and actions | `useChat()`                                  |
| Action buttons that must not re-render on streaming      | `useChatActions()`                           |
| Status chip, typing indicator, or error banner           | `useChatStatus()`                            |
| Conversation list or sidebar                             | `useConversations()` / `useConversation(id)` |
| Thread with many messages (efficient rendering)          | `useMessageIds()` + `useMessage(id)`         |
| Per-message error state and retry affordances            | `useMessageError(messageId)`                 |
| Custom composer with text and attachments                | `useChatComposer()`                          |
| Custom tool part that respects provider callbacks        | `useChatOnToolCall()`                        |
| Custom part renderer lookup                              | `useChatPartRenderer(partType)`              |
| Custom selector or store subscription                    | `useChatStore()` + `chatSelectors`           |

## State hooks

State hooks give you read access to the normalized chat store.
Use them to display data without triggering adapter calls.

### `useChat()`

The all-in-one hook.
It returns both the complete current state and every runtime action in a single object.
Use it when you want the fastest path to something working, or when a small component needs a mix of state and actions.

```ts
const {
  // State
  messages, // ChatMessage[] — all messages in the active conversation
  conversations, // ChatConversation[]
  activeConversationId, // string | undefined
  isStreaming, // boolean
  hasMoreHistory, // boolean
  isLoadingHistory, // boolean — true while a history fetch is in flight
  error, // ChatError | null

  // Actions
  sendMessage, // (input: UseChatSendMessageInput) => Promise<void>
  stopStreaming, // () => void
  loadMoreHistory, // () => Promise<void>
  setActiveConversation, // (id: string | undefined) => Promise<void>
  retry, // (messageId: string) => Promise<void>
  regenerate, // (messageId: string) => Promise<void> — re-run an assistant response in place
  setError, // (error: ChatError | null) => void
  addToolApprovalResponse, // (input: ChatAddToolApproveResponseInput) => Promise<void>
  reloadConversations, // () => Promise<void> — planned API stub, not yet implemented
  reloadMessages, // (conversationId?: string) => Promise<void> — planned API stub, not yet implemented
  reconnectRealtime, // () => Promise<void> — planned API stub, not yet implemented
} = useChat();
```

The three planned-API stubs (`reloadConversations`, `reloadMessages`, `reconnectRealtime`) reject with an explanatory error in development builds and resolve as silent no-ops in production — do not rely on them until they are implemented.

Because `useChat()` subscribes to several store slices at once — messages, conversations, the active conversation ID, streaming, history, and error state — it re-renders whenever any of them change.
For components that render long message lists or need fine-grained control over re-renders, prefer the narrower hooks below.

```tsx
function QuickChat() {
  const { messages, sendMessage, isStreaming } = useChat();

  return (
    <>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.parts.find((p) => p.type === 'text')?.text}</div>
      ))}
      <button
        disabled={isStreaming}
        onClick={() => sendMessage({ parts: [{ type: 'text', text: 'Hi' }] })}
      >
        Send
      </button>
    </>
  );
}
```

### `useChatStatus()`

A lightweight hook for status indicators.
It subscribes only to `isStreaming`, `hasMoreHistory`, `isLoadingHistory`, `error`, and `typingUserIds` — making it ideal for status bars, loading spinners, and error banners that sit outside the message list.

```ts
const {
  isStreaming, // boolean
  hasMoreHistory, // boolean
  isLoadingHistory, // boolean — true while a history fetch is in flight
  error, // ChatError | null
  typingUserIds, // string[] — users currently typing in the active conversation
} = useChatStatus();
```

```tsx
function StatusFooter() {
  const { isStreaming, typingUserIds, error } = useChatStatus();

  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (isStreaming) return <LinearProgress />;
  if (typingUserIds.length > 0) {
    return <Typography variant="caption">Someone is typing…</Typography>;
  }
  return null;
}
```

Prefer `useChatStatus()` over `useChat()` whenever you only need streaming or error state.
The component does not re-render when a new message is sent — only when the status fields themselves change.

### `useConversations()`

Returns the full list of conversations.
Use it to render a sidebar or drawer that shows all threads.

```ts
const conversations: ChatConversation[] = useConversations();
```

```tsx
function ConversationSidebar() {
  const conversations = useConversations();
  const { setActiveConversation } = useChat();

  return (
    <List>
      {conversations.map((c) => (
        <ListItemButton key={c.id} onClick={() => setActiveConversation(c.id)}>
          {c.title}
        </ListItemButton>
      ))}
    </List>
  );
}
```

### `useConversation(id)`

Returns a single conversation by ID, or `null` if it is not in the store.
Use this inside a list item component so that each item only re-renders when its own conversation changes — not when an unrelated conversation is added or renamed.

```ts
const conversation: ChatConversation | null = useConversation(id);
```

```tsx
function ConversationItem({ id }: { id: string }) {
  const conversation = useConversation(id);
  if (!conversation) return null;

  return <ListItem>{conversation.title}</ListItem>;
}
```

### `useMessageIds()`

Returns the ordered array of message IDs for the active conversation.
Pair it with `useMessage(id)` to implement efficient thread rendering where each message row subscribes to its own slice of state.

```ts
const messageIds: string[] = useMessageIds();
```

When a message is being streamed, only the row for that message re-renders — the parent thread component and sibling rows stay untouched.

### `useMessage(id)`

Returns a single message by ID, or `null` if it does not exist.
This is the most granular subscription available: it re-renders only when the specific message changes.

```ts
const message: ChatMessage | null = useMessage(id);
```

The recommended pattern for efficient thread rendering:

```tsx
function Thread() {
  const messageIds = useMessageIds();

  return (
    <Stack spacing={1}>
      {messageIds.map((id) => (
        <MessageRow key={id} id={id} />
      ))}
    </Stack>
  );
}

function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  if (!message) return null;

  const textPart = message.parts.find((p) => p.type === 'text');
  return (
    <Paper sx={{ p: 1.5 }}>{textPart?.type === 'text' ? textPart.text : null}</Paper>
  );
}
```

This pattern scales to threads with hundreds of messages because no unnecessary re-renders propagate up the tree.

### `useMessageError(messageId)`

Returns the `ChatError` associated with the given message, or `null` when the message has no error.
Message-scoped errors are stored independently from the global runtime `error`, so multiple failed messages can each retain their own error state at the same time.
Use it inside a message row to render a per-message error indicator or retry affordance alongside `retry(messageId)` from `useChat()`.

```ts
const error: ChatError | null = useMessageError(messageId);
```

### `useChatActions()`

Returns the stable runtime-actions object (`sendMessage`, `retry`, `regenerate`, `stopStreaming`, …) without subscribing to any store state — the component never re-renders on chat updates.
Pass `optional: true` to get `null` instead of a throw outside a provider.
Prefer it over `useChat()` in action-only UI such as message action bars.

```ts
const actions: ChatRuntimeActions = useChatActions();
const maybeActions: ChatRuntimeActions | null = useChatActions(true);
```

## Input hook

### `useChatComposer()`

Manages draft text, file attachments, and submission in a single object.
Use it when you want to build a custom composer instead of using the one built into `ChatBox`.

```ts
const {
  value, // string — current draft text
  setValue, // (value: string) => void
  attachments, // ChatDraftAttachment[]
  addAttachment, // (file: File) => void
  removeAttachment, // (localId: string) => void
  clear, // () => void — clears text and attachments
  submit, // () => Promise<void> — sends the composed message
  isSubmitting, // boolean — true while a stream is active
} = useChatComposer();
```

The hook handles several details automatically:

- **Object URL lifecycle** — preview URLs for image attachments are created on add and revoked on remove or unmount.
- **IME safety** — `submit` is a no-op during an active IME composition session (relevant for East Asian input methods).
- **Double-send prevention** — `submit` is blocked when `isSubmitting` is `true`.
- **SSR safety** — object URL creation and revocation are skipped when the `URL` API is unavailable, so the hook is safe to render on the server.

```tsx
function CustomComposer() {
  const { value, setValue, submit, isSubmitting, addAttachment } = useChatComposer();

  return (
    <Stack direction="row" spacing={1}>
      <TextField
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Type a message…"
      />
      <IconButton component="label">
        <AttachFileIcon />
        <input
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) addAttachment(file);
          }}
        />
      </IconButton>
      <Button variant="contained" onClick={submit} disabled={isSubmitting}>
        Send
      </Button>
    </Stack>
  );
}
```

## Config hooks

Config hooks read configuration registered on the `ChatProvider` rather than runtime state.
They are most useful inside custom message part renderers and custom message components.

### `useChatOnToolCall()`

Returns the `onToolCall` callback registered on the provider, or `undefined` if none was registered.
Use it inside a custom tool message part to invoke the same callback that `ChatBox` uses internally — keeping behavior consistent even when you replace message rendering entirely.

```ts
const onToolCall: ChatOnToolCall | undefined = useChatOnToolCall();
```

```tsx
function ToolMessagePart({ invocation }: { invocation: ChatToolInvocation }) {
  const onToolCall = useChatOnToolCall();

  React.useEffect(() => {
    if (invocation.state === 'output-available') {
      onToolCall?.({ toolCall: invocation });
    }
  }, [invocation.id, invocation.state, onToolCall]);

  return <ToolCard invocation={invocation} />;
}
```

This example is illustrative — the effect re-runs if the component remounts, so a production implementation should track already-handled invocation IDs (for example in a ref or an external set) to avoid invoking the callback twice for the same tool call.

### `useChatPartRenderer(partType)`

Looks up a renderer registered in the `partRenderers` map on `ChatProvider`.
Returns the renderer function, or `null` if none is registered for the given part type.

```ts
function useChatPartRenderer<TPartType extends ChatMessagePart['type']>(
  partType: TPartType,
): ChatPartRenderer<Extract<ChatMessagePart, { type: TPartType }>> | null;
```

Renderers are registered through the `partRenderers` prop on `ChatBox`:

```tsx
<ChatBox
  adapter={adapter}
  partRenderers={{
    'ticket-summary': ({ part }) => <TicketCard ticketId={part.ticketId} />,
  }}
/>
```

Then any component in the tree can look up and invoke a renderer:

```tsx
function UnknownPart({ part, message, index }) {
  const renderer = useChatPartRenderer(part.type);

  if (renderer) {
    return renderer({ part, message, index });
  }

  return <Typography color="text.secondary">Unknown part: {part.type}</Typography>;
}
```

## Context hooks

Context hooks read presentation context provided by `ChatRoot` (which `ChatBox` renders internally) rather than store state.

### `useChatVariant()`

Returns the active chat variant (`'default' | 'compact'`). Use it in custom slots to match the styling the surrounding chat uses.

### `useChatDensity()`

Returns the active density (`'compact' | 'standard' | 'comfortable'`). See [Customization—Look and feel](/x/react-chat/customization/look-and-feel/) for how density is configured.

### `useChatLocaleText()`

Returns the resolved locale-text object so custom components can reuse the same translated strings as the built-in UI. See [Customization—Structure—Localization](/x/react-chat/customization/structure/#localization) for registering translations.

## Headless primitive hooks

These hooks support authors of custom headless primitives and slots. They read component-scoped context (not the chat store) and throw outside their owning primitive:

- `useComposerContext()` — the composer primitive's shared context (used inside `Composer.*` slot replacements).
- `useMessageListContext()` — the message-list primitive's shared context.
- `useMessageRovingItem(messageId)` — wires a custom message row into the list's roving-focus model (tabindex + focus handlers).
- `useMessageActionable()` — whether the focused message is in the actionable (drilled-in) state.
- `useMessageContentTabIndex()` — the tab index custom interactive message content should apply.

See the [Accessibility](/x/react-chat/material/message-list/#accessibility) page for the roving-focus and drill-in model these hooks implement.

## Advanced: `useChatStore()`

Returns the underlying `ChatStore<Cursor>` instance directly.
This is the escape hatch for cases that none of the dedicated hooks cover — writing custom selectors, subscribing to store updates outside React render, or integrating with Redux or Zustand.

```ts
const store: ChatStore<Cursor> = useChatStore();
```

Use the store's built-in `use()` method to create a reactive subscription with a custom selector:

```tsx
import { useChatStore, chatSelectors } from '@mui/x-chat/headless';

function MessageCounter() {
  const store = useChatStore();
  const count = store.use(chatSelectors.messageCount);

  return <Chip label={`${count} messages`} />;
}
```

Custom selectors must return referentially stable values for unchanged state. A selector that builds a new array or object on every call — such as `(state) => state.messages.filter(...)` — makes the component re-render on every store update, because the selected value never compares equal. Prefer selecting primitives or existing references, and memoize derived collections.

`useChatStore()` gives you access to all selectors in `chatSelectors` and the full store mutation API.

:::warning
Use it sparingly — the dedicated hooks above are simpler, better typed, and remain stable across minor versions.
Direct store access is considered advanced API and is more likely to require changes during upgrades.
:::

## See also

- [Adapters](/x/react-chat/backend/adapters/) for the interface that the actions in these hooks call into.
- [Selectors Reference](/x/react-chat/resources/selectors/) for the full `chatSelectors` map used with `useChatStore()`.
- [Controlled State](/x/react-chat/backend/controlled-state/) for `ChatProvider` props and the controlled/uncontrolled model.
- [Events & Callbacks](/x/react-chat/resources/events-and-callbacks/) for `onFinish`, `onToolCall`, `onData`, and `onError`.
