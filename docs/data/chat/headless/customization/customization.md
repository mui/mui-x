---
productId: x-chat
title: Chat - Headless customization
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Headless customization

<p class="description">Customize the headless primitives through slots, <code>slotProps</code>, and owner state while keeping the built-in structure and behavior.</p>

The demo below replaces multiple headless slots in a single surface:

{{"demo": "../examples/slot-customization/SlotCustomization.js", "hideToolbar": true}}

## Customization model

The `@mui/x-chat/headless` package lets you keep the shipped semantics and interaction logic while replacing most of the rendered structure.

The headless layer exposes three customization tools:

- Use `slots` to replace structural subcomponents.
- Use `slotProps` to pass props into those replacements.
- Use owner state to style custom slots based on runtime-aware structural state.

## Replacing slots

Use `slots` when you want to replace the element or React component used for a specific region.

Common slot replacements include:

- Replace the conversation list root with a custom container.
- Replace the conversation row component while preserving listbox behavior.
- Replace the composer attach button or hidden file input.
- Replace the unread marker label or scroll-to-bottom badge.

```tsx
<ConversationList.Root
  slots={{
    root: 'aside',
    item: CustomConversationRow,
  }}
/>
```

## Passing props to slots

Use `slotProps` when you want to keep the slot structure but add attributes, styling hooks, or local event behavior.

```tsx
<Composer.AttachButton
  slotProps={{
    input: {
      accept: 'image/*,.pdf',
    },
    root: {
      'aria-label': 'Upload files',
    },
  }}
/>
```

`slotProps` is also the place to pass attributes such as `id`, `className`, ARIA labels, and design-system-specific props into the replaced slot.

## Owner state

Read the owner state passed to custom slot components to style each primitive based on its runtime structural state.

Owner state covers:

- Conversation item state such as `selected`, `unread`, and `focused`.
- Thread state such as `conversationId` and `hasConversation`.
- Message-list state such as `isAtBottom` and `messageCount`.
- Message state such as `role`, `status`, `streaming`, and `isGrouped`.
- Composer state such as `hasValue`, `isSubmitting`, `isStreaming`, and `attachmentCount`.
- Indicator state such as typing users, unread boundaries, and unseen-message counts.

### Owner state example

```tsx
const CustomSendButton = React.forwardRef(function CustomSendButton(props, ref) {
  const { ownerState, ...other } = props;

  return (
    <button
      data-streaming={String(ownerState?.isStreaming)}
      data-submitting={String(ownerState?.isSubmitting)}
      ref={ref}
      {...other}
    />
  );
});
```

This pattern is the main bridge between the headless package and a product-specific visual language.

## Choosing between slot replacement and custom composition

:::info
If you need a ready-made visual design, use the [Material layer](/x/react-chat/).
If you want full control over the DOM, use the [Core layer](/x/react-chat/core/).
The headless layer sits between the two—it provides structural primitives with built-in semantics and interaction behavior while leaving visual decisions to the app layer.
:::

Use slot replacement when:

- The shipped behavior is correct.
- The overall structure is close to what you need.
- You want the package to keep handling semantics, focus, and state-derived structural logic.

Use headless primitives or custom composition when:

- The interaction model changes substantially.
- The component hierarchy is fundamentally different.
- The built-in keyboard or list behavior no longer matches the product surface.

## Styling strategy

The headless layer stays design-system agnostic.
Common styling approaches include:

- Utility classes.
- CSS Modules.
- CSS-in-JS wrappers.
- Custom design-system components passed through slots.

The headless boundary is clear:

- Headless owns runtime state and contracts.
- Headless owns structure, semantics, and interaction behavior.
- The app owns visual design.

## See also

- See [Conversation list](/x/react-chat/headless/conversation-list/) for owner state on row-level slots.
- See [Messages](/x/react-chat/headless/messages/) for selective message-part replacement.
- See [Slot customization](/x/react-chat/headless/examples/slot-customization/) for a demo that replaces multiple slots in one surface.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
