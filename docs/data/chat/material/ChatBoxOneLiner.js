import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter = {
  async sendMessage() {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  },
};

export default function ChatBoxOneLiner() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 560 }}>
        <ChatBox
          adapter={adapter}
          defaultActiveConversationId="c1"
          defaultConversations={[
            {
              id: 'c1',
              title: 'Product design',
              subtitle: 'Roadmap sync',
              unreadCount: 2,
            },
            { id: 'c2', title: 'Support inbox', subtitle: 'Escalations' },
          ]}
          defaultMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'Morning. I summarized the latest design feedback in the thread.',
                },
              ],
            },
            {
              id: 'm2',
              role: 'user',
              author: demoUsers.you,
              createdAt: '2026-03-17T09:03:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'Great. Pull out the three biggest blockers for launch.',
                },
              ],
            },
            {
              id: 'm3',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:04:30.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'The biggest blockers are API latency, localization QA, and approval UX for tool calls.',
                },
              ],
            },
          ]}
        />
      </Box>
    </Paper>
  );
}
