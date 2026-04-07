---
title: Chat - Custom theme
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Custom theme

<p class="description">Retheme the entire chat surface by wrapping <code>ChatBox</code> in a <code>ThemeProvider</code> with custom palette and shape values.</p>

`ChatBox` inherits its visual design from the active Material UI theme.
This demo shows how a single `createTheme` call changes bubble colors, border radius, and typography across the entire surface.

- `ThemeProvider` with a custom `palette.primary` (teal) applied to user message bubbles
- Custom `shape.borderRadius` reflected in bubble and container rounding
- Custom `typography.fontFamily` propagated to all text elements
- No extra CSS or style overrides needed — the theme drives everything

```tsx
'use client';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const tealTheme = createTheme({
  palette: {
    primary: {
      main: '#00796b',
      light: '#48a999',
      dark: '#004c40',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6f00',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". Notice how the bubble colors, border radius, and typography all come from the custom teal theme — no extra CSS required.`,
});

export default function CustomTheme() {
  return (
    <ThemeProvider theme={tealTheme}>
      <CssBaseline />
      <ChatBox
        adapter={adapter}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
        sx={{
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '12px',
        }}
      />
    </ThemeProvider>
  );
}

```

## How theme tokens map to chat elements

| Theme token                       | Chat element                             |
| :-------------------------------- | :--------------------------------------- |
| `palette.primary.main`            | User message bubble background           |
| `palette.primary.contrastText`    | User message bubble text                 |
| `palette.grey[100]` / `grey[800]` | Assistant bubble background (light/dark) |
| `palette.text.primary`            | Assistant bubble text                    |
| `palette.divider`                 | Borders, separators                      |
| `shape.borderRadius`              | Bubble corner rounding                   |
| `typography.body2`                | Message text                             |
| `typography.caption`              | Timestamps, metadata                     |

## Implementation notes

- Wrapping with `ThemeProvider` scopes the theme to that subtree. Other parts of the page keep the parent theme.
- Use `CssBaseline` inside the `ThemeProvider` if you need baseline styles applied to the chat container.
- The `@mui/x-chat/themeAugmentation` import adds TypeScript types for `MuiChatBox` and related component overrides in `createTheme`.

## See also

- [Slot overrides](/x/react-chat/material/examples/slot-overrides/) to replace individual sub-components rather than styling through the theme
- [Customization](/x/react-chat/material/customization/) for the full reference of style override keys

## API

- [ChatRoot](/x/api/chat/chat-root/)
