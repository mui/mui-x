---
productId: x-chat
title: Chat - Theming
packageName: '@mui/x-chat'
---

# Theming

Customize the chat surface through theme augmentation, CSS variables, style overrides, dark mode, and RTL support.

## Theme augmentation

Import the theme augmentation module to enable TypeScript autocompletion for chat-specific theme tokens.

```tsx
import type {} from '@mui/x-chat/themeAugmentation';
```

This adds `MuiChatBox`, `MuiChatConversation`, `MuiChatComposer`, `MuiChatConversations`, `MuiChatMessage`, and other chat component keys to the theme's `components` type.

## Palette tokens

The chat surface uses a `Chat` palette namespace for color tokens:

```tsx
const theme = createTheme({
  palette: {
    Chat: {
      userMessageBg: '#0f172a',
      userMessageColor: '#fff',
      assistantMessageBg: '#f8fafc',
      assistantMessageColor: '#0f172a',
      conversationHoverBg: '#eef2ff',
      conversationSelectedBg: '#dbeafe',
      conversationSelectedColor: '#0f172a',
      composerBorder: '#cbd5e1',
      composerFocusRing: '#2563eb',
    },
  },
});
```

## Style overrides

Use the `components` key in the theme to apply style overrides to any chat component:

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ChatAdapter } from '@mui/x-chat/headless';
import { ChatBox } from '@mui/x-chat';
import type {} from '@mui/x-chat/themeAugmentation';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(c) {
        c.close();
      },
    });
  },
};

const theme = createTheme({
  components: {
    MuiChatBox: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  palette: {
    Chat: {
      userMessageBg: '#1e3a5f',
      userMessageColor: '#e0f2fe',
      assistantMessageBg: '#f0fdf4',
      assistantMessageColor: '#14532d',
      composerFocusRing: '#16a34a',
    },
  },
});

export default function ThemeOverrides() {
  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
      >
        <Box sx={{ height: 480 }}>
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
                    text: 'This chat uses custom theme overrides. The assistant bubble has a green tint and the user bubble has a navy background.',
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
                    text: 'The palette.Chat tokens drive the CSS variables for all chat surfaces.',
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

## Dark mode

The styled layer reads `palette.mode` and adapts all surfaces automatically.
The `Chat` palette tokens also support mode-aware values.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import type { ChatAdapter } from '@mui/x-chat/headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(c) {
        c.close();
      },
    });
  },
};

export default function DarkMode() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <IconButton
          aria-label="Toggle dark mode"
          onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Box sx={{ height: 480 }}>
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
                    text: 'Toggle between light and dark mode using the button above. All surfaces adapt automatically.',
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
                    text: 'The Chat palette tokens support both modes out of the box.',
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

## RTL support

All chat components use logical CSS properties (`margin-inline-start`, `padding-inline-end`, etc.).
Set `direction: 'rtl'` in the theme to mirror the entire layout.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ChatAdapter } from '@mui/x-chat/headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
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
```

## CSS variables

The chat surface exposes CSS custom properties that can be overridden directly:

| Variable                           | Description                        |
| :--------------------------------- | :--------------------------------- |
| `--Chat-userMessageBg`             | User message background            |
| `--Chat-userMessageColor`          | User message text color            |
| `--Chat-assistantMessageBg`        | Assistant message background       |
| `--Chat-assistantMessageColor`     | Assistant message text color       |
| `--Chat-conversationHoverBg`       | Conversation item hover background |
| `--Chat-conversationSelectedBg`    | Selected conversation background   |
| `--Chat-conversationSelectedColor` | Selected conversation text color   |
| `--Chat-composerBorder`            | Composer border color              |
| `--Chat-composerFocusRing`         | Composer focus ring color          |

## The `sx` prop

Every styled chat component accepts the `sx` prop for one-off style overrides:

```tsx
<ChatBox sx={{ minHeight: 640, borderRadius: 2 }} />
```

## Adjacent pages

- See [Slots](/x/react-chat/material/slots/) for component-level customization through slot replacement.
- See [Localization](/x/react-chat/material/localization/) for locale text customization.
