---
productId: x-chat
title: Chat - Material UI customization
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatRoot
---

# Chat - Customization

<p class="description">Override styles, replace subcomponents, and pass props to any chat element using the Material UI customization system.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The demo below shows a custom-themed chat surface:

{{"demo": "../examples/custom-theme/CustomTheme.js", "bg": "inline", "defaultCodeOpen": false, "hideToolbar": true}}

## Styling the root element with the sx prop

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

Use `createTheme()` to apply style overrides globally across the application.
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

## Injecting custom class names

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

## Passing props to internal subcomponents

Pass props directly to any internal subcomponent using `slotProps`—useful for setting `aria-label` attributes, applying `sx` overrides, or supplying other component-specific props without replacing the component:

```tsx
<ChatBox
  slotProps={{
    conversation: {
      list: { 'aria-label': 'Chat threads' },
    },
    composer: {
      input: { placeholder: 'Ask anything...' },
      send: { sx: { borderRadius: 6 } },
    },
  }}
/>
```

### Available slotProps keys

| Key                 | Type                                         | Description                                                                              |
| :------------------ | :------------------------------------------- | :--------------------------------------------------------------------------------------- |
| `root`              | `SlotComponentProps<'div'>`                  | Outermost div                                                                            |
| `layout`            | `SlotComponentProps<'div'>`                  | Layout div                                                                               |
| `conversationsPane` | `SlotComponentProps<'div'>`                  | Conversations pane div                                                                   |
| `threadPane`        | `SlotComponentProps<'div'>`                  | Thread pane div                                                                          |
| `conversation`      | `ChatBoxConversationSlotProps`               | Conversation family (root, list, header, title, subtitle, headerInfo, headerActions)     |
| `messagesList`      | `ChatBoxMessagesListSlotProps`               | List family (root, group, dateDivider, unreadMarker)                                     |
| `message`           | `ChatBoxMessageSlotProps`                    | Per-message family (root, avatar, content, meta, inlineMeta, error, actions, authorName) |
| `composer`          | `ChatBoxComposerSlotProps`                   | Composer family (root, input, send, attach, attachmentList, toolbar, helperText)         |
| `typingIndicator`   | `Partial<ChatTypingIndicatorProps>`          | Typing indicator                                                                         |
| `scrollToBottom`    | `Partial<ChatScrollToBottomAffordanceProps>` | Scroll to bottom button                                                                  |
| `suggestions`       | `Partial<ChatSuggestionsProps>`              | Suggestions component                                                                    |
| `emptyState`        | `SlotComponentProps<'div'>`                  | Custom empty-thread div                                                                  |

## Replacing subcomponents with slots

Replace any subcomponent entirely using the `slots` prop.
The replacement component must accept the same props as the default.
See [Slot overrides](/x/react-chat/material/examples/slot-overrides/) for details.

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

<ChatBox slots={{ message: { content: CustomMessageContent } }} />;
```

### Available slots

| Key                          | Default component               | Description                  |
| :--------------------------- | :------------------------------ | :--------------------------- |
| `root`                       | `div`                           | Outermost container          |
| `layout`                     | `div`                           | Layout element               |
| `conversationsPane`          | `div`                           | Conversations sidebar pane   |
| `threadPane`                 | `div`                           | Thread pane                  |
| `conversation.root`          | `ChatConversation`              | Thread wrapper               |
| `conversation.list`          | `ChatConversationList`          | Conversation sidebar list    |
| `conversation.header`        | `ChatConversationHeader`        | Thread header                |
| `conversation.title`         | `ChatConversationTitle`         | Thread title text            |
| `conversation.subtitle`      | `ChatConversationSubtitle`      | Thread subtitle text         |
| `conversation.headerActions` | `ChatConversationHeaderActions` | Header action area           |
| `messagesList.root`          | `ChatMessageList`               | Virtualized message list     |
| `messagesList.group`         | `ChatMessageGroup`              | Groups consecutive messages  |
| `messagesList.dateDivider`   | `ChatDateDivider`               | Date boundary separator      |
| `messagesList.unreadMarker`  | `ChatUnreadMarker`              | Unread marker                |
| `message.root`               | `ChatMessage`                   | Each message container       |
| `message.avatar`             | `ChatMessageAvatar`             | Message avatar (`null` hides)|
| `message.content`            | `ChatMessageContent`            | Message content/bubble       |
| `message.meta`               | `ChatMessageMeta`               | External timestamp (compact) |
| `message.inlineMeta`         | `ChatMessageInlineMeta`         | Inline timestamp (default)   |
| `message.error`              | `ChatMessageError`              | Error card                   |
| `message.actions`            | `ChatMessageActions`            | Message action menu          |
| `message.authorName`         | styled `div`                    | Author label (`null` hides)  |
| `composer.root`              | `ChatComposer`                  | Composer form                |
| `composer.input`             | `ChatComposerTextArea`          | Textarea input               |
| `composer.send`              | `ChatComposerSendButton`        | Send button                  |
| `composer.attach`            | `ChatComposerAttachButton`      | Attach button                |
| `composer.attachmentList`    | `ChatComposerAttachmentList`    | Selected file pills          |
| `composer.toolbar`           | `ChatComposerToolbar`           | Toolbar container            |
| `composer.helperText`        | `ChatComposerHelperText`        | Helper text                  |
| `typingIndicator`            | `ChatTypingIndicator`           | Typing indicator             |
| `scrollToBottom`             | `ChatScrollToBottomAffordance`  | Scroll to bottom affordance  |
| `suggestions`                | `ChatSuggestions`               | Prompt suggestion chips      |
| `emptyState`                 | _none_                          | Custom empty-thread view     |

## See also

- [Examples](/x/react-chat/material/examples/) for end-to-end customization demos

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
