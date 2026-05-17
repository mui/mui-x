---
title: Chat - Slot overrides
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Slot overrides

<p class="description">Swap individual subcomponents of the Chat with your own implementations to customize rendering and layout.</p>

The `slots` prop lets you swap any internal component in `ChatBox` with your own implementation.
The demo below replaces the message bubble with a `Paper`-based component that uses Material UI elevation and border styles:

- A custom `slots.content` wraps the default `ChatMessageContent`.
- The inner `bubble` slot of `ChatMessageContent` is replaced with a Material UI `Paper` component.
- `ownerState.role` differentiates user and assistant bubble styling.
- `sx` on `Paper` uses theme tokens (`primary.main`, `background.paper`, `divider`) for consistent colors.

{{"demo": "SlotOverrides.js", "bg": "inline"}}

## Wrapping the default slot

The recommended way to override a slot is to wrap the default component and replace only its inner slots:

```tsx
import { ChatMessageContent } from '@mui/x-chat';

const CustomMessageContent = React.forwardRef(
  function CustomMessageContent(props, ref) {
    return (
      <ChatMessageContent
        ref={ref}
        {...props}
        slots={{ ...props.slots, bubble: MyBubble }}
      />
    );
  },
);

<ChatBox slots={{ message: { content: CustomMessageContent } }} />;
```

This keeps the default rendering behavior—part iteration, reasoning blocks, source citations, and tool invocations—and only changes the visual container.

## Styling slots with `ownerState`

Slot components receive an `ownerState` prop from the Material UI styled system.
For message-related slots, `ownerState.role` is `'user'` or `'assistant'`:

```tsx
function MyBubble({ ownerState, children, ...props }) {
  const isUser = ownerState?.role === 'user';
  return (
    <div style={{ background: isUser ? 'blue' : 'white' }} {...props}>
      {children}
    </div>
  );
}
```

Destructure `ownerState` before spreading remaining props so it never reaches DOM elements that don't support it.

## Implementation notes

- Custom slot components must accept a `ref` if the default component uses one.
- Spread `...props` after destructuring `ownerState` to forward all remaining props correctly.
- Use the `slots` prop on `ChatBox` rather than on individual subcomponents when wiring from the top level.

## See also

- See [Customization](/x/react-chat/material/customization/) for details on the available slot keys and their default components.
- See [Custom theme](/x/react-chat/material/examples/custom-theme/) for details on retheming without replacing components.

## API

- [ChatRoot](/x/api/chat/chat-root/)
