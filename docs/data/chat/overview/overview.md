---
productId: x-chat
title: Chat React components
packageName: '@mui/x-chat-unstyled'
---

# MUI X Chat

<p class="description">A layered chat package family spanning headless runtime and unstyled structural primitives.</p>

This section is organized around the layered `x-chat` package family.
It splits implementation details by layer:

- [Headless](/x/react-chat/headless/): runtime, adapters, store, hooks, selectors, and renderer contracts.
- [Unstyled](/x/react-chat/unstyled/): structural primitives, slots, and accessibility-oriented DOM wiring.

## Package model

The package family follows this dependency direction:

```text
@mui/x-chat-unstyled
  -> @mui/x-chat-headless
```

That split should be reflected directly in the docs:

- **Headless** explains state ownership, streaming, rendering contracts, and backend integration.
- **Unstyled** explains composition, slots, layout primitives, and list/composer structure.

## Documentation map

### Product entry

- **Overview**: positioning, package layering, feature boundaries, and links into each layer.
- **Choosing a layer**: when to start with headless and when to use unstyled.

### Headless section

- **Runtime overview**: `ChatProvider`, public state, controlled and uncontrolled flows.
- **Adapters and streaming**: `sendMessage`, chunk processing, errors, and realtime hooks.
- **Hooks and selectors**: `useChat`, `useConversation`, `useMessage`, `useMessageIds`, `chatSelectors`.
- **Composer state**: draft value, attachments, IME-safe submission, and progress state.
- **Part renderers and tool calls**: renderer registration, `useChatPartRenderer`, and `useChatOnToolCall`.

### Unstyled section

- **Composition overview**: how `Chat`, `ConversationList`, `Thread`, `MessageList`, `Message`, and `Composer` fit together.
- **Layout and panes**: `Chat.Root` and `Chat.Layout`.
- **Conversation list**: root, item, avatar, text, and meta primitives.
- **Thread and messages**: thread header, message list, date dividers, message groups, and message parts.
- **Composer structure**: root, input, toolbar, attach button, helper text, and send button.
- **Slots and customization**: when to use structural components versus lower-level slot overrides.

## Current status

- `@mui/x-chat-headless` has a concrete runtime surface.
- `@mui/x-chat-unstyled` has concrete structural primitives and bridge exports.
