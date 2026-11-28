import * as React from 'react';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import {
  createSchedulerRenderer,
  EventBuilder,
  ResourceBuilder,
  expectBoxSizingIndependentLayout,
} from 'test/utils/scheduler';
import type {
  EventTimelinePremiumSlots,
  SchedulerDependency,
} from '@mui/x-scheduler-premium/models';
import { dependenciesFeature } from '@mui/x-scheduler-premium/dependencies';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { describe, expect, it } from 'vitest';

const features = { dependencies: dependenciesFeature };

/**
 * Apps with and without a global `border-box` reset must see the same layout.
 * Each test renders one surface in the state that reaches its size constraints.
 */
describe.skipIf(isJSDOM)('EventTimelinePremium - box-sizing', () => {
  const { render, renderSettled } = createSchedulerRenderer({
    clockConfig: new Date('2025-07-03Z'),
  });

  const design = ResourceBuilder.new().id('design').title('Design').build();
  const development = ResourceBuilder.new().id('development').title('Development').build();
  const events = [
    EventBuilder.new()
      .id('design')
      .title('A long design review title that does not fit in the dependency dialog')
      .span('2025-07-01T00:00:00Z', '2025-07-03T00:00:00Z')
      .resource(design)
      .build(),
    EventBuilder.new()
      .id('build')
      .title('Build')
      .span('2025-07-03T00:00:00Z', '2025-07-05T00:00:00Z')
      .resource(development)
      .build(),
  ];
  const dependencies: SchedulerDependency[] = [
    { id: 'd1', source: 'design', target: 'build', type: 'FinishToStart' },
  ];

  function renderTimeline(slots?: EventTimelinePremiumSlots) {
    return renderSettled(
      <div style={{ height: 600 }}>
        <EventTimelinePremium
          events={events}
          resources={[design, development]}
          dependencies={dependencies}
          features={features}
          defaultPreset="dayAndWeek"
          slots={slots}
        />
      </div>,
    );
  }

  it('should render the timeline the same with and without a border-box reset', async () => {
    await renderTimeline();

    expectBoxSizingIndependentLayout();
  });

  it('should render the dependency dialog the same', async () => {
    await renderTimeline();

    const hitArea = document.querySelector('[data-dependency-hit="d1"]')!;
    fireEvent.click(hitArea);
    fireEvent.doubleClick(hitArea);
    await screen.findByRole('dialog');
    expectBoxSizingIndependentLayout();
  });

  it('should keep the box-sizing of the app for slot content', async () => {
    // Content that the scheduler does not own must render as it does outside the scheduler.
    const probeStyle = { display: 'inline-block', width: 40, height: 10, padding: 4 };
    render(<span data-testid="reference-probe" style={probeStyle} />);
    await renderTimeline({
      timelineEventContent: () => <span data-testid="slot-probe" style={probeStyle} />,
    });

    const reference = screen.getByTestId('reference-probe').getBoundingClientRect();
    const probe = screen.getAllByTestId('slot-probe')[0].getBoundingClientRect();
    expect({ width: probe.width, height: probe.height }).to.deep.equal({
      width: reference.width,
      height: reference.height,
    });
  });
});
