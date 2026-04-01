'use client';
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from 'docsx/data/chat/material/examples/shared/demoData';

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
