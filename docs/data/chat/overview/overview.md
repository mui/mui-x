---
productId: x-chat
title: Chat React components
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# MUI X Chat

<p class="description">Get a fully styled, theme-aware chat interface with a single component using <code>@mui/x-chat</code>.</p>

`@mui/x-chat` is the Material UI styling layer for the chat package family.
It wraps `@mui/x-chat/unstyled` structural primitives with `styled()` components that inherit your active Material UI theme.

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

## Package model

The package family follows this dependency direction:

```text
@mui/x-chat
  -> @mui/x-chat/unstyled
       -> @mui/x-chat/headless
```

Each layer builds on the one below it:

- **Material UI** adds visual styles via Material UI `styled()` on top of the unstyled primitives.
- **Unstyled** adds structural DOM wiring, slots, and accessibility on top of the headless runtime.
- **Headless** owns state, streaming, adapters, and hooks with no DOM output.

### Choosing a layer

| If you want…                                                                   | Use                    |
| ------------------------------------------------------------------------------ | ---------------------- |
| A styled chat surface that inherits your MUI theme with minimal setup          | `@mui/x-chat`          |
| Full control over visual design using your own CSS, Tailwind, or design system | `@mui/x-chat/unstyled` |
| Complete control over DOM structure with only React state and hooks            | `@mui/x-chat/headless` |

### Package boundary

`@mui/x-chat` re-exports `@mui/x-chat/headless` and `@mui/x-chat/unstyled` through dedicated entry points:

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
