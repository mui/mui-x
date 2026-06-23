'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  ChatConversation,
  ChatConversationHeader,
  ChatMessageList,
  ChatMessageGroup,
  ChatComposer,
  ChatMessageSkeleton,
} from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

function LoadingMessages() {
  return (
    <Box
      aria-busy="true"
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
      }}
    >
      <ChatMessageSkeleton lines={2} sx={{ width: '70%' }} aria-hidden />
      <ChatMessageSkeleton
        lines={2}
        sx={{ width: '70%', alignSelf: 'flex-end' }}
        aria-hidden
      />
      <ChatMessageSkeleton lines={3} sx={{ width: '70%' }} aria-hidden />
    </Box>
  );
}

export default function LoadingSkeletonInList() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setLoading(true)}
          disabled={loading}
        >
          Reload
        </Button>
      </Box>
      <ChatProvider
        adapter={adapter}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
      >
        <Box
          sx={{
            height: 500,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <ChatConversation sx={{ height: '100%' }}>
            <ChatConversationHeader />
            {loading ? (
              <LoadingMessages />
            ) : (
              <ChatMessageList
                renderItem={({ id, index }) => (
                  <ChatMessageGroup index={index} messageId={id} />
                )}
              />
            )}
            <ChatComposer />
          </ChatConversation>
        </Box>
      </ChatProvider>
    </Box>
  );
}
