---
productId: x-chat
title: Styling
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Styling

<p class="description">Override styles using the <code>sx</code> prop, Material UI theme component overrides, dark mode, and CSS class injection.</p>

## sx prop

The `sx` prop on `ChatBox` applies styles to the outermost root element.
Use it for layout constraints such as height and width:

```tsx
<ChatBox
  adapter={adapter}
  sx={{
    height: 500,
    width: '100%',
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
  }}
/>
```

## Theme component overrides

Use `createTheme` to apply style overrides that apply globally across your application.
Import `'@mui/x-chat/themeAugmentation'` for TypeScript autocomplete:

```tsx
import type {} from '@mui/x-chat/themeAugmentation';

const theme = createTheme({
  components: {
    MuiChatBox: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: '1px solid',
          borderColor: theme.palette.divider,
          borderRadius: 8,
        }),
        layout: {
          gap: 0,
        },
      },
    },
    MuiChatMessage: {
      styleOverrides: {
        bubble: ({ theme: t }) => ({
          borderRadius: t.shape.borderRadius * 3,
        }),
      },
    },
  },
});
```

## Dark mode

`ChatBox` uses the `(theme.vars || theme).palette.*` pattern throughout.
Dark mode works automatically when you toggle `palette.mode` in your theme:

```tsx
const darkTheme = createTheme({ palette: { mode: 'dark' } });

<ThemeProvider theme={darkTheme}>
  <ChatBox adapter={adapter} />
</ThemeProvider>;
```

## classes prop

Inject custom class names onto the root and layout elements using the `classes` prop:

```tsx
<ChatBox
  classes={{
    root: 'my-chat-root',
    layout: 'my-chat-layout',
    conversationsPane: 'my-conversations-pane',
    threadPane: 'my-thread-pane',
  }}
/>
```

### Available class keys

| Key                 | Default class name             | Applied to                 |
| :------------------ | :----------------------------- | :------------------------- |
| `root`              | `MuiChatBox-root`              | Outermost container        |
| `layout`            | `MuiChatBox-layout`            | Layout element             |
| `conversationsPane` | `MuiChatBox-conversationsPane` | Conversations sidebar pane |
| `threadPane`        | `MuiChatBox-threadPane`        | Thread pane                |

## CSS class constants

The `chatBoxClasses` utility object provides class name constants for CSS targeting:

```tsx
import { chatBoxClasses } from '@mui/x-chat';

// Available: chatBoxClasses.root, chatBoxClasses.layout,
//            chatBoxClasses.conversationsPane, chatBoxClasses.threadPane
```

## slotProps for targeted styling

Pass `sx` overrides to any internal sub-component using `slotProps` without replacing the component:

```tsx
<ChatBox
  slotProps={{
    conversationList: { 'aria-label': 'Chat threads' },
    composerInput: { placeholder: 'Ask anything...' },
    composerSendButton: { sx: { borderRadius: 6 } },
  }}
/>
```

## See also

- [Slots & Composition](/x/react-chat/customization/slots-and-composition/) for replacing sub-components entirely.
- [Tailwind CSS](/x/react-chat/customization/tailwind/) for styling with utility classes.

## API
