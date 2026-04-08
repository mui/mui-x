---
productId: x-chat
title: Chat - Headless customization
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Headless customization

<p class="description">Customize the headless primitives through slots, <code>slotProps</code>, and owner state while keeping the built-in structure and behavior.</p>

{{"demo": "../examples/slot-customization/SlotCustomization.js", "hideToolbar": true}}

## Customization model

`@mui/x-chat/headless` is designed to let you keep the shipped semantics and interaction logic while replacing most of the rendered structure.

The main tools are:

- `slots` to replace structural subcomponents
- `slotProps` to pass props into those replacements
- owner state to style custom slots based on runtime-aware structural state

## `slots`

Use `slots` when you want to replace the element or React component used for a specific region.

Examples:

- replace the conversation list root with a custom container
- replace the conversation row component while preserving listbox behavior
- replace the composer attach button or hidden file input
- replace the unread marker label or scroll-to-bottom badge

```tsx
<ConversationList.Root
  slots={{
    root: 'aside',
    item: CustomConversationRow,
  }}
/>
```

## `slotProps`

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

Custom slot components receive owner state that describes the structural state of the primitive.

Common examples include:

- conversation item state such as `selected`, `unread`, and `focused`
- thread state such as `conversationId` and `hasConversation`
- message-list state such as `isAtBottom` and `messageCount`
- message state such as `role`, `status`, `streaming`, and `isGrouped`
- composer state such as `hasValue`, `isSubmitting`, `isStreaming`, and `attachmentCount`
- indicator state such as typing users, unread boundaries, and unseen-message counts

### Owner-state example

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

## Replace slots or rebuild from core

:::info
If you need a ready-made visual design, use the [Material layer](/x/react-chat/material/). If you want full control over the DOM, use the [Core layer](/x/react-chat/core/). The headless layer sits between the two: it gives you structural primitives with built-in semantics and interaction behavior while leaving visual decisions to your code.
:::

Use slot replacement when:

- the shipped behavior is correct
- the overall structure is close to what you need
- you want the package to keep handling semantics, focus, and state-derived structural logic

Use headless primitives or custom composition when:

- the interaction model changes substantially
- the component hierarchy is fundamentally different
- the built-in keyboard or list behavior no longer matches the product surface

## Styling strategy

The headless docs stay design-system agnostic on purpose.
Typical styling approaches include:

- utility classes
- CSS modules
- CSS-in-JS wrappers
- custom design-system components passed through slots

The important boundary is:

- headless owns runtime state and contracts
- headless owns structure, semantics, and interaction behavior
- your app owns visual design

## See also

- Continue with [Conversation list](/x/react-chat/headless/conversation-list/) to see owner state on row-level slots.
- Continue with [Messages](/x/react-chat/headless/messages/) for selective message-part replacement.
- Continue with [Slot customization](/x/react-chat/headless/examples/slot-customization/) for a full demo that replaces multiple slots in one surface.

## API

- [ChatRoot](/x/api/chat/chat-root/)
