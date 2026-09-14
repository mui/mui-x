'use client';
import * as React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/core/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ExtraActionsMessageActions() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      slotProps={{
        messageActions: ({ message }) =>
          message?.role === 'assistant'
            ? {
                extraActions: [
                  {
                    id: 'regenerate',
                    label: 'Regenerate',
                    icon: <RefreshIcon fontSize="small" />,
                    onClick: (event, { chat }) => chat.regenerate(message.id),
                  },
                ],
              }
            : {},
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
