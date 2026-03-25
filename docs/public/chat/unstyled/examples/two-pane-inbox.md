---
title: Chat - Two-pane inbox
productId: x-chat
packageName: '@mui/x-chat/unstyled'
---

# Two-pane inbox

Build the default desktop chat application layout with a conversation rail and active thread pane.

This recipe takes the minimal shell and turns it into the most common product layout: a persistent conversation rail on the left and an active thread on the right.

For most teams, this is the first production-ready composition pattern rather than the minimal shell.

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
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#10263d' }}>
              Inbox
            </div>
            <div style={{ fontSize: 13, color: '#5c6b7c', marginTop: 4 }}>
              Conversation selection, keyboard navigation, and focus restore all stay
              inside the unstyled list.
            </div>
          </div>
          <ConversationList.Root
            aria-label="Inbox threads"
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
        </div>
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
              aria-label="Reply"
              placeholder="Reply in the active thread"
              slots={{ root: DemoComposerInput }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Composer.SendButton
                data-variant="primary"
                slots={{ root: DemoComposerButton }}
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

## What it shows

- `Chat.Layout` pane composition
- `ConversationList.Root` selection behavior
- `Conversation.Header`, `Conversation.Title`, and `Conversation.Subtitle`
- `MessageList.Root`
- `Composer.Root`

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
- Keep this recipe focused on structural composition, not styling experiments.
- Include enough preview metadata in the conversation list that the value of a persistent rail is obvious.

## What to pay attention to

- `ConversationList.Root` and `Conversation.Root` already coordinate through active conversation state, so the page-level layout code can stay small.
- `Chat.Layout` should stay the structural owner of the two-pane arrangement even when the visual layout is heavily customized.

## Next steps

- Continue with [Conversation list](/x/react-chat/unstyled/conversation-list/) for list semantics and keyboard behavior.
