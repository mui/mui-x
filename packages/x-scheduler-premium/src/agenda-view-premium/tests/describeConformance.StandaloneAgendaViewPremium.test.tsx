import { StandaloneAgendaViewPremium } from '@mui/x-scheduler-premium/agenda-view-premium';
import { eventCalendarClasses as classes } from '@mui/x-scheduler/event-calendar';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { describeConformance } from 'test/utils/describeConformance';

describe('<StandaloneAgendaViewPremium /> - Describe Conformance', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  describeConformance(
    <StandaloneAgendaViewPremium
      events={[]}
      visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      view="agenda"
      views={['agenda']}
    />,
    () => ({
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
    }),
  );
});
