import * as React from 'react';
import { screen, waitFor, act } from '@mui/internal-test-utils';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  getAllEventsByTitle,
  getMonthViewCell,
  mockElementBounds,
  simulateDragAndDrop,
} from 'test/utils/scheduler';
import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { vi, describe, it, expect } from 'vitest';

const dailyEvent = EventBuilder.new()
  .title('Daily standup')
  .singleDay('2025-07-01T09:00:00Z', 60)
  .recurrent('DAILY', { count: 3 })
  .build();

describe('EventCalendarPremium - features', () => {
  const { renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  function Calendar(
    props: Partial<React.ComponentProps<typeof EventCalendarPremium<SchedulerEvent, any>>>,
  ) {
    return (
      <EventCalendarPremium
        events={[dailyEvent]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="week"
        views={['week']}
        {...props}
      />
    );
  }

  it('should render a recurring event once without the recurring events feature', async () => {
    await expect(() => renderSettled(<Calendar />)).toWarnDev('with the `recurringEvents` feature');

    expect(getAllEventsByTitle(dailyEvent.title)).to.have.length(1);
  });

  it('should expand a recurring event with the recurring events feature', async () => {
    await renderSettled(<Calendar features={{ recurringEvents: recurringEventsFeature }} />);

    expect(getAllEventsByTitle(dailyEvent.title)).to.have.length(3);
  });

  it('should not show the recurrence tab without the recurring events feature', async () => {
    let view!: Awaited<ReturnType<typeof renderSettled>>;
    await expect(async () => {
      view = await renderSettled(<Calendar />);
    }).toWarnDev('with the `recurringEvents` feature');

    await view.user.click(getAllEventsByTitle(dailyEvent.title)[0]);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.to.equal(null);
    });
    expect(screen.queryByRole('tab', { name: 'Recurrence' })).to.equal(null);

    view.unmount();
    const { user } = await renderSettled(
      <Calendar features={{ recurringEvents: recurringEventsFeature }} />,
    );

    await user.click(getAllEventsByTitle(dailyEvent.title)[0]);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.to.equal(null);
    });
    expect(screen.queryByRole('tab', { name: 'Recurrence' })).not.to.equal(null);
  });

  it('should move an rrule event as a single event without the recurring events feature', async () => {
    const handleEventsChange = vi.fn();
    await expect(() =>
      renderSettled(
        <Calendar
          view="month"
          views={['month']}
          events={[{ ...dailyEvent, draggable: true }]}
          onEventsChange={handleEventsChange}
        />,
      ),
    ).toWarnDev('with the `recurringEvents` feature');

    const eventElement = getAllEventsByTitle(dailyEvent.title)[0];
    mockElementBounds(eventElement, { left: 0, width: 100 });

    await act(async () => {
      simulateDragAndDrop({ source: eventElement, target: getMonthViewCell(4), sourceClientX: 50 });
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
      view = await renderSettled(<Calendar onEventsChange={handleEventsChange} />);
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
      <Calendar features={{ recurringEvents: recurringEventsFeature }} />,
    );

    expect(() => {
      setProps({ features: { recurringEvents: recurringEventsFeature } });
    }).not.toWarnDev();
  });

  it('should warn when a feature changes after mount', async () => {
    let setProps!: Awaited<ReturnType<typeof renderSettled>>['setProps'];
    await expect(async () => {
      ({ setProps } = await renderSettled(<Calendar />));
    }).toWarnDev('with the `recurringEvents` feature');

    expect(() => {
      setProps({ features: { recurringEvents: recurringEventsFeature } });
    }).toWarnDev('The `features` prop of <EventCalendarPremium /> changed after the first render');

    expect(getAllEventsByTitle(dailyEvent.title)).to.have.length(1);
  });
});
