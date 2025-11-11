import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { TimelineProvider } from '@mui/x-scheduler-headless/timeline-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { processDate } from '@mui/x-scheduler-headless/process-date';

describe('<Timeline.Event />', () => {
  const { render } = createSchedulerRenderer();

  const start = processDate(adapter.startOfDay(adapter.date()), adapter);
  const end = processDate(adapter.endOfDay(adapter.date()), adapter);

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
          <TimelineProvider events={[]}>
            <Timeline.Root items={[]}>
              <Timeline.EventRow start={start.value} end={end.value} resourceId={null}>
                {node}
              </Timeline.EventRow>
            </Timeline.Root>
          </TimelineProvider>,
        );
      },
    }),
  );
});
