import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatDateDivider } from '@mui/x-chat';

import { PlaygroundCard } from '../../_playground/PlaygroundCard';
import { ScopedChat } from '../../_playground/sharedProviders';
import { ChoiceControl } from '../../_playground/controls';
import { users } from '../../_playground/data';

const conversation = {
  id: 'date-playground',
  title: 'Date divider',
  participants: [users.me, users.assistant],
};

function makeMessage(day) {
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

export default function ChatDateDividerPlayground() {
  const [day, setDay] = React.useState('today');
  const message = React.useMemo(() => makeMessage(day), [day]);

  return (
    <PlaygroundCard
      title="ChatDateDivider"
      description="Day separator between message clusters — uses caption + divider tokens."
      previewMinHeight={140}
      controls={
        <ChoiceControl
          label="day"
          value={day}
          options={['today', 'yesterday', 'lastWeek', 'lastYear']}
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
