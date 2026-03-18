---
title: Chat - Minimal unstyled shell
productId: x-chat
packageName: '@mui/x-chat-unstyled'
---

# Minimal unstyled shell

Start with the smallest complete chat surface built from unstyled primitives.

This is the entry-point recipe for `@mui/x-chat-unstyled`.
It shows the smallest surface that still feels like a real chat UI: a root, a pane layout, a conversation list, a thread container, a message log, and a composer.

It is intentionally simple so the structural responsibilities are easy to see before any advanced customization is introduced.

```tsx
import * as React from 'react';
import {
  Chat,
  Conversation,
  ConversationInput,
  ConversationList,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat-unstyled';
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
            virtualization={false}
          />
          <ConversationInput.Root slots={{ root: DemoComposerRoot }}>
            <ConversationInput.TextArea
              aria-label="Message"
              placeholder="Ask the starter thread a question"
              slots={{ root: DemoComposerInput }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ConversationInput.SendButton
                data-variant="primary"
                slots={{ root: DemoComposerButton }}
              >
                Send
              </ConversationInput.SendButton>
            </div>
          </ConversationInput.Root>
        </Conversation.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}

```

## What it shows

- `Chat.Root`
- `Chat.Layout`
- `ConversationList.Root`
- `Conversation.Root`
- `MessageList.Root`
- `ConversationInput.Root`

## Why start here

Use this recipe to understand:

- which primitives are structural containers
- which parts are optional enhancements versus baseline building blocks
- where headless runtime props enter the unstyled tree

This page should be the canonical answer to, "What is the smallest complete unstyled chat surface I can compose?"

## Real-world use cases

This pattern is a good fit for:

- early product prototypes that need a believable chat shell quickly
- internal tools where correctness matters more than polished visual design
- embedded assistants that need a compact, low-ceremony chat surface
- documentation, demos, and sandbox pages that should teach the unstyled stack clearly

## Key primitives

- `Chat.Root` wires the runtime and owns the outer shell.
- `Chat.Layout` splits the surface into conversation and thread panes.
- `ConversationList.Root` renders the selectable list of conversations.
- `Conversation.Root` holds the active conversation surface.
- `MessageList.Root` renders the thread log.
- `ConversationInput.Root` holds the draft surface and submit flow.

## Implementation notes

- Keep this recipe visually simple so the structural roles are obvious.
- Use namespaced imports to teach the component family model.
- Avoid advanced slot replacement here. The point is to teach the default composition stack first.
- Prefer a small but realistic data set so the shell feels genuine without distracting from the primitive boundaries.

## What to pay attention to

- `Chat.Root` is where headless runtime props enter the unstyled tree.
- `Chat.Layout` is already enough to produce a recognizable application shell.
- Most richer recipes keep the same baseline structure and only add behavior or customization on top.

## Next steps

- Continue with [Two-pane inbox](/x/react-chat/unstyled/examples/two-pane-inbox/) for the standard application layout.
- Continue with [Composition](/x/react-chat/unstyled/composition/) for the conceptual explanation of the same shell.
