'use client';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { ChatBox } from '@mui/x-chat';
import {
  createEchoAdapter,
  syncConversationPreview,
} from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docs/data/chat/material/examples/shared/demoData';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';

const ThemedAvatarSlot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    ownerState?: {
      conversation?: ChatConversation;
      selected?: boolean;
    };
  }
>(function ThemedAvatarSlot({ ownerState, ...props }, ref) {
  const title = ownerState?.conversation?.title ?? '';
  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <Avatar
      ref={ref}
      {...props}
      sx={{
        width: 40,
        height: 40,
        bgcolor: ownerState?.selected ? 'primary.main' : 'grey.400',
        fontSize: 'body2.fontSize',
        fontWeight: 'fontWeightMedium',
        ...props.style,
      }}
    >
      {initials}
    </Avatar>
  );
});

const adapter = createEchoAdapter();

export default function ThemedAvatar() {
  const [activeConversationId, setActiveConversationId] = React.useState(
    () => inboxConversations[0].id,
  );
  const [conversations, setConversations] = React.useState<ChatConversation[]>(() =>
    inboxConversations.map((c) => ({ ...c })),
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
    <ChatBox
      adapter={adapter}
      activeConversationId={activeConversationId}
      conversations={conversations}
      messages={messages}
      features={{ conversationList: true }}
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
      slotProps={{
        conversationList: {
          slots: { itemAvatar: ThemedAvatarSlot },
        },
      }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
