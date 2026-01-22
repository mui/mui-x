import { Timeline } from '@mui/x-scheduler-headless-premium/timeline-premium';
import { TimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/timeline-premium-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<TimelinePremium.Event />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.now('default')), adapter);
  const end = processDate(adapter.endOfDay(adapter.now('default')), adapter);

  describeConformance(
    <Timeline.Event
      eventId="fake-id"
      occurrenceKey="fake-key"
      start={start}
      end={end}
      renderDragPreview={() => null}
    />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <TimelinePremiumProvider events={[]}>
            <Timeline.Root>
              <Timeline.EventRow resourceId="r1">{() => node}</Timeline.EventRow>
            </Timeline.Root>
          </TimelinePremiumProvider>,
        );
      },
    }),
  );
});
