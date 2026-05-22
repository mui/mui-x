import { createTheme, alpha, type Theme, type ThemeOptions } from '@mui/material/styles';

export type ThemeFlavor = 'plain' | 'material';
export type ThemeMode = 'light' | 'dark';

/**
 * Builds a base MUI theme with optional Material-You-leaning overrides for the
 * MuiChat* components. The "material" flavor demonstrates what tasteful default
 * Material UI styling could look like for the x-chat package — heavier on
 * elevation, larger corner radii, primary-tinted accents.
 */
export function buildTheme(mode: ThemeMode, flavor: ThemeFlavor): Theme {
  const base: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#5b6cff' : '#8c97ff',
      },
      // Subtle tint on the page surface so white cards stand out
      background:
        mode === 'light'
          ? { default: '#f6f7f9', paper: '#ffffff' }
          : { default: '#0a0a0a', paper: '#171717' },
    },
    shape: {
      borderRadius: flavor === 'material' ? 12 : 8,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  };

  if (flavor === 'plain') {
    return createTheme(base);
  }

  // Material-flavored overrides for x-chat components.
  return createTheme({
    ...base,
    components: {
      MuiChatBox: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            backgroundColor: theme.palette.background.paper,
          }),
        },
      },
      MuiChatComposer: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            borderRadius: 16,
            boxShadow: theme.shadows[1],
            margin: theme.spacing(0, 2, 2),
            transition: theme.transitions.create(['border-color', 'box-shadow', 'transform']),
            '&:focus-within': {
              boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: 'translateY(-1px)',
            },
          }),
          sendButton: ({ theme }: { theme: Theme }) => ({
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            boxShadow: theme.shadows[2],
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            },
          }),
        },
      },
      MuiChatMessage: {
        styleOverrides: {
          bubble: ({ theme }: { theme: Theme }) => ({
            // Larger, rounder bubbles with elevation 1
            borderRadius: 16,
            boxShadow: theme.shadows[1],
            paddingInline: theme.spacing(1.75),
            paddingBlock: theme.spacing(1.25),
          }),
        },
      },
      MuiChatSuggestions: {
        styleOverrides: {
          item: ({ theme }: { theme: Theme }) => ({
            borderRadius: 999,
            paddingInline: theme.spacing(2),
            paddingBlock: theme.spacing(1),
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            borderColor: alpha(theme.palette.primary.main, 0.32),
            color: theme.palette.primary.main,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.16),
              borderColor: theme.palette.primary.main,
            },
          }),
        },
      },
      MuiChatConversationList: {
        styleOverrides: {
          item: ({ theme }: { theme: Theme }) => ({
            borderRadius: 12,
            marginInline: theme.spacing(1),
          }),
          itemUnreadBadge: ({ theme }: { theme: Theme }) => ({
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          }),
        },
      },
      MuiChatCodeBlock: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            borderRadius: 12,
            boxShadow: theme.shadows[1],
            backgroundColor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.black, 0.4)
                : theme.palette.grey[50],
          }),
          header: ({ theme }: { theme: Theme }) => ({
            backgroundColor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.common.white, 0.05)
                : alpha(theme.palette.primary.main, 0.06),
          }),
        },
      },
      MuiChatConfirmation: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            borderRadius: 12,
            backgroundColor: alpha(theme.palette.warning.main, 0.08),
            borderColor: alpha(theme.palette.warning.main, 0.4),
          }),
        },
      },
      MuiChatMessageError: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            borderRadius: 12,
            backgroundColor: alpha(theme.palette.error.main, 0.08),
          }),
        },
      },
      MuiChatTypingIndicator: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            backgroundColor: alpha(theme.palette.primary.main, 0.06),
            borderRadius: 999,
            paddingInline: theme.spacing(1.5),
          }),
        },
      },
      MuiChatScrollToBottomAffordance: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper,
          }),
        },
      },
      MuiChatMessageSkeleton: {
        styleOverrides: {
          line: ({ theme }: { theme: Theme }) => ({
            borderRadius: 8,
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          }),
        },
      },
      MuiChatMessageSources: {
        styleOverrides: {
          label: ({ theme }: { theme: Theme }) => ({
            textTransform: 'uppercase',
            letterSpacing: 0.6,
            color: theme.palette.primary.main,
          }),
        },
      },
      MuiChatMessageSource: {
        styleOverrides: {
          link: ({ theme }: { theme: Theme }) => ({
            fontWeight: 600,
            color: theme.palette.primary.main,
          }),
        },
      },
    } as ThemeOptions['components'],
  });
}
