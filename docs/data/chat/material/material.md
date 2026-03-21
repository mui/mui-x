---
productId: x-chat
title: Chat - Material UI
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Material UI

<p class="description">Get a fully styled, theme-aware chat interface with a single component using <code>@mui/x-chat</code>.</p>

`@mui/x-chat` is the Material UI styling layer for the chat package family.
It wraps `@mui/x-chat-unstyled` structural primitives with `styled()` components that inherit your active Material UI theme.

## When to use `@mui/x-chat`

Use `@mui/x-chat` when you want:

- a production-ready chat surface that inherits your MUI theme automatically
- Material UI typography, palette, shape, and spacing applied to every chat element
- a single `<ChatBox />` component that wires layout, messages, and composer together
- slot-based customization to replace individual sub-components with your own

Use `@mui/x-chat-unstyled` when you want to apply your own CSS, Tailwind, or design-system tokens directly.
Use `@mui/x-chat-headless` when you want to own all DOM structure and manage rendering yourself.

## Installation

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/x-chat
```

```bash pnpm
pnpm add @mui/x-chat
```

```bash yarn
yarn add @mui/x-chat
```

</codeblock>

### Peer dependencies

`@mui/x-chat` requires Material UI and Emotion:

<codeblock storageKey="package-manager">

```bash npm
npm install @mui/material @emotion/react @emotion/styled
```

```bash pnpm
pnpm add @mui/material @emotion/react @emotion/styled
```

```bash yarn
yarn add @mui/material @emotion/react @emotion/styled
```

</codeblock>

<!-- #react-peer-version -->

React 17, 18, and 19 are supported:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
}
```

## Basic usage

Import `ChatBox` and wire it to an adapter.
The adapter implements `sendMessage` and returns a streaming response:

```tsx
import { ChatBox } from '@mui/x-chat';

const adapter = {
  async sendMessage({ message, signal }) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      signal,
    });
    return res.body; // ReadableStream<ChatMessageChunk>
  },
};

export default function App() {
  return (
    <ChatBox
      adapter={adapter}
      defaultConversations={[{ id: 'main', title: 'Assistant' }]}
      defaultActiveConversationId="main"
      sx={{ height: 500 }}
    />
  );
}
```

See [Basic AI chat](/x/react-chat/material/examples/basic-ai-chat/) for a fully runnable example with a local echo adapter.

`ChatBox` renders a full chat surface — conversation list, thread header, message log, and composer — in a single component.
All visual styles are derived from your active Material UI theme.

## Theme integration

`ChatBox` reads `palette`, `typography`, `shape`, and `spacing` from the closest `ThemeProvider`.
No additional configuration is needed.

- User message bubbles use `palette.primary.main` as the background color
- Assistant bubbles use `palette.grey[100]` in light mode and `palette.grey[800]` in dark mode
- `typography.body2` governs message text
- `shape.borderRadius` controls bubble rounding
- `palette.divider` is used for borders and separators

Wrapping `ChatBox` in a `ThemeProvider` with custom values is enough to retheme the entire surface.
See [Custom theme](/x/react-chat/material/examples/custom-theme/) for a working example.

## TypeScript theme augmentation

To get autocomplete for style overrides in `createTheme`, import the augmentation side-effect:

```tsx
import type {} from '@mui/x-chat/themeAugmentation';

const theme = createTheme({
  components: {
    MuiChatBox: {
      styleOverrides: {
        root: {
          // your overrides
        },
      },
    },
  },
});
```

## Package boundary

`@mui/x-chat` re-exports `@mui/x-chat-headless` and `@mui/x-chat-unstyled` through dedicated entry points:

```tsx
// Headless hooks and types
import { useChat, useChatComposer } from '@mui/x-chat/headless';

// Unstyled structural primitives
import { Chat, MessageList } from '@mui/x-chat/unstyled';
```

This means you can mix the styled layer with lower-level primitives in the same application.

## What to read next

- [Customization](/x/react-chat/material/customization/) for theme overrides, sx, slots, and CSS class names
- [Examples](/x/react-chat/material/examples/) for end-to-end patterns
- [Headless](/x/react-chat/headless/) for adapters, hooks, and runtime contracts
- [Unstyled](/x/react-chat/unstyled/) for structural composition primitives
