---
title: Chat - Headless examples
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Headless examples

<p class="description">Demo-first patterns for building custom chat UIs with <code>@mui/x-chat/headless</code> and plain React markup</p>

These demos stay strictly within the headless layer.
They use the runtime, hooks, selectors, callbacks, and adapter contract without relying on unstyled or Material UI primitives.

Each demo includes explanatory prose, inline code snippets for the key patterns, and a runnable demo.
For the concept-level reference behind these demos, see the dedicated documentation pages:

- [State and store](/x/react-chat/headless/state/) for `ChatProvider` props, controlled/uncontrolled state, and the error model
- [Hooks](/x/react-chat/headless/hooks/) for all nine hooks with signatures and when-to-use guidance
- [Selectors](/x/react-chat/headless/selectors/) for the full selector API and store subscription patterns
- [Adapters](/x/react-chat/headless/adapters/) for the adapter interface, writing guide, and backend patterns
- [Streaming](/x/react-chat/headless/streaming/) for the chunk protocol and stream construction
- [Realtime](/x/react-chat/headless/realtime/) for event types, subscription lifecycle, and store effects
- [Type augmentation](/x/react-chat/headless/types/) for the six registry interfaces and module augmentation

## Start here

- [Minimal headless chat](/x/react-chat/headless/examples/minimal-chat/) for the smallest working `ChatProvider` + `useChat()` setup
- [Controlled state](/x/react-chat/headless/examples/controlled-state/) for the array-first controlled model pattern
- [Selector-driven thread](/x/react-chat/headless/examples/selector-driven-thread/) for row-level subscriptions with selector hooks

## Runtime demos

- [Conversation history](/x/react-chat/headless/examples/conversation-history/) covers `listConversations()`, `listMessages()`, `setActiveConversation()`, and `loadMoreHistory()`
- [Composer](/x/react-chat/headless/examples/composer/) covers `useChatComposer()`, attachments, preview URLs, and IME-safe submit
- [Message parts](/x/react-chat/headless/examples/message-parts/) shows how to render reasoning, sources, files, and `data-*` parts with plain React
- [Streaming lifecycle](/x/react-chat/headless/examples/streaming-lifecycle/) covers `stopStreaming()`, `retry()`, and the runtime callbacks
- [Realtime](/x/react-chat/headless/examples/realtime/) covers provider-owned subscriptions, typing, presence, and read-state updates
- [Realtime thread sync](/x/react-chat/headless/examples/realtime-thread-sync/) covers realtime add, update, and remove events for conversations and messages

## Advanced extension points

- [Tool call events](/x/react-chat/headless/examples/tool-call-events/) covers `onToolCall` and callback-driven side effects outside the store
- [Type augmentation](/x/react-chat/headless/examples/type-augmentation/) covers module augmentation for metadata, typed tools, typed `data-*` parts, and custom message parts
- [Tool approval and renderers](/x/react-chat/headless/examples/tool-approval-and-renderers/) covers `addToolApprovalResponse()`, `partRenderers`, and `useChatPartRenderer()`
- [Advanced store access](/x/react-chat/headless/examples/advanced-store-access/) covers `useChatStore()`, `chatSelectors`, and low-level selector subscriptions

## API

- [ChatRoot](/x/api/chat/chat-root/)
