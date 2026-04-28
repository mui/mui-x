---
title: Chat - Code Block
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Code Block

<p class="description">Display code with a language label and copy-to-clipboard button using the ChatCodeBlock component.</p>

- **Automatic rendering**: `ChatBox` renders code fences from markdown as `ChatCodeBlock` automatically. No extra config needed.
- **Language label**: the language specified in the code fence (for example, ` ```python `) appears in the header bar.
- **Copy button**: clicking copies the raw code string to the clipboard and shows a check mark for 2 seconds.
- **Custom highlighter**: the standalone section below the chat shows the `highlighter` prop with a minimal Python keyword coloriser (no library required).

{{"demo": "CodeBlock.js", "bg": "inline"}}

## Basic usage

Use `ChatCodeBlock` as a standalone component by passing `children` (the code string) and an optional `language`:

```jsx
import { ChatCodeBlock } from '@mui/x-chat';

<ChatCodeBlock language="typescript">
  {`const greet = (name: string) => \`Hello, \${name}!\`;`}
</ChatCodeBlock>;
```

## Custom labels

Set `language` to any string—it is displayed as-is in the header:

```jsx
<ChatCodeBlock language="bash">{`pnpm add @mui/x-chat`}</ChatCodeBlock>
```

## Syntax highlighting

`ChatCodeBlock` intentionally does not bundle a syntax-highlighting library. Pass a `highlighter` function to integrate your preferred library (Shiki, Prism, highlight.js, etc.):

```jsx
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

## Automatic rendering in chat

When using `ChatBox`, any code fence in a markdown assistant message is automatically rendered as a `ChatCodeBlock`. This requires no additional configuration—the `renderMarkdown` function used internally by `ChatMessageContent` emits `ChatCodeBlock` for every code fence it encounters.

To customize the rendering further, override `partProps.text.renderText` on `ChatMessageContent`.

## API

- [ChatRoot](/x/api/chat/chat-root/)
