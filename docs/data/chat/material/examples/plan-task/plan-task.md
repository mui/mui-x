---
title: Chat - Plan & task
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Plan & task

<p class="description">Display a structured execution plan with live step-by-step status using <code>ChatPlan</code> and <code>ChatTask</code></p>

Send any message and watch the agent plan animate through each step.

- `ChatPlan` renders an ordered list of `ChatTask` steps driven by a `steps` prop
- `ChatTask` maps `status` to a status icon: spinner (`running`), filled checkmark (`done`), error circle (`error`), outlined circle (`pending`), minus circle (`skipped`)
- Plan state is owned by the consumer via `React.useState` and updated from inside the adapter via a stable `useRef` callback

{{"demo": "PlanTask.js", "bg": "inline"}}

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

## API

- [ChatRoot](/x/api/chat/chat-root/)
