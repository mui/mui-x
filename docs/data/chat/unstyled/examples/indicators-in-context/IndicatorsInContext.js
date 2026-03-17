import * as React from 'react';

import {
  Chat,
  Indicators,
  Message,
  MessageGroup,
  MessageList,
  Thread,
} from '@mui/x-chat-unstyled';
import { createEchoAdapter, cloneMessages } from '../shared/demoUtils';
import { createLongThreadMessages, demoUsers } from '../shared/demoData';
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
  DemoTypingIndicator,
  DemoUnreadMarkerLabel,
  DemoUnreadMarkerRoot,
} from '../shared/DemoPrimitives';

function createRealtimeController() {
  let emit = null;

  return {
    adapter: {
      ...createEchoAdapter({ agent: demoUsers.agent }),
      subscribe({ onEvent }) {
        emit = onEvent;
        return () => {
          emit = null;
        };
      },
    },
    push(event) {
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
    readState: 'unread',
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
              minHeight: 640,
              display: 'grid',
              gridTemplateRows: 'auto minmax(0, 1fr)',
              gap: 14,
            },
          },
        }}
      >
        <Thread.Header slots={{ root: DemoThreadHeader }}>
          <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
            <div>
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
            <Indicators.TypingIndicator slots={{ root: DemoTypingIndicator }} />
          </div>
          <Thread.Actions style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
          </Thread.Actions>
        </Thread.Header>
        <MessageList.Root
          estimatedItemSize={108}
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
                formatDate={(date) =>
                  new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                  }).format(date)
                }
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
          virtualization={false}
        />
      </Thread.Root>
    </Chat.Root>
  );
}
