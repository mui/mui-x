import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter = {
  async sendMessage() {
    return new ReadableStream({
      start(c) {
        c.close();
      },
    });
  },
};

const CustomConversationTitle = React.forwardRef(
  function CustomConversationTitle(props, ref) {
    const { conversation, dense, focused, ownerState, selected, unread, ...other } =
      props;
    void dense;
    void focused;
    void ownerState;
    void selected;
    void unread;

    const title =
      typeof conversation === 'object' && conversation && 'title' in conversation
        ? (conversation.title ?? conversation.id)
        : '';

    return (
      <Box
        ref={ref}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        {...other}
      >
        <Typography fontWeight={600} variant="body2">
          {title}
        </Typography>
        {unread ? <Chip color="primary" label="New" size="small" /> : null}
      </Box>
    );
  },
);

export default function SlotCustomization() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
        <ChatBox
          adapter={adapter}
          defaultActiveConversationId="c1"
          defaultConversations={[
            {
              id: 'c1',
              title: 'Design sync',
              subtitle: 'With custom slots',
              unreadCount: 1,
            },
            { id: 'c2', title: 'Ops review', subtitle: 'All read' },
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
                  text: 'The conversation title uses a custom slot with a chip badge. The message content and composer input can also be replaced.',
                },
              ],
            },
          ]}
          slots={{
            conversationTitle: CustomConversationTitle,
          }}
        />
      </Box>
    </Paper>
  );
}
