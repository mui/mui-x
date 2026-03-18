---
productId: x-chat
title: Chat - Branded chat
packageName: '@mui/x-chat'
---

# Branded chat

Heavy theme customization with custom colors, border-radius, typography, and CSS variables to match a specific brand identity.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';
import type {} from '@mui/x-chat/themeAugmentation';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

const brandTheme = createTheme({
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiChatBox: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
  palette: {
    primary: { main: '#7c3aed' },
    Chat: {
      userMessageBg: '#7c3aed',
      userMessageColor: '#f5f3ff',
      assistantMessageBg: '#faf5ff',
      assistantMessageColor: '#3b0764',
      conversationHoverBg: '#f5f3ff',
      conversationSelectedBg: '#ede9fe',
      conversationSelectedColor: '#4c1d95',
      composerBorder: '#c4b5fd',
      composerFocusRing: '#7c3aed',
    },
  },
});

export default function BrandedChat() {
  return (
    <ThemeProvider theme={brandTheme}>
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
                title: 'Brand assistant',
                subtitle: 'Custom purple theme',
              },
              { id: 'c2', title: 'Support', subtitle: 'Branded experience' },
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
                    text: 'Welcome to the branded chat experience. The purple theme, rounded corners, and custom typography are all configured through MUI theme augmentation.',
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
                    text: 'The same ChatBox API with a completely different visual identity.',
                  },
                ],
              },
            ]}
          />
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

```

## What this example demonstrates

- Custom `palette.Chat` tokens for brand colors
- `styleOverrides` on `MuiChatBox` for border-radius and spacing
- Custom typography through theme configuration
- The same one-liner `ChatBox` API with a completely different visual identity
