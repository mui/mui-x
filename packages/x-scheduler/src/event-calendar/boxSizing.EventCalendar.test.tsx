import * as React from 'react';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { emulateTouch } from 'test/utils/touchEmulation';
import {
  createSchedulerRenderer,
  EventBuilder,
  ResourceBuilder,
  expectBoxSizingIndependentLayout,
  openPreferencesMenu,
} from 'test/utils/scheduler';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';
import type { CalendarView } from '@mui/x-scheduler-internals/models';
import { EventCalendarStore } from '@mui/x-scheduler-internals/use-event-calendar';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { describe, it } from 'vitest';
import { ErrorContainer } from '../internals/components/error-container';
import { SharedComponentsStyledContext } from '../internals/components/SharedComponentsStyledContext';
import { EVENT_CALENDAR_DEFAULT_LOCALE_TEXT } from '../internals/constants/defaultLocaleText';

/**
 * Apps with and without a global `border-box` reset must see the same layout.
 * Each test renders one surface in the state that reaches its size constraints.
 */
describe.skipIf(isJSDOM)('EventCalendar - box-sizing', () => {
  const { render, renderSettled } = createSchedulerRenderer({
    clockConfig: new Date('2025-07-03Z'),
  });

  const sport = ResourceBuilder.new().id('sport').title('Sport').build();

  const events = [
    EventBuilder.new()
      .title('Standup')
      .singleDay('2025-07-03T09:00:00Z', 60)
      .resource(sport)
      .build(),
    // 15 minutes is as tall as the `minHeight` of a timed event, but keeps the vertical padding.
    EventBuilder.new().title('Check-in').singleDay('2025-07-03T11:00:00Z', 15).build(),
    EventBuilder.new().title('Ping').singleDay('2025-07-03T12:00:00Z', 5).build(),
    EventBuilder.new()
      .title('A long event title that does not fit in its column')
      .singleDay('2025-07-02T13:00:00Z', 90)
      .build(),
    EventBuilder.new()
      .title('Conference')
      .span('2025-07-01', '2025-07-04', { allDay: true })
      .build(),
  ];

  function renderCalendar(view: CalendarView, calendarEvents = events) {
    return renderSettled(
      <div style={{ height: 700 }}>
        <EventCalendar events={calendarEvents} resources={[sport]} defaultView={view} />
      </div>,
    );
  }

  it.each<CalendarView>(['day', 'week', 'month', 'agenda'])(
    'should render the %s view the same with and without a border-box reset',
    async (view) => {
      await renderCalendar(view);

      expectBoxSizingIndependentLayout();
    },
  );

  it('should render the event dialog and its resource menu the same', async () => {
    const { user } = await renderCalendar('week');

    // An event without a resource shows the "No resource" marker in the resource select.
    await user.click(screen.getByRole('button', { name: /Check-in/ }));
    await screen.findByRole('dialog');
    expectBoxSizingIndependentLayout();

    await user.click(screen.getByRole('combobox', { name: 'Resource' }));
    await screen.findByRole('listbox');
    expectBoxSizingIndependentLayout();
  });

  it('should render the more events popover the same', async () => {
    const busyDay = Array.from({ length: 8 }, (_, index) =>
      EventBuilder.new()
        .title(`Meeting ${index + 1}`)
        .singleDay(`2025-07-03T${String(8 + index).padStart(2, '0')}:00:00Z`, 30)
        .build(),
    );
    const { user } = await renderCalendar('month', busyDay);

    await user.click(screen.getAllByRole('button', { name: /more/i })[0]);
    await screen.findByRole('presentation');
    expectBoxSizingIndependentLayout();
  });

  it('should render the preferences menu the same', async () => {
    const { user } = await renderCalendar('week');

    await openPreferencesMenu(user);
    expectBoxSizingIndependentLayout();
  });

  it('should render a long error alert the same', () => {
    const store = new EventCalendarStore({ events: [] });
    store.set('errors', [{ code: 'somethingWentWrongError', key: '0' }]);
    render(
      <SchedulerStoreContext.Provider value={store as any}>
        <SharedComponentsStyledContext.Provider
          value={{
            classes: eventCalendarClasses,
            localeText: {
              ...EVENT_CALENDAR_DEFAULT_LOCALE_TEXT,
              somethingWentWrongError:
                'The server could not save the event, because the connection closed before the response arrived. Try again later.',
            },
          }}
        >
          <ErrorContainer />
        </SharedComponentsStyledContext.Provider>
      </SchedulerStoreContext.Provider>,
    );

    expectBoxSizingIndependentLayout();
  });

  it('should render an armed touch event and the editing drawer the same', async () => {
    await emulateTouch();
    await renderSettled(
      <div style={{ height: 700, width: 420 }}>
        <StandaloneCompactDayView events={events} resources={[sport]} />
      </div>,
    );

    // Arming shows the touch resize handles.
    fireEvent.click(screen.getByRole('button', { name: /Standup/ }));
    expectBoxSizingIndependentLayout();

    fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));
    await screen.findByRole('textbox', { name: /Event title/i });
    expectBoxSizingIndependentLayout();
  });
});
