'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatMessageList,
  ChatMessageGroup,
  ChatComposer,
} from '@mui/x-chat';
import { ChatProvider, useConversations, useChat } from '@mui/x-chat-headless';
import {
  createEchoAdapter,
  syncConversationPreview,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/examples/shared/demoData';
import type {
  ChatConversation as ChatConversationType,
  ChatMessage,
} from '@mui/x-chat-headless';

function CustomSidebar() {
  const conversations = useConversations();
  const { setActiveConversation } = useChat();

  return (
    <List
      dense
      sx={{ width: 200, borderRight: '1px solid', borderColor: 'divider' }}
    >
      {conversations.map((c) => (
        <ListItemButton key={c.id} onClick={() => setActiveConversation(c.id)}>
          {c.title}
        </ListItemButton>
      ))}
    </List>
  );
}

const adapter = createEchoAdapter();

export default function ConversationSidebar() {
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => inboxConversations[0].id,
  );
  const [conversations, setConversations] = React.useState<ChatConversationType[]>(
    () => inboxConversations.map((c) => ({ ...c })),
  );
  const [threads, setThreads] = React.useState<Record<string, ChatMessage[]>>(() =>
    Object.fromEntries(
      Object.entries(inboxThreads).map(([id, msgs]) => [
        id,
        msgs.map((m) => ({ ...m })),
      ]),
    ),
  );

  const messages = threads[activeConversationId] ?? [];

  return (
    <ChatProvider
      adapter={adapter}
      activeConversationId={activeConversationId}
      conversations={conversations}
      messages={messages}
      onActiveConversationChange={(nextId) => {
        if (nextId) {
          setActiveConversationId(nextId);
        }
      }}
      onMessagesChange={(nextMessages) => {
        setThreads((prev) => ({ ...prev, [activeConversationId]: nextMessages }));
        setConversations((prev) =>
          syncConversationPreview(prev, activeConversationId, nextMessages),
        );
      }}
    >
      <Box
        sx={{
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          display: 'flex',
        }}
      >
        <CustomSidebar />
        <ChatConversation sx={{ flex: 1 }}>
          <ChatConversationHeader />
          <ChatMessageList
            renderItem={({ id, index }) => (
              <ChatMessageGroup index={index} messageId={id} />
            )}
          />
          <ChatComposer />
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
}
