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
    MuiEventDraggableDialog: {
      defaultProps: {
        className: 'custom-class',
        // @ts-expect-error invalid MuiEventDraggableDialog prop
        someRandomProp: true,
      },
      styleOverrides: {
        eventDialog: {
          backgroundColor: 'red',
        },
        // @ts-expect-error invalid MuiEventDraggableDialog class key
        invalidClassKey: {
          backgroundColor: 'blue',
        },
      },
    },
  },
});
