---
productId: x-chat
title: Chat - Hooks
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Hooks

<p class="description">Read chat state and trigger runtime actions from your own components using hooks exported from <code>@mui/x-chat</code>.</p>

`ChatBox` covers most use cases out of the box, but sometimes you need to reach into chat state from components that live outside `ChatBox` — a page header that shows streaming status, a sidebar that renders conversation metadata, or a custom toolbar that controls the composer.

Every hook subscribes to a precise slice of the normalized store, so components only re-render when their own data changes.

## Import

All hooks are exported from `@mui/x-chat`:

```tsx
import {
  useChat,
  useChatComposer,
  useChatStatus,
  useConversations,
  useConversation,
  useMessageIds,
  useMessage,
  useChatOnToolCall,
  useChatPartRenderer,
  useChatStore,
} from '@mui/x-chat';
```

## Provider requirement

Every hook listed on this page must be called inside a component that has a `<ChatProvider>` (or `<ChatBox>`) ancestor in the tree.
Calling a hook outside a provider throws an error at development time.

`ChatBox` renders a `ChatProvider` internally, so hooks work naturally inside any component rendered as a child or descendant of `ChatBox`:

```tsx
function MyStatusBadge() {
  const { isStreaming } = useChatStatus(); // works — inside ChatBox's provider
  return isStreaming ? <Chip label="Responding..." /> : null;
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

The following demo shows hooks reading chat state from within a `ChatBox` child:

```tsx
'use client';
import * as React from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { ChatBox } from '@mui/x-chat';
import { useChatStatus } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

function StreamingBadge() {
  const { isStreaming } = useChatStatus();
  return isStreaming ? (
    <Chip label="Responding..." color="info" size="small" />
  ) : null;
}

export default function ChatBoxWithHooks() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <StreamingBadge />
      </Box>
    </ChatBox>
  );
}

```

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
  error, // ChatError | null

  // Actions
  sendMessage, // (input: UseChatSendMessageInput) => Promise<void>
  stopStreaming, // () => void
  loadMoreHistory, // () => Promise<void>
  setActiveConversation, // (id: string | undefined) => Promise<void>
  retry, // (messageId: string) => Promise<void>
  setError, // (error: ChatError | null) => void
  addToolApprovalResponse, // (input: ChatAddToolApproveResponseInput) => Promise<void>
} = useChat();
```

Because `useChat()` subscribes to multiple store slices at once, it re-renders on any state change.
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
It subscribes only to `isStreaming`, `hasMoreHistory`, `error`, and `typingUserIds` — making it ideal for status bars, loading spinners, and error banners that sit outside the message list.

```ts
const {
  isStreaming, // boolean
  hasMoreHistory, // boolean
  error, // ChatError | null
  typingUserIds, // string[] — users currently typing in the active conversation
} = useChatStatus();
```

```tsx
'use client';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatMessageList,
  ChatMessageGroup,
  ChatComposer,
} from '@mui/x-chat';
import { ChatProvider, useChatStatus } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

function StatusFooterContent() {
  const { isStreaming, typingUserIds, error } = useChatStatus();

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  if (isStreaming) {
    return <LinearProgress />;
  }
  if (typingUserIds.length > 0) {
    return <Typography variant="caption">Someone is typing...</Typography>;
  }
  return null;
}

const adapter = createEchoAdapter();

export default function StatusFooter() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
    >
      <Box
        sx={{
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChatConversation sx={{ height: '100%' }}>
          <ChatConversationHeader />
          <ChatMessageList
            renderItem={({ id, index }) => (
              <ChatMessageGroup index={index} messageId={id} />
            )}
          />
          <Box sx={{ px: 2, py: 0.5 }}>
            <StatusFooterContent />
          </Box>
          <ChatComposer />
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
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
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatMessageList,
  ChatMessageGroup,
  ChatComposer,
} from '@mui/x-chat';
import { ChatProvider, useConversations, useChat } from '@mui/x-chat-headless';
import {
  createEchoAdapter,
  syncConversationPreview,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/examples/shared/demoData';
import type {
  ChatConversation as ChatConversationType,
  ChatMessage,
} from '@mui/x-chat-headless';

function CustomSidebar() {
  const conversations = useConversations();
  const { setActiveConversation } = useChat();

  return (
    <List
      dense
      sx={{ width: 200, borderRight: '1px solid', borderColor: 'divider' }}
    >
      {conversations.map((c) => (
        <ListItemButton key={c.id} onClick={() => setActiveConversation(c.id)}>
          {c.title}
        </ListItemButton>
      ))}
    </List>
  );
}

const adapter = createEchoAdapter();

export default function ConversationSidebar() {
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => inboxConversations[0].id,
  );
  const [conversations, setConversations] = React.useState<ChatConversationType[]>(
    () => inboxConversations.map((c) => ({ ...c })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      Object.entries(inboxThreads).map(([id, msgs]) => [
        id,
        msgs.map((m) => ({ ...m })),
      ]),
    ),
  );

  const messages = threads[activeConversationId] ?? [];

  return (
    <ChatProvider
      adapter={adapter}
      activeConversationId={activeConversationId}
      conversations={conversations}
      messages={messages}
      onActiveConversationChange={(nextId) => {
        if (nextId) {
          setActiveConversationId(nextId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
        setConversations((prev) =>
          syncConversationPreview(prev, activeConversationId, nextMessages),
        );
      }}
    >
      <Box
        sx={{
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          display: 'flex',
        }}
      >
        <CustomSidebar />
        <ChatConversation sx={{ flex: 1 }}>
          <ChatConversationHeader />
          <ChatMessageList
            renderItem={({ id, index }) => (
              <ChatMessageGroup index={index} messageId={id} />
            )}
          />
          <ChatComposer />
        </ChatConversation>
      </Box>
    </ChatProvider>
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
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  ChatProvider,
  useMessageIds,
  useMessage,
  useChatComposer,
} from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  if (!message) {
    return null;
  }

  const textPart = message.parts.find((p) => p.type === 'text');
  return (
    <Paper
      sx={{
        p: 1.5,
        alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
        bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
        color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
      }}
    >
      {textPart?.type === 'text' ? textPart.text : null}
    </Paper>
  );
}

function Thread() {
  const messageIds = useMessageIds();

  return (
    <Stack spacing={1} sx={{ flex: 1, overflow: 'auto', p: 2 }}>
      {messageIds.map((id) => (
        <MessageRow key={id} id={id} />
      ))}
    </Stack>
  );
}

function SimpleComposer() {
  const { value, setValue, submit, isSubmitting } = useChatComposer();

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}
    >
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Type a message..."
      />
      <Button variant="contained" onClick={submit} disabled={isSubmitting}>
        Send
      </Button>
    </Stack>
  );
}

const adapter = createEchoAdapter();

export default function EfficientThread() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
    >
      <Box
        sx={{
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Thread />
        <SimpleComposer />
      </Box>
    </ChatProvider>
  );
}

```

This pattern scales to threads with hundreds of messages because no unnecessary re-renders propagate up the tree.

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

```tsx
'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ChatBox } from '@mui/x-chat';
import { useChatComposer } from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

function CustomComposerContent() {
  const { value, setValue, submit, isSubmitting, addAttachment } = useChatComposer();

  return (
    <Stack direction="row" spacing={1} sx={{ p: 1 }}>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Type a message..."
      />
      <IconButton component="label">
        <AttachFileIcon />
        <input
          type="file"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              addAttachment(file);
            }
          }}
        />
      </IconButton>
      <Button variant="contained" onClick={submit} disabled={isSubmitting}>
        Send
      </Button>
    </Stack>
  );
}

const adapter = createEchoAdapter();

export default function CustomComposer() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ composerRoot: CustomComposerContent }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
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

## Advanced: `useChatStore()`

Returns the underlying `ChatStore<Cursor>` instance directly.
This is the escape hatch for cases that none of the dedicated hooks cover — writing custom selectors, subscribing to store updates outside React render, or integrating with Redux or Zustand.

```ts
const store: ChatStore<Cursor> = useChatStore();
```

Use it with `useStore()` from `@mui/x-internals/store` to create a custom subscription:

```tsx
import { useChatStore, chatSelectors } from '@mui/x-chat';
import { useStore } from '@mui/x-internals/store';

function MessageCounter() {
  const store = useChatStore();
  const count = useStore(store, chatSelectors.messageCount);

  return <Chip label={`${count} messages`} />;
}
```

`useChatStore()` gives you access to all selectors in `chatSelectors` and the full store mutation API.

:::warning
Use it sparingly — the dedicated hooks above are simpler, better typed, and remain stable across minor versions.
Direct store access is considered advanced API and is more likely to require changes during upgrades.
:::

## Choosing the right hook

| Goal                                                     | Hook                                         |
| :------------------------------------------------------- | :------------------------------------------- |
| Prototype or component that needs both state and actions | `useChat()`                                  |
| Status chip, typing indicator, or error banner           | `useChatStatus()`                            |
| Conversation list or sidebar                             | `useConversations()` / `useConversation(id)` |
| Thread with many messages (efficient rendering)          | `useMessageIds()` + `useMessage(id)`         |
| Custom composer with text and attachments                | `useChatComposer()`                          |
| Custom tool part that respects provider callbacks        | `useChatOnToolCall()`                        |
| Custom part renderer lookup                              | `useChatPartRenderer(partType)`              |
| Custom selector or store subscription                    | `useChatStore()` + `chatSelectors`           |

## See also

- [Adapter](/x/react-chat/material/adapter/) for the interface that the actions in these hooks call into.
- [Customization](/x/react-chat/material/customization/) for slot and `slotProps` overrides on `ChatBox`.

## API

- [ChatRoot](/x/api/chat/chat-root/)
