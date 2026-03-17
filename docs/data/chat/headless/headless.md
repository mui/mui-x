---
productId: x-chat
title: Chat - Headless
packageName: '@mui/x-chat-headless'
---

# Chat - Headless

<p class="description">The headless layer provides the runtime, adapter contract, hooks, selectors, and stream processing for fully custom chat UIs.</p>

`@mui/x-chat-headless` is the runtime-focused layer in the chat package family.
It gives you chat state, streaming, adapters, selectors, and composer logic without imposing any rendered UI.

## Where headless fits

Use `@mui/x-chat-headless` when you want chat behavior but you want to own the markup, layout, styling, and interaction model yourself.

Headless owns:

- the normalized chat store
- controlled and uncontrolled state models
- adapter-driven message sending and history loading
- stream processing and runtime callbacks
- realtime subscriptions and presence/read updates
- selector-friendly hooks for render-sensitive trees
- composer state, attachments, and submit behavior
- typed message-part and stream contracts

Headless does not own:

- semantic DOM structure
- default rendering for message parts
- visual slots or compound components
- Material UI theming or styling

Those concerns belong to [Unstyled](/x/react-chat/unstyled/) and later to [Material UI](/x/react-chat/material/).

## Mental model

The runtime is easiest to understand as a pipeline:

1. `ChatProvider` creates the store and runtime actions.
2. Your `ChatAdapter` talks to the backend and returns streams.
3. `processStream` turns chunks into normalized message updates.
4. Hooks and selectors read the store at the granularity your UI needs.
5. Your components render plain React, unstyled primitives, or your own design system.

```tsx
<ChatProvider adapter={adapter}>
  <YourCustomChatUI />
</ChatProvider>
```

The main public surface is:

```tsx
import {
  ChatProvider,
  chatSelectors,
  useChat,
  useChatComposer,
  useChatPartRenderer,
  useChatStatus,
  useChatStore,
  useConversation,
  useConversations,
  useMessage,
  useMessageIds,
} from '@mui/x-chat-headless';
```

## State ownership and data model

The public API stays array-first because that is what app code and React props usually want:

- `messages`
- `conversations`
- `activeConversationId`
- `composerValue`

`ChatProvider` supports both controlled and uncontrolled versions of those models.
That means you can start with `defaultMessages` and `defaultConversations`, then move to controlled props later without changing the runtime model.

Internally, the store is normalized:

- `messageIds` + `messagesById`
- `conversationIds` + `conversationsById`

That normalization is what makes the headless layer efficient for streaming and large threads:

- point updates do not require rebuilding the whole thread
- selector hooks can subscribe to one message or one conversation at a time
- ordering stays stable even when individual records update repeatedly

For the controlled array-first pattern, see [Controlled state](/x/react-chat/headless/examples/controlled-state/).
For row-level subscriptions, see [Selector-driven thread](/x/react-chat/headless/examples/selector-driven-thread/) and [Advanced store access](/x/react-chat/headless/examples/advanced-store-access/).

## Hooks and selectors

Use `useChat()` when you want the main orchestration surface in one place.

It returns public state:

- `messages`
- `conversations`
- `activeConversationId`
- `isStreaming`
- `hasMoreHistory`
- `error`

And runtime actions:

- `sendMessage`
- `stopStreaming`
- `loadMoreHistory`
- `setActiveConversation`
- `retry`
- `setError`
- `addToolApprovalResponse`

Use the narrower hooks when you need more targeted subscriptions:

- `useMessageIds()` and `useMessage(id)` for message rows
- `useConversations()` and `useConversation(id)` for conversation lists
- `useChatStatus()` for lightweight status such as `typingUserIds`
- `useChatComposer()` for draft state, attachments, and submit behavior
- `useChatStore()` plus `chatSelectors` when you need a lower-level escape hatch

## Adapter contract

`ChatAdapter` is the transport boundary between the runtime and your backend.

Required:

- `sendMessage()`

Optional:

- `listConversations()`
- `listMessages()`
- `reconnectToStream()`
- `setTyping()`
- `markRead()`
- `subscribe()`
- `loadMore()`
- `addToolApprovalResponse()`
- `stop()`

That keeps the runtime backend-agnostic:

- HTTP or SSE adapters fit
- WebSocket adapters fit
- AI SDK-style streaming adapters fit

For the smallest working setup, see [Minimal headless chat](/x/react-chat/headless/examples/minimal-chat/).

## Runtime lifecycles

### Mount lifecycle

When the provider mounts, the runtime can perform two optional setup tasks if the adapter supports them:

- `listConversations()` to load the conversation list
- `subscribe()` to start realtime updates

If you do not implement those methods, the headless runtime simply skips those phases.

### Conversation lifecycle

Conversation state is driven by `activeConversationId`.
When the active conversation changes and the adapter supports `listMessages()`, the runtime loads that conversation's messages and updates `hasMoreHistory` and `historyCursor`.

History pagination then builds on the same state through `loadMoreHistory()`.

Use:

- [Conversation history](/x/react-chat/headless/examples/conversation-history/) for `listConversations()`, `listMessages()`, and `loadMoreHistory()`
- [Controlled state](/x/react-chat/headless/examples/controlled-state/) for externally-owned conversation state

### Send and stream lifecycle

The send flow looks like this:

1. `sendMessage()` creates or uses a user message id.
2. The runtime adds the user message optimistically with `status: 'sending'`.
3. The adapter's `sendMessage()` returns a `ReadableStream`.
4. `processStream` reads chunks and applies them to the assistant message in the normalized store.
5. A terminal chunk such as `finish` or `abort` finalizes the assistant turn.
6. The user message status is updated to `sent`, `cancelled`, or `error`.

The stream processor understands:

- lifecycle chunks such as `start`, `finish`, and `abort`
- text and reasoning deltas
- tool input, approval, and output chunks
- source and file chunks
- `data-*` chunks
- step boundary chunks
- message metadata patches
- optional envelopes for dedupe and ordering

`streamFlushInterval` on `ChatProvider` batches rapid text and reasoning deltas before applying them to the store.

Use:

- [Message parts](/x/react-chat/headless/examples/message-parts/) for multi-part assistant messages
- [Streaming lifecycle](/x/react-chat/headless/examples/streaming-lifecycle/) for send, callbacks, stop, and retry

### Interruption and recovery

`stopStreaming()` aborts the active stream and calls `adapter.stop()` when provided.
If a stream disconnects before a terminal chunk arrives, the runtime records a recoverable stream error.
If a user turn fails or is cancelled, `retry(messageId)` resends that turn and removes the assistant messages tied to the failed attempt.

Errors surface through:

- `error` from `useChat()`
- `useChatStatus()`
- `onError`

### Realtime lifecycle

If the adapter implements `subscribe()`, the provider wires it on mount and cleans it up on unmount.

Realtime events can update:

- messages
- conversations
- typing state
- presence
- read state

Typing information is surfaced through `useChatStatus().typingUserIds`.

Use:

- [Realtime](/x/react-chat/headless/examples/realtime/) for provider-owned subscriptions, typing, presence, and read state
- [Realtime thread sync](/x/react-chat/headless/examples/realtime-thread-sync/) for add, update, and remove events

### Tool lifecycle

Tool calls are first-class runtime events.
The stream model covers:

- tool input becoming available
- tool approval requests
- tool approval responses
- tool output availability
- tool errors or denials

Two extension points matter here:

- `onToolCall` for side effects outside the store
- `addToolApprovalResponse()` for approval-required flows

Use:

- [Tool call events](/x/react-chat/headless/examples/tool-call-events/) for callback-driven side effects
- [Tool approval and renderers](/x/react-chat/headless/examples/tool-approval-and-renderers/) for approval flows and renderer registration

## Composer lifecycle

`useChatComposer()` wraps the draft lifecycle for custom inputs and toolbars.

It manages:

- draft text
- draft attachments
- image preview URLs for image attachments
- preview cleanup on removal, clear, and unmount
- IME-safe submission blocking during composition
- submission blocking while a stream is already active

Use [Composer](/x/react-chat/headless/examples/composer/) for a full custom draft area.

## Rendering model

Headless chat does not render message parts for you.
Built-in parts such as text, reasoning, tools, files, sources, and `data-*` parts are just typed data in `message.parts`.

That means you choose the rendering strategy:

- branch on `part.type` and render plain React yourself
- register custom renderers with `partRenderers`
- look up a registered renderer with `useChatPartRenderer(partType)`

The part renderer registry is especially useful for app-specific custom parts.
The default built-in renderer map is intentionally empty because headless does not impose UI decisions.

Use:

- [Message parts](/x/react-chat/headless/examples/message-parts/) for plain React branching over part types
- [Tool approval and renderers](/x/react-chat/headless/examples/tool-approval-and-renderers/) for custom renderer lookup

## Type augmentation and app-specific types

Headless chat uses TypeScript module augmentation for app-specific types.
This is how you add custom metadata, tool definitions, `data-*` payloads, and custom message parts.

These augmentation interfaces live under `@mui/x-chat-headless/types`:

- `ChatUserMetadata`
- `ChatConversationMetadata`
- `ChatMessageMetadata`
- `ChatToolDefinitionMap`
- `ChatDataPartMap`
- `ChatCustomMessagePartMap`

```ts
declare module '@mui/x-chat-headless/types' {
  interface ChatMessageMetadata {
    model?: 'gpt-4.1' | 'gpt-5';
    confidence?: 'medium' | 'high';
  }

  interface ChatToolDefinitionMap {
    'ticket.lookup': {
      input: { ticketId: string };
      output: { status: 'open' | 'blocked' | 'resolved' };
    };
  }

  interface ChatDataPartMap {
    'data-ticket-status': {
      ticketId: string;
      status: 'open' | 'blocked' | 'resolved';
    };
  }

  interface ChatCustomMessagePartMap {
    'ticket-summary': {
      type: 'ticket-summary';
      summary: string;
    };
  }
}
```

This is the headless package's type-extension model.
There is no separate provider prop for "type overrides".

Use [Type augmentation](/x/react-chat/headless/examples/type-augmentation/) for a focused end-to-end recipe that combines metadata, typed tools, typed `data-*` parts, and a custom renderer.

## Headless examples

The headless examples are organized as recipes.
Move from the smallest setup to the more specialized runtime patterns:

- [Headless examples overview](/x/react-chat/headless/examples/)
- [Minimal headless chat](/x/react-chat/headless/examples/minimal-chat/)
- [Controlled state](/x/react-chat/headless/examples/controlled-state/)
- [Selector-driven thread](/x/react-chat/headless/examples/selector-driven-thread/)
- [Conversation history](/x/react-chat/headless/examples/conversation-history/)
- [Composer](/x/react-chat/headless/examples/composer/)
- [Message parts](/x/react-chat/headless/examples/message-parts/)
- [Streaming lifecycle](/x/react-chat/headless/examples/streaming-lifecycle/)
- [Realtime](/x/react-chat/headless/examples/realtime/)
- [Realtime thread sync](/x/react-chat/headless/examples/realtime-thread-sync/)
- [Tool call events](/x/react-chat/headless/examples/tool-call-events/)
- [Type augmentation](/x/react-chat/headless/examples/type-augmentation/)
- [Tool approval and renderers](/x/react-chat/headless/examples/tool-approval-and-renderers/)
- [Advanced store access](/x/react-chat/headless/examples/advanced-store-access/)

## Scope boundary

- Stay on headless when you want runtime primitives and complete control over UI.
- Move to [Unstyled](/x/react-chat/unstyled/) when you want structure and composition primitives.
- Move to [Material UI](/x/react-chat/material/) when you want styled components aligned with the MUI design system.
