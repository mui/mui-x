---
productId: x-chat
title: Chat - Unstyled messages
packageName: '@mui/x-chat/unstyled'
components: MessageRoot, MessageAvatar, MessageContent, MessageMeta, MessageActions, MessageGroup, MessageListDateDivider
---

# Unstyled messages

Compose thread rows from message grouping primitives, message subparts, and default message-part renderers.

```tsx
import * as React from 'react';
import {
  Chat,
  Conversation,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat/unstyled';
import { createEchoAdapter } from 'docsx/data/chat/unstyled/examples/shared/demoUtils';
import {
  demoUsers,
  groupedTimelineMessages,
} from 'docsx/data/chat/unstyled/examples/shared/demoData';
import {
  DemoMessageAuthor,
  DemoMessageAvatar,
  DemoMessageContent,
  DemoMessageGroup,
  DemoMessageMeta,
  DemoMessageRoot,
  DemoThreadHeader,
  DemoToolbarButton,
} from 'docsx/data/chat/unstyled/examples/shared/DemoPrimitives';

export default function GroupedMessageTimeline() {
  const [groupingWindowMs, setGroupingWindowMs] = React.useState(5 * 60_000);
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
      defaultActiveConversationId="timeline"
      defaultMessages={groupedTimelineMessages}
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
              minHeight: 520,
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
          <Conversation.HeaderActions style={{ display: 'flex', gap: 8 }}>
            <DemoToolbarButton
              onClick={() => setGroupingWindowMs(5 * 60_000)}
              tone={groupingWindowMs === 5 * 60_000 ? 'accent' : 'default'}
            >
              5 minute window
            </DemoToolbarButton>
            <DemoToolbarButton
              onClick={() => setGroupingWindowMs(12 * 60_000)}
              tone={groupingWindowMs === 12 * 60_000 ? 'accent' : 'default'}
            >
              12 minute window
            </DemoToolbarButton>
          </Conversation.HeaderActions>
        </Conversation.Header>
        <MessageList.Root
          estimatedItemSize={96}
          renderItem={({ id, index }) => (
            <MessageGroup
              groupingWindowMs={groupingWindowMs}
              index={index}
              key={id}
              messageId={id}
              slots={{ authorName: DemoMessageAuthor, root: DemoMessageGroup }}
            >
              <Message.Root messageId={id} slots={{ root: DemoMessageRoot }}>
                <Message.Avatar slots={{ root: DemoMessageAvatar }} />
                <Message.Content slots={{ root: DemoMessageContent }} />
                <Message.Meta slots={{ root: DemoMessageMeta }} />
                <Message.Actions
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginTop: 4,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    type="button"
                    style={{
                      borderRadius: 999,
                      padding: '4px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      border: '1px solid #b8c7d7',
                      background: '#ffffff',
                      color: '#5c6b7c',
                      cursor: 'pointer',
                    }}
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    style={{
                      borderRadius: 999,
                      padding: '4px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      border: '1px solid #b8c7d7',
                      background: '#ffffff',
                      color: '#5c6b7c',
                      cursor: 'pointer',
                    }}
                  >
                    Pin
                  </button>
                </Message.Actions>
              </Message.Root>
            </MessageGroup>
          )}
          style={{ minHeight: 0 }}
        />
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

The unstyled package also exports helpers for common message parts:

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

## Adjacent pages

- Continue with [Message list](/x/react-chat/unstyled/message-list/) for ordering, date boundaries, and thread scrolling behavior.
- Continue with [Customization](/x/react-chat/unstyled/customization/) for slot replacement patterns on message rows and subparts.
- Continue with [Custom message part rendering](/x/react-chat/unstyled/examples/custom-message-part-rendering/) for the recipe version of selective renderer replacement.
