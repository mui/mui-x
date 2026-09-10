import { adapter, EventBuilder, getEventCalendarStateFromParameters } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { processDate } from '../process-date';
import { eventCalendarAgendaSelectors } from './eventCalendarAgendaSelectors';
import { AGENDA_VIEW_DAYS_AMOUNT } from '../constants';
import type { EventCalendarState } from '../use-event-calendar';

describe('eventCalendarEventSelectors', () => {
  describe('baseVisibleDays', () => {
    it('should return AGENDA_VIEW_DAYS_AMOUNT days from the visible date, skipping weekends when hidden', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: adapter.date('2025-07-01', 'default'), // Tuesday
        defaultPreferences: { showWeekends: false },
      });

      const days = eventCalendarAgendaSelectors.baseVisibleDays(state);

      expect(days).to.have.length(9);
      expect(days[0]).to.deep.equal(processDate(adapter.date('2025-07-01Z', 'default'), adapter));
      expect(days[days.length - 1]).to.deep.equal(
        processDate(adapter.date('2025-07-11Z', 'default'), adapter),
      );
    });
  });

  describe('visibleDays', () => {
    it('should return exactly AGENDA_VIEW_DAYS_AMOUNT days and fills occurrences with [] when there are no events and showEmptyDaysInAgenda=true', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: adapter.date('2024-01-01', 'default'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: true,
        },
      });
      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.have.length(AGENDA_VIEW_DAYS_AMOUNT);
      expect(visibleDays).to.equal(eventCalendarAgendaSelectors.baseVisibleDays(state));
    });

    it('should extend forward until it fills AGENDA_VIEW_DAYS_AMOUNT days that contain events when showEmptyDaysInAgenda=false', () => {
      const events = [
        EventBuilder.new().fullDay('2025-01-01Z').build(),
        EventBuilder.new().fullDay('2025-01-03Z').build(),
        EventBuilder.new().fullDay('2025-01-05Z').build(),
        EventBuilder.new().fullDay('2025-01-08Z').build(),
        EventBuilder.new().fullDay('2025-01-09Z').build(),
        EventBuilder.new().fullDay('2025-01-10Z').build(),
        EventBuilder.new().fullDay('2025-01-11Z').build(),
        EventBuilder.new().fullDay('2025-01-13Z').build(),
        EventBuilder.new().fullDay('2025-01-14Z').build(),
        EventBuilder.new().fullDay('2025-01-16Z').build(),
        EventBuilder.new().fullDay('2025-01-18Z').build(),
        EventBuilder.new().fullDay('2025-01-20Z').build(),
        EventBuilder.new().fullDay('2025-01-22Z').build(),
        EventBuilder.new().fullDay('2025-01-24Z').build(),
      ];

      const state = getEventCalendarStateFromParameters({
        events,
        visibleDate: adapter.date('2025-01-01', 'default'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.deep.equal([
        processDate(adapter.date('2025-01-01Z', 'default'), adapter),
        processDate(adapter.date('2025-01-03Z', 'default'), adapter),
        processDate(adapter.date('2025-01-05Z', 'default'), adapter),
        processDate(adapter.date('2025-01-08Z', 'default'), adapter),
        processDate(adapter.date('2025-01-09Z', 'default'), adapter),
        processDate(adapter.date('2025-01-10Z', 'default'), adapter),
        processDate(adapter.date('2025-01-11Z', 'default'), adapter),
        processDate(adapter.date('2025-01-13Z', 'default'), adapter),
        processDate(adapter.date('2025-01-14Z', 'default'), adapter),
        processDate(adapter.date('2025-01-16Z', 'default'), adapter),
        processDate(adapter.date('2025-01-18Z', 'default'), adapter),
        processDate(adapter.date('2025-01-20Z', 'default'), adapter),
      ]);
    });

    it('should respect showWeekends preference when building the day list', () => {
      const events = [
        EventBuilder.new().fullDay('2025-10-03Z').build(), // Fri
        EventBuilder.new().fullDay('2025-10-04Z').build(), // Sat
        EventBuilder.new().fullDay('2025-10-05Z').build(), // Sun
        EventBuilder.new().fullDay('2025-10-06Z').build(), // Mon
        EventBuilder.new().fullDay('2025-10-07Z').build(), // Tue
        EventBuilder.new().fullDay('2025-10-08Z').build(), // Wed
        EventBuilder.new().fullDay('2025-10-09Z').build(), // Thu
        EventBuilder.new().fullDay('2025-10-10Z').build(), // Fri
        EventBuilder.new().fullDay('2025-10-11Z').build(), // Sat
        EventBuilder.new().fullDay('2025-10-12Z').build(), // Sun
        EventBuilder.new().fullDay('2025-10-13Z').build(), // Mon
        EventBuilder.new().fullDay('2025-10-14Z').build(), // Tue
        EventBuilder.new().fullDay('2025-10-15Z').build(), // Wed
        EventBuilder.new().fullDay('2025-10-16Z').build(), // Thu
        EventBuilder.new().fullDay('2025-10-17Z').build(), // Fri
        EventBuilder.new().fullDay('2025-10-18Z').build(), // Sat
        EventBuilder.new().fullDay('2025-10-19Z').build(), // Sun
        EventBuilder.new().fullDay('2025-10-20Z').build(), // Mon
      ];

      const state = getEventCalendarStateFromParameters({
        events,
        visibleDate: adapter.date('2025-10-03', 'default'), // Friday
        defaultPreferences: {
          showWeekends: false,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.deep.equal([
        processDate(adapter.date('2025-10-03Z', 'default'), adapter),
        processDate(adapter.date('2025-10-06Z', 'default'), adapter),
        processDate(adapter.date('2025-10-07Z', 'default'), adapter),
        processDate(adapter.date('2025-10-08Z', 'default'), adapter),
        processDate(adapter.date('2025-10-09Z', 'default'), adapter),
        processDate(adapter.date('2025-10-10Z', 'default'), adapter),
        processDate(adapter.date('2025-10-13Z', 'default'), adapter),
        processDate(adapter.date('2025-10-14Z', 'default'), adapter),
        processDate(adapter.date('2025-10-15Z', 'default'), adapter),
        processDate(adapter.date('2025-10-16Z', 'default'), adapter),
        processDate(adapter.date('2025-10-17Z', 'default'), adapter),
        processDate(adapter.date('2025-10-20Z', 'default'), adapter),
      ]);
    });

    it('should return an empty list when no day in the horizon has events and showEmptyDaysInAgenda=false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: adapter.date('2024-01-01', 'default'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.have.length(0);
    });

    it('should return an empty list when all the events are before the visible date and showEmptyDaysInAgenda=false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().fullDay('2023-12-01Z').build()],
        visibleDate: adapter.date('2024-01-01', 'default'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.have.length(0);
    });

    it('should return AGENDA_VIEW_DAYS_AMOUNT days while loading when no day has events yet and showEmptyDaysInAgenda=false', () => {
      const state: EventCalendarState = {
        ...getEventCalendarStateFromParameters({
          events: [],
          visibleDate: adapter.date('2024-01-01', 'default'),
          defaultPreferences: {
            showWeekends: true,
            showEmptyDaysInAgenda: false,
          },
        }),
        isLoading: true,
      };

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.equal(eventCalendarAgendaSelectors.baseVisibleDays(state));
    });

    it('should keep the days with events while loading when some are already known and showEmptyDaysInAgenda=false', () => {
      const state: EventCalendarState = {
        ...getEventCalendarStateFromParameters({
          events: [
            EventBuilder.new().fullDay('2024-01-01Z').build(),
            EventBuilder.new().fullDay('2024-01-08Z').build(),
          ],
          visibleDate: adapter.date('2024-01-01', 'default'),
          defaultPreferences: {
            showWeekends: true,
            showEmptyDaysInAgenda: false,
          },
        }),
        isLoading: true,
      };

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.deep.equal([
        processDate(adapter.date('2024-01-01Z', 'default'), adapter),
        processDate(adapter.date('2024-01-08Z', 'default'), adapter),
      ]);
    });
  });
});
