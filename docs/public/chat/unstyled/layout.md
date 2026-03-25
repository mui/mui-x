---
productId: x-chat
title: Chat - Unstyled layout
packageName: '@mui/x-chat/unstyled'
---

# Unstyled layout

<p class="description">Use <code>Chat.Root</code> and <code>Chat.Layout</code> to define the main chat shell and split the interface into conversation and thread panes.</p>

```tsx
import * as React from 'react';
import {
  Chat,
  Conversation,
  Composer,
  ConversationList,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat/unstyled';
import { createEchoAdapter } from 'docsx/data/chat/unstyled/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/unstyled/examples/shared/demoData';
import {
  DemoComposerButton,
  DemoComposerInput,
  DemoComposerRoot,
  DemoConversationItem,
  DemoConversationItemAvatar,
  DemoConversationPreview,
  DemoConversationTimestamp,
  DemoConversationTitle,
  DemoConversationUnreadBadge,
  DemoMessageAuthor,
  DemoMessageAvatar,
  DemoMessageContent,
  DemoMessageGroup,
  DemoMessageMeta,
  DemoMessageRoot,
  DemoThreadHeader,
  demoSurfaceStyles,
} from 'docsx/data/chat/unstyled/examples/shared/DemoPrimitives';

const adapter = createEchoAdapter();

export default function MinimalUnstyledShell() {
  return (
    <Chat.Root
      adapter={adapter}
      defaultActiveConversationId={minimalConversation.id}
      defaultConversations={[minimalConversation]}
      defaultMessages={minimalMessages}
      slotProps={{ root: { style: demoSurfaceStyles.chatRoot } }}
    >
      <Chat.Layout
        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}
        slotProps={{
          root: { style: demoSurfaceStyles.layout },
          conversationsPane: { style: demoSurfaceStyles.conversationsPane },
          threadPane: {
            style: {
              ...demoSurfaceStyles.threadPane,
              gridTemplateRows: 'minmax(0, 1fr)',
            },
          },
        }}
      >
        <ConversationList.Root
          aria-label="Starter threads"
          slotProps={{ root: { style: demoSurfaceStyles.conversationList } }}
          slots={{
            item: DemoConversationItem,
            itemAvatar: DemoConversationItemAvatar,
            preview: DemoConversationPreview,
            timestamp: DemoConversationTimestamp,
            title: DemoConversationTitle,
            unreadBadge: DemoConversationUnreadBadge,
          }}
        />
        <Conversation.Root
          slotProps={{ root: { style: demoSurfaceStyles.threadRoot } }}
        >
          <Conversation.Header slots={{ root: DemoThreadHeader }}>
            <div style={{ minWidth: 0 }}>
              <Conversation.Title style={{ fontSize: 18, fontWeight: 800 }} />
              <Conversation.Subtitle
                style={{
                  color: '#5c6b7c',
                  fontSize: 13,
                  marginTop: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />
            </div>
          </Conversation.Header>
          <MessageList.Root
            estimatedItemSize={90}
            renderItem={({ id, index }) => (
              <MessageGroup
                index={index}
                key={id}
                messageId={id}
                slotProps={{ authorName: { style: { marginLeft: 42 } } }}
                slots={{ authorName: DemoMessageAuthor, root: DemoMessageGroup }}
              >
                <Message.Root messageId={id} slots={{ root: DemoMessageRoot }}>
                  <Message.Avatar slots={{ root: DemoMessageAvatar }} />
                  <Message.Content slots={{ root: DemoMessageContent }} />
                  <Message.Meta slots={{ root: DemoMessageMeta }} />
                </Message.Root>
              </MessageGroup>
            )}
            style={{ minHeight: 0 }}
          />
          <Composer.Root slots={{ root: DemoComposerRoot }}>
            <Composer.TextArea
              aria-label="Message"
              placeholder="Ask the starter thread a question"
              slots={{ root: DemoComposerInput }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Composer.SendButton
                data-variant="primary"
                slots={{ root: DemoComposerButton }}
              >
                Send
              </Composer.SendButton>
            </div>
          </Composer.Root>
        </Conversation.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
```

## `Chat.Root`

`Chat.Root` wraps `ChatProvider` and exposes a root slot for the outer container.
It accepts the same runtime props as the headless provider, then renders your chat surface inside a structural root element.

Use `Chat.Root` when you want:

- provider setup colocated with the UI shell
- controlled or uncontrolled chat models at the app boundary
- slot replacement for the top-level wrapper

Because `Chat.Root` forwards the headless provider props, it can own:

- `adapter`
- controlled or uncontrolled `messages`
- controlled or uncontrolled `conversations`
- active conversation selection
- composer value control
- runtime callbacks such as `onToolCall`, `onFinish`, `onData`, and `onError`

That keeps runtime setup close to the structural entry point without moving structural guidance into the headless docs.

## `Chat.Layout`

`Chat.Layout` is the pane manager for the unstyled layer.
It renders a root plus separate pane slots for conversations and the active thread.

It supports:

- two-pane layouts with both conversation and thread children
- single-pane layouts where only one side is rendered
- pane detection based on primitive markers
- reversed child order without losing pane placement
- pane slot replacement through `slots` and `slotProps`

The default layout is intentionally small.
Its job is to place panes and expose owner state, not to decide visual density, breakpoints, or design tokens.

## Pane detection

The layout recognizes marked pane components such as `ConversationList.Root` and `Conversation.Root`.
That means you can write:

```tsx
<Chat.Layout>
  <Conversation.Root />
  <ConversationList.Root />
</Chat.Layout>
```

and still get the conversation pane rendered before the thread pane in the final layout structure.

If only one unmarked child is present, `Chat.Layout` treats it as the thread pane by default.

This makes single-thread layouts straightforward:

```tsx
<Chat.Layout>
  <Conversation.Root>{/* thread-only view */}</Conversation.Root>
</Chat.Layout>
```

## Slot model

The layout exposes:

- `root`
- `conversationsPane`
- `threadPane`

This is useful when you need semantic wrappers such as `aside` and `main`, or when a layout system expects custom container elements.

For example:

```tsx
<Chat.Layout
  slots={{
    conversationsPane: 'aside',
    threadPane: 'main',
  }}
  slotProps={{
    conversationsPane: { 'aria-label': 'Conversations' },
    threadPane: { 'aria-label': 'Active thread' },
  }}
>
  <ConversationList.Root />
  <Conversation.Root />
</Chat.Layout>
```

## One-pane and two-pane guidance

Use a two-pane layout when:

- conversation switching happens inside the same page
- the product behaves like an inbox or agent workspace

Use a one-pane layout when:

- the conversation is already chosen by routing
- the page is dedicated to a single thread
- the conversation list lives somewhere else in the application shell

## Recommended patterns

- Use `Chat.Layout` for desktop split-pane surfaces.
- Render just `Conversation.Root` inside `Chat.Layout` for focused thread pages.
- Replace the pane slots when the surrounding page already defines grid or landmark semantics.

For the canonical end-to-end shell, continue with [Composition](/x/react-chat/unstyled/composition/).
For the inbox rail itself, continue with [Conversation list](/x/react-chat/unstyled/conversation-list/).
