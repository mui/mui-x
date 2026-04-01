import { Theme, alpha, createTheme } from '@mui/material/styles';
import '@mui/x-chat/themeAugmentation';
import { darkGrey, grey } from './colors';

export const getSoftEdgesTheme = (mode: 'light' | 'dark'): Theme => {
  return createTheme({
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
      action: {
        hover: mode === 'light' ? alpha(grey[600], 0.08) : alpha(darkGrey[600], 0.08),
        selected: mode === 'light' ? alpha(grey[600], 0.16) : alpha(darkGrey[600], 0.16),
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      button: {
        textTransform: 'capitalize',
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
              backgroundColor: theme.palette.grey[50],
              border: '1px solid',
              borderColor: theme.palette.divider,
              '&:hover': {
                background: alpha(theme.palette.grey[700], 0.08),
              },
            }),
          },
        ],
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: ({ theme }) => ({
            padding: theme.spacing(0.5),
            gap: theme.spacing(0.5),
            display: 'flex',
            flexDirection: 'column',
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            background: theme.palette.grey[50],
            fontWeight: 300,
            borderRadius: theme.shape.borderRadius,
            border: '1px solid',
            borderColor: theme.palette.divider,
            '& .MuiSvgIcon-root': {
              color: theme.palette.grey[800],
              fontSize: '1.2rem',
            },
          }),
        },
      },
      // Chat components
      MuiChatMessage: {
        styleOverrides: {
          bubble: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
          roleUser: ({ theme }) => ({
            '& .MuiChatMessage-bubble': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          }),
          roleAssistant: ({ theme }) => ({
            '& .MuiChatMessage-bubble': {
              backgroundColor: mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[200],
              color: theme.palette.text.primary,
            },
          }),
        },
      },
      MuiChatComposer: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
          textArea: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },
      MuiChatConversationList: {
        styleOverrides: {
          item: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },
    },
  });
};
