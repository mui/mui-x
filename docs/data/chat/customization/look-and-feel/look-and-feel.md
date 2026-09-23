---
productId: x-chat
title: Look and feel
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Look and feel

<p class="description">Change colors, layout style, density, and typography—from quick props to full brand theming.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Live playground

The same `ChatBox` re-themes itself when you swap the layout variant, density, primary color, or border radius—every change comes from a single Material UI theme and two top-level props (`variant` and `density`):

{{"demo": "LookAndFeelPlayground.js", "bg": "inline"}}

:::warning
Own-message bubbles use `palette.primary.main` as their background with `palette.primary.contrastText` text—when picking a brand primary, check the pair meets WCAG contrast.
:::

## Choosing a layout style

The `variant` prop controls how messages and the composer are arranged:

```tsx
// Bubbles—colored message bubbles, right-aligned for user (WhatsApp, Telegram)
<ChatBox adapter={adapter} variant="default" />

// Flat—no bubbles, stacked messages with inline sender info (Slack, ChatGPT, Claude)
<ChatBox adapter={adapter} variant="compact" />
```

The same conversation rendered with each variant—`default` uses colored bubbles with own messages on the trailing edge; `compact` drops the bubble and shows the author inline:

{{"demo": "MessageVariantsDemo.js", "bg": "inline"}}

The demo below shows how the same `variant` prop drives the composer's two stock layouts:

{{"demo": "ComposerVariantsDemo.js", "bg": "inline"}}

## Choosing a density

The `density` prop controls vertical spacing between messages:

```tsx
<ChatBox adapter={adapter} density="compact" />     // Tight spacing
<ChatBox adapter={adapter} density="standard" />    // Default
<ChatBox adapter={adapter} density="comfortable" /> // Spacious
```

`standard` is the default when the prop is omitted.

{{"demo": "DensityComparisonDemo.js", "bg": "inline"}}

## Message states

`ChatMessage` adapts to the role and status it reads from the store—no extra props required:

{{"demo": "MessageStatesDemo.js", "bg": "inline"}}

## Applying one-off styles with `sx`

Apply one-off styles directly on `ChatBox`:

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

For global style rules, use `createTheme` with component keys—chat text inherits `theme.typography`, so a `fontFamily` swap re-fonts the whole surface.
Import `'@mui/x-chat/themeAugmentation'` for TypeScript autocomplete:

```tsx
import type {} from '@mui/x-chat/themeAugmentation';

const theme = createTheme({
  typography: { fontFamily: '"Inter", sans-serif' },
  components: {
    MuiChatBox: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: '1px solid',
          borderColor: theme.palette.divider,
        }),
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

For dark mode, CSS class injection, and the full override-key list, see [Material UI customization](/x/react-chat/material/customization/).

## Styling internal slots

Style any internal subcomponent without replacing it:

```tsx
<ChatBox
  slotProps={{
    composerInput: { placeholder: 'Ask anything...' },
    composerSendButton: { sx: { borderRadius: 6 } },
  }}
/>
```

Both techniques applied to a live `ChatBox`—the theme override rounds every bubble, and `slotProps` restyles the send button and placeholder:

{{"demo": "ThemeAndSlotsDemo.js", "bg": "inline"}}

To replace subcomponents entirely, see [Slot overrides](/x/react-chat/material/slot-overrides/).

## CSS class names

Inject custom class names or use the built-in constants for CSS targeting:

```tsx
import { chatBoxClasses } from '@mui/x-chat';

// Class constants: chatBoxClasses.root, chatBoxClasses.layout,
//                  chatBoxClasses.conversationsPane, chatBoxClasses.threadPane

<ChatBox classes={{ root: 'my-chat-root', layout: 'my-chat-layout' }} />;
```

## Tailwind CSS

Prefer to bring your own CSS instead of the Material UI theme? Use the headless primitives: see [Headless components](/x/react-chat/headless/) and [Tailwind CSS](/x/react-chat/material/tailwind/).

The headless primitives from `@mui/x-chat/headless` render semantic HTML with zero built-in styles and `data-*` attributes for state—a natural fit for Tailwind:

```tsx
import { Chat, Composer, Message, MessageList } from '@mui/x-chat/headless';

<Chat.Root adapter={adapter}>
  <Chat.Layout>
    <MessageList.Root renderItem={...} />
    <Composer.Root className="flex flex-col gap-1 border-t border-gray-200 p-3">
      <Composer.TextArea
        className="resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Composer.Toolbar className="flex items-center justify-end gap-2">
        <Composer.SendButton
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white
                     hover:bg-blue-700 disabled:opacity-40"
        />
      </Composer.Toolbar>
    </Composer.Root>
  </Chat.Layout>
</Chat.Root>
```

Use `data-*` attributes for state-based styling without JavaScript:

```tsx
{
  /* data-role="user" or data-role="assistant" */
}
<Message.Root className="flex gap-3 data-[role=user]:flex-row-reverse" />;

{
  /* The button gets the native disabled attribute while the input is empty; data-disabled reflects the composer's disabled prop */
}
<Composer.SendButton className="bg-blue-600 disabled:opacity-40" />;
```

These attributes are rendered by the headless primitives; the Material components consume the same state internally but expose it through classes instead.

| Component               | Attribute           | Values                                                                                |
| :---------------------- | :------------------ | :------------------------------------------------------------------------------------ |
| `Message.Root`          | `data-role`         | `"user"`, `"assistant"`                                                               |
| `Message.Root`          | `data-status`       | `"pending"`, `"sending"`, `"streaming"`, `"sent"`, `"read"`, `"error"`, `"cancelled"` |
| `Composer.SendButton`   | `data-disabled`     | present when the composer is disabled via props                                       |
| `Composer.SendButton`   | `data-has-value`    | present when the input is non-empty                                                   |
| `Composer.Root`         | `data-is-streaming` | present / absent                                                                      |
| `ConversationList.Item` | `data-selected`     | present / absent                                                                      |
