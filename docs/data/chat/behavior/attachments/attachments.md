---
productId: x-chat
title: Attachments
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatComposerAttachButton
---

# Chat - Attachments

<p class="description">Let users attach files to chat messages with MIME-type, size, and count validation.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The attach button opens the browser file picker.
Selected files are queued as draft attachments and previewed in the composer area before the message is sent.

## Playground

The demos below let you tune the attach button and the pending-attachment list:
The attachment-list playground seeds draft attachments directly into the chat store so that every status can be previewed without uploading files — in an app, attachments are added through the file picker or `addAttachment()`.

{{"demo": "ChatComposerAttachButtonPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

{{"demo": "ChatComposerAttachmentListPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## Disabling attachments

Attachments are enabled by default.
To hide the attach button entirely, set the `attachments` feature flag to `false`:

```tsx
<ChatBox adapter={adapter} features={{ attachments: false }} />
```

{{"demo": "../../material/composer/ComposerHiddenAttachButton.js", "defaultCodeOpen": false, "bg": "inline"}}

## Validating attachments

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

Try attaching a file that is not an image or PDF, or one larger than 500 KB:

{{"demo": "AttachmentValidation.js", "bg": "inline", "defaultCodeOpen": false}}

### Attachments configuration reference

| Property             | Type                                              | Default     | Description                                                                                                                                                                |
| :------------------- | :------------------------------------------------ | :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `acceptedMimeTypes`  | `string[]`                                        | `undefined` | Allowed MIME types. Supports exact types (`'application/pdf'`) and wildcard subtypes (`'image/*'`). File extension patterns (for example, `'.pdf'`) are **not** supported. |
| `maxFileCount`       | `number`                                          | `undefined` | Maximum number of files per message.                                                                                                                                       |
| `maxFileSize`        | `number`                                          | `undefined` | Maximum size of each file in bytes.                                                                                                                                        |
| `onAttachmentReject` | `(rejections: ChatAttachmentRejection[]) => void` | `undefined` | Callback invoked when one or more files are rejected.                                                                                                                      |

### Rejection reasons

When a file is rejected, the `ChatAttachmentRejection` object contains:

| Property | Type                                         | Description               |
| :------- | :------------------------------------------- | :------------------------ |
| `file`   | `File`                                       | The browser File object   |
| `reason` | `'mime-type' \| 'file-size' \| 'file-count'` | Why the file was rejected |

## Draft attachment lifecycle

Each file goes through a status lifecycle as it moves from selection to submission:

```text
queued  -->  uploading  -->  uploaded  -->  (sent with message)
                  \
                   -->  error
```

| Status      | Description                                                                            |
| :---------- | :------------------------------------------------------------------------------------- |
| `queued`    | File has been selected and is waiting to be processed.                                 |
| `uploading` | File upload is in progress. The `progress` field tracks upload progress from 0 to 100. |
| `uploaded`  | Upload completed. The file is ready to be sent with the message.                       |
| `error`     | Upload failed. The attachment can be removed by the user.                              |

### Draft attachment type reference

| Property     | Type                                               | Description                                  |
| :----------- | :------------------------------------------------- | :------------------------------------------- |
| `localId`    | `string`                                           | Unique identifier for this draft attachment  |
| `file`       | `File`                                             | The browser File object                      |
| `previewUrl` | `string \| undefined`                              | Object URL for image previews (auto-created) |
| `status`     | `'queued' \| 'uploading' \| 'uploaded' \| 'error'` | Upload lifecycle status                      |
| `progress`   | `number \| undefined`                              | Upload progress percentage (0 to 100)        |

For image files, `previewUrl` is an object URL that the composer creates and revokes automatically — when the attachment is removed, after the message that references it is removed, or on unmount. Don't call `URL.revokeObjectURL()` on it yourself.

## Managing attachments programmatically

Most apps only need the `features` configuration above. Reach for the `useChatComposer()` hook when you're building a custom attachment UI outside the built-in composer:

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

The table below covers the attachment-related members. See the [Composer page](/x/react-chat/basics/composer/) for the complete `useChatComposer()` reference.

| Method             | Type                        | Description                 |
| :----------------- | :-------------------------- | :-------------------------- |
| `attachments`      | `ChatDraftAttachment[]`     | Queued file attachments     |
| `addAttachment`    | `(file: File) => void`      | Add a file to the draft     |
| `removeAttachment` | `(localId: string) => void` | Remove a queued attachment  |
| `clear`            | `() => void`                | Reset value and attachments |

## Sending attachments through the adapter

On submit, the runtime hands the queued attachments to your adapter's `sendMessage()` method — this is where files actually leave the browser:

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

## See also

- [Composer](/x/react-chat/basics/composer/) for the full Composer reference.
- [Adapter](/x/react-chat/backend/adapters/) for details on how attachments flow through `sendMessage()`.
