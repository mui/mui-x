'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import type { ChatMessage } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
  minimalConversation,
} from 'docs/data/chat/material/examples/shared/demoData';

// A handful of short messages so the list overflows and there is room to scroll
// up while a reply streams in.
const filler: ChatMessage[] = Array.from({ length: 12 }, (_, i) =>
  createTextMessage({
    id: `buffer-msg-${i}`,
    conversationId: minimalConversation.id,
    role: i % 2 === 0 ? 'user' : 'assistant',
    createdAt: new Date(Date.UTC(2026, 2, 15, 9, 30, i)).toISOString(),
    text:
      i % 2 === 0
        ? `Question ${i / 2 + 1}: how does the buffer threshold work?`
        : `Answer ${Math.ceil(i / 2)}: auto-scroll keeps following until you scroll past it.`,
  }),
);

const initialMessages: ChatMessage[] = filler;

// A long, multi-sentence reply so streaming lasts long enough to scroll during it.
const longReply = [
  'Auto-scroll keeps the newest content in view while a response streams in.',
  'It only follows along while you stay close to the bottom of the list.',
  'The buffer is the distance, in pixels, from the bottom where following stops.',
  'Scroll up past the buffer and the list stops chasing the stream.',
  'That lets you read earlier messages without the view yanking back down.',
  'Scroll back within the buffer and auto-scroll resumes immediately.',
  'A larger buffer keeps following even when you nudge the list up a little.',
  'A smaller buffer pauses sooner, the moment you start scrolling away.',
  'When auto-scroll is off, the stream never moves the viewport for you.',
  'Use the scroll-to-bottom affordance to jump back to the latest message.',
].join(' ');

const adapter = createEchoAdapter({
  agent: demoUsers.agent,
  delayMs: 120,
  respond: () => longReply,
});

type Buffer = 150 | 300 | 600;

export default function AutoScrollBuffer() {
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [buffer, setBuffer] = React.useState<Buffer>(150);

  return (
    <Box sx={{ width: '100%', maxWidth: 560, mx: 'auto' }}>
      <Stack
        spacing={2}
        sx={{
          mb: 1.5,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={autoScroll}
              onChange={(event) => setAutoScroll(event.target.checked)}
            />
          }
          label="Auto-scroll"
        />
        <div>
          <Typography variant="caption" color="text.secondary" component="div">
            buffer (px)
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={buffer}
            disabled={!autoScroll}
            onChange={(_event, next) => {
              if (next != null) {
                setBuffer(next);
              }
            }}
          >
            <ToggleButton value={150}>150</ToggleButton>
            <ToggleButton value={300}>300</ToggleButton>
            <ToggleButton value={600}>600</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Stack>
      <ChatBox
        adapter={adapter}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={initialMessages}
        features={{ autoScroll: autoScroll ? { buffer } : false }}
        sx={{
          height: 420,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </Box>
  );
}
