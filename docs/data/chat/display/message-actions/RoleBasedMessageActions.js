'use client';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ChatBox } from '@mui/x-chat';
import { useChatActions, useMessage } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/core/examples/shared/demoData';

function RoleBasedActions({ messageId }) {
  const message = useMessage(messageId);
  // `useChatActions` exposes the runtime actions without subscribing to message
  // state, so the toolbar never re-renders as the conversation streams.
  const chat = useChatActions();
  const role = message?.role;

  return (
    <React.Fragment>
      <IconButton size="small" aria-label="Copy">
        <ContentCopyIcon fontSize="small" />
      </IconButton>
      {role === 'assistant' && (
        <IconButton
          size="small"
          aria-label="Regenerate"
          onClick={() => chat.regenerate(messageId)}
        >
          <RefreshIcon fontSize="small" />
        </IconButton>
      )}
      {role === 'user' && (
        <IconButton size="small" aria-label="Edit">
          <EditIcon fontSize="small" />
        </IconButton>
      )}
    </React.Fragment>
  );
}

const adapter = createEchoAdapter();

export default function RoleBasedMessageActions() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{
        messageActions: RoleBasedActions,
      }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
