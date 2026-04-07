---
title: Chat - Code Block
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Code block

<p class="description">Display code with a language label and copy-to-clipboard button using the <code>ChatCodeBlock</code> component.</p>

- **Automatic rendering** — `ChatBox` renders code fences from markdown as `ChatCodeBlock` automatically. No extra config needed.
- **Language label** — the language specified in the code fence (e.g. ` ```python `) appears in the header bar.
- **Copy button** — clicking copies the raw code string to the clipboard and shows a check mark for 2 seconds.
- **Custom highlighter** — the standalone section below the chat shows the `highlighter` prop with a minimal Python keyword coloriser (no library required).

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
    id: 'cb-msg-1',
    conversationId: CONVERSATION_ID,
    role: 'user',
    text: 'Write me a Python function to flatten a nested list.',
    createdAt: '2026-03-15T10:00:00.000Z',
    author: demoUsers.you,
  }),
  createTextMessage({
    id: 'cb-msg-2',
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

## Basic usage

Use `ChatCodeBlock` as a standalone component by passing `children` (the code string) and an optional `language`:

```jsx
import { ChatCodeBlock } from '@mui/x-chat';

<ChatCodeBlock language="typescript">
  {`const greet = (name: string) => \`Hello, \${name}!\`;`}
</ChatCodeBlock>;
```

## Custom labels

Set `language` to any string — it is displayed as-is in the header:

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

When using `ChatBox`, any code fence in a markdown assistant message is automatically rendered as a `ChatCodeBlock`. This requires no additional configuration — the `renderMarkdown` function used internally by `ChatMessageContent` emits `ChatCodeBlock` for every code fence it encounters.

To customize the rendering further, override `partProps.text.renderText` on `ChatMessageContent`.

## API

- [ChatRoot](/x/api/chat/chat-root/)
