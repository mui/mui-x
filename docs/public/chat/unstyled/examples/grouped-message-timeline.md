---
title: Chat - Grouped message timeline
productId: x-chat
packageName: '@mui/x-chat-unstyled'
---

# Grouped message timeline

<p class="description">Use <code>MessageGroup</code> to build an author-grouped message timeline with custom row presentation.</p>

This recipe focuses on message presentation rather than the overall application shell.
It shows how to render a thread that visually groups messages by author and time window without manual grouping logic in the page layer.

That makes it a good fit for products where readability and density matter more than showing every message as an isolated card.

```tsx
import * as React from 'react';
import {
  Chat,
  Conversation,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat-unstyled';
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

## What it shows

- `MessageGroup`
- `groupingWindowMs`
- `Message.Avatar`
- `Message.Content`
- `Message.Meta`
- grouped versus ungrouped owner state

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

Use this recipe when:

- a chat surface needs compact message grouping
- avatar repetition should be reduced
- grouped and ungrouped rows need different styling or spacing

This is especially useful in support timelines, collaboration surfaces, and assistant threads where one participant often sends several messages in a row.

## What to pay attention to

- `MessageGroup` keeps neighbor comparison logic out of the page layer.
- `groupingWindowMs` is a presentation decision, so it belongs near the message row composition rather than in the data model.

## Next steps

- Continue with [Messages](/x/react-chat/unstyled/messages/) for the message primitive reference.
- Continue with [Custom message part rendering](/x/react-chat/unstyled/examples/custom-message-part-rendering/) when the row structure is correct but certain part types need a custom presentation.
