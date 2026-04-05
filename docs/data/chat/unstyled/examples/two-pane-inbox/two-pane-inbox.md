---
title: Chat - Two-pane inbox
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Two-pane inbox

<p class="description">Build the default desktop chat application layout with a conversation rail and active thread pane.</p>

This demo takes the minimal shell and turns it into the most common product layout: a persistent conversation rail on the left and an active thread on the right.

For most teams, this is the first production-ready composition pattern rather than the minimal shell.

- `Chat.Layout` pane composition
- `ConversationList.Root` selection behavior
- `Conversation.Header`, `Conversation.Title`, and `Conversation.Subtitle`
- `MessageList.Root`
- `Composer.Root`

{{"demo": "TwoPaneInbox.js"}}

## Key primitives

- `Chat.Layout` provides the two-pane frame.
- `ConversationList.Root` owns selection, keyboard navigation, and focus restoration.
- `Conversation.Header` gives the thread a stable title and metadata region.
- `MessageList.Root` and `Composer.Root` complete the active thread pane.

## When to use this pattern

Use this layout for:

- support inboxes
- internal copilots with conversation history
- team communication surfaces with a stable rail of threads

It is especially applicable when users need to switch threads frequently without losing context in the active conversation pane.

## Implementation notes

- Use the default pane order so this page teaches the intended mental model before custom layouts.
- Show a real thread header rather than jumping straight from the list to the message log.
- Keep this demo focused on structural composition, not styling experiments.
- Include enough preview metadata in the conversation list that the value of a persistent rail is obvious.

## What to pay attention to

- `ConversationList.Root` and `Conversation.Root` already coordinate through active conversation state, so the page-level layout code can stay small.
- `Chat.Layout` should stay the structural owner of the two-pane arrangement even when the visual layout is heavily customized.

## See also

- Continue with [Conversation list](/x/react-chat/unstyled/conversation-list/) for list semantics and keyboard behavior.

## API

- [ChatRoot](/x/api/chat/chat-root/)
