'use client';
import * as React from 'react';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import type {
  ChatAdapter,
  ChatMessage,
  ChatMessageChunk,
  ChatPartRendererMap,
} from '@mui/x-chat/headless';
import { createChunkStream } from 'docs/data/chat/material/examples/shared/demoUtils';

// --- Step delimiter renderer -------------------------------------------------
// This is the exact Material UI renderer documented under
// "### Step progress with Material UI" — `Divider` + a "Step N" caption.

const partRenderers: ChatPartRendererMap = {
  'step-start': ({ index, message }) => {
    const stepNumber = message.parts
      .slice(0, index + 1)
      .filter((part) => part.type === 'step-start').length;
    return (
      <Divider sx={{ my: 1 }} role="separator">
        <Typography variant="caption" color="text.secondary">
          Step {stepNumber}
        </Typography>
      </Divider>
    );
  },
};

// --- Scripted 3-step stream --------------------------------------------------
// Mirrors the page's "Step boundary chunks" example: search tool, analyze tool,
// then a final text answer — each wrapped in start-step/finish-step.

function createStepChunks(messageId: string): ChatMessageChunk[] {
  const textId = `${messageId}-text`;

  return [
    { type: 'start', messageId },

    // Step 1: Search for information
    { type: 'start-step' },
    {
      type: 'tool-input-start',
      toolCallId: 'call-1',
      toolName: 'search',
      dynamic: true,
    },
    {
      type: 'tool-input-available',
      toolCallId: 'call-1',
      toolName: 'search',
      input: { query: 'MUI X Chat documentation' },
      dynamic: true,
    } as any,
    {
      type: 'tool-output-available',
      toolCallId: 'call-1',
      output: { results: ['Step tracking guide'] },
    },
    { type: 'finish-step' },

    // Step 2: Analyze results
    { type: 'start-step' },
    {
      type: 'tool-input-start',
      toolCallId: 'call-2',
      toolName: 'analyze',
      dynamic: true,
    },
    {
      type: 'tool-input-available',
      toolCallId: 'call-2',
      toolName: 'analyze',
      input: { data: 'Step tracking guide' },
      dynamic: true,
    } as any,
    {
      type: 'tool-output-available',
      toolCallId: 'call-2',
      output: { summary: 'Use step-start parts as delimiters' },
    },
    { type: 'finish-step' },

    // Step 3: Final answer
    { type: 'start-step' },
    { type: 'text-start', id: textId },
    {
      type: 'text-delta',
      id: textId,
      delta: 'Step tracking delimits each phase with step-start parts.',
    },
    { type: 'text-end', id: textId },
    { type: 'finish-step' },

    { type: 'finish', messageId },
  ];
}

// --- Seeded exchange ---------------------------------------------------------
// One completed user/assistant pair so the "Step 1/2/3" dividers are visible on
// initial load; the reader can send another message to watch them stream in.

const seededMessages: ChatMessage[] = [
  {
    id: 'seed-user',
    role: 'user',
    parts: [{ type: 'text', text: 'Find and summarize the step tracking docs.' }],
  },
  {
    id: 'seed-assistant',
    role: 'assistant',
    parts: [
      { type: 'step-start' },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: 'seed-call-1',
          toolName: 'search',
          state: 'output-available',
          input: { query: 'MUI X Chat documentation' },
          output: { results: ['Step tracking guide'] },
        },
      },
      { type: 'step-start' },
      {
        type: 'dynamic-tool',
        toolInvocation: {
          toolCallId: 'seed-call-2',
          toolName: 'analyze',
          state: 'output-available',
          input: { data: 'Step tracking guide' },
          output: { summary: 'Use step-start parts as delimiters' },
        },
      },
      { type: 'step-start' },
      {
        type: 'text',
        text: 'Step tracking delimits each phase with step-start parts.',
      },
    ],
  },
];

// --- Component ---------------------------------------------------------------

export default function StepTrackingDemo() {
  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage() {
        return createChunkStream(createStepChunks('msg-1'), { delayMs: 170 });
      },
    }),
    [],
  );

  return (
    <ChatBox
      adapter={adapter}
      partRenderers={partRenderers}
      initialMessages={seededMessages}
      localeText={{ composerInputPlaceholder: 'Send a message to stream the steps' }}
      sx={{
        height: 420,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
