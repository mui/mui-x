---
productId: x-chat
title: Layout
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
components: ChatLayout
---

# Chat - Layout

<p class="description">Compose conversation and thread panes in the chat surface, with full control over layout and responsive behavior.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Overview

`ChatLayout` arranges a **conversation pane** and a **thread pane** in the chat surface.
The surrounding runtime setup is delegated to `ChatProvider`, and the pane contents are yours to compose.

## Composition structure

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

`ChatLayout` is exported from `@mui/x-chat/headless`; every component below it in the tree is exported from `@mui/x-chat`.

## Thread-only mode

When your application manages conversations externally, render only the thread pane inside `ChatLayout`.
The demo below keeps the provider, message list, and composer but omits the conversation pane:

{{"demo": "LayoutThreadOnlyStandalone.js", "bg": "inline", "defaultCodeOpen": false}}

In thread-only mode the active conversation fills the entire `ChatLayout` container.

## Full recomposition

Because `ChatLayout` only decides where panes go, you can assemble the thread from individual Material UI components directly.
Use this approach to insert additional UI between the header and the message list, or to move controls within the thread pane.

The example below shows a fully assembled thread pane that doesn't rely on `ChatBox` layout defaults:

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

`ChatLayout` also supports split configurations that render the conversation list and thread side by side.

## Responsive layout

`ChatLayout` does not impose breakpoint behavior.
You decide when to show both panes, when to show only the conversation list, and when to show only the active thread.

Drag the slider below to switch the same composition between:

- a two-pane layout above `600px`
- a single-pane conversation list or thread below `600px`

The demo below keeps the logic explicit so you can swap it for route-based navigation, a drawer, or any other responsive pattern:

{{"demo": "LayoutResponsiveStandalone.js", "bg": "inline", "defaultCodeOpen": false}}

Explicit responsive logic keeps narrow-mode transitions straightforward to customize.

Set explicit dimensions on the parent element that wraps `ChatLayout`:

```tsx
<Box sx={{ height: 500 }}>
  <ChatLayout>{/* conversation pane + thread pane */}</ChatLayout>
</Box>
```
