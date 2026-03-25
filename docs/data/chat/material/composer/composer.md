---
productId: x-chat
title: Chat - Composer
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Composer

<p class="description">The text input area where users draft and send messages, with support for attachments, toolbar actions, and helper text.</p>

The composer is the input region at the bottom of the chat surface.
`ChatComposer` wraps the `@mui/x-chat/unstyled` `ComposerRoot` primitive with Material UI styling — border, padding, and theme tokens are applied automatically.

## Import

```tsx
import {
  ChatComposer,
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

## Component tree

Inside `ChatBox`, the composer renders the following structure:

```
ChatComposer                  ← <form> element, border-top divider
  ChatComposerTextArea        ← auto-resizing textarea
  ChatComposerToolbar         ← button row
    ChatComposerAttachButton  ← file attach trigger
    ChatComposerSendButton    ← submit button (disabled when empty/streaming)
  ChatComposerHelperText      ← disclaimer or character count
```

## Text area

`ChatComposerTextArea` is an auto-resizing `<textarea>` that grows with content.
It submits on **Enter** and inserts a newline on **Shift+Enter**.

### Placeholder text

Customize the placeholder through `slotProps`:

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    composerInput: { placeholder: 'Ask me anything...' },
  }}
/>
```

## Send button

The send button is automatically disabled when:

- The text area is empty **and** no attachments are queued.
- A response is currently streaming.

This prevents accidental double-sends and empty submissions.

## Attach button

The attach button opens the browser file picker.
Selected files are queued as draft attachments and previewed in the composer area.

```tsx
{/* Hide the attach button */}
<ChatBox adapter={adapter} features={{ attachButton: false }} />
```

## Helper text

A helper text line appears below the composer.
Use it for legal disclaimers, character counts, or contextual hints.

```tsx
{/* Hide the helper text */}
<ChatBox adapter={adapter} features={{ helperText: false }} />
```

## Controlled composer value

The composer value can be controlled externally through `ChatProvider` (or the `ChatBox` props that forward to it):

```tsx
import { ChatProvider } from '@mui/x-chat/headless';

function App() {
  const [value, setValue] = React.useState('');

  return (
    <ChatProvider
      adapter={adapter}
      composerValue={value}
      onComposerValueChange={setValue}
    >
      <ChatBox />
    </ChatProvider>
  );
}
```

## `useChatComposer` hook

For deeper control, the `useChatComposer` hook from the headless layer provides direct access to the composer state:

```tsx
import { useChatComposer } from '@mui/x-chat/headless';

function ComposerInfo() {
  const composer = useChatComposer();
  return (
    <div>
      <p>Current value: {composer.value}</p>
      <p>Attachments: {composer.attachments.length}</p>
      <p>Submitting: {composer.isSubmitting ? 'Yes' : 'No'}</p>
      <button onClick={() => composer.clear()}>Clear</button>
    </div>
  );
}
```

The hook returns:

| Property | Type | Description |
| :--- | :--- | :--- |
| `value` | `string` | Current text value |
| `setValue` | `(value: string) => void` | Update the text value |
| `attachments` | `ChatDraftAttachment[]` | Queued file attachments |
| `addAttachment` | `(file: File) => void` | Add a file to the draft |
| `removeAttachment` | `(localId: string) => void` | Remove a queued file |
| `clear` | `() => void` | Reset value and attachments |
| `submit` | `() => Promise<void>` | Submit the current draft |
| `isSubmitting` | `boolean` | Whether a send is in progress |

## Disabling the composer

Pass `disabled` to prevent all interaction:

```tsx
<ChatComposer disabled />
```

When disabled, the text area is read-only and the send button is inert.
The owner state exposes `disabled` so custom styles can react to the state.

## Slots

The following slots are available for customization through `ChatBox`:

| Slot | Component | Description |
| :--- | :--- | :--- |
| `composerRoot` | `ChatComposer` | The `<form>` container |
| `composerInput` | `ChatComposerTextArea` | The auto-resizing textarea |
| `composerSendButton` | `ChatComposerSendButton` | Submit button |
| `composerAttachButton` | `ChatComposerAttachButton` | File attach trigger |
| `composerToolbar` | `ChatComposerToolbar` | Button row below the textarea |
| `composerHelperText` | `ChatComposerHelperText` | Disclaimer or hint text |
