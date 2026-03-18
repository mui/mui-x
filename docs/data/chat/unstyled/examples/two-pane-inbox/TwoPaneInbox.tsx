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
import {
  createEchoAdapter,
  cloneConversations,
  cloneThreadMap,
  syncConversationPreview,
} from '../shared/demoUtils';
import { demoUsers, inboxConversations, inboxThreads } from '../shared/demoData';
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
  DemoToolbarButton,
  demoSurfaceStyles,
} from '../shared/DemoPrimitives';

export default function TwoPaneInbox() {
  const [activeConversationId, setActiveConversationId] = React.useState('triage');
  const [conversations, setConversations] = React.useState(() =>
    cloneConversations(inboxConversations),
  );
  const [threads, setThreads] = React.useState(() => cloneThreadMap(inboxThreads));

  const adapter = React.useMemo(
    () =>
      createEchoAdapter({
        agent: demoUsers.agent,
        respond: (text) =>
          `Inbox reply: ${text}. This thread keeps the default two-pane composition while each pane stays independently customizable.`,
      }),
    [],
  );

  const activeMessages = threads[activeConversationId] ?? [];

  return (
    <Chat.Root
      activeConversationId={activeConversationId}
      adapter={adapter}
      conversations={conversations}
      messages={activeMessages}
      onActiveConversationChange={(nextConversationId) => {
        if (nextConversationId) {
          setActiveConversationId(nextConversationId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((previous) => ({
          ...previous,
          [activeConversationId]: nextMessages,
        }));
        setConversations((previous) =>
          syncConversationPreview(previous, activeConversationId, nextMessages),
        );
      }}
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
        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#10263d' }}>
              Inbox
            </div>
            <div style={{ fontSize: 13, color: '#5c6b7c', marginTop: 4 }}>
              Conversation selection, keyboard navigation, and focus restore all stay
              inside the unstyled list.
            </div>
          </div>
          <ConversationList.Root
            aria-label="Inbox threads"
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
        </div>
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
            <Conversation.HeaderActions style={{ display: 'flex', gap: 8 }}>
              <DemoToolbarButton
                onClick={() =>
                  setConversations((previous) =>
                    previous.map((conversation) =>
                      conversation.id === activeConversationId
                        ? { ...conversation, unreadCount: 0, readState: 'read' }
                        : conversation,
                    ),
                  )
                }
              >
                Mark read
              </DemoToolbarButton>
              <DemoToolbarButton tone="accent">Escalate</DemoToolbarButton>
            </Conversation.HeaderActions>
          </Conversation.Header>
          <MessageList.Root
            estimatedItemSize={96}
            renderItem={({ id, index }) => (
              <MessageGroup
                index={index}
                key={id}
                messageId={id}
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
              aria-label="Reply"
              placeholder="Reply in the active thread"
              slots={{ root: DemoComposerInput }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ConversationInput.SendButton
                data-variant="primary"
                slots={{ root: DemoComposerButton }}
              >
                Send reply
              </ConversationInput.SendButton>
            </div>
          </ConversationInput.Root>
        </Conversation.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
