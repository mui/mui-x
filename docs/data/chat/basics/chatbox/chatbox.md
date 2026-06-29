---
productId: x-chat
title: ChatBox
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - ChatBox

<p class="description">Render a complete chat surface with a single import.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatBox` is the fastest way to add a chat interface to your application.
It creates a `ChatProvider` internally and composes the themed header, message list, and composer into a ready-to-use surface.
Enable the built-in conversation list explicitly when you want inbox-style navigation.
ChatBox ships full keyboard navigation and screen-reader support out of the box—see [Accessibility](/x/react-chat/accessibility/).

## Interactive playground

Try the `ChatBox` props live—toggle variant, density, layout mode, and the built-in features:

{{"demo": "ChatBoxPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

The playground starts with `features.conversationList` enabled to showcase the full surface; on `ChatBox` itself the conversation list is off by default.

The `layoutMode` prop controls the responsive arrangement: `standard` shows the conversation list and thread side by side, `overlay` presents the list as a slide-in panel, and `split` shows one pane at a time with back navigation.
When omitted, ChatBox picks the mode automatically from its container width using `layoutModeBreakpoints` (defaults: `overlay: 600`, `split: 450`).
See [Layout](/x/react-chat/basics/layout/) for composing custom arrangements.

In its minimal form, ChatBox needs only an adapter and a height—everything else has defaults. Add `features.conversationList` when you want inbox-style navigation:

```tsx
import { ChatBox } from '@mui/x-chat';

<ChatBox adapter={adapter} sx={{ height: 500 }} />;
<ChatBox
  adapter={adapter}
  features={{ conversationList: true }}
  sx={{ height: 500 }}
/>;
```

All visual styles derive from the active Material UI theme.
No additional configuration is needed—`ChatBox` reads `palette`, `typography`, `shape`, and `spacing` from the closest `ThemeProvider`.

The demo below shows `ChatBox` picking up the active Material UI theme:

{{"demo": "../../material/examples/basic-ai-chat/BasicAiChat.js", "bg": "inline", "defaultCodeOpen": false}}

## ChatBox vs. ChatProvider

### Using ChatBox for an all-in-one surface

`ChatBox` is the right choice when you want a complete chat surface with minimal setup.
It creates a `ChatProvider` internally, so all [hooks](/x/react-chat/resources/hooks/) work inside any component rendered as a child or descendant of `ChatBox`:

{{"demo": "../../material/context/ChatBoxWithHooks.js", "defaultCodeOpen": false, "bg": "inline"}}

### Using ChatProvider for a custom layout

When you need full control over the markup, use `ChatProvider` directly and compose only the pieces you need—here, just the message list and a composer:

{{"demo": "../../material/context/ChatProviderCustomLayout.js", "defaultCodeOpen": false, "bg": "inline"}}

The same approach scales up to a full inbox layout—a conversation list in a sidebar next to the active thread. See the [Layout](/x/react-chat/basics/layout/) page for the building blocks:

{{"demo": "../layout/LayoutTwoPaneStandalone.js", "defaultCodeOpen": false, "bg": "inline"}}

:::warning
`ChatBox` always creates its own internal `ChatProvider`.
If you need to share state with external components, wrap them in a single `ChatProvider` and use the [individual themed components](/x/react-chat/basics/layout/) ([`ChatMessageList`](/x/react-chat/basics/messages/), [`ChatComposer`](/x/react-chat/basics/composer/), etc.) instead of `ChatBox`.
:::

## Feature flags

Everything you saw in the all-in-one surface above is governed by the `features` prop, which toggles built-in capabilities on or off:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    conversationList: true, // show the conversation sidebar / drawer (default false)
    conversationHeader: true, // show the title, subtitle, and actions bar (default true)
    dateDivider: true, // show date separators between calendar days (default false)
    unreadMarker: true, // show the "new messages" marker (default false)
    attachments: false, // disable attachment functionality (default true)
    helperText: false, // hide the helper text below the composer (default true)
    scrollToBottom: false, // disable the scroll-to-bottom affordance (default true)
    autoScroll: { buffer: 300 }, // custom auto-scroll threshold (default true)
    suggestions: false, // hide prompt suggestions in the empty state (default true)
  }}
/>
```

The demo below enables `dateDivider` and `unreadMarker`—the divider marks the day boundary and the marker sits above the first unread message:

{{"demo": "ChatBoxFeatureFlags.js", "defaultCodeOpen": false, "bg": "inline"}}

The `conversationList`, `dateDivider`, and `unreadMarker` flags each have a dedicated page: [Conversation list](/x/react-chat/multi-conversation/conversation-list/), [Date divider](/x/react-chat/display/date-divider/), and [Unread marker](/x/react-chat/display/unread-marker/).

Feature flags let you progressively enable functionality without replacing slots or restructuring the component tree.

## Controlled and uncontrolled state

`ChatBox` supports both controlled and uncontrolled patterns for every piece of state.
These props are forwarded to the internal `ChatProvider`.
See [Controlled state](/x/react-chat/backend/controlled-state/) for the full pattern reference.

### Messages

```tsx
{
  /* Uncontrolled — internal store owns the messages */
}
<ChatBox adapter={adapter} initialMessages={initialMessages} />;

{
  /* Controlled — you own the messages array */
}
<ChatBox adapter={adapter} messages={messages} onMessagesChange={setMessages} />;
```

### Conversations

```tsx
{
  /* Uncontrolled */
}
<ChatBox
  adapter={adapter}
  initialConversations={conversations}
  initialActiveConversationId="conv-1"
  features={{ conversationList: true }}
/>;

{
  /* Controlled */
}
<ChatBox
  adapter={adapter}
  conversations={conversations}
  onConversationsChange={setConversations}
  activeConversationId={activeId}
  onActiveConversationChange={setActiveId}
  features={{ conversationList: true }}
/>;
```

### Composer value

```tsx
{
  /* Uncontrolled */
}
<ChatBox adapter={adapter} initialComposerValue="Hello" />;

{
  /* Controlled */
}
<ChatBox
  adapter={adapter}
  composerValue={composerValue}
  onComposerValueChange={setComposerValue}
/>;
```

Mix controlled and uncontrolled state freely.
For example, control the active conversation while letting the internal store manage messages.

## Multiple independent instances

Each `ChatBox` creates its own isolated store.
To render multiple independent chat surfaces side by side, use separate `ChatBox` instances:

{{"demo": "../../material/context/MultipleInstances.js", "defaultCodeOpen": false, "bg": "inline"}}
