'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

function MyMessageActions(props) {
  return (
    <Box {...props} sx={{ display: 'flex', gap: 0.5 }}>
      <IconButton size="small" aria-label="Copy">
        <ContentCopyIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="Edit">
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="Delete">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

const adapter = createEchoAdapter();

export default function BasicMessageActions() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slots={{ messageActions: MyMessageActions }}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
