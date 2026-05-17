---
productId: x-chat
title: Sources and citations
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent, ChatMessageSource, ChatMessageSources
---

# Chat - Sources and citations

<p class="description">Display reference links and document excerpts for retrieval-augmented generation (RAG) applications using source parts.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

Source parts let AI assistants cite their sources.
Two part types cover the common citation patterns: URL references and document excerpts.

## Interactive playground

The demo below shows the `ChatMessageSources` slot rendering URL and document parts:

{{"demo": "ChatMessageSourcesPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## Source URL parts

`ChatSourceUrlMessagePart` represents a link to an external resource:

```ts
interface ChatSourceUrlMessagePart {
  type: 'source-url';
  sourceId: string;
  url: string;
  title?: string;
}
```

| Field      | Type           | Description                                |
| :--------- | :------------- | :----------------------------------------- |
| `type`     | `'source-url'` | Discriminant for the part type union       |
| `sourceId` | `string`       | Unique identifier for deduplication        |
| `url`      | `string`       | URL of the source                          |
| `title`    | `string`       | Optional display title (falls back to URL) |

The default renderer displays an external link icon next to a clickable link that opens in a new tab. The link text shows the `title` when available, otherwise the raw `url`.

### Rendering

Source URLs are rendered as inline links with an external-link icon.

```tsx
// How it appears in the parts array
const message: ChatMessage = {
  id: 'msg-1',
  role: 'assistant',
  parts: [
    { type: 'text', text: 'According to the documentation [^1]:' },
    {
      type: 'source-url',
      sourceId: 'src-1',
      url: 'https://mui.com/x/react-chat/',
      title: 'MUI X Chat Documentation',
    },
  ],
};
```

### Slots

The `SourceUrlPart` component exposes three slots:

| Slot   | Default element | Description                |
| :----- | :-------------- | :------------------------- |
| `root` | `span`          | Outer container            |
| `icon` | `span`          | External link icon wrapper |
| `link` | `a`             | Clickable source link      |

## Source document parts

`ChatSourceDocumentMessagePart` represents an inline document excerpt—useful when the AI assistant quotes from a retrieved document:

```ts
interface ChatSourceDocumentMessagePart {
  type: 'source-document';
  sourceId: string;
  title?: string;
  text?: string;
}
```

| Field      | Type                | Description                          |
| :--------- | :------------------ | :----------------------------------- |
| `type`     | `'source-document'` | Discriminant for the part type union |
| `sourceId` | `string`            | Unique identifier for deduplication  |
| `title`    | `string`            | Optional document or section title   |
| `text`     | `string`            | Optional excerpt text                |

The default renderer displays the title in a bold style with the excerpt text below, wrapped in a bordered card.

### Slots

The `SourceDocumentPart` component exposes three slots:

| Slot      | Default element | Description            |
| :-------- | :-------------- | :--------------------- |
| `root`    | `div`           | Outer container (card) |
| `title`   | `div`           | Document title         |
| `excerpt` | `div`           | Excerpt text           |

## Streaming

Source parts arrive as single chunks—they aren't delivered incrementally:

```ts
// URL source chunk
{ type: 'source-url', sourceId: 'src-1', url: 'https://example.com', title: 'Example' }

// Document source chunk
{ type: 'source-document', sourceId: 'src-2', title: 'API Reference', text: 'The method accepts…' }
```

## Customizing source rendering

Override source part rendering through `slotProps.content.partProps` on `ChatBox`:

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    content: {
      partProps: {
        'source-url': {
          slots: { root: MyCustomSourceUrlRoot },
        },
        'source-document': {
          slots: { root: MyCustomSourceDocRoot },
        },
      },
    },
  }}
/>
```

To fully customize source rendering, register a custom renderer through `partRenderers` on `ChatProvider`:

```tsx
<ChatProvider
  adapter={adapter}
  partRenderers={{
    'source-url': ({ part }) => (
      <a href={part.url} className="citation-link">
        [{part.sourceId}] {part.title ?? part.url}
      </a>
    ),
  }}
>
  <ChatBox />
</ChatProvider>
```

## See also

- [Text and Markdown](/x/react-chat/display/message-parts/text-and-markdown/) for details on text content that references sources.
- [Custom parts](/x/react-chat/display/message-parts/custom-parts/) for details on building fully custom citation UI.
