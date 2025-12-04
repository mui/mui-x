import { adapter, EventBuilder, getEventCalendarStateFromParameters } from 'test/utils/scheduler';
import { processDate } from '../process-date';
import { eventCalendarAgendaSelectors } from './eventCalendarAgendaSelectors';
import { AGENDA_VIEW_DAYS_AMOUNT } from '../constants';

describe('eventCalendarEventSelectors', () => {
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
    });

    it('should extend forward until it fills AGENDA_VIEW_DAYS_AMOUNT days that contain events when showEmptyDaysInAgenda=false', () => {
      const events = [
        EventBuilder.new().fullDay('2025-01-01').build(),
        EventBuilder.new().fullDay('2025-01-03').build(),
        EventBuilder.new().fullDay('2025-01-05').build(),
        EventBuilder.new().fullDay('2025-01-08').build(),
        EventBuilder.new().fullDay('2025-01-09').build(),
        EventBuilder.new().fullDay('2025-01-10').build(),
        EventBuilder.new().fullDay('2025-01-11').build(),
        EventBuilder.new().fullDay('2025-01-13').build(),
        EventBuilder.new().fullDay('2025-01-14').build(),
        EventBuilder.new().fullDay('2025-01-16').build(),
        EventBuilder.new().fullDay('2025-01-18').build(),
        EventBuilder.new().fullDay('2025-01-20').build(),
        EventBuilder.new().fullDay('2025-01-22').build(),
        EventBuilder.new().fullDay('2025-01-24').build(),
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
        processDate(adapter.date('2025-01-01', 'default'), adapter),
        processDate(adapter.date('2025-01-03', 'default'), adapter),
        processDate(adapter.date('2025-01-05', 'default'), adapter),
        processDate(adapter.date('2025-01-08', 'default'), adapter),
        processDate(adapter.date('2025-01-09', 'default'), adapter),
        processDate(adapter.date('2025-01-10', 'default'), adapter),
        processDate(adapter.date('2025-01-11', 'default'), adapter),
        processDate(adapter.date('2025-01-13', 'default'), adapter),
        processDate(adapter.date('2025-01-14', 'default'), adapter),
        processDate(adapter.date('2025-01-16', 'default'), adapter),
        processDate(adapter.date('2025-01-18', 'default'), adapter),
        processDate(adapter.date('2025-01-20', 'default'), adapter),
      ]);
    });

    it('should respect showWeekends preference when building the day list', () => {
      const events = [
        EventBuilder.new().fullDay('2025-10-03').build(), // Fri
        EventBuilder.new().fullDay('2025-10-04').build(), // Sat
        EventBuilder.new().fullDay('2025-10-05').build(), // Sun
        EventBuilder.new().fullDay('2025-10-06').build(), // Mon
        EventBuilder.new().fullDay('2025-10-07').build(), // Tue
        EventBuilder.new().fullDay('2025-10-08').build(), // Wed
        EventBuilder.new().fullDay('2025-10-09').build(), // Thu
        EventBuilder.new().fullDay('2025-10-10').build(), // Fri
        EventBuilder.new().fullDay('2025-10-11').build(), // Sat
        EventBuilder.new().fullDay('2025-10-12').build(), // Sun
        EventBuilder.new().fullDay('2025-10-13').build(), // Mon
        EventBuilder.new().fullDay('2025-10-14').build(), // Tue
        EventBuilder.new().fullDay('2025-10-15').build(), // Wed
        EventBuilder.new().fullDay('2025-10-16').build(), // Thu
        EventBuilder.new().fullDay('2025-10-17').build(), // Fri
        EventBuilder.new().fullDay('2025-10-18').build(), // Sat
        EventBuilder.new().fullDay('2025-10-19').build(), // Sun
        EventBuilder.new().fullDay('2025-10-20').build(), // Mon
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
        processDate(adapter.date('2025-10-03', 'default'), adapter),
        processDate(adapter.date('2025-10-06', 'default'), adapter),
        processDate(adapter.date('2025-10-07', 'default'), adapter),
        processDate(adapter.date('2025-10-08', 'default'), adapter),
        processDate(adapter.date('2025-10-09', 'default'), adapter),
        processDate(adapter.date('2025-10-10', 'default'), adapter),
        processDate(adapter.date('2025-10-13', 'default'), adapter),
        processDate(adapter.date('2025-10-14', 'default'), adapter),
        processDate(adapter.date('2025-10-15', 'default'), adapter),
        processDate(adapter.date('2025-10-16', 'default'), adapter),
        processDate(adapter.date('2025-10-17', 'default'), adapter),
        processDate(adapter.date('2025-10-20', 'default'), adapter),
      ]);
    });
  });
});
