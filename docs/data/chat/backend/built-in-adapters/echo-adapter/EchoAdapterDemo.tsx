'use client';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '@mui/x-chat/headless';

const CONVERSATION_ID = 'echo-demo';

const initialConversations = [{ id: CONVERSATION_ID, title: 'Echo' }];

const initialMessages = [
  {
    id: 'welcome',
    conversationId: CONVERSATION_ID,
    role: 'assistant' as const,
    status: 'sent' as const,
    parts: [
      {
        type: 'text' as const,
        text: 'Type anything — I echo it back with a small delay.',
      },
    ],
  },
];

const adapter = createEchoAdapter({
  respond: (text) => `You typed: "${text || 'nothing'}".`,
  delayMs: 300,
});

export default function EchoAdapterDemo() {
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
