---
productId: x-chat
title: Chat - Unstyled composition
packageName: '@mui/x-chat/unstyled'
components: ChatRoot, ChatLayout
---

# Unstyled composition

<p class="description">Compose a complete chat UI from the unstyled namespaces while keeping styling decisions in your own code.</p>

{{"demo": "../examples/minimal-shell/MinimalUnstyledShell.js"}}

The canonical unstyled shell combines a provider-backed root, a pane layout, a conversation rail, a thread view, a message list, and a composer.

```tsx
import {
  Chat,
  Composer,
  ConversationList,
  MessageGroup,
  MessageList,
  Conversation,
} from '@mui/x-chat/unstyled';

function ChatSurface(props: ChatRootProps) {
  return (
    <Chat.Root {...props}>
      <Chat.Layout>
        <ConversationList.Root />
        <Conversation.Root>
          <Conversation.Header>
            <Conversation.Title />
            <Conversation.Subtitle />
            <Conversation.HeaderActions />
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

## Recommended reading order

Composition is the best entry point when you are starting from a blank screen.
It shows how the primitive groups fit together before you drill into individual pages such as
[Layout](/x/react-chat/unstyled/layout/), [Messages](/x/react-chat/unstyled/messages/), or
[Composer](/x/react-chat/unstyled/composer/).

## What composition gives you

- structural defaults for the main chat regions
- active-conversation wiring between the conversation list and thread
- message list semantics and list-management behavior
- grouped message composition without custom row bookkeeping
- a form-based conversation input with submission and attachment plumbing

## `Chat.Root` versus `ChatProvider`

`Chat.Root` is the unstyled entry point for pages that want both provider setup and UI structure in one place.
It accepts the same runtime props as the headless provider, then renders your structural surface through a root slot.

Choose `Chat.Root` when you want:

- a single component to own the runtime boundary
- unstyled primitives everywhere below the root
- slot replacement on the outer shell

Choose `ChatProvider` directly when only part of the tree should use unstyled primitives or when a page mixes several rendering approaches.

## Namespace usage

The namespaced exports are useful when you want the API to read like a component family:

- `Chat.Root` and `Chat.Layout`
- `ConversationList.Root`, `ConversationList.Item`, `ConversationList.ItemAvatar`, `ConversationList.Title`, `ConversationList.Preview`, `ConversationList.Timestamp`, and `ConversationList.UnreadBadge`
- `Conversation.Root`, `Conversation.Header`, `Conversation.Title`, `Conversation.Subtitle`, and `Conversation.HeaderActions`
- `MessageList.Root` and `MessageList.DateDivider`
- `Message.Root`, `Message.Avatar`, `Message.Content`, `Message.Meta`, and `Message.Actions`
- `Composer.Root`, `Composer.TextArea`, `Composer.Toolbar`, `Composer.AttachButton`, `Composer.HelperText`, and `Composer.SendButton`
- `Indicators.TypingIndicator`, `Indicators.UnreadMarker`, and `Indicators.ScrollToBottomAffordance`

Direct imports are useful when a codebase prefers explicit component names or tree-local imports.

## Common composition variations

The canonical shell is not the only valid unstyled layout.

### Focused thread

Use only the thread pane when a page already chooses the active conversation elsewhere:

```tsx
<Chat.Root {...props}>
  <Chat.Layout>
    <Conversation.Root>
      <Conversation.Header>
        <Conversation.Title />
        <Conversation.Subtitle />
      </Conversation.Header>
      <MessageList.Root
        renderItem={({ id, index }) => <MessageGroup index={index} messageId={id} />}
      />
      <Composer.Root>
        <Composer.TextArea />
        <Composer.SendButton />
      </Composer.Root>
    </Conversation.Root>
  </Chat.Layout>
</Chat.Root>
```

### Custom row pipeline

When a thread needs unread markers, date dividers, indicators, or custom message actions, keep those concerns inside `renderItem` so they stay aligned with message ordering:

```tsx
<MessageList.Root
  renderItem={({ id, index }) => (
    <>
      <Indicators.UnreadMarker index={index} messageId={id} />
      <MessageList.DateDivider index={index} messageId={id} />
      <MessageGroup index={index} messageId={id} />
    </>
  )}
/>
```

## What unstyled owns

- semantics and accessibility roles
- structural composition defaults
- focus and keyboard behavior
- slot replacement and owner-state-driven customization

## What unstyled does not own

- transport and backend integration details
- normalized store semantics and runtime contracts
- a visual design system, theme, or polished default look

For runtime behavior, continue with [Headless](/x/react-chat/headless/).
For styling and theming patterns, continue with [Customization](/x/react-chat/unstyled/customization/).
For concrete patterns, continue with [Examples](/x/react-chat/unstyled/examples/).
