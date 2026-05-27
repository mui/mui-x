---
productId: x-chat
title: Chat - Headless
packageName: '@mui/x-chat/headless'
components: ChatProvider
githubLabel: 'scope: chat'
---

# Chat - Headless

<p class="description">Build chat interfaces from structural React primitives that provide semantics, focus behavior, slots, and owner state without imposing a visual design.</p>

`@mui/x-chat/headless` builds on the core runtime.
It combines core state with structural components such as lists, threads, messages, composers, and indicators.

## When to use the headless layer

Use the headless layer when you want:

- a canonical chat component model
- accessibility and interaction behavior already wired
- slot-based customization instead of rebuilding every subtree
- full control over visual design and styling

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

- structural React primitives such as `Chat.Root`, `ConversationList.Root`, `Conversation.Root`, and `Composer.Root`
- semantics such as `listbox`, `option`, `log`, and `separator`
- keyboard and focus behavior for conversation navigation
- scroll behavior, unseen-message tracking, and history-loading hooks in the message list
- message grouping, date boundaries, and default message-part renderers
- slot and `slotProps` customization with owner state

## Typical shape

Most headless apps compose the surface like this:

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

- [Composition](/x/react-chat/headless/composition/) for the canonical shell and namespace usage
- [Layout](/x/react-chat/headless/layout/) for `Chat.Root` and `Chat.Layout`
- [Conversation list](/x/react-chat/headless/conversation-list/) for list semantics, selection, and roving focus
- [Conversation](/x/react-chat/headless/thread/) for active-conversation context and thread header primitives
- [Message list](/x/react-chat/headless/message-list/) for history loading, date dividers, and scroll behavior
- [Messages](/x/react-chat/headless/messages/) for `MessageGroup`, message subparts, and default part renderers
- [Composer](/x/react-chat/headless/composer/) for form submission, autosizing, attachments, and IME-safe input
- [Indicators](/x/react-chat/headless/indicators/) for typing, unread, and scroll affordances
- [Customization](/x/react-chat/headless/customization/) for slots, owner state, and styling strategy
- [Examples](/x/react-chat/headless/examples/) for end-to-end composition demos

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

You can also import individual components such as `ChatRoot`, `MessageListRoot`, or `ComposerTextArea` when you prefer explicit component names in your codebase.

Use namespaced imports when you want the API to read like a component family.
Use direct imports when a codebase prefers local, explicit symbols or when only one or two primitives are needed in a file.

## See also

- Start with [Composition](/x/react-chat/headless/composition/) for the canonical shell.
- Continue with [Layout](/x/react-chat/headless/layout/) and [Conversation list](/x/react-chat/headless/conversation-list/) for the main application skeleton.
- Use [Examples](/x/react-chat/headless/examples/) when you want end-to-end patterns rather than component reference pages.

## API

- [ChatRoot](/x/api/chat/chat-root/)
- [ChatLayout](/x/api/chat/chat-layout/)

## Package boundary

- Runtime contracts, adapters, store semantics, and hooks belong in [Core](/x/react-chat/core/).
