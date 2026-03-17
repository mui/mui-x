import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

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

const ConversationTitle = React.forwardRef(function ConversationTitle(props, ref) {
  const { conversation, dense, focused, ownerState, selected, unread, ...other } =
    props;

  void dense;
  void focused;
  void ownerState;
  void selected;
  void unread;

  return (
    <Typography
      color="text.primary"
      fontWeight={700}
      ref={ref}
      textTransform="uppercase"
      variant="caption"
      {...other}
    >
      {typeof conversation === 'object' && conversation && 'title' in conversation
        ? (conversation.title ?? conversation.id)
        : null}
    </Typography>
  );
});

const MessageContent = React.forwardRef(function MessageContent(props, ref) {
  const { ownerState, ...other } = props;

  void ownerState;

  return (
    <Box
      ref={ref}
      sx={{
        borderInlineStart: 3,
        borderColor: 'secondary.main',
        pl: 1.5,
      }}
      {...other}
    />
  );
});

export default function ChatBoxSlotCustomization() {
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
            { id: 'c1', title: 'AI copilot', subtitle: 'Mirrored slots in ChatBox' },
          ]}
          defaultMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:15:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'This example customizes the conversation title, message content, and composer input directly from ChatBox.',
                },
              ],
            },
          ]}
          localeText={{
            composerInputPlaceholder: 'Ask the copilot',
          }}
          slotProps={{
            composerInput: {
              rows: 1,
            },
          }}
          slots={{
            composerInput: 'textarea',
            conversationTitle: ConversationTitle,
            messageContent: MessageContent,
          }}
        />
      </Box>
    </Paper>
  );
}
