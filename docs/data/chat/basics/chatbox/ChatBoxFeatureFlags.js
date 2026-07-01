'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';

import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docs/data/chat/core/examples/shared/demoData';

const CONVERSATION_ID = 'feature-flags-conv';

const adapter = createEchoAdapter();

const conversations = [
  {
    id: CONVERSATION_ID,
    title: 'Feature flags',
    subtitle: 'dateDivider + unreadMarker enabled',
    participants: [demoUsers.you, demoUsers.agent],
    readState: 'unread',
    unreadCount: 2,
    lastMessageAt: '2026-03-15T09:01:00.000Z',
  },
];

// The unread marker derives its boundary from the conversation's `unreadCount`
// (boundary = messageCount - unreadCount): with 5 messages and unreadCount 2,
// the marker sits above the 4th message — the first one dated March 15.
const messages = [
  createTextMessage({
    id: 'ff-msg-1',
    conversationId: CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-14T15:00:00.000Z',
    status: 'read',
    text: "Can you summarize yesterday's release notes?",
  }),
  createTextMessage({
    id: 'ff-msg-2',
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-14T15:00:30.000Z',
    status: 'read',
    text: 'Sure — the release shipped roving focus, landmarks, and a streaming announcer.',
  }),
  createTextMessage({
    id: 'ff-msg-3',
    conversationId: CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-14T15:01:00.000Z',
    status: 'read',
    text: 'Great, thanks!',
  }),
  createTextMessage({
    id: 'ff-msg-4',
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:00:00.000Z',
    text: 'Morning! A new beta is out with the feature flags documented here.',
  }),
  createTextMessage({
    id: 'ff-msg-5',
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:01:00.000Z',
    text: 'Toggle dateDivider and unreadMarker to see the separators above.',
  }),
];

export default function ChatBoxFeatureFlags() {
  return (
    <ChatBox
      adapter={adapter}
      features={{ dateDivider: true, unreadMarker: true }}
      initialConversations={conversations}
      initialActiveConversationId={CONVERSATION_ID}
      initialMessages={messages}
      sx={{
        height: 480,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
