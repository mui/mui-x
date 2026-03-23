'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatBox, ChatCodeBlock } from '@mui/x-chat';
import { nanoid } from 'nanoid';
import { createChunkStream, createTextResponseChunks } from '../shared/demoUtils';
import {
  demoUsers,
  minimalConversation,
  createTextMessage,
} from '../shared/demoData';

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
    id: nanoid(),
    conversationId: CONVERSATION_ID,
    role: 'user',
    text: 'Write me a Python function to flatten a nested list.',
    createdAt: '2026-03-15T10:00:00.000Z',
    author: demoUsers.you,
  }),
  createTextMessage({
    id: nanoid(),
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

function highlightPython(code) {
  const lines = code.split('\n');
  return lines.map((line, lineIndex) => {
    const tokens = [];
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
        const messageId = nanoid();
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
        defaultActiveConversationId={CONVERSATION_ID}
        defaultConversations={[minimalConversation]}
        defaultMessages={INITIAL_MESSAGES}
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
