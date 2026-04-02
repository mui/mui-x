---
productId: x-chat
title: ChatBox
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - ChatBox

<p class="description">The all-in-one component that renders a complete chat surface with a single import.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

## Overview

`ChatBox` is the fastest way to add a chat interface to your application.
It creates a `ChatProvider` internally and composes every themed sub-component — conversation list, thread header, message list, and composer — into a ready-to-use surface:

```tsx
import { ChatBox } from '@mui/x-chat';

<ChatBox adapter={adapter} sx={{ height: 500 }} />;
```

All visual styles are derived from your active Material UI theme.
No additional configuration is needed — `ChatBox` reads `palette`, `typography`, `shape`, and `spacing` from the closest `ThemeProvider`.

{{"demo": "../../material/examples/basic-ai-chat/BasicAiChat.js", "bg": "inline", "defaultCodeOpen": false}}

## ChatBox vs. ChatProvider

### ChatBox (all-in-one)

`ChatBox` is the right choice when you want a complete chat surface with minimal setup.
It creates a `ChatProvider` internally, so all headless hooks work inside any component rendered as a child or descendant of `ChatBox`:

{{"demo": "../../material/context/ChatBoxWithHooks.js", "defaultCodeOpen": false, "bg": "inline"}}

### ChatProvider (custom layout)

When you need full control over the layout — for example, placing the conversation list in a sidebar and the thread in a main content area — use `ChatProvider` directly and compose the pieces yourself:

{{"demo": "../../material/context/ChatProviderCustomLayout.js", "defaultCodeOpen": false, "bg": "inline"}}

:::warning
`ChatBox` always creates its own internal `ChatProvider`. If you need to share state with external components, wrap them in a single `ChatProvider` and use the individual themed components (`ChatMessageList`, `ChatComposer`, etc.) instead of `ChatBox`.
:::

## Feature flags

`ChatBox` accepts a `features` prop that toggles built-in capabilities on or off:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    attachments: false, // hide the attach button
    helperText: false, // hide the helper text
    scrollToBottom: false, // disable scroll-to-bottom affordance
    autoScroll: { buffer: 300 }, // custom auto-scroll threshold
  }}
/>
```

Feature flags let you progressively enable functionality without replacing slots or restructuring the component tree.

## Package model

`@mui/x-chat` is the Material UI styling layer of a three-tier package family:

```text
@mui/x-chat
  -> @mui/x-chat/unstyled
       -> @mui/x-chat/headless
```

Each layer builds on the one below it:

- **Material UI** (`@mui/x-chat`) adds visual styles via Material UI `styled()` on top of the unstyled primitives.
- **Unstyled** (`@mui/x-chat/unstyled`) adds structural DOM wiring, slots, and accessibility on top of the headless runtime.
- **Headless** (`@mui/x-chat/headless`) owns state, streaming, adapters, and hooks with no DOM output.

### Choosing a layer

| If you want…                                                                   | Use                    |
| :----------------------------------------------------------------------------- | :--------------------- |
| A styled chat surface that inherits your MUI theme with minimal setup          | `@mui/x-chat`          |
| Full control over visual design using your own CSS, Tailwind, or design system | `@mui/x-chat/unstyled` |
| Complete control over DOM structure with only React state and hooks            | `@mui/x-chat/headless` |

### Package boundary

`@mui/x-chat` re-exports `@mui/x-chat/headless` and `@mui/x-chat/unstyled` through dedicated entry points:

```tsx
// Headless hooks and types
import { useChat, useChatComposer } from '@mui/x-chat/headless';

// Unstyled structural primitives
import { Chat, MessageList } from '@mui/x-chat/unstyled';
```

This means you can mix the styled layer with lower-level primitives in the same application.

## Controlled and uncontrolled state

`ChatBox` supports both controlled and uncontrolled patterns for every piece of state.
These props are forwarded to the internal `ChatProvider`.

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

You can mix controlled and uncontrolled state freely.
For example, control the active conversation while letting messages be managed internally.

## Multiple independent instances

Each `ChatBox` creates its own isolated store.
To render multiple independent chat surfaces side by side, use separate `ChatBox` instances:

{{"demo": "../../material/context/MultipleInstances.js", "defaultCodeOpen": false, "bg": "inline"}}

## API

- [`ChatBox`](/x/api/chat/chat-box/)

## Next steps

- [Messages](/x/react-chat/basics/messages/) — the message data model and how messages render
- [Composer](/x/react-chat/basics/composer/) — the text input experience
- [Layout](/x/react-chat/basics/layout/) — the two-pane structure and thread-only mode
- [Variants & Density](/x/react-chat/basics/variants-and-density/) — compact variant and density levels
