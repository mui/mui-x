---
title: Chat - Model selector
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Model selector

<p class="description">Add a model picker to the conversation header using the <code>conversationHeaderActions</code> slot.</p>

This demo shows how to place a MUI `Select` inside the conversation header so users can switch between AI models.
No new component is needed — drop any MUI control into `slots.conversationHeaderActions`.

- `slots.conversationHeaderActions` accepting a custom component that renders a `Select`
- Controlled model state owned by the selector component
- The `Select` placed inline in the header via `marginInlineStart: 'auto'` (applied automatically by `ChatConversationHeaderActions`)

```tsx
'use client';
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o' },
  { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
  { id: 'gemini-1-5-pro', label: 'Gemini 1.5 Pro' },
];

// Defined outside the render function so the slot reference stays stable
// and ChatBox does not remount the header on every render.
function ModelSelectControl() {
  const [model, setModel] = React.useState('gpt-4o');
  return (
    <Select
      value={model}
      onChange={(event: SelectChangeEvent) => setModel(event.target.value)}
      size="small"
      sx={{ minWidth: 160 }}
    >
      {MODELS.map((m) => (
        <MenuItem key={m.id} value={m.id}>
          {m.label}
        </MenuItem>
      ))}
    </Select>
  );
}

const adapter = createEchoAdapter();

export default function ModelSelector() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ conversationHeaderActions: ModelSelectControl }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}

```

## The pattern

```tsx
function MyModelSelector() {
  const [model, setModel] = React.useState('gpt-4o');
  return (
    <Select value={model} onChange={(e) => setModel(e.target.value)} size="small">
      <MenuItem value="gpt-4o">GPT-4o</MenuItem>
      <MenuItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</MenuItem>
    </Select>
  );
}

<ChatBox slots={{ conversationHeaderActions: MyModelSelector }} />;
```

## Passing the model to the adapter

The demo above keeps model state inside the selector.
To also pass the selected model to `adapter.sendMessage`, hoist state up to the parent and construct the adapter with `React.useMemo`:

```tsx
export default function App() {
  const [model, setModel] = React.useState('gpt-4o');

  const adapter = React.useMemo(
    () => ({
      async sendMessage({ message, signal }) {
        const res = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message, model }),
          signal,
        });
        return res.body;
      },
    }),
    [model],
  );

  // Stable reference — defined outside or memoized to avoid remounts
  const HeaderActions = React.useMemo(
    () =>
      function ModelSelector() {
        return (
          <Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            size="small"
          >
            <MenuItem value="gpt-4o">GPT-4o</MenuItem>
            <MenuItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</MenuItem>
          </Select>
        );
      },
    [model],
  );

  return (
    <ChatBox
      adapter={adapter}
      slots={{ conversationHeaderActions: HeaderActions }}
    />
  );
}
```

## Implementation notes

- `ChatConversationHeaderActions` already applies `marginInlineStart: 'auto'` so the selector floats to the right automatically.
- Define the slot component **outside** the render function, or stabilize it with `React.useMemo`, to avoid remounting the header on every render.
- Use `size="small"` on `Select` to match the default header height.

## API

- [ChatRoot](/x/api/chat/chat-root/)

## See also

- [Slot overrides](/x/react-chat/material/examples/slot-overrides/) for replacing deeper sub-components
- [Customization](/x/react-chat/material/customization/) for the full slot key reference
