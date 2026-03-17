import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

const rtlTheme = createTheme({ direction: 'rtl' });

export default function RtlSupport() {
  return (
    <ThemeProvider theme={rtlTheme}>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
      >
        <Box dir="rtl" sx={{ height: 480 }}>
          <ChatBox
            adapter={adapter}
            defaultMessages={[
              {
                id: 'm1',
                role: 'assistant',
                author: demoUsers.agent,
                createdAt: '2026-03-17T09:00:00.000Z',
                parts: [
                  {
                    type: 'text',
                    text: 'جميع مكونات المحادثة تستخدم خصائص CSS المنطقية وتتكيف تلقائيًا مع اتجاه RTL.',
                  },
                ],
              },
              {
                id: 'm2',
                role: 'user',
                author: demoUsers.you,
                createdAt: '2026-03-17T09:01:00.000Z',
                parts: [
                  {
                    type: 'text',
                    text: 'الفقاعات والمؤلف وقائمة المحادثات كلها تنعكس.',
                  },
                ],
              },
            ]}
            localeText={{ composerInputPlaceholder: 'اكتب رسالة...' }}
          />
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
