'use client';
import { ChatBox } from '@mui/x-chat';
import { createAiSdkAdapter } from '@mui/x-chat/headless';

const CONVERSATION_ID = 'mui-docs';

const initialConversations = [{ id: CONVERSATION_ID, title: 'MUI docs assistant' }];

const initialMessages = [
  {
    id: 'welcome',
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    status: 'sent',
    parts: [
      {
        type: 'text',
        text: 'Hi! Ask me anything about Material UI, MUI X Data Grid, Date Pickers, Charts, Tree View, Scheduler, or Chat.',
      },
    ],
  },
];

function toPlainMessages(messages) {
  return messages.map((message) => ({
    role: message.role,
    content: message.parts
      .map((part) => (part.type === 'text' ? part.text : ''))
      .join(''),
  }));
}

const adapter = createAiSdkAdapter({
  stream: async ({ messages, signal }) => {
    const response = await fetch(
      'https://backend.mui.com/public/docs-assistant/chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: toPlainMessages(messages) }),
        signal,
      },
    );
    if (!response.ok || !response.body) {
      throw new Error(`Docs assistant unavailable (HTTP ${response.status})`);
    }
    return response.body;
  },
});

export default function MuiDocsAssistantDemo() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      initialConversations={initialConversations}
      initialMessages={initialMessages}
      variant="compact"
      sx={{
        height: 600,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
