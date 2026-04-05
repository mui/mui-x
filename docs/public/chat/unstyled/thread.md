---
productId: x-chat
title: Chat - Unstyled thread
packageName: '@mui/x-chat/headless'
components: ConversationRoot, ConversationHeader, ConversationTitle, ConversationSubtitle, ConversationHeaderActions
githubLabel: 'scope: chat'
---

# Chat - Unstyled thread

Build the active conversation surface from thread primitives that derive their state from the selected conversation.

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
} from '@mui/x-chat/headless';
import {
  createEchoAdapter,
  cloneConversations,
  cloneThreadMap,
  syncConversationPreview,
} from 'docsx/data/chat/unstyled/examples/shared/demoUtils';
import {
  demoUsers,
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/unstyled/examples/shared/demoData';
import {
  demoLocaleText,
  demoSlotProps,
  DemoToolbarButton,
  demoSurfaceStyles,
} from 'docsx/data/chat/unstyled/examples/shared/DemoPrimitives';

export default function TwoPaneInbox() {
  const [activeConversationId, setActiveConversationId] = React.useState('triage');
  const [conversations, setConversations] = React.useState(() =>
    cloneConversations(inboxConversations),
  );
  const [threads, setThreads] = React.useState(() => cloneThreadMap(inboxThreads));

  const adapter = React.useMemo(
    () =>
      createEchoAdapter({
        agent: demoUsers.agent,
        respond: (text) =>
          `Inbox reply: ${text}. This thread keeps the default two-pane composition while each pane stays independently customizable.`,
      }),
    [],
  );

  const activeMessages = threads[activeConversationId] ?? [];

  return (
    <Chat.Root
      activeConversationId={activeConversationId}
      adapter={adapter}
      conversations={conversations}
      messages={activeMessages}
      onActiveConversationChange={(nextConversationId) => {
        if (nextConversationId) {
          setActiveConversationId(nextConversationId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((previous) => ({
          ...previous,
          [activeConversationId]: nextMessages,
        }));
        setConversations((previous) =>
          syncConversationPreview(previous, activeConversationId, nextMessages),
        );
      }}
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
        <div
          style={{
            display: 'grid',
            gap: 12,
            minHeight: 0,
            gridTemplateRows: 'auto minmax(0, 1fr)',
          }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111111' }}>
              Inbox
            </div>
            <div style={{ fontSize: 13, color: '#666666', marginTop: 4 }}>
              Conversation selection, keyboard navigation, and focus restore all stay
              inside the unstyled list.
            </div>
          </div>
          <ConversationList.Root
            aria-label="Inbox threads"
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
        </div>
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
            <Conversation.HeaderActions style={{ display: 'flex', gap: 8 }}>
              <DemoToolbarButton
                onClick={() =>
                  setConversations((previous) =>
                    previous.map((conversation) =>
                      conversation.id === activeConversationId
                        ? { ...conversation, unreadCount: 0, readState: 'read' }
                        : conversation,
                    ),
                  )
                }
              >
                Mark read
              </DemoToolbarButton>
              <DemoToolbarButton tone="accent">Escalate</DemoToolbarButton>
            </Conversation.HeaderActions>
          </Conversation.Header>
          <MessageList.Root
            estimatedItemSize={96}
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
              aria-label="Reply"
              placeholder="Reply in the active thread"
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
                Send reply
              </Composer.SendButton>
            </div>
          </Composer.Root>
        </Conversation.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
```

```tsx
import {
  Composer,
  MessageGroup,
  MessageList,
  Conversation,
} from '@mui/x-chat/headless';

<Conversation.Root>
  <Conversation.Header>
    <Conversation.Title />
    <Conversation.Subtitle />
    <Conversation.HeaderActions />
  </Conversation.Header>
  <MessageList.Root
    renderItem={({ id, index }) => <MessageGroup index={index} messageId={id} />}
  />
  <Composer.Root>
    <Composer.TextArea />
    <Composer.SendButton />
  </Composer.Root>
</Conversation.Root>;
```

## Primitive set

The thread surface is built from:

- `Conversation.Root`
- `Conversation.Header`
- `Conversation.Title`
- `Conversation.Subtitle`
- `Conversation.HeaderActions`

## `Conversation.Root`

`Conversation.Root` derives the active conversation from chat state and exposes it through thread owner state and context.

It is responsible for:

- tracking the active conversation id
- resolving the active conversation object
- exposing `hasConversation` for empty or loading thread states
- acting as the thread pane marker for `Chat.Layout`

Because `Conversation.Root` sits on top of chat state instead of receiving the active conversation as a prop, it stays synchronized with conversation switching automatically.

## Header composition

`Conversation.Header` is a structural wrapper for thread header content.
The default thread stack often includes:

- `Conversation.Title`
- `Conversation.Subtitle`
- `Conversation.HeaderActions`
- `Indicators.TypingIndicator`

Because the thread primitives all derive from the same context, header subparts can stay simple and focus on rendering.

That means custom title, subtitle, or action slots can react to the active conversation without repeating selector logic in every header component.

## Empty and missing-thread states

`Conversation.Root` exposes `hasConversation` through owner state.
Use that to switch between:

- a fully populated thread
- a placeholder that prompts the user to select a conversation
- a custom empty state for inbox views that have no active selection

For example, a custom root slot can render a thread placeholder when no active conversation exists while still keeping the same overall page structure.

## Owner state

Thread slots derive owner state from the active conversation, including:

- `conversationId`
- `conversation`
- `hasConversation`

This is useful for empty-thread layouts, custom action areas, and conditional header styling.

Typical owner-state-driven patterns include:

- changing spacing when the thread is empty
- hiding action buttons until a conversation is active
- switching between subtitle variants based on the active thread metadata

## Conversation subparts

### `Conversation.Title`

`Conversation.Title` is the structural slot for the conversation title.
Use it when the active conversation already carries a title and the thread header should stay minimal.

### `Conversation.Subtitle`

`Conversation.Subtitle` is the structural slot for secondary thread text such as participant names, preview metadata, or presence-driven summaries.

### `Conversation.HeaderActions`

`Conversation.HeaderActions` is the structural action region for controls such as archive, mute, or context-specific thread actions.
It is intentionally light on policy so the app can decide which actions belong there.

## Recommended patterns

- Use `Conversation.Root` as the shell for the active conversation region.
- Keep header composition inside `Conversation.Root` so title, subtitle, and actions stay in sync with the active conversation.
- Pair `Conversation.Root` with `MessageList.Root` and `Composer.Root` for the canonical thread surface.

## API

- [ConversationRoot](/x/api/chat/conversation-root/)
- [ConversationHeader](/x/api/chat/conversation-header/)
- [ConversationTitle](/x/api/chat/conversation-title/)
- [ConversationSubtitle](/x/api/chat/conversation-subtitle/)
- [ConversationHeaderActions](/x/api/chat/conversation-header-actions/)

## See also

- Continue with [Message list](/x/react-chat/unstyled/message-list/) for the scrolling and history behavior inside the thread.
- Continue with [Indicators](/x/react-chat/unstyled/indicators/) for thread-level affordances such as typing feedback.
- Continue with [Two-pane inbox](/x/react-chat/unstyled/examples/two-pane-inbox/) for the full thread-in-layout demo.
