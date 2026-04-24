import * as React from 'react';
import {
  Chat,
  Conversation,
  Composer,
  ConversationList,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/headless/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/headless/examples/shared/demoData';
import {
  demoLocaleText,
  demoSlotProps,
  demoSurfaceStyles,
} from 'docs/data/chat/headless/examples/shared/DemoPrimitives';

const adapter = createEchoAdapter();

export default function MinimalUnstyledShell() {
  return (
    <Chat.Root
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      localeText={demoLocaleText}
      slotProps={{ root: { style: demoSurfaceStyles.chatRoot } }}
    >
      <Chat.Layout
        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr' }}
        slotProps={{
          root: { style: demoSurfaceStyles.layout },
          conversationsPane: { style: demoSurfaceStyles.conversationsPane },
          threadPane: {
            style: {
              ...demoSurfaceStyles.threadPane,
              gridTemplateRows: 'minmax(0, 1fr)',
            },
          },
        }}
      >
        <ConversationList.Root
          aria-label="Starter threads"
          slotProps={{
            root: { style: demoSurfaceStyles.conversationList },
            item: demoSlotProps.conversationListItem,
            itemAvatar: demoSlotProps.conversationListItemAvatar,
            itemContent: demoSlotProps.conversationListItemContent,
            title: demoSlotProps.conversationListTitle,
            preview: demoSlotProps.conversationListPreview,
            timestamp: demoSlotProps.conversationListTimestamp,
            unreadBadge: demoSlotProps.conversationListUnreadBadge,
          }}
        />
        <Conversation.Root
          slotProps={{ root: { style: demoSurfaceStyles.threadRoot } }}
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
          </Conversation.Header>
          <MessageList.Root
            estimatedItemSize={90}
            renderItem={({ id, index }) => (
              <MessageGroup
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
                  <Message.Meta
                    slotProps={{
                      meta: demoSlotProps.messageMeta,
                    }}
                  />
                </Message.Root>
              </MessageGroup>
            )}
          />
          <Composer.Root
            slotProps={{
              root: demoSlotProps.composerRoot,
            }}
          >
            <Composer.TextArea
              aria-label="Message"
              placeholder="Ask the starter thread a question"
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
      </Chat.Layout>
    </Chat.Root>
  );
}
