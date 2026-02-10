import { EventTimelinePremium } from '@mui/x-scheduler-headless-premium/event-timeline-premium';
import { EventTimelinePremiumProvider } from '@mui/x-scheduler-headless-premium/event-timeline-premium-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<EventTimelinePremium.EventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.now('default')), adapter);
  const end = processDate(adapter.endOfDay(adapter.now('default')), adapter);

  describeConformance(<EventTimelinePremium.EventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventTimelinePremiumProvider events={[]}>
          <EventTimelinePremium.Root>
            <EventTimelinePremium.EventRow resourceId="r1">
              {() => (
                <EventTimelinePremium.Event
                  eventId="fake-id"
                  occurrenceKey="fake-key"
                  start={start}
                  end={end}
                  renderDragPreview={() => null}
                >
                  {node}
                </EventTimelinePremium.Event>
              )}
            </EventTimelinePremium.EventRow>
          </EventTimelinePremium.Root>
        </EventTimelinePremiumProvider>,
      );
    },
  }));
});
