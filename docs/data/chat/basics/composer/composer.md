---
productId: x-chat
title: Composer
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatComposerTextArea, ChatComposerSendButton, ChatComposerAttachButton, ChatComposerAttachmentList, ChatComposerHelperText, ChatComposerLabel, ChatComposerToolbar
---

# Chat - Composer

<p class="description">Compose and send chat messages with an auto-resizing text area, keyboard shortcuts, and attachment support.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Overview

The composer is the input region at the bottom of the chat surface.
`ChatComposer` provides Material UI styling: border, padding, and theme tokens are applied automatically.
The demos on this page render only the composer plus the provider context it depends on.

## Interactive playground

Try the `ChatComposer` props live: toggle variant, attachments, helper text, and placeholder:

{{"demo": "ChatComposerPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## Import

```tsx
import {
  ChatComposer,
  ChatComposerLabel,
  ChatComposerTextArea,
  ChatComposerSendButton,
  ChatComposerAttachButton,
  ChatComposerAttachmentList,
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
    ChatComposerSendButton    ← submit button (disabled when the draft is empty or while streaming)
  ChatComposerHelperText      ← disclaimer or character count
```

## Variants

`ChatComposer` accepts `variant="default"` (a bordered box with the textarea above a `ChatComposerToolbar` button row) or `variant="compact"` (a single-row layout where `ChatComposerAttachButton` and `ChatComposerSendButton` are placed directly as children, with no toolbar).

The variant can also come from the surrounding chat context; an explicit prop wins over the context value.

{{"demo": "ComposerVariantsStandalone.js", "defaultCodeOpen": false, "bg": "inline"}}

## Text area

`ChatComposerTextArea` is an auto-resizing `<textarea>` that grows with content.
It submits on <kbd class="key">Enter</kbd> and inserts a newline on <kbd><kbd class="key">Shift</kbd>+<kbd class="key">Enter</kbd></kbd>.

Use `maxRows` to cap the auto-grow: the textarea starts at one row and grows up to `maxRows` lines, then scrolls.

### Customizing the placeholder

Customize the placeholder directly on `ChatComposerTextArea`:

{{"demo": "ComposerCustomPlaceholderStandalone.js", "defaultCodeOpen": false, "bg": "inline"}}

### IME composition

The composer handles IME (Input Method Editor) composition for CJK languages.
While the user is composing characters (for example, selecting Kanji), pressing Enter confirms the character selection instead of submitting the message.
Submission is blocked until composition ends.

## Send button

`ChatComposerSendButton` disables automatically when:

- The text area is empty and there are no queued attachments.
- A response is currently streaming.
- The composer is explicitly disabled.

## Attach button

The attach button opens the browser file picker.
Selected files are queued as draft attachments and previewed in the composer area.

Omit `ChatComposerAttachButton` from the toolbar when attachments are not part of the surface:

{{"demo": "ComposerHiddenAttachButtonStandalone.js", "defaultCodeOpen": false, "bg": "inline"}}

Files that exceed the configured limits (`maxFileCount`, `maxFileSize`, `acceptedMimeTypes`) are not queued and there is no built-in rejection UI — handle the `onAttachmentReject` callback to surface feedback.

See [Attachments](/x/react-chat/behavior/attachments/) for details on accepted MIME types, file size limits, and the upload lifecycle.

## Helper text

A helper text line appears below the composer.
Use it for legal disclaimers, character counts, or contextual hints.

{{"demo": "ComposerHelperTextStandalone.js", "defaultCodeOpen": false, "bg": "inline"}}

## Controlled composer value

Control the composer value externally through `ChatProvider` state.
The demo below mirrors the current composer value above the standalone composer:

{{"demo": "ComposerControlledStandalone.js", "defaultCodeOpen": false, "bg": "inline"}}

## Accessing composer state with a hook

For deeper control, the `useChatComposer()` hook provides direct access to the composer state:

{{"demo": "ComposerHookStateStandalone.js", "defaultCodeOpen": true, "bg": "inline"}}

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

Pass `disabled` to `ChatComposer` to prevent all interaction.
When disabled, the text area is read-only and the send button is inert.

{{"demo": "ComposerDisabledStandalone.js", "defaultCodeOpen": false, "bg": "inline"}}

## Accessibility

The text area resolves its accessible name through a fallback chain: an explicit `aria-label` wins; passing `aria-labelledby` suppresses the default; otherwise the locale text `composerInputAriaLabel` (`"Message"`) is applied automatically.

`ChatComposerLabel` renders a visible `<label>`. Wire it to the text area with `htmlFor` (plus `aria-labelledby`/`id`) to avoid a duplicate accessible name. With no children it falls back to the same `composerInputAriaLabel` text, keeping the visible and announced names consistent. Use it when the design calls for a visible label; otherwise the automatic `aria-label` is enough.

The send and attach buttons get their accessible names from `composerSendButtonLabel` and `composerAttachButtonLabel` (see the Localization table below).

For the full [keyboard navigation and accessibility](/x/react-chat/material/message-list/#accessibility) model, see the message list reference.

## Localization

The composer uses these locale text keys (customizable via `localeText` on `ChatBox` or `ChatRoot`):

| Key                         | Default            | Used by                             |
| :-------------------------- | :----------------- | :---------------------------------- |
| `composerInputPlaceholder`  | `"Type a message"` | TextArea placeholder                |
| `composerInputAriaLabel`    | `"Message"`        | TextArea aria-label, Label fallback |
| `composerSendButtonLabel`   | `"Send message"`   | SendButton aria-label               |
| `composerAttachButtonLabel` | `"Add attachment"` | AttachButton aria-label             |
