import * as React from 'react';
import { TimelineGrid } from '@mui/x-scheduler-internals-premium/timeline-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<TimelineGrid.EventDependencyHandle />', () => {
  const { render } = createSchedulerRenderer();

  describeConformance(
    <TimelineGrid.EventDependencyHandle eventId="fake-id" occurrenceKey="fake-key" />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render,
    }),
  );

  it('should expose its occurrence key through the data-dependency-handle attribute', () => {
    render(<TimelineGrid.EventDependencyHandle eventId="fake-id" occurrenceKey="fake-key" />);

    expect(document.querySelector('[data-dependency-handle="fake-key"]')).not.to.equal(null);
  });
});
