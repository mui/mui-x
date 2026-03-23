'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { nanoid } from 'nanoid';
import { ChatBox, ChatPlan } from '@mui/x-chat';
import { createChunkStream, createTextResponseChunks } from '../shared/demoUtils';
import { demoUsers, minimalConversation, minimalMessages } from '../shared/demoData';

const INITIAL_STEPS = [
  { id: '1', label: 'Analyze repository structure', status: 'pending' },
  { id: '2', label: 'Identify test gaps', status: 'pending' },
  { id: '3', label: 'Write unit tests', status: 'pending' },
  { id: '4', label: 'Run test suite', status: 'pending' },
  { id: '5', label: 'Open pull request', status: 'pending' },
];

const STEP_DELAY_MS = 900;

function getRunningStatus(i, index) {
  if (i < index) {
    return 'done';
  }
  if (i === index) {
    return 'running';
  }
  return 'pending';
}

// Simulates executing steps one-by-one with a delay, updating statuses live.
function simulateSteps(steps, onUpdate) {
  // Reset all to pending first
  let current = steps.map((step) => ({ ...step, status: 'pending' }));
  onUpdate([...current]);

  steps.forEach((_, index) => {
    // Mark step as running
    setTimeout(() => {
      current = current.map((step, i) => ({
        ...step,
        status: getRunningStatus(i, index),
      }));
      onUpdate([...current]);
    }, STEP_DELAY_MS * index);

    // Mark step as done
    setTimeout(
      () => {
        current = current.map((step, i) => ({
          ...step,
          status: i <= index ? 'done' : 'pending',
        }));
        onUpdate([...current]);
      },
      STEP_DELAY_MS * index + STEP_DELAY_MS * 0.8,
    );
  });
}

export default function PlanTask() {
  const [steps, setSteps] = React.useState(INITIAL_STEPS);

  // Stable ref so the adapter closure always reads the latest setter
  // without needing to recreate the adapter on each render.
  const setStepsRef = React.useRef(setSteps);
  setStepsRef.current = setSteps;

  const adapter = React.useMemo(
    () => ({
      async sendMessage() {
        const messageId = nanoid();
        const responseText =
          'Executing the plan — watch the steps above update as I work through each one.';

        // Start step simulation after a short lead-in
        setTimeout(() => {
          simulateSteps(INITIAL_STEPS, (updated) => setStepsRef.current(updated));
        }, 400);

        return createChunkStream(
          createTextResponseChunks(messageId, responseText, {
            author: demoUsers.agent,
          }),
          { delayMs: 60 },
        );
      },
    }),
    [],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: 640 }}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          display="block"
          gutterBottom
        >
          Agent task plan
        </Typography>
        <ChatPlan steps={steps} />
      </Paper>
      <ChatBox
        adapter={adapter}
        defaultActiveConversationId={minimalConversation.id}
        defaultConversations={[minimalConversation]}
        defaultMessages={minimalMessages}
        sx={{
          flex: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </Box>
  );
}
