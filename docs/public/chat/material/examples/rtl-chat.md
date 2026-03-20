---
productId: x-chat
title: Chat - RTL layout
packageName: '@mui/x-chat'
---

# RTL chat

<p class="description">A right-to-left chat layout with Arabic text, showing how all chat components adapt to <code>direction: 'rtl'</code>.</p>

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter({
  respond: () => 'شكرًا لرسالتك. هذا رد تجريبي من المحادثة المادية.',
});

const rtlTheme = createTheme({ direction: 'rtl' });

export default function RtlChat() {
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
                title: 'الدعم الفني',
                subtitle: 'محادثة باللغة العربية',
                unreadCount: 1,
              },
              { id: 'c2', title: 'مراجعة التصميم', subtitle: 'ملاحظات الفريق' },
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
                    text: 'مرحبًا! جميع مكونات المحادثة تدعم اتجاه RTL تلقائيًا. الفقاعات والمؤلف وقائمة المحادثات كلها تنعكس باستخدام خصائص CSS المنطقية.',
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
                    text: 'رسائل المستخدم تظهر على اليسار ورسائل المساعد على اليمين في وضع RTL.',
                  },
                ],
              },
              {
                id: 'm3',
                role: 'assistant',
                author: demoUsers.agent,
                createdAt: '2026-03-17T09:02:00.000Z',
                parts: [
                  {
                    type: 'text',
                    text: 'يمكنك تخصيص نص المؤلف والتسميات من خلال خاصية localeText.',
                  },
                ],
              },
            ]}
            localeText={{
              composerInputPlaceholder: 'اكتب رسالة...',
              composerSendButtonLabel: 'إرسال',
            }}
          />
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
```

## What this example demonstrates

- RTL layout via `createTheme({ direction: 'rtl' })` and `dir="rtl"` on the container
- Message bubbles flip: user messages appear on the left, assistant on the right
- Conversations sidebar, composer, and all indicators mirror automatically
- Logical CSS properties used throughout (`margin-inline-start`, etc.)
- Custom Arabic `localeText` for the composer placeholder
