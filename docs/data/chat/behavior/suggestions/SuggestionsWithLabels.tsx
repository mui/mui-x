'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import { minimalConversation } from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

export default function SuggestionsWithLabels() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={minimalConversation.id}
      initialConversations={[minimalConversation]}
      suggestions={[
        {
          value:
            'Help me write a professional email to my manager about taking PTO next week',
          label: 'Write an email',
        },
        {
          value: 'Summarize the key points from my Q4 performance review',
          label: 'Summarize a document',
        },
        {
          value: 'What are the best practices for React state management in 2026?',
          label: 'Ask a question',
        },
      ]}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
