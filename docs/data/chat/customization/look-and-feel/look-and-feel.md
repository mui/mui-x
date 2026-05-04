---
productId: x-chat
title: Look & Feel
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Look & Feel

<p class="description">Change colors, layout style, density, and typography — from quick props to full brand theming.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Pick a layout style

The `variant` prop controls how messages are arranged:

```tsx
// Bubbles — colored message bubbles, right-aligned for user (WhatsApp, Telegram)
<ChatBox adapter={adapter} variant="default" />

// Flat — no bubbles, stacked messages with inline sender info (Slack, ChatGPT, Claude)
<ChatBox adapter={adapter} variant="compact" />
```

## Pick a density

The `density` prop controls vertical spacing between messages:

```tsx
<ChatBox adapter={adapter} density="compact" />     // Tight spacing
<ChatBox adapter={adapter} density="comfortable" />  // Spacious
```

## The `sx` prop

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

For global style rules, use `createTheme` with component keys.
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

## Targeted styling with `slotProps`

Style any internal subcomponent without replacing it:

```tsx
<ChatBox
  slotProps={{
    composerInput: { placeholder: 'Ask anything...' },
    composerSendButton: { sx: { borderRadius: 6 } },
  }}
/>
```

## CSS class names

Inject custom class names or use the built-in constants for CSS targeting:

```tsx
import { chatBoxClasses } from '@mui/x-chat';

// Class constants: chatBoxClasses.root, chatBoxClasses.layout,
//                  chatBoxClasses.conversationsPane, chatBoxClasses.threadPane

<ChatBox classes={{ root: 'my-chat-root', layout: 'my-chat-layout' }} />;
```

## Tailwind CSS

The headless primitives from `@mui/x-chat/headless` render semantic HTML with zero built-in styles and `data-*` attributes for state — a natural fit for Tailwind:

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
                     hover:bg-blue-700 data-[disabled]:opacity-40"
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
  /* data-disabled is present when input is empty */
}
<Composer.SendButton className="bg-blue-600 data-[disabled]:opacity-40" />;
```

| Component               | Attribute           | Values                                                                      |
| :---------------------- | :------------------ | :-------------------------------------------------------------------------- |
| `Message.Root`          | `data-role`         | `"user"`, `"assistant"`                                                     |
| `Message.Root`          | `data-status`       | `"pending"`, `"sending"`, `"streaming"`, `"sent"`, `"error"`, `"cancelled"` |
| `Composer.SendButton`   | `data-disabled`     | present / absent                                                            |
| `Composer.Root`         | `data-is-streaming` | present / absent                                                            |
| `ConversationList.Item` | `data-selected`     | present / absent                                                            |
