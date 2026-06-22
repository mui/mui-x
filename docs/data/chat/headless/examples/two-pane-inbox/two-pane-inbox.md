---
title: Chat - Two-pane inbox
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Two-pane inbox

<p class="description">Compose a two-pane chat inbox with a persistent conversation rail and an active thread pane.</p>

The two-pane inbox layers a persistent conversation rail on the left and an active thread on the right, on top of the minimal headless shell.

It's the most common production layout for support inboxes, internal copilots, and team communication surfaces.

The demo below shows the full two-pane inbox assembled from the headless primitives:

{{"demo": "TwoPaneInbox.js"}}

## Key primitives

- `Chat.Layout` provides the two-pane frame.
- `ConversationList.Root` owns selection, keyboard navigation, and focus restoration.
- `Conversation.Header` gives the thread a stable title and metadata region.
- `MessageList.Root` and `Composer.Root` complete the active thread pane.

## When to use this pattern

Use this layout for:

- Support inboxes.
- Internal copilots with conversation history.
- Team communication surfaces with a stable rail of threads.

Use it when users need to switch threads frequently without losing context in the active conversation pane.

## Implementation notes

- Keep the default pane order so users learn the layout's mental model before you customize it.
- Render a real thread header instead of jumping straight from the list to the message log.
- Focus on structural composition before layering styling on top.
- Include enough preview metadata in the conversation list to make the persistent rail valuable at a glance.

## Composition details

- `ConversationList.Root` and `Conversation.Root` coordinate through active conversation state, so the page-level layout code stays small.
- Keep `Chat.Layout` as the structural owner of the two-pane arrangement even when you customize the visual layout.

## See also

- See [Conversation list](/x/react-chat/headless/conversation-list/) for details.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
