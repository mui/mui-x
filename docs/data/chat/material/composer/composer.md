---
productId: x-chat
title: Chat - Composer
packageName: '@mui/x-chat'
components: ChatConversationInputTextArea, ChatConversationInputSendButton, ChatConversationInputAttachButton, ChatConversationInputToolbar, ChatConversationInputHelperText
---

# Composer

<p class="description"><code>ChatConversationInput</code> provides a styled message input with auto-growing textarea, send button, attachment button, toolbar, and helper text.</p>

## Default layout

The default composer renders an outlined input with a send button.
The input auto-grows as the draft expands and submits on Enter (Shift+Enter for a new line).

{{"demo": "ComposerBasic.js"}}

## Toolbar and helper text

Add a toolbar row for additional actions and helper text for draft-level status messages.

{{"demo": "ComposerWithToolbar.js"}}

## Sub-components

`ChatConversationInput` is composed from:

- `ChatConversationInputTextArea` — auto-growing textarea with IME-safe Enter behavior
- `ChatConversationInputSendButton` — submit button that disables when the draft is empty or streaming
- `ChatConversationInputAttachButton` — file input trigger with hidden file picker
- `ChatConversationInputToolbar` — toolbar row for action buttons
- `ChatConversationInputHelperText` — status text below the input

Each sub-component can be used independently for custom layouts or replaced through slots.

## Slot customization

Replace individual parts through the `slots` prop:

```tsx
<ChatConversationInput
  slots={{
    input: CustomTextarea,
    sendButton: CustomSendButton,
  }}
/>
```

## Adjacent pages

- See [Unstyled composer](/x/react-chat/unstyled/composer/) for the structural primitive model.
- See [Slots](/x/react-chat/material/slots/) for the complete slot reference.
