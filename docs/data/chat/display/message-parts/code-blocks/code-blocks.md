---
productId: x-chat
title: Code Blocks
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatCodeBlock
---

# Chat - Code Blocks

<p class="description">Display code with a language label and copy-to-clipboard button using the <code>ChatCodeBlock</code> component.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

`ChatCodeBlock` renders fenced code blocks with a header bar showing the language label and a one-click copy button.

## Import

```tsx
import { ChatCodeBlock } from '@mui/x-chat';
```

## Automatic rendering in chat

When using `ChatBox`, any code fence in a markdown assistant message is automatically rendered as a `ChatCodeBlock`. No extra configuration is needed — the built-in `renderMarkdown` function emits `ChatCodeBlock` for every code fence it encounters.

````text
```python
def greet(name):
    return f"Hello, {name}!"
```
````

The language specified after the opening backticks (e.g. `python`) appears in the header bar.

{{"demo": "../../../material/examples/code-block/CodeBlock.js", "defaultCodeOpen": false, "bg": "inline"}}

## Standalone usage

Use `ChatCodeBlock` as a standalone component by passing `children` (the code string) and an optional `language`:

```tsx
<ChatCodeBlock language="typescript">
  {`const greet = (name: string) => \`Hello, \${name}!\`;`}
</ChatCodeBlock>
```

## Copy button

Clicking the copy button copies the raw code string to the clipboard and shows a check mark icon for 2 seconds. The copy behavior uses the Clipboard API (`navigator.clipboard.writeText`).

## Language label

Set `language` to any string — it is displayed as-is in the header:

```tsx
<ChatCodeBlock language="bash">{`pnpm add @mui/x-chat`}</ChatCodeBlock>
```

When no language is provided, the header still renders but the label area is empty.

## Syntax highlighting

`ChatCodeBlock` intentionally does not bundle a syntax-highlighting library. Pass a `highlighter` function to integrate your preferred library (Shiki, Prism, highlight.js, etc.):

```tsx
import { ChatCodeBlock } from '@mui/x-chat';
import { codeToHtml } from 'shiki';

function ShikiBlock({ code, language }) {
  const [html, setHtml] = React.useState('');

  React.useEffect(() => {
    codeToHtml(code, { lang: language, theme: 'github-light' }).then(setHtml);
  }, [code, language]);

  return (
    <ChatCodeBlock
      language={language}
      highlighter={() => <span dangerouslySetInnerHTML={{ __html: html }} />}
    >
      {code}
    </ChatCodeBlock>
  );
}
```

The `highlighter` prop receives `(code, language)` and should return React nodes. When omitted, the raw code string is displayed with no highlighting.

## Customizing rendering in ChatBox

To customize how code fences render inside `ChatBox`, override `partProps.text.renderText` on `ChatMessageContent` with a custom markdown renderer that uses your own code block component:

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    messageContent: {
      partProps: {
        text: {
          renderText: (text) => <MyMarkdownWithCustomCodeBlocks content={text} />,
        },
      },
    },
  }}
/>
```

## CSS classes

| Class name                        | Description              |
| :-------------------------------- | :----------------------- |
| `.MuiChatCodeBlock-root`          | Root container           |
| `.MuiChatCodeBlock-header`        | Header bar               |
| `.MuiChatCodeBlock-languageLabel` | Language label text      |
| `.MuiChatCodeBlock-copyButton`    | Copy-to-clipboard button |
| `.MuiChatCodeBlock-pre`           | Pre element wrapper      |
| `.MuiChatCodeBlock-code`          | Code element             |

## See also

- [Text & Markdown](/x/react-chat/display/message-parts/text-and-markdown/) for the text part data model and markdown rendering
- [Custom Parts](/x/react-chat/display/message-parts/custom-parts/) for building custom part renderers

## API

- [`ChatCodeBlock`](/x/api/chat/chat-code-block/)
