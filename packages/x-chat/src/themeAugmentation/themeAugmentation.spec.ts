import { createTheme } from '@mui/material/styles';
import { chatBoxClasses } from '../ChatBox/chatBoxClasses';
import { chatMessageClasses } from '../ChatMessage/chatMessageClasses';
import { chatTypingIndicatorClasses } from '../ChatIndicators/chatTypingIndicatorClasses';
import '@mui/x-chat/themeAugmentation';

createTheme({
  components: {
    MuiChatBox: {
      defaultProps: {
        className: 'test',
        // @ts-expect-error invalid MuiChatBox prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${chatBoxClasses.root}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiChatBox class key
        main: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiChatMessage: {
      defaultProps: {
        // @ts-expect-error invalid MuiChatMessage prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${chatMessageClasses.root}`]: {
            backgroundColor: 'green',
          },
        },
      },
    },
    MuiChatMessageList: {
      defaultProps: {
        // @ts-expect-error invalid MuiChatMessageList prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
      },
    },
    MuiChatConversation: {
      defaultProps: {
        // @ts-expect-error invalid MuiChatConversation prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
      },
    },
    MuiChatComposer: {
      defaultProps: {
        // @ts-expect-error invalid MuiChatComposer prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
      },
    },
    MuiChatConversationList: {
      defaultProps: {
        // @ts-expect-error invalid MuiChatConversationList prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { backgroundColor: 'red' },
      },
    },
    MuiChatTypingIndicator: {
      defaultProps: {
        // @ts-expect-error invalid MuiChatTypingIndicator prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          color: 'blue',
          [`.${chatTypingIndicatorClasses.root}`]: {
            color: 'green',
          },
        },
      },
    },
    MuiChatScrollToBottomAffordance: {
      defaultProps: {
        // @ts-expect-error invalid MuiChatScrollToBottomAffordance prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { color: 'blue' },
      },
    },
    MuiChatUnreadMarker: {
      defaultProps: {
        // @ts-expect-error invalid MuiChatUnreadMarker prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: { color: 'blue' },
        label: { color: 'green' },
      },
    },
  },
});
