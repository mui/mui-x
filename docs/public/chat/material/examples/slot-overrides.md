---
title: Chat - Slot overrides
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Slot overrides

<p class="description">Replace individual sub-components inside <code>ChatBox</code> using the <code>slots</code> prop.</p>

The `slots` prop lets you swap any internal component in `ChatBox` with your own implementation.
This demo replaces the message bubble with a `Paper`-based component that uses MUI elevation and border styles.

- `slots.messageContent` accepting a custom component that wraps the default `ChatMessageContent`
- The inner `bubble` slot of `ChatMessageContent` replaced with a MUI `Paper` component
- `ownerState.role` used to differentiate user and assistant bubble styling
- `sx` on `Paper` using theme tokens (`primary.main`, `background.paper`, `divider`) for consistent colors

```tsx
'use client';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import {
  ChatBox,
  ChatMessageContent,
  type ChatMessageContentProps,
} from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

/**
 * A custom message content component that wraps the default ChatMessageContent
 * and replaces the inner bubble slot with a Paper-based component.
 */
const PaperBubble = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { ownerState?: { role?: string } }
>(function PaperBubble({ ownerState, children, ...other }, ref) {
  const isUser = ownerState?.role === 'user';

  return (
    <Paper
      ref={ref}
      elevation={isUser ? 0 : 3}
      {...other}
      sx={{
        px: 2,
        py: 1.25,
        borderRadius: 3,
        bgcolor: isUser ? 'primary.main' : 'background.paper',
        color: isUser ? 'primary.contrastText' : 'text.primary',
        fontSize: 'body2.fontSize',
        lineHeight: 'body2.lineHeight',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        border: isUser ? 'none' : '1px solid',
        borderColor: 'divider',
      }}
    >
      {children}
    </Paper>
  );
});

/**
 * A custom messageContent slot that delegates to the default ChatMessageContent
 * but swaps the inner bubble slot for PaperBubble.
 */
const CustomMessageContent = React.forwardRef<
  HTMLDivElement,
  ChatMessageContentProps
>(function CustomMessageContent(props, ref) {
  return (
    <ChatMessageContent
      ref={ref}
      {...props}
      slots={{
        ...props.slots,
        bubble: PaperBubble,
      }}
    />
  );
});

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". This reply uses a Paper component as the message bubble — swapped in via slots.messageContent.`,
});

export default function SlotOverrides() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ messageContent: CustomMessageContent }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

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
