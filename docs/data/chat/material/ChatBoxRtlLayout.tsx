import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  },
};

const rtlTheme = createTheme({
  direction: 'rtl',
});

export default function ChatBoxRtlLayout() {
  return (
    <ThemeProvider theme={rtlTheme}>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
      >
        <Box dir="rtl" sx={{ height: 560 }}>
          <ChatBox
            adapter={adapter}
            defaultActiveConversationId="c1"
            defaultConversations={[
              {
                id: 'c1',
                title: 'محادثة تجريبية',
                subtitle: 'دعم الاتجاه من اليمين إلى اليسار',
              },
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
                    text: 'يستخدم صندوق المحادثة خصائص CSS المنطقية. تنعكس الفقاعات والمُؤلِّف وقائمة المحادثات تلقائيًا في وضع RTL.',
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
                    text: 'رسائل المستخدم تظهر على اليسار ورسائل المساعد على اليمين.',
                  },
                ],
              },
            ]}
            localeText={{
              composerInputPlaceholder: 'اكتب رسالة...',
            }}
          />
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
