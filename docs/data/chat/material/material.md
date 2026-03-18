---
productId: x-chat
title: Chat - Material UI
packageName: '@mui/x-chat'
---

# Chat - Material UI

<p class="description">Use <code>@mui/x-chat</code> when you want a complete, theme-aware chat UI with a one-liner entry point and MUI-native customization hooks.</p>

`@mui/x-chat` is the styled layer on top of the unstyled and headless chat packages.
It keeps the same runtime model, localization contract, and part-renderer API, but ships a Material UI surface for the common production case:

- `ChatBox` as the flagship one-liner API
- modular styled components for conversations, thread, messages, composer, and indicators
- `slots`, `slotProps`, `sx`, and theme augmentation for customization

## `ChatBox` one-liner API

`ChatBox` wraps the runtime root and composes a full chat shell for you.
It forwards the headless controlled and uncontrolled props directly to the underlying provider, so the entry point stays high level without hiding state ownership.

{{"demo": "ChatBoxOneLiner.js"}}

### What it renders

- `ChatConversations` when a conversations source exists
- `ChatConversation`
- `ChatConversationInput`

### Layout modes

`ChatBox` auto-detects whether it should render a two-pane or thread-only layout:

- two-pane when any conversations source exists: `conversations`, `defaultConversations`, or `adapter.listConversations`
- thread-only when no conversations source exists

## Controlled and uncontrolled state

`ChatBox` accepts the same state ownership model as `ChatRoot`:

```tsx
<ChatBox
  adapter={adapter}
  activeConversationId={activeConversationId}
  conversations={conversations}
  messages={messages}
  onActiveConversationChange={setActiveConversationId}
  onConversationsChange={setConversations}
  onMessagesChange={setMessages}
/>
```

That means you can start with a default, self-managed surface and then progressively lift state as product requirements become more specific.

## Customization through mirrored slots

`ChatBox` keeps the region-level replacement slots for the whole conversations pane, thread, and composer.
It also mirrors the most important nested slots from the composed styled components, so common customization does not require dropping down to manual composition.

{{"demo": "ChatBoxSlotCustomization.js"}}

The most common slot entry points are:

- `conversationTitle`, `conversationPreview`, `conversationUnreadBadge`
- `messageContent`, `messageBubble`, `messageMeta`, `messageActions`
- `typingIndicator`, `scrollToBottomAffordance`
- `composerInput`, `composerSendButton`, `composerAttachButton`, `composerHelperText`

Use the mirrored slot surface when you want to keep the one-liner API and only swap or restyle one nested region.
If you need to own the full pane behavior, replace `conversations`, `thread`, or `composer` directly.

## Localization and part renderers

`ChatBox` uses the same `localeText` and `partRenderers` contracts as the lower layers.

```tsx
<ChatBox
  adapter={adapter}
  localeText={{
    composerInputPlaceholder: 'Ask anything',
    retryButtonLabel: 'Try again',
  }}
  partRenderers={{
    text: (props) => <MyMarkdownRenderer {...props} />,
  }}
/>
```

`localeText` stays the canonical localization prop for the chat stack.
There is no `locale` alias on the Material layer.

## Theming and overrides

The styled layer supports both direct `sx` customization and theme augmentation.

```tsx
import type {} from '@mui/x-chat/themeAugmentation';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiChatBox: {
      styleOverrides: {
        root: {
          minHeight: 640,
        },
      },
    },
  },
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

## Related APIs

- Use [Headless](/x/react-chat/headless/) when you need to own the runtime, store, and rendering contracts directly.
- Use [Unstyled](/x/react-chat/unstyled/) when you want structural primitives but not the Material presentation.
