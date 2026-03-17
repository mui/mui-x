import * as React from 'react';
import {
  Chat,
  Composer,
  ConversationList,
  Message,
  MessageGroup,
  MessageList,
  Thread,
} from '@mui/x-chat-unstyled';
import { createEchoAdapter } from '../shared/demoUtils';
import { minimalConversation, minimalMessages } from '../shared/demoData';
import {
  DemoComposerButton,
  DemoComposerInput,
  DemoComposerRoot,
  DemoConversationItem,
  DemoConversationItemAvatar,
  DemoConversationItemMeta,
  DemoConversationItemText,
  DemoMessageAuthor,
  DemoMessageAvatar,
  DemoMessageContent,
  DemoMessageGroup,
  DemoMessageMeta,
  DemoMessageRoot,
  DemoThreadHeader,
  demoSurfaceStyles,
} from '../shared/DemoPrimitives';

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
            itemMeta: DemoConversationItemMeta,
            itemText: DemoConversationItemText,
          }}
        />
        <Thread.Root slotProps={{ root: { style: demoSurfaceStyles.threadRoot } }}>
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
          </Thread.Header>
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
          <Composer.Root slots={{ root: DemoComposerRoot }}>
            <Composer.Input
              aria-label="Message"
              placeholder="Ask the starter thread a question"
              slots={{ root: DemoComposerInput }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Composer.SendButton
                data-variant="primary"
                slots={{ root: DemoComposerButton }}
              >
                Send
              </Composer.SendButton>
            </div>
          </Composer.Root>
        </Thread.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
