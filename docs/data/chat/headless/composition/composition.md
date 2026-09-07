---
productId: x-chat
title: Chat - Headless composition
packageName: '@mui/x-chat/headless'
components: ChatRoot, ChatLayout
githubLabel: 'scope: chat'
---

# Chat - Headless composition

<p class="description">Compose a complete chat UI from headless primitives while keeping styling decisions in code.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The demo below shows a minimal unstyled chat shell composed from the headless primitives:

{{"demo": "../examples/minimal-shell/MinimalUnstyledShell.js", "hideToolbar": true}}

The canonical headless shell combines a provider-backed root, pane layout, conversation rail, thread view, message list, and composer:

```tsx
import {
  Chat,
  Composer,
  ConversationList,
  MessageGroup,
  MessageList,
  Conversation,
} from '@mui/x-chat/headless';

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

## Reading order

Composition is the best entry point when you are starting from a blank screen.
It shows how the primitive groups fit together before you drill into individual pages such as
[Layout](/x/react-chat/headless/layout/), [Messages](/x/react-chat/headless/messages/), or
[Composer](/x/react-chat/headless/composer/).

## Composition responsibilities

- Structural defaults for the main chat regions.
- Active-conversation wiring between the conversation list and thread.
- Message list semantics and list-management behavior.
- Grouped message composition without custom row bookkeeping.
- A form-based conversation input with submission and attachment plumbing.

## Choosing between the root and the provider

`Chat.Root` is the headless entry point for pages that want both provider setup and UI structure in one place.
It accepts the same runtime props as the headless provider, then renders your structural surface through a root slot.

Choose `Chat.Root` to:

- Own the runtime boundary with a single component.
- Use headless primitives everywhere below the root.
- Replace slots on the outer shell.

Choose `ChatProvider` directly when only part of the tree should use headless primitives or when a page mixes several rendering approaches.

## Namespace usage

Use namespaced exports when the API should read like a component family:

- `Chat.Root` and `Chat.Layout`.
- `ConversationList.Root`, `ConversationList.Item`, `ConversationList.ItemAvatar`, `ConversationList.Title`, `ConversationList.Preview`, `ConversationList.Timestamp`, and `ConversationList.UnreadBadge`.
- `Conversation.Root`, `Conversation.Header`, `Conversation.Title`, `Conversation.Subtitle`, and `Conversation.HeaderActions`.
- `MessageList.Root` and `MessageList.DateDivider`.
- `Message.Root`, `Message.Avatar`, `Message.Content`, `Message.Meta`, and `Message.Actions`.
- `Composer.Root`, `Composer.TextArea`, `Composer.Toolbar`, `Composer.AttachButton`, `Composer.HelperText`, and `Composer.SendButton`.
- `Indicators.TypingIndicator`, `Indicators.UnreadMarker`, and `Indicators.ScrollToBottomAffordance`.

Direct imports are useful when a codebase prefers explicit component names or tree-local imports.

## Common composition variations

The canonical shell is not the only valid headless layout.

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

## Headless layer responsibilities

- Semantics and accessibility roles.
- Structural composition defaults.
- Focus and keyboard behavior.
- Slot replacement and owner-state-driven customization.

## Headless layer boundaries

- Transport and backend integration details.
- Normalized store semantics and runtime contracts.
- A visual design system, theme, or polished default look.

See [Headless](/x/react-chat/core/) for details on runtime behavior.
See [Customization](/x/react-chat/headless/customization/) for details on styling and theming patterns.
See [Examples](/x/react-chat/headless/examples/) for details on concrete patterns.

## API

- [ChatRoot](/x/api/chat/chat-root/)
- [ChatLayout](/x/api/chat/chat-layout/)
