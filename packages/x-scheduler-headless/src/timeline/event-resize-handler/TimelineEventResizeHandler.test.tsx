import * as React from 'react';
import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { TimelineProvider } from '@mui/x-scheduler-headless/timeline-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<Timeline.EventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const start = adapter.startOfDay(adapter.date());
  const end = adapter.endOfDay(adapter.date());

  describeConformance(<Timeline.EventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <TimelineProvider events={[]}>
          <Timeline.Root items={[]}>
            <Timeline.EventRow start={start} end={end} resourceId={undefined}>
              <Timeline.Event
                eventId="fake-id"
                occurrenceKey="fake-key"
                start={start}
                end={end}
                renderDragPreview={() => null}
              >
                {node}
              </Timeline.Event>
            </Timeline.EventRow>
          </Timeline.Root>
        </TimelineProvider>,
      );
    },
  }));
});
