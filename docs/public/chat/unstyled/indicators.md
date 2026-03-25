---
productId: x-chat
title: Chat - Unstyled indicators
packageName: '@mui/x-chat/unstyled'
components: TypingIndicator, UnreadMarker, ScrollToBottomAffordance
githubLabel: 'scope: chat'
---

# Chat - Unstyled indicators

Use shared structural affordances for typing, unread boundaries, and scroll-to-bottom behavior.



```tsx
import * as React from 'react';
import type { ChatAdapter, ChatRealtimeEvent } from '@mui/x-chat/headless';
import {
  Chat,
  Conversation,
  Composer,
  Indicators,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat/unstyled';
import {
  createEchoAdapter,
  cloneMessages,
} from 'docsx/data/chat/unstyled/examples/shared/demoUtils';
import {
  createLongThreadMessages,
  demoUsers,
} from 'docsx/data/chat/unstyled/examples/shared/demoData';
import {
  demoLocaleText,
  demoMessageListSlotProps,
  demoSlotProps,
  DemoScrollToBottomOverlay,
  DemoToolbarButton,
} from 'docsx/data/chat/unstyled/examples/shared/DemoPrimitives';

function createRealtimeController() {
  let emit: ((event: ChatRealtimeEvent) => void) | null = null;

  return {
    adapter: {
      ...createEchoAdapter({ agent: demoUsers.agent }),
      subscribe({ onEvent }) {
        emit = onEvent;
        return () => {
          emit = null;
        };
      },
    } satisfies ChatAdapter,
    push(event: ChatRealtimeEvent) {
      emit?.(event);
    },
  };
}

const seedMessages = cloneMessages(
  createLongThreadMessages('indicators').slice(-14),
);

export default function IndicatorsInContext() {
  const controller = React.useMemo(() => createRealtimeController(), []);
  const [messages, setMessages] = React.useState(seedMessages);
  const [conversation, setConversation] = React.useState({
    id: 'indicators',
    title: 'Indicator thread',
    subtitle: 'Typing, unread boundaries, and scroll state',
    participants: [demoUsers.you, demoUsers.alice, demoUsers.agent],
    unreadCount: 3,
    readState: 'unread' as const,
  });

  const triggerTyping = React.useCallback(() => {
    controller.push({
      type: 'typing',
      conversationId: 'indicators',
      userId: demoUsers.alice.id,
      isTyping: true,
    });

    setTimeout(() => {
      controller.push({
        type: 'typing',
        conversationId: 'indicators',
        userId: demoUsers.alice.id,
        isTyping: false,
      });
    }, 1500);
  }, [controller]);

  const appendIncoming = React.useCallback(() => {
    setMessages((previous) => [
      ...previous,
      {
        id: `indicators-live-${previous.length + 1}`,
        conversationId: 'indicators',
        role: 'assistant',
        status: 'sent',
        author: demoUsers.alice,
        createdAt: new Date(
          Date.UTC(2026, 2, 15, 12, previous.length),
        ).toISOString(),
        parts: [
          {
            type: 'text',
            text: 'New activity arrived while the reader was away from the bottom of the list.',
          },
        ],
      },
    ]);
    setConversation((previous) => ({
      ...previous,
      unreadCount: previous.unreadCount + 1,
      readState: 'unread',
    }));
  }, []);

  return (
    <Chat.Root
      adapter={controller.adapter}
      conversations={[conversation]}
      defaultActiveConversationId="indicators"
      messages={messages}
      onMessagesChange={setMessages}
      localeText={demoLocaleText}
      slotProps={{
        root: {
          style: {
            background: '#ffffff',
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
              height: 640,
              display: 'grid',
              gridTemplateRows: 'auto minmax(0, 1fr) auto',
              gap: 14,
            },
          },
        }}
      >
        <Conversation.Header
          slotProps={{
            root: demoSlotProps.conversationHeader,
          }}
        >
          <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
            <div>
              <Conversation.Title style={demoSlotProps.conversationTitle} />
              <Conversation.Subtitle style={demoSlotProps.conversationSubtitle} />
            </div>
            <Indicators.TypingIndicator
              slotProps={{
                root: {
                  style: {
                    background: '#fafafa',
                    color: '#2e7d32',
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                  },
                },
              }}
            />
          </div>
          <Conversation.HeaderActions
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            <DemoToolbarButton onClick={triggerTyping}>
              Show typing
            </DemoToolbarButton>
            <DemoToolbarButton onClick={appendIncoming}>
              Append incoming
            </DemoToolbarButton>
            <DemoToolbarButton
              tone="accent"
              onClick={() =>
                setConversation((previous) => ({
                  ...previous,
                  unreadCount: 0,
                  readState: 'read',
                }))
              }
            >
              Mark read
            </DemoToolbarButton>
          </Conversation.HeaderActions>
        </Conversation.Header>
        <MessageList.Root
          estimatedItemSize={108}
          renderItem={({ id, index }) => (
            <React.Fragment key={id}>
              <Indicators.UnreadMarker
                index={index}
                messageId={id}
                slotProps={{
                  root: demoSlotProps.unreadMarkerRoot,
                  label: demoSlotProps.unreadMarkerLabel,
                }}
              />
              <MessageList.DateDivider
                formatDate={(date) =>
                  new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                  }).format(date)
                }
                index={index}
                messageId={id}
                slotProps={{
                  root: demoSlotProps.dateDividerRoot,
                  label: demoSlotProps.dateDividerLabel,
                }}
              />
              <MessageGroup
                index={index}
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
            </React.Fragment>
          )}
          overlay={<DemoScrollToBottomOverlay />}
          slotProps={{
            ...demoMessageListSlotProps,
          }}
        />
        <Composer.Root
          slotProps={{
            root: demoSlotProps.composerRoot,
          }}
        >
          <Composer.TextArea
            aria-label="Message"
            placeholder="Type a message"
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
    </Chat.Root>
  );
}

```

## Primitive set

The indicator group is built from:

- `Indicators.TypingIndicator`
- `Indicators.UnreadMarker`
- `Indicators.ScrollToBottomAffordance`

These primitives are small, but they encode thread-specific semantics that are easy to get wrong when rebuilt from scratch.

## `TypingIndicator`

`TypingIndicator` reads typing state for the active conversation and resolves display names from:

- conversation participants
- message authors already present in the thread
- raw user ids when no richer user data is available

It renders a polite live region and shows labels such as:

- `Alice is typing`
- `Alice, Bob are typing`

### Typical placement

```tsx
import { Indicators, Conversation } from '@mui/x-chat/unstyled';

<Conversation.Header>
  <Conversation.Title />
  <Conversation.Subtitle />
  <Indicators.TypingIndicator />
</Conversation.Header>;
```

Use it in the thread header or just above the composer when typing feedback should stay close to the active draft area.

## `UnreadMarker`

`UnreadMarker` inserts a structural boundary into the message flow.

The unread boundary is derived from the active conversation state:

- `conversation.unreadCount`
- `conversation.readState`

The component renders only for the row that starts the unread region and applies `role="separator"` so the boundary stays meaningful to assistive technology.

### Typical placement

```tsx
<MessageList.Root
  renderItem={({ id, index }) => (
    <React.Fragment>
      <Indicators.UnreadMarker index={index} messageId={id} />
      <MessageGroup index={index} messageId={id} />
    </React.Fragment>
  )}
/>
```

You can replace both the separator root and the label through slots.

## `ScrollToBottomAffordance`

`ScrollToBottomAffordance` consumes message-list context and appears only when the user is away from the bottom of the thread.

It supports:

- scroll-to-bottom action wiring
- unseen-message count badges
- an `aria-label` that includes the unseen count when present

The primitive expects to live inside the `MessageList.Root` context, usually in a custom message-list root slot or another descendant of the list surface.

### Typical placement

```tsx
function MessageListShell(props) {
  return (
    <div {...props}>
      {props.children}
      <Indicators.ScrollToBottomAffordance />
    </div>
  );
}
```

When the user is already at the bottom of the thread, the affordance returns `null`.

## Slots and owner state

The indicator primitives expose the following slot surfaces:

- `TypingIndicator`: `root`
- `UnreadMarker`: `root`, `label`
- `ScrollToBottomAffordance`: `root`, `badge`

Custom slots receive owner state such as:

- resolved typing users and count
- unread-boundary presence and label
- unseen-message count and `isAtBottom`

That makes it straightforward to map the indicators into an existing design system without rewriting the underlying behavior.

## See also

- Continue with [Message list](/x/react-chat/unstyled/message-list/) for the list context that powers unread boundaries and scroll affordances.
- Continue with [Thread](/x/react-chat/unstyled/thread/) for header composition patterns.
- Continue with [Indicators in context](/x/react-chat/unstyled/examples/indicators-in-context/) for the recipe version of these primitives.
