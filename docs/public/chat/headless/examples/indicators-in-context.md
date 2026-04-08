---
title: Chat - Indicators in context
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Indicators in context

Place typing, unread, and scroll indicators into a real thread layout instead of documenting them in isolation.

This demo shows that indicators are structural affordances, not floating utilities.
Their value is clearest when they are rendered exactly where the thread layout expects them.

That is why this page keeps them inside a realistic thread rather than presenting them as isolated widgets.

- `Indicators.TypingIndicator`
- `Indicators.UnreadMarker`
- `Indicators.ScrollToBottomAffordance`
- thread header placement
- message-list row placement

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
} from '@mui/x-chat/headless';
import {
  createEchoAdapter,
  cloneMessages,
} from 'docsx/data/chat/headless/examples/shared/demoUtils';
import {
  createLongThreadMessages,
  demoUsers,
} from 'docsx/data/chat/headless/examples/shared/demoData';
import {
  demoLocaleText,
  demoMessageListSlotProps,
  demoSlotProps,
  DemoScrollToBottomOverlay,
  DemoToolbarButton,
} from 'docsx/data/chat/headless/examples/shared/DemoPrimitives';

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
    readState: 'unread' as 'read' | 'unread',
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
      initialActiveConversationId="indicators"
      messages={messages}
      onMessagesChange={setMessages as any}
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
            header: demoSlotProps.conversationHeader as any,
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
                setConversation(
                  (previous) =>
                    ({
                      ...previous,
                      unreadCount: 0,
                      readState: 'read',
                    }) as any,
                )
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
                  divider: demoSlotProps.dateDividerRoot as any,
                  label: demoSlotProps.dateDividerLabel,
                }}
              />
              <MessageGroup
                index={index}
                messageId={id}
                slotProps={{
                  group: demoSlotProps.messageGroupRoot as any,
                  authorName: demoSlotProps.messageGroupAuthorName as any,
                }}
              >
                <Message.Root
                  messageId={id}
                  slotProps={{
                    root: demoSlotProps.messageRoot as any,
                  }}
                >
                  <Message.Avatar
                    slotProps={{
                      avatar: demoSlotProps.messageAvatar as any,
                      image: demoSlotProps.messageAvatarImage,
                    }}
                  />
                  <Message.Content
                    slotProps={{
                      bubble: demoSlotProps.messageBubble as any,
                    }}
                  />
                  <Message.Meta
                    slotProps={{
                      meta: demoSlotProps.messageMeta as any,
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
              input: demoSlotProps.composerTextArea as any,
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

## Key primitives

- `Indicators.TypingIndicator` near the thread header or composer
- `Indicators.UnreadMarker` inside the message row pipeline
- `Indicators.ScrollToBottomAffordance` inside a message-list-aware container
- `MessageList.Root` as the source of unseen-message and scroll state

## Implementation notes

- Keep the example tied to a real thread so the placement rules are obvious.
- Show unread and typing state at the same time so the reader can see that the indicators solve different problems.
- Keep the layout realistic enough to justify the scroll affordance rather than presenting it as an isolated button.

## When to use this pattern

Use this pattern when:

- the thread needs a visible unread boundary
- typing activity should be surfaced inline
- the scroll position is no longer always pinned to the latest message

This pattern is common in shared support queues, collaborative assistant surfaces, and any thread where users routinely scroll away from the newest message.

## What to pay attention to

- `TypingIndicator` belongs near thread-level context such as the header or composer area.
- `UnreadMarker` belongs in the row pipeline because it marks a message boundary, not a global thread status.
- `ScrollToBottomAffordance` depends on message-list state, so it is easiest to reason about when it stays inside a message-list-aware container.

## See also

- Continue with [Indicators](/x/react-chat/headless/indicators/) for the reference page.

## API

- [ChatRoot](/x/api/chat/chat-root/)
