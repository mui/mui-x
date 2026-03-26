import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { eventCalendarClasses as classes } from '@mui/x-scheduler/event-calendar';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { describeConformance } from 'test/utils/describeConformance';

describe('<EventCalendarPremium /> - Describe Conformance', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  describeConformance(
    <EventCalendarPremium
      events={[]}
      visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      view="week"
      views={['week']}
    />,
    () => ({
      classes,
      inheritComponent: 'div',
      render,
      muiName: 'MuiEventCalendar',
      refInstanceof: window.HTMLDivElement,
      skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }),
  );
});
