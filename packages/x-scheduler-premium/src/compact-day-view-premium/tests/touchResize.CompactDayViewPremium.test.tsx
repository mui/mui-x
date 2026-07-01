import * as React from 'react';
import { screen, act, fireEvent } from '@mui/internal-test-utils';
import { LicenseInfo } from '@mui/x-license';
import { clearLicenseStatusCache } from '@mui/x-license/internals';
import { TEST_LICENSE_KEY_PREMIUM } from 'test/utils/licenseKeys';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import {
  createSchedulerRenderer,
  EventBuilder,
  mockElementBounds,
  clientYForTime,
  getResizeHandle,
  simulatePointerResize,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { StandaloneCompactDayViewPremium } from '@mui/x-scheduler-premium/compact-day-view-premium';

/**
 * Resizing a recurring event commits through the recurring scope dialog. Whichever scope is chosen,
 * the resized occurrence must stay armed afterwards (toolbar + selection outline), even when the scope
 * detaches it onto a freshly-created event whose occurrence key differs from the original.
 */
describe('CompactDayViewPremium - touch resize (recurring)', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  beforeEach(() => {
    clearLicenseStatusCache();
    LicenseInfo.setLicenseKey(TEST_LICENSE_KEY_PREMIUM);
  });

  function getTimeGridColumn(): HTMLElement {
    return document.querySelector<HTMLElement>(
      `.MuiEventCalendar-dayTimeGridGrid [data-drop-target-for-element]`,
    )!;
  }

  // Controlled wrapper so a committed resize actually re-renders with the resulting events: that is what
  // re-creates the (re-keyed) occurrence whose armed state we are asserting.
  function ControlledView({ initialEvent }: { initialEvent: SchedulerEvent }) {
    const [events, setEvents] = React.useState<SchedulerEvent[]>([initialEvent]);
    return (
      <StandaloneCompactDayViewPremium
        events={events}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        onEventsChange={setEvents}
      />
    );
  }

  function renderResizableRecurringEvent() {
    const event = EventBuilder.new()
      .id('event-1')
      .title('Daily Standup')
      .singleDay('2025-07-03T10:00:00Z', 60)
      .recurrent('DAILY')
      .resizable(true)
      .build();

    const { user } = render(<ControlledView initialEvent={event} />);

    // Geometry resolver maps pointer Y to a time via the column's bounds.
    mockElementBounds(getTimeGridColumn(), { top: 0, height: 1440, width: 200 });

    return { user };
  }

  /** Taps the event to arm it, revealing its resize handles. */
  function armEvent(): HTMLElement {
    const eventElement = screen.getByRole('button', { name: /Daily Standup/i });
    fireEvent.click(eventElement);
    return eventElement;
  }

  // The closing scope dialog keeps the background `aria-hidden` under fake timers, so read the event
  // straight from the DOM rather than through a role query (which skips `aria-hidden` subtrees).
  function getEventElement(): HTMLElement {
    return document.querySelector<HTMLElement>('.MuiEventCalendar-timeGridEvent')!;
  }

  it('keeps the resized occurrence armed after confirming the scope dialog', async () => {
    const { user } = renderResizableRecurringEvent();
    const eventElement = armEvent();

    const endHandle = getResizeHandle(eventElement, 'end');
    await act(async () => {
      simulatePointerResize({ handle: endHandle, to: { clientY: clientYForTime(0, 24, 16) } });
    });

    // The recurring resize defers the commit to the scope dialog instead of applying immediately.
    await screen.findByText(/Apply this change to:/i);
    // The default scope ("only this") detaches the occurrence into a brand-new event.
    await user.click(screen.getByRole('button', { name: /Confirm/i }));

    // The occurrence — now on the new event — stays armed: the selection outline + toolbar persist
    // instead of dropping because the new event's occurrence key differs from the original.
    expect(getEventElement()).to.have.attribute('data-armed');
  });

  it('keeps the resized occurrence armed when applying the change to all events', async () => {
    const { user } = renderResizableRecurringEvent();
    const eventElement = armEvent();

    const endHandle = getResizeHandle(eventElement, 'end');
    await act(async () => {
      simulatePointerResize({ handle: endHandle, to: { clientY: clientYForTime(0, 24, 16) } });
    });

    await screen.findByText(/Apply this change to:/i);
    await user.click(screen.getByText(/All events/i));
    await user.click(screen.getByRole('button', { name: /Confirm/i }));

    expect(getEventElement()).to.have.attribute('data-armed');
  });

  it('keeps the resized occurrence armed when splitting the series (this and following)', async () => {
    const { user } = renderResizableRecurringEvent();
    const eventElement = armEvent();

    const endHandle = getResizeHandle(eventElement, 'end');
    await act(async () => {
      simulatePointerResize({ handle: endHandle, to: { clientY: clientYForTime(0, 24, 16) } });
    });

    await screen.findByText(/Apply this change to:/i);
    // The occurrence moves onto a new recurring series, so its key keeps the `id::day` shape.
    await user.click(screen.getByText(/This and following events/i));
    await user.click(screen.getByRole('button', { name: /Confirm/i }));

    expect(getEventElement()).to.have.attribute('data-armed');
  });
});
