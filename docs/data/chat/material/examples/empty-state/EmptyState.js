'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/examples/shared/demoData';

const demoMembers = [demoUsers.you, demoUsers.agent];

const adapter = createEchoAdapter();

const emptyConversation = {
  id: 'empty-conv',
  title: 'New conversation',
  subtitle: 'Start a new conversation',
  participants: [],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T10:00:00.000Z',
};

export default function EmptyState() {
  return (
    <ChatBox
      adapter={adapter}
      members={demoMembers}
      initialActiveConversationId={emptyConversation.id}
      initialConversations={[emptyConversation]}
      initialMessages={[]}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
