import * as React from 'react';
import {
  Chat,
  Message,
  MessageGroup,
  MessageList,
  Thread,
} from '@mui/x-chat-unstyled';
import { createEchoAdapter } from '../shared/demoUtils';
import { demoUsers, groupedTimelineMessages } from '../shared/demoData';
import {
  DemoMessageAuthor,
  DemoMessageAvatar,
  DemoMessageContent,
  DemoMessageGroup,
  DemoMessageMeta,
  DemoMessageRoot,
  DemoThreadHeader,
  DemoToolbarButton,
} from '../shared/DemoPrimitives';

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
      <Thread.Root
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
        <Thread.Header slots={{ root: DemoThreadHeader }}>
          <div style={{ minWidth: 0 }}>
            <Thread.Title style={{ fontSize: 18, fontWeight: 800 }} />
            <Thread.Subtitle
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
          <Thread.Actions style={{ display: 'flex', gap: 8 }}>
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
          </Thread.Actions>
        </Thread.Header>
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
          virtualization={false}
        />
      </Thread.Root>
    </Chat.Root>
  );
}
