import { alpha, Theme, createTheme } from '@mui/material/styles';
import '@mui/x-chat/themeAugmentation';
import { darkGrey, grey } from './colors';

export const getNeutralVibesTheme = (mode: 'light' | 'dark'): Theme => {
  return createTheme({
    typography: {
      fontFamily: '"General Sans", sans-serif',
      button: {
        textTransform: 'capitalize',
      },
    },
    shape: {
      borderRadius: 8,
    },
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? grey[900] : darkGrey[900],
        light: mode === 'light' ? grey[600] : darkGrey[600],
        dark: mode === 'light' ? '#14131F' : '#FFFFFF',
        contrastText: mode === 'light' ? '#FFFFFF' : '#14131F',
      },
      grey: mode === 'light' ? grey : darkGrey,
      divider: mode === 'light' ? grey[100] : darkGrey[200],
      text: {
        primary: mode === 'light' ? grey[900] : darkGrey[900],
        secondary: mode === 'light' ? grey[700] : darkGrey[700],
      },
      background: {
        default: mode === 'light' ? grey[50] : darkGrey[50],
        paper: mode === 'light' ? '#FFFFFF' : '#121113',
      },
    },
    components: {
      MuiButton: {
        variants: [
          {
            props: {
              variant: 'text',
              color: 'primary',
            },
            style: ({ theme }) => ({
              border: '1px solid',
              borderColor: theme.palette.divider,
              color: theme.palette.grey[800],
              '&:hover': {
                background: alpha(theme.palette.grey[500], 0.08),
              },
            }),
          },
        ],
      },
      // Chat components
      MuiChatMessage: {
        styleOverrides: {
          bubble: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
            border: '1px solid',
            borderColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius,
            color: theme.palette.text.primary,
          }),
          roleUser: ({ theme }) => ({
            '& .MuiChatMessage-bubble': {
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              position: 'relative',
              paddingLeft: theme.spacing(2.5),
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
              },
            },
          }),
          roleAssistant: ({ theme }) => ({
            '& .MuiChatMessage-bubble': {
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
            },
          }),
        },
      },
      MuiChatConversationList: {
        styleOverrides: {
          item: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
            border: '1px solid',
            borderColor: theme.palette.divider,
            marginBottom: theme.spacing(0.5),
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: theme.palette.background.paper,
            },
          }),
          itemSelected: ({ theme }) => ({
            borderColor: theme.palette.primary.main,
            backgroundColor: theme.palette.background.paper,
          }),
        },
      },
      MuiChatComposer: {
        styleOverrides: {
          root: ({ theme }) => ({
            border: '1px solid',
            borderColor: theme.palette.divider,
            borderRadius: theme.shape.borderRadius,
            '&:focus-within': {
              borderColor: theme.palette.primary.main,
            },
          }),
        },
      },
    },
  });
};
