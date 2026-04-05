---
productId: x-chat
title: Code Blocks
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatCodeBlock
---

# Chat - Code Blocks

<p class="description">Display code with a language label and copy-to-clipboard button using the <code>ChatCodeBlock</code> component.</p>



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

```tsx
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatBox, ChatCodeBlock } from '@mui/x-chat';
import {
  createChunkStream,
  createTextResponseChunks,
  randomId,
} from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  demoUsers,
  minimalConversation,
  createTextMessage,
} from 'docsx/data/chat/material/examples/shared/demoData';

const CONVERSATION_ID = minimalConversation.id;

const PYTHON_SNIPPET = `def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result`;

const ASSISTANT_REPLY = `Here's a recursive Python function that flattens a nested list:

\`\`\`python
${PYTHON_SNIPPET}
\`\`\`

It works by iterating over each item — if the item is itself a list it recurses, otherwise it appends the value directly.`;

const INITIAL_MESSAGES = [
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'user',
    text: 'Write me a Python function to flatten a nested list.',
    createdAt: '2026-03-15T10:00:00.000Z',
    author: demoUsers.you,
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    text: ASSISTANT_REPLY,
    createdAt: '2026-03-15T10:00:05.000Z',
    author: demoUsers.agent,
  }),
];

// Minimal keyword highlighter — no library needed for the demo
const KW_AT_START = /^(def|for|if|else|return|in|isinstance)(?=\W|$)/;
const KW_ANYWHERE = /\b(?:def|for|if|else|return|in|isinstance)\b/;

function highlightPython(code: string): React.ReactNode {
  const lines = code.split('\n');
  return lines.map((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    let rest = line;
    let key = 0;

    while (rest.length > 0) {
      const kwMatch = KW_AT_START.exec(rest);
      if (kwMatch) {
        tokens.push(
          <span key={key} style={{ color: '#c792ea' }}>
            {kwMatch[1]}
          </span>,
        );
        rest = rest.slice(kwMatch[1].length);
        key += 1;
        continue;
      }

      const nextIdx = rest.search(KW_ANYWHERE);
      const end = nextIdx <= 0 ? 1 : nextIdx;
      tokens.push(rest.slice(0, end));
      rest = rest.slice(end);
      key += 1;
    }

    return (
      <React.Fragment key={lineIndex}>
        {tokens}
        {lineIndex < lines.length - 1 ? '\n' : null}
      </React.Fragment>
    );
  });
}

export default function CodeBlock() {
  const adapter = React.useMemo(
    () => ({
      async sendMessage() {
        const messageId = randomId();
        return createChunkStream(
          createTextResponseChunks(messageId, ASSISTANT_REPLY, {
            author: demoUsers.agent,
          }),
          { delayMs: 40 },
        );
      },
    }),
    [],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <ChatBox
        adapter={adapter}
        initialActiveConversationId={CONVERSATION_ID}
        initialConversations={[minimalConversation]}
        initialMessages={INITIAL_MESSAGES}
        sx={{
          height: 480,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
      <div>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Standalone with custom highlighter
        </Typography>
        <ChatCodeBlock language="python" highlighter={highlightPython}>
          {PYTHON_SNIPPET}
        </ChatCodeBlock>
      </div>
    </Box>
  );
}

```

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
