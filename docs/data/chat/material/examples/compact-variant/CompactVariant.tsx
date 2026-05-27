'use client';
import * as React from 'react';
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

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". Notice the compact layout — no message bubbles, everything left-aligned, author names above each group.`,
});

export default function CompactVariant() {
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
      variant="compact"
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
      sx={{
        height: 560,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
