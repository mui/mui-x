import * as React from 'react';
import { Alert, Box } from '@mui/material';
import { ChatMessageList, ChatScrollToBottomAffordance } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { MessageBubble } from './MessageBubble';
import { NumberControl } from './controls';
import { users } from '../data';

const conversation: ChatConversation = {
  id: 'scroll-playground',
  title: 'Scroll preview',
  participants: [users.me, users.assistant],
};

function buildMessages(count: number): ChatMessage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `scroll-msg-${i}`,
    conversationId: conversation.id,
    role: (i % 2 === 0 ? 'assistant' : 'user') as 'assistant' | 'user',
    author: i % 2 === 0 ? users.assistant : users.me,
    createdAt: new Date(Date.UTC(2026, 4, 3, 9, 0, i)).toISOString(),
    status: 'read',
    parts: [{ type: 'text', text: `Message ${i + 1} of ${count}` }],
  }));
}

export function ChatScrollToBottomAffordancePlayground() {
  const [count, setCount] = React.useState(20);
  const messages = React.useMemo(() => buildMessages(count), [count]);

  return (
    <PlaygroundCard
      title="ChatScrollToBottomAffordance"
      description="Floating jump-to-latest button — appears once the user scrolls away from the bottom."
      previewMinHeight={360}
      span={2}
      controls={
        <React.Fragment>
          <NumberControl label="message count" value={count} min={5} max={60} onChange={setCount} />
          <Alert severity="info" sx={{ fontSize: '0.75rem', py: 0 }}>
            Scroll up inside the preview to make the affordance appear.
          </Alert>
        </React.Fragment>
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={messages}
          activeConversationId={conversation.id}
        >
          <Box
            sx={{
              width: '100%',
              height: 360,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <ChatMessageList
              items={messages.map((m) => m.id)}
              autoScroll={false}
              renderItem={({ id }) => <MessageBubble key={id} messageId={id} />}
              overlay={<ChatScrollToBottomAffordance />}
            />
          </Box>
        </ScopedChat>
      }
    />
  );
}
