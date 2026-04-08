---
productId: x-chat
title: Chat - Headless layout
packageName: '@mui/x-chat-headless'
githubLabel: 'scope: chat'
---

# Chat - Headless layout

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
} from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/headless/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/headless/examples/shared/demoData';
import {
  demoLocaleText,
  demoSlotProps,
  demoSurfaceStyles,
} from 'docsx/data/chat/headless/examples/shared/DemoPrimitives';

const adapter = createEchoAdapter();

export default function MinimalUnstyledShell() {
  return (
    <Chat.Root
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      localeText={demoLocaleText}
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
          slotProps={{
            root: { style: demoSurfaceStyles.conversationList },
            item: demoSlotProps.conversationListItem,
            itemAvatar: demoSlotProps.conversationListItemAvatar,
            itemContent: demoSlotProps.conversationListItemContent,
            title: demoSlotProps.conversationListTitle,
            preview: demoSlotProps.conversationListPreview,
            timestamp: demoSlotProps.conversationListTimestamp,
            unreadBadge: demoSlotProps.conversationListUnreadBadge,
          }}
        />
        <Conversation.Root
          slotProps={{ root: { style: demoSurfaceStyles.threadRoot } }}
        >
          <Conversation.Header
            slotProps={{
              root: demoSlotProps.conversationHeader,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <Conversation.Title style={demoSlotProps.conversationTitle} />
              <Conversation.Subtitle style={demoSlotProps.conversationSubtitle} />
            </div>
          </Conversation.Header>
          <MessageList.Root
            estimatedItemSize={90}
            renderItem={({ id, index }) => (
              <MessageGroup
                index={index}
                key={id}
                messageId={id}
                slotProps={{
                  root: demoSlotProps.messageGroupRoot,
                  authorName: demoSlotProps.messageGroupAuthorName,
                }}
              >
                <Message.Root
                  messageId={id}
                  slotProps={{
                    root: demoSlotProps.messageRoot,
                  }}
                >
                  <Message.Avatar
                    slotProps={{
                      avatar: demoSlotProps.messageAvatar,
                      image: demoSlotProps.messageAvatarImage,
                    }}
                  />
                  <Message.Content
                    slotProps={{
                      bubble: demoSlotProps.messageBubble,
                    }}
                  />
                  <Message.Meta
                    slotProps={{
                      meta: demoSlotProps.messageMeta,
                    }}
                  />
                </Message.Root>
              </MessageGroup>
            )}
          />
          <Composer.Root
            slotProps={{
              root: demoSlotProps.composerRoot,
            }}
          >
            <Composer.TextArea
              aria-label="Message"
              placeholder="Ask the starter thread a question"
              slotProps={{
                input: demoSlotProps.composerTextArea,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Composer.SendButton
                data-variant="primary"
                slotProps={{
                  sendButton: demoSlotProps.composerSendButton,
                }}
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

`Chat.Layout` is the pane manager for the headless layer.
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

For the canonical end-to-end shell, continue with [Composition](/x/react-chat/headless/composition/).
For the inbox rail itself, continue with [Conversation list](/x/react-chat/headless/conversation-list/).

## API

- [ChatRoot](/x/api/chat/chat-root/)
- [ChatLayout](/x/api/chat/chat-layout/)
