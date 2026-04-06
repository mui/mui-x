---
productId: x-chat
title: Getting started with MUI X Chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatRoot, ChatLayout
---

# Getting started

<p class="description">Install <code>@mui/x-chat</code> and render a fully styled, theme-aware chat interface in minutes.</p>



## Installation

Install the package using your preferred package manager:

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

`@mui/x-chat` requires Material UI and Emotion. If they are not already in your project, install them:

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
      initialConversations={[{ id: 'main', title: 'Assistant' }]}
      initialActiveConversationId="main"
      sx={{ height: 500 }}
    />
  );
}
```

`ChatBox` renders a full chat surface — conversation list, thread header, message log, and composer — in a single component.
All visual styles are derived from your active Material UI theme.

See [Basic AI chat](/x/react-chat/material/examples/basic-ai-chat/) for a fully runnable demo with a local echo adapter.

## Theme integration

`ChatBox` reads `palette`, `typography`, `shape`, and `spacing` from the closest `ThemeProvider`.
No additional configuration is needed.

- User message bubbles use `palette.primary.main` as the background color
- Assistant bubbles use `palette.grey[100]` in light mode and `palette.grey[800]` in dark mode
- `typography.body2` governs message text
- `shape.borderRadius` controls bubble rounding
- `palette.divider` is used for borders and separators

Wrapping `ChatBox` in a `ThemeProvider` with custom values is enough to retheme the entire surface.
See [Custom theme](/x/react-chat/material/examples/custom-theme/) for a working demo.

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

## Package model

`@mui/x-chat` is the Material UI styling layer of a three-tier architecture, all within two npm packages:

```text
@mui/x-chat                         ← Material UI styles
  -> @mui/x-chat-headless           ← headless structural components
       -> @mui/x-chat-headless/core ← runtime, hooks, adapters
```

Each layer builds on the one below it:

- **Material UI** adds visual styles via Material UI `styled()` on top of the headless primitives.
- **Headless** adds structural DOM wiring, slots, and accessibility on top of the core runtime.
- **Core** owns state, streaming, adapters, and hooks with no DOM output.

### Choosing a layer

| If you want…                                                                   | Use                            |
| :----------------------------------------------------------------------------- | :----------------------------- |
| A styled chat surface that inherits your MUI theme with minimal setup          | `@mui/x-chat`                  |
| Full control over visual design using your own CSS, Tailwind, or design system | `@mui/x-chat-headless`         |
| Complete control over DOM structure with only React state and hooks            | `@mui/x-chat-headless/core`    |

### Package boundary

Both the headless components and the core runtime live in `@mui/x-chat-headless`:

```tsx
// Core hooks and types
import { useChat, useChatComposer } from '@mui/x-chat-headless/core';

// Headless structural primitives
import { Chat, MessageList } from '@mui/x-chat-headless';
```

This means you can mix the styled layer with lower-level primitives in the same application.

## Next steps

- [Overview](/x/react-chat/) — learn about the package architecture and capabilities
- [Customization](/x/react-chat/material/customization/) — theme overrides, sx, slots, and CSS class names
- [Examples](/x/react-chat/material/examples/) — end-to-end patterns
- [Core layer](/x/react-chat/core/) — adapters, hooks, and runtime contracts
- [Headless layer](/x/react-chat/headless/) — structural composition primitives

## API

- [ChatRoot](/x/api/chat/chat-root/)
- [ChatLayout](/x/api/chat/chat-layout/)
