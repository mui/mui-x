import * as React from 'react';
import { renderHook } from '@mui/internal-test-utils';
import { adapter } from 'test/utils/scheduler';
import { processDate } from '../process-date';
import { CalendarEvent, SchedulerValidDate } from '../models';
import {
  useAgendaEventOccurrencesGroupedByDay,
  useAgendaEventOccurrencesGroupedByDayOptions,
} from './useAgendaEventOccurrencesGroupedByDay';
import { EventCalendarProvider } from '../event-calendar-provider/EventCalendarProvider';
import { getIdsFromOccurrencesMap } from '../utils/SchedulerStore/tests/utils';
import { AGENDA_VIEW_DAYS_AMOUNT } from '../constants';

describe('useAgendaEventOccurrencesGroupedByDay', () => {
  const createEvent = (
    id: string,
    startISO: string,
    endISO: string,
    extra: Partial<CalendarEvent> = {},
  ): CalendarEvent => ({
    id,
    start: adapter.date(startISO),
    end: adapter.date(endISO),
    title: `Event ${id}`,
    ...extra,
  });

  function testHook({
    events = [],
    visibleDate,
    showWeekends,
    showEmptyDaysInAgenda,
  }: {
    events?: CalendarEvent[];
    visibleDate: SchedulerValidDate;
    showWeekends: boolean;
    showEmptyDaysInAgenda: boolean;
  }): useAgendaEventOccurrencesGroupedByDayOptions.ReturnValue {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EventCalendarProvider
        events={events}
        resources={[]}
        visibleDate={visibleDate}
        preferences={{ showWeekends, showEmptyDaysInAgenda }}
      >
        {children}
      </EventCalendarProvider>
    );

    const { result } = renderHook(() => useAgendaEventOccurrencesGroupedByDay(), { wrapper });
    return result.current;
  }

  it('should return exactly AGENDA_VIEW_DAYS_AMOUNT days and fills occurrences with [] when there are no events and showEmptyDays=true', () => {
    const res = testHook({
      visibleDate: adapter.date('2024-01-01'),
      showWeekends: true,
      showEmptyDaysInAgenda: true,
    });

    expect(res.days).to.have.length(12);
    for (const day of res.days) {
      expect(res.occurrencesMap.get(day.key)).to.deep.equal([]);
    }
  });

  it('should extend forward until it fills AGENDA_VIEW_DAYS_AMOUNT days that contain events when showEmptyDays=false', () => {
    const events: CalendarEvent[] = [
      createEvent('1', '2025-01-01', '2025-01-01'),
      createEvent('2', '2025-01-03', '2025-01-03'),
      createEvent('3', '2025-01-05', '2025-01-05'),
      createEvent('4', '2025-01-08', '2025-01-08'),
      createEvent('5', '2025-01-09', '2025-01-09'),
      createEvent('6', '2025-01-10', '2025-01-10'),
      createEvent('7', '2025-01-11', '2025-01-11'),
      createEvent('8', '2025-01-13', '2025-01-13'),
      createEvent('9', '2025-01-14', '2025-01-14'),
      createEvent('10', '2025-01-16', '2025-01-16'),
      createEvent('11', '2025-01-18', '2025-01-18'),
      createEvent('12', '2025-01-20', '2025-01-20'),
      createEvent('13', '2025-01-22', '2025-01-22'),
      createEvent('14', '2025-01-24', '2025-01-24'),
    ];

    const res = testHook({
      events,
      visibleDate: adapter.date('2025-01-01'),
      showWeekends: true,
      showEmptyDaysInAgenda: false,
    });

    expect(res.days).to.have.length(AGENDA_VIEW_DAYS_AMOUNT);
    const expectedKeys = [
      processDate(adapter.date('2025-01-01'), adapter).key,
      processDate(adapter.date('2025-01-03'), adapter).key,
      processDate(adapter.date('2025-01-05'), adapter).key,
      processDate(adapter.date('2025-01-08'), adapter).key,
      processDate(adapter.date('2025-01-09'), adapter).key,
      processDate(adapter.date('2025-01-10'), adapter).key,
      processDate(adapter.date('2025-01-11'), adapter).key,
      processDate(adapter.date('2025-01-13'), adapter).key,
      processDate(adapter.date('2025-01-14'), adapter).key,
      processDate(adapter.date('2025-01-16'), adapter).key,
      processDate(adapter.date('2025-01-18'), adapter).key,
      processDate(adapter.date('2025-01-20'), adapter).key,
    ];
    expect(res.days.map((day) => day.key)).to.deep.equal(expectedKeys);
    for (const day of res.days) {
      expect((res.occurrencesMap.get(day.key) ?? []).length).to.greaterThan(0);
    }
  });

  it('should respect showWeekends preference when building the day list', () => {
    const events: CalendarEvent[] = [
      createEvent('1', '2025-10-03', '2025-10-03'), // Fri
      createEvent('2', '2025-10-04', '2025-10-04'), // Sat
      createEvent('3', '2025-10-05', '2025-10-05'), // Sun
      createEvent('4', '2025-10-06', '2025-10-06'), // Mon
      createEvent('5', '2025-10-07', '2025-10-07'), // Tue
      createEvent('6', '2025-10-08', '2025-10-08'), // Wed
      createEvent('7', '2025-10-09', '2025-10-09'), // Thu
      createEvent('8', '2025-10-10', '2025-10-10'), // Fri
      createEvent('9', '2025-10-11', '2025-10-11'), // Sat
      createEvent('10', '2025-10-12', '2025-10-12'), // Sun
      createEvent('11', '2025-10-13', '2025-10-13'), // Mon
      createEvent('12', '2025-10-14', '2025-10-14'), // Tue
      createEvent('13', '2025-10-15', '2025-10-15'), // Wed
      createEvent('14', '2025-10-16', '2025-10-16'), // Thu
      createEvent('15', '2025-10-17', '2025-10-17'), // Fri
      createEvent('16', '2025-10-18', '2025-10-18'), // Sat
      createEvent('17', '2025-10-19', '2025-10-19'), // Sun
      createEvent('18', '2025-10-20', '2025-10-20'), // Mon
    ];

    const res = testHook({
      events,
      visibleDate: adapter.date('2025-10-03'), // Friday
      showWeekends: false,
      showEmptyDaysInAgenda: true,
    });
    expect(res.days).to.have.length(12);
    const weekendIds = ['2', '3', '9', '10', '16', '17'];
    const includedIds = getIdsFromOccurrencesMap(res.occurrencesMap);
    for (const id of weekendIds) {
      expect(includedIds).to.not.include(id);
    }
  });
});
