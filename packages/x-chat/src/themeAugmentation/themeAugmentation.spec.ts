import { createTheme } from '@mui/material/styles';
import type { ChatAdapter } from '@mui/x-chat-headless';

const adapter = {} as ChatAdapter;

createTheme({
  components: {
    MuiChatBox: {
      defaultProps: {
        adapter,
        className: 'chat-box',
      },
      styleOverrides: {
        root: {
          color: 'red',
        },
        // @ts-expect-error invalid MuiChatBox class key
        content: {
          color: 'blue',
        },
      },
    },
    MuiChatConversations: {
      defaultProps: {
        className: 'chat-conversations',
        dense: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiChatConversations class key
        item: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiChatComposer: {
      defaultProps: {
        className: 'chat-composer',
      },
      styleOverrides: {
        root: {
          borderColor: 'red',
        },
        // @ts-expect-error invalid MuiChatComposer class key
        toolbar: {
          borderColor: 'blue',
        },
      },
    },
  },
  palette: {
    Chat: {
      userMessageBg: '#1976d2',
      userMessageColor: '#fff',
      assistantMessageBg: '#fff',
      assistantMessageColor: '#111',
      conversationHoverBg: '#f5f5f5',
      conversationSelectedBg: '#e3f2fd',
      conversationSelectedColor: '#0d47a1',
      composerBorder: '#d0d7de',
      composerFocusRing: '#1976d2',
      // @ts-expect-error invalid chat palette key
      messageGap: '12px',
    },
  },
});
