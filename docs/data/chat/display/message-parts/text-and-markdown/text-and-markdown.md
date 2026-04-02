---
productId: x-chat
title: Text & Markdown
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageContent
---

# Chat - Text & Markdown

<p class="description">Render plain text and markdown content in chat messages using the <code>ChatTextMessagePart</code> type and the built-in markdown renderer.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

Text parts are the most common message part type. Every message with written content — whether from a human user or an AI assistant — uses one or more `text` parts to carry that content.

## The text part data model

A text part is represented by the `ChatTextMessagePart` interface:

```ts
interface ChatTextMessagePart {
  type: 'text';
  text: string;
  state?: 'streaming' | 'done';
}
```

A message can contain multiple text parts alongside other part types (files, sources, tool calls). The `parts` array on `ChatMessage` holds them all:

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

## Markdown rendering

When using `ChatBox` with the Material UI layer (`@mui/x-chat`), text parts are rendered through a built-in markdown parser that converts common markdown syntax into React elements. This happens automatically — no configuration is needed.

The built-in parser supports:

- **Bold** (`**text**` or `__text__`)
- _Italic_ (`*text*` or `_text_`)
- `Inline code` (`` `code` ``)
- [Links](https://mui.com) (`[label](url)`)
- Headings (`# H1` through `###### H6`)
- Ordered and unordered lists
- Code fences (rendered as [`ChatCodeBlock`](/x/react-chat/display/message-parts/code-blocks/))
- Footnote citations (`[^1]`)

### Customizing text rendering

Override the markdown renderer through `partProps.text.renderText` on `ChatMessageContent`:

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    messageContent: {
      partProps: {
        text: {
          renderText: (text) => <MyCustomMarkdownRenderer content={text} />,
        },
      },
    },
  }}
/>
```

This lets you plug in any markdown library (react-markdown, remark, MDX) while keeping the rest of the chat UI intact.

### Plain text rendering

At the unstyled layer (`@mui/x-chat/unstyled`), text parts render as plain `<div>` elements with no markdown processing. The markdown renderer is a Material UI layer feature. If you are building on the unstyled primitives, provide your own `renderText` function through `partProps`:

```tsx
<Message.Content
  partProps={{
    text: {
      renderText: (text) => <ReactMarkdown>{text}</ReactMarkdown>,
    },
  }}
/>
```

## Streaming text

Text parts support incremental delivery through the streaming protocol. The stream uses three chunk types to build up a text part:

| Chunk type   | Purpose                         |
| :----------- | :------------------------------ |
| `text-start` | Opens a new text part           |
| `text-delta` | Appends a string fragment       |
| `text-end`   | Marks the text part as complete |

While tokens are arriving, the part's `state` field is `'streaming'`. Once the `text-end` chunk arrives, `state` transitions to `'done'`.

```ts
// During streaming
{ type: 'text', text: 'The answer is', state: 'streaming' }

// After completion
{ type: 'text', text: 'The answer is 42.', state: 'done' }
```

Use `state` to show a typing indicator or pulsing cursor while content is arriving:

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

The message list auto-scrolls to follow new streaming content as long as the user is near the bottom of the list.

## API

- [`ChatMessageContent`](/x/api/chat/chat-message-content/)

## See also

- [Code Blocks](/x/react-chat/display/message-parts/code-blocks/) for syntax-highlighted code fence rendering
- [Message Appearance](/x/react-chat/display/message-appearance/) for visual presentation of the message list
- [Message parts (headless)](/x/react-chat/customization/headless/) for rendering all part types from scratch
