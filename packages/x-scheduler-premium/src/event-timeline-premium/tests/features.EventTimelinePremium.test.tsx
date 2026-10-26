import * as React from 'react';
import { act, screen, waitFor } from '@mui/internal-test-utils';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
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
import { getEventRow, mockAllEventRowBounds } from './dependencyTestUtils';

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

describe('EventTimelinePremium - features', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

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
    await expect(() => renderSettled(<Timeline />)).toWarnDev(
      'the recurring events feature is not provided',
    );

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
    }).toWarnDev('the recurring events feature is not provided');

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
      'the recurring events feature is not provided',
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
    }).toWarnDev('the recurring events feature is not provided');

    expect(() => {
      setProps({ features: { recurringEvents: recurringEventsFeature } });
    }).toWarnDev('changed after the first render');

    expect(getAllEventsByTitle(dailyEvent.title)).to.have.length(1);
  });
});
