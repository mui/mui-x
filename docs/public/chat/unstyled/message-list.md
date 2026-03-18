---
productId: x-chat
title: Chat - Unstyled message list
packageName: '@mui/x-chat-unstyled'
components: MessageListRoot
---

# Unstyled message list

Render ordered thread rows with optional virtualization, date boundaries, history loading, scroll anchoring, and unseen-message tracking.

```tsx
import * as React from 'react';
import {
  Chat,
  Conversation,
  Indicators,
  Message,
  MessageGroup,
  MessageList,
  type MessageListRootHandle,
} from '@mui/x-chat-unstyled';
import {
  createEchoAdapter,
  cloneMessages,
  formatDayLabel,
} from 'docsx/data/chat/unstyled/examples/shared/demoUtils';
import {
  createLongThreadMessages,
  demoUsers,
} from 'docsx/data/chat/unstyled/examples/shared/demoData';
import {
  DemoDateDividerLabel,
  DemoDateDividerRoot,
  DemoMessageAuthor,
  DemoMessageAvatar,
  DemoMessageContent,
  DemoMessageGroup,
  DemoMessageListRoot,
  DemoMessageMeta,
  DemoMessageRoot,
  DemoThreadHeader,
  DemoToolbarButton,
  DemoUnreadMarkerLabel,
  DemoUnreadMarkerRoot,
} from 'docsx/data/chat/unstyled/examples/shared/DemoPrimitives';

const allMessages = createLongThreadMessages();
const initialMessages = cloneMessages(allMessages.slice(-18));
const initialHistory = cloneMessages(allMessages.slice(0, -18));

export default function VirtualizedThread() {
  const [messages, setMessages] = React.useState(initialMessages);
  const [history, setHistory] = React.useState(initialHistory);
  const listRef = React.useRef<MessageListRootHandle | null>(null);
  const adapter = React.useMemo(
    () => createEchoAdapter({ agent: demoUsers.agent }),
    [],
  );

  const appendIncoming = React.useCallback(() => {
    setMessages((previous) => [
      ...previous,
      {
        id: `long-thread-live-${previous.length + 1}`,
        conversationId: 'long-thread',
        role: 'assistant',
        status: 'sent',
        createdAt: new Date(
          Date.UTC(2026, 2, 15, 12, previous.length),
        ).toISOString(),
        author: demoUsers.agent,
        parts: [
          {
            type: 'text',
            text: `Incoming update ${previous.length + 1}: the virtualized thread still preserves date boundaries and unseen state.`,
          },
        ],
      },
    ]);
  }, []);

  const prependHistory = React.useCallback(() => {
    if (history.length === 0) {
      return;
    }

    setHistory((previousHistory) => {
      const nextChunk = previousHistory.slice(-8);

      setMessages((previousMessages) => [...nextChunk, ...previousMessages]);
      return previousHistory.slice(0, -8);
    });
  }, [history.length]);

  return (
    <Chat.Root
      adapter={adapter}
      conversations={[
        {
          id: 'long-thread',
          title: 'Long support thread',
          subtitle: 'Virtualized timeline with incremental history',
          participants: [demoUsers.you, demoUsers.agent],
          unreadCount: 4,
          readState: 'unread',
        },
      ]}
      defaultActiveConversationId="long-thread"
      messages={messages}
      onMessagesChange={setMessages}
      slotProps={{
        root: {
          style: {
            background: '#ffffff',
            border: '1px solid #d7dee7',
            borderRadius: 24,
            padding: 16,
            display: 'grid',
            gap: 14,
          },
        },
      }}
    >
      <Conversation.Root
        slotProps={{
          root: {
            style: {
              minHeight: 640,
              display: 'grid',
              gridTemplateRows: 'auto minmax(0, 1fr)',
              gap: 14,
            },
          },
        }}
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
          <Conversation.HeaderActions
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            <DemoToolbarButton
              disabled={history.length === 0}
              onClick={prependHistory}
            >
              Load older
            </DemoToolbarButton>
            <DemoToolbarButton onClick={appendIncoming}>
              Append message
            </DemoToolbarButton>
            <DemoToolbarButton
              tone="accent"
              onClick={() => listRef.current?.scrollToBottom()}
            >
              Scroll to latest
            </DemoToolbarButton>
          </Conversation.HeaderActions>
        </Conversation.Header>
        <MessageList.Root
          estimatedItemSize={108}
          onReachTop={prependHistory}
          ref={listRef}
          renderItem={({ id, index }) => (
            <React.Fragment key={id}>
              <Indicators.UnreadMarker
                index={index}
                messageId={id}
                slots={{
                  label: DemoUnreadMarkerLabel,
                  root: DemoUnreadMarkerRoot,
                }}
              />
              <MessageList.DateDivider
                formatDate={formatDayLabel}
                index={index}
                messageId={id}
                slots={{ label: DemoDateDividerLabel, root: DemoDateDividerRoot }}
              />
              <MessageGroup
                index={index}
                messageId={id}
                slots={{ authorName: DemoMessageAuthor, root: DemoMessageGroup }}
              >
                <Message.Root messageId={id} slots={{ root: DemoMessageRoot }}>
                  <Message.Avatar slots={{ root: DemoMessageAvatar }} />
                  <Message.Content slots={{ root: DemoMessageContent }} />
                  <Message.Meta slots={{ root: DemoMessageMeta }} />
                </Message.Root>
              </MessageGroup>
            </React.Fragment>
          )}
          slotProps={{
            root: {
              style: {
                height: 520,
                paddingRight: 8,
              },
            },
          }}
          slots={{ root: DemoMessageListRoot }}
          virtualization
        />
      </Conversation.Root>
    </Chat.Root>
  );
}

```

## Primitive set

The message list surface is built from:

- `MessageList.Root`
- `MessageList.DateDivider`

## `MessageList.Root`

`MessageList.Root` is the structural thread log.
By default it sources row ids from `useMessageIds()`, but you can also pass a custom `items` array when the rendered order needs to differ from the store order.

```tsx
<MessageList.Root
  estimatedItemSize={84}
  renderItem={({ id, index }) => (
    <React.Fragment key={id}>
      <Indicators.UnreadMarker index={index} messageId={id} />
      <MessageList.DateDivider index={index} messageId={id} />
      <MessageGroup index={index} messageId={id} />
    </React.Fragment>
  )}
/>
```

It supports:

- row rendering through `renderItem({ id, index })`
- optional virtualization
- item reordering through the `items` prop
- `onReachTop`
- automatic history loading when the list reaches the top edge
- scroll anchoring when items are prepended
- unseen-message counting while the list is away from the bottom
- `aria-live="polite"` log semantics
- an imperative `scrollToBottom()` handle

Those behaviors make `MessageList.Root` the main place where the unstyled layer turns store-backed thread data into a real scrolling chat log.

## Virtualization and history

Virtualization is useful for long threads, while the non-virtualized mode is useful for simpler layouts and debugging.
When the list reaches the top, `MessageList.Root` can both fire `onReachTop` and trigger history loading through the runtime.

Use virtualization when:

- the thread can grow large
- row heights are reasonably predictable
- the page should avoid rendering every message at once

Use `virtualization={false}` when:

- you want the simplest possible DOM
- the thread is small
- the page is primarily a reference or debugging surface

Because the list owns the history-loading trigger, virtualization and top-loading remain coordinated instead of being split across separate helpers.

## Scroll behavior

The list tracks whether the user is at the bottom of the thread and how many unseen messages have arrived since they moved away from the bottom.
That behavior powers `Indicators.ScrollToBottomAffordance`.

It also preserves the viewport when older messages are prepended, which is important for infinite-scroll chat histories.
Without that anchoring, loading more history would make the thread jump unexpectedly.

### Imperative scroll handle

`MessageList.Root` exposes a `scrollToBottom()` handle through `ref`.
Use that when the surrounding app needs an explicit "jump to latest" action outside the list surface itself.

## `MessageList.DateDivider`

`MessageList.DateDivider` inserts a separator when the current message starts a new calendar day compared to the previous message.

It supports:

- default ISO-day formatting
- custom date formatting through `formatDate`
- slot replacement for root and label

```tsx
<MessageList.DateDivider
  index={index}
  messageId={id}
  formatDate={(date) => date.toLocaleDateString()}
/>
```

The divider only renders when a real day boundary exists.

That makes it safe to keep in the row pipeline for every message without extra filtering logic in app code.

## Recommended patterns

- Use `MessageList.Root` as the single source of truth for thread scrolling behavior.
- Render `MessageList.DateDivider` and `Indicators.UnreadMarker` alongside each row in `renderItem`.
- Keep grouping and row composition inside the message-list render path so ordering, virtualization, and affordances stay aligned.

## Adjacent pages

- Continue with [Messages](/x/react-chat/unstyled/messages/) for the row-level primitives that usually appear inside `renderItem`.
- Continue with [Indicators](/x/react-chat/unstyled/indicators/) for unread and scroll affordances powered by the list.
- Continue with [Virtualized thread](/x/react-chat/unstyled/examples/virtualized-thread/) for the recipe version of this page.
