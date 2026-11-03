import * as React from 'react';
import { act, screen, waitFor, within } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import { dependenciesFeature } from '@mui/x-scheduler-premium/dependencies';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  getAllEventsByTitle,
  mockElementBounds,
  ResourceBuilder,
  simulateDragAndDrop,
} from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { vi, describe, it, expect } from 'vitest';
import {
  buildDependency,
  createDependencyTimelineRenderer,
  getArrowPaths,
  getEventRow,
  mockAllEventRowBounds,
  resource1,
} from './dependencyTestUtils';

const engineering = ResourceBuilder.new().build();
const resources = [engineering];

const AXIS_WIDTH = 6720;
const DAY_WIDTH = 120;

const dailyEvent = EventBuilder.new()
  .title('Daily standup')
  .singleDay('2025-07-03T09:00:00Z', 60)
  .resource(engineering)
  .recurrent('DAILY', { count: 3 })
  .draggable(true)
  .build();

const predecessor = EventBuilder.new()
  .id('event-a')
  .title('Event A')
  .singleDay('2025-07-03T09:00:00Z')
  .resource(resource1)
  .build();
const successor = EventBuilder.new()
  .id('event-b')
  .title('Event B')
  .singleDay('2025-07-03T11:00:00Z')
  .resource(resource1)
  .build();

describe('EventTimelinePremium - features', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });
  const { renderTimeline } = createDependencyTimelineRenderer(renderSettled);

  function Timeline(
    props: Partial<React.ComponentProps<typeof EventTimelinePremium<SchedulerEvent, any>>>,
  ) {
    return (
      <EventTimelinePremium
        resources={resources}
        events={[dailyEvent]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        preset="dayAndMonth"
        presets={['dayAndMonth']}
        {...props}
      />
    );
  }

  it('should render a recurring event once without the recurring events feature', async () => {
    await expect(() => renderSettled(<Timeline />)).toWarnDev('with the `recurringEvents` feature');

    expect(getAllEventsByTitle(dailyEvent.title)).to.have.length(1);
  });

  it('should expand a recurring event with the recurring events feature', async () => {
    await renderSettled(<Timeline features={{ recurringEvents: recurringEventsFeature }} />);

    expect(getAllEventsByTitle(dailyEvent.title)).to.have.length(3);
  });

  it('should not show the recurrence tab without the recurring events feature', async () => {
    let view!: Awaited<ReturnType<typeof renderSettled>>;
    await expect(async () => {
      view = await renderSettled(<Timeline />);
    }).toWarnDev('with the `recurringEvents` feature');

    await view.user.click(getAllEventsByTitle(dailyEvent.title)[0]);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.to.equal(null);
    });
    expect(screen.queryByRole('tab', { name: 'Recurrence' })).to.equal(null);

    view.unmount();
    const { user } = await renderSettled(
      <Timeline features={{ recurringEvents: recurringEventsFeature }} />,
    );

    await user.click(getAllEventsByTitle(dailyEvent.title)[0]);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.to.equal(null);
    });
    expect(screen.queryByRole('tab', { name: 'Recurrence' })).not.to.equal(null);
  });

  it('should move an rrule event as a single event without the recurring events feature', async () => {
    const handleEventsChange = vi.fn();
    await expect(() => renderSettled(<Timeline onEventsChange={handleEventsChange} />)).toWarnDev(
      'with the `recurringEvents` feature',
    );

    mockAllEventRowBounds(AXIS_WIDTH);
    const eventElement = getAllEventsByTitle(dailyEvent.title)[0];
    const left =
      (parseFloat(eventElement.style.getPropertyValue('--x-position')) / 100) * AXIS_WIDTH;
    mockElementBounds(eventElement, { left, width: DAY_WIDTH / 24, height: 30 });

    await act(async () => {
      simulateDragAndDrop({
        source: eventElement,
        target: getEventRow(engineering.id),
        sourceClientX: left + 1,
        targetClientX: left + 1 + DAY_WIDTH,
      });
    });

    expect(screen.queryByText(/Only this event/i)).to.equal(null);
    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const [updatedEvent] = handleEventsChange.mock.calls[0][0];
    expect(updatedEvent.rrule).to.deep.equal(dailyEvent.rrule);
    expect(new Date(updatedEvent.start).toISOString()).to.equal('2025-07-04T09:00:00.000Z');
  });

  it('should keep the rrule of an event edited in the dialog without the recurring events feature', async () => {
    const handleEventsChange = vi.fn();
    let view!: Awaited<ReturnType<typeof renderSettled>>;
    await expect(async () => {
      view = await renderSettled(<Timeline onEventsChange={handleEventsChange} />);
    }).toWarnDev('with the `recurringEvents` feature');

    await view.user.click(getAllEventsByTitle(dailyEvent.title)[0]);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.to.equal(null);
    });
    await view.user.type(screen.getByRole('textbox', { name: /event title/i }), ' (renamed)');
    await view.user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleEventsChange.mock.calls.length).to.equal(1);
    const [updatedEvent] = handleEventsChange.mock.calls[0][0];
    expect(updatedEvent.title).to.equal('Daily standup (renamed)');
    expect(updatedEvent.rrule).to.deep.equal(dailyEvent.rrule);
  });

  it('should not warn when the features object is recreated with the same values', async () => {
    const { setProps } = await renderSettled(
      <Timeline features={{ recurringEvents: recurringEventsFeature }} />,
    );

    expect(() => {
      setProps({ features: { recurringEvents: recurringEventsFeature } });
    }).not.toWarnDev();
  });

  it('should warn when a feature changes after mount', async () => {
    let setProps!: Awaited<ReturnType<typeof renderSettled>>['setProps'];
    await expect(async () => {
      ({ setProps } = await renderSettled(<Timeline />));
    }).toWarnDev('with the `recurringEvents` feature');

    expect(() => {
      setProps({ features: { recurringEvents: recurringEventsFeature } });
    }).toWarnDev('changed after the first render');

    expect(getAllEventsByTitle(dailyEvent.title)).to.have.length(1);
  });
  it('should render the events without arrows or terminals without the dependencies feature', async () => {
    await expect(() =>
      renderTimeline({
        events: [predecessor, successor],
        dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
        features: { recurringEvents: recurringEventsFeature },
      }),
    ).toWarnDev('the dependencies feature is missing');

    expect(getAllEventsByTitle('Event A')).to.have.length(1);
    expect(getAllEventsByTitle('Event B')).to.have.length(1);
    expect(getArrowPaths()).to.have.length(0);
    expect(document.querySelector('[data-dependency-terminal]')).to.equal(null);
  });

  it('should render the arrows and terminals with the dependencies feature', async () => {
    await renderTimeline({
      events: [predecessor, successor],
      dependencies: [buildDependency('dep-1', 'event-a', 'event-b')],
    });

    expect(getArrowPaths()).to.have.length(1);
    expect(document.querySelector('[data-dependency-terminal]')).not.to.equal(null);
  });

  describe('public dependencies props', () => {
    const dependency = buildDependency('dep-1', 'event-a', 'event-b');

    function DependenciesTimeline(props: Partial<React.ComponentProps<typeof Timeline>>) {
      return (
        <Timeline
          resources={[resource1]}
          events={[predecessor, successor]}
          features={{ dependencies: dependenciesFeature }}
          {...props}
        />
      );
    }

    it('should render the arrows and terminals', async () => {
      await renderSettled(
        <DependenciesTimeline dependencies={[dependency]} onDependenciesChange={() => {}} />,
      );

      expect(getArrowPaths()).to.have.length(1);
      expect(document.querySelector('[data-dependency-terminal]')).not.to.equal(null);
    });

    it('should call `onDependenciesChange` when a dependency is deleted', async () => {
      const handleDependenciesChange = vi.fn();
      const { user } = await renderSettled(
        <DependenciesTimeline
          dependencies={[dependency]}
          onDependenciesChange={handleDependenciesChange}
        />,
      );

      await user.dblClick(document.querySelector('[data-dependency-hit="dep-1"]')!);
      await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Delete' }));

      expect(handleDependenciesChange.mock.calls.length).to.equal(1);
      expect(handleDependenciesChange.mock.calls[0][0]).to.deep.equal([]);
    });

    it('should render a new `dependencies` value', async () => {
      const { setProps } = await renderSettled(
        <DependenciesTimeline dependencies={[dependency]} onDependenciesChange={() => {}} />,
      );

      expect(getArrowPaths()).to.have.length(1);

      await act(async () => {
        setProps({ dependencies: [] });
      });

      expect(getArrowPaths()).to.have.length(0);
    });

    it('should warn and render no arrows when the dependencies feature is missing', async () => {
      await expect(() =>
        renderSettled(
          <DependenciesTimeline
            features={{ recurringEvents: recurringEventsFeature }}
            dependencies={[dependency]}
            onDependenciesChange={() => {}}
          />,
        ),
      ).toWarnDev('the dependencies feature is missing');

      expect(getArrowPaths()).to.have.length(0);
    });

    it('should warn when `onDependenciesChange` is passed without `dependencies`', async () => {
      await expect(() =>
        renderSettled(<DependenciesTimeline onDependenciesChange={() => {}} />),
      ).toWarnDev('without a `dependencies` value');

      expect(document.querySelector('[data-dependency-terminal]')).to.equal(null);
    });
  });
});
