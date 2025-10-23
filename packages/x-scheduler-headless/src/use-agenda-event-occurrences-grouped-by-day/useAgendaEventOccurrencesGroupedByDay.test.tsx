import * as React from 'react';
import { renderHook } from '@mui/internal-test-utils';
import { adapter } from 'test/utils/scheduler';
import { processDate } from '../process-date';
import { CalendarEvent } from '../models';
import {
  useAgendaEventOccurrencesGroupedByDay,
  useAgendaEventOccurrencesGroupedByDayOptions,
} from './useAgendaEventOccurrencesGroupedByDay';
import { EventCalendarProvider } from '../event-calendar-provider/EventCalendarProvider';

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

  function testHook(
    params: useAgendaEventOccurrencesGroupedByDayOptions.Parameters,
    events: CalendarEvent[] = [],
  ) {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <EventCalendarProvider events={events} resources={[]}>
        {children}
      </EventCalendarProvider>
    );

    const { result } = renderHook(() => useAgendaEventOccurrencesGroupedByDay(params), { wrapper });
    return result.current;
  }

  it('should return exactly "amount" days and fills occurrences with [] when there are no events and showEmptyDays=true', () => {
    const res = testHook({
      date: adapter.date('2024-01-01'),
      amount: 4,
      excludeWeekends: false,
      showEmptyDays: true,
    });

    expect(res.days).to.have.length(4);
    for (const day of res.days) {
      expect(res.occurrencesMap.get(day.key)).to.deep.equal([]);
    }
  });

  it('should extend forward until it fills "amount" days that contain events when showEmptyDays=false', () => {
    const events: CalendarEvent[] = [
      createEvent('A', '2024-01-01', '2024-01-01'),
      createEvent('B', '2024-01-03', '2024-01-03'),
      createEvent('C', '2024-01-05', '2024-01-05'),
      createEvent('D', '2024-01-08', '2024-01-08'),
      createEvent('E', '2024-01-09', '2024-01-09'),
    ];

    const res = testHook(
      {
        date: adapter.date('2024-01-01'),
        amount: 3,
        excludeWeekends: false,
        showEmptyDays: false,
      },
      events,
    );

    expect(res.days).to.have.length(3);
    const expectedKeys = [
      processDate(adapter.date('2024-01-01'), adapter).key,
      processDate(adapter.date('2024-01-03'), adapter).key,
      processDate(adapter.date('2024-01-05'), adapter).key,
    ];
    expect(res.days.map((day) => day.key)).to.deep.equal(expectedKeys);
    for (const day of res.days) {
      expect((res.occurrencesMap.get(day.key) ?? []).length).to.be.greaterThan(0);
    }
  });

  it('should respect excludeWeekends when building the day list', () => {
    const events: CalendarEvent[] = [
      createEvent('F', '2025-10-03', '2025-10-03'), // Fri
      createEvent('G', '2025-10-04', '2025-10-04'), // Sat
      createEvent('H', '2025-10-05', '2025-10-05'), // Sun
      createEvent('I', '2025-10-06', '2025-10-06'), // Mon
      createEvent('J', '2025-10-07', '2025-10-07'), // Tue
      createEvent('K', '2025-10-08', '2025-10-08'), // Wed
    ];

    const res = testHook(
      {
        date: adapter.date('2025-10-03'), // Friday
        amount: 4,
        excludeWeekends: true,
        showEmptyDays: true,
      },
      events,
    );

    expect(res.days).to.have.length(4);
    expect(res.occurrencesMap.has(processDate(adapter.date('2025-10-04'), adapter).key)).to.equal(
      false,
    );
    expect(res.occurrencesMap.has(processDate(adapter.date('2025-10-05'), adapter).key)).to.equal(
      false,
    );
  });
});
