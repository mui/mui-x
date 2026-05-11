import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { ChatComposer, ChatConversation, ChatMessageList, ChatSuggestions } from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';
import type { ChatAdapter } from '@mui/x-chat/headless';

const adapter: ChatAdapter = {
  async sendMessage() {
    // Forward selected rows / visible columns to your LLM here.
    return new ReadableStream();
  },
};

const conversation = {
  id: 'copilot',
  title: 'Copilot',
  subtitle: 'Ask about the data',
};

const SUGGESTIONS = [
  'Summarize this table',
  'Which country has the highest average rating?',
  'Filter to admins only',
];

export default function App() {
  const [open, setOpen] = React.useState(true);
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    visibleFields: ['name', 'rating', 'country', 'dateCreated', 'isAdmin'],
    rowLength: 60,
  });

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          {!open && (
            <Button
              variant="contained"
              startIcon={<AutoAwesomeOutlinedIcon />}
              onClick={() => setOpen(true)}
            >
              Ask Copilot
            </Button>
          )}
        </Box>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <DataGrid {...data} loading={loading} density="compact" />
        </Box>
      </Box>

      {open && (
        <Box
          sx={{
            width: 360,
            borderLeft: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}
          >
            <span>Copilot</span>
            <IconButton size="small" onClick={() => setOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <ChatProvider
              adapter={adapter}
              initialConversations={[conversation]}
              initialActiveConversationId={conversation.id}
            >
              <ChatConversation>
                <ChatMessageList />
                <ChatSuggestions suggestions={SUGGESTIONS} autoSubmit />
                <ChatComposer variant="compact" />
              </ChatConversation>
            </ChatProvider>
          </Box>
        </Box>
      )}
    </Box>
  );
}
