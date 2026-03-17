---
productId: x-chat
title: Chat - Unstyled
packageName: '@mui/x-chat-unstyled'
---

# Chat - Unstyled

<p class="description">Build chat interfaces from structural React primitives that provide semantics, focus behavior, slots, and owner state without imposing a visual design.</p>

`@mui/x-chat-unstyled` sits between the headless runtime and the future Material layer.
It combines `@mui/x-chat-headless` state with structural components such as lists, threads, messages, composers, and indicators.

## When to use the unstyled layer

Use the unstyled layer when you want:

- a canonical chat component model
- accessibility and interaction behavior already wired
- slot-based customization instead of rebuilding every subtree
- full control over visual design and styling

Use the headless layer when you want to own all DOM structure yourself.
Use the Material layer when you want a styled, MUI-native surface.

## Package surface

The unstyled package is organized into structural namespaces:

- `Chat`
- `ConversationList`
- `Thread`
- `MessageList`
- `MessageGroup`
- `Message`
- `Composer`
- `Indicators`

It also exports helpers for default message-part rendering, which are documented in
[Messages](/x/react-chat/unstyled/messages/).

## What the unstyled layer owns

- structural React primitives such as `Chat.Root`, `ConversationList.Root`, `Thread.Root`, and `Composer.Root`
- semantics such as `listbox`, `option`, `log`, and `separator`
- keyboard and focus behavior for conversation navigation
- scroll behavior, unseen-message tracking, and history-loading hooks in the message list
- message grouping, date boundaries, and default message-part renderers
- slot and `slotProps` customization with owner state

## Typical shape

Most unstyled apps compose the surface like this:

```tsx
import {
  Chat,
  Composer,
  ConversationList,
  MessageGroup,
  MessageList,
  Thread,
} from '@mui/x-chat-unstyled';

function Inbox(props: ChatRootProps) {
  return (
    <Chat.Root {...props}>
      <Chat.Layout>
        <ConversationList.Root />
        <Thread.Root>
          <Thread.Header>
            <Thread.Title />
            <Thread.Subtitle />
          </Thread.Header>
          <MessageList.Root
            renderItem={({ id, index }) => (
              <MessageGroup index={index} messageId={id} />
            )}
          />
          <Composer.Root>
            <Composer.Input />
            <Composer.Toolbar>
              <Composer.AttachButton />
              <Composer.SendButton />
            </Composer.Toolbar>
          </Composer.Root>
        </Thread.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
```

This gives you a complete structural shell while keeping the visual treatment in your own CSS, slots, or design-system components.

## Documentation map

- [Composition](/x/react-chat/unstyled/composition/) for the canonical shell and namespace usage
- [Layout](/x/react-chat/unstyled/layout/) for `Chat.Root` and `Chat.Layout`
- [Conversation list](/x/react-chat/unstyled/conversation-list/) for list semantics, selection, and roving focus
- [Thread](/x/react-chat/unstyled/thread/) for active-conversation context and thread header primitives
- [Message list](/x/react-chat/unstyled/message-list/) for virtualization, history loading, date dividers, and scroll behavior
- [Messages](/x/react-chat/unstyled/messages/) for `MessageGroup`, message subparts, and default part renderers
- [Composer](/x/react-chat/unstyled/composer/) for form submission, autosizing, attachments, and IME-safe input
- [Indicators](/x/react-chat/unstyled/indicators/) for typing, unread, and scroll affordances
- [Customization](/x/react-chat/unstyled/customization/) for slots, owner state, and styling strategy
- [Examples](/x/react-chat/unstyled/examples/) for end-to-end composition recipes

## Namespaces and direct imports

The package exports both namespaced and direct primitives:

```tsx
import {
  Chat,
  ConversationList,
  Thread,
  MessageList,
  MessageGroup,
  Message,
  Composer,
  Indicators,
} from '@mui/x-chat-unstyled';
```

You can also import individual components such as `ChatRoot`, `MessageListRoot`, or `ComposerInput` when you prefer explicit component names in your codebase.

Use namespaced imports when you want the API to read like a component family.
Use direct imports when a codebase prefers local, explicit symbols or when only one or two primitives are needed in a file.

## What to read next

- Start with [Composition](/x/react-chat/unstyled/composition/) for the canonical shell.
- Continue with [Layout](/x/react-chat/unstyled/layout/) and [Conversation list](/x/react-chat/unstyled/conversation-list/) for the main application skeleton.
- Use [Examples](/x/react-chat/unstyled/examples/) when you want end-to-end patterns rather than component reference pages.

## Package boundary

- Runtime contracts, adapters, store semantics, and headless hooks belong in [Headless](/x/react-chat/headless/).
- Styled defaults, theming, and high-level product surfaces belong in [Material UI](/x/react-chat/material/).
