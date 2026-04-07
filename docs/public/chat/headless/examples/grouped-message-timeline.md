---
title: Chat - Grouped message timeline
productId: x-chat
packageName: '@mui/x-chat-headless'
githubLabel: 'scope: chat'
---

# Chat - Grouped message timeline

<p class="description">Use <code>MessageGroup</code> to build an author-grouped message timeline with custom row presentation.</p>

This demo focuses on message presentation rather than the overall application shell.
It shows how to render a thread that visually groups messages by author and time window without manual grouping logic in the page layer.

That makes it a good fit for products where readability and density matter more than showing every message as an isolated card.

- `MessageGroup`
- `groupingWindowMs`
- `Message.Avatar`
- `Message.Content`
- `Message.Meta`
- grouped versus ungrouped owner state

```tsx
import * as React from 'react';
import {
  Chat,
  Conversation,
  Composer,
  Message,
  MessageGroup,
  MessageList,
  createTimeWindowGroupKey,
} from '@mui/x-chat-headless';
import { createEchoAdapter } from 'docsx/data/chat/headless/examples/shared/demoUtils';
import {
  demoUsers,
  groupedTimelineMessages,
} from 'docsx/data/chat/headless/examples/shared/demoData';
import {
  demoLocaleText,
  demoSlotProps,
  DemoToolbarButton,
} from 'docsx/data/chat/headless/examples/shared/DemoPrimitives';

export default function GroupedMessageTimeline() {
  const [windowMs, setWindowMs] = React.useState(5 * 60_000);
  const groupKey = React.useMemo<GroupKeyFn>(
    () => createTimeWindowGroupKey(windowMs),
    [windowMs],
  );
  const adapter = React.useMemo(
    () => createEchoAdapter({ agent: demoUsers.agent }),
    [],
  );

  return (
    <Chat.Root
      adapter={adapter}
      conversations={[
        {
          id: 'timeline',
          title: 'Grouped timeline',
          subtitle: 'Author and time-window grouping',
          participants: [demoUsers.you, demoUsers.alice, demoUsers.agent],
        },
      ]}
      initialActiveConversationId="timeline"
      initialMessages={groupedTimelineMessages}
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
              height: 520,
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
          <div style={{ minWidth: 0 }}>
            <Conversation.Title style={demoSlotProps.conversationTitle} />
            <Conversation.Subtitle style={demoSlotProps.conversationSubtitle} />
          </div>
          <Conversation.HeaderActions style={{ display: 'flex', gap: 8 }}>
            <DemoToolbarButton
              onClick={() => setWindowMs(5 * 60_000)}
              tone={windowMs === 5 * 60_000 ? 'accent' : 'default'}
            >
              5 minute window
            </DemoToolbarButton>
            <DemoToolbarButton
              onClick={() => setWindowMs(12 * 60_000)}
              tone={windowMs === 12 * 60_000 ? 'accent' : 'default'}
            >
              12 minute window
            </DemoToolbarButton>
          </Conversation.HeaderActions>
        </Conversation.Header>
        <MessageList.Root
          estimatedItemSize={96}
          renderItem={({ id, index }) => {
            const isUser =
              groupedTimelineMessages.find((m) => m.id === id)?.role === 'user';

            return (
              <MessageGroup
                groupKey={groupKey}
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
                  {isUser ? (
                    <Message.Meta
                      slotProps={{
                        meta: (ownerState: { role: string }) => ({
                          ...demoSlotProps.messageMeta(ownerState),
                          style: {
                            ...demoSlotProps.messageMeta(ownerState).style,
                            marginBottom: 4,
                          },
                        }),
                      }}
                    />
                  ) : (
                    <Message.Actions
                      slotProps={{
                        actions: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            gridColumn: 2,
                            gridRow: 2,
                            marginBottom: 4,
                          },
                        },
                      }}
                    >
                      <Message.Meta
                        slotProps={{
                          meta: {
                            style: {
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 11,
                              color: '#666666',
                            },
                          },
                        }}
                      />
                      <button
                        type="button"
                        style={{
                          padding: '3px 10px',
                          fontSize: 11,
                          fontWeight: 600,
                          border: '1px solid #bdbdbd',
                          background: '#ffffff',
                          color: '#666666',
                          cursor: 'pointer',
                        }}
                      >
                        Reply
                      </button>
                      <button
                        type="button"
                        style={{
                          padding: '3px 10px',
                          fontSize: 11,
                          fontWeight: 600,
                          border: '1px solid #bdbdbd',
                          background: '#ffffff',
                          color: '#666666',
                          cursor: 'pointer',
                        }}
                      >
                        Pin
                      </button>
                    </Message.Actions>
                  )}
                </Message.Root>
              </MessageGroup>
            );
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

## Key primitives

- `MessageGroup` for first/last grouping decisions
- `Message.Root` for message-level owner state
- `Message.Avatar`, `Message.Content`, and `Message.Meta` for the default row stack
- optional `Message.Actions` when a timeline needs inline actions

## Implementation notes

- Use different timestamps so the grouping window is visible and not just theoretical.
- Show at least one break in author identity and one break in time-window grouping.
- Keep the example centered on message rows, not on conversation selection or thread layout.

## When to use this pattern

Use this pattern when:

- a chat surface needs compact message grouping
- avatar repetition should be reduced
- grouped and ungrouped rows need different styling or spacing

This is especially useful in support timelines, collaboration surfaces, and assistant threads where one participant often sends several messages in a row.

## What to pay attention to

- `MessageGroup` keeps neighbor comparison logic out of the page layer.
- `groupingWindowMs` is a presentation decision, so it belongs near the message row composition rather than in the data model.

## See also

- Continue with [Messages](/x/react-chat/headless/messages/) for the message primitive reference.
- Continue with [Custom message part rendering](/x/react-chat/headless/examples/custom-message-part-rendering/) when the row structure is correct but certain part types need a custom presentation.

## API

- [ChatRoot](/x/api/chat/chat-root/)
