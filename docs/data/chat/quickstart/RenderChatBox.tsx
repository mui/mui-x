'use client';
import { ChatBox, createEchoAdapter } from '@mui/x-chat';

const CONVERSATION_ID = 'quickstart';

const initialConversations = [{ id: CONVERSATION_ID, title: 'Assistant' }];

const initialMessages = [
  {
    id: 'welcome',
    conversationId: CONVERSATION_ID,
    role: 'assistant' as const,
    status: 'sent' as const,
    parts: [
      { type: 'text' as const, text: 'Hello! Send a message to see a response.' },
    ],
  },
];

const adapter = createEchoAdapter();

export default function RenderChatBox() {
  return (
    <ChatBox
      adapter={adapter}
      initialConversations={initialConversations}
      initialActiveConversationId={CONVERSATION_ID}
      initialMessages={initialMessages}
      // ChatBox fills its container — give it an explicit height in your layout.
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
