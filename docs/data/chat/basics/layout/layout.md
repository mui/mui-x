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
The surrounding runtime setup is delegated to [`ChatProvider`](/x/react-chat/headless/); you supply the pane contents as children, and `ChatLayout` only assigns each child to a pane and positions it.

## Composition structure

The most common `ChatLayout` composition looks like this:

```text
ChatLayout
  ChatConversationList              ← sidebar with conversation entries
  ChatConversation                  ← thread shell, derives the active conversation
    ChatConversationHeader          ← header bar with divider styling
      ChatConversationTitle         ← conversation name
      ChatConversationSubtitle      ← secondary line (participants, presence, etc.)
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

## Two-pane layout

The default composition renders the conversation list and the active thread side by side.
Select a conversation in the sidebar to switch the thread:

{{"demo": "LayoutTwoPaneStandalone.js", "bg": "inline", "defaultCodeOpen": false}}

### Sizing the panes

`ChatLayout` wraps each pane in a slot: `conversationsPane` and `threadPane` (plus `root` for the flex container).
By default the thread pane flexes to fill the remaining width.
Use `slotProps` to set a fixed sidebar width:

```tsx
<ChatLayout
  slotProps={{
    conversationsPane: { style: { width: '280px', flex: '0 0 280px' } },
  }}
>
```

Each pane slot receives a `pane` owner state (`'conversations'` or `'thread'`), so a custom slot component can style both panes from one implementation.

## Thread-only mode

When your application manages conversations externally, render only the thread pane inside `ChatLayout`.
The demo below keeps the provider, message list, and composer but omits the conversation pane:

{{"demo": "LayoutThreadOnlyStandalone.js", "bg": "inline", "defaultCodeOpen": false}}

In thread-only mode the active conversation fills the entire `ChatLayout` container.

## Full recomposition

Because `ChatLayout` only decides where panes go, you can assemble the thread from individual Material UI components directly.
Use this approach to insert additional UI between the header and the message list, or to move controls within the thread pane.

The example below shows a fully assembled thread pane that doesn't rely on the layout defaults bundled into [`ChatBox`](/x/react-chat/basics/chatbox/), the all-in-one component:

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

{{"demo": "LayoutRecomposedStandalone.js", "bg": "inline", "defaultCodeOpen": false}}

Wrap `CustomThread` with a [`ChatProvider`](/x/react-chat/headless/) from `@mui/x-chat/headless` to wire runtime state to your adapter.

### Pane assignment

`ChatLayout` inspects its direct children to decide which pane each one belongs to.
`ChatConversationList` is assigned to the conversations pane and `ChatConversation` to the thread pane automatically.

If you wrap a pane child in another component (`styled()`, `React.memo()`, or a custom wrapper), `ChatLayout` can no longer identify it.
Unidentified children fall back to positional assignment: a single child fills the thread pane, and with several children the unidentified ones fill the conversations pane first, then the thread pane.
Instead of relying on this fallback, set the `pane` prop on the direct child explicitly:

```tsx
<ChatLayout>
  <MySidebar pane="conversations" />
  <MyThread pane="thread" />
</ChatLayout>
```

In development, `ChatLayout` warns in the console when it can identify some children but not others.

## Responsive layout

`ChatLayout` does not impose breakpoint behavior.
You decide when to show both panes, when to show only the conversation list, and when to show only the active thread.

Drag the slider below to switch the same composition between:

- a two-pane layout above `600px`
- a single-pane conversation list or thread below `600px`

The demo below keeps the logic explicit so you can swap it for route-based navigation, a drawer, or any other responsive pattern:

{{"demo": "LayoutResponsiveStandalone.js", "bg": "inline", "defaultCodeOpen": false}}

When collapsing to a single pane, keep the navigation accessible: label the conversation list (for example `aria-label="Conversations"`) and give the narrow-mode back control an explicit label such as `aria-label="Back to conversations"`, as the demo above does.

Explicit responsive logic keeps narrow-mode transitions straightforward to customize.

Set explicit dimensions on the parent element that wraps `ChatLayout`:

```tsx
<Box sx={{ height: 500 }}>
  <ChatLayout>{/* conversation pane + thread pane */}</ChatLayout>
</Box>
```

For the unstyled primitives behind this page, see the [headless layout documentation](/x/react-chat/headless/layout/).
