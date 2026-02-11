import { createTheme } from '@mui/material/styles';
import { eventTimelinePremiumClasses } from '../event-timeline-premium/eventTimelinePremiumClasses';

createTheme({
  components: {
    MuiEventTimeline: {
      defaultProps: {
        className: 'custom-class',
        // @ts-expect-error invalid MuiEventTimeline prop
        someRandomProp: true,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'red',
          [`.${eventTimelinePremiumClasses.content}`]: {
            backgroundColor: 'green',
          },
        },
        // @ts-expect-error invalid MuiEventTimeline class key
        invalidClassKey: {
          backgroundColor: 'blue',
        },
      },
    },
  },
});
