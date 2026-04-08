---
title: Chat - Core examples
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Core examples

<p class="description">Demo-first patterns for building custom chat UIs with <code>@mui/x-chat/headless</code> and plain React markup.</p>

These demos stay strictly within the core layer.
They use the runtime, hooks, selectors, callbacks, and adapter contract without relying on headless components or Material UI primitives.

Each demo includes explanatory prose, inline code snippets for the key patterns, and a runnable demo.
For the concept-level reference behind these demos, see the dedicated documentation pages:

- [State and store](/x/react-chat/core/state/) for `ChatProvider` props, controlled/uncontrolled state, and the error model
- [Hooks](/x/react-chat/core/hooks/) for all nine hooks with signatures and when-to-use guidance
- [Selectors](/x/react-chat/core/selectors/) for the full selector API and store subscription patterns
- [Adapters](/x/react-chat/core/adapters/) for the adapter interface, writing guide, and backend patterns
- [Streaming](/x/react-chat/core/streaming/) for the chunk protocol and stream construction
- [Realtime](/x/react-chat/core/realtime/) for event types, subscription lifecycle, and store effects
- [Type augmentation](/x/react-chat/core/types/) for the six registry interfaces and module augmentation

## Start here

- [Minimal core chat](/x/react-chat/core/examples/minimal-chat/) for the smallest working `ChatProvider` + `useChat()` setup
- [Controlled state](/x/react-chat/core/examples/controlled-state/) for the array-first controlled model pattern
- [Selector-driven thread](/x/react-chat/core/examples/selector-driven-thread/) for row-level subscriptions with selector hooks

## Runtime demos

- [Conversation history](/x/react-chat/core/examples/conversation-history/) covers `listConversations()`, `listMessages()`, `setActiveConversation()`, and `loadMoreHistory()`
- [Composer](/x/react-chat/core/examples/composer/) covers `useChatComposer()`, attachments, preview URLs, and IME-safe submit
- [Message parts](/x/react-chat/core/examples/message-parts/) shows how to render reasoning, sources, files, and `data-*` parts with plain React
- [Streaming lifecycle](/x/react-chat/core/examples/streaming-lifecycle/) covers `stopStreaming()`, `retry()`, and the runtime callbacks
- [Realtime](/x/react-chat/core/examples/realtime/) covers provider-owned subscriptions, typing, presence, and read-state updates
- [Realtime thread sync](/x/react-chat/core/examples/realtime-thread-sync/) covers realtime add, update, and remove events for conversations and messages

## Advanced extension points

- [Tool call events](/x/react-chat/core/examples/tool-call-events/) covers `onToolCall` and callback-driven side effects outside the store
- [Type augmentation](/x/react-chat/core/examples/type-augmentation/) covers module augmentation for metadata, typed tools, typed `data-*` parts, and custom message parts
- [Tool approval and renderers](/x/react-chat/core/examples/tool-approval-and-renderers/) covers `addToolApprovalResponse()`, `partRenderers`, and `useChatPartRenderer()`
- [Advanced store access](/x/react-chat/core/examples/advanced-store-access/) covers `useChatStore()`, `chatSelectors`, and low-level selector subscriptions

## API

- [ChatRoot](/x/api/chat/chat-root/)
