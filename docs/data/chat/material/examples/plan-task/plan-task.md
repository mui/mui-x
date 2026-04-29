---
title: Chat - Plan and Task
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Plan and Task

<p class="description">Show a live task list inside a tool call by providing a custom component through partRenderers.</p>

Send any message and watch the agent plan animate through each step inside the conversation.

{{"demo": "PlanTask.js", "bg": "inline"}}

## How it works

When a tool call named `run_tasks` arrives, the default JSON accordion is replaced by a collapsible task list.
Each step animates through `pending → running → done` and the list collapses automatically when all steps finish.

The whole UI is a plain React component—no dedicated package export required.

## Providing a custom tool renderer

Supply a `partRenderers` map to `ChatBox`.
Each key is a message part type; the `dynamic-tool` key lets you intercept any tool call and render whatever you want:

```tsx
const partRenderers: ChatPartRendererMap = {
  'dynamic-tool': ({ part }) => {
    if (part.toolInvocation.toolName !== 'run_tasks') {
      return null; // fall through to default for other tools
    }
    return <MyTaskList tasks={tasks} />;
  },
};

<ChatBox adapter={adapter} partRenderers={partRenderers} /* … */ />;
```

## Animating steps from outside the renderer

The renderer is a plain function closed over component state, so you can drive it
from any external source—a WebSocket, server-sent events, or a timer:

```tsx
const [tasks, setTasks] = React.useState(initialTasks);

// partRenderers rebuilds when tasks change—ChatBox picks up the new renderer
const partRenderers = React.useMemo(
  () => ({
    'dynamic-tool': ({ part }) =>
      part.toolInvocation.toolName === 'run_tasks' ? (
        <MyTaskList tasks={tasks} />
      ) : null,
  }),
  [tasks],
);
```

Call `setTasks` with updated statuses from your stream handler and the task list
re-renders automatically inside the message.

## API

- [ChatRoot](/x/api/chat/chat-root/)
