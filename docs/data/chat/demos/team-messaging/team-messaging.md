---
productId: x-chat
title: Team Messaging demo
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Team Messaging demo

<p class="description">A two-pane inbox layout with a conversation sidebar, thread switching, and per-conversation message state.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

## Multi-conversation inbox

A full team messaging surface with multiple conversations. The sidebar renders automatically when more than one conversation is provided, allowing users to switch between threads while each conversation maintains its own message history.

{{"demo": "../../material/examples/multi-conversation/MultiConversation.js", "defaultCodeOpen": false, "bg": "inline"}}

## What this demo shows

- **Conversation list sidebar** — a navigable list of conversations with titles, previews, and unread indicators rendered automatically when multiple conversations are provided
- **Thread switching** — clicking a conversation in the sidebar loads its message history into the thread pane, with controlled `activeConversationId` state
- **Per-conversation message state** — each conversation stores its own message array, managed through `onMessagesChange` callbacks and keyed by conversation ID
- **Read state and unread counts** — the `unreadCount` and `readState` properties on each conversation drive sidebar badges and visual indicators
- **Responsive layout** — the two-pane layout adapts to the container, with the sidebar and thread pane sharing the available space

## API

- [`ChatBox`](/x/api/chat/chat-box/)
