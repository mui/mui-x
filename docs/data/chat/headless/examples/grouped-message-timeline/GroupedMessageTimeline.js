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
  const groupKey = React.useMemo(
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
            header: demoSlotProps.conversationHeader,
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
                  group: demoSlotProps.messageGroupRoot,
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
                        meta: (ownerState) => ({
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
