import { StandaloneEvent } from '@mui/x-scheduler/standalone-event';
import { eventCalendarClasses as classes } from '@mui/x-scheduler/event-calendar';
import { createSchedulerRenderer, DEFAULT_TESTING_VISIBLE_DATE_STR } from 'test/utils/scheduler';
import { describeConformance } from 'test/utils/describeConformance';

describe('<StandaloneEvent /> - Describe Conformance', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  describeConformance(<StandaloneEvent data={{ id: '1', title: 'Test', duration: 30 }} />, () => ({
    classes,
    inheritComponent: 'div',
    render,
    muiName: 'MuiEventCalendar',
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'themeVariants',
      'rootClass',
      'themeDefaultProps',
      'themeStyleOverrides',
    ],
  }));
});
