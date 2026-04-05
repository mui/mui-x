---
productId: x-chat
title: Chat - Material UI customization
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatRoot
---

# Chat - Customization

Override styles, replace sub-components, and pass props to any chat element using the Material UI customization system.



The following demo shows a custom-themed chat surface:

```tsx
'use client';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const tealTheme = createTheme({
  palette: {
    primary: {
      main: '#00796b',
      light: '#48a999',
      dark: '#004c40',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6f00',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". Notice how the bubble colors, border radius, and typography all come from the custom teal theme — no extra CSS required.`,
});

export default function CustomTheme() {
  return (
    <ThemeProvider theme={tealTheme}>
      <CssBaseline />
      <ChatBox
        adapter={adapter}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
        sx={{
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '12px',
        }}
      />
    </ThemeProvider>
  );
}

```

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
        root: {
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 8,
        },
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

## slotProps

Pass props directly to any internal sub-component using `slotProps`.
This is useful for setting `aria-label` attributes, `sx` overrides, or other component-specific props without replacing the component:

```tsx
<ChatBox
  slotProps={{
    conversationList: { 'aria-label': 'Chat threads' },
    composerInput: { placeholder: 'Ask anything...' },
    composerSendButton: { sx: { borderRadius: 6 } },
  }}
/>
```

### Available slotProps keys

| Key                    | Type                                         | Description             |
| :--------------------- | :------------------------------------------- | :---------------------- |
| `root`                 | `SlotComponentProps<'div'>`                  | Outermost div           |
| `layout`               | `SlotComponentProps<'div'>`                  | Layout div              |
| `conversationsPane`    | `SlotComponentProps<'div'>`                  | Conversations pane div  |
| `threadPane`           | `SlotComponentProps<'div'>`                  | Thread pane div         |
| `conversationList`     | `Partial<ChatConversationListProps>`         | Conversation list       |
| `conversationHeader`   | `Partial<ChatConversationHeaderProps>`       | Thread header           |
| `conversationTitle`    | `Partial<ChatConversationTitleProps>`        | Thread title            |
| `conversationSubtitle` | `Partial<ChatConversationSubtitleProps>`     | Thread subtitle         |
| `messageList`          | `Partial<ChatMessageListProps>`              | Message list            |
| `messageRoot`          | `Partial<ChatMessageProps>`                  | Each message container  |
| `messageAvatar`        | `Partial<ChatMessageAvatarProps>`            | Message avatar          |
| `messageContent`       | `Partial<ChatMessageContentProps>`           | Message content/bubble  |
| `messageMeta`          | `Partial<ChatMessageMetaProps>`              | Message timestamp       |
| `messageActions`       | `Partial<ChatMessageActionsProps>`           | Message action menu     |
| `messageGroup`         | `Partial<ChatMessageGroupProps>`             | Message group container |
| `dateDivider`          | `Partial<ChatDateDividerProps>`              | Date separator          |
| `composerRoot`         | `Partial<ChatComposerProps>`                 | Composer form root      |
| `composerInput`        | `Partial<ChatComposerTextAreaProps>`         | Composer textarea       |
| `composerSendButton`   | `Partial<ChatComposerSendButtonProps>`       | Send button             |
| `composerAttachButton` | `Partial<ChatComposerAttachButtonProps>`     | Attach button           |
| `composerToolbar`      | `Partial<ChatComposerToolbarProps>`          | Toolbar container       |
| `composerHelperText`   | `Partial<ChatComposerHelperTextProps>`       | Helper text below input |
| `typingIndicator`      | `Partial<ChatTypingIndicatorProps>`          | Typing indicator        |
| `unreadMarker`         | `Partial<ChatUnreadMarkerProps>`             | Unread marker           |
| `scrollToBottom`       | `Partial<ChatScrollToBottomAffordanceProps>` | Scroll to bottom button |

## slots

Replace any sub-component entirely using the `slots` prop.
The replacement component must accept the same props as the default.
See [Slot overrides](/x/react-chat/material/examples/slot-overrides/) for a runnable demo using a `Paper`-based bubble.

A common pattern is to wrap the default component and override one of its inner slots:

```tsx
const CustomMessageContent = React.forwardRef(
  function CustomMessageContent(props, ref) {
    return (
      <ChatMessageContent
        ref={ref}
        {...props}
        slots={{ ...props.slots, bubble: MyBubble }}
      />
    );
  },
);

<ChatBox slots={{ messageContent: CustomMessageContent }} />;
```

### Available slots

| Key                         | Default component               | Description                  |
| :-------------------------- | :------------------------------ | :--------------------------- |
| `root`                      | `div`                           | Outermost container          |
| `layout`                    | `div`                           | Layout element               |
| `conversationsPane`         | `div`                           | Conversations sidebar pane   |
| `threadPane`                | `div`                           | Thread pane                  |
| `conversationList`          | `ChatConversationList`          | Conversation list            |
| `conversationHeader`        | `ChatConversationHeader`        | Thread header                |
| `conversationTitle`         | `ChatConversationTitle`         | Thread title text            |
| `conversationSubtitle`      | `ChatConversationSubtitle`      | Thread subtitle text         |
| `conversationHeaderActions` | `ChatConversationHeaderActions` | Header action area           |
| `messageList`               | `ChatMessageList`               | Virtualized message list     |
| `messageRoot`               | `ChatMessage`                   | Each message container       |
| `messageAvatar`             | `ChatMessageAvatar`             | Message avatar               |
| `messageContent`            | `ChatMessageContent`            | Message content/bubble       |
| `messageMeta`               | `ChatMessageMeta`               | Message timestamp and status |
| `messageActions`            | `ChatMessageActions`            | Message action menu          |
| `messageGroup`              | `ChatMessageGroup`              | Groups consecutive messages  |
| `dateDivider`               | `ChatDateDivider`               | Date boundary separator      |
| `composerRoot`              | `ChatComposer`                  | Composer form                |
| `composerInput`             | `ChatComposerTextArea`          | Textarea input               |
| `composerSendButton`        | `ChatComposerSendButton`        | Send button                  |
| `composerAttachButton`      | `ChatComposerAttachButton`      | Attach button                |
| `composerToolbar`           | `ChatComposerToolbar`           | Toolbar container            |
| `composerHelperText`        | `ChatComposerHelperText`        | Helper text                  |
| `typingIndicator`           | `ChatTypingIndicator`           | Typing indicator             |
| `unreadMarker`              | `ChatUnreadMarker`              | Unread message marker        |
| `scrollToBottom`            | `ChatScrollToBottomAffordance`  | Scroll to bottom affordance  |

## See also

- [Examples](/x/react-chat/material/examples/) for end-to-end customization demos

## API

- [ChatRoot](/x/api/chat/chat-root/)
