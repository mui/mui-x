---
productId: x-chat
title: Chat React components
packageName: '@mui/x-chat'
---

# MUI X Chat

A layered chat package family spanning headless runtime, unstyled primitives, and Material UI components.

This section is organized around the layered `x-chat` package family.
It has one product entry point, then splits implementation details by layer:

- [Headless](/x/react-chat/headless/): runtime, adapters, store, hooks, selectors, and renderer contracts.
- [Unstyled](/x/react-chat/unstyled/): structural primitives, slots, and accessibility-oriented DOM wiring.
- [Material UI](/x/react-chat/material/): the styled layer for `@mui/x-chat`, including the `ChatBox` one-liner API.

## Package model

The package family currently follows this dependency direction:

```text
@mui/x-chat
  -> @mui/x-chat-unstyled
    -> @mui/x-chat-headless
```

That split should be reflected directly in the docs:

- **Headless** explains state ownership, streaming, rendering contracts, and backend integration.
- **Unstyled** explains composition, slots, layout primitives, and list/composer structure.
- **Material UI** explains the higher-level styled API without duplicating lower-layer behavior docs.

## Documentation map

### Product entry

- **Overview**: positioning, package layering, feature boundaries, and links into each layer.
- **Choosing a layer**: when to start with headless, when to use unstyled, and when the Material layer is the right fit.

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

### Material UI section

- **Styled overview**: relationship to the lower layers and target developer experience.
- **`ChatBox` one-liner API**: the default entry point for common use cases.
- **Modular Material components**: conversations pane, thread, message surface, composer, and indicators.
- **Theming and customization**: slots, `sx`, theme overrides, density, and color schemes.

## Current status

The docs split above is intentionally ahead of the final implementation.

- `@mui/x-chat-headless` already has a concrete runtime surface.
- `@mui/x-chat-unstyled` now has concrete structural primitives and bridge exports.
- `@mui/x-chat` now exposes the styled layer, with `ChatBox` as the highest-level entry point and modular components for deeper customization.
