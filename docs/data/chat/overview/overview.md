---
productId: x-chat
title: Chat React components
packageName: '@mui/x-chat-unstyled'
---

# MUI X Chat

<p class="description">A layered chat package family spanning headless runtime and unstyled structural primitives.</p>

This section is organized around the layered `x-chat` package family.
It splits implementation details by layer:

- [Material UI](/x/react-chat/material/): one-liner `ChatBox` styled with your active Material UI theme.
- [Unstyled](/x/react-chat/unstyled/): structural primitives, slots, and accessibility-oriented DOM wiring.
- [Headless](/x/react-chat/headless/): runtime, adapters, store, hooks, selectors, and renderer contracts.

## Package model

The package family follows this dependency direction:

```text
@mui/x-chat
  -> @mui/x-chat-unstyled
       -> @mui/x-chat-headless
```

Each layer builds on the one below it:

- **Material UI** adds visual styles via Material UI `styled()` on top of the unstyled primitives.
- **Unstyled** adds structural DOM wiring, slots, and accessibility on top of the headless runtime.
- **Headless** owns state, streaming, adapters, and hooks with no DOM output.

## Choosing a layer

| If you want…                                                                   | Use                    |
| ------------------------------------------------------------------------------ | ---------------------- |
| A styled chat surface that inherits your MUI theme with minimal setup          | `@mui/x-chat`          |
| Full control over visual design using your own CSS, Tailwind, or design system | `@mui/x-chat-unstyled` |
| Complete control over DOM structure with only React state and hooks            | `@mui/x-chat-headless` |

## Documentation map

### Material UI section

- **Overview**: installation, basic usage, and theme integration.
- **Customization**: sx, theme overrides, slots, slotProps, and CSS class keys.
- **Examples**: end-to-end patterns — basic AI chat, multi-conversation inbox, custom theme, slot overrides.

### Unstyled section

- **Composition overview**: how `Chat`, `ConversationList`, `Thread`, `MessageList`, `Message`, and `Composer` fit together.
- **Layout and panes**: `Chat.Root` and `Chat.Layout`.
- **Conversation list**: root, item, avatar, text, and meta primitives.
- **Thread and messages**: thread header, message list, date dividers, message groups, and message parts.
- **Composer structure**: root, input, toolbar, attach button, helper text, and send button.
- **Slots and customization**: when to use structural components versus lower-level slot overrides.

### Headless section

- **Runtime overview**: `ChatProvider`, public state, controlled and uncontrolled flows.
- **Adapters and streaming**: `sendMessage`, chunk processing, errors, and realtime hooks.
- **Hooks and selectors**: `useChat`, `useConversation`, `useMessage`, `useMessageIds`, `chatSelectors`.
- **Composer state**: draft value, attachments, IME-safe submission, and progress state.
- **Part renderers and tool calls**: renderer registration, `useChatPartRenderer`, and `useChatOnToolCall`.

## Current status

- `@mui/x-chat` has a concrete `ChatBox` component with Material UI styles.
- `@mui/x-chat-headless` has a concrete runtime surface.
- `@mui/x-chat-unstyled` has concrete structural primitives and bridge exports.
