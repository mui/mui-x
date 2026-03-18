import * as React from 'react';
import {
  Chat,
  Conversation,
  ConversationInput,
  ConversationList,
  Message,
  MessageGroup,
  MessageList,
} from '@mui/x-chat-unstyled';
import { createEchoAdapter } from 'docsx/data/chat/unstyled/examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from 'docsx/data/chat/unstyled/examples/shared/demoData';
import {
  DemoComposerButton,
  DemoComposerInput,
  DemoComposerRoot,
  DemoConversationItem,
  DemoConversationItemAvatar,
  DemoConversationPreview,
  DemoConversationTimestamp,
  DemoConversationTitle,
  DemoConversationUnreadBadge,
  DemoMessageAuthor,
  DemoMessageAvatar,
  DemoMessageContent,
  DemoMessageGroup,
  DemoMessageMeta,
  DemoMessageRoot,
  DemoThreadHeader,
  demoSurfaceStyles,
} from 'docsx/data/chat/unstyled/examples/shared/DemoPrimitives';

const adapter = createEchoAdapter();

export default function MinimalUnstyledShell() {
  return (
    <Chat.Root
      adapter={adapter}
      defaultActiveConversationId={minimalConversation.id}
      defaultConversations={[minimalConversation]}
      defaultMessages={minimalMessages}
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
          slotProps={{ root: { style: demoSurfaceStyles.conversationList } }}
          slots={{
            item: DemoConversationItem,
            itemAvatar: DemoConversationItemAvatar,
            preview: DemoConversationPreview,
            timestamp: DemoConversationTimestamp,
            title: DemoConversationTitle,
            unreadBadge: DemoConversationUnreadBadge,
          }}
        />
        <Conversation.Root
          slotProps={{ root: { style: demoSurfaceStyles.threadRoot } }}
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
          </Conversation.Header>
          <MessageList.Root
            estimatedItemSize={90}
            renderItem={({ id, index }) => (
              <MessageGroup
                index={index}
                key={id}
                messageId={id}
                slotProps={{ authorName: { style: { marginLeft: 42 } } }}
                slots={{ authorName: DemoMessageAuthor, root: DemoMessageGroup }}
              >
                <Message.Root messageId={id} slots={{ root: DemoMessageRoot }}>
                  <Message.Avatar slots={{ root: DemoMessageAvatar }} />
                  <Message.Content slots={{ root: DemoMessageContent }} />
                  <Message.Meta slots={{ root: DemoMessageMeta }} />
                </Message.Root>
              </MessageGroup>
            )}
            style={{ minHeight: 0 }}
            virtualization={false}
          />
          <ConversationInput.Root slots={{ root: DemoComposerRoot }}>
            <ConversationInput.TextArea
              aria-label="Message"
              placeholder="Ask the starter thread a question"
              slots={{ root: DemoComposerInput }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ConversationInput.SendButton
                data-variant="primary"
                slots={{ root: DemoComposerButton }}
              >
                Send
              </ConversationInput.SendButton>
            </div>
          </ConversationInput.Root>
        </Conversation.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
