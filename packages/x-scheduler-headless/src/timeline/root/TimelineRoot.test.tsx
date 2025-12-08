import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { TimelineProvider } from '@mui/x-scheduler-headless/timeline-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.Root />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(<Timeline.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<TimelineProvider events={[]}>{node}</TimelineProvider>);
    },
  }));
});
