---
title: Chat - Slot overrides
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Slot overrides

<p class="description">Replace individual sub-components inside <code>ChatBox</code> using the <code>slots</code> prop</p>

The `slots` prop lets you swap any internal component in `ChatBox` with your own implementation.
This demo replaces the message bubble with a `Paper`-based component that uses MUI elevation and border styles.

- `slots.messageContent` accepting a custom component that wraps the default `ChatMessageContent`
- The inner `bubble` slot of `ChatMessageContent` replaced with a MUI `Paper` component
- `ownerState.role` used to differentiate user and assistant bubble styling
- `sx` on `Paper` using theme tokens (`primary.main`, `background.paper`, `divider`) for consistent colors

{{"demo": "SlotOverrides.js", "bg": "inline"}}

## The wrapping pattern

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

<ChatBox slots={{ messageContent: CustomMessageContent }} />;
```

This keeps the default rendering behavior — part iteration, reasoning blocks, source citations, tool invocations — and only changes the visual container.

## ownerState

Slot components receive an `ownerState` prop from the MUI styled system.
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

Forward `ownerState` destructuring to avoid passing it to DOM elements that don't support it.

## Implementation notes

- Custom slot components must accept a `ref` if the default component uses one.
- Spread `...props` after destructuring `ownerState` to forward all remaining props correctly.
- Use the `slots` prop on `ChatBox` rather than on individual sub-components when wiring from the top level.

## API

- [ChatRoot](/x/api/chat/chat-root/)

## See also

- [Customization](/x/react-chat/material/customization/) for the full table of available slot keys and their default components
- [Custom theme](/x/react-chat/material/examples/custom-theme/) for rethemeing without replacing components
