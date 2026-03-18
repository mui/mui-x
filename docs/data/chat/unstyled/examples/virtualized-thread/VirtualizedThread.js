import * as React from 'react';
import {
  Chat,
  Conversation,
  Indicators,
  Message,
  MessageGroup,
  MessageList,
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
  const listRef = React.useRef(null);
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
