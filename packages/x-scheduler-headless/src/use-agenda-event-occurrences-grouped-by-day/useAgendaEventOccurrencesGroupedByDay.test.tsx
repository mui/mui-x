import * as React from 'react';
import { renderHook } from '@mui/internal-test-utils';
import { adapter } from 'test/utils/scheduler';
import { processDate } from '../process-date';
import { SchedulerEvent, SchedulerValidDate } from '../models';
import {
  useAgendaEventOccurrencesGroupedByDay,
  useAgendaEventOccurrencesGroupedByDayOptions,
} from './useAgendaEventOccurrencesGroupedByDay';
import { EventCalendarProvider } from '../event-calendar-provider/EventCalendarProvider';
import { AGENDA_VIEW_DAYS_AMOUNT } from '../constants';

describe('useAgendaEventOccurrencesGroupedByDay', () => {
  const createEvent = (
    id: string,
    startISO: string,
    endISO: string,
    extra: Partial<SchedulerEvent> = {},
  ): SchedulerEvent => ({
    id,
    start: adapter.date(startISO, 'default'),
    end: adapter.date(endISO, 'default'),
    title: `Event ${id}`,
    ...extra,
  });

  function testHook({
    events = [],
    visibleDate,
    showWeekends,
    showEmptyDaysInAgenda,
  }: {
    events?: SchedulerEvent[];
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
      visibleDate: adapter.date('2024-01-01', 'default'),
      showWeekends: true,
      showEmptyDaysInAgenda: true,
    });

    expect(res).to.have.length(12);
    for (const day of res) {
      expect(day.occurrences).to.deep.equal([]);
    }
  });

  it('should extend forward until it fills AGENDA_VIEW_DAYS_AMOUNT days that contain events when showEmptyDays=false', () => {
    const events = [
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
      visibleDate: adapter.date('2025-01-01', 'default'),
      showWeekends: true,
      showEmptyDaysInAgenda: false,
    });

    expect(res).to.have.length(AGENDA_VIEW_DAYS_AMOUNT);
    const expectedKeys = [
      processDate(adapter.date('2025-01-01', 'default'), adapter).key,
      processDate(adapter.date('2025-01-03', 'default'), adapter).key,
      processDate(adapter.date('2025-01-05', 'default'), adapter).key,
      processDate(adapter.date('2025-01-08', 'default'), adapter).key,
      processDate(adapter.date('2025-01-09', 'default'), adapter).key,
      processDate(adapter.date('2025-01-10', 'default'), adapter).key,
      processDate(adapter.date('2025-01-11', 'default'), adapter).key,
      processDate(adapter.date('2025-01-13', 'default'), adapter).key,
      processDate(adapter.date('2025-01-14', 'default'), adapter).key,
      processDate(adapter.date('2025-01-16', 'default'), adapter).key,
      processDate(adapter.date('2025-01-18', 'default'), adapter).key,
      processDate(adapter.date('2025-01-20', 'default'), adapter).key,
    ];
    expect(res.map((day) => day.date.key)).to.deep.equal(expectedKeys);
    for (const day of res) {
      expect(day.occurrences.length).to.greaterThan(0);
    }
  });

  it('should respect showWeekends preference when building the day list', () => {
    const events = [
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
      visibleDate: adapter.date('2025-10-03', 'default'), // Friday
      showWeekends: false,
      showEmptyDaysInAgenda: true,
    });
    expect(res).to.have.length(12);
    const weekendIds = ['2', '3', '9', '10', '16', '17'];
    for (const day of res) {
      const includedIds = day.occurrences.map((occ) => occ.id);
      for (const id of weekendIds) {
        expect(includedIds).to.not.include(id);
      }
    }
  });
});
