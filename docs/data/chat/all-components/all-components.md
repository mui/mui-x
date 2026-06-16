---
productId: x-chat
title: Chat - All components
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# All components

<p class="description">Browse every component shipped with the Chat package.</p>

Start with `ChatBox` for a complete drop-in surface, or compose `ChatConversation`, `ChatMessageList`, and `ChatComposer` yourself; everything below the compound level is a slot you can replace. New to the package? Read the [Overview](/x/react-chat/) and [Quickstart](/x/react-chat/quickstart/), then see [Structure](/x/react-chat/customization/structure/) for slots and composition. All components implement the shared keyboard-navigation and screen-reader model—see [Accessibility](/x/react-chat/accessibility/).

Each card carries a role chip:

- **Core** — the single top-level entry point (`ChatBox`).
- **Compound** — self-sufficient building blocks that render a full region and accept slots.
- **Slot** — replaceable child parts of a compound component; override via the parent's `slots` prop or compose directly.
- **State** — components that surface runtime state (typing, unread, errors, scroll position).
- **Presentational** — stateless display pieces you can use anywhere, even outside a Chat surface.

{{"component": "modules/chat-gallery/ChatGalleryFilter.tsx"}}

{{"component": "modules/chat-gallery/ChatGallery.tsx"}}
