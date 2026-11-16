import {
  createDate,
  EventBuilder,
  getEventCalendarStateFromParameters,
  processDay,
} from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';
import { eventCalendarAgendaSelectors } from './eventCalendarAgendaSelectors';
import { AGENDA_VIEW_DAYS_AMOUNT } from '../constants';
import type { EventCalendarState } from '../use-event-calendar';
import { toPlainDate } from '../internals/utils/plain-date-utils/timeZone';

describe('eventCalendarEventSelectors', () => {
  describe('baseVisibleDays', () => {
    it('should return AGENDA_VIEW_DAYS_AMOUNT days from the visible date, skipping weekends when hidden', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: createDate('2025-07-01'), // Tuesday
        defaultPreferences: { showWeekends: false },
      });

      const days = eventCalendarAgendaSelectors.baseVisibleDays(state);

      expect(days).to.have.length(9);
      expect(days[0]).to.deep.equal(processDay(createDate('2025-07-01')));
      expect(days[days.length - 1]).to.deep.equal(processDay(createDate('2025-07-11')));
    });

    it('should skip the weekend of the date locale when weekends are hidden', () => {
      // Saudi Arabia rests on Friday and Saturday.
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: createDate('2025-07-01'), // Tuesday
        dateLocale: 'ar-SA',
        defaultPreferences: { showWeekends: false },
      });

      const days = eventCalendarAgendaSelectors.baseVisibleDays(state);

      expect(days.map((day) => day.key)).to.deep.equal([
        '2025-07-01',
        '2025-07-02',
        '2025-07-03',
        '2025-07-06',
        '2025-07-07',
        '2025-07-08',
        '2025-07-09',
        '2025-07-10',
      ]);
    });
  });

  describe('visibleDays', () => {
    it('should return exactly AGENDA_VIEW_DAYS_AMOUNT days and fills occurrences with [] when there are no events and showEmptyDaysInAgenda=true', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: createDate('2024-01-01'),
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
        visibleDate: createDate('2025-01-01'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.deep.equal([
        processDay(createDate('2025-01-01')),
        processDay(createDate('2025-01-03')),
        processDay(createDate('2025-01-05')),
        processDay(createDate('2025-01-08')),
        processDay(createDate('2025-01-09')),
        processDay(createDate('2025-01-10')),
        processDay(createDate('2025-01-11')),
        processDay(createDate('2025-01-13')),
        processDay(createDate('2025-01-14')),
        processDay(createDate('2025-01-16')),
        processDay(createDate('2025-01-18')),
        processDay(createDate('2025-01-20')),
      ]);
    });

    it('should skip the weekend of the date locale when looking for more days with events', () => {
      // One event per day from Friday, October 3rd to Monday, October 27th, 2025.
      const events = Array.from({ length: 25 }, (_, index) =>
        EventBuilder.new()
          .fullDay(`2025-10-${String(index + 3).padStart(2, '0')}Z`)
          .build(),
      );

      // Saudi Arabia rests on Friday and Saturday.
      const state = getEventCalendarStateFromParameters({
        events,
        visibleDate: createDate('2025-10-03'), // Friday
        dateLocale: 'ar-SA',
        defaultPreferences: {
          showWeekends: false,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays.map((day) => day.key)).to.deep.equal([
        '2025-10-05',
        '2025-10-06',
        '2025-10-07',
        '2025-10-08',
        '2025-10-09',
        '2025-10-12',
        '2025-10-13',
        '2025-10-14',
        '2025-10-15',
        '2025-10-16',
        '2025-10-19',
        '2025-10-20',
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
        visibleDate: createDate('2025-10-03'), // Friday
        defaultPreferences: {
          showWeekends: false,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.deep.equal([
        processDay(createDate('2025-10-03')),
        processDay(createDate('2025-10-06')),
        processDay(createDate('2025-10-07')),
        processDay(createDate('2025-10-08')),
        processDay(createDate('2025-10-09')),
        processDay(createDate('2025-10-10')),
        processDay(createDate('2025-10-13')),
        processDay(createDate('2025-10-14')),
        processDay(createDate('2025-10-15')),
        processDay(createDate('2025-10-16')),
        processDay(createDate('2025-10-17')),
        processDay(createDate('2025-10-20')),
      ]);
    });

    it('should return an empty list when no day in the horizon has events and showEmptyDaysInAgenda=false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: createDate('2024-01-01'),
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
        visibleDate: createDate('2024-01-01'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.have.length(0);
    });

    it('should return an empty list regardless of the loading state when no day has events and showEmptyDaysInAgenda=false', () => {
      const state: EventCalendarState = {
        ...getEventCalendarStateFromParameters({
          events: [],
          visibleDate: createDate('2024-01-01'),
          defaultPreferences: {
            showWeekends: true,
            showEmptyDaysInAgenda: false,
          },
        }),
        isLoading: true,
      };

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.have.length(0);
    });

    it('should scan the days right after the base window when the visible date is a weekend day and weekends are hidden', () => {
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().fullDay('2025-07-17Z').build()], // Thursday, visible date + 12 days
        visibleDate: createDate('2025-07-05'), // Saturday
        defaultPreferences: {
          showWeekends: false,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.deep.equal([processDay(createDate('2025-07-17'))]);
    });

    it('should find an event on the last day of the horizon when showEmptyDaysInAgenda=false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().fullDay('2024-06-28Z').build()], // 2024-01-01 + 179 days
        visibleDate: createDate('2024-01-01'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.deep.equal([processDay(createDate('2024-06-28'))]);
    });

    it('should not list a day twice when a scanned chunk ends on a skipped day', () => {
      // Pacific/Apia skipped December 30th, 2011, the last day of the second chunk.
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().singleDay('2011-12-31T00:00:00Z').build()],
        visibleDate: createDate('2011-12-07T12:00:00', 'Pacific/Apia'),
        displayTimezone: 'Pacific/Apia',
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays.map((day) => day.key)).to.deep.equal(['2011-12-31']);
    });

    it('should not find an event past the horizon when showEmptyDaysInAgenda=false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [EventBuilder.new().fullDay('2024-06-29Z').build()], // 2024-01-01 + 180 days
        visibleDate: createDate('2024-01-01'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: false,
        },
      });

      const visibleDays = eventCalendarAgendaSelectors.visibleDays(state);

      expect(visibleDays).to.have.length(0);
    });
    it('should stop at the horizon when weekends are hidden and showEmptyDaysInAgenda=false', () => {
      const build = (eventDate: string) =>
        getEventCalendarStateFromParameters({
          events: [EventBuilder.new().fullDay(eventDate).build()],
          visibleDate: createDate('2025-07-05'), // Saturday
          defaultPreferences: {
            showWeekends: false,
            showEmptyDaysInAgenda: false,
          },
        });

      // 2025-07-05 + 179 days is a Wednesday, + 180 days a Thursday
      expect(eventCalendarAgendaSelectors.visibleDays(build('2025-12-31Z'))).to.have.length(1);
      expect(eventCalendarAgendaSelectors.visibleDays(build('2026-01-01Z'))).to.have.length(0);
    });
  });

  describe('fetchRange', () => {
    it('should end on the last weekday of the base days when weekends are hidden and showEmptyDaysInAgenda=true', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: createDate('2025-07-01'), // Tuesday, the 12-day window ends on a Saturday
        defaultPreferences: {
          showWeekends: false,
          showEmptyDaysInAgenda: true,
        },
      });

      const range = eventCalendarAgendaSelectors.fetchRange(state);

      expect(range.end.toString()).to.equal('2025-07-11');
    });

    it('should span the base days when showEmptyDaysInAgenda=true', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: createDate('2024-01-01'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: true,
        },
      });

      const range = eventCalendarAgendaSelectors.fetchRange(state);

      expect(range.start.toString()).to.equal('2024-01-01');
      expect(range.end.toString()).to.equal('2024-01-12');
    });

    it('should span the whole horizon when showEmptyDaysInAgenda=false', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: createDate('2024-01-01'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: false,
        },
      });

      const range = eventCalendarAgendaSelectors.fetchRange(state);

      expect(range.start.toString()).to.equal('2024-01-01');
      expect(range.end.toString()).to.equal('2024-06-28');
    });

    it('should not depend on the events or the loading state when showEmptyDaysInAgenda=false', () => {
      const parameters = {
        visibleDate: createDate('2024-01-01'),
        defaultPreferences: {
          showWeekends: true,
          showEmptyDaysInAgenda: false,
        },
      };
      const emptyState = getEventCalendarStateFromParameters({ ...parameters, events: [] });
      const stateWithEvents = getEventCalendarStateFromParameters({
        ...parameters,
        events: [
          EventBuilder.new().fullDay('2024-03-01Z').build(),
          EventBuilder.new().fullDay('2024-04-10Z').build(),
        ],
      });
      const loadingState: EventCalendarState = { ...stateWithEvents, isLoading: true };

      const reference = eventCalendarAgendaSelectors.fetchRange(emptyState);
      for (const state of [stateWithEvents, loadingState]) {
        const range = eventCalendarAgendaSelectors.fetchRange(state);
        expect(range.start.equals(reference.start)).to.equal(true);
        expect(range.end.equals(reference.end)).to.equal(true);
      }
    });
  });
  describe('viewConfig.agenda.dayCount', () => {
    it('should return dayCount days from the visible date', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: createDate('2025-07-01'),
        viewConfig: { agenda: { dayCount: 5 } },
        defaultPreferences: { showWeekends: true },
      });

      const days = eventCalendarAgendaSelectors.baseVisibleDays(state);

      expect(days).to.have.length(5);
      expect(days[0]).to.deep.equal(processDay(createDate('2025-07-01')));
      expect(days[4]).to.deep.equal(processDay(createDate('2025-07-05')));
    });

    it("should return the whole month of the visible date when dayCount is 'month'", () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: createDate('2025-07-15'),
        viewConfig: { agenda: { dayCount: 'month' } },
        defaultPreferences: { showWeekends: true, showEmptyDaysInAgenda: true },
      });

      const days = eventCalendarAgendaSelectors.visibleDays(state);

      expect(days).to.have.length(31);
      expect(days[0]).to.deep.equal(processDay(createDate('2025-07-01')));
      expect(days[30]).to.deep.equal(processDay(createDate('2025-07-31')));
    });

    it("should only keep the days of the month that have events when hiding the empty days in 'month' mode", () => {
      const state = getEventCalendarStateFromParameters({
        events: [
          EventBuilder.new().fullDay('2025-07-03Z').build(),
          EventBuilder.new().fullDay('2025-07-20Z').build(),
          EventBuilder.new().fullDay('2025-08-02Z').build(),
        ],
        visibleDate: createDate('2025-07-15'),
        viewConfig: { agenda: { dayCount: 'month' } },
        defaultPreferences: { showWeekends: true, showEmptyDaysInAgenda: false },
      });

      const days = eventCalendarAgendaSelectors.visibleDays(state);

      expect(days.map((day) => day.key)).to.deep.equal([
        processDay(createDate('2025-07-03')).key,
        processDay(createDate('2025-07-20')).key,
      ]);

      const fetchRange = eventCalendarAgendaSelectors.fetchRange(state);
      expect(fetchRange.start.toString()).to.equal('2025-07-01');
      expect(fetchRange.end.toString()).to.equal('2025-07-31');
    });

    it("should keep every day of the month that has events when hiding the empty days in 'month' mode", () => {
      const occupiedDays = [
        '2025-07-01Z',
        '2025-07-03Z',
        '2025-07-05Z',
        '2025-07-07Z',
        '2025-07-09Z',
        '2025-07-11Z',
        '2025-07-13Z',
        '2025-07-15Z',
        '2025-07-17Z',
        '2025-07-19Z',
        '2025-07-21Z',
        '2025-07-23Z',
        '2025-07-25Z',
        '2025-07-27Z',
        '2025-07-29Z',
      ];
      const state = getEventCalendarStateFromParameters({
        events: [...occupiedDays, '2025-08-02Z'].map((day) =>
          EventBuilder.new().fullDay(day).build(),
        ),
        visibleDate: createDate('2025-07-15'),
        viewConfig: { agenda: { dayCount: 'month' } },
        defaultPreferences: { showWeekends: true, showEmptyDaysInAgenda: false },
      });

      const days = eventCalendarAgendaSelectors.visibleDays(state);

      expect(days.map((day) => day.key)).to.deep.equal(
        occupiedDays.map((day) => processDay(createDate(day)).key),
      );
    });

    it('should stop at dayCount days that have events when hiding the empty days', () => {
      const state = getEventCalendarStateFromParameters({
        events: [
          EventBuilder.new().fullDay('2025-07-02Z').build(),
          EventBuilder.new().fullDay('2025-07-08Z').build(),
          EventBuilder.new().fullDay('2025-07-10Z').build(),
          EventBuilder.new().fullDay('2025-07-15Z').build(),
          EventBuilder.new().fullDay('2025-07-20Z').build(),
          EventBuilder.new().fullDay('2025-07-25Z').build(),
          EventBuilder.new().fullDay('2025-07-28Z').build(),
        ],
        visibleDate: createDate('2025-07-01'),
        viewConfig: { agenda: { dayCount: 5 } },
        defaultPreferences: { showWeekends: true, showEmptyDaysInAgenda: false },
      });

      const days = eventCalendarAgendaSelectors.visibleDays(state);

      expect(days.map((day) => day.key)).to.deep.equal([
        processDay(createDate('2025-07-02')).key,
        processDay(createDate('2025-07-08')).key,
        processDay(createDate('2025-07-10')).key,
        processDay(createDate('2025-07-15')).key,
        processDay(createDate('2025-07-20')).key,
      ]);
    });

    it('should not throw when a short dayCount only covers hidden weekend days', () => {
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate: createDate('2025-07-05'), // Saturday
        viewConfig: { agenda: { dayCount: 2 } },
        defaultPreferences: { showWeekends: false, showEmptyDaysInAgenda: true },
      });

      expect(eventCalendarAgendaSelectors.baseVisibleDays(state)).to.have.length(0);
      const fetchRange = eventCalendarAgendaSelectors.fetchRange(state);
      expect(fetchRange.start.toString()).to.equal('2025-07-05');
      expect(fetchRange.end.toString()).to.equal('2025-07-06');
    });

    it('should fetch at least the displayed days when dayCount exceeds the scan horizon', () => {
      const visibleDate = createDate('2025-01-01');
      const state = getEventCalendarStateFromParameters({
        events: [],
        visibleDate,
        viewConfig: { agenda: { dayCount: 200 } },
        defaultPreferences: { showWeekends: true, showEmptyDaysInAgenda: false },
      });

      const fetchRange = eventCalendarAgendaSelectors.fetchRange(state);

      expect(
        fetchRange.end.equals(toPlainDate(visibleDate.getTime(), 'default').add({ days: 199 })),
      ).to.equal(true);
    });
  });
});
