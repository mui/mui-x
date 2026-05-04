---
productId: x-chat
title: Layout
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatLayout
---

# Chat - Layout

<p class="description">Understand the two-pane layout structure, thread-only mode, and how to recompose the chat surface.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Overview

`ChatLayout` is the low-level pane manager behind the chat surface.
It arranges a **conversation pane** and a **thread pane**, while leaving the surrounding runtime setup to `ChatProvider` and the pane contents to you.

{{"demo": "LayoutTwoPaneStandalone.js", "bg": "inline", "defaultCodeOpen": false}}

## Component anatomy

The most common `ChatLayout` composition looks like this:

```text
ChatLayout
  ChatConversationList              ← sidebar with conversation entries
  ChatConversation                  ← thread shell, derives the active conversation
    ChatConversationHeader          ← header bar with divider styling
      ChatConversationTitle         ← conversation name
      ChatConversationSubtitle     ← secondary line (participants, presence, etc.)
      ChatConversationHeaderActions ← action area (archive, mute, context menu)
    ChatMessageList                 ← scrollable message area
      ChatMessageGroup              ← groups consecutive same-author messages
        ChatMessage                 ← individual message row
          ChatMessageAvatar         ← author avatar
          ChatMessageContent        ← bubble + inner part renderers
          ChatMessageMeta           ← timestamp, status indicator
          ChatMessageActions        ← hover action menu
    ChatComposer                    ← composer form (border-top)
      ChatComposerTextArea          ← auto-resizing textarea
      ChatComposerToolbar           ← button row
        ChatComposerAttachButton
        ChatComposerSendButton
```

All of these components are exported from `@mui/x-chat`.

## Thread-only mode

When your application manages conversations externally, render only the thread pane inside `ChatLayout`.
The demo below keeps the provider setup, message list, and composer, but omits the conversation pane entirely:

{{"demo": "LayoutThreadOnlyStandalone.js", "bg": "inline", "defaultCodeOpen": false}}

In thread-only mode the active conversation fills the entire `ChatLayout` container.

## Full recomposition

Because `ChatLayout` only decides where panes go, you can assemble the thread from individual Material UI components directly.
This is useful when you want to insert additional UI between the header and the message list, or move controls around inside the thread pane.

The following example shows a fully assembled thread pane without relying on any `ChatBox` layout defaults:

```tsx
import {
  ChatConversation,
  ChatConversationHeader,
  ChatConversationTitle,
  ChatConversationSubtitle,
  ChatConversationHeaderActions,
  ChatMessageList,
  ChatMessageGroup,
  ChatComposer,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatComposerSendButton,
} from '@mui/x-chat';
import Box from '@mui/material/Box';

function CustomThread() {
  return (
    <ChatConversation sx={{ height: '100%' }}>
      <ChatConversationHeader>
        <ChatConversationTitle />
        <ChatConversationSubtitle />
        <Box sx={{ flex: 1 }} />
        <ChatConversationHeaderActions />
      </ChatConversationHeader>

      {/* Custom pinned notice between header and messages */}
      <Box
        sx={{
          px: 2,
          py: 0.75,
          bgcolor: 'warning.light',
          color: 'warning.contrastText',
          fontSize: 'caption.fontSize',
        }}
      >
        Responses are AI-generated. Verify before acting.
      </Box>

      <ChatMessageList
        renderItem={({ id, index }) => (
          <ChatMessageGroup index={index} messageId={id} />
        )}
      />

      <ChatComposer>
        <ChatComposerTextArea placeholder="Type a message…" />
        <ChatComposerToolbar>
          <ChatComposerSendButton />
        </ChatComposerToolbar>
      </ChatComposer>
    </ChatConversation>
  );
}
```

Wrap `CustomThread` with a `ChatProvider` from `@mui/x-chat/headless` to wire runtime state to your adapter.

`ChatLayout` also supports split configurations where the conversation list and thread are rendered side by side.

## Responsive layout

`ChatLayout` does not impose breakpoint behavior.
You decide when to show both panes, when to show only the conversation list, and when to show only the active thread.

Drag the slider below to switch the same composition between:

- a two-pane layout above `600px`
- a single-pane conversation list or thread below `600px`

This example keeps the logic explicit so you can replace it with route-based navigation, a drawer, or any other responsive pattern your product needs:

{{"demo": "LayoutResponsiveStandalone.js", "bg": "inline", "defaultCodeOpen": false}}

Because the behavior is explicit, narrow-mode transitions stay easy to reason about and customize.

Set explicit dimensions on the parent element that wraps `ChatLayout`:

```tsx
<Box sx={{ height: 500 }}>
  <ChatLayout>{/* conversation pane + thread pane */}</ChatLayout>
</Box>
```
