---
productId: x-chat
title: Headless components
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
components: ChatRoot
---

# Chat - Headless components

<p class="description">Build chat interfaces from structural React primitives that handle semantics, focus, and slots without imposing a visual design.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`@mui/x-chat/headless` builds on the Core runtime.
It combines Core state with structural components such as lists, threads, messages, composers, and indicators.

## When to use the headless layer

Use the headless layer to:

- a canonical chat component model
- accessibility and interaction behavior already wired
- slot-based customization instead of rebuilding every subtree
- full control over visual design and styling

Use the Core layer when you want to own all DOM structure yourself.

## Exported namespaces

The headless package is organized into structural namespaces:

- `Chat`
- `ConversationList`
- `Conversation`
- `MessageList`
- `MessageGroup`
- `Message`
- `Composer`
- `Indicators`

The package also exports helpers for default message-part rendering.

## Headless layer responsibilities

- structural React primitives such as `Chat.Root`, `ConversationList.Root`, `Conversation.Root`, and `Composer.Root`
- semantics such as `listbox`, `option`, `log`, and `separator`
- keyboard and focus behavior for conversation navigation
- scroll behavior, unseen-message tracking, and history-loading hooks in the message list
- message grouping, date boundaries, and default message-part renderers
- slot and `slotProps` customization with owner state

## Headless layer boundaries

- Material UI theming or styling
- Visual design or colors
- Runtime contracts, adapters, or store semantics (those belong in [Core](/x/react-chat/customization/core/))

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

## Composing the headless surface

The example below composes a typical headless surface:

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

This gives you a complete structural shell while keeping the visual treatment in CSS, slots, or design-system components.

## See also

- [Tailwind CSS](/x/react-chat/customization/tailwind/) for styling headless primitives with Tailwind utility classes.
- [Core](/x/react-chat/customization/core/) for the Core runtime that the headless layer builds on.
- [Styling](/x/react-chat/customization/styling/) for Material UI theme-based customization on the styled layer.

## API
