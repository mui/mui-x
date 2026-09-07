---
productId: x-chat
title: Chat - Headless
packageName: '@mui/x-chat/headless'
components: ChatProvider
githubLabel: 'scope: chat'
---

# Chat - Headless

<p class="description">Compose chat interfaces from structural React primitives that handle semantics, focus, slots, and owner state without imposing a visual design.</p>

The Chat headless package builds on the core runtime.
It combines core state with structural components such as lists, threads, messages, composers, and indicators.

## When to use the headless layer

Use the headless layer when you want:

- A canonical chat component model.
- Accessibility and interaction behavior already wired.
- Slot-based customization instead of rebuilding every subtree.
- Full control over visual design and styling.

Use the core layer when you want to own all DOM structure yourself.

## Package surface

The headless package is organized into structural namespaces:

- `Chat`
- `ConversationList`
- `Conversation`
- `MessageList`
- `MessageGroup`
- `Message`
- `Composer`
- `Indicators`

It also exports helpers for default message-part rendering, which are documented in
[Messages](/x/react-chat/headless/messages/).

## What the headless layer owns

- Structural React primitives such as `Chat.Root`, `ConversationList.Root`, `Conversation.Root`, and `Composer.Root`.
- Semantics such as `listbox`, `option`, `log`, and `separator`.
- Keyboard and focus behavior for conversation navigation.
- Scroll behavior, unseen-message tracking, and history-loading hooks in the message list.
- Message grouping, date boundaries, and default message-part renderers.
- Slot and `slotProps` customization with owner state.

## Composing the headless surface

Compose the headless surface as shown below:

```tsx
import {
  Chat,
  Composer,
  ConversationList,
  MessageGroup,
  MessageList,
  Conversation,
} from '@mui/x-chat/headless';

function Inbox(props: ChatRootProps) {
  return (
    <Chat.Root {...props}>
      <Chat.Layout>
        <ConversationList.Root />
        <Conversation.Root>
          <Conversation.Header>
            <Conversation.Title />
            <Conversation.Subtitle />
          </Conversation.Header>
          <MessageList.Root
            renderItem={({ id, index }) => (
              <MessageGroup index={index} messageId={id} />
            )}
          />
          <Composer.Root>
            <Composer.TextArea />
            <Composer.Toolbar>
              <Composer.AttachButton />
              <Composer.SendButton />
            </Composer.Toolbar>
          </Composer.Root>
        </Conversation.Root>
      </Chat.Layout>
    </Chat.Root>
  );
}
```

This gives you a complete structural shell while keeping the visual treatment in your own CSS, slots, or design-system components.

## Documentation map

- See [Composition](/x/react-chat/headless/composition/) for the canonical shell and namespace usage.
- See [Layout](/x/react-chat/headless/layout/) for details on `Chat.Root` and `Chat.Layout`.
- See [Conversation list](/x/react-chat/headless/conversation-list/) for list semantics, selection, and roving focus.
- See [Conversation](/x/react-chat/headless/thread/) for active-conversation context and thread header primitives.
- See [Message list](/x/react-chat/headless/message-list/) for history loading, date dividers, and scroll behavior.
- See [Messages](/x/react-chat/headless/messages/) for `MessageGroup`, message subparts, and default part renderers.
- See [Composer](/x/react-chat/headless/composer/) for form submission, autosizing, attachments, and IME-safe input.
- See [Indicators](/x/react-chat/headless/indicators/) for typing, unread, and scroll affordances.
- See [Customization](/x/react-chat/headless/customization/) for slots, owner state, and styling strategy.
- See [Examples](/x/react-chat/headless/examples/) for end-to-end composition demos.

## Namespaces and direct imports

The package exports both namespaced and direct primitives:

```tsx
import {
  Chat,
  ConversationList,
  Conversation,
  MessageList,
  MessageGroup,
  Message,
  Composer,
  Indicators,
} from '@mui/x-chat/headless';
```

Import individual components such as `ChatRoot`, `MessageListRoot`, or `ComposerTextArea` when you prefer explicit names.
Use namespaced imports when the API should read like a component family.
Use direct imports when a codebase prefers local symbols or only needs one or two primitives in a file.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
- [`ChatLayout`](/x/api/chat/chat-layout/)

## Package boundary with Core

Runtime contracts, adapters, store semantics, and hooks belong in [Core](/x/react-chat/core/).
