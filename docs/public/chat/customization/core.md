---
productId: x-chat
title: Core
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Core

Build fully custom chat UIs using the core runtime, adapter contract, hooks, selectors, and stream processing.



`@mui/x-chat/headless` is the runtime-focused layer in the chat package family.
It gives you chat state, streaming, adapters, selectors, and composer logic without imposing any rendered UI.

## Where core fits

Use the core layer when you want chat behavior but you want to own the markup, layout, styling, and interaction model yourself.

## Mental model

The runtime is easiest to understand as a pipeline:

1. `ChatProvider` creates the store and runtime actions.
2. Your `ChatAdapter` talks to the backend and returns streams.
3. `processStream` turns chunks into normalized message updates.
4. Hooks and selectors read the store at the granularity your UI needs.
5. Your components render plain React, headless primitives, or your own design system.

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

## What core owns

- the normalized chat store
- controlled and uncontrolled state models
- adapter-driven message sending and history loading
- stream processing and runtime callbacks
- realtime subscriptions and presence/read updates
- selector-friendly hooks for render-sensitive trees
- composer state, attachments, and submit behavior
- typed message-part and stream contracts

## What core does not own

- semantic DOM structure
- default rendering for message parts
- visual slots or compound components
- Material UI theming or styling

Those concerns belong to [Headless Components](/x/react-chat/customization/headless/).

## State and store

`ChatProvider` supports both controlled and uncontrolled state for messages, conversations, active conversation ID, and composer value.
Internally the store normalizes data into ID arrays and record maps, making streaming updates efficient and selector subscriptions granular.

See [Controlled State](/x/react-chat/backend/controlled-state/) for the full `ChatProvider` props reference, the controlled/uncontrolled model, and store internals.

## Hooks

Nine public hooks cover the full spectrum from all-in-one orchestration (`useChat()`) to row-level subscriptions (`useMessageIds()` + `useMessage(id)`).

Narrower hooks like `useChatComposer()`, `useChatStatus()`, and `useChatPartRenderer()` handle specific concerns without subscribing to unrelated state.

See [Hooks Reference](/x/react-chat/resources/hooks/) for signatures, return types, and when-to-use guidance for every hook.

## Selectors

`chatSelectors` provides memoized selectors for the normalized store.
Use them directly with `useChatStore()` for custom derived values and advanced subscriptions.

See [Selectors Reference](/x/react-chat/resources/selectors/) for the full selector table and usage patterns.

## Adapter contract

`ChatAdapter` is the transport boundary between the runtime and your backend.
Only `sendMessage()` is required — everything else is optional and incrementally adopted.
The adapter works with HTTP, SSE, WebSocket, or AI SDK-style streaming backends.

See [Adapters](/x/react-chat/backend/adapters/) for the full interface reference, a step-by-step writing guide, and backend pattern guidance.

## Streaming

The adapter returns a `ReadableStream` of typed chunks.
The runtime processes text, reasoning, tool, source, file, data, step, and metadata chunks into normalized message parts.
`streamFlushInterval` batches rapid deltas for efficient store updates.

See [Streaming](/x/react-chat/behavior/streaming/) for the chunk protocol reference, envelope format, and stream construction patterns.

## Realtime

The adapter's `subscribe()` method enables push-based updates for messages, conversations, typing indicators, presence, and read state.
The runtime manages the subscription lifecycle on mount and unmount.

See [Real-Time Adapters](/x/react-chat/backend/real-time-adapters/) for event types, store effects, and consumption patterns.

## Scope boundary

- Stay on core when you want runtime primitives and complete control over UI.
- Move to [Headless Components](/x/react-chat/customization/headless/) when you want structure and composition primitives.

## See also

- [Adapters](/x/react-chat/backend/adapters/) for the full adapter interface.
- [Hooks Reference](/x/react-chat/resources/hooks/) for the hook API reference.
- [Selectors Reference](/x/react-chat/resources/selectors/) for the selector API reference.
- [Controlled State](/x/react-chat/backend/controlled-state/) for state management patterns.

## API
