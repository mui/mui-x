'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { minimalConversation, minimalMessages } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

export default function FeatureFlags() {
  return (
    <ChatBox
      adapter={adapter}
      defaultActiveConversationId={minimalConversation.id}
      defaultConversations={[minimalConversation]}
      defaultMessages={minimalMessages}
      features={{
        conversationHeader: false,
        attachButton: false,
        helperText: false,
        suggestions: false,
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
