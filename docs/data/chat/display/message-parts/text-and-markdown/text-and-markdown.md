---
productId: x-chat
title: Text and markdown
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent
---

# Chat - Text and markdown

<p class="description">Render plain text and markdown content in chat messages with the built-in renderer.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

Text parts are the most common message part. Every message with written content—whether from a human user or an AI assistant—uses one or more `text` parts to carry that content.

## Text part structure

A text part is represented by the `ChatTextMessagePart` interface:

```ts
interface ChatTextMessagePart {
  type: 'text';
  text: string;
  state?: 'streaming' | 'done';
}
```

A message can contain multiple text parts alongside other part types (files, sources, tool calls).
The `parts` array on `ChatMessage` holds them all:

```ts
const message: ChatMessage = {
  id: 'msg-1',
  role: 'assistant',
  parts: [
    { type: 'text', text: 'Here is the analysis you requested:' },
    {
      type: 'file',
      mediaType: 'image/png',
      url: '/chart.png',
      filename: 'chart.png',
    },
    { type: 'text', text: 'The chart shows a 15% increase in Q4.' },
  ],
};
```

The `reasoning` part shares the same structure (`text` plus optional `state`) and is rendered with the same markdown renderer — see [Reasoning](/x/react-chat/ai-and-agents/reasoning/).

## Markdown rendering

When using `ChatBox` with the Material UI layer (`@mui/x-chat`), text parts are rendered through a built-in markdown parser that converts common markdown syntax into React elements. This happens automatically, with no configuration needed.

The default renderer is streaming-aware: it repairs half-streamed markdown as tokens arrive, so partial syntax renders cleanly instead of leaking raw `**` or unclosed code-fence markers mid-stream.

The built-in parser supports:

- **Bold** (`**text**` or `__text__`)
- _Italic_ (`*text*` or `_text_`)
- `Inline code` (`` `code` ``)
- [Links](https://mui.com) (`[label](url)`)
- Images (`![alt](url)`)
- Headings (`# H1` through `###### H6`)
- Ordered and unordered lists
- Code fences (rendered as [`ChatCodeBlock`](/x/react-chat/display/message-parts/code-blocks/))
- Footnote citations (`[^1]`)

:::warning
**What is not rendered**

- Raw HTML in model output is never parsed into elements — it renders as escaped text.
- Link and image URLs pass through an allow-list sanitizer (`http`, `https`, `mailto`, `tel`; relative URLs are allowed). `javascript:`, `data:`, and protocol-relative `//host` URLs are neutralized to inert text.

This keeps untrusted model output XSS-safe by construction.
:::

{{"demo": "MarkdownPlayground.js"}}

### Customizing text rendering

Override the markdown renderer through `partProps.text.renderText` on `ChatMessageContent`:

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    content: {
      partProps: {
        text: {
          renderText: (text) => <MyCustomMarkdownRenderer content={text} />,
        },
      },
    },
  }}
/>
```

`renderText` receives the part's raw text string and returns any React node — the example below in [Streaming text](#streaming-text) shows what you give up when replacing the built-in renderer.

This lets you plug in any markdown library (react-markdown, remark, MDX) while keeping the rest of the chat UI intact. Replacing `renderText` replaces the entire pipeline for that part — including streaming repair and code-fence routing. Code fences are rendered by the same built-in renderer, so a custom `renderText` also takes over code-block rendering — see [Code blocks](/x/react-chat/display/message-parts/code-blocks/) for rendering fences with your own component.

## Streaming text

Text parts support incremental delivery through the streaming protocol. The stream uses three chunk types to build up a text part:

| Chunk type   | Purpose                         |
| :----------- | :------------------------------ |
| `text-start` | Opens a new text part           |
| `text-delta` | Appends a string fragment       |
| `text-end`   | Marks the text part as complete |

While tokens are arriving, the part's `state` field is `'streaming'`.
Once the `text-end` chunk arrives, `state` transitions to `'done'`, as shown below:

```ts
// During streaming
{ type: 'text', text: 'The answer is', state: 'streaming' }

// After completion
{ type: 'text', text: 'The answer is 42.', state: 'done' }
```

{{"demo": "StreamingMarkdown.js"}}

When composing a fully custom message renderer (for example with the headless package), use the part's `state` field to show a typing indicator or pulsing cursor while content is arriving:

```tsx
function TextPartDisplay({ part }: { part: ChatTextMessagePart }) {
  return (
    <span>
      {part.text}
      {part.state === 'streaming' && <span className="cursor" />}
    </span>
  );
}
```

The built-in Material UI renderer already handles this: it stays streaming-aware and repairs partial markdown automatically (see [Markdown rendering](#markdown-rendering)). Note that `partProps.text.renderText` receives only the raw text string — if you need the part's `state`, you must take over part rendering entirely.

## See also

- See [Scrolling](/x/react-chat/behavior/scrolling/) for how the message list follows streaming content.
- See [Reasoning](/x/react-chat/ai-and-agents/reasoning/) for the `reasoning` part, which shares the text part's structure and renderer.
- See [Code blocks](/x/react-chat/display/message-parts/code-blocks/) for details on syntax-highlighted code fence rendering.
- See [Message appearance](/x/react-chat/display/message-appearance/) for details on the visual presentation of the message list.
