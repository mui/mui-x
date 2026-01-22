import { Timeline, eventTimelineClasses as classes } from '@mui/x-scheduler-premium/timeline';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { describeConformance } from 'test/utils/describeConformance';

describe('<Timeline /> - Describe Conformance', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  describeConformance(
    <Timeline
      resources={[{ id: 'resource-1', title: 'Engineering' }]}
      events={[]}
      visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      view="days"
      views={['days']}
    />,
    () => ({
      classes,
      inheritComponent: 'div',
      render,
      muiName: 'MuiEventTimeline',
      refInstanceof: window.HTMLDivElement,
      skip: ['componentProp', 'componentsProp', 'themeVariants'],
    }),
  );
});
