---
productId: x-chat
title: Attachments
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatComposerAttachButton
---

# Chat - Attachments

Enable file attachments in the composer, with support for MIME type filtering, file size limits, upload progress tracking, and rejection callbacks.

The attach button opens the browser file picker.
Selected files are queued as draft attachments and previewed in the composer area before the message is sent.

## Enabling attachments

Attachments are enabled by default.
Hide the attach button entirely by setting the `attachments` feature flag to `false`:

```tsx
<ChatBox adapter={adapter} features={{ attachments: false }} />
```

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ComposerHiddenAttachButton() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      features={{ attachments: false }}
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

## Attachment validation

Pass a configuration object to the `attachments` feature flag to control which files are accepted:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    attachments: {
      acceptedMimeTypes: ['image/*', 'application/pdf'],
      maxFileCount: 5,
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      onAttachmentReject: (rejections) => {
        rejections.forEach(({ file, reason }) => {
          console.warn(`Rejected ${file.name}: ${reason}`);
        });
      },
    },
  }}
/>
```

### `ChatAttachmentsConfig`

| Property             | Type                                              | Default     | Description                                                                                                                                                        |
| :------------------- | :------------------------------------------------ | :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `acceptedMimeTypes`  | `string[]`                                        | `undefined` | Allowed MIME types. Supports exact types (`'application/pdf'`) and wildcard subtypes (`'image/*'`). File extension patterns (e.g. `'.pdf'`) are **not** supported. |
| `maxFileCount`       | `number`                                          | `undefined` | Maximum number of files per message.                                                                                                                               |
| `maxFileSize`        | `number`                                          | `undefined` | Maximum size of each file in bytes.                                                                                                                                |
| `onAttachmentReject` | `(rejections: ChatAttachmentRejection[]) => void` | `undefined` | Callback invoked when one or more files are rejected.                                                                                                              |

### Rejection reasons

When a file is rejected, the `ChatAttachmentRejection` object contains:

| Property | Type                                         | Description               |
| :------- | :------------------------------------------- | :------------------------ |
| `file`   | `File`                                       | The browser File object   |
| `reason` | `'mime-type' \| 'file-size' \| 'file-count'` | Why the file was rejected |

## The `ChatDraftAttachment` lifecycle

Each file goes through a status lifecycle as it moves from selection to submission:

```text
queued  -->  uploading  -->  uploaded  -->  (sent with message)
                  \
                   -->  error
```

| Status      | Description                                                          |
| :---------- | :------------------------------------------------------------------- |
| `queued`    | File has been selected and is waiting to be processed.               |
| `uploading` | File upload is in progress. The `progress` field tracks 0--100.      |
| `uploaded`  | Upload completed. The file is ready to be sent with the message.     |
| `error`     | Upload failed. The attachment can be removed or retried by the user. |

### `ChatDraftAttachment` type

| Property     | Type                                               | Description                                  |
| :----------- | :------------------------------------------------- | :------------------------------------------- |
| `localId`    | `string`                                           | Unique identifier for this draft attachment  |
| `file`       | `File`                                             | The browser File object                      |
| `previewUrl` | `string \| undefined`                              | Object URL for image previews (auto-created) |
| `status`     | `'queued' \| 'uploading' \| 'uploaded' \| 'error'` | Upload lifecycle status                      |
| `progress`   | `number \| undefined`                              | Upload progress (0--100)                     |

## Programmatic attachment management

The `useChatComposer` hook from the headless layer provides direct access to attachment state:

```tsx
import { useChatComposer } from '@mui/x-chat/headless';

function AttachmentManager() {
  const composer = useChatComposer();

  return (
    <div>
      <p>Attachments: {composer.attachments.length}</p>
      <ul>
        {composer.attachments.map((att) => (
          <li key={att.localId}>
            {att.file.name} ({att.status})
            <button onClick={() => composer.removeAttachment(att.localId)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

| Method             | Type                        | Description                 |
| :----------------- | :-------------------------- | :-------------------------- |
| `attachments`      | `ChatDraftAttachment[]`     | Queued file attachments     |
| `addAttachment`    | `(file: File) => void`      | Add a file to the draft     |
| `removeAttachment` | `(localId: string) => void` | Remove a queued attachment  |
| `clear`            | `() => void`                | Reset value and attachments |

## Attachments in the adapter

When the user submits a message with attachments, the adapter's `sendMessage` receives them in the input:

```tsx
async sendMessage({ message, attachments, signal }) {
  const formData = new FormData();
  formData.append('message', JSON.stringify(message));
  attachments?.forEach((att) => {
    formData.append('files', att.file);
  });

  const res = await fetch('/api/chat', {
    method: 'POST',
    body: formData,
    signal,
  });
  return res.body!;
},
```

## API

- [`ChatComposerAttachButton`](/x/api/chat/chat-composer-attach-button/)

## See also

- [Composer](/x/react-chat/basics/composer/) for the full composer component reference.
- [Adapter](/x/react-chat/backend/adapters/) for how attachments flow through `sendMessage`.
