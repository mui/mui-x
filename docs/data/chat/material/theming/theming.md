---
productId: x-chat
title: Chat - Theming
packageName: '@mui/x-chat'
---

# Theming

<p class="description">Customize the chat surface through theme augmentation, CSS variables, style overrides, dark mode, and RTL support.</p>

## Theme augmentation

Import the theme augmentation module to enable TypeScript autocompletion for chat-specific theme tokens.

```tsx
import type {} from '@mui/x-chat/themeAugmentation';
```

This adds `MuiChatBox`, `MuiChatThread`, `MuiChatComposer`, `MuiChatConversations`, `MuiChatMessage`, and other chat component keys to the theme's `components` type.

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

{{"demo": "ThemeOverrides.js"}}

## Dark mode

The styled layer reads `palette.mode` and adapts all surfaces automatically.
The `Chat` palette tokens also support mode-aware values.

{{"demo": "DarkMode.js"}}

## RTL support

All chat components use logical CSS properties (`margin-inline-start`, `padding-inline-end`, etc.).
Set `direction: 'rtl'` in the theme to mirror the entire layout.

{{"demo": "RtlSupport.js"}}

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
