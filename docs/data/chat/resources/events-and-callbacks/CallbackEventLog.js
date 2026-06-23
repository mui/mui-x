'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ChatBox } from '@mui/x-chat';

import { demoUsers } from 'docs/data/chat/core/examples/shared/demoData';
import { createChunkStream } from 'docs/data/chat/core/examples/shared/demoUtils';

// Register the `data-progress` payload so `part.data` is typed everywhere below.

const demoMembers = [demoUsers.alice, demoUsers.agent];

function createAdapter(failNextRef) {
  return {
    async sendMessage({ message }) {
      const messageId = `events-assistant-${message.id}`;
      const textId = `${messageId}-text`;
      const toolCallId = `inventory-${message.id}`;
      const shouldFail = failNextRef.current;
      failNextRef.current = false;

      return createChunkStream(
        [
          { type: 'start', messageId },
          { type: 'text-start', id: textId },
          {
            type: 'text-delta',
            id: textId,
            delta: 'Checking inventory and reporting progress…',
          },
          { type: 'text-end', id: textId },
          { type: 'tool-input-start', toolCallId, toolName: 'inventory.search' },
          {
            type: 'tool-input-available',
            toolCallId,
            toolName: 'inventory.search',
            input: { sku: 'CHAIR-04', warehouse: 'prg-1' },
          },
          {
            type: 'tool-output-available',
            toolCallId,
            output: { sku: 'CHAIR-04', available: 14, warehouse: 'prg-1' },
          },
          { type: 'data-progress', data: { percent: 25 }, transient: true },
          { type: 'data-progress', data: { percent: 60 }, transient: true },
          { type: 'data-progress', data: { percent: 100 }, transient: true },
          { type: 'finish', messageId, finishReason: 'stop' },
        ],
        shouldFail ? { delayMs: 220, errorAfterChunk: 4 } : { delayMs: 220 },
      );
    },
  };
}

export default function CallbackEventLog() {
  const [failNext, setFailNext] = React.useState(false);
  const [log, setLog] = React.useState([]);
  const failNextRef = React.useRef(false);

  React.useEffect(() => {
    failNextRef.current = failNext;
  }, [failNext]);

  const adapter = React.useMemo(() => createAdapter(failNextRef), []);

  // A single useCallback-wrapped logger keeps the callback identities stable, so
  // ChatProvider's runtime context is not invalidated on every render.
  const appendLog = React.useCallback((entry) => {
    setLog((previous) => [entry, ...previous].slice(0, 12));
  }, []);

  const handleFinish = React.useCallback(
    ({ isAbort, isError }) => {
      appendLog(`onFinish isAbort=${isAbort} isError=${isError}`);
    },
    [appendLog],
  );

  const handleToolCall = React.useCallback(
    ({ toolCall }) => {
      appendLog(`onToolCall ${toolCall.toolName} → ${toolCall.state}`);
    },
    [appendLog],
  );

  const handleData = React.useCallback(
    (part) => {
      if (part.type === 'data-progress') {
        const { percent } = part.data;
        appendLog(`onData ${part.type} ${JSON.stringify({ percent })}`);
      } else {
        appendLog(`onData ${part.type} ${JSON.stringify(part.data)}`);
      }
    },
    [appendLog],
  );

  const handleError = React.useCallback(
    (error) => {
      appendLog(`onError [${error.code}] ${error.source}: ${error.message}`);
    },
    [appendLog],
  );

  return (
    <Paper variant="outlined" sx={{ p: 2, width: '100%' }}>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Callback event log
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={failNext}
              onChange={(event) => setFailNext(event.target.checked)}
            />
          }
          label="Fail next response"
        />
      </Stack>

      <ChatBox
        adapter={adapter}
        members={demoMembers}
        onFinish={handleFinish}
        onToolCall={handleToolCall}
        onData={handleData}
        onError={handleError}
        sx={{
          height: 360,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
      <Box
        sx={{
          mt: 1.5,
          p: 1.5,
          maxHeight: 200,
          overflow: 'auto',
          bgcolor: 'grey.900',
          color: 'grey.100',
          fontFamily: 'monospace',
          fontSize: 12,
          borderRadius: 1,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {log.join('\n') || 'Send a message to watch callbacks fire here.'}
      </Box>
    </Paper>
  );
}
