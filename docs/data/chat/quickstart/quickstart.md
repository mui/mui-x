---
productId: x-chat
title: Quickstart
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Quickstart

<p class="description">Install the Chat package and start building React chat interfaces.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Installation

Install the Chat package:

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

#### Material UI

The Chat package has a peer dependency on `@mui/material`.
If you're not already using it, install it now:

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

#### React

<!-- #react-peer-version -->

[`react`](https://www.npmjs.com/package/react) and [`react-dom`](https://www.npmjs.com/package/react-dom) are also peer dependencies:

```json
"peerDependencies": {
  "react": "^17.0.0 || ^18.0.0 || ^19.0.0",
  "react-dom": "^17.0.0 || ^18.0.0 || ^19.0.0"
},
```

## Rendering a Chat

### Import the component

Import `ChatBox` and wire it to an adapter.
The adapter implements `sendMessage`, which returns the assistant's reply as a stream of response chunks.
For streaming UIs and `createAiSdkAdapter`, see [Streaming](/x/react-chat/behavior/streaming/).

```tsx
import { ChatBox, createEchoAdapter } from '@mui/x-chat';
```

### Render the component

The example below uses the built-in `createEchoAdapter` so it works directly in the docs.
In your app, replace it with an adapter that calls your API.

{{"demo": "RenderChatBox.js", "defaultCodeOpen": true, "bg": "inline"}}

`ChatBox` renders a full chat surface—conversation header, message list, and composer—in a single component. See [Components](/x/react-chat/all-components/) for the full anatomy.
Enable the built-in conversation list explicitly with `features={{ conversationList: true }}` when you want an inbox-style layout.
The list only renders once at least one conversation exists (for example via `initialConversations`), so enabling the flag on an empty chat shows no sidebar.
All visual styles are derived from your active Material UI theme.

{{"demo": "../material/examples/multi-conversation/MultiConversation.js", "bg": "inline", "defaultCodeOpen": false, "hideToolbar": true}}

See [Conversation list](/x/react-chat/multi-conversation/conversation-list/) for the full feature documentation.

Only `adapter` is required—it must implement `sendMessage`.
`initialMessages`, `initialConversations`, and `initialActiveConversationId` are optional conveniences that pre-populate chat state on first render—the demo's welcome bubble comes from `initialMessages`.
If `features={{ conversationList: true }}` is enabled, the same conversation data also feeds the built-in conversation list.
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
See [Look and feel—Theme component overrides](/x/react-chat/customization/look-and-feel/#theme-component-overrides) for details.

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

## Next steps

- [Overview](/x/react-chat/) — what the Chat package covers and how it's organized
- [Components](/x/react-chat/all-components/) — every component the package ships
- [ChatBox](/x/react-chat/basics/chatbox/) — the full `ChatBox` feature walkthrough
- [Adapters](/x/react-chat/backend/adapters/) — connect the chat to your own API

## API

- [`ChatBox`](/x/api/chat/chat-box/)

## Using this documentation

### Feature availability

:::info
MUI X is **open core**—Community components are MIT-licensed, while more advanced features require a Pro or Premium commercial license.
See [Licensing](/x/introduction/licensing/) for details.
:::

Throughout the documentation, Pro- and Premium-only features are denoted with the [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan') and [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') icons, respectively.

All documentation for Community components and features also applies to their Pro and Premium counterparts.
