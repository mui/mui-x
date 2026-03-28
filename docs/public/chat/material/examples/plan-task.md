---
title: Chat - Plan & task
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Plan & task

<p class="description">Display a structured execution plan with live step-by-step status using <code>ChatPlan</code> and <code>ChatTask</code>.</p>

Send any message and watch the agent plan animate through each step.

```tsx
'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { nanoid } from 'nanoid';
import { ChatBox, ChatPlan, type PlanStep } from '@mui/x-chat';
import { createChunkStream, createTextResponseChunks } from '../shared/demoUtils';
import { demoUsers, minimalConversation, minimalMessages } from '../shared/demoData';

const INITIAL_STEPS: PlanStep[] = [
  { id: '1', label: 'Analyze repository structure', status: 'pending' },
  { id: '2', label: 'Identify test gaps', status: 'pending' },
  { id: '3', label: 'Write unit tests', status: 'pending' },
  { id: '4', label: 'Run test suite', status: 'pending' },
  { id: '5', label: 'Open pull request', status: 'pending' },
];

const STEP_DELAY_MS = 900;

function getRunningStatus(i: number, index: number): PlanStep['status'] {
  if (i < index) {
    return 'done';
  }
  if (i === index) {
    return 'running';
  }
  return 'pending';
}

// Simulates executing steps one-by-one with a delay, updating statuses live.
function simulateSteps(
  steps: PlanStep[],
  onUpdate: (updated: PlanStep[]) => void,
): void {
  // Reset all to pending first
  let current: PlanStep[] = steps.map((step) => ({
    ...step,
    status: 'pending' as const,
  }));
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
          status: (i <= index ? 'done' : 'pending') as PlanStep['status'],
        }));
        onUpdate([...current]);
      },
      STEP_DELAY_MS * index + STEP_DELAY_MS * 0.8,
    );
  });
}

export default function PlanTask() {
  const [steps, setSteps] = React.useState<PlanStep[]>(INITIAL_STEPS);

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
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
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

```

## What it shows

- `ChatPlan` renders an ordered list of `ChatTask` steps driven by a `steps` prop
- `ChatTask` maps `status` to a status icon: spinner (`running`), filled checkmark (`done`), error circle (`error`), outlined circle (`pending`), minus circle (`skipped`)
- Plan state is owned by the consumer via `React.useState` and updated from inside the adapter via a stable `useRef` callback

## Data-driven usage

Pass an array of `PlanStep` objects to render the full plan automatically:

```tsx
<ChatPlan
  steps={[
    { id: '1', label: 'Analyze codebase', status: 'done' },
    { id: '2', label: 'Write unit tests', status: 'running' },
    { id: '3', label: 'Open pull request', status: 'pending' },
  ]}
/>
```

## Composable usage

Use `ChatTask` children directly when you need custom rendering or conditional logic:

```tsx
<ChatPlan>
  <ChatTask status="done">Analyze codebase</ChatTask>
  <ChatTask status="running">Write unit tests</ChatTask>
  <ChatTask status="pending">Open pull request</ChatTask>
</ChatPlan>
```

## Status reference

| Status    | Icon             | Typical use                 |
| :-------- | :--------------- | :-------------------------- |
| `pending` | Outlined circle  | Step not yet started        |
| `running` | Spinner          | Step currently executing    |
| `done`    | Filled checkmark | Step completed successfully |
| `error`   | Error circle     | Step failed                 |
| `skipped` | Minus circle     | Step intentionally bypassed |

## Connecting to the adapter

Hold plan state in `React.useState`. Update it from the adapter via a `useRef`-based
callback so the adapter closure always has access to the latest setter without
recreating the adapter on every render:

```tsx
const [steps, setSteps] = React.useState<PlanStep[]>(INITIAL_STEPS);

// Stable ref — capture the latest setter without re-creating the adapter
const setStepsRef = React.useRef(setSteps);
setStepsRef.current = setSteps;

const adapter = React.useMemo(
  () => ({
    async sendMessage({ message }) {
      // … stream response from your backend …
      // Then update step statuses as they come in:
      setStepsRef.current(updatedSteps);
      return responseStream;
    },
  }),
  [],
); // empty deps — adapter captures the stable ref, not setSteps directly
```

## Adding detail text

`ChatTask` accepts an optional `detail` prop for secondary information such as
sub-step output or error messages:

```tsx
<ChatTask status="error" detail="Exit code 1 — test suite failed">
  Run test suite
</ChatTask>
```
