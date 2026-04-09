---
title: Chat - Minimal headless shell
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Minimal headless shell

<p class="description">Start with the smallest complete chat surface built from headless primitives.</p>

This is the entry-point demo for `@mui/x-chat/headless`.
It shows the smallest surface that still feels like a real chat UI: a root, a pane layout, a conversation list, a thread container, a message log, and a composer.

It is intentionally simple so the structural responsibilities are easy to see before any advanced customization is introduced.

- `Chat.Root`
- `Chat.Layout`
- `ConversationList.Root`
- `Conversation.Root`
- `MessageList.Root`
- `Composer.Root`

{{"demo": "MinimalUnstyledShell.js"}}

## Why start here

Use this demo to understand:

- which primitives are structural containers
- which parts are optional enhancements versus baseline building blocks
- where core runtime props enter the headless tree

This page should be the canonical answer to, "What is the smallest complete headless chat surface I can compose?"

## Real-world use cases

This pattern is a good fit for:

- early product prototypes that need a believable chat shell quickly
- internal tools where correctness matters more than polished visual design
- embedded assistants that need a compact, low-ceremony chat surface
- documentation, demos, and sandbox pages that should teach the headless stack clearly

## Key primitives

- `Chat.Root` wires the runtime and owns the outer shell.
- `Chat.Layout` splits the surface into conversation and thread panes.
- `ConversationList.Root` renders the selectable list of conversations.
- `Conversation.Root` holds the active conversation surface.
- `MessageList.Root` renders the thread log.
- `Composer.Root` holds the draft surface and submit flow.

## Implementation notes

- Keep this demo visually simple so the structural roles are obvious.
- Use namespaced imports to teach the component family model.
- Avoid advanced slot replacement here. The point is to teach the default composition stack first.
- Prefer a small but realistic data set so the shell feels genuine without distracting from the primitive boundaries.

## What to pay attention to

- `Chat.Root` is where core runtime props enter the headless tree.
- `Chat.Layout` is already enough to produce a recognizable application shell.
- Most richer demos keep the same baseline structure and only add behavior or customization on top.

## See also

- Continue with [Two-pane inbox](/x/react-chat/headless/examples/two-pane-inbox/) for the standard application layout.
- Continue with [Composition](/x/react-chat/headless/composition/) for the conceptual explanation of the same shell.

## API

- [ChatRoot](/x/api/chat/chat-root/)
