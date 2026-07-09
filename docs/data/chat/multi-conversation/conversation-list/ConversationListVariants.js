import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatConversationList } from '@mui/x-chat';
import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { directoryConversations } from 'docs/src/modules/components/chat-playground/sharedFixtures';

const activeId = directoryConversations[0].id;

export default function ConversationListVariants() {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}
    >
      <Box sx={{ flex: '1 1 240px', minWidth: 240 }}>
        <Typography variant="subtitle2" gutterBottom>
          default
        </Typography>
        <ScopedChat
          conversations={directoryConversations}
          activeConversationId={activeId}
        >
          <Box
            sx={{
              height: 360,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <ChatConversationList />
          </Box>
        </ScopedChat>
      </Box>
      <Box sx={{ flex: '1 1 240px', minWidth: 240 }}>
        <Typography variant="subtitle2" gutterBottom>
          compact
        </Typography>
        <ScopedChat
          conversations={directoryConversations}
          activeConversationId={activeId}
        >
          <Box
            sx={{
              height: 360,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
          >
            <ChatConversationList variant="compact" />
          </Box>
        </ScopedChat>
      </Box>
    </Box>
  );
}
