---
productId: x-chat
title: Chat - Modular composition
packageName: '@mui/x-chat'
components: ChatConversation
---

# Modular composition

<p class="description">Build a chat UI from individual styled components when <code>ChatBox</code> does not fit your layout.</p>

## When to compose manually

Use `ChatBox` when the default two-pane or thread-only layout is a good fit.
Compose from `ChatConversation`, `ChatConversationInput`, and `ChatConversations` individually when:

- the layout is non-standard (e.g. conversations in a drawer, thread in a panel)
- you need to place the composer outside the thread container
- you want to share a provider across multiple surfaces

## Full composition

The styled components are designed to be used inside an unstyled `ChatRoot` provider.
`ChatRoot` owns the runtime state; the styled components read from the provider context.

{{"demo": "ModularComposition.js"}}

## Thread-only composition

When you do not need a conversations sidebar, compose `ChatConversation` and `ChatConversationInput` directly.

{{"demo": "ThreadOnlyComposition.js"}}

## Component relationships

| Styled component    | Unstyled equivalent                | Headless dependency                |
| :------------------ | :--------------------------------- | :--------------------------------- |
| `ChatConversations` | `ConversationList.Root`            | `useConversations`, `useChatStore` |
| `ChatConversation`      | `Conversation.Root` + `MessageList.Root` | `useMessageIds`, `useMessage`      |
| `ChatConversationInput` | `ConversationInput.Root`                 | `useChatComposer`                  |

Each styled component adds Material UI surface treatment (elevation, padding, typography, icon buttons) while preserving the slot and owner-state model from the unstyled layer.

## Adjacent pages

- See [ChatBox](/x/react-chat/material/chat-box/) for the one-liner API.
- See [Unstyled composition](/x/react-chat/unstyled/composition/) for the structural primitive model.
