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

function CustomTextPart(props) {
  return (
    <Typography
      sx={{
        fontFamily: '"Georgia", serif',
        fontSize: '0.95rem',
        lineHeight: 1.7,
        color: 'text.primary',
      }}
    >
      {props.part.text}
    </Typography>
  );
}

export default function CustomPartRenderer() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 400 }}>
        <ChatBox
          adapter={adapter}
          defaultMessages={[
            {
              id: 'm1',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T10:00:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'This text uses a custom serif font renderer instead of the default markdown renderer.',
                },
              ],
            },
            {
              id: 'm2',
              role: 'user',
              author: demoUsers.you,
              createdAt: '2026-03-17T10:01:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'The partRenderers prop lets you replace any part type while keeping the rest of the chat surface unchanged.',
                },
              ],
            },
          ]}
          partRenderers={{
            text: (partProps) => <CustomTextPart part={partProps.part} />,
          }}
        />
      </Box>
    </Paper>
  );
}
