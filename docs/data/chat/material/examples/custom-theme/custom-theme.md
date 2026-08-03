---
title: Chat - Custom theme
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Custom theme

<p class="description">Restyle the entire chat surface by wrapping `ChatBox` in a `ThemeProvider` with custom palette and shape values.</p>

`ChatBox` inherits its visual design from the active Material UI theme.
This demo shows how a single `createTheme()` call changes bubble colors, border radius, and typography across the entire surface.

- `ThemeProvider` with a custom `palette.primary` (teal) applied to user message bubbles
- Custom `shape.borderRadius` reflected in bubble and container rounding
- Custom `typography.fontFamily` propagated to all text elements
- No extra CSS or style overrides needed—the theme drives everything.

The demo below shows a single `createTheme()` call retheming bubble colors, border radius, and typography across the entire surface:

{{"demo": "CustomTheme.js", "bg": "inline"}}

## Mapping theme tokens to chat elements

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

## Scoping the theme to the chat surface

- Wrapping with `ThemeProvider` scopes the theme to that subtree.
  Other parts of the page keep the parent theme.
- Use `CssBaseline` inside the `ThemeProvider` if you need baseline styles applied to the chat container.
- Import `@mui/x-chat/themeAugmentation` to add TypeScript types for `MuiChatBox` and related component overrides on `createTheme()`.

## See also

- See [Slot overrides](/x/react-chat/material/examples/slot-overrides/) for details on replacing individual subcomponents.
- See [Customization](/x/react-chat/material/customization/) for details on the full set of style override keys.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
