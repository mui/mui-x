---
title: Chat - Headless examples
productId: x-chat
packageName: '@mui/x-chat-headless'
---

# Headless examples

<p class="description">Recipe-first examples for building custom chat UIs with <code>@mui/x-chat-headless</code> and plain React markup.</p>

These recipes stay strictly within the headless layer.
They use the runtime, hooks, selectors, callbacks, and adapter contract without relying on unstyled or Material UI primitives.

## Start here

- [Minimal headless chat](/x/react-chat/headless/examples/minimal-chat/) for the smallest working `ChatProvider` + `useChat()` setup
- [Controlled state](/x/react-chat/headless/examples/controlled-state/) for the array-first controlled model pattern
- [Selector-driven thread](/x/react-chat/headless/examples/selector-driven-thread/) for row-level subscriptions with selector hooks

## Runtime recipes

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
