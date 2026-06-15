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

## Rendering source parts

The demo below seeds an assistant message containing a `source-url` and a `source-document` part. Both are rendered automatically by the built-in part renderers:

{{"demo": "SourcePartsDemo.js", "bg": "inline", "defaultCodeOpen": false}}

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
| `sourceId` | `string`       | Stable identifier for the source           |
| `url`      | `string`       | URL of the source                          |
| `title`    | `string`       | Optional display title (falls back to URL) |

Duplicate `sourceId` values are not merged automatically — deduplicate in your adapter if needed.

### Rendering

Source URLs are rendered as inline links with an external-link icon that open in a new tab. The link text shows the `title` when available, otherwise the raw `url`.

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

The `[^1]` footnote marker is rendered as a superscript by the built-in markdown parser (see [Text and Markdown](/x/react-chat/display/message-parts/text-and-markdown/)). It's a visual convention only — it is not automatically linked to the source part that follows; keep markers and sources in matching order yourself.

### Slots

Source URL parts are rendered by the `SourceUrlPart` component (exported from `@mui/x-chat/headless`), which exposes three slots:

| Slot   | Default element | Description                |
| :----- | :-------------- | :------------------------- |
| `root` | `span`          | Outer container            |
| `icon` | `span`          | External link icon wrapper |
| `link` | `a`             | Clickable source link      |

:::info
Source links open in a new tab with `rel="noreferrer noopener"` applied automatically. The accessible name is the `title` when provided, falling back to the raw `url` — provide titles so screen readers announce something meaningful. The external-link icon is `aria-hidden`, so it isn't announced.
:::

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
| `sourceId` | `string`            | Stable identifier for the source     |
| `title`    | `string`            | Optional document or section title   |
| `text`     | `string`            | Optional excerpt text                |

### Rendering

The default renderer shows the title in bold with the excerpt text below, wrapped in a bordered card.

```tsx
// How it appears in the parts array
const message: ChatMessage = {
  id: 'msg-2',
  role: 'assistant',
  parts: [
    { type: 'text', text: 'The theming guide describes the override order:' },
    {
      type: 'source-document',
      sourceId: 'src-2',
      title: 'Theming guide — slot overrides',
      text: 'Slots are resolved in order: theme defaults, then component props.',
    },
  ],
};
```

### Slots

Document parts are rendered by the `SourceDocumentPart` component (exported from `@mui/x-chat/headless`), which exposes three slots:

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

The snippets below assume an `adapter` is already configured — see [Backend adapters](/x/react-chat/backend/adapters/) for setup.

Override source part rendering through `slotProps.messageContent.partProps` on `ChatBox`:

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    messageContent: {
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

To fully customize source rendering, register a custom renderer through the `partRenderers` prop:

```tsx
<ChatBox
  adapter={adapter}
  partRenderers={{
    'source-url': ({ part }) => (
      <a href={part.url} className="citation-link">
        [{part.sourceId}] {part.title ?? part.url}
      </a>
    ),
  }}
/>
```

When composing the headless primitives directly, pass the same `partRenderers` map to `ChatProvider` from `@mui/x-chat/headless` — see [Custom parts](/x/react-chat/display/message-parts/custom-parts/).

## Standalone sources list

Source parts render inline where they appear in the message. To present a consolidated citation list at the end of an answer — the pattern most RAG UIs use — compose the standalone `ChatMessageSources` and `ChatMessageSource` components yourself. They are presentational primitives: you map your collected sources to them; they are not driven by message parts.

`ChatMessageSources` renders an ordered list (`ol`/`li`), so assistive technology announces the citation count and position.

{{"demo": "ChatMessageSourcesPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## See also

- [Text and Markdown](/x/react-chat/display/message-parts/text-and-markdown/) for details on text content that references sources.
- [Custom parts](/x/react-chat/display/message-parts/custom-parts/) for details on building fully custom citation UI.
