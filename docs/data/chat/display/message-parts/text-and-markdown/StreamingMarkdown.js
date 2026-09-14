'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';

import {
  createChunkStream,
  createTextResponseChunks,
  randomId,
} from 'docs/data/chat/core/examples/shared/demoUtils';

// A markdown-rich answer whose bold span and fenced code block are deliberately
// long enough that mid-stream chunks split inside `**…**` and inside the fence —
// so you can watch the built-in streaming repair render them cleanly instead of
// flashing raw `**` or an unclosed code fence.
const MARKDOWN_REPLY = `**Here is what I found** for your request:

1. Markdown streams in token by token.
2. Partial **bold** and code fences are repaired mid-stream.
3. The bubble never leaks raw \`**\` markers.

\`\`\`ts
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`
`;

const conversation = {
  id: 'streaming-markdown',
  title: 'Streaming markdown',
  participants: [],
};

const messages = [
  {
    id: 'streaming-markdown-welcome',
    conversationId: conversation.id,
    role: 'assistant',
    status: 'sent',
    createdAt: '2026-03-15T10:00:00.000Z',
    parts: [
      { type: 'text', text: 'Send anything — I reply with streaming markdown.' },
    ],
  },
];

const streamingAdapter = {
  async sendMessage() {
    return createChunkStream(createTextResponseChunks(randomId(), MARKDOWN_REPLY), {
      delayMs: 60,
    });
  },
};

export default function StreamingMarkdown() {
  return (
    <ChatBox
      adapter={streamingAdapter}
      initialActiveConversationId={conversation.id}
      initialConversations={[conversation]}
      initialMessages={messages}
      sx={{
        height: 460,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
