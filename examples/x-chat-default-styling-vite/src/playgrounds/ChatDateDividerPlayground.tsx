import * as React from 'react';
import { Box } from '@mui/material';
import { ChatDateDivider } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { PlaygroundCard } from './PlaygroundCard';
import { ScopedChat } from './sharedProviders';
import { ChoiceControl } from './controls';
import { users } from '../data';

const conversation: ChatConversation = {
  id: 'date-playground',
  title: 'Date divider',
  participants: [users.me, users.assistant],
};

type Day = 'today' | 'yesterday' | 'lastWeek' | 'lastYear';

function makeMessage(day: Day): ChatMessage {
  const now = new Date('2026-05-03T09:00:00.000Z');
  const created = new Date(now);
  if (day === 'yesterday') {
    created.setUTCDate(now.getUTCDate() - 1);
  }
  if (day === 'lastWeek') {
    created.setUTCDate(now.getUTCDate() - 7);
  }
  if (day === 'lastYear') {
    created.setUTCFullYear(now.getUTCFullYear() - 1);
  }
  return {
    id: `date-${day}`,
    conversationId: conversation.id,
    role: 'assistant',
    author: users.assistant,
    createdAt: created.toISOString(),
    status: 'read',
    parts: [{ type: 'text', text: `Sent ${day}` }],
  };
}

export function ChatDateDividerPlayground() {
  const [day, setDay] = React.useState<Day>('today');
  const message = React.useMemo(() => makeMessage(day), [day]);

  return (
    <PlaygroundCard
      title="ChatDateDivider"
      description="Day separator between message clusters — uses caption + divider tokens."
      previewMinHeight={140}
      controls={
        <ChoiceControl<Day>
          label="day"
          value={day}
          options={['today', 'yesterday', 'lastWeek', 'lastYear'] as const}
          onChange={setDay}
        />
      }
      preview={
        <ScopedChat
          conversations={[conversation]}
          messages={[message]}
          activeConversationId={conversation.id}
        >
          <Box sx={{ width: '100%' }}>
            <ChatDateDivider messageId={message.id} />
          </Box>
        </ScopedChat>
      }
    />
  );
}
