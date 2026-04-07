---
productId: x-chat
title: Files & Images
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent
---

# Chat - Files & Images

<p class="description">Display file attachments and inline image previews using the <code>ChatFileMessagePart</code> type.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

File parts represent file attachments within a message. When the file is an image, an inline preview is rendered. For other file types, a compact chip with a document icon and filename is displayed.

## The file part data model

A file part is represented by the `ChatFileMessagePart` interface:

```ts
interface ChatFileMessagePart {
  type: 'file';
  mediaType: string;
  url: string;
  filename?: string;
}
```

| Field       | Type     | Description                                                     |
| :---------- | :------- | :-------------------------------------------------------------- |
| `type`      | `'file'` | Discriminant for the part type union                            |
| `mediaType` | `string` | MIME type of the file (e.g. `'image/png'`, `'application/pdf'`) |
| `url`       | `string` | URL to the file resource                                        |
| `filename`  | `string` | Optional display name for the file                              |

### Example data

```ts
const message: ChatMessage = {
  id: 'msg-1',
  role: 'assistant',
  parts: [
    { type: 'text', text: 'Here are the requested files:' },
    {
      type: 'file',
      mediaType: 'image/png',
      url: 'https://example.com/chart.png',
      filename: 'quarterly-chart.png',
    },
    {
      type: 'file',
      mediaType: 'application/pdf',
      url: 'https://example.com/report.pdf',
      filename: 'Q4-report.pdf',
    },
  ],
};
```

## Rendering behavior

The built-in file part renderer automatically detects images by checking whether `mediaType` starts with `'image/'`:

- **Images** — rendered as an `<img>` element with inline preview, wrapped in a link to the full-size resource.
- **Other files** — rendered as a compact chip with a document icon and the filename (or URL as fallback), linking to the file.

Both variants open the file in a new tab (`target="_blank"`) when clicked.

## Slots

The `FilePart` component exposes four slots for customization:

| Slot       | Default element | Description                              |
| :--------- | :-------------- | :--------------------------------------- |
| `root`     | `div`           | Outer container                          |
| `preview`  | `img`           | Image preview (only rendered for images) |
| `link`     | `a`             | Clickable link wrapping the content      |
| `filename` | `span`          | Filename text                            |

### Customizing via ChatBox

Override file part rendering through `slotProps.messageContent.partProps.file`:

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    messageContent: {
      partProps: {
        file: {
          slots: {
            root: MyCustomFileRoot,
          },
        },
      },
    },
  }}
/>
```

## Streaming

File parts arrive as a single `file` chunk in the stream — they are not delivered incrementally like text parts:

```ts
interface ChatFileChunk {
  type: 'file';
  id?: string;
  mediaType: string;
  url: string;
  filename?: string;
}
```

The file part is added to the message's `parts` array as soon as the chunk is received.

## Owner state

The `FilePart` component computes an owner state that slot components can use for conditional styling:

| Property    | Type       | Description                  |
| :---------- | :--------- | :--------------------------- |
| `image`     | `boolean`  | Whether the file is an image |
| `mediaType` | `string`   | MIME type of the file        |
| `messageId` | `string`   | ID of the parent message     |
| `role`      | `ChatRole` | Role of the message author   |

## See also

- [Text & Markdown](/x/react-chat/display/message-parts/text-and-markdown/) for the most common part type
- [Sources & Citations](/x/react-chat/display/message-parts/sources-and-citations/) for reference links in RAG applications
- [Custom Parts](/x/react-chat/display/message-parts/custom-parts/) for building custom file viewers
