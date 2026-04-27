---
title: Chat - Message parts
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Message parts

<p class="description">Render reasoning, sources, files, step markers, and data parts with your own plain React markup.</p>

This demo demonstrates how to render the various message part types that the streaming protocol produces.
Every assistant message has a `parts` array where each entry is a typed object.
Core does not render these parts for you—you branch on `part.type` and render whatever you want.

## Key concepts

### The part type union

Each part in `message.parts` has a `type` discriminant:

```tsx
message.parts.map((part, index) => {
  switch (part.type) {
    case 'text':
      return <p key={index}>{part.text}</p>;
    case 'reasoning':
      return (
        <details key={index}>
          <summary>Thinking</summary>
          {part.text}
        </details>
      );
    case 'file':
      return (
        <a key={index} href={part.url}>
          {part.filename ?? 'File'}
        </a>
      );
    case 'source-url':
      return (
        <a key={index} href={part.url}>
          {part.title ?? part.url}
        </a>
      );
    case 'source-document':
      return <cite key={index}>{part.title}</cite>;
    case 'tool':
      return <pre key={index}>{JSON.stringify(part.toolInvocation, null, 2)}</pre>;
    case 'step-start':
      return <hr key={index} />;
    default:
      // data-* parts and custom parts
      return <pre key={index}>{JSON.stringify(part, null, 2)}</pre>;
  }
});
```

### Built-in part types

| Part type         | Key fields                     | Description                    |
| :---------------- | :----------------------------- | :----------------------------- |
| `text`            | `text`, `state`                | Plain text content             |
| `reasoning`       | `text`, `state`                | Chain-of-thought trace         |
| `file`            | `mediaType`, `url`, `filename` | Inline file                    |
| `source-url`      | `sourceId`, `url`, `title`     | URL citation                   |
| `source-document` | `sourceId`, `title`, `text`    | Document citation              |
| `tool`            | `toolInvocation`               | Tool call with state lifecycle |
| `dynamic-tool`    | `toolInvocation`               | Unregistered tool call         |
| `step-start`      | (none)                         | Step boundary marker           |
| `data-*`          | `type`, `data`, `transient`    | Custom data payload            |

### Streaming state on parts

Text and reasoning parts have an optional `state` field:

- `'streaming'`: the part is still receiving deltas
- `'done'`: the part is complete

Use this to show a typing indicator or pulsing cursor while content is arriving.

## Key takeaways

- Message parts are typed data—you own the rendering completely
- Branch on `part.type` in a switch statement for straightforward rendering
- Use `part.state` on text and reasoning parts to show streaming indicators
- For app-specific part types, register renderers via `partRenderers` or use `useChatPartRenderer()`

## See also

- [Streaming](/x/react-chat/core/streaming/) for how chunks produce each part type
- [Type augmentation](/x/react-chat/core/types/) for registering custom part types
- [Tool approval and renderers](/x/react-chat/core/examples/tool-approval-and-renderers/) for custom renderer registration

## API

- [ChatRoot](/x/api/chat/chat-root/)
