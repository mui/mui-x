---
productId: x-chat
title: Code blocks
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatCodeBlock
---

# Chat - Code blocks

<p class="description">Display code with a language label and copy-to-clipboard button using the <code>ChatCodeBlock</code> component.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatCodeBlock` renders fenced code blocks with a header bar showing the language label and a one-click copy button.

## Interactive playground

The demo below lets you swap languages and content live:

{{"demo": "ChatCodeBlockPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## Import

```tsx
import { ChatCodeBlock } from '@mui/x-chat';
```

## Automatic rendering in chat

When using `ChatBox`, any code fence in a markdown assistant message is automatically rendered as a `ChatCodeBlock`. No extra configuration is needed—the built-in markdown renderer emits `ChatCodeBlock` for every fenced code block it encounters.

````text
```python
def greet(name):
    return f"Hello, {name}!"
```
````

The language specified after the opening backticks (for example, `python`) appears in the header bar, as the demo below shows:

{{"demo": "../../../material/examples/code-block/CodeBlock.js", "defaultCodeOpen": false, "bg": "inline"}}

## Standalone usage

Use `ChatCodeBlock` as a standalone component by passing `children` (the code as a plain string—not React nodes; use `highlighter` to inject markup) and an optional `language`:

```tsx
<ChatCodeBlock language="typescript">
  {`const greet = (name: string) => \`Hello, \${name}!\`;`}
</ChatCodeBlock>
```

## Copy button

Clicking the copy button copies the raw code string to the clipboard and shows a check mark icon for two seconds.
The copy behavior uses the Clipboard API (`navigator.clipboard.writeText`).

On insecure (`http://`) origins and older browsers without the async Clipboard API, the component falls back to the synchronous `document.execCommand('copy')` path. If copying fails entirely, the button's accessible label and tooltip read "Copy failed" for two seconds instead.

## Language label

Set `language` to any string—it is displayed as-is in the header:

```tsx
<ChatCodeBlock language="bash">{`pnpm add @mui/x-chat`}</ChatCodeBlock>
```

When no language is provided, the header still renders with an empty label area—the copy button is then its only visible content.

## Syntax highlighting

`ChatCodeBlock` intentionally does not bundle a syntax-highlighting library.
Pass a `highlighter` function to integrate your preferred library (Shiki, Prism, highlight.js, and so on):

```tsx
<ChatCodeBlock
  language="python"
  highlighter={(code, language) => highlight(code, language)}
>
  {pythonSnippet}
</ChatCodeBlock>
```

The `highlighter` prop receives `(code, language)` and should return React nodes.
When omitted, the raw code string is displayed with no highlighting.
The function is called on every render, so highlighting stays in sync as streamed code grows.
The live demos on this page show working synchronous implementations: the playground's `tokens` option and the standalone block in the demo below the "Automatic rendering" section.

### Async highlighters (Shiki)

Some libraries, such as Shiki, highlight asynchronously. Wrap `ChatCodeBlock` in a component that resolves the highlight in an effect and falls back to the raw code until it is ready:

```tsx
import { ChatCodeBlock } from '@mui/x-chat';
import { codeToHtml } from 'shiki';

function ShikiBlock({ code, language }) {
  const [html, setHtml] = React.useState(null);

  React.useEffect(() => {
    let active = true;
    codeToHtml(code, { lang: language, theme: 'github-light' }).then((result) => {
      if (active) {
        setHtml(result);
      }
    });
    return () => {
      active = false;
    };
  }, [code, language]);

  return (
    <ChatCodeBlock
      language={language}
      // Fall back to the raw code until the async highlight resolves,
      // so the block never renders empty mid-stream.
      highlighter={(rawCode) =>
        html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : rawCode
      }
    >
      {code}
    </ChatCodeBlock>
  );
}
```

Async highlighters resolve after render, so always return the raw code (or the previous result) as a fallback—during streaming the block briefly shows the prior highlight until the new one resolves.
Highlighters that return HTML strings are injected with `dangerouslySetInnerHTML`—you own sanitizing that output. The built-in markdown rendering never injects raw HTML.

## Customizing rendering in ChatBox

To customize how code fences render inside `ChatBox`, override `partProps.text.renderText` on `ChatMessageContent` with a custom markdown renderer that uses your own code block component. See [Text and markdown](/x/react-chat/display/message-parts/text-and-markdown/) for the `renderText` contract and the text part data model.

```tsx
<ChatBox
  adapter={adapter}
  slotProps={{
    content: {
      partProps: {
        text: {
          renderText: (text) => <MyMarkdownWithCustomCodeBlocks content={text} />,
        },
      },
    },
  }}
/>
```

## Accessibility

Inside a message list, the copy button follows the drill-in model: it stays out of the Tab order until the user presses <kbd>Enter</kbd> on the focused message, keeping the whole list a single Tab stop. Mouse clicks always work, and in standalone usage the button keeps the natural tab order.

The button's accessible name reflects the copy state—"Copy", then "Copied!" or "Copy failed" for two seconds.

See [Message list—Accessibility](/x/react-chat/material/message-list/#accessibility) for the full keyboard navigation model.

## CSS classes

The authoritative list is generated on the [ChatCodeBlock API page](/x/api/chat/chat-code-block/#classes).

| Class name                        | Description              |
| :-------------------------------- | :----------------------- |
| `.MuiChatCodeBlock-root`          | Root container           |
| `.MuiChatCodeBlock-header`        | Header bar               |
| `.MuiChatCodeBlock-languageLabel` | Language label text      |
| `.MuiChatCodeBlock-copyButton`    | Copy-to-clipboard button |
| `.MuiChatCodeBlock-pre`           | Pre element wrapper      |
| `.MuiChatCodeBlock-code`          | Code element             |

## See also

- [Text and markdown](/x/react-chat/display/message-parts/text-and-markdown/) for the text part data model and markdown rendering
- [Custom parts](/x/react-chat/display/message-parts/custom-parts/) for building custom part renderers
