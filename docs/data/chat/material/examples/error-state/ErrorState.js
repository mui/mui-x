'use client';
import * as React from 'react';
import Alert from '@mui/material/Alert';
import { ChatBox } from '@mui/x-chat';
import {
  minimalConversation,
  minimalMessages,
  demoUsers,
} from 'docs/data/chat/core/examples/shared/demoData';

const demoMembers = [demoUsers.you, demoUsers.agent];

const failingAdapter = {
  async sendMessage() {
    // Simulate network delay then fail
    await new Promise((resolve) => {
      setTimeout(resolve, 800);
    });
    throw new Error(
      'Network error: Unable to reach the server. Please check your connection.',
    );
  },
};

export default function ErrorState() {
  const [errorMessage, setErrorMessage] = React.useState(null);

  return (
    <div style={{ width: '100%' }}>
      <ChatBox
        adapter={failingAdapter}
        members={demoMembers}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
        onError={(error) => {
          setErrorMessage(error.message ?? 'An unknown error occurred');
        }}
        sx={{
          height: 460,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Error: {errorMessage}
        </Alert>
      )}
    </div>
  );
}
