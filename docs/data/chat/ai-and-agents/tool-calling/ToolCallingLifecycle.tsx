'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatDynamicToolInvocation,
  ChatMessageChunk,
  ChatPartRendererMap,
  ChatToolInvocation,
  ChatToolInvocationState,
} from '@mui/x-chat/headless';
import {
  createChunkStream,
  randomId,
} from 'docs/data/chat/core/examples/shared/demoUtils';

// --- ToolCard: the complete implementation referenced from the docs ----------

const stateColor: Record<
  ChatToolInvocationState,
  'default' | 'info' | 'warning' | 'success' | 'error'
> = {
  'input-streaming': 'info',
  'input-available': 'info',
  'approval-requested': 'warning',
  'approval-responded': 'warning',
  'output-available': 'success',
  'output-error': 'error',
  'output-denied': 'error',
};

function ToolCard({
  invocation,
}: {
  invocation: ChatToolInvocation | ChatDynamicToolInvocation;
}) {
  const isWorking =
    invocation.state === 'input-streaming' || invocation.state === 'input-available';

  return (
    <Card variant="outlined" sx={{ my: 1, maxWidth: 360 }}>
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
          {isWorking && <CircularProgress size={16} />}
          <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>
            {invocation.toolName}
          </Typography>
          <Chip
            size="small"
            label={invocation.state}
            color={stateColor[invocation.state]}
          />
        </Stack>

        {invocation.input != null && (
          <Box component="pre" sx={{ m: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(invocation.input, null, 2)}
          </Box>
        )}

        {invocation.state === 'output-available' && invocation.output != null && (
          <Box
            component="pre"
            sx={{ mt: 1, mb: 0, fontSize: 12, whiteSpace: 'pre-wrap' }}
          >
            {JSON.stringify(invocation.output, null, 2)}
          </Box>
        )}

        {invocation.state === 'output-error' && invocation.errorText && (
          <Typography variant="body2" color="error">
            {invocation.errorText}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

const partRenderers: ChatPartRendererMap = {
  tool: ({ part }) => <ToolCard invocation={part.toolInvocation} />,
  'dynamic-tool': ({ part }) => <ToolCard invocation={part.toolInvocation} />,
};

// --- Scripted tool-call stream -----------------------------------------------

function createWeatherChunks(messageId: string): ChatMessageChunk[] {
  const textId = `${messageId}-intro`;
  const outroId = `${messageId}-outro`;
  const toolCallId = `${messageId}-call`;

  return [
    { type: 'start', messageId },

    { type: 'text-start', id: textId },
    { type: 'text-delta', id: textId, delta: 'Let me check the weather in Paris.' },
    { type: 'text-end', id: textId },

    { type: 'tool-input-start', toolCallId, toolName: 'get_weather', dynamic: true },
    { type: 'tool-input-delta', toolCallId, inputTextDelta: '{"city":' },
    { type: 'tool-input-delta', toolCallId, inputTextDelta: '"Paris"}' },
    {
      type: 'tool-input-available',
      toolCallId,
      toolName: 'get_weather',
      input: { city: 'Paris' },
      dynamic: true,
    } as any,

    {
      type: 'tool-output-available',
      toolCallId,
      output: { temperature: 22, condition: 'sunny' },
    },

    { type: 'text-start', id: outroId },
    { type: 'text-delta', id: outroId, delta: "It's 22°C and sunny in Paris." },
    { type: 'text-end', id: outroId },

    { type: 'finish', messageId },
  ];
}

// --- Component ---------------------------------------------------------------

export default function ToolCallingLifecycle() {
  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage() {
        return createChunkStream(createWeatherChunks(randomId()), { delayMs: 500 });
      },
    }),
    [],
  );

  return (
    <ChatBox
      adapter={adapter}
      partRenderers={partRenderers}
      localeText={{ composerInputPlaceholder: 'Ask about the weather' }}
      sx={{
        height: 420,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
