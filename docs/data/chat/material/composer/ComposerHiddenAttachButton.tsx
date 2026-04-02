'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ComposerHiddenAttachButton() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      initialMessages={minimalMessages}
      features={{ attachments: false }}
      sx={{
        height: 400,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
