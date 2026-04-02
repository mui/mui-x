'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';

import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Stack from '@mui/material/Stack';
import {
  createEchoAdapter,
  randomId,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = randomId();

const conversation = {
  id: CONV_ID,
  title: 'Design review',
  subtitle: 'UI team',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T14:10:00.000Z',
};

const messages = [
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T14:00:00.000Z',
    text: 'Hey! I just pushed the updated mockups for the settings page.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T14:00:10.000Z',
    text: 'Let me know what you think about the new spacing.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T14:02:00.000Z',
    text: 'Looks great! The layout feels much more balanced now.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T14:02:15.000Z',
    text: 'One thing: can we increase the gap between the sections?',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T14:05:00.000Z',
    text: 'Sure, I will add more vertical breathing room. Give me 10 minutes.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T14:10:00.000Z',
    text: 'Perfect, take your time!',
  }),
];

export default function DensityProp() {
  const [density, setDensity] = React.useState('standard');

  return (
    <Stack spacing={2}>
      <ToggleButtonGroup
        value={density}
        exclusive
        onChange={(_, value) => {
          if (value !== null) {
            setDensity(value);
          }
        }}
        size="small"
      >
        <ToggleButton value="compact">Compact</ToggleButton>
        <ToggleButton value="standard">Standard</ToggleButton>
        <ToggleButton value="comfortable">Comfortable</ToggleButton>
      </ToggleButtonGroup>
      <ChatBox
        density={density}
        adapter={adapter}
        initialActiveConversationId={conversation.id}
        initialConversations={[conversation]}
        initialMessages={messages}
        sx={{
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </Stack>
  );
}
