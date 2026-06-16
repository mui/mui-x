---
productId: x-chat
title: Chat - Headless layout
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Headless layout

<p class="description">Compose a two-pane chat shell from headless primitives and split the interface into conversation and thread panes.</p>

The demo below shows a minimal unstyled chat shell composed from the headless primitives:

{{"demo": "../examples/minimal-shell/MinimalUnstyledShell.js", "hideToolbar": true}}

## Root container

`Chat.Root` wraps `ChatProvider` and exposes a root slot for the outer container.
It accepts the same runtime props as the headless provider, then renders your chat surface inside a structural root element.

Use `Chat.Root` to:

- Provider setup colocated with the UI shell.
- Controlled or uncontrolled chat models at the app boundary.
- Slot replacement for the top-level wrapper.

Because `Chat.Root` forwards the headless provider props, it can own:

- `adapter`.
- Controlled or uncontrolled `messages`.
- Controlled or uncontrolled `conversations`.
- Active conversation selection.
- Composer value control.
- Runtime callbacks such as `onToolCall`, `onFinish`, `onData`, and `onError`.

Runtime setup stays colocated with the structural entry point.

## Pane manager

`Chat.Layout` is the pane manager for the headless layer.
It renders a root plus separate pane slots for conversations and the active thread.

It supports:

- Two-pane layouts with both conversation and thread children.
- Single-pane layouts where only one side is rendered.
- Pane detection based on primitive markers.
- Reversed child order without losing pane placement.
- Pane slot replacement through `slots` and `slotProps`.

The default layout is small by design.
Its job is to place panes and expose owner state, not to decide visual density, breakpoints, or design tokens.

## Pane detection

The layout recognizes marked pane components such as `ConversationList.Root` and `Conversation.Root`.
Place panes in any order:

```tsx
<Chat.Layout>
  <Conversation.Root />
  <ConversationList.Root />
</Chat.Layout>
```

and still get the conversation pane rendered before the thread pane in the final layout structure.

If only one unmarked child is present, `Chat.Layout` treats it as the thread pane by default.

Single-thread layouts use the same component:

```tsx
<Chat.Layout>
  <Conversation.Root>{/* thread-only view */}</Conversation.Root>
</Chat.Layout>
```

## Slot model

The layout exposes:

- `root`.
- `conversationsPane`.
- `threadPane`.

This is useful when you need semantic wrappers such as `aside` and `main`, or when a layout system expects custom container elements.

Apply semantic wrappers through the slot props:

```tsx
<Chat.Layout
  slots={{
    conversationsPane: 'aside',
    threadPane: 'main',
  }}
  slotProps={{
    conversationsPane: { 'aria-label': 'Conversations' },
    threadPane: { 'aria-label': 'Active thread' },
  }}
>
  <ConversationList.Root />
  <Conversation.Root />
</Chat.Layout>
```

## One-pane and two-pane guidance

Use a two-pane layout to:

- Conversation switching happens inside the same page.
- The product behaves like an inbox or agent workspace.

Use a one-pane layout to:

- The conversation is already chosen by routing.
- The page is dedicated to a single thread.
- The conversation list lives somewhere else in the application shell.

## Layout patterns

- Use `Chat.Layout` for desktop split-pane surfaces.
- Render just `Conversation.Root` inside `Chat.Layout` for focused thread pages.
- Replace the pane slots when the surrounding page already defines grid or landmark semantics.

See [Composition](/x/react-chat/headless/composition/) for details.
See [Conversation list](/x/react-chat/headless/conversation-list/) for the inbox rail.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
- [`ChatLayout`](/x/api/chat/chat-layout/)
