---
productId: x-chat
title: Composer
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatComposerTextArea, ChatComposerSendButton, ChatComposerAttachmentList, ChatComposerHelperText, ChatComposerLabel, ChatComposerToolbar
---

# Chat - Composer

<p class="description">The text input area where users draft and send messages, with auto-resize, keyboard shortcuts, and a send button.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Overview

The composer is the input region at the bottom of the chat surface.
`ChatComposer` provides Material UI styling — border, padding, and theme tokens are applied automatically.

## Import

```tsx
import {
  ChatComposer,
  ChatComposerLabel,
  ChatComposerTextArea,
  ChatComposerSendButton,
  ChatComposerAttachButton,
  ChatComposerToolbar,
  ChatComposerHelperText,
} from '@mui/x-chat';
```

:::info
When using `ChatBox`, the composer is already included.
Import these components directly only when building a custom layout.
:::

## Component anatomy

Inside `ChatBox`, the composer renders the following structure:

```text
ChatComposer                  ← <form> element, border-top divider
  ChatComposerLabel           ← optional <label> for accessibility
  ChatComposerTextArea        ← auto-resizing textarea
  ChatComposerToolbar         ← button row
    ChatComposerAttachButton  ← file attach trigger
    ChatComposerSendButton    ← submit button (disabled when empty/streaming)
  ChatComposerHelperText      ← disclaimer or character count
```

## Text area

`ChatComposerTextArea` is an auto-resizing `<textarea>` that grows with content.
It submits on <kbd class="key">Enter</kbd> and inserts a newline on <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Enter</kbd></kbd>.

### Placeholder text

Customize the placeholder through `slotProps`:

{{"demo": "../../material/composer/ComposerCustomPlaceholder.js", "defaultCodeOpen": false, "bg": "inline"}}

### IME composition

The composer correctly handles IME (Input Method Editor) composition for CJK languages.
While the user is composing characters (for example, selecting Kanji), pressing Enter confirms the character selection instead of submitting the message.
Submission is blocked until composition ends.

## Send button

`ChatComposerSendButton` disables automatically when:

- The text area is empty (no text content).
- A response is currently streaming.
- The composer is explicitly disabled.

:::info
The send button's visual disabled state checks only text content, not attachments. However, the underlying `submit()` function sends if either text or attachments are present.
:::

## Attach button

The attach button opens the browser file picker.
Selected files are queued as draft attachments and previewed in the composer area.

Set `features={{ attachments: false }}` to hide the attach button:

{{"demo": "../../material/composer/ComposerHiddenAttachButton.js", "defaultCodeOpen": false, "bg": "inline"}}

For full details on attachment configuration—accepted MIME types, file size limits, and upload lifecycle—see [Attachments](/x/react-chat/behavior/attachments/).

## Helper text

A helper text line appears below the composer.
Use it for legal disclaimers, character counts, or contextual hints.

```tsx
{
  /* Hide the helper text */
}
<ChatBox adapter={adapter} features={{ helperText: false }} />;
```

## Controlled composer value

The composer value can be controlled externally through `ChatBox` props (which forward to the internal `ChatProvider`).
The demo below mirrors the current composer value above the chat surface:

{{"demo": "../../material/composer/ComposerControlled.js", "defaultCodeOpen": false, "bg": "inline"}}

## Accessing composer state

For deeper control, the `useChatComposer()` hook provides direct access to the composer state:

```tsx
import { useChatComposer } from '@mui/x-chat/headless';

function ComposerInfo() {
  const composer = useChatComposer();
  return (
    <div>
      <p>Current value: {composer.value}.</p>
      <p>Attachments: {composer.attachments.length}.</p>
      <p>Submitting: {composer.isSubmitting ? 'Yes' : 'No'}.</p>
      <button onClick={() => composer.clear()}>Clear</button>
    </div>
  );
}
```

The hook returns:

| Property           | Type                        | Description                   |
| :----------------- | :-------------------------- | :---------------------------- |
| `value`            | `string`                    | Current text value            |
| `setValue`         | `(value: string) => void`   | Update the text value         |
| `attachments`      | `ChatDraftAttachment[]`     | Queued file attachments       |
| `addAttachment`    | `(file: File) => void`      | Add a file to the draft       |
| `removeAttachment` | `(localId: string) => void` | Remove a queued file          |
| `clear`            | `() => void`                | Reset value and attachments   |
| `submit`           | `() => Promise<void>`       | Submit the current draft      |
| `isSubmitting`     | `boolean`                   | Whether a send is in progress |

## Disabling the composer

Pass `disabled` to prevent all interaction.
When disabled, the text area is read-only and the send button is inert.

{{"demo": "../../material/composer/ComposerDisabled.js", "defaultCodeOpen": false, "bg": "inline"}}

## Localization

The composer uses these locale text keys (customizable via `localeText` on `ChatBox` or `ChatRoot`):

| Key                         | Default            | Used by                             |
| :-------------------------- | :----------------- | :---------------------------------- |
| `composerInputPlaceholder`  | `"Type a message"` | TextArea placeholder                |
| `composerInputAriaLabel`    | `"Message"`        | TextArea aria-label, Label fallback |
| `composerSendButtonLabel`   | `"Send message"`   | SendButton aria-label               |
| `composerAttachButtonLabel` | `"Add attachment"` | AttachButton aria-label             |
