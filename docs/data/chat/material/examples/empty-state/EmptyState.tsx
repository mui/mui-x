'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter, randomId } from '../shared/demoUtils';
import { demoUsers } from '../shared/demoData';

const demoMembers = [demoUsers.you, demoUsers.agent];

const adapter = createEchoAdapter();

const emptyConversation = {
  id: randomId(),
  title: 'New conversation',
  subtitle: 'Start a new conversation',
  participants: [],
  readState: 'read' as const,
  unreadCount: 0,
  lastMessageAt: new Date().toISOString(),
};

export default function EmptyState() {
  return (
    <ChatBox
      adapter={adapter}
      members={demoMembers}
      defaultActiveConversationId={emptyConversation.id}
      defaultConversations={[emptyConversation]}
      defaultMessages={[]}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
