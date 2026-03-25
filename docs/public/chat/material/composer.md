---
productId: x-chat
title: Chat - Composer
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Composer

The text input area where users draft and send messages, with support for attachments, toolbar actions, and helper text.

The composer is the input region at the bottom of the chat surface.
`ChatComposer` wraps the `@mui/x-chat/unstyled` `ComposerRoot` primitive with Material UI styling — border, padding, and theme tokens are applied automatically.

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

## Component tree

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
It submits on **Enter** and inserts a newline on **Shift+Enter**.

### Placeholder text

Customize the placeholder through `slotProps`:

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ComposerCustomPlaceholder() {
  return (
    <ChatBox
      adapter={adapter}
      defaultActiveConversationId={minimalConversation.id}
      defaultConversations={[minimalConversation]}
      defaultMessages={minimalMessages}
      slotProps={{
        composerInput: { placeholder: 'Ask me anything...' },
      }}
      sx={{
        height: 400,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

### IME composition

The composer correctly handles IME (Input Method Editor) composition for CJK languages.
While the user is composing characters (e.g., selecting Kanji), pressing Enter confirms the character selection instead of submitting the message.
Submission is blocked until composition ends.

## Send button

The send button is automatically disabled when:

- The text area is empty (no text content).
- A response is currently streaming.
- The composer is explicitly disabled.

:::info
The send button's visual disabled state checks only text content, not attachments. However, the underlying `submit()` function will send if either text or attachments are present.
:::

## Attach button

The attach button opens the browser file picker.
Selected files are queued as draft attachments and previewed in the composer area.

Set `features={{ attachButton: false }}` to hide the attach button:

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ComposerHiddenAttachButton() {
  return (
    <ChatBox
      adapter={adapter}
      defaultActiveConversationId={minimalConversation.id}
      defaultConversations={[minimalConversation]}
      defaultMessages={minimalMessages}
      features={{ attachButton: false }}
      sx={{
        height: 400,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

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

The composer value can be controlled externally through `ChatProvider` (or the `ChatBox` props that forward to it).
The example below mirrors the current composer value above the chat surface:

```tsx
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ComposerControlled() {
  const [value, setValue] = React.useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Composer value: {value ? `"${value}"` : '(empty)'}
      </Typography>
      <ChatBox
        adapter={adapter}
        defaultActiveConversationId={minimalConversation.id}
        defaultConversations={[minimalConversation]}
        defaultMessages={minimalMessages}
        composerValue={value}
        onComposerValueChange={setValue}
        sx={{
          height: 400,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </Box>
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

### ChatDraftAttachment

The attachment type used by the composer:

| Property     | Type                                               | Description                                  |
| :----------- | :------------------------------------------------- | :------------------------------------------- |
| `localId`    | `string`                                           | Unique identifier for this draft attachment  |
| `file`       | `File`                                             | The browser File object                      |
| `previewUrl` | `string \| undefined`                              | Object URL for image previews (auto-created) |
| `status`     | `'queued' \| 'uploading' \| 'uploaded' \| 'error'` | Upload lifecycle status                      |
| `progress`   | `number \| undefined`                              | Upload progress (0–100)                      |

## Disabling the composer

Pass `disabled` to prevent all interaction.
When disabled, the text area is read-only and the send button is inert.
The owner state exposes `disabled` so custom styles can react to the state.

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ComposerDisabled() {
  return (
    <ChatBox
      adapter={adapter}
      defaultActiveConversationId={minimalConversation.id}
      defaultConversations={[minimalConversation]}
      defaultMessages={minimalMessages}
      slotProps={{
        composerRoot: { disabled: true },
      }}
      sx={{
        height: 400,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

## Localization

The composer uses these locale text keys (customizable via `localeText` on `ChatBox` or `ChatRoot`):

| Key                         | Default            | Used by                             |
| :-------------------------- | :----------------- | :---------------------------------- |
| `composerInputPlaceholder`  | `"Type a message"` | TextArea placeholder                |
| `composerInputAriaLabel`    | `"Message"`        | TextArea aria-label, Label fallback |
| `composerSendButtonLabel`   | `"Send message"`   | SendButton aria-label               |
| `composerAttachButtonLabel` | `"Add attachment"` | AttachButton aria-label             |

## Slots

The following slots are available for customization through `ChatBox`:

| Slot                   | Component                  | Description                   |
| :--------------------- | :------------------------- | :---------------------------- |
| `composerRoot`         | `ChatComposer`             | The `<form>` container        |
| `composerInput`        | `ChatComposerTextArea`     | The auto-resizing textarea    |
| `composerSendButton`   | `ChatComposerSendButton`   | Submit button                 |
| `composerAttachButton` | `ChatComposerAttachButton` | File attach trigger           |
| `composerToolbar`      | `ChatComposerToolbar`      | Button row below the textarea |
| `composerHelperText`   | `ChatComposerHelperText`   | Disclaimer or hint text       |
