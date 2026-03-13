import { Theme, alpha, createTheme } from '@mui/material/styles';
import '@mui/x-scheduler-premium/theme-augmentation';
import '@mui/x-scheduler/theme-augmentation';
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
      // Event Dialog
      // Event Dialog
      MuiEventDialog: {
        styleOverrides: {
          eventDialogResourceMenuColorDot: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },
      // Event Timeline
      MuiEventTimeline: {
        styleOverrides: {
          event: {
            '&::before': {
              width: 0,
            },
          },
        },
      },
      // Event Calendar
      MuiEventCalendar: {
        styleOverrides: {
          timeGridEvent: {
            '&::before': {
              width: 0,
            },
          },
          dayTimeGridTimeAxisCell: {
            '&:not(:first-of-type)::after': {
              borderBlockEnd: 'none',
            },
          },
          miniCalendarDayButton: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
          dayTimeGridHeaderDayNumber: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
          dayGridEvent: {
            '&[data-variant="compact"]': {
              background: 'var(--event-surface-subtle)',
              color: 'unset',
              '&:hover': {
                background: 'var(--event-surface-subtle-hover)',
              },
            },
          },
          dayGridEventTime: {
            '[data-variant="compact"] &': {
              color: 'var(--event-on-surface-subtle-secondary)',
            },
          },
          dayGridEventTitle: {
            '[data-variant="compact"] &': {
              color: 'var(--event-on-surface-subtle-primary)',
            },
          },
          eventItemCard: {
            background: 'var(--event-surface-subtle)',
            '&:hover': {
              background: 'var(--event-surface-subtle-hover)',
            },
          },
          eventItemTime: {
            color: 'var(--event-on-surface-subtle-secondary)',
          },
          eventItemTitle: {
            color: 'var(--event-on-surface-subtle-primary)',
          },
          agendaViewEventsList: {
            gap: 8,
          },
        },
      },
    },
  });
};
