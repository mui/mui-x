---
productId: x-chat
title: Chat - Headless
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Headless

<p class="description">The headless layer provides the runtime, adapter contract, hooks, selectors, and stream processing for fully custom chat UIs.</p>

`@mui/x-chat/headless` is the runtime-focused layer in the chat package family.
It gives you chat state, streaming, adapters, selectors, and composer logic without imposing any rendered UI.

## Where headless fits

Use `@mui/x-chat/headless` when you want chat behavior but you want to own the markup, layout, styling, and interaction model yourself.

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

Those concerns belong to [Unstyled](/x/react-chat/unstyled/).

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
} from '@mui/x-chat/headless';
```

## State and store

`ChatProvider` supports both controlled and uncontrolled state for messages, conversations, active conversation ID, and composer value.
Internally the store normalizes data into ID arrays and record maps, making streaming updates efficient and selector subscriptions granular.

See [State and store](/x/react-chat/headless/state/) for the full `ChatProvider` props reference, the controlled/uncontrolled model, error model, callbacks, and store internals.

## Hooks

Nine public hooks cover the full spectrum from all-in-one orchestration (`useChat()`) to row-level subscriptions (`useMessageIds()` + `useMessage(id)`).

Narrower hooks like `useChatComposer()`, `useChatStatus()`, and `useChatPartRenderer()` handle specific concerns without subscribing to unrelated state.

See [Hooks](/x/react-chat/headless/hooks/) for signatures, return types, and when-to-use guidance for every hook.

## Selectors

`chatSelectors` provides memoized selectors for the normalized store.
Use them directly with `useChatStore()` for custom derived values and advanced subscriptions.

See [Selectors](/x/react-chat/headless/selectors/) for the full selector table and usage patterns.

## Adapter contract

`ChatAdapter` is the transport boundary between the runtime and your backend.
Only `sendMessage()` is required — everything else is optional and incrementally adopted.
The adapter works with HTTP, SSE, WebSocket, or AI SDK-style streaming backends.

See [Adapters](/x/react-chat/headless/adapters/) for the full interface reference, a step-by-step writing guide, and backend pattern guidance.

## Streaming

The adapter returns a `ReadableStream` of typed chunks.
The runtime processes text, reasoning, tool, source, file, data, step, and metadata chunks into normalized message parts.
`streamFlushInterval` batches rapid deltas for efficient store updates.

See [Streaming](/x/react-chat/headless/streaming/) for the chunk protocol reference, envelope format, and stream construction patterns.

## Realtime

The adapter's `subscribe()` method enables push-based updates for messages, conversations, typing indicators, presence, and read state.
The runtime manages the subscription lifecycle on mount and unmount.

See [Realtime](/x/react-chat/headless/realtime/) for event types, store effects, and consumption patterns.

## Type augmentation

Module augmentation lets you add app-specific metadata, typed tool definitions, typed `data-*` payloads, and custom message parts.
Types flow through the entire stack at compile time — no provider props needed.

See [Type augmentation](/x/react-chat/headless/types/) for the six registry interfaces, a step-by-step guide, and an end-to-end example.

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
