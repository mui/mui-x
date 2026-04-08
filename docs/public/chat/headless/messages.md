---
productId: x-chat
title: Chat - Headless messages
packageName: '@mui/x-chat/headless'
components: MessageRoot, MessageAvatar, MessageAuthorLabel, MessageContent, MessageMeta, MessageActions, MessageGroup, MessageListDateDivider
githubLabel: 'scope: chat'
---

# Chat - Headless messages

Compose thread rows from message grouping primitives, message subparts, and default message-part renderers.

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
} from '@mui/x-chat/headless';
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

## Primitive set

The message surface is built from:

- `MessageGroup`
- `Message.Root`
- `Message.Avatar`
- `Message.Content`
- `Message.Meta`
- `Message.Actions`

## `MessageGroup`

`MessageGroup` is the default row-level composition helper for threaded chats.
It derives the previous and next message, then decides whether the current message starts or ends a visual group.

```tsx
<MessageGroup groupingWindowMs={300_000} index={index} messageId={id} />
```

Grouping is based on:

- author identity
- author role fallback when no explicit author id exists
- an adjustable grouping window in milliseconds

This gives you `isFirst` and `isLast` grouping state without manual row bookkeeping.

That is especially useful when the thread mixes authored messages, assistant responses, and sparse metadata.
The grouping rules stay close to the row composition instead of leaking into application code.

## `Message.Root`

`Message.Root` resolves a message by id and exposes owner state such as:

- `role`
- `status`
- `streaming`
- `error`
- `isGrouped`

That owner state powers slot-based styling for user versus assistant messages, streaming states, and grouped rows.

`Message.Root` is the main bridge between state-driven message identity and the leaf subparts that render avatars, message bodies, metadata, and actions.

## Default row stack

The most common message composition inside a group is:

- `Message.Avatar`
- `Message.Content`
- `Message.Meta`
- optional `Message.Actions`

`MessageGroup` can render this default stack for you, or you can provide custom children for a different row layout.

```tsx
<MessageGroup index={index} messageId={id}>
  <Message.Root messageId={id}>
    <Message.Avatar />
    <Message.Content />
    <Message.Meta />
    <Message.Actions />
  </Message.Root>
</MessageGroup>
```

This pattern keeps grouping logic and row layout close together while still allowing subpart-level slot replacement.

## Default message-part renderers

The headless package also exports helpers for common message parts:

- `getDefaultMessagePartRenderer()`
- `renderDefaultTextPart()`
- `renderDefaultReasoningPart()`
- `renderDefaultToolPart()`
- `renderDefaultDynamicToolPart()`
- `renderDefaultFilePart()`
- `renderDefaultSourceUrlPart()`
- `renderDefaultSourceDocumentPart()`
- `renderDefaultStepStartPart()`
- `renderDefaultDataPart()`

Use these helpers when you want to keep the default rendering for most part types and selectively replace only one or two.

```tsx
function renderPart(part: ChatMessagePart, message: ChatMessage, index: number) {
  if (part.type === 'reasoning') {
    return <CustomReasoningPanel part={part} />;
  }

  const renderer = getDefaultMessagePartRenderer(part);

  return renderer ? renderer({ part, message, index }) : null;
}
```

The helpers cover text, reasoning, tool parts, files, sources, step boundaries, and `data-*` parts.
That makes them a good fit for progressive customization instead of full renderer rewrites.

## When to replace message rendering

Use the default helpers when:

- the structural message model is correct
- only certain part types need a custom presentation

Rebuild more of the message surface when:

- the row layout is completely different
- message actions need a different placement model
- grouped and ungrouped messages need distinct markup

## See also

- Continue with [Message list](/x/react-chat/headless/message-list/) for ordering, date boundaries, and thread scrolling behavior.
- Continue with [Customization](/x/react-chat/headless/customization/) for slot replacement patterns on message rows and subparts.
- Continue with [Custom message part rendering](/x/react-chat/headless/examples/custom-message-part-rendering/) for the demo version of selective renderer replacement.

## API

- [MessageRoot](/x/api/chat/message-root/)
- [MessageGroup](/x/api/chat/message-group/)
- [MessageContent](/x/api/chat/message-content/)
- [MessageAvatar](/x/api/chat/message-avatar/)
- [MessageMeta](/x/api/chat/message-meta/)
- [MessageAuthorLabel](/x/api/chat/message-author-label/)
- [MessageActions](/x/api/chat/message-actions/)
- [MessageListDateDivider](/x/api/chat/message-list-date-divider/)
