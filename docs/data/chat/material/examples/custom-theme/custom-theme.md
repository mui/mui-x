---
title: Chat - Custom Theme
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Custom Theme

<p class="description">Retheme the entire chat surface by wrapping ChatBox in a ThemeProvider with custom palette and shape values.</p>

`ChatBox` inherits its visual design from the active Material UI theme.
This demo shows how a single `createTheme` call changes bubble colors, border radius, and typography across the entire surface.

- `ThemeProvider` with a custom `palette.primary` (teal) applied to user message bubbles
- Custom `shape.borderRadius` reflected in bubble and container rounding
- Custom `typography.fontFamily` propagated to all text elements
- No extra CSS or style overrides needed: the theme drives everything

{{"demo": "CustomTheme.js", "bg": "inline"}}

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

- [Slot overrides](/x/react-chat/material/examples/slot-overrides/) to replace individual subcomponents rather than styling through the theme
- [Customization](/x/react-chat/material/customization/) for the full reference of style override keys

## API

- [ChatRoot](/x/api/chat/chat-root/)
