import { createTheme } from '@mui/material/styles';
import { eventCalendarClasses } from '../event-calendar/eventCalendarClasses';

createTheme({
  components: {
    MuiEventCalendar: {
      defaultProps: {
        className: 'custom-class',
        // @ts-expect-error invalid MuiEventCalendar prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${eventCalendarClasses.content}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiEventCalendar class key
        invalidClassKey: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiEventDialog: {
      defaultProps: {
        className: 'custom-class',
        // @ts-expect-error invalid MuiEventDialog prop
        someRandomProp: true,
      },
      styleOverrides: {
        eventDialog: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiEventDialog class key
        invalidClassKey: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiEventSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiEventSkeleton class key
        invalidClassKey: {
          backgroundColor: 'blue',
        },
      },
    },
    MuiEventErrorContainer: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
        alert: {
          backgroundColor: 'green',
        },
        message: {
          backgroundColor: 'yellow',
        },
        // @ts-expect-error invalid MuiEventErrorContainer class key
        invalidClassKey: {
          backgroundColor: 'blue',
        },
      },
    },
  },
});
