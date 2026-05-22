---
productId: x-chat
title: Layout
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox, ChatLayout
---

# Chat - Layout

<p class="description">Understand the two-pane layout structure, thread-only mode, and how to recompose the chat surface.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Overview

`ChatBox` renders a two-pane layout by default: a **conversation list** on the left and a **thread pane** on the right.
The thread pane contains the conversation header, scrollable message list, and composer.

{{"demo": "../../material/examples/basic-ai-chat/BasicAiChat.js", "bg": "inline", "defaultCodeOpen": false}}

## Component anatomy

The full `ChatBox` layout is composed of the following themed components:

```text
ChatBox
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

All components are exported from `@mui/x-chat`.

## Thread-only mode

When your application manages conversations externally (or only needs a single conversation), you can hide the conversation list and render the thread pane alone.
Pass a single conversation and set it as the active one:

{{"demo": "../../material/examples/thread-only/ThreadOnly.js", "bg": "inline", "defaultCodeOpen": false}}

In thread-only mode `ChatBox` does not render the conversation list sidebar, and the thread pane fills the entire width of the `ChatBox` container.

## Full recomposition

When `ChatBox` slots are not enough—for example when you want to add a pinned banner between the header and the message list, or position the typing indicator inside the header—you can assemble the thread from individual Material UI components directly.

The following example shows a fully assembled thread pane without relying on `ChatBox` layout defaults:

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

The layout supports split configurations where the conversation list and thread are rendered side by side.

## Responsive layout

`ChatBox` uses a CSS container query to adapt its layout based on its own width—not the viewport.
When the container is narrower than `600px`, the conversation list collapses automatically and a menu button appears in the conversation header.
Tapping the menu button opens the conversation list in a drawer overlay.

Drag the slider below to resize the container and see the transition in action:

{{"demo": "../../material/examples/responsive-drawer/ResponsiveDrawer.js", "bg": "inline", "defaultCodeOpen": false}}

This behavior is built in—no extra configuration is needed.
It works identically whether the `ChatBox` fills the full viewport on a mobile device or is embedded in a narrow sidebar on desktop.

Set explicit dimensions on the parent element or use the `sx` prop:

```tsx
<ChatBox adapter={adapter} sx={{ height: 500 }} />
```
