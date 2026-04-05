---
productId: x-chat
title: Quickstart
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Quickstart

<p class="description">Install <code>@mui/x-chat</code> and render a fully styled, theme-aware chat interface in under five minutes.</p>

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

Only `adapter` is required — it must implement `sendMessage`.
`initialConversations` and `initialActiveConversationId` are optional conveniences that pre-populate the conversation list on first render.
Every other prop is optional.

## Theme integration

`ChatBox` reads `palette`, `typography`, `shape`, and `spacing` from the closest `ThemeProvider`.
No additional configuration is needed.

- User message bubbles use `palette.primary.main` as the background color
- Assistant bubbles use `palette.grey[100]` in light mode and `palette.grey[800]` in dark mode
- `typography.body2` governs message text
- `shape.borderRadius` controls bubble rounding
- `palette.divider` is used for borders and separators

Wrapping `ChatBox` in a `ThemeProvider` with custom values is enough to retheme the entire surface.
See [Custom theme](/x/react-chat/customization/styling/) for a working demo.

## TypeScript theme augmentation

To get autocomplete for style overrides in `createTheme`, import the augmentation side-effect:

```tsx
import { createTheme } from '@mui/material/styles';
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

## API

- [`ChatBox`](/x/api/chat/chat-box/)

## Next steps

- [ChatBox](/x/react-chat/basics/chatbox/) — learn about the ChatBox component, its props, and architecture
- [Customization](/x/react-chat/customization/styling/) — theme overrides, sx, slots, and CSS class names
- [Demos](/x/react-chat/demos/ai-assistant/) — end-to-end patterns
- [Slots & Composition](/x/react-chat/customization/slots-and-composition/) — structural composition primitives and slot overrides
