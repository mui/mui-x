import { EventTimelinePremium } from '@mui/x-scheduler-headless-premium/event-timeline-premium';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/event-timeline-premium-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<EventTimelinePremium.Event />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.now('default')), adapter);
  const end = processDate(adapter.endOfDay(adapter.now('default')), adapter);

  describeConformance(
    <EventTimelinePremium.Event
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
          <EventTimelinePremiumProvider events={[]}>
            <EventTimelinePremium.Root>
              <EventTimelinePremium.EventRow resourceId="r1">
                {() => node}
              </EventTimelinePremium.EventRow>
            </EventTimelinePremium.Root>
          </EventTimelinePremiumProvider>,
        );
      },
    }),
  );
});
