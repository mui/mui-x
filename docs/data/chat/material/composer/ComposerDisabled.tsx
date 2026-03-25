'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

export default function ComposerDisabled() {
  return (
    <ChatBox
      adapter={adapter}
      defaultActiveConversationId={minimalConversation.id}
      defaultConversations={[minimalConversation]}
      defaultMessages={minimalMessages}
      slotProps={{
        composerRoot: { disabled: true },
      }}
      sx={{
        height: 400,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
