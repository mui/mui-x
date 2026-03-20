import * as React from 'react';

import {
  Chat,
  Conversation,
  ConversationInput,
  Indicators,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat-unstyled';
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
        <ConversationInput.Root
          slotProps={{
            root: demoSlotProps.conversationInputRoot,
          }}
        >
          <ConversationInput.TextArea
            aria-label="Message"
            placeholder="Type a message"
            slotProps={{
              input: demoSlotProps.conversationInputTextArea,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ConversationInput.SendButton
              data-variant="primary"
              slotProps={{
                sendButton: demoSlotProps.conversationInputSendButton,
              }}
            >
              Send
            </ConversationInput.SendButton>
          </div>
        </ConversationInput.Root>
      </Conversation.Root>
    </Chat.Root>
  );
}
