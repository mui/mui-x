---
productId: x-chat
title: Chat - AI assistant
packageName: '@mui/x-chat'
---

# AI assistant

A production-ready AI assistant with streaming responses, markdown rendering, reasoning parts, and tool call display.

This example shows the full Material chat surface configured as an AI coding assistant.
The adapter streams text with markdown formatting, emits reasoning parts, and simulates a tool call.

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { ChatAdapter, ChatMessageChunk } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';
import { createChunkStream } from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

function createAssistantResponse(messageId: string): ChatMessageChunk[] {
  const reasoningId = `${messageId}-reasoning`;
  const textId = `${messageId}-text`;
  const toolId = `${messageId}-tool`;

  const reasoningText =
    'The user wants a summary. I should check the deployment status and format the response with markdown for readability.';
  const responseText =
    '## Deployment Summary\n\nAll systems are operational. Here are the key metrics:\n\n- **Build time**: 2m 34s\n- **Test coverage**: 94.2%\n- **Bundle size**: 142 KB (gzipped)\n\n```bash\nnpm run build # completed successfully\nnpm run test  # 847 tests passed\n```\n\nThe staging environment has been verified and is ready for promotion to production.';

  const reasoningChunks: ChatMessageChunk[] = [
    { type: 'reasoning-start', id: reasoningId },
    ...reasoningText
      .match(/.{1,20}/g)!
      .map(
        (delta) =>
          ({ type: 'reasoning-delta', id: reasoningId, delta }) as ChatMessageChunk,
      ),
    { type: 'reasoning-end', id: reasoningId },
  ];

  const textChunks: ChatMessageChunk[] = [
    { type: 'text-start', id: textId },
    ...responseText
      .match(/.{1,18}/g)!
      .map(
        (delta) => ({ type: 'text-delta', id: textId, delta }) as ChatMessageChunk,
      ),
    { type: 'text-end', id: textId },
  ];

  const toolChunks: ChatMessageChunk[] = [
    {
      type: 'tool-start',
      id: toolId,
      toolCallId: `call-${messageId}`,
      toolName: 'getDeployStatus',
    },
    {
      type: 'tool-delta',
      id: toolId,
      argsTextDelta: '{"env":"staging"}',
    },
    {
      type: 'tool-end',
      id: toolId,
      result: { status: 'healthy', version: '2.4.1', uptime: '3h 12m' },
    },
  ];

  return [
    { type: 'start', messageId },
    ...reasoningChunks,
    ...textChunks,
    ...toolChunks,
    { type: 'finish', messageId, finishReason: 'stop' },
  ];
}

const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    const responseId = `assistant-${message.id}`;
    return createChunkStream(createAssistantResponse(responseId), { delayMs: 60 });
  },
};

export default function AiAssistant() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 600 }}>
        <ChatBox
          adapter={adapter}
          defaultMessages={[
            {
              id: 'seed-1',
              role: 'user',
              author: demoUsers.you,
              createdAt: '2026-03-17T09:00:00.000Z',
              parts: [
                { type: 'text', text: 'Give me a deployment summary for staging.' },
              ],
            },
            {
              id: 'seed-2',
              role: 'assistant',
              author: demoUsers.agent,
              createdAt: '2026-03-17T09:01:00.000Z',
              parts: [
                {
                  type: 'reasoning',
                  text: 'The user wants a quick status update on the staging deployment. Let me check the CI pipeline.',
                },
                {
                  type: 'text',
                  text: '## Staging Status\n\nThe latest build deployed successfully.\n\n- **Version**: 2.4.0\n- **Tests**: All passing\n- **Uptime**: 12h 45m\n\nNo action needed — staging is healthy.',
                },
                {
                  type: 'tool',
                  toolInvocation: {
                    toolCallId: 'call-seed',
                    toolName: 'getDeployStatus',
                    state: 'result',
                    args: { env: 'staging' },
                    result: {
                      status: 'healthy',
                      version: '2.4.0',
                      uptime: '12h 45m',
                    },
                  },
                },
              ],
            },
          ]}
        />
      </Box>
    </Paper>
  );
}

```

## What this example demonstrates

- Streaming text responses with simulated chunk delays
- Markdown rendering with headings, code blocks, and lists
- Reasoning part displayed as a collapsible panel
- Tool call part showing a completed tool invocation
- Thread-only layout (no conversations sidebar)

## Key patterns

The adapter returns a `ReadableStream` that emits chunks in sequence:

1. `start` chunk to begin the message
2. `reasoning-start` / `reasoning-delta` / `reasoning-end` for the thinking step
3. `text-start` / `text-delta` / `text-end` for the visible response
4. `tool-start` / `tool-delta` / `tool-end` for tool invocations
5. `finish` to complete the message
