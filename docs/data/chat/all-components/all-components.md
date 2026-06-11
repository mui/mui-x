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

## Full surfaces

Reach for these when you want a working chat with minimal wiring—`ChatBox` is the batteries-included entry point, while `ChatConversation` is for when you bring your own shell:

{{"component": "modules/chat-gallery/ChatFullSurfacesComponents.tsx"}}

## Layout and navigation

The shell around messages: conversation chrome, header slots (info, title, subtitle, actions), and the inbox-style conversation list for multi-conversation apps:

{{"component": "modules/chat-gallery/ChatLayoutComponents.tsx"}}

## Messages

The message stack from list to group to message, plus the slots inside each bubble; reach for a slot when restyling a single part instead of replacing the whole message:

{{"component": "modules/chat-gallery/ChatMessageComponents.tsx"}}

## Composer

Build the prompt form from a label, text area, attachment controls, toolbar, send button, and helper text—swap any slot to restyle one part without rebuilding the form:

{{"component": "modules/chat-gallery/ChatComposerComponents.tsx"}}

## States

Transient runtime affordances—use these when the conversation is loading, someone is typing, or the user has scrolled away: suggestions, typing indicators, unread markers, loading skeletons, date dividers, and scroll affordances:

{{"component": "modules/chat-gallery/ChatStateComponents.tsx"}}

## AI and rich content

Presentational renderers for AI output—citations, code blocks, approval prompts, and other building blocks you can drop into custom message content without tying them to the runtime:

{{"component": "modules/chat-gallery/ChatAiContentComponents.tsx"}}
