import { StandaloneAgendaView } from '@mui/x-scheduler/agenda-view';
import { eventCalendarClasses as classes } from '@mui/x-scheduler/event-calendar';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { describeConformance } from 'test/utils/describeConformance';

describe('<StandaloneAgendaView /> - Describe Conformance', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  describeConformance(
    <StandaloneAgendaView
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
        'componentsProp',
        'themeVariants',
        'rootClass',
        'themeDefaultProps',
        'themeStyleOverrides',
        'reactTestRenderer',
      ],
    }),
  );
});
