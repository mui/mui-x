import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { ChatBox } from '@mui/x-chat';
import { createChunkStream } from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

function createAssistantResponse(messageId) {
  const reasoningId = `${messageId}-reasoning`;
  const textId = `${messageId}-text`;
  const toolId = `${messageId}-tool`;

  const reasoningText =
    'The user wants a summary. I should check the deployment status and format the response with markdown for readability.';
  const responseText =
    '## Deployment Summary\n\nAll systems are operational. Here are the key metrics:\n\n- **Build time**: 2m 34s\n- **Test coverage**: 94.2%\n- **Bundle size**: 142 KB (gzipped)\n\n```bash\nnpm run build # completed successfully\nnpm run test  # 847 tests passed\n```\n\nThe staging environment has been verified and is ready for promotion to production.';

  const reasoningChunks = [
    { type: 'reasoning-start', id: reasoningId },
    ...reasoningText
      .match(/.{1,20}/g)
      .map((delta) => ({ type: 'reasoning-delta', id: reasoningId, delta })),
    { type: 'reasoning-end', id: reasoningId },
  ];

  const textChunks = [
    { type: 'text-start', id: textId },
    ...responseText
      .match(/.{1,18}/g)
      .map((delta) => ({ type: 'text-delta', id: textId, delta })),
    { type: 'text-end', id: textId },
  ];

  const toolChunks = [
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

const adapter = {
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
