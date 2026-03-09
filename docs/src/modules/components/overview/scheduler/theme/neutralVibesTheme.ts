import { alpha, Theme, createTheme } from '@mui/material/styles';
import '@mui/x-scheduler-premium/theme-augmentation';
import '@mui/x-scheduler/theme-augmentation';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
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
      // Event Dialog
      MuiEventDialog: {
        styleOverrides: {
          eventDialogResourceMenuColorDot: ({ theme }) => ({
            borderRadius: theme.shape.borderRadius,
          }),
        },
      },
      // EventTimeline
      MuiEventTimeline: {
        styleOverrides: {
          event: ({ theme }) => ({
            background: theme.palette.background.paper,
            border: '1px solid',
            borderColor: theme.palette.divider,
            paddingLeft: theme.spacing(2.5),
            color: theme.palette.text.primary,

            '&::before': {
              width: 10,
              height: 10,
              borderRadius: '50%',
              top: 10,
              left: 6,
            },
            '&:hover': {
              borderColor: 'var(--event-main)',
              background: theme.palette.background.paper,
            },
          }),
          eventsSubGrid: ({ theme }) => ({
            background: theme.palette.background.default,
          }),
        },
      },
      // Event Calendar
      MuiEventCalendar: {
        styleOverrides: {
          // General styles
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
          }),
          // Week and Day views
          // Header
          headerToolbarLabel: {
            fontWeight: 500,
          },
          dayTimeGridHeaderCell: ({ theme }) => ({
            margin: theme.spacing(1, 0.5),
            backgroundColor: theme.palette.grey[100],
            borderRadius: theme.shape.borderRadius,

            '&:last-of-type': {
              gap: 0,
              marginRight: theme.spacing(1),
            },
            '&:hover': {
              backgroundColor: theme.palette.grey[200],
            },
          }),
          dayTimeGridHeaderDayNumber: {
            'button:hover &': {
              backgroundColor: 'initial',
            },
            '[data-current] &': {
              color: '#FC4B87',
              backgroundColor: 'initial',
            },
            '[data-current] button:hover &': {
              backgroundColor: 'initial',
            },
          },
          // Grids
          dayTimeGridColumn: ({ theme }) => ({
            backgroundColor: theme.palette.background.default,
            '&[data-weekend]': {
              backgroundColor: theme.palette.background.default,
            },
          }),
          dayTimeGridAllDayEventsCell: ({ theme }) => ({
            '&[data-weekend]': {
              backgroundColor: theme.palette.background.default,
            },
          }),
          dayTimeGridAllDayEventsHeaderCell: ({ theme }) => ({
            backgroundColor: theme.palette.background.paper,
          }),
          dayTimeGridAllDayEventsGrid: ({ theme }) => ({
            backgroundColor: theme.palette.background.default,

            [`&[data-weekend][data-has-scroll] .${eventCalendarClasses.dayTimeGridScrollablePlaceholder}`]:
              {
                background: theme.palette.background.default,
                '&::-webkit-scrollbar': {
                  background: theme.palette.background.default,
                },
              },
          }),
          // Events
          timeGridEvent: ({ theme }) => ({
            background: theme.palette.background.paper,
            border: '1px solid',
            borderColor: theme.palette.divider,
            '&::before': {
              width: 12,
              height: 12,
              borderRadius: '50%',
              top: 6,
              left: 6,
            },
            '&:hover': {
              borderColor: 'var(--event-surface-bold)',
              background: theme.palette.background.paper,
            },
          }),
          timeGridEventPlaceholder: ({ theme }) => ({
            background: theme.palette.background.paper,
            '&::before': {
              background: 'var(--event-surface-accent)',
              width: 12,
              height: 12,
              borderRadius: '50%',
              top: 6,
              left: 6,
            },
            '&:hover': {
              borderColor: 'var(--event-surface-bold)',
              background: theme.palette.background.paper,
            },
          }),
          timeGridEventTitle: ({ theme }) => ({
            color: theme.palette.text.primary,
            paddingLeft: theme.spacing(2),
            fontWeight: 500,
          }),
          timeGridEventTime: ({ theme }) => ({
            color: theme.palette.text.secondary,
          }),
          // Month view
          monthViewCell: ({ theme }) => ({
            backgroundColor: theme.palette.background.default,
            '&[data-weekend]': {
              backgroundColor: theme.palette.background.default,
            },
          }),
          // Event styles
          dayGridEvent: ({ theme }) => ({
            background: theme.palette.background.paper,
            border: '1px solid',
            borderColor: theme.palette.divider,
            '&[data-variant="compact"]:hover': {
              borderColor: 'var(--event-surface-bold)',
              background: theme.palette.background.paper,
            },
          }),
        },
      },
    },
  });
};
