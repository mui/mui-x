import { createTheme } from '@mui/material/styles';
import type { ChatAdapter } from '@mui/x-chat-headless';

const adapter = {} as ChatAdapter;

createTheme({
  components: {
    MuiChatBox: {
      defaultProps: {
        adapter,
        className: 'chat-box',
        localeText: {
          composerSendButtonLabel: 'Send',
        },
        // @ts-expect-error unsupported alias
        locale: {},
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
    MuiChatConversationInput: {
      defaultProps: {
        className: 'chat-conversation-input',
      },
      styleOverrides: {
        root: {
          borderColor: 'red',
        },
        // @ts-expect-error invalid MuiChatConversationInput class key
        toolbar: {
          borderColor: 'blue',
        },
      },
    },
    MuiChatConversation: {
      defaultProps: {
        className: 'chat-conversation',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiChatConversation class key
        header: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiChatTypingIndicator: {
      defaultProps: {
        className: 'chat-typing-indicator',
      },
      styleOverrides: {
        root: {
          color: 'red',
        },
      },
    },
    MuiChatUnreadMarker: {
      defaultProps: {
        messageId: 'm1',
      },
      styleOverrides: {
        root: {
          color: 'red',
        },
      },
    },
    MuiChatScrollToBottomAffordance: {
      defaultProps: {
        className: 'chat-scroll-affordance',
      },
      styleOverrides: {
        root: {
          color: 'red',
        },
      },
    },
    MuiChatMessage: {
      defaultProps: {
        className: 'chat-message',
        messageId: 'm1',
      },
      styleOverrides: {
        root: {
          color: 'red',
        },
        // @ts-expect-error invalid MuiChatMessage class key
        bubble: {
          color: 'blue',
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
