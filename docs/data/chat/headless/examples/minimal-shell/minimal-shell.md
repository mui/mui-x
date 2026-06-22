---
title: Chat - Minimal headless shell
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Minimal headless shell

<p class="description">Compose the smallest complete chat surface from headless primitives.</p>

The demo below composes the headless primitives that make up a complete chat surface — a root, a pane layout, a conversation list, a thread container, a message log, and a composer:

- `Chat.Root`
- `Chat.Layout`
- `ConversationList.Root`
- `Conversation.Root`
- `MessageList.Root`
- `Composer.Root`

{{"demo": "MinimalUnstyledShell.js"}}

Use the minimal shell to identify:

- Which primitives are structural containers.
- Which parts are optional enhancements versus baseline building blocks.
- Where core runtime props enter the headless tree.

## When to use this pattern

This pattern is a good fit for:

- Early product prototypes that need a believable chat shell quickly.
- Internal tools where correctness matters more than polished visual design.
- Embedded assistants that need a compact, low-ceremony chat surface.
- Documentation, demos, and sandbox pages that should teach the headless stack clearly.

## Key primitives

- `Chat.Root` wires the runtime into the headless tree and renders the chat surface root.
- `Chat.Layout` splits the surface into conversation and thread panes.
- `ConversationList.Root` renders the selectable list of conversations.
- `Conversation.Root` holds the active conversation surface.
- `MessageList.Root` renders the thread log.
- `Composer.Root` holds the draft surface and submit flow.

## See also

- See [Two-pane inbox](/x/react-chat/headless/examples/two-pane-inbox/) for the standard application layout.
- See [Composition](/x/react-chat/headless/composition/) for details on the conceptual structure.

## API

- [ChatRoot](/x/api/chat/chat-root/)
