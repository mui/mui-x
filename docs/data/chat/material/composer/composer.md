---
productId: x-chat
title: Chat - Composer
packageName: '@mui/x-chat'
components: ChatComposer
---

# Composer

<p class="description"><code>ChatComposer</code> provides a styled message input with auto-growing textarea, send button, attachment button, toolbar, and helper text.</p>

## Default layout

The default composer renders an outlined input with a send button.
The input auto-grows as the draft expands and submits on Enter (Shift+Enter for a new line).

{{"demo": "ComposerBasic.js"}}

## Toolbar and helper text

Add a toolbar row for additional actions and helper text for draft-level status messages.

{{"demo": "ComposerWithToolbar.js"}}

## Sub-components

`ChatComposer` is composed from:

- `ChatComposerInput` — auto-growing textarea with IME-safe Enter behavior
- `ChatComposerSendButton` — submit button that disables when the draft is empty or streaming
- `ChatComposerAttachButton` — file input trigger with hidden file picker
- `ChatComposerToolbar` — toolbar row for action buttons
- `ChatComposerHelperText` — status text below the input

Each sub-component can be used independently for custom layouts or replaced through slots.

## Slot customization

Replace individual parts through the `slots` prop:

```tsx
<ChatComposer
  slots={{
    input: CustomTextarea,
    sendButton: CustomSendButton,
  }}
/>
```

## Adjacent pages

- See [Unstyled composer](/x/react-chat/unstyled/composer/) for the structural primitive model.
- See [Slots](/x/react-chat/material/slots/) for the complete slot reference.
