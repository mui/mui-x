'use client';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '@mui/x-chat/headless';

const CONVERSATION_ID = 'canned-demo';

const initialConversations = [{ id: CONVERSATION_ID, title: 'Canned replies' }];

const initialMessages = [
  {
    id: 'welcome',
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    status: 'sent',
    parts: [
      {
        type: 'text',
        text: 'Try asking about "pricing" or "support".',
      },
    ],
  },
];

const adapter = createEchoAdapter({
  respond: (text) => {
    const input = text.toLowerCase();
    if (input.includes('pricing')) {
      return 'Plans start at $0 — the echo tier is free forever.';
    }
    if (input.includes('support')) {
      return 'Support is instant: I only ever talk to you.';
    }
    return `I only know about "pricing" and "support", but you said: "${text}".`;
  },
});

export default function EchoAdapterCannedReplies() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      initialConversations={initialConversations}
      initialMessages={initialMessages}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
